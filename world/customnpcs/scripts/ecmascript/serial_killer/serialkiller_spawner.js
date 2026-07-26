// ===============================================================
// SERIAL KILLER SPAWNER - Scripted Block
// Spawns serial killers near online players at night
// Each night randomly assigns tiers S1-S4 to areas A-D
// ===============================================================

var SPAWNER_TIMER_ID = 1;
var CHECK_INTERVAL = 200; // Check every 10 seconds (200 ticks at 20 TPS)

// ============================================================================
// AREAS - Spawn coordinates per a
// ============================================================================
var AREAS = ["A", "B", "C", "D"];

var SPAWN_COORDINATES = [
    // Area A - Downtown
    { x: 2361, y: -53, z: 146, area: "A" },

    // Area B - Industrial
    { x: 5, y: 7, z: 6, area: "B" },


    // Area C - Slums
    { x: 5, y: 5, z: 5, area: "C" },

    // Area D - Outskirts
    { x: 0, y: 0, z: 0, area: "D" },
];

// ============================================================================
// SAFE ZONES - Players in these zones won't be targeted
// ============================================================================
var SAFE_ZONES = [
    { x: 0, z: 1, radius: 7 }   // Lobby area
];

// ============================================================================
// SPAWN SETTINGS
// ============================================================================
var TIERS = ["S1", "S2", "S3", "S4"];
var TIER_COLORS = {
    "S1": "§b",  // Cyan
    "S2": "§e",  // Yellow
    "S3": "§d",  // Pink/Light Purple
    "S4": "§5"   // Purple
};
var SPAWN_RANGE_MAX = 150;  // Max distance from player to nearest spawn coord (blocks)
var NIGHT_START = 13000;
var NIGHT_END = 23000;
var SPAWN_CHANCE = 0.3;
var SERIALKILLER_NPC_NAME = "SerialKiller";

// ============================================================================
// STATE TRACKING
// ============================================================================
var playerSpawnedTonight = {};
var lastNightCheck = 0;
var nightAssigned = false;

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

        // Spawn at the exact spawn coordinate
        var spawnX = spawnCoord.x;
        var spawnY = spawnCoord.y;
        var spawnZ = spawnCoord.z;

        spawnY = findGroundLevel(world, spawnX, spawnY, spawnZ);

        try {
            world.spawnClone(Math.floor(spawnX), Math.floor(spawnY), Math.floor(spawnZ), 3, SERIALKILLER_NPC_NAME);
            playerSpawnedTonight[uuid] = true;

            // Send tier-colored warning message to the player
            var tier = getTierForArea(spawnCoord.area);
            var color = TIER_COLORS[tier] || "§f";
            player.message("§4§l[!] " + color + tier + " §4§ldetected near you");
        } catch (err) {
            // Spawn failed, skip
        }
    }
}

// ============================================================================
// TIER ASSIGNMENT - Shuffle S1-S4 across areas A-D
// ============================================================================
function assignTiers() {
    var shuffled = TIERS.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    var assignment = {};
    for (var i = 0; i < AREAS.length; i++) {
        assignment[AREAS[i]] = shuffled[i];
    }
    return assignment;
}

// ============================================================================
// GET TIER FOR AREA - Read from stored assignment
// ============================================================================
function getTierForArea(area) {
    try {
        var world = getWorld();
        if (!world) return "S1";
        var sd = world.getStoreddata();
        if (sd.has("serialkiller_tiers")) {
            var assignment = JSON.parse(sd.get("serialkiller_tiers"));
            return assignment[area] || "S1";
        }
    } catch (err) {}
    return "S1";
}

function getWorld() {
    try {
        var block = getSpawnerBlock();
        if (block) return block.getWorld();
    } catch (err) {}
    return null;
}

// ============================================================================
// BROADCAST - Send colored assignment to all players
// ============================================================================
function broadcastAssignment(world, assignment) {
    var msg = "§4§lSerial Killer Area: "
        + "§cA:" + TIER_COLORS[assignment["A"]] + assignment["A"] + "  "
        + "§cB:" + TIER_COLORS[assignment["B"]] + assignment["B"] + "  "
        + "§cC:" + TIER_COLORS[assignment["C"]] + assignment["C"] + "  "
        + "§cD:" + TIER_COLORS[assignment["D"]] + assignment["D"];
    var players = world.getAllPlayers();
    for (var i = 0; i < players.length; i++) {
        players[i].message(msg);
    }
}

// ============================================================================
// STORE ASSIGNMENT - Save to world stored data for serialkiller.js to read
// ============================================================================
function storeAssignment(world, assignment) {
    var sd = world.getStoreddata();
    sd.put("serialkiller_tiers", JSON.stringify(assignment));
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
    // Don't spawn if player is too far from all spawn points
    if (!closestCoord || closestDist > SPAWN_RANGE_MAX) return null;
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
