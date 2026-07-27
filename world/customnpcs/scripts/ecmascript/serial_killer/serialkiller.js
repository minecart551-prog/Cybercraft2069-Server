// ===============================================================
// SERIAL KILLER - Hostile NPC that hunts players at night
// Spawned by serialkiller_spawner.js
// Tier (S1-S4) is looked up from the nightly area assignment
// ===============================================================

var targetPlayer = null;
var DESPAWN_DISTANCE = 100;
var LIFETIME_SECONDS = 300; // 5 minutes
var EXCEPTIONS = ["minecraft:netherite_sword", "tacz:modern_kinetic_gun"];



// ============================================================================
// AREA DETECTION - Bounding boxes per area (minX, minZ, maxX, maxZ)
// ============================================================================
var AREA_BOUNDS = {
    "A": { minX: 1911, minZ: 1135, maxX: 2980, maxZ: 2253 },
    "B": { minX: 1866, minZ: -15, maxX: 2719, maxZ: 541 },
    "C": { minX: 1821, minZ: -1405, maxX: 2798, maxZ: -35 },
    "D": { minX: 532, minZ: -1446, maxX: 1821, maxZ: 85 }
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
        name: "Tier 4",
        health: 200,
        healthRegen: 3,
        combatRegen: 3,
        speed: 6.0,
        rangedStrength: 33,
        rangedAccuracy: 95,
        rangedRange: 100,
        rangedDelay: 15,
        skinTexture: "cyberpunkskins:textures/technoviking.png",
        displayName: "S4",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "cyber_armorer:unity_cheetah" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:9mm" } },
        drops: [
            { slot: 1, id: "tacz:ammo", count: 20, nbt: { AmmoId: "tacz:9mm" }, chance: 60 },
            { slot: 3, id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "cyber_armorer:unity_cheetah" }, chance: 10 },
            { slot: 6, snbt: '{id:"minecraft:diamond_helmet",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:18.0,Operation:0,Name:"generic.armor",UUID:"[I;472918365,-183756592,938475610,-561029384]",AttributeName:"generic.armor",Slot:"head"}]}}', chance: 8 },
            { slot: 7, snbt: '{id:"minecraft:diamond_chestplate",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:39.0,Operation:0,Name:"generic.armor",UUID:"[I;-609243745,817364920,-274918365,193746582]",AttributeName:"generic.armor",Slot:"chest"}]}}', chance: 5 },
            { slot: 8, snbt: '{id:"minecraft:diamond_leggings",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:25.0,Operation:0,Name:"generic.armor",UUID:"[I;358474619,-920183746,647382915,-183746590]",AttributeName:"generic.armor",Slot:"legs"}]}}', chance: 6 },
            { slot: 9, snbt: '{id:"minecraft:diamond_boots",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:18.0,Operation:0,Name:"generic.armor",UUID:"[I;-847362915,244918375,-519283746,736491820]",AttributeName:"generic.armor",Slot:"feet"}]}}', chance: 8 }
        ],
        expMin: 8,
        expMax: 8
    },
    "S2": {
        name: "Tier 4",
        health: 200,
        healthRegen: 3,
        combatRegen: 3,
        speed: 6.0,
        rangedStrength: 33,
        rangedAccuracy: 95,
        rangedRange: 100,
        rangedDelay: 15,
        skinTexture: "cyberpunkskins:textures/technoviking.png",
        displayName: "S4",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "cyber_armorer:unity_cheetah" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:9mm" } },
        drops: [
            { slot: 1, id: "tacz:ammo", count: 20, nbt: { AmmoId: "tacz:9mm" }, chance: 60 },
            { slot: 3, id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "cyber_armorer:unity_cheetah" }, chance: 10 },
            { slot: 6, snbt: '{id:"minecraft:diamond_helmet",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:18.0,Operation:0,Name:"generic.armor",UUID:"[I;472918365,-183756592,938475610,-561029384]",AttributeName:"generic.armor",Slot:"head"}]}}', chance: 8 },
            { slot: 7, snbt: '{id:"minecraft:diamond_chestplate",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:39.0,Operation:0,Name:"generic.armor",UUID:"[I;-609243745,817364920,-274918365,193746582]",AttributeName:"generic.armor",Slot:"chest"}]}}', chance: 5 },
            { slot: 8, snbt: '{id:"minecraft:diamond_leggings",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:25.0,Operation:0,Name:"generic.armor",UUID:"[I;358474619,-920183746,647382915,-183746590]",AttributeName:"generic.armor",Slot:"legs"}]}}', chance: 6 },
            { slot: 9, snbt: '{id:"minecraft:diamond_boots",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:18.0,Operation:0,Name:"generic.armor",UUID:"[I;-847362915,244918375,-519283746,736491820]",AttributeName:"generic.armor",Slot:"feet"}]}}', chance: 8 }
        ],
        expMin: 8,
        expMax: 8
    },
    "S3": {
        name: "Tier 4",
        health: 200,
        healthRegen: 3,
        combatRegen: 3,
        speed: 6.0,
        rangedStrength: 33,
        rangedAccuracy: 95,
        rangedRange: 100,
        rangedDelay: 15,
        skinTexture: "cyberpunkskins:textures/technoviking.png",
        displayName: "S4",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "cyber_armorer:unity_cheetah" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:9mm" } },
        drops: [
            { slot: 1, id: "tacz:ammo", count: 20, nbt: { AmmoId: "tacz:9mm" }, chance: 60 },
            { slot: 3, id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "cyber_armorer:unity_cheetah" }, chance: 10 },
            { slot: 6, snbt: '{id:"minecraft:diamond_helmet",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:18.0,Operation:0,Name:"generic.armor",UUID:"[I;472918365,-183756592,938475610,-561029384]",AttributeName:"generic.armor",Slot:"head"}]}}', chance: 8 },
            { slot: 7, snbt: '{id:"minecraft:diamond_chestplate",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:39.0,Operation:0,Name:"generic.armor",UUID:"[I;-609243745,817364920,-274918365,193746582]",AttributeName:"generic.armor",Slot:"chest"}]}}', chance: 5 },
            { slot: 8, snbt: '{id:"minecraft:diamond_leggings",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:25.0,Operation:0,Name:"generic.armor",UUID:"[I;358474619,-920183746,647382915,-183746590]",AttributeName:"generic.armor",Slot:"legs"}]}}', chance: 6 },
            { slot: 9, snbt: '{id:"minecraft:diamond_boots",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:18.0,Operation:0,Name:"generic.armor",UUID:"[I;-847362915,244918375,-519283746,736491820]",AttributeName:"generic.armor",Slot:"feet"}]}}', chance: 8 }
        ],
        expMin: 8,
        expMax: 8
    },
    "S4": {
        name: "Tier 4",
        health: 200,
        healthRegen: 3,
        combatRegen: 3,
        speed: 6.0,
        rangedStrength: 33,
        rangedAccuracy: 95,
        rangedRange: 100,
        rangedDelay: 15,
        skinTexture: "cyberpunkskins:textures/technoviking.png",
        displayName: "S4",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "cyber_armorer:unity_cheetah" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:9mm" } },
        drops: [
            { slot: 1, id: "tacz:ammo", count: 20, nbt: { AmmoId: "tacz:9mm" }, chance: 60 },
            { slot: 3, id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "cyber_armorer:unity_cheetah" }, chance: 10 },
            { slot: 6, snbt: '{id:"minecraft:diamond_helmet",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:18.0,Operation:0,Name:"generic.armor",UUID:"[I;472918365,-183756592,938475610,-561029384]",AttributeName:"generic.armor",Slot:"head"}]}}', chance: 8 },
            { slot: 7, snbt: '{id:"minecraft:diamond_chestplate",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:39.0,Operation:0,Name:"generic.armor",UUID:"[I;-609243745,817364920,-274918365,193746582]",AttributeName:"generic.armor",Slot:"chest"}]}}', chance: 5 },
            { slot: 8, snbt: '{id:"minecraft:diamond_leggings",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:25.0,Operation:0,Name:"generic.armor",UUID:"[I;358474619,-920183746,647382915,-183746590]",AttributeName:"generic.armor",Slot:"legs"}]}}', chance: 6 },
            { slot: 9, snbt: '{id:"minecraft:diamond_boots",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:18.0,Operation:0,Name:"generic.armor",UUID:"[I;-847362915,244918375,-519283746,736491820]",AttributeName:"generic.armor",Slot:"feet"}]}}', chance: 8 }
        ],
        expMin: 8,
        expMax: 8
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
        if (sd.has("serialkiller_tiers")) {
            var assignment = JSON.parse(sd.get("serialkiller_tiers"));
            tier = assignment[currentArea] || "S1";
        }
    } catch (err) {}
    currentTier = tier;

    // Look up tier stats
    currentStats = TIER_STATS[currentTier] || TIER_STATS["S1"];

    // Apply stats based on tier
    npc.setFaction(17); // Hostile faction
    npc.getAi().setAvoidsWater(true);
    npc.getAi().setRetaliateType(0);
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
                stripInventory(npc, currentTarget);
                npc.setAttackTarget(null);
                currentTarget = null;
            } else {
                // Scan and save inventory while target is alive
                saveInventorySnapshot(npc, currentTarget);
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
    for (var area in AREA_BOUNDS) {
        var b = AREA_BOUNDS[area];
        if (x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ) {
            return area;
        }
    }
    // Outside all areas - find nearest by center point
    var nearest = "A";
    var nearestDist = 99999;
    for (var area in AREA_BOUNDS) {
        var b = AREA_BOUNDS[area];
        var cx = (b.minX + b.maxX) / 2;
        var cz = (b.minZ + b.maxZ) / 2;
        var dist = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(z - cz, 2));
        if (dist < nearestDist) {
            nearestDist = dist;
            nearest = area;
        }
    }
    return nearest;
}

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function saveInventorySnapshot(npc, player) {
    try {
        var pname = player.getName();
        var container = player.getInventory();
        var snapshot = [];
        for (var s = 0; s < container.getSize(); s++) {
            var stack = container.getSlot(s);
            if (stack == null || stack.isEmpty()) continue;
            snapshot.push(stack.getName());
        }
        npc.storeddata.put("_inv_" + pname, JSON.stringify(snapshot));
    } catch (err) {}
}

function stripInventory(npc, player) {
    try {
        var pname = player.getName();
        var sd = npc.storeddata;
        var key = "_inv_" + pname;
        if (!sd.has(key)) return;
        if (sd.has("_stripped_" + pname)) return;
        sd.put("_stripped_" + pname, "1");

        var snapshot = JSON.parse(sd.get(key));
        var removed = [];
        var seen = {};
        for (var j = 0; j < snapshot.length; j++) {
            var name = snapshot[j];
            if (seen[name]) continue;
            seen[name] = true;
            var isException = false;
            for (var ex = 0; ex < EXCEPTIONS.length; ex++) {
                if (name === EXCEPTIONS[ex]) { isException = true; break; }
            }
            if (!isException) {
                var freshItem = npc.getWorld().createItem(name, 1);
                player.removeAllItems(freshItem);
                removed.push(name);
            }
        }
        player.updatePlayerInventory();
        sd.remove(key);
    } catch (err) {}
}

// ============================================================================
// ITEM CREATOR - Creates items with NBT from config objects
// ============================================================================
// Simple format: { id: "item:id", count: 1, nbt: { key: value } }
// SNBT format:   { snbt: '{id:"item:id",Count:1b,tag:{...}}' }  (for complex NBT)
// ============================================================================

function createItemFromConfig(npc, cfg) {
    if (cfg.snbt) {
        var nbtApi = Packages.noppes.npcs.api.NpcAPI.Instance();
        return npc.world.createItemFromNbt(nbtApi.stringToNbt(cfg.snbt));
    }
    var item = npc.world.createItem(cfg.id, cfg.count || 1);
    if (cfg.nbt) {
        var nbt = item.getNbt();
        for (var key in cfg.nbt) {
            if (!cfg.nbt.hasOwnProperty(key)) continue;
            nbt.putString(key, String(cfg.nbt[key]));
        }
    }
    return item;
}