var RANGE = 5;

function tick(event) {
    var block = event.block;
    var world = block.getWorld();

    // Get all players near the block
    var players = world.getNearbyEntities(block.getPos(), RANGE, 1); // 1 = players

    for (var i = 0; i < players.length; i++) {
        var player = players[i];

        // Create a sugar item reference to count with
        var sugarItem = world.createItem("minecraft:sugar", 1);
        var sugarCount = player.getInventory().count(sugarItem, true, true);

        // If player has at least 1 sugar, remove all sugar from inventory
        if (sugarCount > 0) {
            var inv = player.getInventory();
            var size = inv.getSize();

            for (var slot = 0; slot < size; slot++) {
                var item = inv.getSlot(slot);
                if (item != null && item.getName() == "minecraft:sugar") {
                    inv.setSlot(slot, null);
                }
            }
        }
    }
}