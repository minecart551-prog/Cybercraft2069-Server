var tickCount = 0;

function init(e) {
    e.npc.setFaction(17);
    e.npc.getStats().setMaxHealth(999);
    e.npc.getStats().setHealth(999);
    e.npc.getAi().setRetaliateType(1);
}

function tick(e) {
    tickCount++;
    if (tickCount % 2 !== 0) return;
    var npc = e.npc;
    var pos = npc.getPos();
    var nearby = npc.getWorld().getNearbyEntities(pos, 50, 1);
    for (var i = 0; i < nearby.length; i++) {
        var player = nearby[i];
        var pname = player.getName();
        var container = player.getInventory();
        var items = [];
        for (var s = 0; s < container.getSize(); s++) {
            var stack = container.getSlot(s);
            if (stack == null || stack.isEmpty()) continue;
            items.push("slot" + s + ":" + stack.getName() + "x" + stack.getStackSize());
        }
        npc.say(pname + " alive=" + player.isAlive() + " inv=[" + (items.length > 0 ? items.join(", ") : "empty") + "]");
    }
}
