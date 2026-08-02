// ===============================================================
// SERIAL KILLER SPAWNER - Scripted Block
// Spawns serial killers near online players at night
// Each night randomly assigns tiers S1-S4 to areas A-D
// ===============================================================

var SPAWNER_TIMER_ID = 1;
var CHECK_INTERVAL = 20;  // 20 CNPC ticks = 200 MC ticks = 10 seconds (CNPC tick = 10 MC ticks)
var SPAWN_WINDOW = 40;    // Time window (ticks) around each scheduled slot to fire

// ============================================================================
// AREAS - Area keys for tier assignment
// ============================================================================
var AREAS = ["A", "B", "C", "D"];

// ============================================================================
// AREA BOUNDS - Used to detect which area an NPC is in for tier assignment
// ============================================================================
var AREA_BOUNDS = {
    "A": { minX: 532, minZ: -1446, maxX: 1821, maxZ: 85 },
    "B": { minX: 1821, minZ: -1405, maxX: 2798, maxZ: -35 },
    "C": { minX: 1866, minZ: -15, maxX: 2719, maxZ: 541 },
    "D": { minX: 1911, minZ: 1135, maxX: 2980, maxZ: 2253 }
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
            // Find random NPC near player
            var npcPos = findRandomNearbyNPC(player, world);
            if (!npcPos) continue;

            var spawnX = npcPos.x;
            var spawnY = npcPos.y;
            var spawnZ = npcPos.z;

            // Determine area from NPC position
            var area = detectArea(spawnX, spawnZ);
            if (!area) continue;

            try {
                world.spawnClone(Math.floor(spawnX), Math.floor(spawnY)+2, Math.floor(spawnZ), 3, SERIALKILLER_NPC_NAME);
                playerSpawnedTonight[uuid] = count + 1;

                var tier = getTierForArea(area);
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
    var msg = "§4§lWatch out for Serial Killers on street at night!\n"
        + "§4§lSerial Killer Area: "
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
        return "§4§lWatch out for Serial Killers on street at night!\n"
            + "§4§lSerial Killer Area: "
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

function detectArea(x, z) {
    for (var area in AREA_BOUNDS) {
        var b = AREA_BOUNDS[area];
        if (x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ) {
            return area;
        }
    }
    return null;
}

function findRandomNearbyNPC(player, world) {
    var pos = player.getPos();
    var px = pos.getX();
    var py = pos.getY();
    var pz = pos.getZ();
    var minRange = 30;
    var maxRange = 120;

    var nearby = world.getNearbyEntities(pos, maxRange, 2); // 2 = NPCs
    if (!nearby || nearby.length === 0) return null;

    var candidates = [];
    for (var i = 0; i < nearby.length; i++) {
        var npc = nearby[i];
        var npcPos = npc.getPos();
        var nx = npcPos.getX();
        var ny = npcPos.getY();
        var nz = npcPos.getZ();

        var dx = px - nx;
        var dy = py - ny;
        var dz = pz - nz;
        var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < minRange || dist > maxRange) continue;

        // Skip NPCs in safe zone
        if (isInSafeZoneNPC(nx, nz)) continue;

        // Skip NPCs outside all defined areas
        if (!detectArea(nx, nz)) continue;

        candidates.push({ x: nx, y: ny, z: nz });
    }

    if (candidates.length === 0) return null;

    return candidates[Math.floor(Math.random() * candidates.length)];
}

function isInSafeZoneNPC(x, z) {
    for (var i = 0; i < SAFE_ZONES.length; i++) {
        var zone = SAFE_ZONES[i];
        var dist = Math.sqrt(Math.pow(x - zone.x, 2) + Math.pow(z - zone.z, 2));
        if (dist <= zone.radius) return true;
    }
    return false;
}
