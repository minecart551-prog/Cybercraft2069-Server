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
        healthRegen: 1,
        combatRegen: 0,
        damage: 8,
        speed: 3.5,
        rangedStrength: 10,
        rangedAccuracy: 60,
        rangedRange: 25,
        rangedDelay: 20,
        skinTexture: "cyberpunkskins:textures/b/b01.png",
        displayName: "Cyberpsycho Alpha",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "tacz:vector45" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:9mm" } },
        drops: [
            { slot: 0, id: "coins:coal_coin", count: 1, chance: 50 },
            { slot: 1, id: "tacz:ammo", count: 10, nbt: { AmmoId: "tacz:9mm" }, chance: 25 },
            { slot: 2, id: "minecraft:ender_pearl", count: 1, chance: 10 }
        ],
        expMin: 10,
        expMax: 20
    },
    "B": {
        name: "Industrial",
        health: 150,
        healthRegen: 2,
        combatRegen: 1,
        damage: 12,
        speed: 3.0,
        rangedStrength: 15,
        rangedAccuracy: 70,
        rangedRange: 30,
        rangedDelay: 15,
        skinTexture: "cyberpunkskins:textures/b/b02.png",
        displayName: "Cyberpsycho Beta",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 30, GunFireMode: "AUTO", GunId: "cyber_armorer:saratoga" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:9mm" } },
        drops: [
            { slot: 0, id: "coins:coal_coin", count: 2, chance: 60 },
            { slot: 1, id: "tacz:ammo", count: 20, nbt: { AmmoId: "tacz:9mm" }, chance: 30 },
            { slot: 2, id: "coins:emerald_coin", count: 1, chance: 10 },
            { slot: 3, id: "tacz:attachment", count: 1, nbt: { AttachmentId: "tacz:sight_sro_dot" }, chance: 5 }
        ],
        expMin: 20,
        expMax: 40
    },
    "C": {
        name: "Slums",
        health: 200,
        healthRegen: 3,
        combatRegen: 2,
        damage: 18,
        speed: 2.5,
        rangedStrength: 20,
        rangedAccuracy: 80,
        rangedRange: 35,
        rangedDelay: 10,
        skinTexture: "cyberpunkskins:textures/b/b03.png",
        displayName: "Cyberpsycho Gamma",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 8, GunFireMode: "SEMI", GunId: "cyber_armorer:m2038_the_headsman" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:12g" } },
        drops: [
            { slot: 0, id: "coins:coal_coin", count: 4, chance: 75 },
            { slot: 1, id: "coins:emerald_coin", count: 1, chance: 20 },
            { slot: 2, id: "tacz:ammo", count: 10, nbt: { AmmoId: "tacz:12g" }, chance: 40 },
            { slot: 3, id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 4, GunFireMode: "SEMI", GunId: "cyber_armorer:carnage" }, chance: 3 },
            { slot: 4, id: "minecraft:ender_pearl", count: 2, chance: 20 },
            { slot: 5, id: "tacz:attachment", count: 1, nbt: { AttachmentId: "tacz:light_extended_mag_1" }, chance: 8 }
        ],
        expMin: 30,
        expMax: 60
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
    npc.getStats().setHealthRegen(currentStats.healthRegen);
    npc.getStats().setCombatRegen(currentStats.combatRegen);
    npc.getAi().setWalkingSpeed(currentStats.speed);
    
    // Set appearance
    npc.getDisplay().setSkinTexture(currentStats.skinTexture);
    npc.getDisplay().setName(currentStats.displayName);
    
    // Equip hand item
    if (currentStats.handItem) {
        var gun = createItemFromConfig(npc, currentStats.handItem);
        npc.setMainhandItem(gun);
    }
    
    // Set projectile
    if (currentStats.projectile) {
        var proj = createItemFromConfig(npc, currentStats.projectile);
        npc.getInventory().setProjectile(proj);
    }
    
    // Set inventory drops
    if (currentStats.drops) {
        for (var i = 0; i < currentStats.drops.length; i++) {
            var drop = currentStats.drops[i];
            var dropItem = createItemFromConfig(npc, drop);
            npc.getInventory().setDropItem(drop.slot, dropItem, drop.chance);
        }
    }
    
    // Set experience drop
    if (currentStats.expMin !== undefined && currentStats.expMax !== undefined) {
        npc.getInventory().setExp(currentStats.expMin, currentStats.expMax);
    }
    
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


// ============================================================================
// SNBT HELPERS - For creating complex items (guns, ammo, armor, etc.)
// ============================================================================
function snbtValue(v) {
    if (v === null || v === undefined) return "0";
    if (typeof v === "string" && v.charAt(0) === "[") return v;
    if (typeof v === "string") return '"' + v.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    if (typeof v === "boolean") return v ? "1b" : "0b";
    if (typeof v === "number") {
        if (v === Math.floor(v)) return String(v);
        return v + "d";
    }
    if (Array.isArray(v)) {
        var parts = [];
        for (var i = 0; i < v.length; i++) parts.push(snbtValue(v[i]));
        return "[" + parts.join(",") + "]";
    }
    if (typeof v === "object") return snbtCompound(v);
    return String(v);
}

function snbtCompound(obj) {
    var parts = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            parts.push(key + ":" + snbtValue(obj[key]));
        }
    }
    return "{" + parts.join(",") + "}";
}

function buildSnbt(cfg) {
    var tagObj = cfg.nbt ? cfg.nbt : {};
    var tag = JSON.parse(JSON.stringify(tagObj));
    var tagParts = [];
    for (var key in tag) {
        if (!tag.hasOwnProperty(key)) continue;
        if (key === "AttributeModifiers") {
            var modParts = [];
            var mods = tag[key];
            for (var m = 0; m < mods.length; m++) {
                modParts.push(snbtCompound(mods[m]));
            }
            tagParts.push("AttributeModifiers:[" + modParts.join(",") + "]");
        } else if (key === "display") {
            var dispParts = [];
            var disp = tag[key];
            for (var dk in disp) {
                if (!disp.hasOwnProperty(dk)) continue;
                if (dk === "Lore") {
                    var loreParts = [];
                    for (var li = 0; li < disp[dk].length; li++) {
                        loreParts.push('"' + String(disp[dk][li]).replace(/\\/g,"\\\\").replace(/"/g,'\\"') + '"');
                    }
                    dispParts.push("Lore:[" + loreParts.join(",") + "]");
                } else {
                    dispParts.push(dk + ":" + snbtValue(disp[dk]));
                }
            }
            tagParts.push("display:{" + dispParts.join(",") + "}");
        } else {
            tagParts.push(key + ":" + snbtValue(tag[key]));
        }
    }
    var count = cfg.count || 1;
    return '{id:"' + cfg.id + '",Count:' + count + 'b,tag:{' + tagParts.join(",") + '}}';
}

function createItemFromConfig(npc, cfg) {
    var api = npc.world;
    var snbt = buildSnbt(cfg);
    return api.createItemFromNbt(api.stringToNbt(snbt));
}