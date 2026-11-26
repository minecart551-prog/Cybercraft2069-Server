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
// admin mode decided at interact time (shift+right click); GUI callbacks have no sneaking state
var adminSession = {};
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
var ID_EARNINGS_LABEL = 7;
var ID_WITHDRAW_BUTTON = 117;
var ID_MODEL_BUTTON = 118;
var MODEL_OPTIONS = ["minecraft:barrier", "decocraft:cooler"];
var MODEL_LABELS = ["Invisible", "Cooler"];

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

// Admin widgets live inside the GUI bounds (x 0..176, y 0..166) so they are always visible
function ensureAdminWidgets(player, api) {
    if (!guiRef) return;
    if (!guiRef.getComponent(3)) guiRef.addLabel(3, "§7Price:", 2, -100, 0.8, 0.8);
    if (!guiRef.getComponent(ID_PRICE_FIELD)) guiRef.addTextField(ID_PRICE_FIELD, 30, -104, 90, 18).setText("");
    if (!guiRef.getComponent(ID_SET_PRICE_BUTTON)) guiRef.addButton(ID_SET_PRICE_BUTTON, "Set", 125, -104, 35, 18);
    if (!guiRef.getComponent(6)) guiRef.addLabel(6, "§7Rows:", -105, -29, 0.8, 0.8);
    if (!guiRef.getComponent(ID_ROWS_FIELD)) guiRef.addTextField(ID_ROWS_FIELD, -105, -17, 40, 18).setText("" + totalRows);
    if (!guiRef.getComponent(ID_SET_ROWS_BUTTON)) guiRef.addButton(ID_SET_ROWS_BUTTON, "Set", -60, -17, 30, 18);
    if (!guiRef.getComponent(ID_EARNINGS_LABEL)) {
        guiRef.addLabel(ID_EARNINGS_LABEL, "§6Earnings: §e" + getEarnings(lastBlock) + "¢", -105, 52, 80, 12);
    }
    if (!guiRef.getComponent(ID_WITHDRAW_BUTTON)) {
        guiRef.addButton(ID_WITHDRAW_BUTTON, "Withdraw", -105, 66, 60, 18);
    }
    if (!guiRef.getComponent(ID_MODEL_BUTTON)) {
        guiRef.addButton(ID_MODEL_BUTTON, modelButtonLabel(lastBlock), -105, 86, 70, 18);
    }
    // player inventory is needed in edit mode to stock items / change the tab icon
    if (guiRef.getPlayerSlots().length === 0) guiRef.showPlayerInventory(3, 91, false);
    updateEarningsLabel(api);
}

// ========== Open GUI ==========
function interact(event) {
    var player = event.player;
    var api = event.API;
    lastBlock = event.block;
    lastPlayer = player;

    var bedrockMode = (player.getMainhandItem() && player.getMainhandItem().getName() === "minecraft:bedrock");
    var wantsAdmin = player.isSneaking() || bedrockMode;
    var adminMode = bedrockMode || (player.isSneaking() && canEdit(player, lastBlock));
    if (wantsAdmin && !adminMode) {
        player.message("§cYou don't have permission to edit this shop.");
        return;
    }
    adminSession[player.getName()] = adminMode;

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
        var tabStartX = -1;
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
            ensureAdminWidgets(player, api);
        }
        if (storedTabItems && storedTabItems[0]) {
            try {
                var tabItem = player.getWorld().createItemFromNbt(api.stringToNbt(storedTabItems[0]));
                tabSlots[0].setStack(tabItem);
            } catch(e) {}
        }
        player.showCustomGui(guiRef);
    } else {
        if (adminMode) ensureAdminWidgets(player, api);
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
        var tabStartX = -1;
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
    updateEarningsLabel(api);
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
                var price = pageData[globalIndex].price || 0;
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

// Persist whatever is in a highlighted slot back into stored data.
// Tab slots go into TabItems; shop slots keep their price and store a clean NBT string.
function syncHighlightedSlot(slot, isTabSlot, player, api) {
    if (isTabSlot) {
        saveTabItems();
        return;
    }
    var hIndex = mySlots.indexOf(slot);
    if (hIndex === -1) return;
    var gIndex = viewportToGlobal(hIndex);
    var pageData = storedSlotItems[0];
    if (!pageData) { pageData = makeNullArray(slotPositions.length); }
    var old = pageData[gIndex];
    var price = old ? old.price : 0;
    var stack = slot.getStack();
    if (stack && !stack.isEmpty()) {
        // strip price/purchase lore before storing so it can be rebuilt on render
        var lore = stack.getLore();
        var cleanLore = [];
        for (var j = 0; j < lore.length; j++) {
            var line = lore[j];
            if (line.indexOf("Price:") === -1 && line.indexOf("Click to purchase") === -1) cleanLore.push(line);
        }
        while (cleanLore.length > 0 && cleanLore[cleanLore.length - 1] === "") cleanLore.pop();
        stack.setLore(cleanLore);
        pageData[gIndex] = { displayNbt: stack.getItemNbt().toJsonString(), price: price };
    } else {
        pageData[gIndex] = null;
    }
    storedSlotItems[0] = pageData;
    savePageItems();
    updateVisibleSlots(player, api, !!adminSession[player.getName()]);
}

function customGuiButton(event) {
    var player = event.player;
    var api = event.API;
    var adminMode = !!adminSession[player.getName()] || (player.getMainhandItem() && player.getMainhandItem().getName() === "minecraft:bedrock");
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
    if (event.buttonId === ID_MODEL_BUTTON) {
        if (!adminMode) return;
        var idx = (getModelIndex(lastBlock) + 1) % MODEL_OPTIONS.length;
        applyModel(lastBlock, idx);
        try {
            var btn = guiRef.getComponent(ID_MODEL_BUTTON);
            if (btn) btn.setLabel(modelButtonLabel(lastBlock));
        } catch(e) {}
        player.message("§aModel set to §e" + MODEL_LABELS[idx]);
        if (guiRef) guiRef.update();
        return;
    }
    if (event.buttonId === ID_WITHDRAW_BUTTON) {
        if (!adminMode) return;
        var earnings = getEarnings(lastBlock);
        if (earnings <= 0) {
            player.message("§cNo earnings to withdraw.");
            return;
        }
        setEarnings(lastBlock, 0);
        giveCoins(player, earnings);
        updateEarningsLabel(api);
        player.message("§aWithdrew §e" + earnings + "¢ §aof shop earnings.");
        if (guiRef) guiRef.update();
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
        updateVisibleSlots(player, api, adminMode);
        updateScrollIndicator();
        if (guiRef) guiRef.update();
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
    var adminMode = !!adminSession[player.getName()] || (player.getMainhandItem() && player.getMainhandItem().getName() === "minecraft:bedrock");
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
        // click on an ordinary (non-tab, non-shop) slot, e.g. player inventory -> stock/change item
        if (!highlightedSlot) return;
        var isTabSlot = (tabSlots.indexOf(highlightedSlot) !== -1);
        try {
            var slotStack = highlightedSlot.getStack();
            var maxStack = stack ? stack.getMaxStackSize() : 64;

            if (stack && !stack.isEmpty()) {
                if (slotStack && !slotStack.isEmpty() && slotStack.getDisplayName() === stack.getDisplayName()) {
                    // merge into existing stack
                    var total = slotStack.getStackSize() + stack.getStackSize();
                    if (total <= maxStack) {
                        slotStack.setStackSize(total);
                        highlightedSlot.setStack(slotStack);
                        player.removeItem(stack, stack.getStackSize());
                    } else {
                        var overflow = total - maxStack;
                        slotStack.setStackSize(maxStack);
                        highlightedSlot.setStack(slotStack);
                        var overflowCopy = player.getWorld().createItemFromNbt(stack.getItemNbt());
                        overflowCopy.setStackSize(overflow);
                        player.removeItem(stack, stack.getStackSize());
                        player.giveItem(overflowCopy);
                    }
                } else {
                    // replace: return old item to player, put a clean copy in the slot
                    var itemCopy = player.getWorld().createItemFromNbt(stack.getItemNbt());
                    if (slotStack && !slotStack.isEmpty()) player.giveItem(slotStack);
                    highlightedSlot.setStack(itemCopy);
                    player.removeItem(stack, stack.getStackSize());
                }
                syncHighlightedSlot(highlightedSlot, isTabSlot, player, api);
            } else if (slotStack && !slotStack.isEmpty()) {
                // empty hand on highlighted slot -> take item back
                player.giveItem(slotStack);
                highlightedSlot.setStack(null);
                syncHighlightedSlot(highlightedSlot, isTabSlot, player, api);
                highlightedSlot = null;
                for (var i = 0; i < highlightLineIds.length; i++) {
                    try { guiRef.removeComponent(highlightLineIds[i]); } catch(e) {}
                }
                highlightLineIds = [];
            }
            if (guiRef) guiRef.update();
        } catch(e) {
            player.message("§cError: " + e);
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
        if (!removeCoins(player, price)) {
            player.message("§cNot enough coins!");
            return;
        }
        player.giveItem(item);
        addEarnings(lastBlock, price);
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
    if (!skipSaveOnClose) {
        savePageItems();
        saveTabItems();
    }
    if (event && event.player) delete adminSession[event.player.getName()];
    guiRef = null;
    highlightedSlot = null;
    highlightLineIds = [];
    viewportRow = 0;
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

// Block model toggle (invisible barrier / cooler)
function getModelIndex(block) {
    try {
        var v = block.getStoreddata().get("ShopModel");
        if (v === null || v === undefined) return 1; // default to cooler
        var n = parseInt(String(v));
        return (isNaN(n) || n < 0 || n > 1) ? 1 : n;
    } catch(e) { return 1; }
}

function applyModel(block, index) {
    try {
        block.setModel(MODEL_OPTIONS[index]);
        block.getStoreddata().put("ShopModel", index);
    } catch(e) {}
}

function modelButtonLabel(block) {
    return "Model: " + MODEL_LABELS[getModelIndex(block)];
}

// Shared shop earnings (in cents) stored in block storeddata
function getEarnings(block) {
    try {
        var v = block.getStoreddata().get("Earnings");
        if (v === null || v === undefined) return 0;
        var n = parseFloat(String(v));
        return isNaN(n) ? 0 : Math.floor(n);
    } catch(e) { return 0; }
}

function setEarnings(block, value) {
    try { block.getStoreddata().put("Earnings", Math.floor(value)); } catch(e) {}
}

function addEarnings(block, amount) {
    setEarnings(block, getEarnings(block) + amount);
}

function updateEarningsLabel(api) {
    if (!guiRef) return;
    try {
        var lbl = guiRef.getComponent(ID_EARNINGS_LABEL);
        if (lbl) lbl.setText("§6Earnings: §e" + getEarnings(lastBlock) + "¢");
    } catch(e) {}
}

function giveCoins(player, amount) {
    var emeralds = Math.floor(amount / (STONE_TO_COAL * COAL_TO_EMERALD));
    amount -= emeralds * STONE_TO_COAL * COAL_TO_EMERALD;
    var coals = Math.floor(amount / STONE_TO_COAL);
    var stones = amount % STONE_TO_COAL;
    if (emeralds > 0) player.giveItem(player.getWorld().createItem("coins:emerald_coin", emeralds));
    if (coals > 0) player.giveItem(player.getWorld().createItem("coins:coal_coin", coals));
    if (stones > 0) player.giveItem(player.getWorld().createItem("coins:stone_coin", stones));
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
    if (countCoins(player) < amount) return false;
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
    return true;
}

function init(event) {
    // restore the chosen model on block load
    applyModel(event.block, getModelIndex(event.block));
}
