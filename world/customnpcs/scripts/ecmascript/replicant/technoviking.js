function init(event){
    var npc = event.npc;
    if (Math.random() < 0.10) {
	    npc.reset();
    }
     npc.getStats().setMaxHealth(55);
     npc.getStats().getRanged().setStrength(6);
     npc.getStats().getRanged().setAccuracy(85);
     npc.getStats().getRanged().setDelay(20, 20);
     npc.getStats().getRanged().setBurstDelay(1);
     npc.getInventory().setExp(8,8);
     var coin = npc.world.createItem("coins:stone_coin", 75);
	 var template = npc.world.createItem("minecraft:dune_armor_trim_smithing_template", 1);
     npc.getInventory().setDropItem(0, template, 10);     
     npc.getInventory().setDropItem(1, coin, 100);	 
}