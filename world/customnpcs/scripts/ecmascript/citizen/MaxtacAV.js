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

// Simple direct motion for descent
var AV_SPEED = 0.7; // Customizable speed for descent
var targetX = 0, targetY = 0, targetZ = 0;
var hasSetTarget = false;

function init(e) {
    var npc = e.npc;
    npc.getDisplay().setHitboxState(1);
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
    
    // Reset state
    hasSpawnedMaxtacs = false;
    hasStartedDescent = false;
    hasFlownUp = false;
    hasSetTarget = false;
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
            targetPlayerName = nearby[0].getName();
        } else {
            npc.despawn();
            return;
        }
    }

    // Phase 1: Descent toward the player using direct setMotion
    if (!hasSpawnedMaxtacs) {
        var targetPlayer = findPlayerByName(npc, targetPlayerName);
        if (targetPlayer == null || !targetPlayer.isAlive()) {
            npc.despawn();
            return;
        }

        var targetPos = targetPlayer.getPos();
        var npcPos = npc.getPos();

        // Set the target landing position once
        if (!hasSetTarget) {
            var angle = Math.random() * Math.PI * 2;
            var offsetX = Math.cos(angle) * 10;
            var offsetZ = Math.sin(angle) * 10;
            targetX = targetPos.getX() + offsetX;
            targetY = targetPos.getY();
            targetZ = targetPos.getZ() + offsetZ;
            hasSetTarget = true;
        }

        // Calculate direction toward target and apply motion directly
        var dx = targetX - npcPos.getX();
        var dy = targetY - npcPos.getY();
        var dz = targetZ - npcPos.getZ();
        var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist > 0.5) {
            npc.setMotionX((dx / dist) * AV_SPEED);
            npc.setMotionY((dy / dist) * AV_SPEED);
            npc.setMotionZ((dz / dist) * AV_SPEED);
        } else {
            npc.setMotionX(0);
            npc.setMotionY(0);
            npc.setMotionZ(0);
        }

        // Check if fully landed
        var flatDist = Math.sqrt(
            Math.pow(npcPos.getX() - targetX, 2) +
            Math.pow(npcPos.getZ() - targetZ, 2)
        );
        var yDiff = Math.abs(npcPos.getY() - targetY);

        if (flatDist < 5 && yDiff < 3) {
            // Stop motion
            npc.setMotionX(0);
            npc.setMotionY(0);
            npc.setMotionZ(0);
            
            // Spawn 5 Maxtac NPCs at AV's exact position
            var avPos = npc.getPos();
            var sx = Math.floor(avPos.getX());
            var sy = Math.floor(avPos.getY());
            var sz = Math.floor(avPos.getZ());
            
            for (var i = 0; i < 5; i++) {
                try {
                    world.spawnClone(sx, sy, sz, 3, "Maxtac");
                } catch (err) {}
            }
            
            hasSpawnedMaxtacs = true;
            npc.say("§cMaxtac unit deployed! Eliminate all targets!");
        }
        return;
    }
    
    // Phase 2: After spawning, fly up and despawn
    if (hasSpawnedMaxtacs && !hasFlownUp) {
        var nearbyNpcs = world.getNearbyEntities(npc.getPos(), 50, 2);
        var maxtacCount = 0;
        for (var i = 0; i < nearbyNpcs.length; i++) {
            if (nearbyNpcs[i].getName() === "Maxtac" && nearbyNpcs[i].isAlive()) {
                maxtacCount++;
            }
        }
        
        if (maxtacCount == 0) {
            var pos = npc.getPos();
            if (flyUpTargetY == null) {
                flyUpTargetY = pos.getY() + 20;
            }
            npc.navigateTo(pos.getX(), flyUpTargetY, pos.getZ(), 5);
            
            if (Math.abs(pos.getY() - flyUpTargetY) < 3) {
                hasFlownUp = true;
                npc.despawn();
            }
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