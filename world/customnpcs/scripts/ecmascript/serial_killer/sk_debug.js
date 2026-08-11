var lastX = null;
var lastY = null;
var lastZ = null;
var stuckTicks = 0;
var STUCK_THRESHOLD = 4;  // 20 ticks (200 MC ticks = 10s) before considered stuck
var FLY_DURATION = 10;      // 10 CNPC ticks = 100 MC ticks = 5 seconds
var flyTimer = 0;
var isFlying = false;
var crawlTickCount = 0;

function init(e) {
    e.npc.say("[DEBUG] NPC spawned!");
    var pos = e.npc.getPos();
    lastX = pos.getX();
    lastY = pos.getY();
    lastZ = pos.getZ();
}

function tick(e) {
    var npc = e.npc;
    var world = npc.getWorld();
    var pos = npc.getPos();
    var x = pos.getX();
    var y = pos.getY();
    var z = pos.getZ();

    // Crawl check — every 1 second (20 ticks)
    crawlTickCount++;
    if (crawlTickCount % 2 === 0) {
        var blocked = isHeadBlocked(npc);
        var animType = npc.getAi().getAnimation();
        if (blocked && animType !== 7) {

            npc.getAi().setAnimation(7);
        } else if (!blocked && animType === 7) {

            npc.getAi().setAnimation(0);
        }
    }

    // If currently flying, count down and switch back when done
    if (isFlying) {
        flyTimer--;
        if (flyTimer <= 0) {
            npc.getAi().setNavigationType(0);
            npc.say("[DEBUG] Stuck resolved, switching back to ground.");
            isFlying = false;
        }
        lastX = x;
        lastY = y;
        lastZ = z;
        return;
    }

    // Check if stuck (position hasn't changed)
    if (lastX !== null && x === lastX && y === lastY && z === lastZ) {
        stuckTicks++;
    } else {
        stuckTicks = 0;
    }

    lastX = x;
    lastY = y;
    lastZ = z;

    // If stuck for too long, switch to flying
    if (stuckTicks >= STUCK_THRESHOLD) {
        npc.getAi().setNavigationType(1);
        flyTimer = FLY_DURATION;
        isFlying = true;
        stuckTicks = 0;
        npc.say("[DEBUG] Stuck detected, switching to fly mode for 5 seconds.");
    }

    // Scan for target
    var currentTarget = npc.getAttackTarget();
    if (currentTarget) {
        try {
            if (!currentTarget.isAlive()) {
                npc.setAttackTarget(null);
                currentTarget = null;
            }
        } catch (err) {
            npc.setAttackTarget(null);
            currentTarget = null;
        }
    }

    if (currentTarget && currentTarget.getType() != 1) {
        npc.setAttackTarget(null);
        currentTarget = null;
    }

    if (!currentTarget) {
        scanForTarget(npc);
    }
}

function scanForTarget(npc) {
    var world = npc.getWorld();
    var pos = npc.getPos();
    var nearby = world.getNearbyEntities(pos, 50, 1);

    var nearestPlayer = null;
    var nearestDist = 99999;

    for (var i = 0; i < nearby.length; i++) {
        var player = nearby[i];
        if (!player.isAlive()) continue;
        var dist = pos.distanceTo(player.getPos());
        if (dist < nearestDist) {
            nearestDist = dist;
            nearestPlayer = player;
        }
    }

    if (nearestPlayer) {
        npc.setAttackTarget(nearestPlayer);
    }
}

function isHeadBlocked(npc) {
    var pos = npc.getPos();
    var world = npc.getWorld();
    var ix = Math.floor(pos.getX());
    var iy = Math.floor(pos.getY());
    var iz = Math.floor(pos.getZ());

    return isSolid(world.getBlock(ix, iy + 1, iz))
        || isSolid(world.getBlock(ix + 1, iy + 1, iz))
        || isSolid(world.getBlock(ix - 1, iy + 1, iz))
        || isSolid(world.getBlock(ix, iy + 1, iz + 1))
        || isSolid(world.getBlock(ix, iy + 1, iz - 1));
}

function isSolid(block) {
    if (!block) return false;
    var name = block.getName();
    return name !== "minecraft:air" && name !== "minecraft:cave_air" && name !== "minecraft:void_air"
        && name.indexOf("water") === -1 && name.indexOf("lava") === -1;
}
