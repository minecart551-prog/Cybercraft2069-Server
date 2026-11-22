// ============================================================================
// PLAYER SHOP - single-tab shop for survival scripted blocks
// Based on chestTrader7.js, adapted for a 1-tab scripted block.
// Admin/edit mode: shift+right click (or op/bedrock).
// ============================================================================
var guiRef;
var mySlots = [];
var highlightLineIds = [];
var highlightedSlot = null;
var lastBlock = null;
var lastPlayer = null;
var storedSlotItems = {};
var currentPage = 0;
var maxPages = 1;
var skipSaveOnClose = false;
// Viewport system
var viewportRow = 0;
var viewportRows = 6;
var totalRows = 6;
var numCols = 9;
// Currency conversion rates
var STONE_TO_COAL = 100;
var COAL_TO_EMERALD = 100;
// Component IDs
var ID_PRICE_FIELD = 100;
var ID_SET_PRICE_BUTTON = 101;
var ID_TAB_BASE = 102;
var ID_SCROLL_UP = 111;
var ID_SCROLL_DOWN = 112;
var ID_ROWS_FIELD = 115;
var ID_SET_ROWS_BUTTON = 116;

// ========== CORRUPTION RESISTANCE LAYER ==========
function safeJSONParse(jsonString, defaultValue) {
    if (!jsonString || jsonString.length === 0) return defaultValue;
    try { return JSON.parse(jsonString); } catch(e) { return defaultValue; }
}
function safeGetData(blockData, key, defaultValue) {
    if (!blockData.has(key)) return defaultValue;
    var rawData = blockData.get(key);
    if (!rawData || rawData.length() === 0) return defaultValue;
    return rawData;
}
function atomicSave(blockData, key, value) {
    try {
        var jsonString = JSON.stringify(value);
        if (!jsonString || jsonString.length === 0) return false;
        JSON.parse(jsonString);
        blockData.put(key, jsonString);
        return true;
    } catch(e) { return false; }
}
function loadShopItems(blockData) {
    var rawData = safeGetData(blockData, "ShopItems", null);
    if (rawData === null) {
        var emptyData = {};
        atomicSave(blockData, "ShopItems", emptyData);
        return emptyData;
    }
    var parsed = safeJSONParse(rawData, null);
    if (parsed === null) {
        var emptyData = {};
        atomicSave(blockData, "ShopItems", emptyData);
        return emptyData;
    }
    return parsed;
}
function loadTabItems(blockData, expectedLength) {
    var rawData = safeGetData(blockData, "TabItems", null);
    if (rawData === null) {
        var defaultArray = makeNullArray(expectedLength);
        atomicSave(blockData, "TabItems", defaultArray);
        return defaultArray;
    }
    var parsed = safeJSONParse(rawData, null);
    if (parsed === null || !Array.isArray(parsed)) {
        var defaultArray = makeNullArray(expectedLength);
        atomicSave(blockData, "TabItems", defaultArray);
        return defaultArray;
    }
    while (parsed.length < expectedLength) parsed.push(null);
    if (parsed.length > expectedLength) parsed = parsed.slice(0, expectedLength);
    return parsed;
}
function loadTabRows(blockData, currentPage) {
    var rawData = safeGetData(blockData, "TabRows", null);
    if (rawData === null) return 6;
    var parsed = safeJSONParse(rawData, {});
    if (parsed[currentPage] !== undefined) return parsed[currentPage];
    return 6;
}
function saveTabRowConfig(blockData, rows) {
    var rawData = safeGetData(blockData, "TabRows", null);
    var tabRowsConfig = safeJSONParse(rawData, {});
    tabRowsConfig[currentPage] = rows;
    atomicSave(blockData, "TabRows", tabRowsConfig);
}
// ========== END CORRUPTION RESISTANCE LAYER ==========

function makeNullArray(n) {
    var a = new Array(n);
    for (var i = 0; i < n; i++) a[i] = null;
    return a;
}

function loadTabRowConfig(blockData) {
    totalRows = loadTabRows(blockData, currentPage);
}

// Faction edit permission
function canEdit(player, block) {
    try {
        var Factions = Java.type("noppes.npcs.util.FactionsInterop");
        var mcPlayer = player.getMCEntity();
        var level = player.getWorld().getMCLevel();
        return Factions.canEditClaim(mcPlayer, level, block.getX(), block.getY(), block.getZ());
    } catch(e) {}
    try { if (player.getMCEntity().hasPermissions(4)) return true; } catch(e) {}
    return false;
}

// ========== Layout ==========
var slotPositions = [];
var tabSlots = [];
var startX = 0;
var startY = -50;
var rowSpacing = 18;
var colSpacing = 18;
for (var row = 0; row < viewportRows; row++) {
    var y = startY + row * rowSpacing;
    for (var col = 0; col < numCols; col++) {
        var x = startX + col * colSpacing;
        slotPositions.push({x: x, y: y});
    }
}
function viewportToGlobal(slotIndex) {
    var localRow = Math.floor(slotIndex / numCols);
    var localCol = slotIndex % numCols;
    var globalRow = viewportRow + localRow;
    return globalRow * numCols + localCol;
}

// ========== Open GUI ==========
function interact(event) {
    var player = event.player;
    var api = event.API;
    lastBlock = event.block;
    lastPlayer = player;

    var bedrockMode = (player.getMainhandItem() && player.getMainhandItem().getName() === "minecraft:bedrock");
    var adminMode = player.isSneaking() && (bedrockMode || canEdit(player, lastBlock));
    if (player.isSneaking() && !adminMode) {
        player.message("§cYou don't have permission to edit this shop.");
        return;
    }

    var blockData = lastBlock.getStoreddata();
    storedSlotItems = loadShopItems(blockData);
    var storedTabItems = loadTabItems(blockData, 1);
    loadTabRowConfig(blockData);

    var totalSlots = totalRows * numCols;
    if (!storedSlotItems[currentPage]) {
        storedSlotItems[currentPage] = makeNullArray(totalSlots);
    }

    highlightedSlot = null;
    highlightLineIds = [];

    if (!guiRef) {
        guiRef = api.createCustomGui(176, 166, 0, true, player);
        var tabWidth = 25;
        var tabHeight = 28;
        var tabSpacing = 2;
        var tabStartX = 0;
        var tabY = -80;
        tabSlots = [];
        var tabX = tabStartX;
        var tabSlot = guiRef.addItemSlot(tabX + 4, tabY + 5);
        tabSlots.push(tabSlot);
        guiRef.addButton(102, "", tabX, tabY, tabWidth, tabHeight);
        mySlots = slotPositions.map(function(pos) {
            return guiRef.addItemSlot(pos.x, pos.y);
        });
        var scrollX = startX + (numCols * colSpacing) + 2;
        var scrollY = startY;
        guiRef.addButton(111, "↑", scrollX, scrollY, 18, 18);
        guiRef.addButton(112, "↓", scrollX, scrollY + 20, 18, 18);
        guiRef.addLabel(10, "", scrollX + 1, scrollY + 42, 0.7, 0.7);
        if (adminMode) {
            guiRef.addLabel(3, "§7Price:", 2, -100, 0.8, 0.8);
            guiRef.addTextField(100, 60, -104, 60, 18).setText("");
            guiRef.addButton(101, "Set", 125, -104, 35, 18);
            guiRef.addLabel(6, "§7Rows:", -105, -29, 0.8, 0.8);
            guiRef.addTextField(115, -105, -17, 40, 18).setText("" + totalRows);
            guiRef.addButton(116, "Set", -60, -17, 30, 18);
            guiRef.showPlayerInventory(3, 91, false);
        }
        if (storedTabItems && storedTabItems[0]) {
            try {
                var tabItem = player.getWorld().createItemFromNbt(api.stringToNbt(storedTabItems[0]));
                tabSlots[0].setStack(tabItem);
            } catch(e) {}
        }
        player.showCustomGui(guiRef);
    } else {
        if (storedTabItems && storedTabItems[0]) {
            try {
                var tabItem = player.getWorld().createItemFromNbt(api.stringToNbt(storedTabItems[0]));
                tabSlots[0].setStack(tabItem);
            } catch(e) {}
        }
    }
    // Highlight current tab
    if (adminMode && guiRef) {
        var tabWidth = 25;
        var tabHeight = 28;
        var tabStartX = 0;
        var tabY = -80;
        var highlightTabX = tabStartX;
        try {
            guiRef.removeComponent(20);
            guiRef.removeComponent(21);
            guiRef.removeComponent(22);
            guiRef.removeComponent(23);
        } catch(e) {}
        try {
            guiRef.addColoredLine(20, highlightTabX - 1, tabY - 1, highlightTabX + tabWidth + 1, tabY - 1, 0xFFFF00, 2);
            guiRef.addColoredLine(21, highlightTabX - 1, tabY + tabHeight + 1, highlightTabX + tabWidth + 1, tabY + tabHeight + 1, 0xFFFF00, 2);
            guiRef.addColoredLine(22, highlightTabX - 1, tabY - 1, highlightTabX - 1, tabY + tabHeight + 1, 0xFFFF00, 2);
            guiRef.addColoredLine(23, highlightTabX + tabWidth + 1, tabY - 1, highlightTabX + tabWidth + 1, tabY + tabHeight + 1, 0xFFFF00, 2);
        } catch(e) {}
    }
    updateVisibleSlots(player, api, adminMode);
    updateScrollIndicator();
    if (guiRef) guiRef.update();
}

function updateScrollIndicator() {
    if (!guiRef) return;
    var maxViewportRow = Math.max(0, totalRows - viewportRows);
    try {
        guiRef.removeComponent(10);
        var scrollX = startX + (numCols * colSpacing) + 2;
        var scrollY = startY;
        guiRef.addLabel(10, "§7" + (viewportRow + 1) + "/" + (maxViewportRow + 1), scrollX + 1, scrollY + 42, 0.7, 0.7);
    } catch(e) {}
}

function updateVisibleSlots(player, api, adminMode) {
    for (var i = 0; i < mySlots.length; i++) {
        mySlots[i].setStack(null);
        var globalIndex = viewportToGlobal(i);
        var pageData = storedSlotItems[0];
        if (pageData && globalIndex < pageData.length && pageData[globalIndex]) {
            try {
                var item = player.getWorld().createItemFromNbt(api.stringToNbt(pageData[globalIndex].displayNbt));
                var price = pageData[globalIndex].price;
                var lore = item.getLore();
                var loreArray = [];
                for (var j = 0; j < lore.length; j++) {
                    var line = lore[j];
                    if (line.indexOf("Price:") === -1) loreArray.push(line);
                }
                while (loreArray.length > 0 && loreArray[loreArray.length - 1] === "") loreArray.pop();
                loreArray.push("");
                loreArray.push("§aPrice: §e" + price + "¢");
                if (!adminMode) loreArray.push("§7Click to purchase");
                item.setLore(loreArray);
                mySlots[i].setStack(item);
            } catch(e) {}
        }
    }
}

function customGuiButton(event) {
    var player = event.player;
    var api = event.API;
    var adminMode = (player.getMainhandItem() && player.getMainhandItem().getName() === "minecraft:bedrock") || canEdit(player, lastBlock);
    var maxViewportRow = Math.max(0, totalRows - viewportRows);

    if (event.buttonId === 111) {
        if (viewportRow > 0) {
            savePageItems();
            viewportRow--;
            updateVisibleSlots(player, api, adminMode);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }
    if (event.buttonId === 112) {
        if (viewportRow < maxViewportRow) {
            savePageItems();
            viewportRow++;
            updateVisibleSlots(player, api, adminMode);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }
    if (event.buttonId === 116) {
        if (!adminMode) return;
        var rowsField = guiRef.getComponent(115);
        if (!rowsField) return;
        var inputText = rowsField.getText().trim();
        if (!inputText) { player.message("§cPlease enter a number!"); return; }
        var newRows = parseInt(inputText);
        if (isNaN(newRows) || newRows < 1 || newRows > 100) {
            player.message("§cInvalid! Enter 1-100.");
            return;
        }
        savePageItems();
        if (lastBlock) {
            var blockData = lastBlock.getStoreddata();
            var allItems = loadShopItems(blockData);
            var oldArray = allItems[0] || [];
            var newTotalSlots = newRows * numCols;
            var newArray = makeNullArray(newTotalSlots);
            var copyLimit = Math.min(oldArray.length, newTotalSlots);
            for (var i = 0; i < copyLimit; i++) newArray[i] = oldArray[i];
            allItems[0] = newArray;
            storedSlotItems = allItems;
            atomicSave(blockData, "ShopItems", allItems);
            totalRows = newRows;
            saveTabRowConfig(blockData, totalRows);
        }
        var maxVr = Math.max(0, totalRows - viewportRows);
        if (viewportRow > maxVr) viewportRow = maxVr;
        player.message("§aSet rows to §e" + totalRows);
        interact({player: player, API: api, block: lastBlock});
        return;
    }
    if (event.buttonId !== 101) return;
    if (!adminMode) return;
    var priceField = guiRef.getComponent(100);
    if (!priceField) return;
    var inputText = priceField.getText().trim();
    if (!inputText) { player.message("§cPlease enter a value!"); return; }

    // Tab slot highlighted -> rename tab
    var tabSlotIndex = tabSlots.indexOf(highlightedSlot);
    if (tabSlotIndex !== -1) {
        var tabItem = highlightedSlot.getStack();
        if (!tabItem || tabItem.isEmpty()) { player.message("§cNo item in tab slot!"); return; }
        tabItem.setCustomName(inputText);
        highlightedSlot.setStack(tabItem);
        player.message("§aRenamed tab to: " + inputText);
        saveTabItems();
        return;
    }

    if (!highlightedSlot) { player.message("§cClick a shop slot first."); return; }
    var price = parseInt(inputText);
    if (isNaN(price) || price < 0) { player.message("§cInvalid price!"); return; }
    var slotIndex = mySlots.indexOf(highlightedSlot);
    if (slotIndex === -1) return;
    var globalIndex = viewportToGlobal(slotIndex);
    var pageData = storedSlotItems[0];
    if (!pageData || !pageData[globalIndex]) { player.message("§cNo item in selected slot!"); return; }
    pageData[globalIndex].price = price;
    storedSlotItems[0] = pageData;
    savePageItems();
    player.message("§aSet price §e" + price + "¢");
    updateVisibleSlots(player, api, adminMode);
    if (guiRef) guiRef.update();
}

function customGuiSlotClicked(event) {
    var clickedSlot = event.slot;
    var stack = event.stack;
    var player = event.player;
    var api = event.API;
    var adminMode = (player.getMainhandItem() && player.getMainhandItem().getName() === "minecraft:bedrock") || canEdit(player, lastBlock);
    var slotIndex = mySlots.indexOf(clickedSlot);

    if (adminMode) {
        // Tab slot
        var clickedTabIndex = -1;
        for (var i = 0; i < tabSlots.length; i++) {
            if (tabSlots[i] === clickedSlot) { clickedTabIndex = i; break; }
        }
        if (clickedTabIndex !== -1) {
            highlightedSlot = clickedSlot;
            if (guiRef) guiRef.update();
            return;
        }
        if (slotIndex !== -1) {
            highlightedSlot = clickedSlot;
            for (var i = 0; i < highlightLineIds.length; i++) {
                try { guiRef.removeComponent(highlightLineIds[i]); } catch(e) {}
            }
            highlightLineIds = [];
            var pos = slotPositions[slotIndex];
            var x = pos.x, y = pos.y, w = 18, h = 18;
            highlightLineIds.push(guiRef.addColoredLine(1, x, y, x+w, y, 0xADD8E6, 2));
            highlightLineIds.push(guiRef.addColoredLine(2, x, y+h, x+w, y+h, 0xADD8E6, 2));
            highlightLineIds.push(guiRef.addColoredLine(3, x, y, x, y+h, 0xADD8E6, 2));
            highlightLineIds.push(guiRef.addColoredLine(4, x+w, y, x+w, y+h, 0xADD8E6, 2));
            if (guiRef) guiRef.update();
            return;
        }
        // Player inventory slot -> stock
        if (!highlightedSlot) return;
        var playerSlots = guiRef.getPlayerSlots();
        var pIndex = -1;
        for (var i = 0; i < playerSlots.length; i++) {
            if (playerSlots[i] === clickedSlot) { pIndex = i; break; }
        }
        if (pIndex !== -1 && stack && !stack.isEmpty()) {
            var hIndex = mySlots.indexOf(highlightedSlot);
            if (hIndex === -1) return;
            var gIndex = viewportToGlobal(hIndex);
            var pageData = storedSlotItems[0];
            if (!pageData) { pageData = makeNullArray(slotPositions.length); storedSlotItems[0] = pageData; }
            pageData[gIndex] = { displayNbt: stack.getItemNbt().toJsonString(), price: 0 };
            storedSlotItems[0] = pageData;
            savePageItems();
            mySlots[hIndex].setStack(stack);
            clickedSlot.setStack(null);
            if (guiRef) guiRef.update();
            player.message("§aStocked. Set a price to sell.");
            return;
        }
        // Remove item (highlighted slot + empty hand)
        if (stack === null || (stack && stack.isEmpty())) {
            if (!highlightedSlot) return;
            var hIndex2 = mySlots.indexOf(highlightedSlot);
            if (hIndex2 !== -1) {
                var gIndex2 = viewportToGlobal(hIndex2);
                var pageData2 = storedSlotItems[0];
                var old = pageData2 ? pageData2[gIndex2] : null;
                if (old && old.displayNbt) {
                    try {
                        var oldItem = player.getWorld().createItemFromNbt(api.stringToNbt(old.displayNbt));
                        player.giveItem(oldItem);
                    } catch(e) {}
                }
                if (pageData2) pageData2[gIndex2] = null;
                storedSlotItems[0] = pageData2;
                savePageItems();
                mySlots[hIndex2].setStack(null);
                highlightedSlot = null;
                for (var i = 0; i < highlightLineIds.length; i++) {
                    try { guiRef.removeComponent(highlightLineIds[i]); } catch(e) {}
                }
                highlightLineIds = [];
                if (guiRef) guiRef.update();
            }
            return;
        }
        return;
    }

    // Buyer mode
    var slotIndex = mySlots.indexOf(clickedSlot);
    if (slotIndex === -1) return;
    var globalIndex = viewportToGlobal(slotIndex);
    var pageData = storedSlotItems[0];
    if (!pageData || globalIndex >= pageData.length) return;
    var entry = pageData[globalIndex];
    if (!entry) return;
    var price = entry.price;
    if (price === null || price === undefined || price <= 0) {
        player.message("§cThis item has no price set!");
        return;
    }
    if (countCoins(player) < price) {
        player.message("§cNot enough coins! Need: " + price + "¢");
        return;
    }
    try {
        var item = player.getWorld().createItemFromNbt(api.stringToNbt(entry.displayNbt));
        removeCoins(player, price);
        player.giveItem(item);
        pageData[globalIndex] = null;
        storedSlotItems[0] = pageData;
        savePageItems();
        mySlots[slotIndex].setStack(null);
        if (guiRef) guiRef.update();
        player.message("§aPurchased for §e" + price + "¢!");
    } catch(e) {
        player.message("§cError: " + e);
    }
}

function customGuiClosed(event) {
    if (!skipSaveOnClose) savePageItems();
    guiRef = null;
    highlightedSlot = null;
    highlightLineIds = [];
}

function savePageItems() {
    if (!lastBlock) return;
    var blockData = lastBlock.getStoreddata();
    atomicSave(blockData, "ShopItems", storedSlotItems);
}

function saveTabItems() {
    if (!lastBlock || !tabSlots || tabSlots.length === 0) return;
    var blockData = lastBlock.getStoreddata();
    var tabItems = tabSlots.map(function(slot) {
        var stack = slot.getStack();
        return (stack && !stack.isEmpty()) ? stack.getItemNbt().toJsonString() : null;
    });
    atomicSave(blockData, "TabItems", tabItems);
}

function countCoins(player) {
    var stoneTotal = 0, coalTotal = 0, emeraldTotal = 0;
    var inv = player.getInventory();
    for (var i = 0; i < inv.getSize(); i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty()) {
            var name = stack.getName();
            if (name === "coins:stone_coin") stoneTotal += stack.getStackSize();
            else if (name === "coins:coal_coin") coalTotal += stack.getStackSize();
            else if (name === "coins:emerald_coin") emeraldTotal += stack.getStackSize();
        }
    }
    return stoneTotal + (coalTotal * STONE_TO_COAL) + (emeraldTotal * STONE_TO_COAL * COAL_TO_EMERALD);
}

function removeCoins(player, amount) {
    var remaining = amount;
    var inv = player.getInventory();
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty() && stack.getName() === "coins:stone_coin") {
            var a = stack.getStackSize();
            if (a <= remaining) { inv.setSlot(i, null); remaining -= a; }
            else { stack.setStackSize(a - remaining); remaining = 0; }
        }
    }
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty() && stack.getName() === "coins:coal_coin") {
            var a = stack.getStackSize();
            var v = a * STONE_TO_COAL;
            if (v <= remaining) { inv.setSlot(i, null); remaining -= v; }
            else {
                var need = Math.ceil(remaining / STONE_TO_COAL);
                stack.setStackSize(a - need);
                var over = need * STONE_TO_COAL - remaining;
                remaining = 0;
                if (over > 0) player.giveItem(player.getWorld().createItem("coins:stone_coin", over));
            }
        }
    }
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty() && stack.getName() === "coins:emerald_coin") {
            var a = stack.getStackSize();
            var v = a * STONE_TO_COAL * COAL_TO_EMERALD;
            if (v <= remaining) { inv.setSlot(i, null); remaining -= v; }
            else {
                var need = Math.ceil(remaining / (STONE_TO_COAL * COAL_TO_EMERALD));
                stack.setStackSize(a - need);
                var over = need * STONE_TO_COAL * COAL_TO_EMERALD - remaining;
                remaining = 0;
                var cCoal = Math.floor(over / STONE_TO_COAL);
                var cStone = over % STONE_TO_COAL;
                if (cCoal > 0) player.giveItem(player.getWorld().createItem("coins:coal_coin", cCoal));
                if (cStone > 0) player.giveItem(player.getWorld().createItem("coins:stone_coin", cStone));
            }
        }
    }
}

function init(event) {}
