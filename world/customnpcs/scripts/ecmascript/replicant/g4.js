var rewardItem = "coins:coal_coin";  
var rewardCount = 16;

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
        var item = npc.world.createItem(rewardItem, rewardCount);
    npc.getStats().setMaxHealth(400);
    npc.getStats().setRespawnType(3);
    npc.getStats().getRanged().setStrength(20);
    npc.getStats().getRanged().setAccuracy(70);
  //  npc.getStats().getRanged().setSpeed(10);
    npc.getInventory().setDropItem(1, item, 100);
         npc.getInventory().setExp(30,30);
}
