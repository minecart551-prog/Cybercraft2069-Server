// ===============================================================
// Maxtac - Ground soldier deployed by MaxtacAV
// Attacks players within 30 blocks and players carrying sugar
// Returns to MaxtacAV and despawns when all targets are eliminated
// ===============================================================

var targetPlayerNames = []; // Array of player names to kill
var FOV = 180;
var SCAN_RANGE = 30;
var SUGAR_SCAN_RANGE = 30;
var rewardItem = "coins:coal_coin";
var rewardCount = 16;

function init(e) {
    var npc = e.npc;
    var item = npc.world.createItem(rewardItem, rewardCount);
    
    npc.setFaction(27);
    npc.getAi().setAvoidsWater(true);
    npc.getStats().setMaxHealth(400);
    npc.getStats().setHealthRegen(1);
    npc.getStats().setRespawnType(3);
    npc.getStats().getRanged().setStrength(20);
    npc.getStats().getRanged().setAccuracy(70);
    npc.getAi().setWanderingRange(10);
    npc.getInventory().setDropItem(1, item, 100);
    npc.getInventory().setExp(30, 30);
    
    // Scan for all players within 30 blocks immediately on init
    // This overrides any pre-existing targets from the NPC template
    targetPlayerNames = [];
    try {
        var nearbyPlayers = npc.world.getNearbyEntities(npc.getPos(), SCAN_RANGE, 1); // 1 = players
        for (var i = 0; i < nearbyPlayers.length; i++) {
            var player = nearbyPlayers[i];
            if (player.isAlive()) {
                var pName = player.getName();
                if (targetPlayerNames.indexOf(pName) === -1) {
                    targetPlayerNames.push(pName);
                }
            }
        }
    } catch (err) {}
}

function tick(e) {
    var npc = e.npc;
    var world = npc.getWorld();
    
    // Phase 1: Take sugar from nearby players' inventories immediately
    removeNearbySugar(npc, world);
    
    // Phase 2: Acquire attack target
    var currentTarget = npc.getAttackTarget();
    
    // Check if current target is still valid (alive)
    if (currentTarget) {
        var ctAlive = false;
        try { ctAlive = currentTarget.isAlive(); } catch (err) { ctAlive = false; }
        
        if (!ctAlive) {
            // Target dead - clear it
            npc.setAttackTarget(null);
            currentTarget = null;
        }
    }
    
    // If no current target, scan for new targets
    if (!currentTarget) {
        // First priority: scan for players carrying sugar
        var sugarTarget = findSugarPlayer(npc, world);
        if (sugarTarget != null) {
            npc.setAttackTarget(sugarTarget);
            currentTarget = sugarTarget;
        } else {
            // Second priority: attack any remaining targets from initial scan
            var nearestTarget = findNearestTargetPlayer(npc, world);
            if (nearestTarget != null) {
                npc.setAttackTarget(nearestTarget);
                currentTarget = nearestTarget;
            }
        }
    }
    
    // Phase 3: Check if all targets are dead - return to MaxtacAV
    if (areAllTargetsDead(npc, world)) {
        // Find nearest MaxtacAV to return to
        var av = findNearestMaxtacAV(npc, world);
        if (av != null) {
            var avPos = av.getPos();
            npc.navigateTo(avPos.getX(), avPos.getY(), avPos.getZ(), 10);
            
            // Check if we're close enough to the AV
            var dist = npc.getPos().distanceTo(avPos);
            if (dist < 3) {
                npc.despawn();
            }
        } else {
            // No AV found, just despawn
            npc.despawn();
        }
    }
}

function killed(e) {
    // When this NPC kills another entity, remove dropped sugar items from the ground
    var npc = e.npc;
    npc.executeCommand('kill @e[type=minecraft:item,nbt={Item:{id:"minecraft:sugar"}}]');
}

function removeNearbySugar(npc, world) {
    // Take sugar from ALL nearby players' inventories every tick
    var nearby = world.getNearbyEntities(npc.getPos(), SUGAR_SCAN_RANGE, 1); // 1 = players
    for (var i = 0; i < nearby.length; i++) {
        var player = nearby[i];
        if (!player.isAlive()) continue;
        
        try {
            var inv = player.getInventory();
            var size = inv.getSize();
            var removed = false;
            for (var slot = 0; slot < size; slot++) {
                var item = inv.getSlot(slot);
                if (item != null && item.getName() == "minecraft:sugar") {
                    inv.setSlot(slot, null);
                    removed = true;
                }
            }
            if (removed) {
                player.message("§cMaxtac confiscated your sugar!");
            }
        } catch (err) {}
    }
}

function hasSugar(player) {
    try {
        var sugarItem = player.world.createItem("minecraft:sugar", 1);
        var count = player.getInventory().count(sugarItem, true, true);
        return count > 0;
    } catch (err) {
        return false;
    }
}

function findSugarPlayer(npc, world) {
    var nearby = world.getNearbyEntities(npc.getPos(), SUGAR_SCAN_RANGE, 1); // 1 = players
    for (var i = 0; i < nearby.length; i++) {
        var player = nearby[i];
        if (!player.isAlive()) continue;
        if (!npc.canSeeEntity(player)) continue;
        
        if (hasSugar(player)) {
            // Add them to targets list if not already there
            var pName = player.getName();
            if (targetPlayerNames.indexOf(pName) === -1) {
                targetPlayerNames.push(pName);
            }
            return player;
        }
    }
    return null;
}

function findNearestTargetPlayer(npc, world) {
    var nearest = null;
    var nearestDist = 99999;
    
    for (var t = 0; t < targetPlayerNames.length; t++) {
        var tName = targetPlayerNames[t];
        var player = findPlayerByName(npc, tName);
        if (player == null || !player.isAlive()) continue;
        if (!npc.canSeeEntity(player)) continue;
        
        var dist = npc.getPos().distanceTo(player.getPos());
        if (dist < nearestDist) {
            nearestDist = dist;
            nearest = player;
        }
    }
    return nearest;
}

function areAllTargetsDead(npc, world) {
    for (var t = 0; t < targetPlayerNames.length; t++) {
        var tName = targetPlayerNames[t];
        var player = findPlayerByName(npc, tName);
        if (player != null && player.isAlive()) {
            return false;
        }
    }
    return true;
}

function findNearestMaxtacAV(npc, world) {
    var nearby = world.getNearbyEntities(npc.getPos(), 60, 2); // 2 = ICustomNpc
    var nearest = null;
    var nearestDist = 99999;
    
    for (var i = 0; i < nearby.length; i++) {
        if (nearby[i].getName() === "MaxtacAV" && nearby[i].isAlive()) {
            var dist = npc.getPos().distanceTo(nearby[i].getPos());
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = nearby[i];
            }
        }
    }
    return nearest;
}

function findPlayerByName(npc, name) {
    var players = npc.getWorld().getAllPlayers();
    for (var i = 0; i < players.length; i++) {
        if (players[i].getName() === name) {
            return players[i];
        }
    }
    return null;
}