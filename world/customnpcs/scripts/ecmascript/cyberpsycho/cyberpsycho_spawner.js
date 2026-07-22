// ===============================================================
// CYBERPSYCHO SPAWNER - Scripted Block
// Spawns cyberpsychos near online players at night
// ===============================================================

var SPAWNER_TIMER_ID = 1;
var CHECK_INTERVAL = 200; // Check every 10 seconds (200 ticks at 20 TPS)

// ============================================================================
// SPAWN COORDINATES - List of possible spawn locations
// ============================================================================
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
    { x: 2490, y: 43, z: 840, area: "C" }
];

// ============================================================================
// SAFE ZONES - Players in these zones won't be targeted
// Format: { x: centerX, z: centerZ, radius: radiusInBlocks }
// ============================================================================
var SAFE_ZONES = [
    // Example safe zones (add your actual coordinates later)
    { x: 2464, z: 853, radius: 50 },   // Lobby area
    { x: 2374, z: 951, radius: 30 },   // Police spawn
    { x: 2498, z: 903, radius: 30 }    // Criminal spawn
];

// ============================================================================
// SPAWN SETTINGS
// ============================================================================
var SPAWN_DISTANCE_MIN = 20;   // Minimum distance from player to spawn
var SPAWN_DISTANCE_MAX = 40;   // Maximum distance from player to spawn
var NIGHT_START = 13000;       // Minecraft time when night starts
var NIGHT_END = 23000;         // Minecraft time when night ends
var SPAWN_CHANCE = 0.3;        // 30% chance to spawn each check per player
var CYBERPSYCHO_NPC_NAME = "Cyberpsycho"; // Name of the NPC to spawn

// ============================================================================
// STATE TRACKING
// ============================================================================
var playerSpawnedTonight = {}; // Track which players have been spawned tonight
var lastNightCheck = 0;        // Track last night cycle

// ============================================================================
// INITIALIZATION
// ============================================================================
function init(e) {
    var block = e.block;
    
    // Start the spawner timer
    block.timers.forceStart(SPAWNER_TIMER_ID, CHECK_INTERVAL, true);
    
    // Initialize state
    playerSpawnedTonight = {};
    lastNightCheck = 0;
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
        // Reset spawn tracking at dawn
        if (lastNightCheck !== 0) {
            playerSpawnedTonight = {};
            lastNightCheck = 0;
        }
        return;
    }
    
    // Check if we've moved to a new night cycle
    var currentTime = world.getTime();
    if (lastNightCheck === 0 || currentTime < NIGHT_START) {
        // New night has started, reset tracking
        playerSpawnedTonight = {};
        lastNightCheck = currentTime;
    }
    
    // Get all online players
    var onlinePlayers = world.getAllPlayers();
    if (onlinePlayers.length === 0) return;
    
    // Process each online player
    for (var i = 0; i < onlinePlayers.length; i++) {
        var player = onlinePlayers[i];
        var uuid = player.getUUID();
        
        // Skip if player already had a cyberpsycho spawn tonight
        if (playerSpawnedTonight[uuid]) continue;
        
        // Skip if player is in safe zone
        if (isInSafeZone(player)) continue;
        
        // Random chance to spawn
        if (Math.random() > SPAWN_CHANCE) continue;
        
        // Find closest spawn coordinate to player
        var spawnCoord = findClosestSpawnPoint(player);
        if (!spawnCoord) continue;
        
        // Calculate spawn position (offset from spawn coord)
        var playerPos = player.getPos();
        var angle = Math.random() * Math.PI * 2;
        var distance = SPAWN_DISTANCE_MIN + Math.random() * (SPAWN_DISTANCE_MAX - SPAWN_DISTANCE_MIN);
        
        var spawnX = spawnCoord.x + Math.cos(angle) * distance;
        var spawnY = spawnCoord.y;
        var spawnZ = spawnCoord.z + Math.sin(angle) * distance;
        
        // Ensure spawn Y is at a reasonable height (find ground level)
        spawnY = findGroundLevel(world, spawnX, spawnY, spawnZ);
        
        // Spawn the cyberpsycho
        try {
            world.spawnClone(Math.floor(spawnX), Math.floor(spawnY), Math.floor(spawnZ), 3, CYBERPSYCHO_NPC_NAME);
            
            // Mark this player as spawned tonight
            playerSpawnedTonight[uuid] = true;
            
            // Optional: Send warning message to player
            // player.message("§c§l[WARNING] §fYou feel a hostile presence nearby...");
        } catch (err) {
            // Spawn failed, skip
        }
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if it's currently night time
 */
function isNight(world) {
    var time = world.getTime();
    return time >= NIGHT_START || time <= NIGHT_END;
}

/**
 * Check if a player is in any safe zone
 */
function isInSafeZone(player) {
    var pos = player.getPos();
    var px = pos.getX();
    var pz = pos.getZ();
    
    for (var i = 0; i < SAFE_ZONES.length; i++) {
        var zone = SAFE_ZONES[i];
        var dist = Math.sqrt(Math.pow(px - zone.x, 2) + Math.pow(pz - zone.z, 2));
        if (dist <= zone.radius) {
            return true;
        }
    }
    
    return false;
}

/**
 * Find the closest spawn coordinate to a player
 */
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

/**
 * Find a safe ground level for spawning
 */
function findGroundLevel(world, x, y, z) {
    // Start from the given Y and search downward for solid ground
    var checkY = Math.floor(y);
    var maxSearch = 20; // Search up to 20 blocks down
    
    for (var i = 0; i < maxSearch; i++) {
        try {
            var block = world.getBlock(Math.floor(x), checkY, Math.floor(z));
            if (block && block.isSolid()) {
                // Found solid ground, spawn one block above
                return checkY + 1;
            }
        } catch (err) {
            // Block check failed, continue
        }
        checkY--;
    }
    
    // If no ground found, return original Y
    return Math.floor(y);
}

/**
 * Get the world time
 */
function getWorldTime(world) {
    return world.getTime();
}

/**
 * Format time for debugging
 */
function formatTime(ticks) {
    var hours = Math.floor(ticks / 1000);
    var minutes = Math.floor((ticks % 1000) / 16.67);
    return hours + ":" + (minutes < 10 ? "0" : "") + minutes;
}