// ===============================================================
// Clone Defender AI
// ===============================================================
// Assign this script to EVERY clone NPC template referenced in
// CLONE_TYPES inside clone_spawner.js. It reads the safe list that
// the spawner stored for this specific NPC, scans its field of view
// for players, ignores anyone on that list, and attacks everyone else.
// ===============================================================

var FOV           = 100;
var SCAN_RANGE    = 25;
var GIVE_UP_RANGE = 40;
var MELEE_RANGE   = 2.5;

var SAFE_LIST_PREFIX = "clonespawner_safelist_";

var safeListCache  = {}; // npcUUID -> array of names
var chasingTargets = {}; // npcUUID -> player entity (keyed per-NPC so multiple clones don't share state)

function init(e) {
    var npc = e.npc;
    npc.getAi().setAvoidsWater(true);
    npc.getAi().setRetaliateType(1);
}

function tick(e) {
    var npc   = e.npc;
    var npcId = npc.getUUID();
    var safeList = getSafeList(npc, npcId);

    var target = chasingTargets[npcId];

    if (!target) {
        var nearby = npc.world.getNearbyEntities(npc.getPos(), SCAN_RANGE, 1); // 1 = players
        for (var i = 0; i < nearby.length; i++) {
            var player = nearby[i];
            if (isSafe(player, safeList)) continue;
            if (CheckFOV(npc, player, FOV) && npc.canSeeEntity(player)) {
                chasingTargets[npcId] = player;
                target = player;
                break;
            }
        }
    }

    if (target) {
        if (!target.isAlive() || isSafe(target, safeList)) {
            delete chasingTargets[npcId];
            return;
        }

        var pos = target.getPos();
        npc.navigateTo(pos.getX(), pos.getY(), pos.getZ(), 10);

        var dist = npc.getPos().distanceTo(pos);
        if (dist > GIVE_UP_RANGE) {
            delete chasingTargets[npcId];
            return;
        }
        if (dist < MELEE_RANGE) {
            npc.setAttackTarget(target);
        }
    }
}

// Optional cleanup: removes the stored safe list once this clone dies,
// if your CustomNPCs version exposes a death/onKilled callback under
// this name. If it doesn't match your API, just delete this function -
// it's a nice-to-have, not required for the rest of the script to work.
function onDeath(e) {
    try {
        var npc = e.npc;
        var npcId = npc.getUUID();
        npc.world.getTempdata().remove(SAFE_LIST_PREFIX + npcId);
        delete safeListCache[npcId];
        delete chasingTargets[npcId];
    } catch (err) {}
}

// ----------------- HELPERS -----------------

function getSafeList(npc, npcId) {
    if (safeListCache[npcId]) return safeListCache[npcId];

    var list = [];
    try {
        var tempData = npc.world.getTempdata();
        var key = SAFE_LIST_PREFIX + npcId;
        if (tempData.has(key)) {
            list = JSON.parse(tempData.get(key));
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
