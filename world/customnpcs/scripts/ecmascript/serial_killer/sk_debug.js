
var EXCEPTIONS = ["minecraft:netherite_sword", "tacz:modern_kinetic_gun"];

function init(e) {
}

function tick(e) {
    var npc = e.npc;
    var pos = npc.getPos();
    var nearby = npc.getWorld().getNearbyEntities(pos, 50, 1);
    for (var i = 0; i < nearby.length; i++) {
        var player = nearby[i];
        if (player.isAlive()) continue;
        var pname = player.getName();
        var key = "_stripped_" + pname;
        if (npc.getTempdata().has(key)) continue;
        npc.getTempdata().put(key, true);
        var container = player.getInventory();
        var removed = [];
        var seen = {};
        for (var s = 0; s < container.getSize(); s++) {
            var stack = container.getSlot(s);
            if (stack == null || stack.isEmpty()) continue;
            var name = stack.getName();
            if (seen[name]) continue;
            seen[name] = true;
            var isException = false;
            for (var ex = 0; ex < EXCEPTIONS.length; ex++) {
                if (name === EXCEPTIONS[ex]) { isException = true; break; }
            }
            if (!isException) {
                var freshItem = npc.getWorld().createItem(name, 1);
                player.removeAllItems(freshItem);
                removed.push(name);
            }
        }
        player.updatePlayerInventory();
        npc.say("Stripped " + pname + ": " + removed.join(", "));
    }
}