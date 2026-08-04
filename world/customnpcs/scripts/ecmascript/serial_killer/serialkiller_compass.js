// ===============================================================
// SERIAL KILLER COMPASS - Scripted Item
// Points particle line toward nearest Serial Killer (S1-S4)
// ===============================================================

var ItemDmg = 114;

var SK_NAMES = ["S1", "S2", "S3", "S4"];
var SEARCH_RANGE = 200;

function init(t) {
    t.item.setTexture(ItemDmg, "minecraft:compass");
    t.item.setDurabilityShow(false);
    t.item.setItemDamage(ItemDmg);
}

function interact(t) {
    var player = t.player;
    var world = player.world;
    var pos = player.getPos();
    var px = pos.getX();
    var py = pos.getY();
    var pz = pos.getZ();

    var nearest = null;
    var nearestDist = SEARCH_RANGE;
    var nearby = world.getNearbyEntities(pos, SEARCH_RANGE, 2);

    for (var i = 0; i < nearby.length; i++) {
        var npc = nearby[i];
        var displayName = npc.getDisplay().getName();
        for (var j = 0; j < SK_NAMES.length; j++) {
            if (displayName === SK_NAMES[j]) {
                var npcPos = npc.getPos();
                var dx = npcPos.getX() - px;
                var dy = npcPos.getY() - py;
                var dz = npcPos.getZ() - pz;
                var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = npcPos;
                }
                break;
            }
        }
    }

    if (!nearest) return;

    var R = GetCoordRotation(px, pz, nearest.getX(), nearest.getZ());
    var P = GetPitchRotation(px, py, pz, nearest.getX(), nearest.getY(), nearest.getZ());
    var d = FrontVectors(player, R, P, 4, 0);
    ParticleLine(player, px, py, pz, px + d[0], py, pz + d[2], 3, 0, "end_rod", 1);
}

function FrontVectors(entity, dr, dp, distance, mode) {
    if (!mode) mode = 0;
    if (mode == 1) { var angle = dr + entity.getRotation(); var pitch = (-entity.getPitch() + dp) * Math.PI / 180; if (dp == 0) pitch = 0; }
    if (mode == 0) { var angle = dr; var pitch = (dp) * Math.PI / 180; }
    var dx = -Math.sin(angle * Math.PI / 180) * (distance * Math.cos(pitch));
    var dy = Math.sin(pitch) * distance;
    var dz = Math.cos(angle * Math.PI / 180) * (distance * Math.cos(pitch));
    return [dx, dy, dz];
}

function GetCoordRotation(npcX, npcZ, playerX, playerZ) {
    var dx = npcX - playerX;
    var dz = playerZ - npcZ;
    if (dz >= 0) {
        var angle = (Math.atan(dx / dz) * 180 / Math.PI);
        if (angle < 0) { angle = 360 + angle; }
    }
    if (dz < 0) {
        dz = -dz;
        var angle = 180 - (Math.atan(dx / dz) * 180 / Math.PI);
    }
    return angle;
}

function GetPitchRotation(x1, y1, z1, x2, y2, z2) {
    var distance = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((z1 - z2), 2));
    var dy = y2 - y1;
    var pitch = Math.atan(dy / distance) * 180 / Math.PI;
    return pitch;
}

function TrueDistanceCoord(x1, y1, z1, x2, y2, z2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    var dz = z1 - z2;
    var R = Math.pow((dx * dx + dy * dy + dz * dz), 0.5);
    return R;
}

function ParticleLine(entity, x1, y1, z1, x2, y2, z2, Resolution, Speed, Particle, Count, dx, dy, dz, dv) {
    var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();
    if (!dx) { dx = 0; } if (!dy) { dy = 0; } if (!dz) { dz = 0; } if (!dv) { dv = 0; }
    var ParticleTotal = Math.round(TrueDistanceCoord(x1, y1, z1, x2, y2, z2) * Resolution);
    for (var i = 0; i < ParticleTotal; i++) {
        var x = (x1 + (x2 - x1) * (i / ParticleTotal)).toFixed(4);
        var y = (y1 + 1 + (y2 - y1) * (i / ParticleTotal)).toFixed(4);
        var z = (z1 + (z2 - z1) * (i / ParticleTotal)).toFixed(4);
        entity.world.spawnParticle(Particle, x, y, z, dx, dy, dz, dv, Count);
    }
}
