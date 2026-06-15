// ===== CONFIGURATION =====
// None needed - uses world delivery list
// =========================

// Helper: create array filled with null
function makeNullArray(n){
    var a = new Array(n);
    for (var i=0;i<n;i++) a[i] = null;
    return a;
}

// Helper: get random element from array
function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ===== INTERACT =====
function interact(event) {
    var player = event.player;
    var api = event.API;
    var npc = event.npc;

    var handItem = player.getMainhandItem();
    var pdata = player.getStoreddata();

    // Initialize player package flag if first interaction
    if (!pdata.has("canGetPackage")) {
        pdata.put("canGetPackage", 1);
    }

    // --- ADMIN MODE: If holding bedrock -> would open GUI editor (not implemented yet) ---
    if (handItem && !handItem.isEmpty() && handItem.getName() === "minecraft:barrier") {
        npc.say("GUI editor coming soon!");
        return;
    }

    // --- NORMAL PLAYER MODE: Give package if they can get one ---
    if (pdata.get("canGetPackage")) {
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

        // Create package item with proper NBT structure including display name
        try {
            var packageNbt = api.stringToNbt(JSON.stringify({
                id: "yuushya:package_0",
                Count: 1,
                tag: {
                    display: {
                        Name: '{"text":"' + selectedReceiver + '"}'
                    }
                }
            }));
            
            var packageItem = npc.world.createItemFromNbt(packageNbt);
            
            // Set lore using setLore method (like the grill script)
            var loreArray = ["Delivery"];
            packageItem.setLore(loreArray);
            
            // Give package to player
            player.giveItem(packageItem);
            player.message("§aYou received a package for: §f" + selectedReceiver);
            npc.say("Deliver this to " + selectedReceiver + "!");
            
            // Prevent getting another package until delivered
            pdata.put("canGetPackage", 0);
        } catch(e) {
            npc.say("Error creating package, please try again!");
        }

    } else {
        npc.say("You still have a package to deliver!");
    }
}