// ===============================================================
// CYBERPSYCHO - Hostile NPC that hunts players at night
// Spawned by cyberpsycho_spawner.js
// Tier (S1-S4) is looked up from the nightly area assignment
// ===============================================================

var targetPlayer = null;
var DESPAWN_DISTANCE = 100;
var LIFETIME_SECONDS = 300; // 5 minutes



// ============================================================================
// AREA DETECTION - Reference points per area (used to detect which area an NPC spawned in)
// ============================================================================
var AREA_SPAWN_POINTS = {
    "A": [
        { x: 2380, z: 955 },
        { x: 2400, z: 970 },
        { x: 2360, z: 940 }
    ],
    "B": [
        { x: 2450, z: 900 },
        { x: 2470, z: 920 },
        { x: 2430, z: 880 }
    ],
    "C": [
        { x: 2500, z: 850 },
        { x: 2520, z: 870 },
        { x: 2480, z: 830 }
    ],
    "D": [
        { x: 2350, z: 820 },
        { x: 2370, z: 800 },
        { x: 2330, z: 840 }
    ]
};

// ============================================================================
// TIER STATS - Define stat profiles per tier (S1-S4)
// Tiers are randomly assigned to areas each night by cyberpsycho_spawner.js
// ============================================================================
// handItem/drops format: { id: "item:id", count: 1, nbt: { key: value } }
// nbt supports full SNBT: strings, numbers, arrays, nested objects
//   e.g. guns:  { id: "tacz:modern_kinetic_gun", nbt: { GunId: "cyber_armorer:unity", HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI" } }
//   e.g. ammo:  { id: "tacz:ammo", nbt: { AmmoId: "tacz:9mm" } }
// Drops: { slot: 0-8, id, count, chance: 1-100 }
// ============================================================================
var TIER_STATS = {
    "S1": {
        name: "Tier 1",
        health: 80,
        healthRegen: 0,
        combatRegen: 0,
        damage: 6,
        speed: 3.0,
        rangedStrength: 8,
        rangedAccuracy: 50,
        rangedRange: 20,
        rangedDelay: 25,
        skinTexture: "cyberpunkskins:textures/b/b01.png",
        displayName: "Psycho S1",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "tacz:glock_17" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:9mm" } },
        drops: [
            { slot: 0, id: "coins:stone_coin", count: 3, chance: 60 },
            { slot: 1, id: "tacz:ammo", count: 5, nbt: { AmmoId: "tacz:9mm" }, chance: 30 }
        ],
        expMin: 5,
        expMax: 10
    },
    "S2": {
        name: "Tier 2",
        health: 150,
        healthRegen: 1,
        combatRegen: 0,
        damage: 10,
        speed: 3.5,
        rangedStrength: 12,
        rangedAccuracy: 65,
        rangedRange: 25,
        rangedDelay: 18,
        skinTexture: "cyberpunkskins:textures/b/b05.png",
        displayName: "Psycho S2",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 17, GunFireMode: "SEMI", GunId: "cyber_armorer:unity" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:9mm" } },
        drops: [
            { slot: 0, id: "coins:coal_coin", count: 1, chance: 50 },
            { slot: 1, id: "tacz:ammo", count: 10, nbt: { AmmoId: "tacz:9mm" }, chance: 35 },
            { slot: 2, id: "minecraft:ender_pearl", count: 1, chance: 10 }
        ],
        expMin: 15,
        expMax: 25
    },
    "S3": {
        name: "Tier 3",
        health: 250,
        healthRegen: 2,
        combatRegen: 1,
        damage: 16,
        speed: 3.5,
        rangedStrength: 18,
        rangedAccuracy: 75,
        rangedRange: 30,
        rangedDelay: 12,
        skinTexture: "cyberpunkskins:textures/b/b10.png",
        displayName: "Psycho S3",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 30, GunFireMode: "AUTO", GunId: "cyber_armorer:saratoga" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:9mm" } },
        drops: [
            { slot: 0, id: "coins:coal_coin", count: 2, chance: 65 },
            { slot: 1, id: "tacz:ammo", count: 20, nbt: { AmmoId: "tacz:9mm" }, chance: 40 },
            { slot: 2, id: "coins:emerald_coin", count: 1, chance: 8 },
            { slot: 3, id: "tacz:attachment", count: 1, nbt: { AttachmentId: "tacz:sight_sro_dot" }, chance: 5 }
        ],
        expMin: 30,
        expMax: 50
    },
    "S4": {
        name: "Tier 4",
        health: 400,
        healthRegen: 3,
        combatRegen: 2,
        damage: 22,
        speed: 4.0,
        rangedStrength: 25,
        rangedAccuracy: 85,
        rangedRange: 35,
        rangedDelay: 8,
        skinTexture: "cyberpunkskins:textures/b/b20.png",
        displayName: "Psycho S4",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 8, GunFireMode: "SEMI", GunId: "cyber_armorer:m2038_the_headsman" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:12g" } },
        drops: [
            { slot: 0, id: "coins:coal_coin", count: 4, chance: 75 },
            { slot: 1, id: "coins:emerald_coin", count: 1, chance: 20 },
            { slot: 2, id: "tacz:ammo", count: 10, nbt: { AmmoId: "tacz:12g" }, chance: 45 },
            { slot: 3, id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 4, GunFireMode: "SEMI", GunId: "cyber_armorer:carnage" }, chance: 3 },
            { slot: 4, id: "minecraft:ender_pearl", count: 2, chance: 20 },
            { slot: 5, id: "tacz:attachment", count: 1, nbt: { AttachmentId: "tacz:light_extended_mag_1" }, chance: 8 }
        ],
        expMin: 50,
        expMax: 80
    }
};

var currentArea = null;
var currentTier = null;
var currentStats = null;

function init(e) {
    var npc = e.npc;
    var pos = npc.getPos();
    var spawnX = pos.getX();
    var spawnZ = pos.getZ();

    // Detect which area we spawned in
    currentArea = detectArea(spawnX, spawnZ);

    // Read the nightly tier assignment from world stored data
    var tier = "S1"; // fallback default
    try {
        var sd = npc.getWorld().getStoreddata();
        if (sd.has("cyberpsycho_tiers")) {
            var assignment = JSON.parse(sd.get("cyberpsycho_tiers"));
            tier = assignment[currentArea] || "S1";
        }
    } catch (err) {}
    currentTier = tier;

    // Look up tier stats
    currentStats = TIER_STATS[currentTier] || TIER_STATS["S1"];

    // Apply stats based on tier
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

    // Store birth timestamp and area for lifetime/despawn checks
    npc.storeddata.put("_birth", "" + Math.floor(Date.now() / 1000));
    npc.storeddata.put("_area", currentArea);
    npc.storeddata.put("_tier", currentTier);

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
                var dist = npc.getPos().distanceTo(currentTarget.getPos());
                if (dist > DESPAWN_DISTANCE) {
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
    var scanRange = 50;

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

    if (nearestPlayer) {
        npc.setAttackTarget(nearestPlayer);
    }
}

function detectArea(x, z) {
    var closestArea = "A";
    var closestDist = 99999;

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
    var tier = npc.storeddata.get("_tier");
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