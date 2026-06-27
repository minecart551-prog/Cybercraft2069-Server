// ============================================================================
// SHOP RENTAL SYSTEM - Hybrid Rental Shop NPC
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
// - Renters: Manage shop, set prices, collect earnings
// - Admins (hold barrier): Set rent cost, manage renter, edit shop
// ============================================================================

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================
var MAX_RENT_DAYS = 10;
var DEFAULT_RENT_COST_PER_DAY = 0; // cents (0 = free)

// Currency rates
var STONE_TO_COAL = 100;
var COAL_TO_EMERALD = 100;

// GUI IDs
var GUI_MAIN = 2000;
var GUI_RENT = 2001;
var GUI_SHOP = 2002;
var GUI_ADMIN = 2003;
var GUI_CLAIM = 2004;

// Component IDs - Main/Rent
var RENT_LBL_TITLE = 1;
var RENT_LBL_COST = 2;
var RENT_LBL_BALANCE = 3;
var RENT_TF_DAYS = 4;
var RENT_LBL_TOTAL = 5;
var RENT_BTN_PAY = 6;
var RENT_BTN_CANCEL = 7;
var RENT_LBL_STATUS = 8;

// Component IDs - Shop
var SHOP_LBL_TITLE = 10;
var SHOP_LBL_EARNINGS = 11;
var SHOP_LBL_RENT_INFO = 12;
var SHOP_BTN_CLAIM = 13;
var SHOP_BTN_CLOSE = 14;
var SHOP_BTN_REFRESH = 15;

// Component IDs - Admin
var ADM_LBL_TITLE = 20;
var ADM_LBL_COST = 21;
var ADM_TF_COST = 22;
var ADM_LBL_RENTER = 23;
var ADM_LBL_EXPIRY = 24;
var ADM_BTN_SAVE = 25;
var ADM_BTN_CLEAR = 26;
var ADM_BTN_CLOSE = 27;
var ADM_LBL_STATUS = 28;

// Component IDs - Claim
var CLAIM_LBL_TITLE = 30;
var CLAIM_LBL_ITEMS = 31;
var CLAIM_LBL_COINS = 32;
var CLAIM_BTN_CLAIM_ALL = 33;
var CLAIM_BTN_CLOSE = 34;

// Shop system (from chestTrader7)
var ID_PRICE_FIELD = 100;
var ID_SET_PRICE_BUTTON = 101;
var ID_TAB_BASE = 102;
var ID_SCROLL_UP = 111;
var ID_SCROLL_DOWN = 112;
var ID_ROWS_FIELD = 115;
var ID_SET_ROWS_BUTTON = 116;

// ============================================================================
// STATE VARIABLES
// ============================================================================
var guiRef = null;
var mySlots = [];
var tabSlots = [];
var highlightLineIds = [];
var highlightedSlot = null;
var lastNpc = null;
var storedSlotItems = {};
var storedTabItems = [];
var currentPage = 0;
var maxPages = 7;
var totalRows = 20;
var viewportRow = 0;
var viewportRows = 6;
var numCols = 9;
var skipSaveOnClose = false;
var slotPositions = [];
var pendingClaimItems = [];
var pendingClaimCoins = 0;

// ============================================================================
// CORRUPTION RESISTANCE & DATA MANAGEMENT
// ============================================================================
function safeJSONParse(jsonString, defaultValue) {
    if (!jsonString || jsonString.length === 0) return defaultValue;
    try { return JSON.parse(jsonString); }
    catch(e) { return defaultValue; }
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
        JSON.parse(jsonString); // Round-trip test
        npcData.put(key, jsonString);
        return true;
    } catch(e) { return false; }
}

function loadRentalInfo(npcData) {
    var rawData = safeGetData(npcData, "RentalInfo", null);
    if (rawData === null) {
        var emptyInfo = {
            renterName: "",
            renterUUID: "",
            rentedDate: 0,
            expiryDate: 0,
            rentCostPerDay: DEFAULT_RENT_COST_PER_DAY,
            totalEarnings: 0
        };
        atomicSave(npcData, "RentalInfo", emptyInfo);
        return emptyInfo;
    }
    var parsed = safeJSONParse(rawData, null);
    if (parsed === null) {
        var emptyInfo = {
            renterName: "",
            renterUUID: "",
            rentedDate: 0,
            expiryDate: 0,
            rentCostPerDay: DEFAULT_RENT_COST_PER_DAY,
            totalEarnings: 0
        };
        atomicSave(npcData, "RentalInfo", emptyInfo);
        return emptyInfo;
    }
    return parsed;
}

function saveRentalInfo(npcData, info) {
    atomicSave(npcData, "RentalInfo", info);
}

function loadClaimItems(npcData) {
    var rawData = safeGetData(npcData, "ClaimItems", null);
    if (rawData === null) {
        atomicSave(npcData, "ClaimItems", []);
        return [];
    }
    var parsed = safeJSONParse(rawData, null);
    if (parsed === null || !Array.isArray(parsed)) {
        atomicSave(npcData, "ClaimItems", []);
        return [];
    }
    return parsed;
}

function saveClaimItems(npcData, items) {
    atomicSave(npcData, "ClaimItems", items);
}

function loadClaimCoins(npcData) {
    var rawData = safeGetData(npcData, "ClaimCoins", null);
    if (rawData === null) {
        atomicSave(npcData, "ClaimCoins", 0);
        return 0;
    }
    var parsed = safeJSONParse(rawData, null);
    if (parsed === null || isNaN(parsed)) {
        atomicSave(npcData, "ClaimCoins", 0);
        return 0;
    }
    return parsed;
}

function saveClaimCoins(npcData, coins) {
    atomicSave(npcData, "ClaimCoins", coins);
}

// Shop item loading (from chestTrader7)
function makeNullArray(n) {
    var a = new Array(n);
    for (var i = 0; i < n; i++) a[i] = null;
    return a;
}

function loadShopItems(npcData) {
    var rawData = safeGetData(npcData, "ShopItems", null);
    if (rawData === null) {
        var emptyData = {};
        atomicSave(npcData, "ShopItems", emptyData);
        return emptyData;
    }
    var parsed = safeJSONParse(rawData, null);
    if (parsed === null) {
        var emptyData = {};
        atomicSave(npcData, "ShopItems", emptyData);
        return emptyData;
    }
    return parsed;
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

function saveTabItems(npcData) {
    if (!lastNpc || !tabSlots || tabSlots.length === 0) return;

    var tabItemStrings = tabSlots.map(function(slot) {
        var stack = slot.getStack();
        return (stack && !stack.isEmpty()) ? stack.getItemNbt().toJsonString() : null;
    });

    atomicSave(npcData, "TabItems", tabItemStrings);
}

function isExpired(rentalInfo) {
    if (!rentalInfo || !rentalInfo.renterName || rentalInfo.renterName === "") return true;
    return now() >= rentalInfo.expiryDate;
}

function timeLeftStr(rentalInfo) {
    if (!rentalInfo || !rentalInfo.renterName) return "AVAILABLE";
    var rem = rentalInfo.expiryDate - now();
    if (rem <= 0) return "EXPIRED";
    var hrs = Math.floor(rem / 3600000);
    var d = Math.floor(hrs / 24);
    var h = hrs % 24;
    if (d > 0) return d + "d " + h + "h";
    if (h > 0) return h + "h";
    return Math.floor(rem / 60000) + "m";
}

// ============================================================================
// CURRENCY SYSTEM
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

    // Remove stone coins
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty() && stack.getName() === "coins:stone_coin") {
            var stackAmount = stack.getStackSize();
            if (stackAmount <= remaining) {
                inv.setSlot(i, null);
                remaining -= stackAmount;
            } else {
                stack.setStackSize(stackAmount - remaining);
                remaining = 0;
            }
        }
    }

    // Remove coal coins
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty() && stack.getName() === "coins:coal_coin") {
            var stackAmount = stack.getStackSize();
            var stoneValue = stackAmount * STONE_TO_COAL;
            if (stoneValue <= remaining) {
                inv.setSlot(i, null);
                remaining -= stoneValue;
            } else {
                var coalsNeeded = Math.ceil(remaining / STONE_TO_COAL);
                stack.setStackSize(stackAmount - coalsNeeded);
                var overpaid = (coalsNeeded * STONE_TO_COAL) - remaining;
                remaining = 0;
                if (overpaid > 0) {
                    player.giveItem(world.createItem("coins:stone_coin", overpaid));
                }
            }
        }
    }

    // Remove emerald coins
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty() && stack.getName() === "coins:emerald_coin") {
            var stackAmount = stack.getStackSize();
            var stoneValue = stackAmount * STONE_TO_COAL * COAL_TO_EMERALD;
            if (stoneValue <= remaining) {
                inv.setSlot(i, null);
                remaining -= stoneValue;
            } else {
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

    // Give emerald coins
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

    // Give coal coins
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

    // Give stone coins
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

// ============================================================================
// ITEM HELPERS
// ============================================================================
function serializeItem(itemStack) {
    if (!itemStack || itemStack.isEmpty()) return null;
    try { return itemStack.getItemNbt().toJsonString(); }
    catch(e) { return null; }
}

function deserializeItem(nbtStr, world) {
    if (!nbtStr) return null;
    try {
        var api = Java.type("noppes.npcs.api.NpcAPI").Instance();
        var nbt = api.stringToNbt(nbtStr);
        return world.createItemFromNbt(nbt);
    } catch(e) { return null; }
}

function getItemLabel(nbtStr, world) {
    var item = deserializeItem(nbtStr, world);
    if (!item) return "§c[Invalid Item]";
    var name = item.getDisplayName();
    var count = item.getStackSize();
    if (count > 1) return name + " x" + count;
    return "" + name;
}

// ============================================================================
// LAYOUT SYSTEM
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
// MAIN INTERACTION HANDLER
// ============================================================================
function interact(e) {
    var player = e.player;
    var api = e.API;
    lastNpc = e.npc;
    var npcData = lastNpc.getStoreddata();
    var rentalInfo = loadRentalInfo(npcData);
    var adminMode = (player.getMainhandItem() && !player.getMainhandItem().isEmpty() && 
                     player.getMainhandItem().getName() === "minecraft:barrier");

    // Check if expired
    var expired = isExpired(rentalInfo);

    // Admin mode
    if (adminMode) {
        openAdminGui(player, api, npcData, rentalInfo);
        return;
    }

    // If expired or no renter, show rent GUI
    if (expired || !rentalInfo.renterName) {
        openRentGui(player, api, npcData, rentalInfo);
        return;
    }

    // Active renter - show shop management GUI
    if (rentalInfo.renterUUID === player.getUUID()) {
        openRenterGui(player, api, npcData, rentalInfo);
        return;
    }

    // Other players - show shop as customer
    openCustomerGui(player, api, npcData, rentalInfo);
}

// ============================================================================
// RENT GUI
// ============================================================================
function openRentGui(player, api, npcData, rentalInfo) {
    var width = 280;
    var height = 200;
    var gui = api.createCustomGui(GUI_RENT, width, height, false, player);

    var costPerDay = rentalInfo.rentCostPerDay || DEFAULT_RENT_COST_PER_DAY;
    var playerBalance = countPlayerCoins(player);

    gui.addLabel(RENT_LBL_TITLE, "§6§lShop Rental", width / 2 - 50, 10, 160, 14);
    gui.addLabel(RENT_LBL_COST, "§7Cost per day: §a" + formatPrice(costPerDay), 15, 35, 250, 10);
    gui.addLabel(RENT_LBL_BALANCE, "§7Your balance: §e" + formatPrice(playerBalance), 15, 55, 250, 10);
    gui.addLabel(RENT_LBL_STATUS, "§aStatus: §fAvailable for rent", 15, 75, 250, 10);

    gui.addLabel(4, "§7Days (1-" + MAX_RENT_DAYS + "):", 15, 100, 100, 10);
    gui.addTextField(RENT_TF_DAYS, 110, 97, 50, 16).setText("1");

    gui.addLabel(RENT_LBL_TOTAL, "§7Total: §a" + formatPrice(costPerDay), 15, 125, 250, 10);

    gui.addButton(RENT_BTN_PAY, "§a§lRent Shop", width / 2 - 70, 150, 80, 20);
    gui.addButton(RENT_BTN_CANCEL, "§7Cancel", width / 2 + 10, 150, 60, 20);

    player.showCustomGui(gui);
}

// ============================================================================
// RENTER GUI (Shop Management)
// ============================================================================
function openRenterGui(player, api, npcData, rentalInfo) {
    var width = 300;
    var height = 220;
    var gui = api.createCustomGui(GUI_SHOP, width, height, false, player);

    var timeLeft = timeLeftStr(rentalInfo);
    var earnings = rentalInfo.totalEarnings || 0;
    var claimItems = loadClaimItems(npcData);
    var claimCoins = loadClaimCoins(npcData);

    gui.addLabel(SHOP_LBL_TITLE, "§6§lYour Shop", width / 2 - 40, 10, 160, 14);
    gui.addLabel(SHOP_LBL_RENT_INFO, "§7Rent expires: §f" + timeLeft, 15, 35, 250, 10);
    gui.addLabel(SHOP_LBL_EARNINGS, "§7Total earnings: §a" + formatPrice(earnings), 15, 55, 250, 10);

    if (claimItems.length > 0 || claimCoins > 0) {
        gui.addLabel(16, "§e§lItems to claim:", 15, 80, 250, 10);
        gui.addLabel(17, "§7- " + claimItems.length + " items | " + formatPrice(claimCoins), 15, 95, 250, 10);
    }

    gui.addButton(SHOP_BTN_CLAIM, "§a§lClaim Items/Coins", 15, 120, 130, 20);
    gui.addButton(SHOP_BTN_REFRESH, "§b§lOpen Shop Editor", 155, 120, 130, 20);
    gui.addButton(SHOP_BTN_CLOSE, "§7Close", width / 2 - 30, 170, 60, 20);

    player.showCustomGui(gui);
}

// ============================================================================
// CUSTOMER GUI (Browse & Buy)
// ============================================================================
function openCustomerGui(player, api, npcData, rentalInfo) {
    var width = 300;
    var height = 220;
    var gui = api.createCustomGui(GUI_MAIN, width, height, false, player);

    gui.addLabel(1, "§6§lShop", width / 2 - 30, 10, 120, 14);
    gui.addLabel(2, "§7Owner: §f" + rentalInfo.renterName, 15, 35, 250, 10);
    gui.addLabel(3, "§7Time left: §f" + timeLeftStr(rentalInfo), 15, 55, 250, 10);

    gui.addButton(4, "§a§lBrowse Shop", width / 2 - 60, 100, 120, 20);
    gui.addButton(5, "§7Close", width / 2 - 30, 150, 60, 20);

    player.showCustomGui(gui);
}

// ============================================================================
// ADMIN GUI
// ============================================================================
function openAdminGui(player, api, npcData, rentalInfo) {
    var width = 300;
    var height = 250;
    var gui = api.createCustomGui(GUI_ADMIN, width, height, false, player);

    var costPerDay = rentalInfo.rentCostPerDay || DEFAULT_RENT_COST_PER_DAY;

    gui.addLabel(ADM_LBL_TITLE, "§c§lAdmin - Shop Settings", width / 2 - 80, 10, 180, 14);
    gui.addLabel(ADM_LBL_COST, "§7Rent cost per day (§eD.CC §7e.g. 5.20):", 15, 40, 250, 10);
    gui.addTextField(ADM_TF_COST, 15, 55, 100, 16).setText(formatPriceNoSign(costPerDay));

    gui.addLabel(ADM_LBL_RENTER, "§7Current renter: §f" + (rentalInfo.renterName || "None"), 15, 85, 250, 10);
    gui.addLabel(ADM_LBL_EXPIRY, "§7Expires: §f" + (rentalInfo.expiryDate > 0 ? new java.util.Date(rentalInfo.expiryDate).toString() : "N/A"), 15, 105, 250, 10);

    gui.addButton(ADM_BTN_SAVE, "§a§lSave", 40, 140, 80, 20);
    gui.addButton(ADM_BTN_CLEAR, "§c§lClear Renter", 140, 140, 100, 20);
    gui.addButton(ADM_BTN_CLOSE, "§7Close", width / 2 - 30, 190, 60, 20);

    gui.addLabel(ADM_LBL_STATUS, "", 15, 220, 250, 10);

    player.showCustomGui(gui);
}

function formatPriceNoSign(cents) {
    var dollars = Math.floor(cents / 100);
    var c = cents % 100;
    return dollars + "." + (c < 10 ? "0" + c : c);
}

// ============================================================================
// GUI BUTTON HANDLER
// ============================================================================
function customGuiButton(e) {
    var player = e.player;
    var api = e.API;
    var gui = e.gui;
    var buttonId = e.buttonId;
    var world = player.getWorld();
    var npcData = lastNpc.getStoreddata();
    var rentalInfo = loadRentalInfo(npcData);

    // Rent GUI
    if (gui.getID() === GUI_RENT) {
        if (buttonId === RENT_BTN_CANCEL) {
            player.closeGui();
            return;
        }

        if (buttonId === RENT_BTN_PAY) {
            handleRentPayment(player, api, npcData, rentalInfo);
            return;
        }
        return;
    }

    // Renter GUI
    if (gui.getID() === GUI_SHOP) {
        if (buttonId === SHOP_BTN_CLOSE) {
            player.closeGui();
            return;
        }

        if (buttonId === SHOP_BTN_CLAIM) {
            handleClaimItems(player, npcData);
            return;
        }

        if (buttonId === SHOP_BTN_REFRESH) {
            player.closeGui();
            openShopEditor(player, api, npcData);
            return;
        }
        return;
    }

    // Customer GUI
    if (gui.getID() === GUI_MAIN) {
        if (buttonId === 5) {
            player.closeGui();
            return;
        }

        if (buttonId === 4) {
            player.closeGui();
            openShopEditor(player, api, npcData);
            return;
        }
        return;
    }

    // Admin GUI
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
        return;
    }

    // Shop Editor GUI (from chestTrader7)
    if (gui.getID() === GUI_SHOP || gui === guiRef) {
        handleShopEditorButton(player, api, buttonId, gui, npcData);
    }
}

// ============================================================================
// RENT PAYMENT HANDLER
// ============================================================================
function handleRentPayment(player, api, npcData, rentalInfo) {
    var daysField = gui.getComponent(RENT_TF_DAYS);
    if (!daysField) {
        player.message("§cError reading days field.");
        return;
    }

    var days = parseInt(daysField.getText().trim());
    if (isNaN(days) || days < 1 || days > MAX_RENT_DAYS) {
        player.message("§cInvalid days! Must be between 1 and " + MAX_RENT_DAYS + ".");
        return;
    }

    var costPerDay = rentalInfo.rentCostPerDay || DEFAULT_RENT_COST_PER_DAY;
    var totalCost = costPerDay * days;

    if (countPlayerCoins(player) < totalCost) {
        player.message("§cYou need " + formatPrice(totalCost) + " to rent for " + days + " day(s).");
        return;
    }

    if (!removeCoins(player, totalCost)) {
        player.message("§cTransaction failed!");
        return;
    }

    var nowTime = now();
    var expiryTime = nowTime + (days * 24 * 60 * 60 * 1000);

    // Check if same player is re-renting
    if (rentalInfo.renterUUID === player.getUUID() && !isExpired(rentalInfo)) {
        // Extend existing rent
        rentalInfo.expiryDate = rentalInfo.expiryDate + (days * 24 * 60 * 60 * 1000);
        player.message("§aExtended your rent by " + days + " day(s)!");
    } else {
        // New rental or re-renting after expiry
        if (!isExpired(rentalInfo) && rentalInfo.renterName) {
            // Transfer old renter's items/coins to claim
            transferToClaim(npcData, rentalInfo);
        }

        // Set new renter
        rentalInfo.renterName = player.getName();
        rentalInfo.renterUUID = player.getUUID();
        rentalInfo.rentedDate = nowTime;
        rentalInfo.expiryDate = expiryTime;
        rentalInfo.totalEarnings = 0;

        player.message("§aYou have rented this shop for " + days + " day(s)! Cost: " + formatPrice(totalCost));
    }

    saveRentalInfo(npcData, rentalInfo);
    player.closeGui();
}

function transferToClaim(npcData, rentalInfo) {
    // Transfer shop items to claim
    var shopItems = loadShopItems(npcData);
    for (var page in shopItems) {
        if (shopItems.hasOwnProperty(page)) {
            var claimItems = loadClaimItems(npcData);
            for (var i = 0; i < shopItems[page].length; i++) {
                if (shopItems[page][i]) {
                    claimItems.push(shopItems[page][i]);
                }
            }
            saveClaimItems(npcData, claimItems);
        }
    }

    // Transfer earnings to claim
    var claimCoins = loadClaimCoins(npcData);
    claimCoins += (rentalInfo.totalEarnings || 0);
    saveClaimCoins(npcData, claimCoins);

    // Clear shop
    saveShopItems(npcData, {});
}

// ============================================================================
// CLAIM HANDLER
// ============================================================================
function handleClaimItems(player, npcData) {
    var claimItems = loadClaimItems(npcData);
    var claimCoins = loadClaimCoins(npcData);

    if (claimItems.length === 0 && claimCoins === 0) {
        player.message("§7No items or coins to claim.");
        return;
    }

    // Give coins
    if (claimCoins > 0) {
        giveCoins(player, claimCoins);
        player.message("§aClaimed " + formatPrice(claimCoins) + "!");
    }

    // Give items
    var world = player.getWorld();
    var api = Java.type("noppes.npcs.api.NpcAPI").Instance();
    for (var i = 0; i < claimItems.length; i++) {
        var item = deserializeItem(claimItems[i], world);
        if (item) {
            if (!player.giveItem(item)) {
                player.dropItem(item);
            }
        }
    }

    player.message("§aClaimed " + claimItems.length + " items!");
    player.updatePlayerInventory();

    // Clear claim data
    saveClaimItems(npcData, []);
    saveClaimCoins(npcData, 0);
}

// ============================================================================
// ADMIN HANDLERS
// ============================================================================
function handleAdminSave(player, api, npcData, gui) {
    var costField = gui.getComponent(ADM_TF_COST);
    if (!costField) {
        player.message("§cError reading cost field.");
        return;
    }

    var costStr = costField.getText().trim();
    if (costStr === "") costStr = "0.00";
    var costCents = parsePriceInput(costStr);
    if (isNaN(costCents) || costCents < 0) {
        player.message("§cInvalid cost! Enter as dollars.cents (e.g. 5.20).");
        return;
    }

    var rentalInfo = loadRentalInfo(npcData);
    rentalInfo.rentCostPerDay = costCents;
    saveRentalInfo(npcData, rentalInfo);

    player.message("§aRent cost set to " + formatPrice(costCents) + " per day!");
    player.closeGui();
}

function handleAdminClear(player, api, npcData) {
    var rentalInfo = loadRentalInfo(npcData);

    if (rentalInfo.renterName && !isExpired(rentalInfo)) {
        // Transfer to claim before clearing
        transferToClaim(npcData, rentalInfo);
    }

    // Clear rental info
    rentalInfo.renterName = "";
    rentalInfo.renterUUID = "";
    rentalInfo.rentedDate = 0;
    rentalInfo.expiryDate = 0;
    rentalInfo.totalEarnings = 0;
    saveRentalInfo(npcData, rentalInfo);

    player.message("§aShop cleared and available for rent!");
    player.closeGui();
}

function parsePriceInput(str) {
    str = str.trim();
    if (str.indexOf(".") === -1) return parseInt(str) * 100;
    var parts = str.split(".");
    var dollars = parseInt(parts[0]) || 0;
    var centsStr = parts[1];
    if (centsStr.length === 1) centsStr = centsStr + "0";
    else if (centsStr.length > 2) centsStr = centsStr.substring(0, 2);
    var cents = parseInt(centsStr) || 0;
    return dollars * 100 + cents;
}

// ============================================================================
// SHOP EDITOR (from chestTrader7 with modifications)
// ============================================================================
function openShopEditor(player, api, npcData) {
    lastNpc = lastNpc || player.getWorld().getEntities().find(function(e) { return e.isPlayer() === false; });
    if (!lastNpc) {
        player.message("§cError: NPC not found");
        return;
    }

    npcData = lastNpc.getStoreddata();
    storedSlotItems = loadShopItems(npcData);
    storedTabItems = loadTabItems(npcData, maxPages);
    var rentalInfo = loadRentalInfo(npcData);

    var adminMode = (player.getMainhandItem() && !player.getMainhandItem().isEmpty() && 
                     player.getMainhandItem().getName() === "minecraft:barrier");

    // Cleanup ghost tabs
    for (var key in storedSlotItems) {
        if (storedSlotItems.hasOwnProperty(key)) {
            var tabIndex = parseInt(key);
            if (tabIndex >= maxPages) delete storedSlotItems[key];
        }
    }

    var totalSlots = totalRows * numCols;
    if (!storedSlotItems[currentPage]) {
        storedSlotItems[currentPage] = makeNullArray(totalSlots);
    }

    highlightedSlot = null;
    highlightLineIds = [];

    if (!guiRef) {
        guiRef = api.createCustomGui(176, 166, 0, true, player);

        // Tabs
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
        guiRef.addButton(ID_SCROLL_UP, "↑", scrollX, scrollY, 18, 18);
        guiRef.addButton(ID_SCROLL_DOWN, "↓", scrollX, scrollY + 20, 18, 18);

        // Scroll indicator
        guiRef.addLabel(10, "", scrollX + 1, scrollY + 42, 0.7, 0.7);

        if (adminMode) {
            // Price/Name section
            guiRef.addLabel(3, "§7Price/Name:", 2, -100, 0.8, 0.8);
            guiRef.addTextField(ID_PRICE_FIELD, 60, -104, 60, 18).setText("");
            guiRef.addButton(ID_SET_PRICE_BUTTON, "Set", 125, -104, 35, 18);

            // Admin Shop Editor
            guiRef.addLabel(1, "§6Shop Editor", 2, 63, 1.0, 1.0);

            // Rows configuration
            guiRef.addLabel(6, "§7Total Rows:", -105, -29, 0.8, 0.8);
            guiRef.addTextField(ID_ROWS_FIELD, -105, -17, 40, 18).setText("" + totalRows);
            guiRef.addButton(ID_SET_ROWS_BUTTON, "Set", -60, -17, 30, 18);

            guiRef.showPlayerInventory(3, 91, false);
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
    } else {
        // Reload tab items
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
    }

    // Highlight current tab in admin mode
    if (adminMode && guiRef && currentPage < maxPages) {
        var tabWidth = 25;
        var tabHeight = 28;
        var tabSpacing = 2;
        var tabStartX = 0;
        var tabY = -80;
        var highlightTabX = tabStartX + currentPage * (tabWidth + tabSpacing);

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

    updateVisibleSlots(player, api, adminMode, npcData, rentalInfo);
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

function updateVisibleSlots(player, api, adminMode, npcData, rentalInfo) {
    for (var i = 0; i < mySlots.length; i++) {
        mySlots[i].setStack(null);
        var globalIndex = viewportToGlobal(i);

        if (globalIndex < storedSlotItems[currentPage].length && storedSlotItems[currentPage][globalIndex]) {
            try {
                var item = player.world.createItemFromNbt(api.stringToNbt(storedSlotItems[currentPage][globalIndex]));
                var price = null;
                var lore = item.getLore();

                for (var j = 0; j < lore.length; j++) {
                    var line = lore[j];
                    if (line.indexOf("Price:") !== -1 && line.indexOf("¢") !== -1) {
                        var priceStr = line.replace(/§./g, "");
                        var match = priceStr.match(/Price:\s*(\d+)¢/);
                        if (match && match[1]) {
                            price = parseInt(match[1]);
                            break;
                        }
                    }
                }

                if (price !== null && price !== undefined) {
                    var existingLore = item.getLore();
                    var loreArray = [];
                    for (var j = 0; j < existingLore.length; j++) {
                        var line = existingLore[j];
                        if (line.indexOf("Price:") === -1 && line.indexOf("Click to purchase") === -1) {
                            loreArray.push(line);
                        }
                    }
                    while (loreArray.length > 0 && loreArray[loreArray.length - 1] === "") loreArray.pop();
                    loreArray.push("");
                    loreArray.push("§aPrice: §e" + price + "¢");
                    if (!adminMode) loreArray.push("§7Click to purchase");
                    item.setLore(loreArray);
                }

                mySlots[i].setStack(item);
            } catch(e) {}
        }
    }
}

function handleShopEditorButton(player, api, buttonId, gui, npcData) {
    var adminMode = (player.getMainhandItem() && !player.getMainhandItem().isEmpty() && 
                     player.getMainhandItem().getName() === "minecraft:barrier");
    var maxViewportRow = Math.max(0, totalRows - viewportRows);
    var rentalInfo = loadRentalInfo(npcData);

    // Scroll buttons
    if (buttonId === ID_SCROLL_UP) {
        if (viewportRow > 0) {
            savePageItems(npcData);
            viewportRow--;
            updateVisibleSlots(player, api, adminMode, npcData, rentalInfo);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }

    if (buttonId === ID_SCROLL_DOWN) {
        if (viewportRow < maxViewportRow) {
            savePageItems(npcData);
            viewportRow++;
            updateVisibleSlots(player, api, adminMode, npcData, rentalInfo);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }

    // Tab buttons
    if (buttonId >= ID_TAB_BASE && buttonId < ID_TAB_BASE + maxPages) {
        var tabIndex = buttonId - ID_TAB_BASE;
        if (adminMode) {
            highlightedSlot = tabSlots[tabIndex];
        }
        if (tabIndex !== currentPage) {
            savePageItems(npcData);
            saveTabItems(npcData);
            currentPage = tabIndex;
            viewportRow = 0;
            openShopEditor(player, api, npcData);
        }
        return;
    }

    // Set Rows button
    if (buttonId === ID_SET_ROWS_BUTTON) {
        if (!adminMode) return;
        var rowsField = gui.getComponent(ID_ROWS_FIELD);
        if (!rowsField) return;
        var inputText = rowsField.getText().trim();
        if (!inputText) {
            player.message("§cPlease enter a number!");
            return;
        }
        var newRows = parseInt(inputText);
        if (isNaN(newRows) || newRows < 1 || newRows > 100) {
            player.message("§cInvalid! Enter a number between 1 and 100.");
            return;
        }

        savePageItems(npcData);
        var allItems = loadShopItems(npcData);
        var oldArray = allItems[currentPage] || [];
        var newTotalSlots = newRows * numCols;
        var newArray = makeNullArray(newTotalSlots);
        var copyLimit = Math.min(oldArray.length, newTotalSlots);
        for (var i = 0; i < copyLimit; i++) newArray[i] = oldArray[i];
        allItems[currentPage] = newArray;
        storedSlotItems = allItems;
        saveShopItems(npcData, allItems);
        totalRows = newRows;

        var maxViewportRow = Math.max(0, totalRows - viewportRows);
        if (viewportRow > maxViewportRow) viewportRow = maxViewportRow;

        player.message("§aSet total rows to §e" + totalRows + " §afor this tab!");
        openShopEditor(player, api, npcData);
        return;
    }

    // Set Price button
    if (buttonId === ID_SET_PRICE_BUTTON) {
        if (!adminMode) return;
        var priceField = gui.getComponent(ID_PRICE_FIELD);
        if (!priceField) return;
        var inputText = priceField.getText().trim();
        if (!inputText) {
            player.message("§cPlease enter a value!");
            return;
        }

        var tabSlotIndex = tabSlots.indexOf(highlightedSlot);
        if (tabSlotIndex !== -1) {
            var tabItem = highlightedSlot.getStack();
            if (!tabItem || tabItem.isEmpty()) {
                player.message("§cNo item in selected tab slot!");
                return;
            }
            tabItem.setCustomName(inputText);
            highlightedSlot.setStack(tabItem);
            player.message("§aRenamed tab to: " + inputText);
            saveTabItems(npcData, storedTabItems);
            return;
        }

        if (!highlightedSlot) {
            player.message("§cPlease select a slot first!");
            return;
        }

        var price = parseFloat(inputText);
        if (isNaN(price) || price < 0) {
            player.message("§cInvalid price! Use a number.");
            return;
        }

        var item = highlightedSlot.getStack();
        if (!item || item.isEmpty()) {
            player.message("§cNo item in selected slot!");
            return;
        }

        var priceValue = Math.floor(price);
        var existingLore = item.getLore();
        var loreArray = [];
        for (var j = 0; j < existingLore.length; j++) {
            var line = existingLore[j];
            if (line.indexOf("Price:") === -1 && line.indexOf("Click to purchase") === -1) {
                loreArray.push(line);
            }
        }
        while (loreArray.length > 0 && loreArray[loreArray.length - 1] === "") loreArray.pop();
        loreArray.push("");
        loreArray.push("§aPrice: §e" + priceValue + "¢");
        item.setLore(loreArray);
        highlightedSlot.setStack(item);
        player.message("§aSet price §e" + priceValue + "¢ §afor item!");
        savePageItems(npcData);
    }
}

// ============================================================================
// SLOT CLICK HANDLER
// ============================================================================
function customGuiSlotClicked(e) {
    var clickedSlot = e.slot;
    var stack = e.stack;
    var player = e.player;
    var api = e.API;
    var adminMode = (player.getMainhandItem() && !player.getMainhandItem().isEmpty() && 
                     player.getMainhandItem().getName() === "minecraft:barrier");
    var slotIndex = mySlots.indexOf(clickedSlot);
    var npcData = lastNpc.getStoreddata();
    var rentalInfo = loadRentalInfo(npcData);

    if (adminMode) {
        // Check if clicking a tab slot
        var clickedTabIndex = -1;
        for (var i = 0; i < tabSlots.length; i++) {
            if (tabSlots[i] === clickedSlot) {
                clickedTabIndex = i;
                break;
            }
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
            if (tabSlots[i] === highlightedSlot) {
                isTabSlot = true;
                break;
            }
        }

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
                if (isTabSlot) saveTabItems(npcData, storedTabItems);
                else savePageItems(npcData);
            } else if (slotStack && !slotStack.isEmpty()) {
                player.giveItem(slotStack);
                highlightedSlot.setStack(player.world.createItem("minecraft:air", 1));
                if (isTabSlot) saveTabItems(npcData, storedTabItems);
                else savePageItems(npcData);
                if (guiRef) guiRef.update();
            }
            if (guiRef) guiRef.update();
        } catch(e) {
            player.message("§cError: " + e);
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
            if (line.indexOf("Price:") !== -1 && line.indexOf("¢") !== -1) {
                var priceStr = line.replace(/§./g, "");
                var match = priceStr.match(/Price:\s*(\d+)¢/);
                if (match && match[1]) {
                    price = parseInt(match[1]);
                    break;
                }
            }
        }

        if (price === null || price === undefined) {
            player.message("§cThis item has no price set!");
            return;
        }

        var playerCoins = countPlayerCoins(player);
        if (playerCoins < price) {
            player.message("§cNot enough coins! Need: §e" + price + "¢ §c, Have: §e" + playerCoins + "¢");
            return;
        }

        if (!removeCoins(player, price)) {
            player.message("§cTransaction failed!");
            return;
        }

        try {
            if (storedSlotItems[currentPage][globalIndex]) {
                var purchaseItem = player.world.createItemFromNbt(api.stringToNbt(storedSlotItems[currentPage][globalIndex]));
                var purchaseLore = purchaseItem.getLore();
                var cleanLore = [];
                for (var i = 0; i < purchaseLore.length; i++) {
                    var line = purchaseLore[i];
                    if (line.indexOf("Price:") === -1 && line.indexOf("Click to purchase") === -1) {
                        cleanLore.push(line);
                    }
                }
                while (cleanLore.length > 0 && cleanLore[cleanLore.length - 1] === "") cleanLore.pop();
                purchaseItem.setLore(cleanLore);

                // Give 1 item to player
                purchaseItem.setStackSize(1);
                if (!player.giveItem(purchaseItem)) {
                    player.dropItem(purchaseItem);
                }

                // Subtract 1 from shop slot
                var shopItemNbt = storedSlotItems[currentPage][globalIndex];
                var shopItem = player.world.createItemFromNbt(api.stringToNbt(shopItemNbt));
                var currentQty = shopItem.getStackSize();
                
                if (currentQty > 1) {
                    shopItem.setStackSize(currentQty - 1);
                    storedSlotItems[currentPage][globalIndex] = shopItem.getItemNbt().toJsonString();
                } else {
                    storedSlotItems[currentPage][globalIndex] = null;
                }

                // Add earnings to renter
                rentalInfo.totalEarnings = (rentalInfo.totalEarnings || 0) + price;
                saveRentalInfo(npcData, rentalInfo);
                saveShopItems(npcData, storedSlotItems);

                player.message("§aPurchased item for §e" + price + "¢!");
                if (guiRef) guiRef.update();
            }
        } catch(e) {
            player.message("§cError purchasing item: " + e);
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
function customGuiClosed(e) {
    if (!skipSaveOnClose) {
        if (lastNpc) {
            var npcData = lastNpc.getStoreddata();
            savePageItems(npcData);
            saveTabItems(npcData, storedTabItems);
        }
    } else {
        skipSaveOnClose = false;
    }

    guiRef = null;
    viewportRow = 0;
    currentPage = 0;
    highlightedSlot = null;
    highlightLineIds = [];
}

// ============================================================================
// INITIALIZATION
// ============================================================================
function init(e) {
    // Script initialized on NPC
}