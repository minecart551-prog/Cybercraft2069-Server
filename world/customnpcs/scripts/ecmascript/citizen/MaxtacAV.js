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

// Simple motion-based movement variables
var AV_SPEED = 0.7; // Customizable speed for descent
var targetX = 0, targetY = 0, targetZ = 0;
var hasSetTarget = false;

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
    
    // Reset state
    hasSpawnedMaxtacs = false;
    hasStartedDescent = false;
    hasFlownUp = false;
    hasSetTarget = false;
    motionX = 0; motionY = 0; motionZ = 0;
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

    // Phase 1: Descent toward the player using setMotion (like FlyingCar1.js)
    if (!hasSpawnedMaxtacs) {
        var targetPlayer = findPlayerByName(npc, targetPlayerName);
        if (targetPlayer == null || !targetPlayer.isAlive()) {
            // Target not found, despawn
            npc.despawn();
            return;
        }

        var targetPos = targetPlayer.getPos();
        var npcPos = npc.getPos();

        // Set the target landing position once (offset ~10 blocks around player at their Y level)
        if (!hasSetTarget) {
            var angle = Math.random() * Math.PI * 2;
            var offsetX = Math.cos(angle) * 10;
            var offsetZ = Math.sin(angle) * 10;
            targetX = targetPos.getX() + offsetX;
            targetY = targetPos.getY();
            targetZ = targetPos.getZ() + offsetZ;
            hasSetTarget = true;
        }

        // Calculate direction vector toward target
        var dx = targetX - npcPos.getX();
        var dy = targetY - npcPos.getY();
        var dz = targetZ - npcPos.getZ();
        var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist > 0.5) {
            // Normalize and apply speed
            var targetMotionX = (dx / dist) * AV_SPEED;
            var targetMotionY = (dy / dist) * AV_SPEED;
            var targetMotionZ = (dz / dist) * AV_SPEED;

            // Smoothly interpolate toward target motion (like FlyingCar1 lerp)
            motionX = motionX + (targetMotionX - motionX) * 0.2;
            motionY = motionY + (targetMotionY - motionY) * 0.2;
            motionZ = motionZ + (targetMotionZ - motionZ) * 0.2;
        } else {
            // Slow down when close
            motionX = motionX * (1 - decay);
            motionY = motionY * (1 - decay);
            motionZ = motionZ * (1 - decay);
        }

        // Apply motion
        npc.setMotionX(motionX);
        npc.setMotionY(motionY);
        npc.setMotionZ(motionZ);

        // Check if fully landed (close enough to target position)
        var flatDist = Math.sqrt(
            Math.pow(npcPos.getX() - targetX, 2) +
            Math.pow(npcPos.getZ() - targetZ, 2)
        );
        var yDiff = Math.abs(npcPos.getY() - targetY);

        if (flatDist < 5 && yDiff < 3) {
            // Stop motion
            motionX = 0; motionY = 0; motionZ = 0;
            npc.setMotionX(0);
            npc.setMotionY(0);
            npc.setMotionZ(0);
            
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
    
    // Phase 2: After spawning, wait then fly up and despawn (use navigateTo for leaving)
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