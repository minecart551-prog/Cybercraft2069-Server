function init(event){
    var npc = event.npc;
     npc.getDisplay().setName("Neonite");
     npc.getDisplay().setSkinUrl("https://www.minecraftskins.com/uploads/skins/2025/06/20/cyborg-23348587.png?v951");
     npc.setFaction(3);
     npc.getStats().setMaxHealth(20);
     npc.getStats().getRanged().setStrength(3);
     npc.getStats().getRanged().setDelay(17, 17);
     npc.getStats().getRanged().setBurstDelay(1);
     var coal = npc.world.createItem("coins:stone_coin", 12);
     var beans = npc.world.createItem("minecraft:air", 1);
     var milk = npc.world.createItem("minecraft:air", 1);
     var mug = npc.world.createItem("minecraft:air", 1);
     npc.getInventory().setDropItem(1, coal, 100);
     npc.getInventory().setDropItem(2, beans, 30);
     npc.getInventory().setDropItem(3, milk, 30);
     npc.getInventory().setDropItem(4, mug, 30);
     npc.getInventory().setExp(3,3);
    npc.getStats().setRespawnType(0);

}
