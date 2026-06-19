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

var safeListCache = {}; // npcUUID -> array of names

function init(e) {
    var npc = e.npc;
    npc.getAi().setRetaliateType(0);
}

function tick(e) {
    var npc      = e.npc;
    var npcId    = npc.getUUID();
    var safeList = getSafeList(npc, npcId);

    var nearby = npc.world.getNearbyEntities(npc.getPos(), SCAN_RANGE, 1); // 1 = players
    for (var i = 0; i < nearby.length; i++) {
        var player = nearby[i];
        if (isSafe(player, safeList)) continue;
        if (CheckFOV(npc, player, FOV) && npc.canSeeEntity(player)) {
            npc.setAttackTarget(player);
            break;
        }
    }
}

// Optional cleanup: removes the stored safe list once this clone dies,
// if your CustomNPCs version exposes a death/onKilled callback under
// this name. If it doesn't match your API, just delete this function -
// it's a nice-to-have, not required for the rest of the script to work.
function onDeath(e) {
    try {
        var npc   = e.npc;
        var npcId = npc.getUUID();
        npc.getStoreddata().removeKey("safelist");
        delete safeListCache[npcId];
    } catch (err) {}
}

// ----------------- HELPERS -----------------

function getSafeList(npc, npcId) {
    if (safeListCache[npcId]) return safeListCache[npcId];

    var list = [];
    try {
        var stored = npc.getStoreddata();
        if (stored.hasKey("safelist")) {
            list = JSON.parse(stored.getString("safelist"));
        }
    } catch (err) {}

    safeListCache[npcId] = list;
    return list;
}

function isSafe(player, safeList) {
    var name = player.getName();
    for (var i = 0; i < safeList.length; i++) {
        if (safeList[i].toLowerCase() === name.toLowerCase()) return true;
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
