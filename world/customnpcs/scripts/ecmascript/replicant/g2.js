
var SKIN_URLS = [
    "https://www.minecraftskins.com/uploads/skins/2026/05/27/cyborg-steampunk-engineer---with-absolute-solver-eye-24080105.png?v951",
    "https://www.minecraftskins.com/uploads/skins/2026/05/22/paris-the-cyborg-24067633.png?v951",
    "https://www.minecraftskins.com/uploads/skins/2026/03/13/cyyu-3-0-23920859.png?v951"
];

function init(event){
    var npc = event.npc;
    var urls = SKIN_URLS;
    if (urls.length > 0) {
        var skinUrl = urls[Math.floor(Math.random() * urls.length)];
        npc.getDisplay().setSkinUrl(skinUrl);
    }

     npc.getStats().setRespawnType(3);
     npc.getStats().setMaxHealth(55);
     npc.getStats().getRanged().setStrength(6);
     npc.getStats().getRanged().setAccuracy(85);
     npc.getStats().getRanged().setDelay(20, 20);
     npc.getStats().getRanged().setBurstDelay(1);
     npc.getInventory().setExp(8,8);
     npc.getAi().setWanderingRange(20);
}




