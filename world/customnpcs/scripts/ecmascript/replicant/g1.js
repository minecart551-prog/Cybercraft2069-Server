
var SKIN_URLS = [
    "https://www.minecraftskins.com/uploads/skins/2025/10/15/cyborg-3-0-23582571.png?v951",
    "https://www.minecraftskins.com/uploads/skins/2026/05/10/tosh-24044828.png?v951",
    "https://www.minecraftskins.com/uploads/skins/2026/05/27/---myrkky----24078480.png?v951"
];


function init(e) {
    var npc = e.npc;
    var urls = SKIN_URLS;
    if (urls.length > 0) {
        var skinUrl = urls[Math.floor(Math.random() * urls.length)];
        npc.getDisplay().setSkinUrl(skinUrl);
    }
     npc.getDisplay().setName("G1");
     npc.setFaction(21);
     npc.getStats().setMaxHealth(20);
     npc.getStats().setRespawnType(3);
     npc.getStats().getRanged().setStrength(3);
     npc.getStats().getRanged().setDelay(17, 17);
     npc.getStats().getRanged().setBurstDelay(1);
          npc.getInventory().setExp(3,3);
     npc.getAi().setWanderingRange(20);
        var gun = npc.world.createItem("tacz:modern_kinetic_gun", 1);
        gun.getNbt().putString("GunId", "tacz:p320");
        npc.setMainhandItem(gun);
}