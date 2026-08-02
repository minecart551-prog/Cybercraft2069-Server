// ===============================================================
// SERIAL KILLER - Hostile NPC that hunts players at night
// Spawned by serialkiller_spawner.js
// Tier (S1-S4) is looked up from the nightly area assignment
// ===============================================================

var targetPlayer = null;
var DESPAWN_DISTANCE = 100;
var LIFETIME_SECONDS = 300; // 5 minutes
var EXCEPTIONS = [      "minecraft:fishing_rod",
                        "lockandblock:key",
                        "yuushya:package_0",
                        "automobility:automobile",
                        "minecraft:written_book",
                        "automobility:automobile_engine",
                        "automobility:automobile_frame",
                        "automobility:automobile_wheel",
                        "automobility:crowbar",
                        "minecraft:stick",
                        "armourers_workshop:skin",
                         "lockandblock:keycard"];
var NIGHT_START = 13000;
var NIGHT_END = 23000;



// ============================================================================
// AREA DETECTION - Bounding boxes per area (minX, minZ, maxX, maxZ)
// ============================================================================
var AREA_BOUNDS = {
    "D": { minX: 1911, minZ: 1135, maxX: 2980, maxZ: 2253 },
    "C": { minX: 1866, minZ: -15, maxX: 2719, maxZ: 541 },
    "B": { minX: 1821, minZ: -1405, maxX: 2798, maxZ: -35 },
    "A": { minX: 532, minZ: -1446, maxX: 1821, maxZ: 85 }
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
        name: "S1",
        health: 50,
        healthRegen: 1,
        combatRegen: 2,
        speed: 6.0,
        rangedStrength: 12,
        rangedAccuracy: 95,
        rangedRange: 100,
        rangedDelay: 15,
        rangedSpeed: 40,
        skinTexture: "https://www.minecraftskins.com/uploads/skins/2025/12/16/tattered-cyborg-23723445.png?v964",
        displayName: "S1",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "tacz:cz75" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:9mm" } },
        drops: [
            { slot: 0, id: "tacz:ammo", count: 60, nbt: { AmmoId: "tacz:9mm" }, chance: 100 },
            { slot: 1, id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "tacz:cz75" }, chance: 100 },
            { slot: 2, snbt: '{id:"minecraft:leather_helmet",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:2.0,Operation:0,Slot:"head",UUID:"[I;1276935719,2101628065,-2062805011,-1388635]",AttributeName:"generic.armor",Name:"generic.armor"}]}}', chance: 8 },
            { slot: 3, snbt: '{id:"minecraft:leather_chestplate",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:6.0,Operation:0,Slot:"chest",UUID:"[I;66453,79497593,-201178,-16957605]",AttributeName:"generic.armor",Name:"generic.armor"}]}}', chance: 5 },
            { slot: 4, snbt: '{id:"minecraft:leather_leggings",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:5.0,Operation:0,Slot:"legs",UUID:"[I;1393173916,1759135223,-1879342790,-508144820]",AttributeName:"generic.armor",Name:"generic.armor"}]}}', chance: 6 },
            { slot: 5, snbt: '{id:"minecraft:leather_boots",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:2.0,Operation:0,Slot:"feet",UUID:"[I;-1305545332,996295294,-1733047031,531723401]",AttributeName:"generic.armor",Name:"generic.armor"}]}}', chance: 8 }
        ],
        expMin: 8,
        expMax: 8
    },
    "S2": {
        name: "S2",
        health: 200,
        healthRegen: 3,
        combatRegen: 3,
        speed: 6.0,
        rangedStrength: 33,
        rangedAccuracy: 95,
        rangedRange: 100,
        rangedDelay: 15,
        rangedSpeed: 40,
        skinTexture: "https://www.minecraftskins.com/uploads/skins/2025/12/16/tattered-cyborg-23723445.png?v964",
        displayName: "S2",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 20, GunFireMode: "AUTO", GunId: "tacz:scar_h" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:308" } },
        drops: [
            { slot: 0, id: "tacz:ammo", count: 60, nbt: { AmmoId: "tacz:308" }, chance: 100 },
            { slot: 1, id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 20, GunFireMode: "AUTO", GunId: "tacz:scar_h" }, chance: 100 },
            { slot: 2, snbt: '{id:"minecraft:chainmail_helmet",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:3.0,Operation:0,Name:"generic.armor",UUID:"[I;1962758238,-402895587,-1157109447,1225991700]",AttributeName:"generic.armor",Slot:"head"},{Amount:3.0,Operation:0,Name:"generic.armor_toughness",UUID:"[I;-1942079108,914771463,-1608237363,1151659171]",AttributeName:"generic.armor_toughness",Slot:"head"}]}}', chance: 8 },
            { slot: 3, snbt: '{id:"minecraft:chainmail_chestplate",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:8.0,Operation:0,Name:"generic.armor",UUID:"[I;2082959146,1448298836,-2088010816,-866068823]",AttributeName:"generic.armor",Slot:"chest"},{Amount:3.0,Operation:0,Name:"generic.armor_toughness",UUID:"[I;-734355839,1568492182,-1279907194,-1996913419]",AttributeName:"generic.armor_toughness",Slot:"chest"}]}}', chance: 5 },
            { slot: 4, snbt: '{id:"minecraft:chainmail_leggings",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:6.0,Operation:0,Name:"generic.armor",UUID:"[I;650941737,-1901506567,-1582766196,1857334701]",AttributeName:"generic.armor",Slot:"legs"},{Amount:3.0,Operation:0,Name:"generic.armor_toughness",UUID:"[I;-865580501,1016744579,-1206154126,-1400343339]",AttributeName:"generic.armor_toughness",Slot:"legs"}]}}', chance: 6 },
            { slot: 5, snbt: '{id:"minecraft:chainmail_boots",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:3.0,Operation:0,Name:"generic.armor",UUID:"[I;1624854239,-1370865197,-1979221776,1862783941]",AttributeName:"generic.armor",Slot:"feet"},{Amount:3.0,Operation:0,Name:"generic.armor_toughness",UUID:"[I;996174618,-1532542096,-1324170079,1457612765]",AttributeName:"generic.armor_toughness",Slot:"feet"}]}}', chance: 8 }
        ],
        expMin: 20,
        expMax: 20
    },
    "S3": {
        name: "S3",
        health: 200,
        healthRegen: 3,
        combatRegen: 3,
        speed: 6.0,
        rangedStrength: 33,
        rangedAccuracy: 95,
        rangedRange: 100,
        rangedDelay: 15,
        rangedSpeed: 40,
        skinTexture: "https://www.minecraftskins.com/uploads/skins/2025/12/16/tattered-cyborg-23723445.png?v964",
        displayName: "S3",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 6, GunFireMode: "SEMI", GunId: "tacz:m700" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:30_06" } },
        drops: [
            { slot: 0, id: "tacz:ammo", count: 20, nbt: { AmmoId: "tacz:30_06" }, chance: 60 },
            { slot: 1, id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 6, GunFireMode: "SEMI", GunId: "tacz:m700" }, chance: 100 },
            { slot: 2, snbt: '{id:"minecraft:iron_helmet",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:11.0,Operation:0,Name:"generic.armor",UUID:"[I;819273645,-564738291,271828182,-314159265]",AttributeName:"generic.armor",Slot:"head"}]}}', chance: 8 },
            { slot: 3, snbt: '{id:"minecraft:iron_chestplate",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:24.0,Operation:0,Name:"generic.armor",UUID:"[I;-192837465,918273645,-135792468,246813579]",AttributeName:"generic.armor",Slot:"chest"}]}}', chance: 5 },
            { slot: 4, snbt: '{id:"minecraft:iron_leggings",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:15.0,Operation:0,Name:"generic.armor",UUID:"[I;135791113,-975318642,864209753,-509182736]",AttributeName:"generic.armor",Slot:"legs"}]}}', chance: 6 },
            { slot: 5, snbt: '{id:"minecraft:iron_boots",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:11.0,Operation:0,Name:"generic.armor",UUID:"[I;-741852963,159357258,-258147963,753951456]",AttributeName:"generic.armor",Slot:"feet"}]}}', chance: 8 }
        ],
        expMin: 50,
        expMax: 50
    },
    "S4": {
        name: "S4",
        health: 200,
        healthRegen: 3,
        combatRegen: 3,
        speed: 6.0,
        rangedStrength: 33,
        rangedAccuracy: 95,
        rangedRange: 100,
        rangedDelay: 15,
        rangedSpeed: 40,
        skinTexture: "https://www.minecraftskins.com/uploads/skins/2025/12/16/tattered-cyborg-23723445.png?v964",
        displayName: "S4",
        handItem: { id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "cyber_armorer:unity_cheetah" } },
        projectile: { id: "tacz:ammo", count: 1, nbt: { AmmoId: "tacz:9mm" } },
        drops: [
            { slot: 0, id: "tacz:ammo", count: 50, nbt: { AmmoId: "tacz:9mm" }, chance: 100 },
            { slot: 1, id: "tacz:modern_kinetic_gun", count: 1, nbt: { HasBulletInBarrel: 1, GunCurrentAmmoCount: 11, GunFireMode: "SEMI", GunId: "cyber_armorer:unity_cheetah" }, chance: 100 },
            { slot: 2, snbt: '{id:"minecraft:diamond_helmet",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:18.0,Operation:0,Name:"generic.armor",UUID:"[I;472918365,-183756592,938475610,-561029384]",AttributeName:"generic.armor",Slot:"head"}]}}', chance: 8 },
            { slot: 3, snbt: '{id:"minecraft:diamond_chestplate",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:39.0,Operation:0,Name:"generic.armor",UUID:"[I;-609243745,817364920,-274918365,193746582]",AttributeName:"generic.armor",Slot:"chest"}]}}', chance: 5 },
            { slot: 4, snbt: '{id:"minecraft:diamond_leggings",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:25.0,Operation:0,Name:"generic.armor",UUID:"[I;358474619,-920183746,647382915,-183746590]",AttributeName:"generic.armor",Slot:"legs"}]}}', chance: 6 },
            { slot: 5, snbt: '{id:"minecraft:diamond_boots",Count:1b,tag:{Damage:0,AttributeModifiers:[{Amount:18.0,Operation:0,Name:"generic.armor",UUID:"[I;-847362915,244918375,-519283746,736491820]",AttributeName:"generic.armor",Slot:"feet"}]}}', chance: 8 }
        ],
        expMin: 100,
        expMax: 100
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
    npc.getDisplay().setSkinUrl(currentStats.skinTexture);
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
    npc.getStats().getRanged().setSpeed(currentStats.rangedSpeed);
    npc.getStats().setAggroRange(currentStats.rangedRange);
    npc.getStats().getRanged().setSound(0, "customnpcs:gun.pistol.shot");
    npc.getStats().getRanged().setSound(1, "");
    npc.getStats().getRanged().setSound(2, "tacz:target_block_hit");
    npc.getStats().getRanged().setMeleeRange(4);
    npc.getAi().setWalkingSpeed(currentStats.speed);
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

    // Despawn during daytime
    var time = world.getTime();
    if (time >= NIGHT_END || time < NIGHT_START) {
        npc.despawn();
        return;
    }

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

    // Scan nearby players — strip dead ones, target alive ones
    var pos = npc.getPos();
    var nearby = world.getNearbyEntities(pos, 50, 1);
    var hasAliveTarget = false;
    for (var i = 0; i < nearby.length; i++) {
        var player = nearby[i];
        if (!player.isAlive()) {
            stripInventory(npc, player);
        } else {
            hasAliveTarget = true;
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

    // Only attack players, never other NPCs
    if (currentTarget && currentTarget.getType() != 1) {
        npc.setAttackTarget(null);
        currentTarget = null;
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

function stripInventory(npc, player) {
    try {
        var pname = player.getName();
        var key = "_stripped_" + pname;
        if (npc.getTempdata().has(key)) return;
        npc.getTempdata().put(key, true);
        var container = player.getInventory();
        var removed = [];
        var seen = {};
        for (var s = 0; s < container.getSize(); s++) {
            var stack = container.getSlot(s);
            if (stack == null || stack.isEmpty()) continue;
            var name = stack.getName();
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
        npc.despawn();
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
