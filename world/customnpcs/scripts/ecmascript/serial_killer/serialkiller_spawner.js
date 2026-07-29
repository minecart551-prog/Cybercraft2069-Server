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

    ],
    "B": [
        { x: 2685, y: -50, z: -122 },
        { x: 2558, y: -53, z: -54 },
        { x: 2486, y: -53, z: -151 },
        { x: 2419, y: -53, z: -145 },
        { x: 2290, y: -53, z: -100 },
        { x: 2358, y: -53, z: -123 },
        { x: 2208, y: -53, z: -186 },
        { x: 2193, y: -53, z: -74 },
        { x: 2085, y: -53, z: -55 },
        { x: 2042, y: -53, z: -186 },
        { x: 2015, y: -52, z: -130 },
        { x: 2149, y: -52, z: -143 },
        { x: 1962, y: -53, z: -75 },
        { x: 1956, y: -53, z: -195 },
        { x: 1889, y: -53, z: -182 },
        { x: 1872, y: -53, z: -99 },
        { x: 1900, y: -53, z: -271 },
        { x: 1938, y: -53, z: -284 },
        { x: 1927, y: -53, z: -381 },
        { x: 1924, y: -53, z: -479 },
        { x: 2076, y: -53, z: -540 },
        { x: 1965, y: -53, z: -541 },
        { x: 2116, y: -53, z: -456 },
        { x: 2209, y: -53, z: -451 },
        { x: 2274, y: -53, z: -434 },
        { x: 2399, y: -53, z: -433 },
        { x: 2499, y: -53, z: -433 },
        { x: 2548, y: -53, z: -462 },
        { x: 2617, y: -53, z: -503 },
        { x: 2589, y: -53, z: -369 },
        { x: 2595, y: -53, z: -262 },
        { x: 2474, y: -52, z: -320 },
        { x: 2414, y: -52, z: -324 },
        { x: 2341, y: -52, z: -298 },
        { x: 2280, y: -52, z: -330 },
        { x: 2210, y: -53, z: -303 },
        { x: 2149, y: -53, z: -298 },
        { x: 2080, y: -53, z: -313 },
        { x: 2019, y: -53, z: -338 },
        { x: 1959, y: -53, z: -351 },
        { x: 2078, y: -43, z: -561 },
        { x: 1958, y: -53, z: -681 },
        { x: 1930, y: -47, z: -618 },
        { x: 1862, y: -53, z: -627 },
        { x: 1945, y: -53, z: -839 },
        { x: 2018, y: -53, z: -957 },
        { x: 2063, y: -53, z: -1038 },
        { x: 2114, y: -43, z: -959 },
        { x: 2050, y: -39, z: -772 },
        { x: 2135, y: -43, z: -622 },
        { x: 2154, y: -53, z: -730 },
        { x: 2142, y: -43, z: -841 },
        { x: 2194, y: -43, z: -925 },
        { x: 2259, y: -53, z: -979 },
        { x: 2334, y: -53, z: -1012 },
        { x: 2478, y: -53, z: -1001 },
        { x: 2559, y: -53, z: -949 },
        { x: 2612, y: -53, z: -886 },
        { x: 2623, y: -53, z: -737 },
        { x: 2613, y: -53, z: -592 },
        { x: 2544, y: -53, z: -552 },
        { x: 2487, y: -53, z: -519 },
        { x: 2335, y: -53, z: -528 },
        { x: 2250, y: -53, z: -546 },
        { x: 2194, y: -53, z: -622 },
        { x: 2135, y: -43, z: -683 },
        { x: 2249, y: -43, z: -791 },
        { x: 2264, y: -42, z: -836 },
        { x: 2257, y: -43, z: -867 },
        { x: 2339, y: -53, z: -893 },
        { x: 2363, y: -53, z: -916 },
        { x: 2441, y: -53, z: -914 },
        { x: 2511, y: -53, z: -860 },
        { x: 2533, y: -53, z: -783 },
        { x: 2517, y: -53, z: -694 },
        { x: 2444, y: -53, z: -625 },
        { x: 2325, y: -53, z: -631 },
        { x: 2258, y: -43, z: -660 },
        { x: 2233, y: -43, z: -696 }
    ],
    "C": [
        { x: 2591, y: -53, z: 479 },
        { x: 2725, y: -52, z: 473 },
        { x: 2458, y: -53, z: 465 },
        { x: 2321, y: -53, z: 484 },
        { x: 2196, y: -53, z: 493 },
        { x: 2055, y: -53, z: 501 },
        { x: 2032, y: -53, z: 402 },
        { x: 2174, y: -53, z: 428 },
        { x: 2184, y: -53, z: 321 },
        { x: 2033, y: -46, z: 318 },
        { x: 2172, y: -53, z: 303 },
        { x: 2214, y: -53, z: 295 },
        { x: 2302, y: -53, z: 299 },
        { x: 2423, y: -53, z: 275 },
        { x: 2492, y: -53, z: 275 },
        { x: 2584, y: -53, z: 292 },
        { x: 2617, y: -53, z: 252 },
        { x: 2709, y: -53, z: 236 },
        { x: 2719, y: -53, z: 470 },
        { x: 2686, y: -53, z: 68 },
        { x: 2598, y: -52, z: 72 },
        { x: 2479, y: -53, z: 75 },
        { x: 2354, y: -53, z: 55 },
        { x: 2290, y: -53, z: 94 },
        { x: 2207, y: -53, z: 64 },
        { x: 2151, y: -53, z: 63 },
        { x: 2075, y: -53, z: 57 },
        { x: 2039, y: -53, z: 114 },
        { x: 1944, y: -53, z: 257 },
        { x: 2040, y: -53, z: 124 },
        { x: 1944, y: -52, z: 77 },
        { x: 2054, y: -53, z: 7 }
    ],
    "D": [
        { x: 2587, y: -53, z: 2148 },
        { x: 2504, y: -53, z: 2144 },
        { x: 2478, y: -52, z: 2142 },
        { x: 2348, y: -46, z: 2141 },
        { x: 2298, y: -46, z: 2147 },
        { x: 2187, y: -42, z: 2147 },
        { x: 2212, y: -53, z: 2058 },
        { x: 2163, y: -53, z: 2059 },
        { x: 2099, y: -53, z: 2058 },
        { x: 2070, y: -53, z: 2061 },
        { x: 2007, y: -53, z: 2062 },
        { x: 2046, y: -53, z: 2001 },
        { x: 2073, y: -53, z: 1972 },
        { x: 2213, y: -53, z: 2060 },
        { x: 2160, y: -53, z: 2056 },
        { x: 2302, y: -53, z: 2053 },
        { x: 2429, y: -53, z: 2051 },
        { x: 2569, y: -53, z: 2038 },
        { x: 2605, y: -53, z: 2018 },
        { x: 2669, y: -45, z: 2047 },
        { x: 2685, y: -46, z: 1955 },
        { x: 2483, y: -53, z: 1860 },
        { x: 2418, y: -53, z: 1851 },
        { x: 2327, y: -53, z: 1828 },
        { x: 2218, y: -53, z: 1828 },
        { x: 2167, y: -53, z: 1819 },
        { x: 2040, y: -53, z: 1784 },
        { x: 2055, y: -53, z: 1684 },
        { x: 2084, y: -53, z: 1618 },
        { x: 2182, y: -53, z: 1631 },
        { x: 2298, y: -53, z: 1596 },
        { x: 2436, y: -53, z: 1601 },
        { x: 2560, y: -53, z: 1627 },
        { x: 2602, y: -53, z: 1597 },
        { x: 2707, y: -53, z: 1633 },
        { x: 2706, y: -48, z: 1539 },
        { x: 2563, y: -53, z: 1470 },
        { x: 2444, y: -51, z: 1411 },
        { x: 2340, y: -53, z: 1449 },
        { x: 2298, y: -53, z: 1438 },
        { x: 2183, y: -53, z: 1450 },
        { x: 2075, y: -53, z: 1450 },
        { x: 2042, y: -53, z: 1369 },
        { x: 2290, y: -53, z: 1383 },
        { x: 2310, y: -53, z: 1402 },
        { x: 2576, y: -53, z: 1398 },
        { x: 2699, y: -47, z: 1406 },
        { x: 2704, y: -49, z: 1306 },
        { x: 2565, y: -53, z: 1295 },
        { x: 2466, y: -53, z: 1279 },
        { x: 2318, y: -53, z: 1284 },
        { x: 2201, y: -53, z: 1251 },
        { x: 2061, y: -53, z: 1279 },
        { x: 2060, y: -53, z: 1205 },
        { x: 2746, y: -51, z: 1212 }
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
var playersNotifiedTonight = {}; // { uuid: true }
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
            playersNotifiedTonight = {};
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
        playersNotifiedTonight = {};
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

    // Notify players who haven't received tonight's assignment yet
    for (var i = 0; i < onlinePlayers.length; i++) {
        var player = onlinePlayers[i];
        var uuid = player.getUUID();
        if (!playersNotifiedTonight[uuid]) {
            var msg = buildAssignmentMessage(world);
            if (msg) {
                player.message(msg);
                playersNotifiedTonight[uuid] = true;
            }
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
                world.spawnClone(Math.floor(spawnX), Math.floor(spawnY)+2, Math.floor(spawnZ), 3, SERIALKILLER_NPC_NAME);
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
        playersNotifiedTonight[players[i].getUUID()] = true;
    }
}

function buildAssignmentMessage(world) {
    try {
        var sd = world.getStoreddata();
        if (!sd.has("serialkiller_tiers")) return null;
        var assignment = JSON.parse(sd.get("serialkiller_tiers"));
        return "§4§lSerial Killer Area: "
            + "§fA:" + TIER_COLORS[assignment["A"]] + assignment["A"] + "  "
            + "§fB:" + TIER_COLORS[assignment["B"]] + assignment["B"] + "  "
            + "§fC:" + TIER_COLORS[assignment["C"]] + assignment["C"] + "  "
            + "§fD:" + TIER_COLORS[assignment["D"]] + assignment["D"];
    } catch (err) {
        return null;
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
    return time >= NIGHT_START && time <= NIGHT_END;
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
