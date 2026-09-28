function init(event){	
    var npc = event.npc;
    if (Math.random() < 0.10) {
	    npc.reset();
    }	
     npc.getStats().setMaxHealth(200);
     npc.getStats().getRanged().setStrength(12);
     npc.getInventory().setExp(16,16);
     var coin = npc.world.createItem("coins:coal_coin", 3);
	 var template = npc.world.createItem("minecraft:silence_armor_trim_smithing_template", 1);
     npc.getInventory().setDropItem(0, template, 10);     
     npc.getInventory().setDropItem(1, coin, 100);	 	 
}

