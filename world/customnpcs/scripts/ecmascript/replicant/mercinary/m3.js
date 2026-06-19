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
    // safeList is read lazily — only once a player passes the FOV+LOS check,
    // so we avoid the stored data read on ticks where nobody is in view.
    var safeList = null;
    for (var i = 0; i < nearby.length; i++) {
        var player = nearby[i];
        if (!CheckFOV(npc, player, FOV) || !npc.canSeeEntity(player)) continue;
        if (safeList === null) safeList = getSafeList(npc);
        if (isSafe(player, safeList)) continue;
        npc.setAttackTarget(player);
        break;
    }

    // DEBUG: show safelist in the NPC's title so you can see what it reads
    try {
        var list = getSafeList(npc);
        npc.getDisplay().setTitle("§7Safe: " + (list.length > 0 ? list.join(", ") : "§cEMPTY"));
    } catch (err) {}
}

// ----------------- HELPERS -----------------

function getSafeList(npc) {
    try {
        var stored = npc.getStoreddata();
        if (stored.hasKey("safelist")) {
            return JSON.parse(stored.getString("safelist"));
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