// ===============================================================
// CYBERPSYCHO - Hostile NPC that hunts players at night
// Spawned by cyberpsycho_spawner.js
// ===============================================================

var targetPlayer = null;
var DESPAWN_DISTANCE = 100;
var LIFETIME_SECONDS = 300; // 5 minutes

// ============================================================================
// AREA CONFIGURATION - Define different stat profiles for different areas
// ============================================================================
var AREA_STATS = {
    "A": {
        name: "Downtown",
        health: 100,
        damage: 8,
        speed: 3.5,
        rangedStrength: 10,
        rangedAccuracy: 60,
        rangedRange: 25,
        rangedDelay: 20,
        skinTexture: "cyberpunkskins:textures/b/b01.png",
        displayName: "Cyberpsycho Alpha"
    },
    "B": {
        name: "Industrial",
        health: 150,
        damage: 12,
        speed: 3.0,
        rangedStrength: 15,
        rangedAccuracy: 70,
        rangedRange: 30,
        rangedDelay: 15,
        skinTexture: "cyberpunkskins:textures/b/b02.png",
        displayName: "Cyberpsycho Beta"
    },
    "C": {
        name: "Slums",
        health: 200,
        damage: 18,
        speed: 2.5,
        rangedStrength: 20,
        rangedAccuracy: 80,
        rangedRange: 35,
        rangedDelay: 10,
        skinTexture: "cyberpunkskins:textures/b/b03.png",
        displayName: "Cyberpsycho Gamma"
    }
};

// ============================================================================
// SPAWN COORDINATES FOR AREAS (for area detection)
// ============================================================================
var AREA_SPAWN_POINTS = {
    "A": [
        { x: 2380, z: 955 },   // Downtown area
        { x: 2400, z: 970 },
        { x: 2360, z: 940 }
    ],
    "B": [
        { x: 2450, z: 900 },   // Industrial area
        { x: 2470, z: 920 },
        { x: 2430, z: 880 }
    ],
    "C": [
        { x: 2500, z: 850 },   // Slums area
        { x: 2520, z: 870 },
        { x: 2480, z: 830 }
    ]
};

var currentArea = null;
var currentStats = null;

function init(e) {
    var npc = e.npc;
    var pos = npc.getPos();
    var spawnX = pos.getX();
    var spawnZ = pos.getZ();
    
    // Detect which area we spawned in
    currentArea = detectArea(spawnX, spawnZ);
    currentStats = AREA_STATS[currentArea] || AREA_STATS["A"];
    
    // Apply stats based on area
    npc.setFaction(17); // Hostile faction
    npc.getAi().setAvoidsWater(true);
    npc.getAi().setRetaliateType(1);
    npc.getStats().setMaxHealth(currentStats.health);
    npc.getStats().setHealthRegen(1);
    npc.getAi().setWalkingSpeed(currentStats.speed);
    
    // Set appearance
    npc.getDisplay().setSkinTexture(currentStats.skinTexture);
    npc.getDisplay().setName(currentStats.displayName);
    
    // Equip with ranged weapon
    var gun = npc.world.createItem("tacz:modern_kinetic_gun", 1);
    gun.getNbt().putString("GunId", "tacz:vector45");
    npc.setMainhandItem(gun);
    npc.getInventory().setProjectile(npc.world.createItem("minecraft:gold_nugget", 1));
    
    // Set ranged combat stats
    npc.getStats().getRanged().setStrength(currentStats.rangedStrength);
    npc.getStats().getRanged().setAccuracy(currentStats.rangedAccuracy);
    npc.getStats().getRanged().setRange(currentStats.rangedRange);
    npc.getStats().getRanged().setDelay(currentStats.rangedDelay, currentStats.rangedDelay);
    npc.getStats().getRanged().setBurstDelay(1);
    npc.getStats().getRanged().setHasGravity(false);
    npc.getStats().getRanged().setSpeed(40);
    npc.getStats().setAggroRange(currentStats.rangedRange);
    npc.getStats().getRanged().setSound(0, "customnpcs:gun.pistol.shot");
    npc.getStats().getRanged().setSound(1, "");
    npc.getStats().getRanged().setSound(2, "tacz:target_block_hit");
    npc.getStats().getRanged().setMeleeRange(4);
    
    // Store birth timestamp for lifetime and despawn checks
    npc.storeddata.put("_birth", "" + Math.floor(Date.now() / 1000));
    npc.storeddata.put("_area", currentArea);
    
    // Scan for nearby players immediately
    scanForTarget(npc);
}

function tick(e) {
    var npc = e.npc;
    var world = npc.getWorld();
    
    // Check lifetime
    var birthStr = npc.storeddata.get("_birth");
    if (birthStr) {
        var birthTime = parseInt(birthStr);
        var now = Math.floor(Date.now() / 1000);
        if (now - birthTime >= LIFETIME_SECONDS) {
            npc.despawn();
            return;
        }
    }
    
    // Get current target
    var currentTarget = npc.getAttackTarget();
    
    // Validate current target
    if (currentTarget) {
        try {
            if (!currentTarget.isAlive()) {
                npc.setAttackTarget(null);
                currentTarget = null;
            } else {
                // Check distance
                var dist = npc.getPos().distanceTo(currentTarget.getPos());
                if (dist > DESPAWN_DISTANCE) {
                    // Player too far, despawn
                    npc.despawn();
                    return;
                }
            }
        } catch (err) {
            npc.setAttackTarget(null);
            currentTarget = null;
        }
    }
    
    // If no target, scan for new target
    if (!currentTarget) {
        scanForTarget(npc);
    }
}

function scanForTarget(npc) {
    var world = npc.getWorld();
    var pos = npc.getPos();
    var scanRange = 50; // Scan range for players
    
    // Get all nearby players
    var nearby = world.getNearbyEntities(pos, scanRange, 1); // 1 = players
    
    var nearestPlayer = null;
    var nearestDist = 99999;
    
    for (var i = 0; i < nearby.length; i++) {
        var player = nearby[i];
        if (!player.isAlive()) continue;
        
        var dist = pos.distanceTo(player.getPos());
        if (dist < nearestDist) {
            nearestDist = dist;
            nearestPlayer = player;
        }
    }
    
    // Set attack target if found
    if (nearestPlayer) {
        npc.setAttackTarget(nearestPlayer);
    }
}

function detectArea(x, z) {
    var closestArea = "A";
    var closestDist = 99999;
    
    // Check each area's spawn points
    for (var area in AREA_SPAWN_POINTS) {
        var points = AREA_SPAWN_POINTS[area];
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            var dist = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(z - point.z, 2));
            if (dist < closestDist) {
                closestDist = dist;
                closestArea = area;
            }
        }
    }
    
    return closestArea;
}

function died(e) {
    var npc = e.npc;
    var area = npc.storeddata.get("_area");
    
    // Optional: Add death effects or loot here
    // For example, spawn particles or drop special items
}

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}