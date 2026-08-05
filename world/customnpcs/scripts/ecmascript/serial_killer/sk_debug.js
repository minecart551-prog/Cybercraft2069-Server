var HEALTH = 200;
var HEALTH_REGEN = 3;
var COMBAT_REGEN = 3;
var SPEED = 6.0;
var RANGED_STRENGTH = 33;
var RANGED_ACCURACY = 95;
var RANGED_RANGE = 100;
var RANGED_DELAY = 15;
var RANGED_SPEED = 40;
var SKIN_URL = "https://www.minecraftskins.com/uploads/skins/2025/12/16/tattered-cyborg-23723445.png?v964";
var DISPLAY_NAME = "S4";
var HAND_ITEM_ID = "tacz:modern_kinetic_gun";
var HAND_ITEM_NBT = '{"HasBulletInBarrel":1,"GunCurrentAmmoCount":11,"GunFireMode":"SEMI","GunId":"cyber_armorer:unity_cheetah"}';
var EXP_MIN = 8;
var EXP_MAX = 8;

function init(e) {
    var npc = e.npc;
    var stats = npc.getStats();

    stats.setMaxHealth(HEALTH);
    stats.setHealthRegen(HEALTH_REGEN);
    stats.setCombatRegen(COMBAT_REGEN);
    stats.setAggroRange(RANGED_RANGE);

    var ranged = stats.getRanged();
    ranged.setStrength(RANGED_STRENGTH);
    ranged.setAccuracy(RANGED_ACCURACY);
    ranged.setRange(RANGED_RANGE);
    ranged.setDelay(RANGED_DELAY, RANGED_DELAY);
    ranged.setBurstDelay(1);
    ranged.setSpeed(RANGED_SPEED);

    npc.getInventory().setExp(EXP_MIN, EXP_MAX);
    npc.getAi().setWalkingSpeed(SPEED);
    npc.getAi().setMovingType(1);
    npc.setName(DISPLAY_NAME);

    try { npc.setSkinUrl(SKIN_URL); } catch (err) {}

    try {
        var hand = npc.getWorld().createItem(HAND_ITEM_ID, 1);
        if (HAND_ITEM_NBT) {
            var tag = Packages.noppes.npcs.api.NpcAPI.Instance().stringToNbt(HAND_ITEM_NBT);
            hand.setTag(tag);
        }
        npc.setMainhandItem(hand);
    } catch (err) {}
}

var tickCount = 0;

function tick(e) {
    var npc = e.npc;
    tickCount++;

    try {
        var blocked = isBlocked(npc);
        var animType = npc.getAi().getAnimation();
        var needCrawl = blocked;
        var haveCrawl = (animType === 7);

        if (needCrawl !== haveCrawl) {
            if (needCrawl) {
                npc.getAi().setMovingType(0);
                npc.getAi().setAnimation(7);
            } else {
                npc.getAi().setMovingType(1);
                npc.getAi().setAnimation(0);
            }
            npc.getWorld().broadcast("[SK-DBG] FIX blocked=" + blocked
                + " wasAnim=" + animType + " => nowAnim=" + npc.getAi().getAnimation());
        }

        if (tickCount % 10 === 0) {
            var curAnim = npc.getAi().getCurrentAnimation();
            npc.getWorld().broadcast("[SK-DBG] t=" + tickCount
                + " blk=" + blocked + " anim=" + npc.getAi().getAnimation()
                + " cur=" + curAnim + " atk=" + npc.isAttacking()
                + " mov=" + npc.getAi().getMovingType());
        }
    } catch (err) {
        npc.getWorld().broadcast("[SK-DBG] ERROR: " + err);
    }
}

function isBlocked(npc) {
    var pos = npc.getPos();
    var world = npc.getWorld();
    var ix = Math.floor(pos.getX());
    var iy = Math.floor(pos.getY());
    var iz = Math.floor(pos.getZ());

    return isSolid(world.getBlock(ix, iy + 1, iz))
        || isSolid(world.getBlock(ix + 1, iy + 1, iz))
        || isSolid(world.getBlock(ix - 1, iy + 1, iz))
        || isSolid(world.getBlock(ix, iy + 1, iz + 1))
        || isSolid(world.getBlock(ix, iy + 1, iz - 1));
}

function isSolid(block) {
    if (!block) return false;
    var name = block.getName();
    return name !== "minecraft:air" && name !== "minecraft:cave_air" && name !== "minecraft:void_air"
        && name.indexOf("water") === -1 && name.indexOf("lava") === -1;
}
