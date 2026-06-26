// ===============================================================
// MaxtacAV - Air vehicle that deploys Maxtac ground soldiers
// Spawned by citizenpolice.js when a police NPC is killed by a player
// ===============================================================

var targetPlayerName = null;
var hasSpawnedMaxtacs = false;
var hasStartedDescent = false;
var hasFlownUp = false;
var flyUpTargetY = null;
var tickCounter = 0;
var TICK_TIMEOUT = 2400; // 2 minutes (20 ticks/sec * 120)
var INITIAL_SCAN_RANGE = 50;

function init(e) {
    var npc = e.npc;
    
    // Read killer name from world tempdata
    var tempData = npc.getWorld().getTempdata();
    if (tempData.has("maxtacav_killer")) {
        try {
            targetPlayerName = JSON.parse(tempData.get("maxtacav_killer"));
        } catch (err) {
            targetPlayerName = null;
        }
        // Delete the tempdata key so it doesn't linger
        tempData.remove("maxtacav_killer");
    }
    
    // Set flying navigation type (1 = fly)
    npc.getAi().setNavigationType(1);
    
    // Configure stats
    npc.getStats().setMaxHealth(999);
    
    // Start descending toward target player
    hasSpawnedMaxtacs = false;
    hasStartedDescent = false;
    hasFlownUp = false;
}

function tick(e) {
    var npc = e.npc;
    var world = npc.getWorld();
    
    // Auto-despawn after 2 minutes
    tickCounter++;
    if (tickCounter >= TICK_TIMEOUT) {
        npc.despawn();
        return;
    }
    
    // If we don't have a target player, scan for nearby players
    if (targetPlayerName == null && !hasSpawnedMaxtacs) {
        var nearby = world.getNearbyEntities(npc.getPos(), INITIAL_SCAN_RANGE, 1); // 1 = players
        if (nearby && nearby.length > 0) {
            // Target the nearest player
            targetPlayerName = nearby[0].getName();
        } else {
            // No players found, despawn
            npc.despawn();
            return;
        }
    }
    
    // Phase 1: Descent toward the player
    if (!hasSpawnedMaxtacs) {
        var targetPlayer = findPlayerByName(npc, targetPlayerName);
        if (targetPlayer == null || !targetPlayer.isAlive()) {
            // Target not found, despawn
            npc.despawn();
            return;
        }
        
        var targetPos = targetPlayer.getPos();
        var npcPos = npc.getPos();
        
        // Navigate to a spot ~10 blocks around the player at their Y level
        var angle = Math.random() * Math.PI * 2;
        var offsetX = Math.cos(angle) * 10;
        var offsetZ = Math.sin(angle) * 10;
        var targetX = targetPos.getX() + offsetX;
        var targetY = targetPos.getY();
        var targetZ = targetPos.getZ() + offsetZ;
        
        npc.navigateTo(targetX, targetY, targetZ, 5);
        
        // Wait until fully landed: check both horizontal AND vertical proximity
        var flatDist = Math.sqrt(
            Math.pow(npcPos.getX() - targetX, 2) + 
            Math.pow(npcPos.getZ() - targetZ, 2)
        );
        var yDiff = Math.abs(npcPos.getY() - targetY);
        
        if (flatDist < 5 && yDiff < 3) {
            // Fully landed at player's Y level - spawn 5 Maxtac NPCs at AV's exact position
            var avPos = npc.getPos();
            var sx = Math.floor(avPos.getX());
            var sy = Math.floor(avPos.getY());
            var sz = Math.floor(avPos.getZ());
            
            for (var i = 0; i < 5; i++) {
                try {
                    world.spawnClone(sx, sy, sz, 3, "Maxtac");
                } catch (err) {
                    // Ignore spawn errors for individual units
                }
            }
            
            hasSpawnedMaxtacs = true;
            npc.say("§cMaxtac unit deployed! Eliminate all targets!");
        }
        return;
    }
    
    // Phase 2: After spawning, wait a moment then fly up and despawn
    if (hasSpawnedMaxtacs && !hasFlownUp) {
        // Check if any Maxtac NPCs are still alive nearby
        var nearbyNpcs = world.getNearbyEntities(npc.getPos(), 50, 2); // 2 = ICustomNpc
        var maxtacCount = 0;
        for (var i = 0; i < nearbyNpcs.length; i++) {
            if (nearbyNpcs[i].getName() === "Maxtac" && nearbyNpcs[i].isAlive()) {
                maxtacCount++;
            }
        }
        
        if (maxtacCount == 0) {
            // All Maxtacs have despawned (completed their mission), fly up and despawn
            var pos = npc.getPos();
            // Store the target Y once when first entering this phase
            if (flyUpTargetY == null) {
                flyUpTargetY = pos.getY() + 20;
            }
            npc.navigateTo(pos.getX(), flyUpTargetY, pos.getZ(), 5);
            
            var dist = Math.abs(pos.getY() - flyUpTargetY);
            if (dist < 3) {
                hasFlownUp = true;
                npc.despawn();
            }
        } else {
            // Maxtacs still active - stay in place, hovering
            // Periodically check if all are dead (if they despawned)
        }
    }
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