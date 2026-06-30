// ============================================================================
// SHOP RENTAL SYSTEM - Based on chestTrader7 + Rental Features
// ============================================================================
// Combines features from: npc_auctioneer, adblock_rent, chestTrader7
// 
// FEATURES:
// - Rent shop for 1-10 days (configurable daily cost)
// - Multi-page shop with tabs (like chestTrader7)
// - Item stacking with per-unit pricing
// - NPC-stored data (persists per NPC)
// - Claim system for previous renter's items/earnings
// - Auto-extend rent if same player re-rents
// - Admin controls with barrier item
// - Coin currency system (stone/coal/emerald)
//
// INSTALLATION:
// 1. Place on NPC > Advanced > Scripts
// 2. Set language to "ECMAScript"
// 3. Paste this script
//
// USAGE:
// - Players: Right-click to browse/buy or rent shop
// - Renters: Shop GUI opens directly with claim button on left
// - Admins (hold barrier): Full admin controls
// ============================================================================

// ============================================================================
// JAVA TYPES
// ============================================================================
var SYS = Java.type("java.lang.System");

// ============================================================================
// CONSTANTS
// ============================================================================
var MAX_RENT_DAYS = 10;
var RENT_COST_PER_DAY = 0; // Free to rent
var STONE_TO_COAL = 100;
var COAL_TO_EMERALD = 100;

// GUI IDs
var GUI_RENT = 2001;
var GUI_ADMIN = 2003;
var GUI_APPEARANCE = 2004;

// Component IDs - Rent
var RENT_TF_DAYS = 4;
var RENT_BTN_PAY = 6;
var RENT_BTN_CANCEL = 7;

// Component IDs - Admin
var ADM_TF_COST = 22;
var ADM_BTN_SAVE = 25;
var ADM_BTN_CLEAR = 26;
var ADM_BTN_CLOSE = 27;

// Shop system (from chestTrader7)
var ID_PRICE_FIELD = 100;
var ID_SET_PRICE_BUTTON = 101;
var ID_TAB_BASE = 102;
var ID_SCROLL_UP = 111;
var ID_SCROLL_DOWN = 112;
var ID_ROWS_FIELD = 115;
var ID_SET_ROWS_BUTTON = 116;

// Rental info display IDs (on left side of shop)
var ID_LBL_INFO_TITLE = 200;
var ID_LBL_RENTER = 201;
var ID_LBL_EARNINGS = 202;
var ID_BTN_CLAIM = 203;
var ID_LBL_RENT_EXPIRY = 204;
var ID_BTN_RENT = 205;
var ID_BTN_APPEARANCE = 206;

// Appearance GUI
var ID_APP_TITLE_FIELD = 300;
var ID_APP_SKIN_FIELD = 301;
var ID_APP_BTN_SAVE = 302;
var ID_APP_BTN_CANCEL = 303;

// ============================================================================
// STATE VARIABLES
// ============================================================================
var guiRef = null;
var mySlots = [];
var tabSlots = [];
var highlightLineIds = [];
var highlightedSlot = null;
var lastNpc = null;
var playerNpcMap = {};
var playerGuiRef = {};
var playerRentNpc = {};
var storedSlotItems = {};
var currentPage = 0;
var maxPages = 7;
var totalRows = 20;
var viewportRow = 0;
var viewportRows = 6;
var numCols = 9;
var skipSaveOnClose = false;
var slotPositions = [];
var storedTabItems = [];
var rentalInfo = null;
var modifyMode = false;

// ============================================================================
// CORRUPTION RESISTANCE
// ============================================================================
function safeJSONParse(jsonString, defaultValue) {
    if (!jsonString || jsonString.length === 0) return defaultValue;
    try { return JSON.parse(jsonString); } catch(e) { return defaultValue; }
}

function safeGetData(npcData, key, defaultValue) {
    if (!npcData.has(key)) return defaultValue;
    var rawData = npcData.get(key);
    if (!rawData || rawData.length === 0) return defaultValue;
    return rawData;
}

function atomicSave(npcData, key, value) {
    try {
        var jsonString = JSON.stringify(value);
        if (!jsonString || jsonString.length === 0) return false;
        JSON.parse(jsonString);
        npcData.put(key, jsonString);
        return true;
    } catch(e) { return false; }
}

function makeNullArray(n) {
    var a = new Array(n);
    for (var i = 0; i < n; i++) a[i] = null;
    return a;
}

// ============================================================================
// DATA LOAD/SAVE
// ============================================================================
function loadShopItems(npcData) {
    var rawData = safeGetData(npcData, "ShopItems", null);
    if (rawData === null) {
        var emptyData = {};
        atomicSave(npcData, "ShopItems", emptyData);
        return emptyData;
    }
    var parsed = safeJSONParse(rawData, null);
    return parsed !== null ? parsed : (atomicSave(npcData, "ShopItems", {}) || {});
}

function saveShopItems(npcData, items) {
    atomicSave(npcData, "ShopItems", items);
}

function loadTabItems(npcData, expectedLength) {
    var rawData = safeGetData(npcData, "TabItems", null);
    if (rawData === null) {
        var defaultArray = makeNullArray(expectedLength);
        atomicSave(npcData, "TabItems", defaultArray);
        return defaultArray;
    }
    var parsed = safeJSONParse(rawData, null);
    if (parsed === null || !Array.isArray(parsed)) {
        var defaultArray = makeNullArray(expectedLength);
        atomicSave(npcData, "TabItems", defaultArray);
        return defaultArray;
    }
    while (parsed.length < expectedLength) parsed.push(null);
    if (parsed.length > expectedLength) parsed = parsed.slice(0, expectedLength);
    return parsed;
}

function saveTabItems(npcData, items) {
    if (!lastNpc || !tabSlots || tabSlots.length === 0) return;
    var tabItemStrings = tabSlots.map(function(slot) {
        var stack = slot.getStack();
        return (stack && !stack.isEmpty()) ? stack.getItemNbt().toJsonString() : null;
    });
    atomicSave(npcData, "TabItems", tabItemStrings);
}

function loadTabRows(npcData, currentPage) {
    var rawData = safeGetData(npcData, "TabRows", null);
    if (rawData === null) return 20;
    var parsed = safeJSONParse(rawData, {});
    if (parsed[currentPage] !== undefined) return parsed[currentPage];
    return 20;
}

function saveTabRowConfig(npcData, rows) {
    var rawData = safeGetData(npcData, "TabRows", null);
    var tabRowsConfig = safeJSONParse(rawData, {});
    tabRowsConfig[currentPage] = rows;
    atomicSave(npcData, "TabRows", tabRowsConfig);
}

function loadMaxPages(npcData) {
    if (npcData.has("MaxPages")) {
        try { maxPages = parseInt(npcData.get("MaxPages")); if (isNaN(maxPages) || maxPages < 1) maxPages = 1; if (maxPages > 10) maxPages = 10; } catch(e) { maxPages = 7; }
    } else { maxPages = 7; }
}

function saveMaxPages(npcData, pages) {
    npcData.put("MaxPages", "" + pages);
}

// ============================================================================
// WORLD DATA (shared with shop_rent_block.js)
// ============================================================================
var WORLD_DATA_KEY = "ShopRentData"

function getWorldData(world) {
    var wdata = world.getStoreddata()
    if (!wdata.has(WORLD_DATA_KEY)) {
        var empty = { playerShops: {}, npcRegistry: {} }
        wdata.put(WORLD_DATA_KEY, JSON.stringify(empty))
        return empty
    }
    try { return JSON.parse(wdata.get(WORLD_DATA_KEY)) } catch(e) { return { playerShops: {}, npcRegistry: {} } }
}

function saveWorldData(world, data) {
    world.getStoreddata().put(WORLD_DATA_KEY, JSON.stringify(data))
}

function getPlayerData(world, playerUUID) {
    var wd = getWorldData(world)
    if (!wd.playerShops[playerUUID]) {
        wd.playerShops[playerUUID] = { ownedShops: [], expiredShops: [], claimableCoins: 0, claimableItems: [] }
        saveWorldData(world, wd)
    }
    return wd.playerShops[playerUUID]
}

function savePlayerData(world, playerUUID, data) {
    var wd = getWorldData(world)
    wd.playerShops[playerUUID] = data
    saveWorldData(world, wd)
}

function getNpcRegistry(world) {
    var wd = getWorldData(world)
    if (!wd.npcRegistry) { wd.npcRegistry = {}; saveWorldData(world, wd) }
    return wd.npcRegistry
}

function registerNpc(world, npcUUID, npcDisplayName, pos) {
    var reg = getNpcRegistry(world)
    reg[npcUUID] = {
        displayName: npcDisplayName,
        x: pos.getX(),
        y: pos.getY(),
        z: pos.getZ()
    }
    var wd = getWorldData(world)
    wd.npcRegistry = reg
    saveWorldData(world, wd)
}

// ============================================================================
// RENTAL DATA
// ============================================================================
function loadRentalInfo(npcData) {
    var rawData = safeGetData(npcData, "RentalInfo", null);
    if (rawData === null) {
        var emptyInfo = { renterName: "", renterUUID: "", rentedDate: 0, expiryDate: 0, rentCostPerDay: RENT_COST_PER_DAY, totalEarnings: 0, npcCoord: "" };
        atomicSave(npcData, "RentalInfo", emptyInfo);
        return emptyInfo;
    }
    var parsed = safeJSONParse(rawData, null);
    if (parsed === null) {
        var emptyInfo = { renterName: "", renterUUID: "", rentedDate: 0, expiryDate: 0, rentCostPerDay: RENT_COST_PER_DAY, totalEarnings: 0, npcCoord: "" };
        atomicSave(npcData, "RentalInfo", emptyInfo);
        return emptyInfo;
    }
    // Verify this data belongs to this NPC by checking coordinates
    if (parsed.npcCoord && lastNpc) {
        var pos = lastNpc.getPos();
        var currentCoord = pos.getX() + "," + pos.getY() + "," + pos.getZ();
        if (parsed.npcCoord !== currentCoord) {
            // Data belongs to a different NPC (shared stored data from duplication)
            var emptyInfo = { renterName: "", renterUUID: "", rentedDate: 0, expiryDate: 0, rentCostPerDay: RENT_COST_PER_DAY, totalEarnings: 0, npcCoord: "" };
            return emptyInfo;
        }
    }
    return parsed;
}

function saveRentalInfo(npcData, info) {
    // Add current NPC coordinates to the data to prevent cross-NPC confusion
    if (lastNpc) {
        var pos = lastNpc.getPos();
        info.npcCoord = pos.getX() + "," + pos.getY() + "," + pos.getZ();
    }
    atomicSave(npcData, "RentalInfo", info);
}

function loadClaimItems(npcData) {
    var rawData = safeGetData(npcData, "ClaimItems", null);
    if (rawData === null) { atomicSave(npcData, "ClaimItems", []); return []; }
    var parsed = safeJSONParse(rawData, null);
    if (parsed === null || !Array.isArray(parsed)) { atomicSave(npcData, "ClaimItems", []); return []; }
    return parsed;
}

function saveClaimItems(npcData, items) {
    atomicSave(npcData, "ClaimItems", items);
}

function loadClaimCoins(npcData) {
    var rawData = safeGetData(npcData, "ClaimCoins", null);
    if (rawData === null) { atomicSave(npcData, "ClaimCoins", 0); return 0; }
    var parsed = safeJSONParse(rawData, null);
    if (parsed === null || isNaN(parsed)) { atomicSave(npcData, "ClaimCoins", 0); return 0; }
    return parsed;
}

function saveClaimCoins(npcData, coins) {
    atomicSave(npcData, "ClaimCoins", coins);
}

function loadClaimOwner(npcData) {
    var rawData = safeGetData(npcData, "ClaimOwner", null);
    if (rawData === null) { atomicSave(npcData, "ClaimOwner", ""); return ""; }
    return rawData;
}

function saveClaimOwner(npcData, uuid) {
    atomicSave(npcData, "ClaimOwner", uuid);
}

// ============================================================================
// TIME HELPERS
// ============================================================================
function now() {
    return SYS.currentTimeMillis();
}

function isExpired(info) {
    if (!info || !info.renterName || info.renterName === "") return true;
    return now() >= info.expiryDate;
}

function timeLeftStr(info) {
    if (!info || !info.renterName) return "AVAILABLE";
    var rem = info.expiryDate - now();
    if (rem <= 0) return "EXPIRED";
    var hrs = Math.floor(rem / 3600000);
    var d = Math.floor(hrs / 24);
    var h = hrs % 24;
    if (d > 0) return d + "d " + h + "h";
    if (h > 0) return h + "h";
    return Math.floor(rem / 60000) + "m";
}

// ============================================================================
// CURRENCY
// ============================================================================
function countPlayerCoins(player) {
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
    var world = player.getWorld();
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
                if (overpaid > 0) player.giveItem(world.createItem("coins:stone_coin", overpaid));
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
                var changeCoal = Math.floor(overpaid / STONE_TO_COAL);
                var changeStone = overpaid % STONE_TO_COAL;
                if (changeCoal > 0) player.giveItem(world.createItem("coins:coal_coin", changeCoal));
                if (changeStone > 0) player.giveItem(world.createItem("coins:stone_coin", changeStone));
            }
        }
    }
    player.updatePlayerInventory();
    return remaining <= 0;
}

function giveCoins(player, amount) {
    if (amount <= 0) return true;
    var world = player.getWorld();
    var remaining = amount;
    if (remaining >= STONE_TO_COAL * COAL_TO_EMERALD) {
        var emCount = Math.floor(remaining / (STONE_TO_COAL * COAL_TO_EMERALD));
        while (emCount > 0) {
            var give = Math.min(emCount, 64);
            var stack = world.createItem("coins:emerald_coin", give);
            if (!player.giveItem(stack)) player.dropItem(stack);
            emCount -= give;
        }
        remaining = remaining % (STONE_TO_COAL * COAL_TO_EMERALD);
    }
    if (remaining >= STONE_TO_COAL) {
        var coalCount = Math.floor(remaining / STONE_TO_COAL);
        while (coalCount > 0) {
            var give = Math.min(coalCount, 64);
            var stack = world.createItem("coins:coal_coin", give);
            if (!player.giveItem(stack)) player.dropItem(stack);
            coalCount -= give;
        }
        remaining = remaining % STONE_TO_COAL;
    }
    if (remaining > 0) {
        while (remaining > 0) {
            var give = Math.min(remaining, 64);
            var stack = world.createItem("coins:stone_coin", give);
            if (!player.giveItem(stack)) player.dropItem(stack);
            remaining -= give;
        }
    }
    player.updatePlayerInventory();
    return true;
}

function formatPrice(cents) {
    var dollars = Math.floor(cents / 100);
    var c = cents % 100;
    return "$" + dollars + "." + (c < 10 ? "0" + c : c);
}

function formatPriceNoSign(cents) {
    var dollars = Math.floor(cents / 100);
    var c = cents % 100;
    return dollars + "." + (c < 10 ? "0" + c : c);
}

function parsePriceInput(str) {
    str = str.trim();
    // Input is in dollars, convert to cents
    var dollars = parseFloat(str);
    if (isNaN(dollars) || dollars < 0) return 0;
    return Math.floor(dollars * 100);
}

// ============================================================================
// LAYOUT
// ============================================================================
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

// ============================================================================
// MAIN INTERACT HANDLER (Uses chestTrader7's interact as base)
// ============================================================================
function interact(event) {
    var player = event.player;
    var api = event.API;
    var playerUUID = player.getUUID();
    var npcPos = event.npc.getPos();
    var npcCoordKey = npcPos.getX() + "," + npcPos.getY() + "," + npcPos.getZ();
    
    // If player already has a GUI open for a DIFFERENT NPC, close ALL their GUIs first
    var existingNpcCoord = playerNpcMap[playerUUID];
    if (existingNpcCoord && existingNpcCoord !== npcCoordKey) {
        // Close any existing GUI for this player
        var existingGui = playerGuiRef[playerUUID];
        if (existingGui) {
            try { existingGui.close(); } catch(e) {}
        }
        try { guiRef.close(); } catch(e) {}
        guiRef = null;
        delete playerGuiRef[playerUUID];
        delete playerNpcMap[playerUUID];
        delete playerRentNpc[playerUUID];
    }
    
    lastNpc = event.npc;
    // Store the NPC coordinates for this player's GUI
    playerNpcMap[playerUUID] = npcCoordKey;
    var npcData = lastNpc.getStoreddata();
    rentalInfo = loadRentalInfo(npcData);
    var adminMode = (player.getMainhandItem() && !player.getMainhandItem().isEmpty() && player.getMainhandItem().getName() === "minecraft:barrier");

    // Admin goes to admin settings
    if (adminMode) {
        openAdminGui(player, api, npcData);
        return;
    }

    // Always open shop GUI for everyone
    openShop(player, api, npcData);
}

// ============================================================================
// SHOP GUI (Based on chestTrader7, always opens for everyone)
// ============================================================================
function openShop(player, api, npcData) {
    rentalInfo = loadRentalInfo(npcData);
    var adminMode = (player.getMainhandItem() && !player.getMainhandItem().isEmpty() && player.getMainhandItem().getName() === "minecraft:barrier");
    // Previous renter who stopped (can clear/claim items, but NOT edit shop items)
    var isPreviousRenter = rentalInfo.renterName === player.getName() && (!rentalInfo.expiryDate || rentalInfo.expiryDate === 0);
    // Allow edit if: admin, current renter, or employee
    var isOwner = rentalInfo.renterUUID === player.getUUID();
    var isEmployee = false;
    if (!isOwner && lastNpc && rentalInfo.renterUUID) {
        // Check if current player is a global employee of the renter
        var world = lastNpc.getWorld();
        var pd = getPlayerData(world, rentalInfo.renterUUID);
        var employees = pd.employees || [];
        // Check both UUID and player name (for offline employees added by name)
        var playerUUID = player.getUUID();
        var playerName = player.getName();
        for (var i = 0; i < employees.length; i++) {
            var emp = employees[i];
            // Match by UUID or by name (if employee was added while offline)
            if (emp === playerUUID || emp === playerName) {
                isEmployee = true;
                break;
            }
        }
    }
    var isOwnerOrEmployee = isOwner || isEmployee;
    // Both owners and employees need modifyMode to edit, otherwise they can purchase as customers
    var canEditShop = adminMode || ((isOwner || isEmployee) && modifyMode);
    
    // ===== LEFT SIDE INFO PANEL =====
    // Show renter view if actively renting or if employee of the renter
    var isActivelyRenting = (rentalInfo.renterUUID === player.getUUID() || isOwnerOrEmployee) && rentalInfo.renterUUID && !isExpired(rentalInfo);
    
    // Load max pages
    loadMaxPages(npcData);

    // Load row configuration for current tab
    totalRows = loadTabRows(npcData, currentPage);

    // Load shop items
    storedSlotItems = loadShopItems(npcData);

    // Cleanup ghost tabs
    for (var key in storedSlotItems) {
        if (storedSlotItems.hasOwnProperty(key)) {
            var tabIndex = parseInt(key);
            if (tabIndex >= maxPages) delete storedSlotItems[key];
        }
    }

    // Load tab items
    storedTabItems = loadTabItems(npcData, maxPages);

    var totalSlots = totalRows * numCols;
    if (!storedSlotItems[currentPage]) {
        storedSlotItems[currentPage] = makeNullArray(totalSlots);
    }

    highlightedSlot = null;
    highlightLineIds = [];

    // Create new GUI
    guiRef = api.createCustomGui(176, 166, 0, true, player);

    // Tabs (top)
    var tabWidth = 25;
    var tabHeight = 28;
    var tabSpacing = 2;
    var tabStartX = 0;
    var tabY = -80;
    tabSlots = [];
    for (var i = 0; i < maxPages; i++) {
        var tabX = tabStartX + i * (tabWidth + tabSpacing);
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
    guiRef.addButton(ID_SCROLL_UP, "\u2191", scrollX, scrollY, 18, 18);
    guiRef.addButton(ID_SCROLL_DOWN, "\u2193", scrollX, scrollY + 20, 18, 18);

    // Scroll position indicator
    guiRef.addLabel(10, "", scrollX + 1, scrollY + 42, 0.7, 0.7);

    // Check if this is a previous renter who stopped (has renter info but no active rental)
    var isPreviousRenter = rentalInfo.renterName === player.getName() && (!rentalInfo.expiryDate || rentalInfo.expiryDate === 0);
    
    if (isActivelyRenting && !modifyMode) {
        // Sync earnings from world data for accurate display
        if (lastNpc) {
            var world = lastNpc.getWorld();
            var pd = getPlayerData(world, rentalInfo.renterUUID);
            var npcPos2 = lastNpc.getPos();
            var npcCoordKey2 = npcPos2.getX() + "," + npcPos2.getY() + "," + npcPos2.getZ();
            if (pd.ownedShops) {
                for (var si = 0; si < pd.ownedShops.length; si++) {
                if (pd.ownedShops[si].npcCoord === npcCoordKey2) {
                    rentalInfo.totalEarnings = pd.ownedShops[si].totalEarnings || 0;
                    break;
                }
                }
            }
        }
        // Customer/Employee view - show shop with Modify Shop button
        var titleText = isOwner ? "\u00a76\u00a7lYour Shop" : "\u00a76\u00a7lShop (Employee)";
        guiRef.addLabel(ID_LBL_INFO_TITLE, titleText, -128, -76, 100, 12);
        guiRef.addLabel(ID_LBL_RENTER, "\u00a77Owner: \u00a7f" + rentalInfo.renterName, -128, -62, 100, 10);
        guiRef.addLabel(ID_LBL_RENT_EXPIRY, "\u00a77Expires: \u00a7f" + timeLeftStr(rentalInfo), -128, -50, 100, 10);
        guiRef.addLabel(ID_LBL_EARNINGS, "\u00a77Earnings: \u00a7a" + formatPrice(rentalInfo.totalEarnings || 0), -128, -38, 100, 10);

        // Modify Shop button - available for both owner and employees
        guiRef.addButton(209, "\u00a76\u00a7lModify Shop", -128, -24, 80, 18);
    } else if (isActivelyRenting && modifyMode) {
        // Editor view - show management controls
        guiRef.addLabel(ID_LBL_INFO_TITLE, "\u00a76\u00a7lYour Shop", -128, -76, 100, 12);
        guiRef.addLabel(ID_LBL_RENTER, "\u00a77Owner: \u00a7f" + rentalInfo.renterName, -128, -62, 100, 10);
        guiRef.addLabel(ID_LBL_RENT_EXPIRY, "\u00a77Expires: \u00a7f" + timeLeftStr(rentalInfo), -128, -50, 100, 10);
        guiRef.addLabel(ID_LBL_EARNINGS, "\u00a77Earnings: \u00a7a" + formatPrice(rentalInfo.totalEarnings || 0), -128, -38, 100, 10);

        // Stop Renting button
        guiRef.addButton(207, "\u00a7c\u00a7lStop Renting", -128, -24, 80, 18);

        // Clear Shop button
        guiRef.addButton(208, "\u00a7e\u00a7lClear Shop", -128, 6, 80, 18);

        // Appearance button
        guiRef.addButton(ID_BTN_APPEARANCE, "\u00a7d\u00a7lAppearance", -128, 26, 80, 18);

        // Rent extend button
        guiRef.addButton(ID_BTN_RENT, "\u00a7a\u00a7l+ Extend", -128, 46, 80, 18);

        // Done Editing button
        guiRef.addButton(210, "\u00a77Done Editing", -128, 66, 80, 18);

        // Price/Name section
        guiRef.addLabel(3, "\u00a77Price/Name:", 2, -100, 0.8, 0.8);
        guiRef.addTextField(ID_PRICE_FIELD, 60, -104, 60, 18).setText("");
        guiRef.addButton(ID_SET_PRICE_BUTTON, "Set", 125, -104, 35, 18);

        // Shop Editor label
        guiRef.addLabel(1, "\u00a76Shop Editor", 2, 63, 1.0, 1.0);

        // Show player inventory for stocking items
        guiRef.showPlayerInventory(11, 91, false);
    } else if (isPreviousRenter && rentalInfo.renterName) {
        // Previous renter who stopped - show clear/rent options
        guiRef.addLabel(ID_LBL_INFO_TITLE, "\u00a76\u00a7lYour Shop", -128, -76, 100, 12);
        guiRef.addLabel(ID_LBL_RENTER, "\u00a77Status: \u00a7eStopped", -128, -62, 100, 10);
        guiRef.addLabel(209, "\u00a77Your items and layouts", -128, -50, 100, 10);
        guiRef.addLabel(210, "\u00a77are still here", -128, -38, 100, 10);

        // Clear Shop button
        guiRef.addButton(208, "\u00a7e\u00a7lClear Shop", -128, -24, 80, 18);

        // Rent Shop button
        guiRef.addLabel(211, "\u00a77Cost per day: \u00a7e" + formatPrice(RENT_COST_PER_DAY), -128, 6, 100, 10);
        guiRef.addLabel(212, "\u00a77Days (1-" + MAX_RENT_DAYS + "):", -128, 20, 100, 10);
        guiRef.addTextField(RENT_TF_DAYS, -128, 32, 50, 16).setText("1");
        guiRef.addButton(RENT_BTN_PAY, "\u00a7a\u00a7lRent Shop", -128, 52, 80, 18);
    } else if (isExpired(rentalInfo) || !rentalInfo.renterName) {
        // Shop available for rent - show rent controls
        guiRef.addLabel(ID_LBL_INFO_TITLE, "\u00a76\u00a7lShop Rental", -128, -76, 100, 12);
        guiRef.addLabel(ID_LBL_RENTER, "\u00a77Status: \u00a7aAvailable", -128, -62, 100, 10);
        guiRef.addLabel(209, "\u00a77Cost per day: \u00a7e" + formatPrice(RENT_COST_PER_DAY), -128, -50, 100, 10);
        guiRef.addLabel(210, "\u00a77Your balance: \u00a7e" + formatPrice(countPlayerCoins(player)), -128, -38, 100, 10);
        guiRef.addLabel(211, "\u00a77Days (1-" + MAX_RENT_DAYS + "):", -128, -20, 100, 10);
        guiRef.addTextField(RENT_TF_DAYS, -128, -8, 50, 16).setText("1");
        guiRef.addLabel(212, "\u00a77Total: \u00a7a" + formatPrice(RENT_COST_PER_DAY), -128, 12, 100, 10);
        guiRef.addButton(RENT_BTN_PAY, "\u00a7a\u00a7lRent Shop", -128, 30, 80, 18);
    } else {
        // Customer view - show shop info
        guiRef.addLabel(ID_LBL_INFO_TITLE, "\u00a76\u00a7lShop", -128, -76, 100, 12);
        guiRef.addLabel(ID_LBL_RENTER, "\u00a77Owner: \u00a7f" + rentalInfo.renterName, -128, -62, 100, 10);
        guiRef.addLabel(ID_LBL_RENT_EXPIRY, "\u00a77Time left: \u00a7f" + timeLeftStr(rentalInfo), -128, -50, 100, 10);
    }

    // Admin-only rows config
    if (adminMode) {
        guiRef.addLabel(6, "\u00a77Total Rows:", -105, -29, 0.8, 0.8);
        guiRef.addTextField(ID_ROWS_FIELD, -105, -17, 40, 18).setText("" + totalRows);
        guiRef.addButton(ID_SET_ROWS_BUTTON, "Set", -60, -17, 30, 18);
    }

    // Load tab items
    for (var i = 0; i < tabSlots.length; i++) {
        if (storedTabItems[i]) {
            try {
                var tabItem = player.world.createItemFromNbt(api.stringToNbt(storedTabItems[i]));
                tabSlots[i].setStack(tabItem);
            } catch(e) {}
        } else {
            tabSlots[i].setStack(null);
        }
    }

    player.showCustomGui(guiRef);
    // Track this GUI for the player
    playerGuiRef[player.getUUID()] = guiRef;
    
    // Add highlight around current tab for editors
    if (canEditShop && guiRef && currentPage < maxPages) {
        var tabWidth = 25;
        var tabHeight = 28;
        var tabSpacing = 2;
        var tabStartX = 0;
        var tabY = -80;
        var highlightTabX = tabStartX + currentPage * (tabWidth + tabSpacing);
        try { guiRef.removeComponent(20); } catch(e) {}
        try { guiRef.removeComponent(21); } catch(e) {}
        try { guiRef.removeComponent(22); } catch(e) {}
        try { guiRef.removeComponent(23); } catch(e) {}
        try {
            guiRef.addColoredLine(20, highlightTabX - 1, tabY - 1, highlightTabX + tabWidth + 1, tabY - 1, 0xFFFF00, 2);
            guiRef.addColoredLine(21, highlightTabX - 1, tabY + tabHeight + 1, highlightTabX + tabWidth + 1, tabY + tabHeight + 1, 0xFFFF00, 2);
            guiRef.addColoredLine(22, highlightTabX - 1, tabY - 1, highlightTabX - 1, tabY + tabHeight + 1, 0xFFFF00, 2);
            guiRef.addColoredLine(23, highlightTabX + tabWidth + 1, tabY - 1, highlightTabX + tabWidth + 1, tabY + tabHeight + 1, 0xFFFF00, 2);
        } catch(e) {}
    }

    updateVisibleSlots(player, api, canEditShop);
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
        guiRef.addLabel(10, "\u00a77" + (viewportRow + 1) + "/" + (maxViewportRow + 1), scrollX + 1, scrollY + 42, 0.7, 0.7);
    } catch(e) {}
}

function updateVisibleSlots(player, api, canEditShop) {
    for (var i = 0; i < mySlots.length; i++) {
        mySlots[i].setStack(null);
        var globalIndex = viewportToGlobal(i);
        // Check if storedSlotItems[currentPage] exists before accessing it
        if (storedSlotItems[currentPage] && globalIndex < storedSlotItems[currentPage].length && storedSlotItems[currentPage][globalIndex]) {
            try {
                var item = player.world.createItemFromNbt(api.stringToNbt(storedSlotItems[currentPage][globalIndex]));
                var price = null;
                var lore = item.getLore();
                for (var j = 0; j < lore.length; j++) {
                    var line = lore[j];
                    if (line.indexOf("Price:") !== -1) {
                        var priceStr = line.replace(/\u00a7./g, "");
                        // Try to match $X or $X.XX format
                        var dollarMatch = priceStr.match(/Price:\s*\$(\d+(?:\.\d+)?)/);
                        if (dollarMatch && dollarMatch[1]) {
                            price = Math.floor(parseFloat(dollarMatch[1]) * 100);
                            break;
                        }
                        // Try to match X\u00a2 format
                        var centMatch = priceStr.match(/Price:\s*(\d+)\u00a2/);
                        if (centMatch && centMatch[1]) {
                            price = parseInt(centMatch[1]);
                            break;
                        }
                    }
                }
                if (price !== null && price !== undefined) {
                    var existingLore = item.getLore();
                    var loreArray = [];
                    for (var j = 0; j < existingLore.length; j++) {
                        var line = existingLore[j];
                        if (line.indexOf("Price:") === -1 && line.indexOf("Click to purchase") === -1) loreArray.push(line);
                    }
                    while (loreArray.length > 0 && loreArray[loreArray.length - 1] === "") loreArray.pop();
                    loreArray.push("");
                    // Display in $ if >= $1, otherwise in \u00a2
                    if (price >= 100) {
                        var dollars = Math.floor(price / 100);
                        var cents = price % 100;
                        loreArray.push("\u00a7aPrice: \u00a7e$" + dollars + (cents > 0 ? "." + (cents < 10 ? "0" + cents : cents) : ""));
                    } else {
                        loreArray.push("\u00a7aPrice: \u00a7e" + price + "\u00a2");
                    }
                    if (!canEditShop) loreArray.push("\u00a77Click to purchase");
                    item.setLore(loreArray);
                }
                mySlots[i].setStack(item);
            } catch(e) {}
        }
    }
}

// ============================================================================
// BUTTON HANDLER (chestTrader7 + rental additions)
// ============================================================================
function customGuiButton(event) {
    var player = event.player;
    var api = event.API;
    var gui = event.gui;
    var buttonId = event.buttonId;
    var npcData = lastNpc ? lastNpc.getStoreddata() : null;
    if (!npcData) return;

    var adminMode = (player.getMainhandItem() && !player.getMainhandItem().isEmpty() && player.getMainhandItem().getName() === "minecraft:barrier");
    rentalInfo = loadRentalInfo(npcData);
    var isPreviousRenter = rentalInfo.renterName === player.getName() && (!rentalInfo.expiryDate || rentalInfo.expiryDate === 0);
    // Previous renters can only purchase, not edit
    var isOwner = rentalInfo.renterUUID === player.getUUID();
    var isEmployee = false;
    if (!isOwner && lastNpc && rentalInfo.renterUUID) {
        // Check if current player is a global employee of the renter
        var world = lastNpc.getWorld();
        var pd = getPlayerData(world, rentalInfo.renterUUID);
        var employees = pd.employees || [];
        // Check both UUID and player name (for offline employees added by name)
        var playerUUID = player.getUUID();
        var playerName = player.getName();
        for (var i = 0; i < employees.length; i++) {
            var emp = employees[i];
            if (emp === playerUUID || emp === playerName) {
                isEmployee = true;
                break;
            }
        }
    }
    // Both owners and employees need modifyMode to edit, otherwise they can purchase as customers
    var canEditShop = adminMode || ((isOwner || isEmployee) && modifyMode);
    var isOwnerOrEmployee = isOwner || isEmployee;
    var maxViewportRow = Math.max(0, totalRows - viewportRows);

    // Handle Done Editing button - return to customer view
    if (buttonId === 210 && guiRef && isOwnerOrEmployee) {
        modifyMode = false;
        // Save current page items before switching views
        savePageItems(npcData);
        saveTabItems(npcData, storedTabItems);
        // Prevent customGuiClosed from overwriting our save with empty data
        skipSaveOnClose = true;
        // Refresh the GUI to show customer view (items preserved in slots)
        openShop(player, api, npcData);
        return;
    }

    // Handle Stop Renting button (for modify mode) - owner only
    if (buttonId === 207 && guiRef && isOwner && !isExpired(rentalInfo)) {
        handleStopRenting(player, npcData);
        return;
    }

    // Handle Modify Shop button - toggle to editor view with tabs, items, and controls
    if (buttonId === 209 && guiRef && isOwnerOrEmployee) {
        modifyMode = !modifyMode;
        // Save current items to storage before switching views
        saveShopItems(npcData, storedSlotItems);
        saveTabItems(npcData, storedTabItems);
        // Prevent customGuiClosed from overwriting our save with empty data
        skipSaveOnClose = true;
        openShop(player, api, npcData);
        return;
    }

    // Handle Appearance button (for modify mode) - owner or employee
    if (buttonId === ID_BTN_APPEARANCE && guiRef && isOwnerOrEmployee) {
        openAppearanceGui(player, api);
        return;
    }

    // Handle Appearance GUI buttons
    if (gui.getID() === GUI_APPEARANCE) {
        if (buttonId === ID_APP_BTN_SAVE) {
            handleAppearanceSave(player, api, gui);
            return;
        }
        if (buttonId === ID_APP_BTN_CANCEL) {
            player.closeGui();
            modifyMode = true;
            openShop(player, api, npcData);
            return;
        }
        return;
    }

    // Handle Clear Shop button - allow previous renters too
    if (buttonId === 208 && guiRef && canEditShop) {
        handleClearShop(player, npcData);
        return;
    }

    // Handle Extend/Rent button (from renter view)
    if (buttonId === ID_BTN_RENT && canEditShop) {
        // Don't close GUI - just open rent GUI directly to avoid event handler issues
        // If expired, go to rent GUI; otherwise extend current
        if (isExpired(rentalInfo) || !rentalInfo.renterName) {
            openRentGui(player, api, npcData);
        } else {
            openRentExtendGui(player, api, npcData);
        }
        return;
    }

    // Handle Rent Shop button (from available shop view or previous renter view)
    if (buttonId === RENT_BTN_PAY && (isExpired(rentalInfo) || !rentalInfo.renterName)) {
        handleRentPayment(player, api, npcData, gui);
        return;
    }

    // Handle Rent GUI buttons
    if (gui.getID() === GUI_RENT) {
        // Use the NPC that was stored when the rent GUI was created
        var rentNpc = playerRentNpc[player.getUUID()];
        if (rentNpc) {
            lastNpc = rentNpc;
            npcData = rentNpc.getStoreddata();
        }
        if (buttonId === RENT_BTN_CANCEL) { 
            player.closeGui(); 
            // Re-open shop after closing rent
            openShop(player, api, npcData);
            return; 
        }
        if (buttonId === RENT_BTN_PAY) {
            handleRentPayment(player, api, npcData, gui);
            return;
        }
        return;
    }

    // Handle Admin GUI buttons
    if (gui.getID() === GUI_ADMIN) {
        if (buttonId === ADM_BTN_CLOSE) {
            player.closeGui();
            return;
        }
        if (buttonId === ADM_BTN_SAVE) {
            handleAdminSave(player, api, npcData, gui);
            return;
        }
        if (buttonId === ADM_BTN_CLEAR) {
            handleAdminClear(player, api, npcData);
            return;
        }
        if (buttonId === 28) {
            handleAdminDeleteNpc(player, api, npcData);
            return;
        }
        return;
    }

    // === Shop Editor buttons (chestTrader7 style) ===

    // Scroll buttons
    if (buttonId === ID_SCROLL_UP) {
        if (viewportRow > 0) {
            savePageItems(npcData);
            viewportRow--;
            updateVisibleSlots(player, api, canEditShop);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }
    if (buttonId === ID_SCROLL_DOWN) {
        if (viewportRow < maxViewportRow) {
            savePageItems(npcData);
            viewportRow++;
            updateVisibleSlots(player, api, canEditShop);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }

    // Tab buttons
    if (buttonId >= ID_TAB_BASE && buttonId < ID_TAB_BASE + maxPages) {
        var tabIndex = buttonId - ID_TAB_BASE;
        if (canEditShop) {
            highlightedSlot = tabSlots[tabIndex];
        }
        if (tabIndex !== currentPage) {
            savePageItems(npcData);
            saveTabItems(npcData, storedTabItems);
            currentPage = tabIndex;
            viewportRow = 0;
            highlightedSlot = null;
            highlightLineIds = [];
            // Simply reload and refresh - NO function calls that might redirect
            storedSlotItems = loadShopItems(npcData);
            totalRows = loadTabRows(npcData, currentPage);
            var totalSlots = totalRows * numCols;
            if (!storedSlotItems[currentPage]) {
                storedSlotItems[currentPage] = makeNullArray(totalSlots);
            }
            storedTabItems = loadTabItems(npcData, maxPages);
            for (var i = 0; i < tabSlots.length; i++) {
                if (storedTabItems[i]) {
                    try {
                        var tabItem = player.world.createItemFromNbt(api.stringToNbt(storedTabItems[i]));
                        tabSlots[i].setStack(tabItem);
                    } catch(e) {}
                } else {
                    tabSlots[i].setStack(null);
                }
            }
            updateVisibleSlots(player, api, canEditShop);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }

    // Set Rows button (admin only)
    if (buttonId === ID_SET_ROWS_BUTTON) {
        if (!adminMode) return;
        var rowsField = gui.getComponent(ID_ROWS_FIELD);
        if (!rowsField) return;
        var inputText = rowsField.getText().trim();
        if (!inputText) { player.message("\u00a7cPlease enter a number!"); return; }
        var newRows = parseInt(inputText);
        if (isNaN(newRows) || newRows < 1 || newRows > 100) { player.message("\u00a7cInvalid! Enter 1-100."); return; }

        savePageItems(npcData);
        var allItems = loadShopItems(npcData);
        var oldArray = allItems[currentPage] || [];
        var newTotalSlots = newRows * numCols;
        var newArray = makeNullArray(newTotalSlots);
        var copyLimit = Math.min(oldArray.length, newTotalSlots);
        for (var i = 0; i < copyLimit; i++) newArray[i] = oldArray[i];
        allItems[currentPage] = newArray;
        storedSlotItems = allItems;
        atomicSave(npcData, "ShopItems", allItems);
        totalRows = newRows;
        saveTabRowConfig(npcData, totalRows);

        var maxViewportRow = Math.max(0, totalRows - viewportRows);
        if (viewportRow > maxViewportRow) viewportRow = maxViewportRow;

        player.message("\u00a7aSet total rows to \u00a7e" + totalRows + " \u00a7afor this tab!");
        openShop(player, api, npcData);
        return;
    }

    // Set Price button
    if (buttonId === ID_SET_PRICE_BUTTON) {
        if (!canEditShop) return;
        var priceField = gui.getComponent(ID_PRICE_FIELD);
        if (!priceField) return;
        var inputText = priceField.getText().trim();
        if (!inputText) { player.message("\u00a7cPlease enter a value!"); return; }

        var tabSlotIndex = tabSlots.indexOf(highlightedSlot);
        if (tabSlotIndex !== -1) {
            var tabItem = highlightedSlot.getStack();
            if (!tabItem || tabItem.isEmpty()) { player.message("\u00a7cNo item in selected tab slot!"); return; }
            tabItem.setCustomName(inputText);
            highlightedSlot.setStack(tabItem);
            player.message("\u00a7aRenamed tab to: " + inputText);
            saveTabItems(npcData, storedTabItems);
            if (guiRef) guiRef.update();
            return;
        }

        if (!highlightedSlot) { player.message("\u00a7cPlease select a slot first!"); return; }
        var priceValue = parsePriceInput(inputText);
        if (priceValue <= 0) { player.message("\u00a7cInvalid price!"); return; }
        var item = highlightedSlot.getStack();
        if (!item || item.isEmpty()) { player.message("\u00a7cNo item in selected slot!"); return; }

        // priceValue is already in cents from parsePriceInput
        var existingLore = item.getLore();
        var loreArray = [];
        for (var j = 0; j < existingLore.length; j++) {
            var line = existingLore[j];
            if (line.indexOf("Price:") === -1 && line.indexOf("Click to purchase") === -1) loreArray.push(line);
        }
        while (loreArray.length > 0 && loreArray[loreArray.length - 1] === "") loreArray.pop();
        loreArray.push("");
        // Display in $ if >= $1, otherwise in \u00a2
        if (priceValue >= 100) {
            var dollars = Math.floor(priceValue / 100);
            var cents = priceValue % 100;
            loreArray.push("\u00a7aPrice: \u00a7e$" + dollars + (cents > 0 ? "." + (cents < 10 ? "0" + cents : cents) : ""));
        } else {
            loreArray.push("\u00a7aPrice: \u00a7e" + priceValue + "\u00a2");
        }
        item.setLore(loreArray);
        highlightedSlot.setStack(item);
        // Show appropriate message
        if (priceValue >= 100) {
            player.message("\u00a7aSet price \u00a7e$" + Math.floor(priceValue / 100) + (priceValue % 100 > 0 ? "." + (priceValue % 100 < 10 ? "0" + (priceValue % 100) : priceValue % 100) : "") + " \u00a7afor item!");
        } else {
            player.message("\u00a7aSet price \u00a7e" + priceValue + "\u00a2 \u00a7afor item!");
        }
        savePageItems(npcData);
        if (guiRef) guiRef.update();
    }
}

// ============================================================================
// SLOT CLICK HANDLER (EXACT copy of chestTrader7 logic, with renter check)
// ============================================================================
function customGuiSlotClicked(event) {
    var clickedSlot = event.slot;
    var stack = event.stack;
    var player = event.player;
    var api = event.API;
    var npcData = lastNpc ? lastNpc.getStoreddata() : null;
    if (!npcData) return;
    rentalInfo = loadRentalInfo(npcData);
    var adminMode = (player.getMainhandItem() && !player.getMainhandItem().isEmpty() && player.getMainhandItem().getName() === "minecraft:barrier");
    var slotIndex = mySlots.indexOf(clickedSlot);
    var isOwner = rentalInfo.renterUUID === player.getUUID();
    var isEmployee = false;
    if (!isOwner && lastNpc && rentalInfo.renterUUID) {
        // Check if current player is a global employee of the renter
        var world = lastNpc.getWorld();
        var pd = getPlayerData(world, rentalInfo.renterUUID);
        var employees = pd.employees || [];
        // Check both UUID and player name (for offline employees added by name)
        var playerUUID = player.getUUID();
        var playerName = player.getName();
        for (var i = 0; i < employees.length; i++) {
            var emp = employees[i];
            if (emp === playerUUID || emp === playerName) {
                isEmployee = true;
                break;
            }
        }
    }
    // Both owners and employees need modifyMode to edit, otherwise they can purchase as customers
    var canEditShop = adminMode || ((isOwner || isEmployee) && modifyMode);

    if (canEditShop) {
        // Check if clicking a tab slot
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
            if (!guiRef) return;
            highlightedSlot = clickedSlot;
            for (var i = 0; i < highlightLineIds.length; i++) {
                try { guiRef.removeComponent(highlightLineIds[i]); } catch(e) {}
            }
            highlightLineIds = [];
            var pos = slotPositions[slotIndex];
            var x = pos.x, y = pos.y, w = 18, h = 18;
            highlightLineIds.push(guiRef.addColoredLine(1, x, y, x + w, y, 0xADD8E6, 2));
            highlightLineIds.push(guiRef.addColoredLine(2, x, y + h, x + w, y + h, 0xADD8E6, 2));
            highlightLineIds.push(guiRef.addColoredLine(3, x, y, x, y + h, 0xADD8E6, 2));
            highlightLineIds.push(guiRef.addColoredLine(4, x + w, y, x + w, y + h, 0xADD8E6, 2));
            if (guiRef) guiRef.update();
            return;
        }

        if (!highlightedSlot) return;

        var isTabSlot = false;
        for (var i = 0; i < tabSlots.length; i++) {
            if (tabSlots[i] === highlightedSlot) { isTabSlot = true; break; }
        }

        // Tab slots - copy/replace/clear without giving/taking items
        if (isTabSlot && canEditShop) {
            if (stack && !stack.isEmpty()) {
                // Copy or replace tab icon
                var tabCopy = player.world.createItemFromNbt(stack.getItemNbt());
                highlightedSlot.setStack(tabCopy);
                player.message("\u00a7aTab icon updated!");
                saveTabItems(npcData, storedTabItems);
            } else {
                // Empty hand - clear tab icon
                highlightedSlot.setStack(null);
                player.message("\u00a7aTab icon cleared!");
                saveTabItems(npcData, storedTabItems);
            }
            if (guiRef) guiRef.update();
            return;
        }

        // If clicking tab slot without edit permission, just highlight
        if (isTabSlot) return;

        try {
            var slotStack = highlightedSlot.getStack();
            var maxStack = stack ? stack.getMaxStackSize() : 64;

            if (stack && !stack.isEmpty()) {
                if (slotStack && !slotStack.isEmpty() && slotStack.getDisplayName() === stack.getDisplayName()) {
                    var total = slotStack.getStackSize() + stack.getStackSize();
                    if (total <= maxStack) {
                        slotStack.setStackSize(total);
                        highlightedSlot.setStack(slotStack);
                        player.removeItem(stack, stack.getStackSize());
                    } else {
                        var overflow = total - maxStack;
                        slotStack.setStackSize(maxStack);
                        highlightedSlot.setStack(slotStack);
                        var overflowCopy = player.world.createItemFromNbt(stack.getItemNbt());
                        overflowCopy.setStackSize(overflow);
                        player.removeItem(stack, stack.getStackSize());
                        player.giveItem(overflowCopy);
                    }
                } else {
                    var itemCopy = player.world.createItemFromNbt(stack.getItemNbt());
                    if (slotStack && !slotStack.isEmpty()) {
                        player.giveItem(slotStack);
                    }
                    highlightedSlot.setStack(itemCopy);
                    player.removeItem(stack, stack.getStackSize());
                }
                savePageItems(npcData);
            } else if (slotStack && !slotStack.isEmpty()) {
                player.giveItem(slotStack);
                highlightedSlot.setStack(player.world.createItem("minecraft:air", 1));
                savePageItems(npcData);
                if (guiRef) guiRef.update();
            }
            if (guiRef) guiRef.update();
        } catch(e) {
            player.message("\u00a7cError: " + e);
        }
    } else {
        // Customer mode - buy items
        if (slotIndex === -1) return;
        var globalIndex = viewportToGlobal(slotIndex);
        if (globalIndex >= storedSlotItems[currentPage].length) return;
        var item = mySlots[slotIndex].getStack();
        if (!item || item.isEmpty()) return;

        var price = null;
        var lore = item.getLore();
        for (var i = 0; i < lore.length; i++) {
            var line = lore[i];
            if (line.indexOf("Price:") !== -1) {
                var priceStr = line.replace(/\u00a7./g, "");
                // Try to match $X or $X.XX format
                var dollarMatch = priceStr.match(/Price:\s*\$(\d+(?:\.\d+)?)/);
                if (dollarMatch && dollarMatch[1]) {
                    price = Math.floor(parseFloat(dollarMatch[1]) * 100);
                    break;
                }
                // Try to match X\u00a2 format
                var centMatch = priceStr.match(/Price:\s*(\d+)\u00a2/);
                if (centMatch && centMatch[1]) {
                    price = parseInt(centMatch[1]);
                    break;
                }
            }
        }
        if (price === null || price === undefined) { 
            player.message("\u00a7cThis item has no price set!"); 
            return; 
        }

        var playerCoins = countPlayerCoins(player);
        if (playerCoins < price) { player.message("\u00a7cNot enough coins! Need: \u00a7e" + price + "\u00a2 \u00a7c, Have: \u00a7e" + playerCoins + "\u00a2"); return; }
        if (!removeCoins(player, price)) { player.message("\u00a7cTransaction failed!"); return; }

        try {
            if (storedSlotItems[currentPage][globalIndex]) {
                var purchaseItem = player.world.createItemFromNbt(api.stringToNbt(storedSlotItems[currentPage][globalIndex]));
                var purchaseLore = purchaseItem.getLore();
                var cleanLore = [];
                for (var i = 0; i < purchaseLore.length; i++) {
                    var line = purchaseLore[i];
                    if (line.indexOf("Price:") === -1 && line.indexOf("Click to purchase") === -1) cleanLore.push(line);
                }
                while (cleanLore.length > 0 && cleanLore[cleanLore.length - 1] === "") cleanLore.pop();
                purchaseItem.setLore(cleanLore);

                purchaseItem.setStackSize(1);
                if (!player.giveItem(purchaseItem)) player.dropItem(purchaseItem);

                // Subtract 1 from shop slot
                var shopItemNbt = storedSlotItems[currentPage][globalIndex];
                var shopItem = player.world.createItemFromNbt(api.stringToNbt(shopItemNbt));
                var currentQty = shopItem.getStackSize();
                if (currentQty > 1) {
                    shopItem.setStackSize(currentQty - 1);
                    storedSlotItems[currentPage][globalIndex] = shopItem.getItemNbt().toJsonString();
                    // Update the actual slot in the GUI
                    mySlots[slotIndex].setStack(shopItem);
                } else {
                    storedSlotItems[currentPage][globalIndex] = null;
                    // Clear the slot in the GUI
                    mySlots[slotIndex].setStack(null);
                }

                // Add earnings
                rentalInfo.totalEarnings = (rentalInfo.totalEarnings || 0) + price;
                saveRentalInfo(npcData, rentalInfo);
                saveShopItems(npcData, storedSlotItems);
                
                // Sync earnings to world data for the block
                if (lastNpc) {
                    var world = lastNpc.getWorld();
                    // Credit earnings to current renter (shop owner)
                    var targetUUID = rentalInfo.renterUUID;
                    var pd = getPlayerData(world, targetUUID);
                    var npcUUID = lastNpc.getUUID();
                    var found = false;
                    if (pd.ownedShops) {
                        for (var si = 0; si < pd.ownedShops.length; si++) {
                            if (pd.ownedShops[si].npcUUID === npcUUID) {
                                // Add to existing world data value rather than overwriting with npcData
                                pd.ownedShops[si].totalEarnings = (pd.ownedShops[si].totalEarnings || 0) + price;
                                found = true;
                                break;
                            }
                        }
                    }
                    // If not found in owned, check expired shops (stopped renting)
                    if (!found && pd.expiredShops) {
                        for (var si = 0; si < pd.expiredShops.length; si++) {
                            if (pd.expiredShops[si].npcUUID === npcUUID) {
                                pd.expiredShops[si].totalEarnings = (pd.expiredShops[si].totalEarnings || 0) + price;
                                break;
                            }
                        }
                    }
                    savePlayerData(world, targetUUID, pd);
                }

                player.message("\u00a7aPurchased item for \u00a7e" + price + "\u00a2!");
                if (guiRef) guiRef.update();
            }
        } catch(e) {
            player.message("\u00a7cError purchasing item: " + e);
        }
    }
}

// ============================================================================
// SAVE FUNCTIONS
// ============================================================================
function savePageItems(npcData) {
    if (!lastNpc || !npcData) return;
    var totalSlots = totalRows * numCols;
    if (!storedSlotItems[currentPage] || storedSlotItems[currentPage].length !== totalSlots) {
        storedSlotItems[currentPage] = makeNullArray(totalSlots);
    }
    for (var i = 0; i < mySlots.length; i++) {
        var globalIndex = viewportToGlobal(i);
        var stack = mySlots[i].getStack();
        storedSlotItems[currentPage][globalIndex] = stack && !stack.isEmpty() ? stack.getItemNbt().toJsonString() : null;
    }
    saveShopItems(npcData, storedSlotItems);
}

// ============================================================================
// GUI CLOSED HANDLER
// ============================================================================
function customGuiClosed(event) {
    if (!skipSaveOnClose && lastNpc) {
        var npcData = lastNpc.getStoreddata();
        savePageItems(npcData);
        saveTabItems(npcData, storedTabItems);
    } else {
        skipSaveOnClose = false;
    }
}

function getPlayerNpc(player) {
    var npcUUID = playerNpcMap[player.getUUID()];
    if (!npcUUID) return null;
    if (lastNpc && lastNpc.getUUID() === npcUUID) return lastNpc;
    try {
        var world = player.getWorld();
        var npcs = world.getNpcs();
        for (var i = 0; i < npcs.length; i++) {
            if (npcs[i].getUUID() === npcUUID) {
                lastNpc = npcs[i];
                return lastNpc;
            }
        }
    } catch(e) {}
    return null;
}

// ============================================================================
// RENT GUI
// ============================================================================
function openRentGui(player, api, npcData) {
    rentalInfo = loadRentalInfo(npcData);
    var width = 280;
    var height = 200;
    var gui = api.createCustomGui(GUI_RENT, width, height, false, player);

    var costPerDay = rentalInfo.rentCostPerDay || RENT_COST_PER_DAY;
    var playerBalance = countPlayerCoins(player);

    gui.addLabel(1, "\u00a76\u00a7lShop Rental", width / 2 - 50, 10, 160, 14);
    gui.addLabel(2, "\u00a77Cost per day: \u00a7a" + formatPrice(costPerDay), 15, 35, 250, 10);
    gui.addLabel(3, "\u00a77Your balance: \u00a7e" + formatPrice(playerBalance), 15, 55, 250, 10);
    gui.addLabel(8, "\u00a7aStatus: \u00a7fAvailable for rent", 15, 75, 250, 10);
    gui.addLabel(9, "\u00a77Days (1-" + MAX_RENT_DAYS + "):", 15, 100, 100, 10);
    gui.addTextField(RENT_TF_DAYS, 110, 97, 50, 16).setText("1");
    gui.addLabel(5, "\u00a77Total: \u00a7a" + formatPrice(costPerDay), 15, 125, 250, 10);
    gui.addButton(RENT_BTN_PAY, "\u00a7a\u00a7lRent Shop", width / 2 - 70, 150, 80, 20);
    gui.addButton(RENT_BTN_CANCEL, "\u00a77Cancel", width / 2 + 10, 150, 60, 20);

    player.showCustomGui(gui);
    // Track this GUI and its NPC for the player
    playerGuiRef[player.getUUID()] = gui;
    playerRentNpc[player.getUUID()] = lastNpc;
    
    // Force GUI update to ensure buttons are clickable
    gui.update();
}

function openRentExtendGui(player, api, npcData) {
    // Same as rent gui but with "Extend" text
    openRentGui(player, api, npcData);
}

// ============================================================================
// RENT PAYMENT HANDLER
// ============================================================================
function handleRentPayment(player, api, npcData, gui) {
    rentalInfo = loadRentalInfo(npcData);
    var daysField = gui.getComponent(RENT_TF_DAYS);
    if (!daysField) { player.message("\u00a7cError reading days field."); return; }

    var days = parseInt(daysField.getText().trim());
    if (isNaN(days) || days < 1 || days > MAX_RENT_DAYS) { player.message("\u00a7cInvalid days! Must be between 1 and " + MAX_RENT_DAYS + "."); return; }

    var costPerDay = rentalInfo.rentCostPerDay || RENT_COST_PER_DAY;
    var totalCost = costPerDay * days;

    if (countPlayerCoins(player) < totalCost) { player.message("\u00a7cYou need " + formatPrice(totalCost) + " to rent for " + days + " day(s)."); return; }
    if (!removeCoins(player, totalCost)) { player.message("\u00a7cTransaction failed!"); return; }

    var nowTime = now();
    var expiryTime = nowTime + (days * 24 * 60 * 60 * 1000);
    var world = player.getWorld();
    var playerUUID = player.getUUID();

    // Check if player is an employee extending the owner's rent
    var isEmployee = false;
    var ownerUUID = rentalInfo.renterUUID;
    if (ownerUUID && ownerUUID !== playerUUID) {
        var pd = getPlayerData(world, ownerUUID);
        var employees = pd.employees || [];
        var playerUUID = player.getUUID();
        var playerName = player.getName();
        for (var i = 0; i < employees.length; i++) {
            var emp = employees[i];
            if (emp === playerUUID || emp === playerName) {
                isEmployee = true;
                break;
            }
        }
    }

    if (isEmployee && ownerUUID && !isExpired(rentalInfo)) {
        // Employee is extending the owner's rent
        rentalInfo.expiryDate = rentalInfo.expiryDate + (days * 24 * 60 * 60 * 1000);
        player.message("\u00a7aExtended the shop rent by " + days + " day(s) for " + rentalInfo.renterName + "!");
        
        // Update world data with new expiry for the owner
        var pd = getPlayerData(world, ownerUUID);
        if (pd.ownedShops) {
            var extPos = lastNpc.getPos();
            var extCoord = extPos.getX() + "," + extPos.getY() + "," + extPos.getZ();
            for (var i = 0; i < pd.ownedShops.length; i++) {
                if (pd.ownedShops[i].npcCoord === extCoord) {
                    pd.ownedShops[i].expiryDate = rentalInfo.expiryDate;
                    break;
                }
            }
        }
        savePlayerData(world, ownerUUID, pd);
        saveRentalInfo(npcData, rentalInfo);
        skipSaveOnClose = true;
        player.closeGui();
        return;
    }

    if (rentalInfo.renterUUID === playerUUID && !isExpired(rentalInfo)) {
        rentalInfo.expiryDate = rentalInfo.expiryDate + (days * 24 * 60 * 60 * 1000);
        player.message("\u00a7aExtended your rent by " + days + " day(s)!");
        
        // Update world data with new expiry
        var pd = getPlayerData(world, playerUUID);
        if (pd.ownedShops) {
            var extPos = lastNpc.getPos();
            var extCoord = extPos.getX() + "," + extPos.getY() + "," + extPos.getZ();
            for (var i = 0; i < pd.ownedShops.length; i++) {
                if (pd.ownedShops[i].npcCoord === extCoord) {
                    pd.ownedShops[i].expiryDate = rentalInfo.expiryDate;
                    break;
                }
            }
        }
        savePlayerData(world, playerUUID, pd);
    } else {
        // Transfer previous renter's items to claim if there's a different renter with items
        // Also transfer if previousRenterUUID exists (shop was stopped by previous renter)
        if (rentalInfo.renterName && rentalInfo.renterName !== player.getName()) {
            transferToClaim(npcData, rentalInfo);
        } else if (rentalInfo.previousRenterUUID && rentalInfo.previousRenterUUID !== playerUUID) {
            // Previous renter stopped renting - transfer their items to claim
            var previousInfo = { renterUUID: rentalInfo.previousRenterUUID, renterName: rentalInfo.previousRenterName };
            transferToClaim(npcData, previousInfo);
        }
        rentalInfo.renterName = player.getName();
        rentalInfo.renterUUID = playerUUID;
        rentalInfo.rentedDate = nowTime;
        rentalInfo.expiryDate = expiryTime;
        rentalInfo.totalEarnings = 0;
        player.message("\u00a7aYou have rented this shop for " + days + " day(s)! Cost: " + formatPrice(totalCost));
        
        // Register NPC in world data
        if (lastNpc) {
            var npcDisplayName = lastNpc.getName();
            var pos = lastNpc.getPos();
            registerNpc(world, lastNpc.getUUID(), npcDisplayName, pos);
        }
        
        // Track rental in world data
        var pd = getPlayerData(world, playerUUID);
        if (!pd.ownedShops) pd.ownedShops = [];
        // Remove any existing entry for this NPC from all arrays by UUID
        var npcUUID = lastNpc.getUUID();
        for (var i = pd.ownedShops.length - 1; i >= 0; i--) {
            if (pd.ownedShops[i].npcUUID === npcUUID) {
                pd.ownedShops.splice(i, 1);
            }
        }
        if (pd.expiredShops) {
            for (var i = pd.expiredShops.length - 1; i >= 0; i--) {
                if (pd.expiredShops[i].npcUUID === npcUUID) {
                    pd.expiredShops.splice(i, 1);
                }
            }
        }
        pd.ownedShops.push({
            npcUUID: lastNpc.getUUID(),
            rentedDate: nowTime,
            expiryDate: expiryTime,
            totalEarnings: 0,
            itemCount: 0
        });
        savePlayerData(world, playerUUID, pd);
    }

    saveRentalInfo(npcData, rentalInfo);
    
    // Always just close the GUI - player can reopen it by clicking NPC again
    skipSaveOnClose = true;
    player.closeGui();
}

function transferToClaim(npcData, info) {
    var shopItems = loadShopItems(npcData);
    var allClaimItems = [];
    for (var page in shopItems) {
        if (shopItems.hasOwnProperty(page)) {
            var claimItems = loadClaimItems(npcData);
            for (var i = 0; i < shopItems[page].length; i++) {
                if (shopItems[page][i]) {
                    claimItems.push(shopItems[page][i]);
                    allClaimItems.push(shopItems[page][i]);
                }
            }
            saveClaimItems(npcData, claimItems);
        }
    }
    // Don't transfer coins - they are already tracked in world data via buy syncs and stop-rent auto-claim
    // Save the claim owner (previous renter's UUID)
    saveClaimOwner(npcData, info.renterUUID);
    
    // Also save items to world data for remote claiming
    if (lastNpc) {
        var world = lastNpc.getWorld();
        var pd = getPlayerData(world, info.renterUUID);
        if (pd.claimableItems) {
            for (var i = 0; i < allClaimItems.length; i++) {
                pd.claimableItems.push(allClaimItems[i]);
            }
        } else {
            pd.claimableItems = allClaimItems.slice();
        }
        
        // Move from rented to expired
        if (pd.rentedShops) {
            var claimPos = lastNpc.getPos();
            var claimCoord = claimPos.getX() + "," + claimPos.getY() + "," + claimPos.getZ();
            for (var i = pd.rentedShops.length - 1; i >= 0; i--) {
                if (pd.rentedShops[i].npcCoord === claimCoord) {
                    var expired = pd.rentedShops.splice(i, 1)[0];
                    if (!pd.expiredShops) pd.expiredShops = [];
                    pd.expiredShops.push(expired);
                    break;
                }
            }
        }
        savePlayerData(world, info.renterUUID, pd);
    }
    
    // Clear shop items completely
    atomicSave(npcData, "ShopItems", {});
    // Clear tab icons too
    atomicSave(npcData, "TabItems", makeNullArray(maxPages));
}

// ============================================================================
// CLAIM HANDLER
// ============================================================================
function handleClaimItems(player, npcData) {
    rentalInfo = loadRentalInfo(npcData);
    var claimItems = loadClaimItems(npcData);
    var claimCoins = loadClaimCoins(npcData);
    var currentEarnings = rentalInfo.totalEarnings || 0;
    
    var totalCoins = claimCoins + currentEarnings;
    var hasItems = claimItems.length > 0;
    var hasCoins = totalCoins > 0;

    if (!hasItems && !hasCoins) {
        player.message("\u00a77No items or coins to claim.");
        return;
    }

    // Check if player is the rightful owner of the claim items
    var claimOwner = loadClaimOwner(npcData);
    var isClaimOwner = claimOwner && claimOwner === player.getUUID();
    
    if (!isClaimOwner) {
        player.message("\u00a7cOnly the previous shop owner can claim these items!");
        return;
    }

    // Give coins (both previous claim + current earnings)
    if (hasCoins) {
        giveCoins(player, totalCoins);
        player.message("\u00a7aClaimed " + formatPrice(totalCoins) + "!");
    }

    // Give items
    var world = player.getWorld();
    var api = Java.type("noppes.npcs.api.NpcAPI").Instance();
    for (var i = 0; i < claimItems.length; i++) {
        var item = deserializeItem(claimItems[i], world);
        if (item) {
            if (!player.giveItem(item)) player.dropItem(item);
        }
    }

    if (hasItems) {
        player.message("\u00a7aClaimed " + claimItems.length + " items!");
    }
    
    player.updatePlayerInventory();
    
    // Clear all claim data and reset earnings
    saveClaimItems(npcData, []);
    saveClaimCoins(npcData, 0);
    rentalInfo.totalEarnings = 0;
    saveRentalInfo(npcData, rentalInfo);

    // Update GUI
    if (guiRef) {
        // Update claim button
        guiRef.removeComponent(ID_BTN_CLAIM);
        guiRef.addButton(ID_BTN_CLAIM, "\u00a7e\u00a7lClaim", -128, -24, 80, 18);
        // Update earnings display
        guiRef.removeComponent(ID_LBL_EARNINGS);
        guiRef.addLabel(ID_LBL_EARNINGS, "\u00a77Earnings: \u00a7a" + formatPrice(0), -128, -38, 100, 10);
        guiRef.update();
    }
}

function deserializeItem(nbtStr, world) {
    if (!nbtStr) return null;
    try {
        var api = Java.type("noppes.npcs.api.NpcAPI").Instance();
        var nbt = api.stringToNbt(nbtStr);
        return world.createItemFromNbt(nbt);
    } catch(e) { return null; }
}

function handleWithdrawEarnings(player, npcData) {
    rentalInfo = loadRentalInfo(npcData);
    var earnings = rentalInfo.totalEarnings || 0;
    
    player.message("\u00a77Debug: Earnings = " + earnings + " cents");
    
    if (earnings <= 0) {
        player.message("\u00a77No earnings to withdraw.");
        return;
    }
    
    // Give coins to player
    giveCoins(player, earnings);
    player.message("\u00a7aWithdrew \u00a7e" + formatPrice(earnings) + " \u00a7ain earnings!");
    
    // Reset earnings
    rentalInfo.totalEarnings = 0;
    saveRentalInfo(npcData, rentalInfo);
    
    // Update GUI
    if (guiRef) {
        guiRef.removeComponent(ID_LBL_EARNINGS);
        guiRef.addLabel(ID_LBL_EARNINGS, "\u00a77Earnings: \u00a7a" + formatPrice(0), -128, -38, 100, 10);
        guiRef.update();
    }
}

function handleStopRenting(player, npcData) {
    rentalInfo = loadRentalInfo(npcData)
    
    // DON'T transfer items - keep shop functional with all items and layouts
    // Just clear the rental timing
    
    // Move to expired in world data
    if (lastNpc) {
        var world = lastNpc.getWorld()
        var pd = getPlayerData(world, rentalInfo.renterUUID)
        var npcUUID = lastNpc.getUUID()
        if (pd.ownedShops) {
            for (var i = pd.ownedShops.length - 1; i >= 0; i--) {
                if (pd.ownedShops[i].npcUUID === npcUUID) {
                    var expired = pd.ownedShops.splice(i, 1)[0]
                    if (!pd.expiredShops) pd.expiredShops = []
                    // Auto-claim earnings: add to player's claimableCoins
                    var earnings = expired.totalEarnings || 0
                    pd.claimableCoins = (pd.claimableCoins || 0) + earnings
                    // Reset shop earnings to 0 so future purchases start fresh
                    expired.totalEarnings = 0
                    pd.expiredShops.push(expired)
                    break
                }
            }
        }
        savePlayerData(world, rentalInfo.renterUUID, pd)
    }
    
    // Store previous renter UUID for earnings tracking after stopping
    rentalInfo.previousRenterUUID = rentalInfo.renterUUID;
    rentalInfo.previousRenterName = rentalInfo.renterName;
    // Clear active renter identity so they become a regular customer (can purchase items)
    rentalInfo.renterName = "";
    rentalInfo.renterUUID = "";
    rentalInfo.rentedDate = 0;
    rentalInfo.expiryDate = 0;
    rentalInfo.totalEarnings = 0;
    saveRentalInfo(npcData, rentalInfo);
    
    // Clear GUI state
    guiRef = null;
    storedSlotItems = {};
    storedTabItems = [];
    currentPage = 0;
    viewportRow = 0;
    highlightedSlot = null;
    highlightLineIds = [];
    
    player.message("\u00a7cYou have stopped renting this shop. Your shop is still functional with your items and layouts but you can still clear the shop anytime");
    player.closeGui();
}

function handleClearShop(player, npcData) {
    rentalInfo = loadRentalInfo(npcData);
    
    // Give all shop items back to player
    var shopItems = loadShopItems(npcData);
    var world = player.getWorld();
    var api = Java.type("noppes.npcs.api.NpcAPI").Instance();
    var itemsGiven = 0;
    
    for (var page in shopItems) {
        if (shopItems.hasOwnProperty(page)) {
            for (var i = 0; i < shopItems[page].length; i++) {
                if (shopItems[page][i]) {
                    var item = deserializeItem(shopItems[page][i], world);
                    if (item) {
                        if (!player.giveItem(item)) player.dropItem(item);
                        itemsGiven++;
                    }
                }
            }
        }
    }
    
    // Clear shop
    saveShopItems(npcData, {});
    storedSlotItems = {};
    
    // Update GUI
    if (guiRef) {
        updateVisibleSlots(player, api, true);
        guiRef.update();
    }
    
    player.message("\u00a7aCleared shop! Returned \u00a7e" + itemsGiven + " \u00a7aitems to your inventory.");
    player.updatePlayerInventory();
}

// ============================================================================
// ADMIN GUI & HANDLERS
// ============================================================================
function openAdminGui(player, api, npcData) {
    rentalInfo = loadRentalInfo(npcData);
    var width = 300;
    var height = 220;
    var gui = api.createCustomGui(GUI_ADMIN, width, height, false, player);

    gui.addLabel(1, "\u00a7c\u00a7lAdmin - Shop Management", width / 2 - 80, 10, 180, 14);
    gui.addLabel(2, "\u00a77Current renter: \u00a7f" + (rentalInfo.renterName || "None"), 15, 50, 250, 10);
    gui.addLabel(3, "\u00a77Expires: \u00a7f" + (rentalInfo.expiryDate > 0 ? new java.util.Date(rentalInfo.expiryDate).toString() : "N/A"), 15, 70, 250, 10);
    gui.addLabel(4, "\u00a77Earnings: \u00a7a" + formatPrice(rentalInfo.totalEarnings || 0), 15, 90, 250, 10);
    gui.addButton(ADM_BTN_CLEAR, "\u00a7c\u00a7lClear Renter", 40, 130, 220, 20);
    gui.addButton(28, "\u00a74\u00a7lDelete NPC from Registry", 40, 155, 220, 20);
    gui.addButton(ADM_BTN_CLOSE, "\u00a77Close", width / 2 - 30, 185, 60, 20);

    player.showCustomGui(gui);
}

var ID_APP_NAME_FIELD = 304;

function openAppearanceGui(player, api) {
    var width = 280;
    var height = 240;
    var gui = api.createCustomGui(GUI_APPEARANCE, width, height, false, player);

    gui.addLabel(1, "\u00a7d\u00a7lNPC Appearance", width / 2 - 50, 10, 140, 14);

    gui.addLabel(4, "\u00a77Name:", 15, 35, 100, 10);
    var currentName = "";
    try { currentName = lastNpc.getDisplay().getName(); } catch(e) {}
    gui.addTextField(ID_APP_NAME_FIELD, 15, 48, 200, 16).setText(currentName);

    gui.addLabel(2, "\u00a77Title:", 15, 70, 100, 10);
    var currentTitle = "";
    try { currentTitle = lastNpc.getDisplay().getTitle(); } catch(e) {}
    gui.addTextField(ID_APP_TITLE_FIELD, 15, 84, 200, 16).setText(currentTitle);

    gui.addLabel(3, "\u00a77Skin URL:", 15, 110, 100, 10);
    gui.addTextField(ID_APP_SKIN_FIELD, 15, 124, 200, 16).setText("");

    gui.addButton(ID_APP_BTN_SAVE, "\u00a7a\u00a7lSave", width / 2 - 80, 170, 70, 20);
    gui.addButton(ID_APP_BTN_CANCEL, "\u00a77Cancel", width / 2 + 10, 170, 70, 20);

    player.showCustomGui(gui);
    playerGuiRef[player.getUUID()] = gui;
}

function handleAppearanceSave(player, api, gui) {
    if (!lastNpc) return;
    var nameField = gui.getComponent(ID_APP_NAME_FIELD);
    var titleField = gui.getComponent(ID_APP_TITLE_FIELD);
    var skinField = gui.getComponent(ID_APP_SKIN_FIELD);

    if (nameField) {
        var name = nameField.getText().trim();
        if (name) {
            try {
                lastNpc.getDisplay().setName(name);
                // Update NPC registry in world data
                var world = lastNpc.getWorld();
                var wd = getWorldData(world);
                if (wd.npcRegistry && wd.npcRegistry[lastNpc.getUUID()]) {
                    wd.npcRegistry[lastNpc.getUUID()].displayName = name;
                    saveWorldData(world, wd);
                }
                player.message("\u00a7aNPC name updated!");
            } catch(e) {
                player.message("\u00a7cError setting name: " + e);
            }
        }
    }

    if (titleField) {
        var title = titleField.getText().trim();
        try {
            lastNpc.getDisplay().setTitle(title);
            player.message("\u00a7aNPC title updated!");
        } catch(e) {
            player.message("\u00a7cError setting title: " + e);
        }
    }

    if (skinField) {
        var skinUrl = skinField.getText().trim();
        if (skinUrl) {
            try {
                lastNpc.getDisplay().setSkinUrl(skinUrl);
                player.message("\u00a7aNPC skin updated!");
            } catch(e) {
                player.message("\u00a7cError setting skin: " + e);
            }
        }
    }

    player.closeGui();
    modifyMode = true;
    openShop(player, api, lastNpc.getStoreddata());
}

function handleAdminClear(player, api, npcData) {
    rentalInfo = loadRentalInfo(npcData);
    rentalInfo.expiryDate = now() - 1;
    saveRentalInfo(npcData, rentalInfo);
    player.message("\u00a7aShop marked as available! Current renter can still access until new renter joins.");
    player.closeGui();
}

function handleAdminDeleteNpc(player, api, npcData) {
    if (!lastNpc) { player.closeGui(); return; }
    var world = lastNpc.getWorld();
    var npcUUID = lastNpc.getUUID();
    
    // Remove from all player data
    var wd = getWorldData(world);
    if (wd.playerShops) {
        for (var puuid in wd.playerShops) {
            if (wd.playerShops.hasOwnProperty(puuid)) {
                var pd = wd.playerShops[puuid];
                if (pd.ownedShops) {
                    for (var i = pd.ownedShops.length - 1; i >= 0; i--) {
                        if (pd.ownedShops[i].npcUUID === npcUUID) {
                            pd.ownedShops.splice(i, 1);
                        }
                    }
                }
                if (pd.expiredShops) {
                    for (var i = pd.expiredShops.length - 1; i >= 0; i--) {
                        if (pd.expiredShops[i].npcUUID === npcUUID) {
                            pd.expiredShops.splice(i, 1);
                        }
                    }
                }
                if (pd.rentedByOther) {
                    for (var i = pd.rentedByOther.length - 1; i >= 0; i--) {
                        if (pd.rentedByOther[i].npcUUID === npcUUID) {
                            pd.rentedByOther.splice(i, 1);
                        }
                    }
                }
            }
        }
    }
    
    // Remove from NPC registry
    if (wd.npcRegistry) {
        delete wd.npcRegistry[npcUUID];
    }
    
    saveWorldData(world, wd);
    
    // Clear NPC's own stored data
    atomicSave(npcData, "RentalInfo", { renterName: "", renterUUID: "", rentedDate: 0, expiryDate: 0, rentCostPerDay: RENT_COST_PER_DAY, totalEarnings: 0, npcCoord: "" });
    atomicSave(npcData, "ShopItems", {});
    atomicSave(npcData, "TabItems", makeNullArray(maxPages));
    atomicSave(npcData, "ClaimItems", []);
    atomicSave(npcData, "ClaimCoins", 0);
    atomicSave(npcData, "ClaimOwner", "");
    
    player.message("\u00a7aNPC removed from rental registry!");
    player.closeGui();
}

function returnItemsToRenter(npcData, rentalInfo) {
    var shopItems = loadShopItems(npcData);
    var itemsToReturn = [];
    
    for (var page in shopItems) {
        if (shopItems.hasOwnProperty(page)) {
            for (var i = 0; i < shopItems[page].length; i++) {
                if (shopItems[page][i]) {
                    itemsToReturn.push(shopItems[page][i]);
                }
            }
        }
    }
    
    var earnings = rentalInfo.totalEarnings || 0;
    
    saveClaimItems(npcData, itemsToReturn);
    saveClaimCoins(npcData, earnings);
    
    // Clear shop items
    saveShopItems(npcData, {});
}

// ============================================================================
// INITIALIZATION
// ============================================================================
function init(e) {
}