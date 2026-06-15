// === Sugar Mailman NPC (creates packages from delivery list) ===
function init(e) {
    e.npc.setFaction(4);
    e.npc.getAi().setStandingType(2);
}
// Helper: get random element from array
function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
// Normalize NBT JSON by removing Count fields for comparison
function normalizeNbtJson(str){
    if(!str) return "";
    try {
        return str.replace(/"Count"\s*:\s*[\d]+[bB]?/g, "").replace(/\s+/g, "");
    } catch(e){
        return str + "";
    }
}
// Compare items by id, damage and normalized NBT (ignoring Count)
function itemsEqualStrict(api, hand, required) {
    if (!hand || !required) return false;
    if (hand.getName() !== required.getName()) return false;
    if (hand.getItemDamage() !== required.getItemDamage()) return false;
    try {
        var hNbt = hand.getItemNbt() ? hand.getItemNbt().toJsonString() : "";
        var rNbt = required.getItemNbt() ? required.getItemNbt().toJsonString() : "";
        return normalizeNbtJson(hNbt) === normalizeNbtJson(rNbt);
    } catch(e) { return false; }
}
function interact(event) {
    var player = event.player;
    var api = event.API;
    var npc = event.npc;
    var handItem = player.getMainhandItem();
    var pdata = player.getStoreddata();
 
    // Check if player is holding sugar and can get package
    if (handItem && !handItem.isEmpty() && handItem.getName() === "minecraft:sugar") {
        var hasDeliveryLore = false;
        try {
            var lore = handItem.getLore();
            if (lore && lore.length > 0) {
                for (var i = 0; i < lore.length; i++) {
                    if (lore[i].indexOf("Delivery") !== -1) {
                        hasDeliveryLore = true;
                        break;
                    }
                }
            }
        } catch(e) {}
        if (hasDeliveryLore) {
            npc.say("That sugar is already packaged! Deliver it first.");
            return;
        }
        // Get delivery list from world data
        var worldData = npc.world.getStoreddata();
        var deliveryList = [];
        if (worldData.has("deliveryList")) {
            try {
                deliveryList = JSON.parse(worldData.get("deliveryList"));
                if (!deliveryList || !Array.isArray(deliveryList)) {
                    deliveryList = [];
                }
            } catch(ex) {
                deliveryList = [];
            }
        }
        // Check if there are any receivers
        if (deliveryList.length === 0) {
            npc.say("No delivery receivers available right now!");
            return;
        }
        // Select random receiver from the list
        var selectedReceiver = randomFrom(deliveryList);
        
        // Get stack size of sugar player is holding
        var sugarAmount = handItem.getStackSize();
        // Create package item with proper NBT structure including display name
        try {
            var packageNbt = api.stringToNbt(JSON.stringify({
                id: "minecraft:sugar",
                Count: sugarAmount,
                tag: {
                    display: {
                        Name: '{"text":"' + selectedReceiver + '"}'
                    }
                }
            }));
            
            var packageItem = npc.world.createItemFromNbt(packageNbt);
            
            // Set lore using setLore method
            var loreArray = ["Delivery"];
            packageItem.setLore(loreArray);
            
            // Remove sugar from player's exact mainhand slot
            var inv = player.getInventory();
            var removed = false;
            for (var s = 0; s < inv.getSize(); s++) {
                var slotStack = inv.getSlot(s);
                if (slotStack === handItem) {
                    inv.setSlot(s, null);
                    removed = true;
                    break;
                }
            }
            if (!removed) {
                handItem.setStackSize(0);
            }
            
            // Give package to player
            player.giveItem(packageItem);
            player.message("§aYou received a sugar package for: §f" + selectedReceiver);
            
        } catch(e) {
            npc.say("Error creating package, please try again!");
        }
        
        return;
    }
}