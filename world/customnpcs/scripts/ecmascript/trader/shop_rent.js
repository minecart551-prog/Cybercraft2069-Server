// ============================================================================
// SHOP RENTAL (AUCTION EDITION) - Rental shop backed by npc_auctioneer listings
// ============================================================================
// Based on shop_rent.js + vendingmachine1.js + npc_auctioneer.js
//
// FEATURES:
// - Rent shop for 1-10 days (configurable daily cost)
// - RENTED: shop slots show ONLY the current renter's active auctioneer listings
// - UNRENTED: stock works exactly like vendingmachine1 (static config +
//   market overlay + market-only items, tabs/scroll, vending fallback)
// - Purchases credit AUCTION_MARKET_DATA payouts[seller] (claim at Auctioneer)
// - 1 unit per click, remainingQty decrements, listing marks sold at 0
// - NPC-stored rental info (persists per NPC)
// - World data tracks owned/expired shops (for shop_rent_block.js)
// - Admin controls with barrier item
// - Appearance controls (name/title/skin)
// - Coin currency system (stone/coal/emerald)
//
// MARKET: Reads AUCTION_MARKET_DATA:1 (same as vendingmachine1.js)
//
// INSTALLATION:
// 1. Place on NPC > Advanced > Scripts
// 2. Set language to "ECMAScript"
// 3. Paste this script
//
// USAGE:
// - Players: Right-click to browse/buy the renter's listed items
// - Renters: List items at the Auctioneer NPC, they appear here automatically
// - Admins (hold barrier): Admin controls
// ============================================================================

// ============================================================================
// JAVA TYPES
// ============================================================================
var SYS = Java.type("java.lang.System");

// ============================================================================
// CONSTANTS
// ============================================================================
var MAX_RENT_DAYS = 10;
var RENT_COST_PER_DAY = 0;
var STONE_TO_COAL = 100;
var COAL_TO_EMERALD = 100;
var DAY_MS = 86400000;
var MARKET_ID = 1;
var WORLD_DATA_PREFIX = "AUCTION_MARKET_DATA:";

// ============================================================================
// VENDING STOCK (active while nobody is renting) - from vendingmachine1.js
// ============================================================================
var CONFIG_MAX_PAGES = 2;

var CONFIG_TAB_ICONS = [
    "minecraft:sweet_berries",
    "minecraft:splash_potion",
];

var CONFIG_TAB_NAMES = [
    "Food",
    "Potions",
];

var CONFIG_TAB_ROWS = [
    6,
    6,
];

var CONFIG_SHOP_ITEMS = [
    [
        { id: "minecraft:sweet_berries",  count: 1, price: 1,  lore: [] },
        { id: "minecraft:carrot",         count: 1, price: 2,  lore: [] },
        { id: "minecraft:apple",          count: 1, price: 2,  lore: [] },
        { id: "minecraft:baked_potato",   count: 1, price: 3,  lore: [] },
        { id: "minecraft:cooked_chicken", count: 1, price: 3,  lore: [] },
        { id: "minecraft:cooked_beef",    count: 1, price: 6,  lore: [] },
    ],
    [
        { id: "potion:strong_swiftness", count: 1, price: 5,   lore: [] },
        { id: "potion:strong_healing",   count: 1, price: 12,  lore: [] },
    ],
];

// GUI IDs
var GUI_SHOP = 176;
var GUI_RENT = 2001;
var GUI_ADMIN = 2003;
var GUI_APPEARANCE = 2004;

// Component IDs - Rent
var RENT_TF_DAYS = 4;
var RENT_BTN_PAY = 6;
var RENT_BTN_CANCEL = 7;

// Component IDs - Admin
var ADM_BTN_CLEAR = 26;
var ADM_BTN_CLOSE = 27;

// Grid component IDs (vending stock mode)
var ID_TAB_BASE = 102;
var ID_SCROLL_UP = 111;
var ID_SCROLL_DOWN = 112;

// Left panel IDs
var ID_LBL_INFO_TITLE = 200;
var ID_LBL_RENTER = 201;
var ID_LBL_EARNINGS = 202;
var ID_LBL_RENT_EXPIRY = 204;
var ID_BTN_RENT = 205;
var ID_BTN_APPEARANCE = 206;
var ID_BTN_STOP = 207;
var ID_LBL_HINT = 209;

// Appearance GUI
var ID_APP_TITLE_FIELD = 300;
var ID_APP_SKIN_FIELD = 301;
var ID_APP_BTN_SAVE = 302;
var ID_APP_BTN_CANCEL = 303;
var ID_APP_NAME_FIELD = 304;

// ============================================================================
// STATE VARIABLES
// ============================================================================
var guiRef = null;
var mySlots = [];
var lastNpc = null;
var playerNpcMap = {};
var playerGuiRef = {};
var playerRentNpc = {};
var rentalInfo = null;
var storedSlotItems = [];
var slotListingIds = {};
var numCols = 9;
var viewportRows = 6;
var slotPositions = [];
var startX = 0;
var startY = -50;
var rowSpacing = 18;
var colSpacing = 18;

// Vending stock state (unrented mode)
var stockMode = "market";
var tabSlots = [];
var selectedMarketListings = {};
var currentPage = 0;
var maxPages = CONFIG_MAX_PAGES;
var totalRows = CONFIG_TAB_ROWS[0];
var viewportRow = 0;

for (var row = 0; row < viewportRows; row++) {
    var y = startY + row * rowSpacing;
    for (var col = 0; col < numCols; col++) {
        var x = startX + col * colSpacing;
        slotPositions.push({x: x, y: y});
    }
}

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
// MARKET DATA (shared with npc_auctioneer.js / vendingmachine1.js)
// ============================================================================
function getMarketDataKey(marketId) {
    return WORLD_DATA_PREFIX + marketId;
}

function emptyMarketData() {
    return { listings: [], payouts: {}, returns: {} };
}

function loadMarketData(world) {
    var key = getMarketDataKey(MARKET_ID);
    var store = world.getStoreddata();
    var raw = store.get(key);
    if (raw === null || raw === undefined || raw === "") return emptyMarketData();
    try {
        var data = JSON.parse("" + raw);
        if (!data.listings) data.listings = [];
        if (!data.payouts) data.payouts = {};
        if (!data.returns) data.returns = {};
        return data;
    } catch (e) {
        return emptyMarketData();
    }
}

function saveMarketData(world, data) {
    var key = getMarketDataKey(MARKET_ID);
    world.getStoreddata().put(key, JSON.stringify(data));
}

function isListingExpired(L) {
    return Date.now() > (L.createdAt + L.days * DAY_MS);
}

function getUnitPrice(L) {
    if (L.unitPrice) return L.unitPrice;
    var qty = L.originalQty || L.remainingQty || 1;
    if (qty > 1) return Math.round(L.price / qty);
    return L.price;
}

function getRenterListings(world, renterUUID) {
    if (!renterUUID) return [];
    var data = loadMarketData(world);
    var result = [];
    for (var i = 0; i < data.listings.length; i++) {
        var L = data.listings[i];
        if (L.status !== "active") continue;
        if (isListingExpired(L)) continue;
        if (L.sellerUuid !== renterUUID) continue;
        var remaining = L.remainingQty || L.originalQty || 1;
        if (remaining < 1) continue;
        result.push(L);
    }
    return result;
}

function getRenterPayout(world, renterUUID) {
    if (!renterUUID) return 0;
    var data = loadMarketData(world);
    return data.payouts[renterUUID] || 0;
}

function deserializeItem(nbtStr, world) {
    if (!nbtStr) return null;
    try {
        var api = Java.type("noppes.npcs.api.NpcAPI").Instance();
        var nbt = api.stringToNbt(nbtStr);
        return world.createItemFromNbt(nbt);
    } catch(e) { return null; }
}

// ============================================================================
// VENDING STOCK HELPERS (active while nobody is renting) - from vendingmachine1.js
// ============================================================================
function getActiveListings(marketData) {
    if (!marketData || !marketData.listings) return [];
    var result = [];
    var nowMs = Date.now();
    for (var i = 0; i < marketData.listings.length; i++) {
        var L = marketData.listings[i];
        if (L.status === "active" && nowMs < L.createdAt + L.days * DAY_MS) result.push(L);
    }
    return result;
}

function getItemIdFromListing(listing, world) {
    var item = deserializeItem(listing.itemNbt, world);
    if (!item) return null;
    return item.getName();
}

function getListingsForItem(marketData, itemId, world) {
    var active = getActiveListings(marketData);
    var matches = [];
    for (var i = 0; i < active.length; i++) {
        var L = active[i];
        var remainingQty = L.remainingQty || L.originalQty || 1;
        if (remainingQty < 1) continue;
        if (getItemIdFromListing(L, world) === itemId) matches.push(L);
    }
    matches.sort(function(a, b) { return getUnitPrice(a) - getUnitPrice(b); });
    return matches;
}

function pickRandomFromCheapest(listings) {
    if (listings.length === 0) return null;
    var poolSize = Math.min(3, listings.length);
    return listings[Math.floor(Math.random() * poolSize)];
}

function findListingById(marketData, id) {
    for (var i = 0; i < marketData.listings.length; i++) {
        if (marketData.listings[i].id === id) return marketData.listings[i];
    }
    return null;
}

function getMarketFoodIds(world) {
    var active = getActiveListings(loadMarketData(world));
    var ids = {};
    for (var i = 0; i < active.length; i++) {
        var itemId = getItemIdFromListing(active[i], world);
        if (itemId) ids[itemId] = true;
    }
    return ids;
}

function viewportToGlobal(slotIndex) {
    var localRow = Math.floor(slotIndex / numCols);
    var localCol = slotIndex % numCols;
    return (viewportRow + localRow) * numCols + localCol;
}

function createPotionItem(world, potionId) {
    var item = world.createItem("minecraft:splash_potion", 1);
    item.getNbt().putString("Potion", potionId);
    return item;
}

function cfg_price_for_id(itemId) {
    var foods = CONFIG_SHOP_ITEMS[0] || [];
    for (var i = 0; i < foods.length; i++) {
        if (foods[i].id === itemId) return foods[i].price;
    }
    return 0;
}

function buildShopDataFromConfig(player) {
    var world = player.getWorld();
    var shopData = {};
    selectedMarketListings = {};

    var foodRows = CONFIG_TAB_ROWS[0] || 6;
    var totalFoodSlots = foodRows * numCols;
    var foodArr = makeNullArray(totalFoodSlots);
    var slotIdx = 0;

    var marketData = loadMarketData(world);
    var marketFoodIds = getMarketFoodIds(world);

    var staticFoods = CONFIG_SHOP_ITEMS[0] || [];
    for (var i = 0; i < staticFoods.length && slotIdx < totalFoodSlots; i++) {
        var cfg = staticFoods[i];
        if (!cfg) continue;

        var listings = getListingsForItem(marketData, cfg.id, world);
        var displayPrice = cfg.price;
        var source = "Vending";

        if (listings.length > 0) {
            var selected = pickRandomFromCheapest(listings);
            selectedMarketListings[slotIdx] = selected.id;
            displayPrice = getUnitPrice(selected);
            source = "Market";
        }

        try {
            var item = world.createItem(cfg.id, cfg.count || 1);
            var loreArr = cfg.lore ? cfg.lore.slice() : [];
            loreArr.push("");
            loreArr.push("§aPrice: §e" + displayPrice + "¢");
            loreArr.push("§7Source: " + source);
            item.setLore(loreArr);
            item.setCustomName(item.getDisplayName());
            foodArr[slotIdx] = item.getItemNbt().toJsonString();
        } catch (e) {
            foodArr[slotIdx] = null;
        }
        slotIdx++;
    }

    if (marketFoodIds) {
        var marketIds = Object.keys(marketFoodIds);
        for (var i = 0; i < marketIds.length && slotIdx < totalFoodSlots; i++) {
            var foodId = marketIds[i];
            var alreadyStatic = false;
            for (var s = 0; s < staticFoods.length; s++) {
                if (staticFoods[s] && staticFoods[s].id === foodId) {
                    alreadyStatic = true;
                    break;
                }
            }
            if (alreadyStatic) continue;

            var mListings = getListingsForItem(marketData, foodId, world);
            if (mListings.length === 0) continue;

            var mSelected = pickRandomFromCheapest(mListings);
            var mPrice = getUnitPrice(mSelected);

            try {
                var mItem = world.createItem(foodId, 1);
                var mLore = [];
                mLore.push("");
                mLore.push("§aPrice: §e" + mPrice + "¢");
                mLore.push("§7Source: Market");
                mItem.setLore(mLore);
                mItem.setCustomName(mItem.getDisplayName());
                foodArr[slotIdx] = mItem.getItemNbt().toJsonString();
                selectedMarketListings[slotIdx] = mSelected.id;
                slotIdx++;
            } catch (e) {}
        }
    }

    shopData[0] = foodArr;

    var potionRows = CONFIG_TAB_ROWS[1] || 6;
    var totalPotionSlots = potionRows * numCols;
    var potionArr = makeNullArray(totalPotionSlots);
    var potions = CONFIG_SHOP_ITEMS[1] || [];
    for (var i = 0; i < potions.length && i < totalPotionSlots; i++) {
        var cfg = potions[i];
        if (!cfg) continue;
        try {
            var pitem;
            if (cfg.id.indexOf("potion:") === 0) {
                var potionId = cfg.id.substring(7);
                pitem = createPotionItem(world, potionId);
                var displayName = potionId.replace(/_/g, " ").replace(/\b\w/g, function(c) { return c.toUpperCase(); });
                pitem.setCustomName("§bSplash Potion of " + displayName);
            } else {
                pitem = world.createItem(cfg.id, cfg.count || 1);
            }
            var ploreArr = cfg.lore ? cfg.lore.slice() : [];
            ploreArr.push("");
            ploreArr.push("§aPrice: §e" + (cfg.price || 0) + "¢");
            ploreArr.push("§7Source: Vending");
            pitem.setLore(ploreArr);
            potionArr[i] = pitem.getItemNbt().toJsonString();
        } catch (e) {
            potionArr[i] = null;
        }
    }
    shopData[1] = potionArr;

    return shopData;
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

function refreshSlot(player, api, slotIndex) {
    if (!api) {
        try { api = Java.type("noppes.npcs.api.NpcAPI").Instance(); } catch(e) {}
    }
    var world = player.getWorld();
    var globalIndex = viewportToGlobal(slotIndex);
    var marketData = loadMarketData(world);

    if (!storedSlotItems[currentPage]) return;
    var currentNbt = storedSlotItems[currentPage][globalIndex];
    if (!currentNbt) return;

    var currentItem = player.world.createItemFromNbt(api.stringToNbt(currentNbt));
    var itemId = currentItem.getName();
    var oldLore = currentItem.getLore();

    var sourceLine = "";
    for (var i = 0; i < oldLore.length; i++) {
        if (oldLore[i].indexOf("Source:") !== -1) sourceLine = oldLore[i];
    }

    if (sourceLine.indexOf("Vending") !== -1) return;

    var listings = getListingsForItem(marketData, itemId, world);
    if (listings.length === 0) {
        delete selectedMarketListings[globalIndex];
        var fallbackPrice = cfg_price_for_id(itemId);

        if (fallbackPrice === 0) {
            storedSlotItems[currentPage][globalIndex] = null;
            mySlots[slotIndex].setStack(null);
            if (guiRef) guiRef.update();
            return;
        }

        var cleanLore = [];
        for (var i = 0; i < oldLore.length; i++) {
            if (oldLore[i].indexOf("Price:") === -1 && oldLore[i].indexOf("Source:") === -1) {
                cleanLore.push(oldLore[i]);
            }
        }
        while (cleanLore.length > 0 && cleanLore[cleanLore.length - 1] === "") cleanLore.pop();
        cleanLore.push("");
        cleanLore.push("§aPrice: §e" + fallbackPrice + "¢");
        cleanLore.push("§7Source: Vending");
        currentItem.setLore(cleanLore);
        storedSlotItems[currentPage][globalIndex] = currentItem.getItemNbt().toJsonString();
        mySlots[slotIndex].setStack(currentItem);
        if (guiRef) guiRef.update();
        return;
    }

    var selected = pickRandomFromCheapest(listings);
    selectedMarketListings[globalIndex] = selected.id;
    var newPrice = getUnitPrice(selected);

    var cleanLore = [];
    for (var i = 0; i < oldLore.length; i++) {
        if (oldLore[i].indexOf("Price:") === -1 && oldLore[i].indexOf("Source:") === -1) {
            cleanLore.push(oldLore[i]);
        }
    }
    while (cleanLore.length > 0 && cleanLore[cleanLore.length - 1] === "") cleanLore.pop();
    cleanLore.push("");
    cleanLore.push("§aPrice: §e" + newPrice + "¢");
    cleanLore.push("§7Source: Market");
    currentItem.setLore(cleanLore);
    storedSlotItems[currentPage][globalIndex] = currentItem.getItemNbt().toJsonString();
    mySlots[slotIndex].setStack(currentItem);
    if (guiRef) guiRef.update();
}

// Market purchase returning {success, error} (vendingmachine1 style) -
// credits AUCTION_MARKET_DATA payouts[seller] for claim at Auctioneer.
function doVendingPurchase(player, listing) {
    var world = player.getWorld();
    var marketData = loadMarketData(world);
    var freshListing = findListingById(marketData, listing.id);

    if (!freshListing || freshListing.status !== "active") {
        return { success: false, error: "Listing no longer available" };
    }
    if (isListingExpired(freshListing)) {
        return { success: false, error: "Listing has expired" };
    }

    var remainingQty = freshListing.remainingQty || freshListing.originalQty || 1;
    if (remainingQty < 1) {
        return { success: false, error: "No items remaining" };
    }

    var priceToPay = getUnitPrice(freshListing);
    if (countPlayerCoins(player) < priceToPay) {
        return { success: false, error: "Not enough coins. Need: " + priceToPay + "¢" };
    }
    if (!removeCoins(player, priceToPay)) {
        return { success: false, error: "Payment failed" };
    }

    freshListing.remainingQty = remainingQty - 1;
    if (freshListing.remainingQty <= 0) {
        freshListing.status = "sold";
        freshListing.soldAt = Date.now();
        freshListing.buyerName = player.getName();
    }

    if (!marketData.payouts[freshListing.sellerUuid]) marketData.payouts[freshListing.sellerUuid] = 0;
    marketData.payouts[freshListing.sellerUuid] += priceToPay;
    saveMarketData(world, marketData);

    var item = deserializeItem(freshListing.itemNbt, world);
    if (item) {
        item.setStackSize(1);
        if (!player.giveItem(item)) player.dropItem(item);
    }

    player.updatePlayerInventory();
    return { success: true, price: priceToPay };
}

function drawTabHighlight() {
    if (!guiRef) return;
    try {
        guiRef.removeComponent(20);
        guiRef.removeComponent(21);
        guiRef.removeComponent(22);
        guiRef.removeComponent(23);
    } catch(e) {}
    try {
        var tw = 25, th = 28, ts = 2, tx = 0, ty = -80;
        var hx = tx + currentPage * (tw + ts);
        guiRef.addColoredLine(20, hx - 1,      ty - 1,      hx + tw + 1, ty - 1,      0xFFFF00, 2);
        guiRef.addColoredLine(21, hx - 1,      ty + th + 1, hx + tw + 1, ty + th + 1, 0xFFFF00, 2);
        guiRef.addColoredLine(22, hx - 1,      ty - 1,      hx - 1,      ty + th + 1, 0xFFFF00, 2);
        guiRef.addColoredLine(23, hx + tw + 1, ty - 1,      hx + tw + 1, ty + th + 1, 0xFFFF00, 2);
    } catch(e) {}
}

function buildShopVendingUi(player) {
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

    var scrollX = startX + (numCols * colSpacing) + 2;
    var scrollY = startY;
    guiRef.addButton(ID_SCROLL_UP, "↑", scrollX, scrollY, 18, 18);
    guiRef.addButton(ID_SCROLL_DOWN, "↓", scrollX, scrollY + 20, 18, 18);
    guiRef.addLabel(10, "", scrollX + 1, scrollY + 42, 0.7, 0.7);

    for (var i = 0; i < tabSlots.length; i++) {
        try {
            var iconItem = player.getWorld().createItem(CONFIG_TAB_ICONS[i] || "minecraft:barrier", 1);
            iconItem.setCustomName(CONFIG_TAB_NAMES[i] || ("Tab " + (i + 1)));
            tabSlots[i].setStack(iconItem);
        } catch(e) {}
    }

    drawTabHighlight();
}

// ============================================================================
// WORLD DATA (shared with shop_rent_block.js)
// ============================================================================
var WORLD_DATA_KEY = "ShopRentData";

function getWorldData(world) {
    var wdata = world.getStoreddata();
    if (!wdata.has(WORLD_DATA_KEY)) {
        var empty = { playerShops: {}, npcRegistry: {} };
        wdata.put(WORLD_DATA_KEY, JSON.stringify(empty));
        return empty;
    }
    try { return JSON.parse(wdata.get(WORLD_DATA_KEY)); } catch(e) { return { playerShops: {}, npcRegistry: {} }; }
}

function saveWorldData(world, data) {
    world.getStoreddata().put(WORLD_DATA_KEY, JSON.stringify(data));
}

function getPlayerData(world, playerUUID) {
    var wd = getWorldData(world);
    if (!wd.playerShops[playerUUID]) {
        wd.playerShops[playerUUID] = { ownedShops: [], expiredShops: [] };
        saveWorldData(world, wd);
    }
    var pd = wd.playerShops[playerUUID];
    if (!pd.ownedShops) pd.ownedShops = [];
    if (!pd.expiredShops) pd.expiredShops = [];
    return pd;
}

function savePlayerData(world, playerUUID, data) {
    var wd = getWorldData(world);
    wd.playerShops[playerUUID] = data;
    saveWorldData(world, wd);
}

function getNpcRegistry(world) {
    var wd = getWorldData(world);
    if (!wd.npcRegistry) { wd.npcRegistry = {}; saveWorldData(world, wd); }
    return wd.npcRegistry;
}

function registerNpc(world, npcUUID, npcDisplayName, pos) {
    var reg = getNpcRegistry(world);
    reg[npcUUID] = {
        displayName: npcDisplayName,
        x: pos.getX(),
        y: pos.getY(),
        z: pos.getZ()
    };
    var wd = getWorldData(world);
    wd.npcRegistry = reg;
    saveWorldData(world, wd);
}

// Move a shop entry out of owner's active list into their expired list.
// Clock for shop_rent_block's 10-day retention starts at min(expiryDate, now).
function moveOwnerToExpired(world, ownerUUID, npcUUID, nowMs) {
    if (!ownerUUID) return;
    var prevPd = getPlayerData(world, ownerUUID);
    var moved = null;
    for (var i = prevPd.ownedShops.length - 1; i >= 0; i--) {
        if (prevPd.ownedShops[i].npcUUID === npcUUID) {
            moved = prevPd.ownedShops.splice(i, 1)[0];
            break;
        }
    }
    if (!moved) return;
    if (!moved.expiryDate || moved.expiryDate > nowMs) moved.expiryDate = nowMs;
    for (var j = prevPd.expiredShops.length - 1; j >= 0; j--) {
        if (prevPd.expiredShops[j].npcUUID === npcUUID) prevPd.expiredShops.splice(j, 1);
    }
    prevPd.expiredShops.push(moved);
    savePlayerData(world, ownerUUID, prevPd);
}

function removeNpcFromPlayer(world, playerUUID, npcUUID) {
    var pd = getPlayerData(world, playerUUID);
    var changed = false;
    for (var i = pd.ownedShops.length - 1; i >= 0; i--) {
        if (pd.ownedShops[i].npcUUID === npcUUID) { pd.ownedShops.splice(i, 1); changed = true; }
    }
    for (var j = pd.expiredShops.length - 1; j >= 0; j--) {
        if (pd.expiredShops[j].npcUUID === npcUUID) { pd.expiredShops.splice(j, 1); changed = true; }
    }
    if (changed) savePlayerData(world, playerUUID, pd);
}

// ============================================================================
// RENTAL DATA
// ============================================================================
function emptyRentalInfo() {
    return { renterName: "", renterUUID: "", rentedDate: 0, expiryDate: 0, rentCostPerDay: RENT_COST_PER_DAY, totalEarnings: 0, npcCoord: "" };
}

function loadRentalInfo(npcData) {
    var rawData = safeGetData(npcData, "RentalInfo", null);
    if (rawData === null) {
        var emptyInfo = emptyRentalInfo();
        atomicSave(npcData, "RentalInfo", emptyInfo);
        return emptyInfo;
    }
    var parsed = safeJSONParse(rawData, null);
    if (parsed === null) {
        var emptyInfo = emptyRentalInfo();
        atomicSave(npcData, "RentalInfo", emptyInfo);
        return emptyInfo;
    }
    return parsed;
}

function saveRentalInfo(npcData, info) {
    if (lastNpc) {
        var pos = lastNpc.getPos();
        info.npcCoord = pos.getX() + "," + pos.getY() + "," + pos.getZ();
    }
    atomicSave(npcData, "RentalInfo", info);
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

function parsePriceInput(str) {
    str = str.trim();
    var dollars = parseFloat(str);
    if (isNaN(dollars) || dollars < 0) return 0;
    return Math.floor(dollars * 100);
}

// ============================================================================
// MAIN INTERACT HANDLER
// ============================================================================
function interact(event) {
    var player = event.player;
    var api = event.API;
    var playerUUID = player.getUUID();
    var npcPos = event.npc.getPos();
    var npcCoordKey = npcPos.getX() + "," + npcPos.getY() + "," + npcPos.getZ();

    var existingNpcCoord = playerNpcMap[playerUUID];
    if (existingNpcCoord && existingNpcCoord !== npcCoordKey) {
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
    playerNpcMap[playerUUID] = npcCoordKey;
    var npcData = lastNpc.getStoreddata();
    rentalInfo = loadRentalInfo(npcData);
    var adminMode = (player.getMainhandItem() && !player.getMainhandItem().isEmpty() && player.getMainhandItem().getName() === "minecraft:barrier");

    if (adminMode) {
        openAdminGui(player, api, npcData);
        return;
    }

    openShop(player, api, npcData);
}

// ============================================================================
// BUILD LISTING SLOTS - From current renter's active auctioneer listings
// ============================================================================
function buildListingSlots(player, api, world) {
    var totalSlots = viewportRows * numCols;
    storedSlotItems = makeNullArray(totalSlots);
    slotListingIds = {};

    if (!rentalInfo || !rentalInfo.renterUUID || isExpired(rentalInfo)) return;

    var listings = getRenterListings(world, rentalInfo.renterUUID);
    var isOwner = rentalInfo.renterUUID === player.getUUID();
    var slotIdx = 0;

    for (var i = 0; i < listings.length && slotIdx < totalSlots; i++) {
        var L = listings[i];
        var item = deserializeItem(L.itemNbt, world);
        if (!item) continue;

        var remaining = L.remainingQty || L.originalQty || 1;
        item.setStackSize(Math.min(remaining, 64));

        var unitP = getUnitPrice(L);
        var lore = [];
        var existing = item.getLore();
        for (var j = 0; j < existing.length; j++) {
            if (existing[j].indexOf("Price:") === -1 && existing[j].indexOf("Remaining:") === -1 && existing[j].indexOf("Click to purchase") === -1 && existing[j].indexOf("Your listing") === -1) {
                lore.push(existing[j]);
            }
        }
        while (lore.length > 0 && lore[lore.length - 1] === "") lore.pop();
        lore.push("");
        lore.push("§aPrice: §e" + formatPrice(unitP));
        if (remaining > 1) lore.push("§7Remaining: §f" + remaining);
        lore.push("§7Click to purchase");
        item.setLore(lore);

        storedSlotItems[slotIdx] = item.getItemNbt().toJsonString();
        slotListingIds[slotIdx] = L.id;
        slotIdx++;
    }
}

// ============================================================================
// SHOP GUI
// ============================================================================
function openShop(player, api, npcData) {
    rentalInfo = loadRentalInfo(npcData);
    var adminMode = (player.getMainhandItem() && !player.getMainhandItem().isEmpty() && player.getMainhandItem().getName() === "minecraft:barrier");
    var world = lastNpc ? lastNpc.getWorld() : player.getWorld();
    var isOwner = rentalInfo.renterUUID === player.getUUID();
    var isActivelyRenting = rentalInfo.renterUUID && !isExpired(rentalInfo);

    guiRef = api.createCustomGui(GUI_SHOP, 166, 0, true, player);
    mySlots = slotPositions.map(function(pos) {
        return guiRef.addItemSlot(pos.x, pos.y);
    });

    if (isActivelyRenting) {
        var titleText = isOwner ? "§6§lYour Shop" : "§6§lShop";
        guiRef.addLabel(ID_LBL_INFO_TITLE, titleText, -128, -76, 118, 12);
        guiRef.addLabel(ID_LBL_RENTER, "§7Owner: §f" + rentalInfo.renterName, -128, -62, 118, 10);
        guiRef.addLabel(ID_LBL_RENT_EXPIRY, "§7Expires: §f" + timeLeftStr(rentalInfo), -128, -50, 118, 10);

        var payout = getRenterPayout(world, rentalInfo.renterUUID);
        guiRef.addLabel(ID_LBL_EARNINGS, "§7Earnings: §a" + formatPrice(payout), -128, -38, 118, 10);
        guiRef.addLabel(ID_LBL_HINT, "§8Claim at Auctioneer", -128, -26, 118, 10);
        guiRef.addLabel(ID_LBL_HINT + 1, "§8List items there too", -128, -16, 118, 10);

        if (isOwner) {
            guiRef.addButton(ID_BTN_STOP, "§c§lStop Renting", -128, 4, 80, 18);
            guiRef.addButton(ID_BTN_RENT, "§a§l+ Extend", -128, 26, 80, 18);
            guiRef.addButton(ID_BTN_APPEARANCE, "§d§lAppearance", -128, 48, 80, 18);
        }

        stockMode = "rented";
        buildListingSlots(player, api, world);
    } else {
        guiRef.addLabel(ID_LBL_INFO_TITLE, "§6§lShop Rental", -128, -76, 118, 12);
        guiRef.addLabel(ID_LBL_RENTER, "§7Status: §aAvailable", -128, -62, 118, 10);
        guiRef.addLabel(ID_LBL_HINT, "§7Cost per day: §e" + formatPrice(RENT_COST_PER_DAY), -128, -50, 118, 10);
        guiRef.addLabel(ID_LBL_HINT + 1, "§7Your balance: §e" + formatPrice(countPlayerCoins(player)), -128, -38, 118, 10);
        guiRef.addLabel(ID_LBL_HINT + 2, "§7Days (1-" + MAX_RENT_DAYS + "):", -128, -26, 118, 10);
        guiRef.addTextField(RENT_TF_DAYS, -128, -14, 50, 16).setText("1");
        guiRef.addLabel(ID_LBL_HINT + 3, "§7Total: §a" + formatPrice(RENT_COST_PER_DAY), -128, 6, 118, 10);
        guiRef.addButton(RENT_BTN_PAY, "§a§lRent Shop", -128, 24, 80, 18);

        // UNRENTED: stock works exactly like vendingmachine1
        stockMode = "market";
        currentPage = 0;
        viewportRow = 0;
        totalRows = CONFIG_TAB_ROWS[0] || 6;
        buildShopVendingUi(player);

        storedSlotItems = buildShopDataFromConfig(player);
        if (!storedSlotItems[currentPage]) {
            storedSlotItems[currentPage] = makeNullArray(totalRows * numCols);
        }
    }

    player.showCustomGui(guiRef);
    playerGuiRef[player.getUUID()] = guiRef;

    updateVisibleSlots(player, api);
    if (stockMode === "market") updateScrollIndicator();
    if (guiRef) guiRef.update();
}

function updateVisibleSlots(player, api) {
    for (var i = 0; i < mySlots.length; i++) {
        mySlots[i].setStack(null);
        var nbtStr = null;
        if (stockMode === "market") {
            var pageArr = storedSlotItems[currentPage];
            if (pageArr) nbtStr = pageArr[viewportToGlobal(i)];
        } else {
            nbtStr = storedSlotItems[i];
        }
        if (nbtStr) {
            try {
                var item = player.world.createItemFromNbt(api.stringToNbt(nbtStr));
                mySlots[i].setStack(item);
            } catch(e) {}
        }
    }
}

function refreshShop(player, api) {
    if (!lastNpc) return;
    var npcData = lastNpc.getStoreddata();
    openShop(player, api, npcData);
}

// ============================================================================
// PURCHASE - 1 unit, credits AUCTION_MARKET_DATA payouts (vendingmachine1 style)
// ============================================================================
function doMarketPurchase(player, api, slotIndex) {
    var world = player.getWorld();
    var listingId = slotListingIds[slotIndex];
    if (!listingId) {
        player.message("§cThat listing is no longer available!");
        return;
    }

    rentalInfo = loadRentalInfo(lastNpc.getStoreddata());
    if (!rentalInfo.renterUUID || isExpired(rentalInfo)) {
        player.message("§cThis shop is not currently rented!");
        refreshShop(player, api);
        return;
    }

    var marketData = loadMarketData(world);
    var freshListing = null;
    for (var i = 0; i < marketData.listings.length; i++) {
        if (marketData.listings[i].id === listingId) {
            freshListing = marketData.listings[i];
            break;
        }
    }

    if (!freshListing || freshListing.status !== "active") {
        player.message("§cListing no longer available!");
        refreshShop(player, api);
        return;
    }
    if (isListingExpired(freshListing)) {
        player.message("§cListing has expired!");
        refreshShop(player, api);
        return;
    }
    if (freshListing.sellerUuid !== rentalInfo.renterUUID) {
        player.message("§cThis listing no longer belongs to the shop owner!");
        refreshShop(player, api);
        return;
    }
    var remainingQty = freshListing.remainingQty || freshListing.originalQty || 1;
    if (remainingQty < 1) {
        player.message("§cNo items remaining!");
        refreshShop(player, api);
        return;
    }

    var priceToPay = getUnitPrice(freshListing);
    if (countPlayerCoins(player) < priceToPay) {
        player.message("§cNot enough coins! Need: §e" + formatPrice(priceToPay));
        return;
    }
    if (!removeCoins(player, priceToPay)) {
        player.message("§cTransaction failed!");
        return;
    }

    freshListing.remainingQty = remainingQty - 1;
    if (freshListing.remainingQty <= 0) {
        freshListing.status = "sold";
        freshListing.soldAt = Date.now();
        freshListing.buyerName = player.getName();
    }

    if (!marketData.payouts[freshListing.sellerUuid]) marketData.payouts[freshListing.sellerUuid] = 0;
    marketData.payouts[freshListing.sellerUuid] += priceToPay;
    saveMarketData(world, marketData);

    var item = deserializeItem(freshListing.itemNbt, world);
    if (item) {
        item.setStackSize(1);
        if (!player.giveItem(item)) player.dropItem(item);
    }

    player.updatePlayerInventory();
    player.message("§aBought from §f" + freshListing.sellerName + " §afor §e" + formatPrice(priceToPay) + "§a!");
    refreshShop(player, api);
}

// ============================================================================
// BUTTON HANDLER
// ============================================================================
function customGuiButton(event) {
    var player = event.player;
    var api = event.API;
    var gui = event.gui;
    var buttonId = event.buttonId;
    var npcData = lastNpc ? lastNpc.getStoreddata() : null;

    // Vending-stock controls (unrented mode only)
    if (stockMode === "market" && gui.getID() === GUI_SHOP) {
        var maxViewportRow = Math.max(0, totalRows - viewportRows);

        if (buttonId === ID_SCROLL_UP) {
            if (viewportRow > 0) {
                viewportRow--;
                updateVisibleSlots(player, api);
                updateScrollIndicator();
                if (guiRef) guiRef.update();
            }
            return;
        }

        if (buttonId === ID_SCROLL_DOWN) {
            if (viewportRow < maxViewportRow) {
                viewportRow++;
                updateVisibleSlots(player, api);
                updateScrollIndicator();
                if (guiRef) guiRef.update();
            }
            return;
        }

        if (buttonId >= ID_TAB_BASE && buttonId < ID_TAB_BASE + maxPages) {
            var tabIndex = buttonId - ID_TAB_BASE;
            if (tabIndex !== currentPage) {
                currentPage = tabIndex;
                viewportRow = 0;
                totalRows = CONFIG_TAB_ROWS[currentPage] || 5;
                storedSlotItems = buildShopDataFromConfig(player);
                if (!storedSlotItems[currentPage]) {
                    storedSlotItems[currentPage] = makeNullArray(totalRows * numCols);
                }
                drawTabHighlight();
                updateVisibleSlots(player, api);
                updateScrollIndicator();
                if (guiRef) guiRef.update();
            }
            return;
        }
    }

    if (!npcData) return;

    rentalInfo = loadRentalInfo(npcData);
    var isOwner = rentalInfo.renterUUID === player.getUUID();

    // Stop Renting (owner, active rental)
    if (buttonId === ID_BTN_STOP && isOwner && !isExpired(rentalInfo)) {
        handleStopRenting(player, npcData);
        return;
    }

    // Extend / Rent
    if (buttonId === ID_BTN_RENT && isOwner && !isExpired(rentalInfo)) {
        openRentGui(player, api, npcData);
        return;
    }

    // Appearance
    if (buttonId === ID_BTN_APPEARANCE && isOwner && !isExpired(rentalInfo)) {
        openAppearanceGui(player, api);
        return;
    }

    // Rent Shop (available view)
    if (buttonId === RENT_BTN_PAY && (isExpired(rentalInfo) || !rentalInfo.renterName)) {
        handleRentPayment(player, api, npcData, gui);
        return;
    }

    // Appearance GUI
    if (gui.getID() === GUI_APPEARANCE) {
        if (buttonId === ID_APP_BTN_SAVE) {
            handleAppearanceSave(player, api, gui);
            return;
        }
        if (buttonId === ID_APP_BTN_CANCEL) {
            player.closeGui();
            openShop(player, api, npcData);
            return;
        }
        return;
    }

    // Rent GUI
    if (gui.getID() === GUI_RENT) {
        var rentNpc = playerRentNpc[player.getUUID()];
        if (rentNpc) {
            lastNpc = rentNpc;
            npcData = rentNpc.getStoreddata();
        }
        if (buttonId === RENT_BTN_CANCEL) {
            player.closeGui();
            openShop(player, api, npcData);
            return;
        }
        if (buttonId === RENT_BTN_PAY) {
            handleRentPayment(player, api, npcData, gui);
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
}

// ============================================================================
// SLOT CLICK HANDLER - Customers buy 1 unit from the listing
// ============================================================================
function customGuiSlotClicked(event) {
    var clickedSlot = event.slot;
    var player = event.player;
    var api = event.API;
    if (!lastNpc) return;

    var slotIndex = mySlots.indexOf(clickedSlot);
    if (slotIndex === -1) return;

    if (stockMode === "market") {
        doVendingSlotClick(player, api, slotIndex);
        return;
    }

    doMarketPurchase(player, api, slotIndex);
}

// ============================================================================
// VENDING STOCK PURCHASE (unrented mode) - from vendingmachine1.js
// ============================================================================
function doVendingSlotClick(player, api, slotIndex) {
    var world = player.getWorld();
    var globalIndex = viewportToGlobal(slotIndex);

    // Shop may have been rented while this GUI was open
    rentalInfo = loadRentalInfo(lastNpc.getStoreddata());
    if (rentalInfo.renterUUID && !isExpired(rentalInfo)) {
        player.message("§cThis shop has been rented - refreshing!");
        refreshShop(player, api);
        return;
    }

    var pageArr = storedSlotItems[currentPage];
    if (!pageArr || globalIndex >= pageArr.length) return;

    var slotItem = mySlots[slotIndex].getStack();
    if (!slotItem || slotItem.isEmpty()) return;

    var price = null;
    var lore = slotItem.getLore();
    for (var i = 0; i < lore.length; i++) {
        var line = lore[i];
        if (line.indexOf("Price:") !== -1 && line.indexOf("¢") !== -1) {
            var priceStr = line.replace(/§./g, "");
            var match = priceStr.match(/Price:\s*(\d+)¢/);
            if (match && match[1]) { price = parseInt(match[1]); break; }
        }
    }

    if (price === null || price === undefined || price <= 0) {
        player.message("§cThis item has no price set!");
        return;
    }

    var itemId = slotItem.getName();
    var isPotion = (itemId === "minecraft:splash_potion");

    var boughtFromMarket = false;
    if (currentPage === 0 && !isPotion) {
        var storedListingId = selectedMarketListings[globalIndex];
        if (storedListingId) {
            var marketData = loadMarketData(world);
            var listing = findListingById(marketData, storedListingId);
            if (listing && listing.status === "active") {
                var result = doVendingPurchase(player, listing);
                if (result.success) {
                    boughtFromMarket = true;
                    player.message("§aBought from §f" + listing.sellerName + " §afor §e" + result.price + "¢!");
                } else if (result.error.indexOf("Not enough coins") !== -1) {
                    player.message("§c" + result.error);
                } else {
                    player.message("§cMarket error: " + result.error + " §7Falling back to vending stock.");
                }
            } else {
                var listings = getListingsForItem(marketData, itemId, world);
                if (listings.length > 0) {
                    var fallback = pickRandomFromCheapest(listings);
                    var fallbackResult = doVendingPurchase(player, fallback);
                    if (fallbackResult.success) {
                        boughtFromMarket = true;
                        player.message("§aBought from §f" + fallback.sellerName + " §afor §e" + fallbackResult.price + "¢!");
                    } else if (fallbackResult.error.indexOf("Not enough coins") !== -1) {
                        player.message("§c" + fallbackResult.error);
                    } else {
                        player.message("§cMarket error: " + fallbackResult.error + " §7Falling back to vending stock.");
                    }
                } else if (cfg_price_for_id(itemId) === 0) {
                    pageArr[globalIndex] = null;
                    mySlots[slotIndex].setStack(null);
                    if (guiRef) guiRef.update();
                    player.message("§cThat item is no longer available!");
                    return;
                }
            }
        } else if (cfg_price_for_id(itemId) === 0) {
            pageArr[globalIndex] = null;
            mySlots[slotIndex].setStack(null);
            if (guiRef) guiRef.update();
            player.message("§cThat item is no longer available!");
            return;
        }
    }

    if (boughtFromMarket) {
        refreshSlot(player, api, slotIndex);
        return;
    }

    // Static vending purchase
    var playerCoins = countPlayerCoins(player);
    if (playerCoins < price) {
        player.message("§cNot enough coins! Need: §e" + price + "¢");
        return;
    }

    removeCoins(player, price);

    try {
        if (pageArr[globalIndex]) {
            var purchaseItem = player.world.createItemFromNbt(api.stringToNbt(pageArr[globalIndex]));
            var purchaseLore = purchaseItem.getLore();
            var cleanLore = [];
            for (var i = 0; i < purchaseLore.length; i++) {
                var pline = purchaseLore[i];
                if (pline.indexOf("Price:") === -1 && pline.indexOf("Source:") === -1 && pline.indexOf("Click to purchase") === -1) {
                    cleanLore.push(pline);
                }
            }
            while (cleanLore.length > 0 && cleanLore[cleanLore.length - 1] === "") { cleanLore.pop(); }
            purchaseItem.setLore(cleanLore);
            player.giveItem(purchaseItem);
            player.message("§aPurchased item for §e" + price + "¢!");
        }
    } catch(e) {
        player.message("§cError purchasing item: " + e);
    }
}

// ============================================================================
// GUI CLOSED HANDLER
// ============================================================================
function customGuiClosed(event) {
    // Nothing persists locally - listings live in market world data
    currentPage = 0;
    viewportRow = 0;
    totalRows = CONFIG_TAB_ROWS[0] || 6;
    tabSlots = [];
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

    gui.addLabel(1, "§6§lShop Rental", width / 2 - 50, 10, 160, 14);
    gui.addLabel(2, "§7Cost per day: §a" + formatPrice(costPerDay), 15, 35, 250, 10);
    gui.addLabel(3, "§7Your balance: §e" + formatPrice(playerBalance), 15, 55, 250, 10);
    gui.addLabel(8, "§aStatus: §fAvailable for rent", 15, 75, 250, 10);
    gui.addLabel(9, "§7Days (1-" + MAX_RENT_DAYS + "):", 15, 100, 100, 10);
    gui.addTextField(RENT_TF_DAYS, 110, 97, 50, 16).setText("1");
    gui.addLabel(5, "§7Total: §a" + formatPrice(costPerDay), 15, 125, 250, 10);
    gui.addButton(RENT_BTN_PAY, "§a§lRent Shop", width / 2 - 70, 150, 80, 20);
    gui.addButton(RENT_BTN_CANCEL, "§7Cancel", width / 2 + 10, 150, 60, 20);

    player.showCustomGui(gui);
    playerGuiRef[player.getUUID()] = gui;
    playerRentNpc[player.getUUID()] = lastNpc;
    gui.update();
}

// ============================================================================
// RENT PAYMENT HANDLER
// ============================================================================
function handleRentPayment(player, api, npcData, gui) {
    rentalInfo = loadRentalInfo(npcData);
    var daysField = gui.getComponent(RENT_TF_DAYS);
    if (!daysField) { player.message("§cError reading days field."); return; }

    var days = parseInt(daysField.getText().trim());
    if (isNaN(days) || days < 1 || days > MAX_RENT_DAYS) {
        player.message("§cInvalid days! Must be between 1 and " + MAX_RENT_DAYS + ".");
        return;
    }

    var costPerDay = rentalInfo.rentCostPerDay || RENT_COST_PER_DAY;
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
    var world = player.getWorld();
    var playerUUID = player.getUUID();

    if (rentalInfo.renterUUID === playerUUID && !isExpired(rentalInfo)) {
        // Same player extending
        rentalInfo.expiryDate = rentalInfo.expiryDate + (days * 24 * 60 * 60 * 1000);
        player.message("§aExtended your rent by " + days + " day(s)!");

        var pd = getPlayerData(world, playerUUID);
        if (pd.ownedShops) {
            var extPos = lastNpc.getPos();
            var extCoord = extPos.getX() + "," + extPos.getY() + "," + extPos.getZ();
            for (var i = 0; i < pd.ownedShops.length; i++) {
                if (pd.ownedShops[i].npcCoord === extCoord || pd.ownedShops[i].npcUUID === lastNpc.getUUID()) {
                    pd.ownedShops[i].expiryDate = rentalInfo.expiryDate;
                    break;
                }
            }
        }
        savePlayerData(world, playerUUID, pd);
    } else {
        // New rental (or takeover) - move previous owner's entry to their expired list
        var npcUUID = lastNpc.getUUID();
        if (rentalInfo.renterUUID && rentalInfo.renterUUID !== playerUUID) {
            moveOwnerToExpired(world, rentalInfo.renterUUID, npcUUID, nowTime);
        }
        // Clear any stale entries this player had for this NPC
        removeNpcFromPlayer(world, playerUUID, npcUUID);

        rentalInfo.renterName = player.getName();
        rentalInfo.renterUUID = playerUUID;
        rentalInfo.rentedDate = nowTime;
        rentalInfo.expiryDate = expiryTime;
        rentalInfo.totalEarnings = 0;
        player.message("§aYou have rented this shop for " + days + " day(s)! Cost: " + formatPrice(totalCost));
        player.message("§7List items at the Auctioneer to stock this shop.");

        if (lastNpc) {
            var pos = lastNpc.getPos();
            registerNpc(world, lastNpc.getUUID(), lastNpc.getName(), pos);
        }

        var pd = getPlayerData(world, playerUUID);
        pd.ownedShops.push({
            npcUUID: npcUUID,
            npcCoord: rentalInfo.npcCoord,
            rentedDate: nowTime,
            expiryDate: expiryTime
        });
        savePlayerData(world, playerUUID, pd);
    }

    saveRentalInfo(npcData, rentalInfo);
    skipCloseReload = true;
    player.closeGui();
}

var skipCloseReload = false;

// ============================================================================
// STOP RENTING
// ============================================================================
function handleStopRenting(player, npcData) {
    rentalInfo = loadRentalInfo(npcData);

    if (lastNpc) {
        var world = lastNpc.getWorld();
        var npcUUID = lastNpc.getUUID();
        var nowTime = now();
        var pd = getPlayerData(world, rentalInfo.renterUUID);
        if (pd.ownedShops) {
            for (var i = pd.ownedShops.length - 1; i >= 0; i--) {
                if (pd.ownedShops[i].npcUUID === npcUUID) {
                    var expired = pd.ownedShops.splice(i, 1)[0];
                    // 10-day retention clock starts when the player stops
                    expired.expiryDate = nowTime;
                    if (!pd.expiredShops) pd.expiredShops = [];
                    for (var j = pd.expiredShops.length - 1; j >= 0; j--) {
                        if (pd.expiredShops[j].npcUUID === npcUUID) pd.expiredShops.splice(j, 1);
                    }
                    pd.expiredShops.push(expired);
                    break;
                }
            }
        }
        savePlayerData(world, rentalInfo.renterUUID, pd);
    }

    rentalInfo.renterName = "";
    rentalInfo.renterUUID = "";
    rentalInfo.rentedDate = 0;
    rentalInfo.expiryDate = 0;
    rentalInfo.totalEarnings = 0;
    saveRentalInfo(npcData, rentalInfo);

    guiRef = null;
    storedSlotItems = [];
    slotListingIds = {};

    player.message("§cYou have stopped renting this shop. Your auction listings remain on the Auctioneer.");
    player.closeGui();
}

// ============================================================================
// ADMIN GUI & HANDLERS
// ============================================================================
function openAdminGui(player, api, npcData) {
    rentalInfo = loadRentalInfo(npcData);
    var width = 300;
    var height = 220;
    var gui = api.createCustomGui(GUI_ADMIN, width, height, false, player);

    gui.addLabel(1, "§c§lAdmin - Shop Management", width / 2 - 80, 10, 180, 14);
    gui.addLabel(2, "§7Current renter: §f" + (rentalInfo.renterName || "None"), 15, 50, 250, 10);
    gui.addLabel(3, "§7Expires: §f" + (rentalInfo.expiryDate > 0 ? new java.util.Date(rentalInfo.expiryDate).toString() : "N/A"), 15, 70, 250, 10);
    gui.addLabel(4, "§7Market: §f#" + MARKET_ID + " §7(payouts at Auctioneer)", 15, 90, 250, 10);
    gui.addButton(ADM_BTN_CLEAR, "§c§lClear Renter", 40, 130, 220, 20);
    gui.addButton(28, "§4§lDelete NPC from Registry", 40, 155, 220, 20);
    gui.addButton(ADM_BTN_CLOSE, "§7Close", width / 2 - 30, 185, 60, 20);

    player.showCustomGui(gui);
}

function handleAdminClear(player, api, npcData) {
    rentalInfo = loadRentalInfo(npcData);

    // Move current owner's world-data entry to their expired list (10-day clock from now)
    if (lastNpc && rentalInfo.renterUUID) {
        var world = lastNpc.getWorld();
        moveOwnerToExpired(world, rentalInfo.renterUUID, lastNpc.getUUID(), now());
    }

    rentalInfo.expiryDate = now() - 1;
    saveRentalInfo(npcData, rentalInfo);
    player.message("§aShop marked as available!");
    player.closeGui();
}

function handleAdminDeleteNpc(player, api, npcData) {
    if (!lastNpc) { player.closeGui(); return; }
    var world = lastNpc.getWorld();
    var npcUUID = lastNpc.getUUID();

    var wd = getWorldData(world);
    if (wd.playerShops) {
        for (var puuid in wd.playerShops) {
            if (wd.playerShops.hasOwnProperty(puuid)) {
                var pd = wd.playerShops[puuid];
                if (pd.ownedShops) {
                    for (var i = pd.ownedShops.length - 1; i >= 0; i--) {
                        if (pd.ownedShops[i].npcUUID === npcUUID) pd.ownedShops.splice(i, 1);
                    }
                }
                if (pd.expiredShops) {
                    for (var j = pd.expiredShops.length - 1; j >= 0; j--) {
                        if (pd.expiredShops[j].npcUUID === npcUUID) pd.expiredShops.splice(j, 1);
                    }
                }
            }
        }
    }

    if (wd.npcRegistry) {
        delete wd.npcRegistry[npcUUID];
    }

    saveWorldData(world, wd);
    atomicSave(npcData, "RentalInfo", emptyRentalInfo());

    player.message("§aNPC removed from rental registry!");
    player.closeGui();
}

// ============================================================================
// APPEARANCE GUI
// ============================================================================
function openAppearanceGui(player, api) {
    var width = 280;
    var height = 240;
    var gui = api.createCustomGui(GUI_APPEARANCE, width, height, false, player);

    gui.addLabel(1, "§d§lNPC Appearance", width / 2 - 50, 10, 140, 14);

    gui.addLabel(4, "§7Name:", 15, 35, 100, 10);
    var currentName = "";
    try { currentName = lastNpc.getDisplay().getName(); } catch(e) {}
    gui.addTextField(ID_APP_NAME_FIELD, 15, 48, 200, 16).setText(currentName);

    gui.addLabel(2, "§7Title:", 15, 70, 100, 10);
    var currentTitle = "";
    try { currentTitle = lastNpc.getDisplay().getTitle(); } catch(e) {}
    gui.addTextField(ID_APP_TITLE_FIELD, 15, 84, 200, 16).setText(currentTitle);

    gui.addLabel(3, "§7Skin URL:", 15, 110, 100, 10);
    gui.addTextField(ID_APP_SKIN_FIELD, 15, 124, 200, 16).setText("");

    gui.addButton(ID_APP_BTN_SAVE, "§a§lSave", width / 2 - 80, 170, 70, 20);
    gui.addButton(ID_APP_BTN_CANCEL, "§7Cancel", width / 2 + 10, 170, 70, 20);

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
                var world = lastNpc.getWorld();
                var wd = getWorldData(world);
                if (wd.npcRegistry && wd.npcRegistry[lastNpc.getUUID()]) {
                    wd.npcRegistry[lastNpc.getUUID()].displayName = name;
                    saveWorldData(world, wd);
                }
                player.message("§aNPC name updated!");
            } catch(e) {
                player.message("§cError setting name: " + e);
            }
        }
    }

    if (titleField) {
        var title = titleField.getText().trim();
        try {
            lastNpc.getDisplay().setTitle(title);
            player.message("§aNPC title updated!");
        } catch(e) {
            player.message("§cError setting title: " + e);
        }
    }

    if (skinField) {
        var skinUrl = skinField.getText().trim();
        if (skinUrl) {
            try {
                lastNpc.getDisplay().setSkinUrl(skinUrl);
                player.message("§aNPC skin updated!");
            } catch(e) {
                player.message("§cError setting skin: " + e);
            }
        }
    }

    player.closeGui();
    openShop(player, api, lastNpc.getStoreddata());
}

// ============================================================================
// INITIALIZATION
// ============================================================================
function init(e) {
}
