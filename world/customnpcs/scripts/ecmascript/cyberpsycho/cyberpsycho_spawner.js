// ===============================================================
// CYBERPSYCHO SPAWNER - Scripted Block
// Spawns cyberpsychos near online players at night
// Each night randomly assigns tiers S1-S4 to areas A-D
// ===============================================================

var SPAWNER_TIMER_ID = 1;
var CHECK_INTERVAL = 200; // Check every 10 seconds (200 ticks at 20 TPS)

// ============================================================================
// AREAS - Spawn coordinates per area
// ============================================================================
var AREAS = ["A", "B", "C", "D"];

var SPAWN_COORDINATES = [
    // Area A - Downtown
    { x: 2380, y: 43, z: 955, area: "A" },
    { x: 2400, y: 43, z: 970, area: "A" },
    { x: 2360, y: 43, z: 940, area: "A" },
    { x: 2390, y: 43, z: 960, area: "A" },
    { x: 2370, y: 43, z: 950, area: "A" },

    // Area B - Industrial
    { x: 2450, y: 43, z: 900, area: "B" },
    { x: 2470, y: 43, z: 920, area: "B" },
    { x: 2430, y: 43, z: 880, area: "B" },
    { x: 2460, y: 43, z: 910, area: "B" },
    { x: 2440, y: 43, z: 890, area: "B" },

    // Area C - Slums
    { x: 2500, y: 43, z: 850, area: "C" },
    { x: 2520, y: 43, z: 870, area: "C" },
    { x: 2480, y: 43, z: 830, area: "C" },
    { x: 2510, y: 43, z: 860, area: "C" },
    { x: 2490, y: 43, z: 840, area: "C" },

    // Area D - Outskirts
    { x: 2350, y: 43, z: 820, area: "D" },
    { x: 2370, y: 43, z: 800, area: "D" },
    { x: 2330, y: 43, z: 840, area: "D" },
    { x: 2360, y: 43, z: 810, area: "D" },
    { x: 2340, y: 43, z: 830, area: "D" }
];

// ============================================================================
// SAFE ZONES - Players in these zones won't be targeted
// ============================================================================
var SAFE_ZONES = [
    { x: 2464, z: 853, radius: 50 },   // Lobby area
    { x: 2374, z: 951, radius: 30 },   // Police spawn
    { x: 2498, z: 903, radius: 30 }    // Criminal spawn
];

// ============================================================================
// SPAWN SETTINGS
// ============================================================================
var TIERS = ["S1", "S2", "S3", "S4"];
var SPAWN_DISTANCE_MIN = 20;
var SPAWN_DISTANCE_MAX = 40;
var NIGHT_START = 13000;
var NIGHT_END = 23000;
var SPAWN_CHANCE = 0.3;
var CYBERPSYCHO_NPC_NAME = "Cyberpsycho";

// ============================================================================
// STATE TRACKING
// ============================================================================
var playerSpawnedTonight = {};
var lastNightCheck = 0;
var nightAssigned = false; // Has the tier assignment happened this night

// ============================================================================
// INITIALIZATION
// ============================================================================
function init(e) {
    var block = e.block;
    block.timers.forceStart(SPAWNER_TIMER_ID, CHECK_INTERVAL, true);
    playerSpawnedTonight = {};
    lastNightCheck = 0;
    nightAssigned = false;
}

// ============================================================================
// TIMER - Main spawn logic
// ============================================================================
function timer(e) {
    if (e.id !== SPAWNER_TIMER_ID) return;

    var block = e.block;
    var world = block.getWorld();

    // Check if it's night time
    if (!isNight(world)) {
        // Reset at dawn
        if (lastNightCheck !== 0) {
            playerSpawnedTonight = {};
            lastNightCheck = 0;
            nightAssigned = false;
        }
        return;
    }

    // New night cycle - assign tiers and broadcast
    var currentTime = world.getTime();
    if (lastNightCheck === 0 || currentTime < NIGHT_START) {
        playerSpawnedTonight = {};
        lastNightCheck = currentTime;
        nightAssigned = false;
    }

    // Assign tiers to areas once per night
    if (!nightAssigned) {
        var assignment = assignTiers();
        broadcastAssignment(world, assignment);
        storeAssignment(world, assignment);
        nightAssigned = true;
    }

    // Get all online players
    var onlinePlayers = world.getAllPlayers();
    if (onlinePlayers.length === 0) return;

    // Process each online player
    for (var i = 0; i < onlinePlayers.length; i++) {
        var player = onlinePlayers[i];
        var uuid = player.getUUID();

        if (playerSpawnedTonight[uuid]) continue;
        if (isInSafeZone(player)) continue;
        if (Math.random() > SPAWN_CHANCE) continue;

        // Find closest spawn coordinate to player
        var spawnCoord = findClosestSpawnPoint(player);
        if (!spawnCoord) continue;

        // Calculate spawn position (offset from spawn coord)
        var angle = Math.random() * Math.PI * 2;
        var distance = SPAWN_DISTANCE_MIN + Math.random() * (SPAWN_DISTANCE_MAX - SPAWN_DISTANCE_MIN);

        var spawnX = spawnCoord.x + Math.cos(angle) * distance;
        var spawnY = spawnCoord.y;
        var spawnZ = spawnCoord.z + Math.sin(angle) * distance;

        spawnY = findGroundLevel(world, spawnX, spawnY, spawnZ);

        try {
            world.spawnClone(Math.floor(spawnX), Math.floor(spawnY), Math.floor(spawnZ), 3, CYBERPSYCHO_NPC_NAME);
            playerSpawnedTonight[uuid] = true;
        } catch (err) {
            // Spawn failed, skip
        }
    }
}

// ============================================================================
// TIER ASSIGNMENT - Shuffle S1-S4 across areas A-D
// ============================================================================
function assignTiers() {
    // Fisher-Yates shuffle of tiers
    var shuffled = TIERS.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    // assignment = { "A": "S2", "B": "S1", "C": "S4", "D": "S3" }
    var assignment = {};
    for (var i = 0; i < AREAS.length; i++) {
        assignment[AREAS[i]] = shuffled[i];
    }
    return assignment;
}

// ============================================================================
// BROADCAST - Send assignment to all players
// ============================================================================
function broadcastAssignment(world, assignment) {
    var msg = "§4§lSerial Killer Area: §c"
        + "A:" + assignment["A"] + "  "
        + "B:" + assignment["B"] + "  "
        + "C:" + assignment["C"] + "  "
        + "D:" + assignment["D"];
    var players = world.getAllPlayers();
    for (var i = 0; i < players.length; i++) {
        players[i].message(msg);
    }
}

// ============================================================================
// STORE ASSIGNMENT - Save to world stored data for cyberpsycho.js to read
// ============================================================================
function storeAssignment(world, assignment) {
    var sd = world.getStoreddata();
    sd.put("cyberpsycho_tiers", JSON.stringify(assignment));
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function isNight(world) {
    var time = world.getTime();
    return time >= NIGHT_START || time <= NIGHT_END;
}

function isInSafeZone(player) {
    var pos = player.getPos();
    var px = pos.getX();
    var pz = pos.getZ();
    for (var i = 0; i < SAFE_ZONES.length; i++) {
        var zone = SAFE_ZONES[i];
        var dist = Math.sqrt(Math.pow(px - zone.x, 2) + Math.pow(pz - zone.z, 2));
        if (dist <= zone.radius) return true;
    }
    return false;
}

function findClosestSpawnPoint(player) {
    var playerPos = player.getPos();
    var px = playerPos.getX();
    var pz = playerPos.getZ();
    var closestCoord = null;
    var closestDist = 99999;
    for (var i = 0; i < SPAWN_COORDINATES.length; i++) {
        var coord = SPAWN_COORDINATES[i];
        var dist = Math.sqrt(Math.pow(px - coord.x, 2) + Math.pow(pz - coord.z, 2));
        if (dist < closestDist) {
            closestDist = dist;
            closestCoord = coord;
        }
    }
    return closestCoord;
}

function findGroundLevel(world, x, y, z) {
    var checkY = Math.floor(y);
    var maxSearch = 20;
    for (var i = 0; i < maxSearch; i++) {
        try {
            var block = world.getBlock(Math.floor(x), checkY, Math.floor(z));
            if (block && block.isSolid()) return checkY + 1;
        } catch (err) {}
        checkY--;
    }
    return Math.floor(y);
}
