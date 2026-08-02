// Edit these values, save, then kill + respawn the NPC to test
// ===============================================================

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
    npc.setName(DISPLAY_NAME);

    // Skin
    try { npc.setSkinUrl(SKIN_URL); } catch (err) {}

    // Main hand with NBT
    try {
        var hand = npc.getWorld().createItem(HAND_ITEM_ID, 1);
        if (HAND_ITEM_NBT) {
            var tag = Packages.noppes.npcs.api.NpcAPI.Instance().stringToNbt(HAND_ITEM_NBT);
            hand.setTag(tag);
        }
        npc.setMainhandItem(hand);
    } catch (err) {}
}
