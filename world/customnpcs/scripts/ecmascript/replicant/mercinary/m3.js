// ===============================================================
// Clone Defender AI
// ===============================================================
// Assign this script to EVERY clone NPC template referenced in
// CLONE_TYPES inside clone_spawner.js. It reads the safe list that
// the spawner stored for this specific NPC, scans its field of view
// for players, ignores anyone on that list, and attacks everyone else.
// ===============================================================
var FOV        = 100;
var SCAN_RANGE = 25;

function init(e) {
    var npc = e.npc;
    npc.getAi().setRetaliateType(0);
}

function tick(e) {
    var npc    = e.npc;
    var nearby = npc.world.getNearbyEntities(npc.getPos(), SCAN_RANGE, 1); // 1 = players

    // Read the safelist fresh every tick. If it's empty (because the spawner
    // GUI hasn't closed yet), don't attack anyone — wait for the data to arrive.
    // The spawner writes the safelist to the clone in customGuiClosed().
    var safeList = null;

    for (var i = 0; i < nearby.length; i++) {
        var player = nearby[i];
        if (!CheckFOV(npc, player, FOV) || !npc.canSeeEntity(player)) continue;
        if (safeList === null) safeList = getSafeList(npc);
        // Empty safelist = attack everyone (no one is safe)
        if (safeList.length > 0 && isSafe(player, safeList)) continue;
        npc.setAttackTarget(player);
        break;
    }

    // Re-check if our current attack target is now on the safelist (player
    // may have updated the list after the clone started attacking).
    var target = npc.getAttackTarget();
    if (target && safeList !== null && safeList.length > 0) {
        if (isSafe(target, safeList)) {
            npc.setAttackTarget(null);
        }
    } else if (target && safeList === null) {
        safeList = getSafeList(npc);
        if (safeList.length > 0 && isSafe(target, safeList)) {
            npc.setAttackTarget(null);
        }
    }

}

// ----------------- HELPERS -----------------

function getSafeList(npc) {
    try {
        var stored = npc.getStoreddata();
        var raw = stored.get("safelist");
        if (raw !== null && raw !== undefined) {
            return JSON.parse(String(raw));
        }
    } catch (err) {}
    return [];
}

function isSafe(player, safeList) {
    var name = player.getName().toLowerCase();
    for (var i = 0; i < safeList.length; i++) {
        if (safeList[i].toLowerCase() === name) return true;
    }
    return false;
}

function CheckFOV(seer, seen, fov) {
    var p = seer.getRotation();
    if (p < 0) p = p + 360;
    var rot = Math.abs(GetPlayerRotation(seer, seen) - p);
    if (rot > 180) rot = Math.abs(rot - 360);
    return (rot < fov / 2);
}

function GetPlayerRotation(npc, player) {
    var dx = npc.getX() - player.getX();
    var dz = player.getZ() - npc.getZ();
    var angle;
    if (dz >= 0) {
        angle = (Math.atan(dx / dz) * 180 / Math.PI);
        if (angle < 0) angle = 360 + angle;
    } else {
        dz = -dz;
        angle = 180 - (Math.atan(dx / dz) * 180 / Math.PI);
    }
    return angle;
}