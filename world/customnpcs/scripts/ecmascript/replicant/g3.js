
var SKIN_URLS = [
    "https://www.minecraftskins.com/uploads/skins/2024/01/03/sniper-camerawoman-22229651.png?v951",
    "https://www.minecraftskins.com/uploads/skins/2023/12/31/verona--rustage--22222709.png?v951",
    "https://www.minecraftskins.com/uploads/skins/2023/04/19/sneaky-sniper-21529799.png?v951"
];

function init(event){
    var npc = event.npc;
    var urls = SKIN_URLS;
    if (urls.length > 0) {
        var skinUrl = urls[Math.floor(Math.random() * urls.length)];
        npc.getDisplay().setSkinUrl(skinUrl);
    }
     npc.getStats().setMaxHealth(200);
     npc.getStats().getRanged().setStrength(12);
   //  var reward = world.createItem("minecraft:silence_armor_trim_smithing_template", 1);
   //  npc.getInventory().setDropItem(0, reward, 1);
     npc.getInventory().setExp(16,16);
}

