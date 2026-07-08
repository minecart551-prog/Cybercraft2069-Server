var guiRef;
var lastNpc = null;

var costSlots = [];   // display-only "you pay" slots
var giveSlots = [];   // "click to receive" slots

// ========== Conversion definitions ==========
// costPos / givePos are laid out as two columns of two rows,
// each row = [cost slot] "=" [give slot]
// (all positions shifted +50 on x compared to before)
var conversions = [
    { // Column 1, top: stone -> coal
        costItem: "coins:stone_coin", costAmount: 100,
        giveItem: "coins:coal_coin",  giveAmount: 1,
        costPos: {x: 20, y: -60}, givePos: {x: 48, y: -60}
    },
    { // Column 1, bottom: coal -> stone (convert back)
        costItem: "coins:coal_coin",  costAmount: 1,
        giveItem: "coins:stone_coin", giveAmount: 100,
        costPos: {x: 20, y: -20}, givePos: {x: 48, y: -20}
    },
    { // Column 2, top: coal -> emerald
        costItem: "coins:coal_coin",    costAmount: 100,
        giveItem: "coins:emerald_coin", giveAmount: 1,
        costPos: {x: 100, y: -60}, givePos: {x: 128, y: -60}
    },
    { // Column 2, bottom: emerald -> coal (convert back)
        costItem: "coins:emerald_coin", costAmount: 1,
        giveItem: "coins:coal_coin",    giveAmount: 100,
        costPos: {x: 100, y: -20}, givePos: {x: 128, y: -20}
    }
];

// ========== Open GUI ==========
function interact(event) {
    var player = event.player;
    var api = event.API;
    lastNpc = event.npc;

    if (!guiRef) {
        guiRef = api.createCustomGui(176, 166, 0, true, player);

        costSlots = [];
        giveSlots = [];
        for (var i = 0; i < conversions.length; i++) {
            costSlots.push(guiRef.addItemSlot(conversions[i].costPos.x, conversions[i].costPos.y));
            giveSlots.push(guiRef.addItemSlot(conversions[i].givePos.x, conversions[i].givePos.y));

            // "=" drawn as two short parallel lines in the gap between the
            // cost slot and the give slot (using addColoredLine, same as
            // the original admin-highlight script - NOT addLabel).
            var lineX1 = conversions[i].costPos.x + 18; // right edge of cost slot
            var lineX2 = conversions[i].givePos.x;       // left edge of give slot
            var lineYTop = conversions[i].costPos.y + 7;
            var lineYBottom = conversions[i].costPos.y + 10;
            guiRef.addColoredLine(200 + i * 2,     lineX1+1, lineYTop,    lineX2-3, lineYTop,    0xFFFFFFFF, 1);
            guiRef.addColoredLine(200 + i * 2 + 1, lineX1+1, lineYBottom, lineX2-3, lineYBottom, 0xFFFFFFFF, 1);
        }

        guiRef.showPlayerInventory(0, 91, false);
        player.showCustomGui(guiRef);
    }

    for (var i = 0; i < conversions.length; i++) {
        setSlotFromConfig(costSlots[i], conversions[i].costItem, conversions[i].costAmount, player);
        setSlotFromConfig(giveSlots[i], conversions[i].giveItem, conversions[i].giveAmount, player);
    }

    guiRef.update();
}

function setSlotFromConfig(slot, itemName, count, player) {
    try {
        var item = player.world.createItem(itemName, count || 1);
        slot.setStack(item);
    } catch (e) {}
}

// ========== Slot Click (conversion happens here) ==========
function customGuiSlotClicked(event) {
    var clickedSlot = event.slot;
    var player = event.player;

    var idx = giveSlots.indexOf(clickedSlot);
    if (idx === -1) return;

    var conv = conversions[idx];
    var inv = player.getInventory().getItems();

    var totalHave = 0;
    for (var j = 0; j < inv.length; j++) {
        var s = inv[j];
        if (s && s.getName() === conv.costItem) {
            totalHave += s.getStackSize();
        }
    }

    if (totalHave < conv.costAmount) {
        player.message("§cYou need " + conv.costAmount + " " + conv.costItem + " to convert!");
        return;
    }

    var toRemove = conv.costAmount;
    for (var j = 0; j < inv.length; j++) {
        var s = inv[j];
        if (s && s.getName() === conv.costItem && toRemove > 0) {
            var amt = Math.min(toRemove, s.getStackSize());
            s.setStackSize(s.getStackSize() - amt);
            toRemove -= amt;
        }
    }

    player.giveItem(player.world.createItem(conv.giveItem, conv.giveAmount));
    player.message("§aConverted " + conv.costAmount + " " + conv.costItem + " into " + conv.giveAmount + " " + conv.giveItem + "!");
}

// ========== Close GUI ==========
function customGuiClosed(event) {
    guiRef = null;
}
