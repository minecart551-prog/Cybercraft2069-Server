var rewardItem = "coins:coal_coin";  
var rewardCount = 16;

var SKIN_URLS = [
    "https://www.minecraftskins.com/uploads/skins/2026/07/07/w-o-l-f-s-p-i-d-e-r---remake-24176795.png?v960",
    "https://www.minecraftskins.com/uploads/skins/2026/07/03/cyber-spider-24168192.png?v960",
    "https://www.minecraftskins.com/uploads/skins/2026/07/04/trixy-cyberpunk-24171551.png?v960"
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
