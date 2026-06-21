// ─── Zone definitions ────────────────────────────────────────────
var ZONES = [
    { x1: 500, z1: 2262, x2: 6161, z2: -1374 },
    { x1: 1450, z1: 7635, x2: 1976, z2: 8131 },
];

// ─── Teleport trigger boxes ───────────────────────────────────────
var TELEPORT_BOXES = [
    {
        x1: 3132, y1: -27, z1: 600,
        x2: 3198, y2: -10, z2: 619,
        dest: { x: 1572, y: 84, z: 7942, yaw: -90, pitch: 0 },
    }, 
    {
        x1: 1551, y1: 75, z1: 7953,
        x2: 1574, y2: 89, z2: 7928,
        dest: { x: 3140, y: -25, z: 634, yaw: 45, pitch: 0 },
    },
    // Add more boxes here...
];

var PADDING = 2;
var TICK_CHECK_INTERVAL = 15 * 20;
var BORDER_BUFFER = 10;

// ─── Pre-compute bounds for each zone ────────────────────────────
var COMPUTED_ZONES = ZONES.map(function(z) {
    var minX = Math.min(z.x1, z.x2);
    var maxX = Math.max(z.x1, z.x2);
    var minZ = Math.min(z.z1, z.z2);
    var maxZ = Math.max(z.z1, z.z2);
    return {
        minX: minX,
        maxX: maxX,
        minZ: minZ,
        maxZ: maxZ,
        tpMinX: minX + PADDING,
        tpMaxX: maxX - PADDING,
        tpMinZ: minZ + PADDING,
        tpMaxZ: maxZ - PADDING,
    };
});

// ─── Pre-compute bounds for each teleport box ─────────────────────
var COMPUTED_TP_BOXES = TELEPORT_BOXES.map(function(b) {
    return {
        minX: Math.min(b.x1, b.x2),
        maxX: Math.max(b.x1, b.x2),
        minY: Math.min(b.y1, b.y2),
        maxY: Math.max(b.y1, b.y2),
        minZ: Math.min(b.z1, b.z2),
        maxZ: Math.max(b.z1, b.z2),
        dest: b.dest,
    };
});

// ─── Helper functions ─────────────────────────────────────────────
function isInsideZone(zone, x, z) {
    return x >= zone.minX && x <= zone.maxX && z >= zone.minZ && z <= zone.maxZ;
}

function isInsideAnyZone(x, z) {
    for (var i = 0; i < COMPUTED_ZONES.length; i++) {
        if (isInsideZone(COMPUTED_ZONES[i], x, z)) return true;
    }
    return false;
}

function isNearAnyBorder(x, z) {
    for (var i = 0; i < COMPUTED_ZONES.length; i++) {
        var zone = COMPUTED_ZONES[i];
        if (x < zone.minX + BORDER_BUFFER || x > zone.maxX - BORDER_BUFFER ||
            z < zone.minZ + BORDER_BUFFER || z > zone.maxZ - BORDER_BUFFER) {
            return true;
        }
    }
    return false;
}

function getNearestTeleportPos(x, z) {
    var bestZone = null;
    var bestDist = Infinity;

    for (var i = 0; i < COMPUTED_ZONES.length; i++) {
        var zone = COMPUTED_ZONES[i];
        var cx = Math.max(zone.minX, Math.min(zone.maxX, x));
        var cz = Math.max(zone.minZ, Math.min(zone.maxZ, z));
        var dx = cx - x;
        var dz = cz - z;
        var dist = dx * dx + dz * dz;
        if (dist < bestDist) {
            bestDist = dist;
            bestZone = zone;
        }
    }

    return {
        newX: x < bestZone.minX ? bestZone.tpMinX : x > bestZone.maxX ? bestZone.tpMaxX : x,
        newZ: z < bestZone.minZ ? bestZone.tpMinZ : z > bestZone.maxZ ? bestZone.tpMaxZ : z,
    };
}

function getMatchingTpBox(x, y, z) {
    for (var i = 0; i < COMPUTED_TP_BOXES.length; i++) {
        var box = COMPUTED_TP_BOXES[i];
        if (x >= box.minX && x <= box.maxX &&
            y >= box.minY && y <= box.maxY &&
            z >= box.minZ && z <= box.maxZ) {
            return box;
        }
    }
    return null;
}

function doTeleportWithVehicle(player, vehicle, destX, destY, destZ, yaw, pitch) {
    if (vehicle !== null) {
        vehicle.ejectPassengers();
        vehicle.setPos(destX, destY, destZ);
        player.teleportTo(player.level.dimension, destX, destY, destZ, yaw, pitch);
        player.startRiding(vehicle, true);
    } else {
        player.teleportTo(player.level.dimension, destX, destY, destZ, yaw, pitch);
    }
}

function checkBorder(player) {
    if (!player) return;
    if (player.isCreative() || player.isSpectator()) return;

    var vehicle = player.vehicle;
    // Use vehicle position if mounted, since the vehicle is what's moving
    var x = (vehicle !== null) ? vehicle.x : player.x;
    var z = (vehicle !== null) ? vehicle.z : player.z;
    var y = (vehicle !== null) ? vehicle.y : player.y;

    if (isInsideAnyZone(x, z)) return;

    var pos = getNearestTeleportPos(x, z);

    doTeleportWithVehicle(player, vehicle, pos.newX, y, pos.newZ, player.yaw, player.pitch);
    player.notify("§cYou have reached the world border!");
}

function checkTpBoxes(player) {
    if (!player) return;
    if (player.isCreative() || player.isSpectator()) return;

    var vehicle = player.vehicle;
    // Use vehicle position if mounted, since the vehicle is what's moving
    var x = (vehicle !== null) ? vehicle.x : player.x;
    var y = (vehicle !== null) ? vehicle.y : player.y;
    var z = (vehicle !== null) ? vehicle.z : player.z;

    var box = getMatchingTpBox(x, y, z);
    if (!box) return;

    var d = box.dest;
    var yaw   = (d.yaw   !== undefined) ? d.yaw   : player.yaw;
    var pitch = (d.pitch !== undefined) ? d.pitch : player.pitch;

    doTeleportWithVehicle(player, vehicle, d.x, d.y, d.z, yaw, pitch);
}

// ─── Events ───────────────────────────────────────────────────────
var lastPos = new Map();

PlayerEvents.loggedOut(function(event) {
    lastPos.delete(event.player.username);
});

ServerEvents.tick(function(event) {
    if (event.server.tickCount % TICK_CHECK_INTERVAL !== 0) return;
    event.server.players.forEach(function(player) {
        var vehicle = player.vehicle;
        // Track vehicle position when mounted so movement is detected correctly
        var x = Math.floor((vehicle !== null) ? vehicle.x : player.x);
        var y = Math.floor((vehicle !== null) ? vehicle.y : player.y);
        var z = Math.floor((vehicle !== null) ? vehicle.z : player.z);
        var key = player.username;
        var prev = lastPos.get(key);
        if (prev && prev.x === x && prev.y === y && prev.z === z) return;
        lastPos.set(key, { x: x, y: y, z: z });

        checkTpBoxes(player);

        if (!isNearAnyBorder(x, z)) return;
        checkBorder(player);
    });
});