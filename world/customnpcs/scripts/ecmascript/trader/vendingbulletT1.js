// ============================================================
//  BULLET VENDING MACHINE — Edit ammo items here
// ============================================================

var CONFIG_MAX_PAGES = 1;

var CONFIG_TAB_ICONS = [
    { id: "tacz:ammo", nbt: {"AmmoId": "tacz:9mm"} },
];

var CONFIG_TAB_NAMES = [
    "Ammo",
];

var CONFIG_TAB_ROWS = [
    6,
];

var CONFIG_SHOP_ITEMS = [
    // Tab 0 — Ammo
    [
        { id: "tacz:ammo", count: 10, price: 1,   nbt: {"AmmoId": "tacz:9mm"},                       lore: [] },
        { id: "tacz:ammo", count: 10, price: 13,  nbt: {"AmmoId": "tacz:308"},                       lore: [] },
        { id: "tacz:ammo", count: 10, price: 13,  nbt: {"AmmoId": "tacz:12g"},                       lore: [] },
        { id: "tacz:ammo", count: 10, price: 130, nbt: {"AmmoId": "tacz:30_06"},                     lore: [] },
        null, null, null, null, null,
        { id: "tacz:ammo", count: 10, price: 65,  nbt: {"AmmoId": "cyber_armorer:bullet_pistol"},       lore: [] },
        { id: "tacz:ammo", count: 10, price: 130, nbt: {"AmmoId": "cyber_armorer:bullet_pistol_smart"}, lore: [] },
    ],
];

// ============================================================

var guiRef;
var mySlots = [];
var tabSlots = [];
var storedSlotItems = {};
var currentPage = 0;
var maxPages = CONFIG_MAX_PAGES;

// Viewport system
var viewportRow = 0;
var viewportRows = 6;
var totalRows = CONFIG_TAB_ROWS[0];
var numCols = 9;

// Currency conversion rates
var STONE_TO_COAL    = 100;
var COAL_TO_EMERALD  = 100;

// Component IDs
var ID_TAB_BASE    = 102;
var ID_SCROLL_UP   = 111;
var ID_SCROLL_DOWN = 112;

// ========== Layout ==========
var slotPositions = [];
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

function makeNullArray(n) {
    var a = new Array(n);
    for (var i = 0; i < n; i++) { a[i] = null; }
    return a;
}

// ========== SNBT helpers (from gun shop) ==========
function snbtValue(v) {
    if (v === null || v === undefined) return "0";
    if (typeof v === "string" && v.charAt(0) === "[") return v;
    if (typeof v === "string") return '"' + v.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    if (typeof v === "boolean") return v ? "1b" : "0b";
    if (typeof v === "number") {
        if (v === Math.floor(v)) return String(v);
        return v + "d";
    }
    if (Array.isArray(v)) {
        var parts = [];
        for (var i = 0; i < v.length; i++) parts.push(snbtValue(v[i]));
        return "[" + parts.join(",") + "]";
    }
    if (typeof v === "object") return snbtCompound(v);
    return String(v);
}

function snbtCompound(obj) {
    var parts = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            parts.push(key + ":" + snbtValue(obj[key]));
        }
    }
    return "{" + parts.join(",") + "}";
}

function buildSnbt(cfg, loreArr) {
    var tagObj = cfg.nbt ? cfg.nbt : {};
    var tag = JSON.parse(JSON.stringify(tagObj));

    if (loreArr && loreArr.length > 0) {
        if (!tag.display) tag.display = {};
        tag.display.Lore = loreArr;
    }

    var tagParts = [];
    for (var key in tag) {
        if (!tag.hasOwnProperty(key)) continue;
        if (key === "display") {
            var dispParts = [];
            var disp = tag[key];
            for (var dk in disp) {
                if (!disp.hasOwnProperty(dk)) continue;
                if (dk === "Lore") {
                    var loreParts = [];
                    for (var li = 0; li < disp[dk].length; li++) {
                        loreParts.push('"' + String(disp[dk][li]).replace(/\\/g,"\\\\").replace(/"/g,'\\"') + '"');
                    }
                    dispParts.push("Lore:[" + loreParts.join(",") + "]");
                } else {
                    dispParts.push(dk + ":" + snbtValue(disp[dk]));
                }
            }
            tagParts.push("display:{" + dispParts.join(",") + "}");
        } else {
            tagParts.push(key + ":" + snbtValue(tag[key]));
        }
    }

    var count = cfg.count || 1;
    return '{id:"' + cfg.id + '",Count:' + count + 'b,tag:{' + tagParts.join(",") + '}}';
}

// ========== Build Shop Data ==========
function buildShopDataFromConfig(player, api) {
    var shopData = {};
    for (var t = 0; t < CONFIG_MAX_PAGES; t++) {
        var rows = CONFIG_TAB_ROWS[t] || 5;
        var totalSlots = rows * numCols;
        var arr = makeNullArray(totalSlots);
        var items = CONFIG_SHOP_ITEMS[t] || [];
        for (var idx = 0; idx < items.length && idx < totalSlots; idx++) {
            var cfg = items[idx];
            if (!cfg) { arr[idx] = null; continue; }
            try {
                var loreArr = cfg.lore ? cfg.lore.slice() : [];
                loreArr.push("");
                loreArr.push("\u00a7aPrice: \u00a7e" + (cfg.price || 0) + "\u00a2");

                var snbt = buildSnbt(cfg, loreArr);
                var item = player.world.createItemFromNbt(api.stringToNbt(snbt));
                item.setLore(loreArr);

                arr[idx] = {
                    displayNbt: item.getItemNbt().toJsonString(),
                    price: cfg.price || 0
                };
            } catch(e) {
                arr[idx] = null;
            }
        }
        shopData[t] = arr;
    }
    return shopData;
}

// ========== Block Init ==========
function init(event) {
    event.block.setModel("minecraft:barrier");
}

// ========== Interact / Open GUI ==========
function interact(event) {
    var player = event.player;
    var api = event.API;

    maxPages = CONFIG_MAX_PAGES;
    totalRows = CONFIG_TAB_ROWS[currentPage] || 5;

    storedSlotItems = buildShopDataFromConfig(player, api);

    var totalSlots = totalRows * numCols;
    if (!storedSlotItems[currentPage]) {
        storedSlotItems[currentPage] = makeNullArray(totalSlots);
    }

    if (!guiRef) {
        guiRef = api.createCustomGui(176, 166, 0, true, player);

        // Tab (single)
        var tabWidth = 25;
        var tabHeight = 28;
        var tabStartX = 0;
        var tabY = -80;
        tabSlots = [];
        for (var i = 0; i < maxPages; i++) {
            var tabX = tabStartX + i * (tabWidth + 2);
            var tabSlot = guiRef.addItemSlot(tabX + 4, tabY + 5);
            tabSlots.push(tabSlot);
            guiRef.addButton(ID_TAB_BASE + i, "", tabX, tabY, tabWidth, tabHeight);
        }

        // Item slots
        mySlots = slotPositions.map(function(pos) {
            return guiRef.addItemSlot(pos.x, pos.y);
        });

        // Scroll buttons
        var scrollX = startX + (numCols * colSpacing) + 2;
        var scrollY = startY;
        guiRef.addButton(ID_SCROLL_UP,   "↑", scrollX, scrollY,      18, 18);
        guiRef.addButton(ID_SCROLL_DOWN, "↓", scrollX, scrollY + 20, 18, 18);
        guiRef.addLabel(10, "", scrollX + 1, scrollY + 42, 0.7, 0.7);

        // Tab icon
        for (var i = 0; i < tabSlots.length; i++) {
            try {
                var iconCfg = CONFIG_TAB_ICONS[i];
                var iconItem;
                if (iconCfg) {
                    var iconSnbt = buildSnbt({ id: iconCfg.id, count: 1, nbt: iconCfg.nbt || {}, lore: [] }, null);
                    iconItem = player.world.createItemFromNbt(api.stringToNbt(iconSnbt));
                } else {
                    iconItem = player.world.createItemFromNbt(api.stringToNbt('{id:"minecraft:barrier",Count:1b,tag:{}}'));
                }
                iconItem.setCustomName(CONFIG_TAB_NAMES[i] || ("Tab " + (i + 1)));
                tabSlots[i].setStack(iconItem);
            } catch(e) {}
        }

        player.showCustomGui(guiRef);
    }

    // Highlight current tab
    try {
        guiRef.removeComponent(20);
        guiRef.removeComponent(21);
        guiRef.removeComponent(22);
        guiRef.removeComponent(23);
    } catch(e) {}
    try {
        var tabWidth = 25;
        var tabHeight = 28;
        var tabStartX = 0;
        var tabY = -80;
        var hx = tabStartX + currentPage * (tabWidth + 2);
        guiRef.addColoredLine(20, hx - 1,           tabY - 1,           hx + tabWidth + 1, tabY - 1,           0xFFFF00, 2);
        guiRef.addColoredLine(21, hx - 1,           tabY + tabHeight + 1, hx + tabWidth + 1, tabY + tabHeight + 1, 0xFFFF00, 2);
        guiRef.addColoredLine(22, hx - 1,           tabY - 1,           hx - 1,            tabY + tabHeight + 1, 0xFFFF00, 2);
        guiRef.addColoredLine(23, hx + tabWidth + 1, tabY - 1,           hx + tabWidth + 1, tabY + tabHeight + 1, 0xFFFF00, 2);
    } catch(e) {}

    updateVisibleSlots(player, api);
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

function updateVisibleSlots(player, api) {
    for (var i = 0; i < mySlots.length; i++) {
        mySlots[i].setStack(null);
        var globalIndex = viewportToGlobal(i);
        var pageData = storedSlotItems[currentPage];
        if (pageData && globalIndex < pageData.length && pageData[globalIndex]) {
            try {
                var entry = pageData[globalIndex];
                var item = player.world.createItemFromNbt(api.stringToNbt(entry.displayNbt));
                mySlots[i].setStack(item);
            } catch(e) {}
        }
    }
}

function customGuiButton(event) {
    var player = event.player;
    var api = event.API;
    var maxViewportRow = Math.max(0, totalRows - viewportRows);

    if (event.buttonId === ID_SCROLL_UP) {
        if (viewportRow > 0) {
            viewportRow--;
            updateVisibleSlots(player, api);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }

    if (event.buttonId === ID_SCROLL_DOWN) {
        if (viewportRow < maxViewportRow) {
            viewportRow++;
            updateVisibleSlots(player, api);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }
}

function customGuiSlotClicked(event) {
    var clickedSlot = event.slot;
    var player = event.player;
    var api = event.API;
    var slotIndex = mySlots.indexOf(clickedSlot);

    if (slotIndex === -1) return;

    var globalIndex = viewportToGlobal(slotIndex);
    var pageData = storedSlotItems[currentPage];
    if (!pageData || globalIndex >= pageData.length) return;

    var entry = pageData[globalIndex];
    if (!entry) return;

    var item = mySlots[slotIndex].getStack();
    if (!item || item.isEmpty()) return;

    var cfg = (CONFIG_SHOP_ITEMS[currentPage] || [])[globalIndex];
    if (!cfg) return;

    var price = entry.price;
    if (price === null || price === undefined) {
        player.message("§cThis item has no price set!");
        return;
    }

    // Block purchase if hotbar is full
    var inv2 = player.getInventory();
    var hotbarFull = true;
    for (var h = 0; h < 8; h++) {
        var hs = inv2.getSlot(h);
        if (!hs || hs.isEmpty()) { hotbarFull = false; break; }
    }
    if (hotbarFull) {
        player.message("§cYour hotbar is full! Make some room before purchasing.");
        return;
    }

    var playerCoins = countPlayerCoins(player);
    if (playerCoins < price) {
        player.message("§cNot enough coins! Need: §e" + price + "¢ §c, Have: §e" + playerCoins + "¢");
        return;
    }

    removeCoins(player, price);

    try {
        var cleanLore = cfg.lore && cfg.lore.length > 0 ? cfg.lore.slice() : null;
        var snbt = buildSnbt(cfg, cleanLore);
        var purchaseItem = player.world.createItemFromNbt(api.stringToNbt(snbt));
        if (cleanLore) purchaseItem.setLore(cleanLore);
        player.giveItem(purchaseItem);
        player.message("§aPurchased §e" + (cfg.count || 1) + "x §afor §e" + price + "¢!");
    } catch(e) {
        player.message("§cError purchasing item: " + e);
    }
}

function customGuiClosed(event) {
    guiRef = null;
    viewportRow = 0;
    currentPage = 0;
}

// ========== Currency Helpers ==========
function countPlayerCoins(player) {
    var stoneTotal   = 0;
    var coalTotal    = 0;
    var emeraldTotal = 0;
    var inv = player.getInventory();
    for (var i = 0; i < inv.getSize(); i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty()) {
            var name = stack.getName();
            if      (name === "coins:stone_coin")   stoneTotal   += stack.getStackSize();
            else if (name === "coins:coal_coin")    coalTotal    += stack.getStackSize();
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
            var stackAmount = stack.getStackSize();
            if (stackAmount <= remaining) { inv.setSlot(i, null); remaining -= stackAmount; }
            else { stack.setStackSize(stackAmount - remaining); remaining = 0; }
        }
    }

    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty() && stack.getName() === "coins:coal_coin") {
            var stackAmount = stack.getStackSize();
            var stoneValue = stackAmount * STONE_TO_COAL;
            if (stoneValue <= remaining) { inv.setSlot(i, null); remaining -= stoneValue; }
            else {
                var coalsNeeded = Math.ceil(remaining / STONE_TO_COAL);
                stack.setStackSize(stackAmount - coalsNeeded);
                var overpaid = (coalsNeeded * STONE_TO_COAL) - remaining;
                remaining = 0;
                if (overpaid > 0) player.giveItem(player.world.createItem("coins:stone_coin", overpaid));
            }
        }
    }

    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty() && stack.getName() === "coins:emerald_coin") {
            var stackAmount = stack.getStackSize();
            var stoneValue = stackAmount * STONE_TO_COAL * COAL_TO_EMERALD;
            if (stoneValue <= remaining) { inv.setSlot(i, null); remaining -= stoneValue; }
            else {
                var emeraldsNeeded = Math.ceil(remaining / (STONE_TO_COAL * COAL_TO_EMERALD));
                stack.setStackSize(stackAmount - emeraldsNeeded);
                var overpaid = (emeraldsNeeded * STONE_TO_COAL * COAL_TO_EMERALD) - remaining;
                remaining = 0;
                var changeCoal  = Math.floor(overpaid / STONE_TO_COAL);
                var changeStone = overpaid % STONE_TO_COAL;
                if (changeCoal  > 0) player.giveItem(player.world.createItem("coins:coal_coin",  changeCoal));
                if (changeStone > 0) player.giveItem(player.world.createItem("coins:stone_coin", changeStone));
            }
        }
    }
}