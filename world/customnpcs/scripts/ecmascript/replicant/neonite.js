function init(event){
    var npc = event.npc;
     npc.getDisplay().setName("Neonite");
     npc.getDisplay().setSkinUrl("https://www.minecraftskins.com/uploads/skins/2025/06/20/cyborg-23348587.png?v951");
     npc.setFaction(3);
     npc.getStats().setMaxHealth(20);
     npc.getStats().getRanged().setStrength(3);
     npc.getStats().getRanged().setDelay(17, 17);
     npc.getStats().getRanged().setBurstDelay(1);
     var coin = npc.world.createItem("coins:stone_coin", 12);
     var air = npc.world.createItem("minecraft:air", 1);
     var template = npc.world.createItem("minecraft:shaper_armor_trim_smithing_template", 1);
     npc.getInventory().setDropItem(0, template, 10);     
     npc.getInventory().setDropItem(1, coin, 100);
     npc.getInventory().setDropItem(2, air, 0);
     npc.getInventory().setDropItem(3, air, 0);
     npc.getInventory().setDropItem(4, air, 0);
     npc.getInventory().setExp(3,3);
	 //dd
    npc.getStats().setRespawnType(0);

}