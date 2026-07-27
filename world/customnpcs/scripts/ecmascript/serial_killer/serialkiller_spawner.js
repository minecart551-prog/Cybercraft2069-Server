// ===============================================================
// SERIAL KILLER SPAWNER - Scripted Block
// Spawns serial killers near online players at night
// Each night randomly assigns tiers S1-S4 to areas A-D
// ===============================================================

var SPAWNER_TIMER_ID = 1;
var CHECK_INTERVAL = 20;  // 20 CNPC ticks = 200 MC ticks = 10 seconds (CNPC tick = 10 MC ticks)
var SPAWN_WINDOW = 40;    // Time window (ticks) around each scheduled slot to fire

// ============================================================================
// AREAS - Spawn coordinates per a
// ============================================================================
var AREAS = ["A", "B", "C", "D"];

var SPAWN_COORDINATES = {
    "A": [
        { x: 2361, y: -52, z: 146 }
    ],
    "B": [
        { x: 5, y: 7, z: 6 }
    ],
    "C": [
        { x: 5, y: 5, z: 5 }
    ],
    "D": [
        { x: 0, y: 0, z: 0 }
    ]
};

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
var KILLS_PER_PLAYER = 5;  // Number of serial killers per player per night
var NIGHT_START = 13000;
var NIGHT_END = 23000;
var SERIALKILLER_NPC_NAME = "SerialKiller";

// ============================================================================
// STATE TRACKING
// ============================================================================
var playerSpawnedTonight = {};   // { uuid: count }
var playerSchedule = {};         // { uuid: [tick1, tick2, ...] }
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
            playerSchedule = {};
            lastNightCheck = 0;
            nightAssigned = false;
        }
        return;
    }

    var currentTime = world.getTime();

    // New night cycle - reset state and assign tiers
    if (lastNightCheck === 0 || currentTime < NIGHT_START) {
        playerSpawnedTonight = {};
        playerSchedule = {};
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

    // Build schedule for any player that doesn't have one yet
    var onlinePlayers = world.getAllPlayers();
    for (var i = 0; i < onlinePlayers.length; i++) {
        var uuid = onlinePlayers[i].getUUID();
        if (!playerSchedule[uuid]) {
            playerSchedule[uuid] = generateSpawnTimes(KILLS_PER_PLAYER);
        }
    }

    // Process each online player
    for (var i = 0; i < onlinePlayers.length; i++) {
        var player = onlinePlayers[i];
        var uuid = player.getUUID();
        var count = playerSpawnedTonight[uuid] || 0;

        // Already hit limit for this night
        if (count >= KILLS_PER_PLAYER) continue;
        if (isInSafeZone(player)) continue;

        var schedule = playerSchedule[uuid];
        // No schedule or all slots consumed
        if (!schedule || count >= schedule.length) continue;

        // Check if current time is within window of the next scheduled slot
        var nextSlot = schedule[count];
        if (currentTime >= nextSlot - SPAWN_WINDOW && currentTime <= nextSlot + SPAWN_WINDOW) {
            // Find closest spawn coordinate to player
            var spawnCoord = findClosestSpawnPoint(player);
            if (!spawnCoord) continue;

            var spawnX = spawnCoord.x;
            var spawnY = findGroundLevel(world, spawnX, spawnCoord.y, spawnCoord.z);
            var spawnZ = spawnCoord.z;

            try {
                world.spawnClone(Math.floor(spawnX), Math.floor(spawnY), Math.floor(spawnZ), 3, SERIALKILLER_NPC_NAME);
                playerSpawnedTonight[uuid] = count + 1;

                var tier = getTierForArea(spawnCoord.area);
                var color = TIER_COLORS[tier] || "§f";
                player.message("§4§l[!] " + color + tier + " §4§ldetected near you");
            } catch (err) {
                // Spawn failed, don't count it — will retry next cycle
            }
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
// GENERATE SPAWN TIMES - Random tick positions across the night window
// ============================================================================
function generateSpawnTimes(count) {
    var nightLength = NIGHT_END - NIGHT_START;
    var times = [];
    for (var i = 0; i < count; i++) {
        times.push(NIGHT_START + Math.floor(Math.random() * nightLength));
    }
    times.sort(function(a, b) { return a - b; });
    return times;
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
        + "§fA:" + TIER_COLORS[assignment["A"]] + assignment["A"] + "  "
        + "§fB:" + TIER_COLORS[assignment["B"]] + assignment["B"] + "  "
        + "§fC:" + TIER_COLORS[assignment["C"]] + assignment["C"] + "  "
        + "§fD:" + TIER_COLORS[assignment["D"]] + assignment["D"];
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
    for (var area in SPAWN_COORDINATES) {
        var coords = SPAWN_COORDINATES[area];
        for (var i = 0; i < coords.length; i++) {
            var coord = coords[i];
            var dist = Math.sqrt(Math.pow(px - coord.x, 2) + Math.pow(pz - coord.z, 2));
            if (dist < closestDist) {
                closestDist = dist;
                closestCoord = { x: coord.x, y: coord.y, z: coord.z, area: area };
            }
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
