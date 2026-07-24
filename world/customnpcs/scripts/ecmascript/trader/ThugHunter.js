// ============================================================
//  SHOP CONFIGURATION
// ============================================================

var SHOP_PAGES = [

    // PAGE 1
    [
        // Each row = { price, reward1, reward2 }
        // Slots ordered: [Price] [Reward1] [Reward2]
        // Click either reward slot to purchase both rewards
        // Set reward2: null if only one reward is needed
        { price: { name: "minecraft:shaper_armor_trim_smithing_template", count: 1  }, reward1: { name: "coins:stone_coin",       count: 10 }, reward2: null },
        { price: { name: "dune_armor_trim_smithing_template", count: 1 }, reward1: { name: "coins:stone_coin", count: 50 }, reward2: null },
        { price: { name: "silence_armor_trim_smithing_template",    count: 1  }, reward1: { name: "coins:coal_coin",         count: 2 }, reward2: { name: "coins:stone_coin",         count: 50 } },
    ],

    // PAGE 2

];

// ============================================================
//  LAYOUT
// ============================================================

var startX     = -27;
var startY     = -30;
var rowSpacing = 20.5;
var colSpacing = 79;
var numRows    = 1;
var numCols    = 3;

var priceOffsetX   = 0;   // left slot   = price
var reward1OffsetX = 26;  // middle slot = reward 1
var reward2OffsetX = 44;  // right slot  = reward 2

// ============================================================
//  INTERNALS — no need to edit below this line
// ============================================================

var guiRef      = null;
var mySlots     = [];
var currentPage = 0;
var lastNpc     = null;

var slotPositions = [];
for (var col = 0; col < numCols; col++) {
    var colOffsetX = startX + col * colSpacing;
    for (var row = 0; row < numRows; row++) {
        var y = startY + row * rowSpacing;
        slotPositions.push({ x: colOffsetX + priceOffsetX,   y: y }); // index % 3 === 0 → price
        slotPositions.push({ x: colOffsetX + reward1OffsetX, y: y }); // index % 3 === 1 → reward1
        slotPositions.push({ x: colOffsetX + reward2OffsetX, y: y }); // index % 3 === 2 → reward2
    }
}

// ========== Open GUI ==========
function interact(event) {
    var player = event.player;
    var api    = event.API;
    lastNpc    = event.npc;

    if (!guiRef) {
        guiRef = api.createCustomGui(176, 166, 0, true, player);
        guiRef.addButton(2, "Next", 284, -30, 35, 19);
        guiRef.addButton(3, "Back", -153, -30, 35, 19);

        mySlots = slotPositions.map(function(pos) {
            return guiRef.addItemSlot(pos.x, pos.y);
        });

        guiRef.showPlayerInventory(0, 91, false);
        player.showCustomGui(guiRef);
    }

    loadPageIntoSlots(player, api);
    guiRef.update();
}

function loadPageIntoSlots(player, api) {
    var pageData = SHOP_PAGES[currentPage] || [];

    for (var i = 0; i < mySlots.length; i++) {
        mySlots[i].setStack(null);
    }

    for (var row = 0; row < pageData.length && row < numCols; row++) {
        var entry   = pageData[row];
        var baseIdx = row * 3;

        setSlotFromConfig(mySlots[baseIdx],     entry.price,   player);
        setSlotFromConfig(mySlots[baseIdx + 1], entry.reward1, player);
        setSlotFromConfig(mySlots[baseIdx + 2], entry.reward2, player);
    }
}

function setSlotFromConfig(slot, cfg, player) {
    if (!cfg || !cfg.name) return;
    try {
        var item = player.world.createItem(cfg.name, cfg.count || 1);
        slot.setStack(item);
    } catch(e) {}
}


// ========== Button Click ==========
function customGuiButton(event) {
    var player     = event.player;
    var totalPages = SHOP_PAGES.length;

    if (event.buttonId === 2) { // Next
        if (currentPage + 1 < totalPages) {
            currentPage++;
            loadPageIntoSlots(player, event.API);
            guiRef.update();
            player.message("§ePage " + (currentPage + 1) + " of " + totalPages);
        } else {
            player.message("§cNo more pages!");
        }
    }

    if (event.buttonId === 3) { // Back
        if (currentPage > 0) {
            currentPage--;
            loadPageIntoSlots(player, event.API);
            guiRef.update();
            player.message("§ePage " + (currentPage + 1) + " of " + totalPages);
        } else {
            player.message("§cAlready on the first page!");
        }
    }
}

// ========== Slot Click ==========
function customGuiSlotClicked(event) {
    var clickedSlot = event.slot;
    var player      = event.player;
    var slotIndex   = mySlots.indexOf(clickedSlot);

    // Only trigger on reward slots (index % 3 === 1 or 2)
    if (slotIndex === -1 || slotIndex % 3 === 0) return;

    // Resolve the base index of this row
    var baseIdx = slotIndex - (slotIndex % 3);

    var priceSlot   = mySlots[baseIdx];
    var reward1Slot = mySlots[baseIdx + 1];
    var reward2Slot = mySlots[baseIdx + 2];

    var reward1 = reward1Slot.getStack();
    var reward2 = reward2Slot.getStack();

    // Must have at least one reward
    if ((!reward1 || reward1.isEmpty()) && (!reward2 || reward2.isEmpty())) return;

    var price = priceSlot.getStack();
    var inv   = player.getInventory().getItems();

    // Check and deduct price
    if (price && !price.isEmpty()) {
        var totalHave = 0;
        for (var j = 0; j < inv.length; j++) {
            var s = inv[j];
            if (s && s.getName() === price.getName()) totalHave += s.getStackSize();
        }
        if (totalHave < price.getStackSize()) {
            player.message("§cNot enough " + price.getDisplayName() + "!");
            return;
        }
        var toRemove = price.getStackSize();
        for (var j = 0; j < inv.length; j++) {
            var s = inv[j];
            if (s && s.getName() === price.getName() && toRemove > 0) {
                var take = Math.min(toRemove, s.getStackSize());
                s.setStackSize(s.getStackSize() - take);
                toRemove -= take;
            }
        }
    }

    // Give both rewards
    if (reward1 && !reward1.isEmpty()) {
        player.giveItem(player.world.createItemFromNbt(reward1.getItemNbt()));
    }
    if (reward2 && !reward2.isEmpty()) {
        player.giveItem(player.world.createItemFromNbt(reward2.getItemNbt()));
    }

    player.message("§aPurchase successful!");
}

// ========== Close GUI ==========
function customGuiClosed(event) {
    guiRef      = null;
    currentPage = 0;
}