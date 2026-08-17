// ============================================================
//  VENDING MACHINE v2 — Market-Integrated
//  Buys from auction house first, falls back to static config
// ============================================================

// ============================================================
//  SHOP CONFIGURATION
// ============================================================

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
    // Tab 0 — Food (hardcoded items auto-added to allowed list)
    [
        { id: "minecraft:sweet_berries",  count: 1, price: 1,  lore: [] },
        { id: "minecraft:carrot",         count: 1, price: 2,  lore: [] },
        { id: "minecraft:apple",          count: 1, price: 2,  lore: [] },
        { id: "minecraft:baked_potato",   count: 1, price: 3,  lore: [] },
        { id: "minecraft:cooked_chicken", count: 1, price: 3,  lore: [] },
        { id: "minecraft:cooked_beef",    count: 1, price: 6,  lore: [] },
        { id: "minecraft:golden_carrot",  count: 1, price: 10, lore: [] },
        { id: "minecraft:golden_apple",   count: 1, price: 20, lore: [] },
    ],
    // Tab 1 — Potions
    [
        { id: "potion:strong_swiftness", count: 1, price: 5,   lore: [] },
        { id: "potion:strong_healing",   count: 1, price: 12,  lore: [] },
    ],
];

// ============================================================
//  MARKET INTEGRATION
// ============================================================

var MARKET_ID = 1;
var WORLD_DATA_PREFIX = "AUCTION_MARKET_DATA:";
var DAY_MS = 86400000;
var MAX_DAYS = 7;
var CUR_SYMBOL = "$";

// Allowed food item IDs — extra foods beyond hardcoded config
// Hardcoded items are auto-added; this list adds market-only slots
var ALLOWED_FOODS = [
    "minecraft:porkchop"
];

// ============================================================

var guiRef;
var mySlots = [];
var tabSlots = [];
var highlightLineIds = [];
var storedSlotItems = {};
var currentPage = 0;
var maxPages = CONFIG_MAX_PAGES;

// Viewport system
var viewportRow = 0;
var viewportRows = 6;
var totalRows = CONFIG_TAB_ROWS[0];
var numCols = 9;

// Currency conversion rates
var STONE_TO_COAL = 100;
var COAL_TO_EMERALD = 100;

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

// ============================================================
//  AUCTION HOUSE DATA ACCESS
// ============================================================

function getMarketDataKey(marketId) {
    return WORLD_DATA_PREFIX + marketId;
}

function loadMarketData(world) {
    var key = getMarketDataKey(MARKET_ID);
    var store = world.getStoreddata();
    var raw = store.get(key);
    if (raw === null || raw === undefined || raw === "") return { listings: [], payouts: {}, returns: {} };
    try {
        return JSON.parse("" + raw);
    } catch (e) {
        return { listings: [], payouts: {}, returns: {} };
    }
}

function getActiveListings(marketData) {
    if (!marketData || !marketData.listings) return [];
    var result = [];
    var nowMs = new Date().getTime();
    for (var i = 0; i < marketData.listings.length; i++) {
        var L = marketData.listings[i];
        if (L.status === "active") {
            var expires = L.createdAt + L.days * DAY_MS;
            if (nowMs < expires) {
                result.push(L);
            }
        }
    }
    return result;
}

function deserializeItem(nbtStr, world) {
    if (!nbtStr) return null;
    try {
        var api = Packages.noppes.npcs.api.NpcAPI.Instance();
        var nbt = api.stringToNbt(nbtStr);
        return world.createItemFromNbt(nbt);
    } catch (e) {
        return null;
    }
}

function getItemIdFromListing(listing, world) {
    var item = deserializeItem(listing.itemNbt, world);
    if (!item) return null;
    return item.getName();
}

// Get per-unit price from a listing (handles both old and new formats)
function getUnitPrice(listing) {
    if (listing.unitPrice) return listing.unitPrice;
    var qty = listing.originalQty || listing.remainingQty || 1;
    if (qty > 1) return Math.round(listing.price / qty);
    return listing.price;
}

// Find market listings for a specific item ID, buy qty=1 each click
// Returns array of matching listings sorted by per-unit price ascending
function getListingsForItem(marketData, itemId, world) {
    var active = getActiveListings(marketData);
    var matches = [];
    for (var i = 0; i < active.length; i++) {
        var L = active[i];
        var listingItemId = getItemIdFromListing(L, world);
        if (listingItemId === itemId) {
            var remainingQty = L.remainingQty || L.originalQty || 1;
            if (remainingQty >= 1) {
                matches.push(L);
            }
        }
    }
    matches.sort(function(a, b) { return getUnitPrice(a) - getUnitPrice(b); });
    return matches;
}

// Pick from 3 lowest priced listings randomly for balance
function pickRandomFromCheapest(listings) {
    if (listings.length === 0) return null;
    var poolSize = Math.min(3, listings.length);
    var idx = Math.floor(Math.random() * poolSize);
    return listings[idx];
}

// ============================================================
//  COIN HELPERS
// ============================================================

function countPlayerCoins(player) {
    var stoneTotal = 0;
    var coalTotal = 0;
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
    return true;
}

function giveCoins(player, amount) {
    var remaining = amount;
    var world = player.getWorld();
    if (remaining >= STONE_TO_COAL * COAL_TO_EMERALD) {
        var emCount = Math.floor(remaining / (STONE_TO_COAL * COAL_TO_EMERALD));
        while (emCount > 0) {
            var give = Math.min(emCount, 64);
            player.giveItem(world.createItem("coins:emerald_coin", give));
            emCount -= give;
        }
        remaining = remaining % (STONE_TO_COAL * COAL_TO_EMERALD);
    }
    if (remaining >= STONE_TO_COAL) {
        var coalCount = Math.floor(remaining / STONE_TO_COAL);
        while (coalCount > 0) {
            var give = Math.min(coalCount, 64);
            player.giveItem(world.createItem("coins:coal_coin", give));
            coalCount -= give;
        }
        remaining = remaining % STONE_TO_COAL;
    }
    if (remaining > 0) {
        while (remaining > 0) {
            var give = Math.min(remaining, 64);
            player.giveItem(world.createItem("coins:stone_coin", give));
            remaining -= give;
        }
    }
}

// ============================================================
//  MARKET PURCHASE — Buy 1 item from auction listing
// ============================================================

function doMarketPurchase(player, listing) {
    var world = player.getWorld();
    var marketData = loadMarketData(world);
    var api = Packages.noppes.npcs.api.NpcAPI.Instance();

    // Find the listing again in fresh data
    var freshListing = null;
    for (var i = 0; i < marketData.listings.length; i++) {
        if (marketData.listings[i].id === listing.id) {
            freshListing = marketData.listings[i];
            break;
        }
    }

    if (!freshListing || freshListing.status !== "active") {
        return { success: false, error: "Listing no longer available" };
    }

    var nowMs = new Date().getTime();
    if (nowMs >= freshListing.createdAt + freshListing.days * DAY_MS) {
        return { success: false, error: "Listing has expired" };
    }

    var remainingQty = freshListing.remainingQty || freshListing.originalQty || 1;
    if (remainingQty < 1) {
        return { success: false, error: "No items remaining" };
    }

    // Use per-unit price for qty=1 purchase
    var priceToPay = getUnitPrice(freshListing);

    if (countPlayerCoins(player) < priceToPay) {
        return { success: false, error: "Not enough coins. Need: " + formatPrice(priceToPay) };
    }

    if (!removeCoins(player, priceToPay)) {
        return { success: false, error: "Payment failed" };
    }

    // Update listing
    freshListing.remainingQty = remainingQty - 1;
    if (freshListing.remainingQty <= 0) {
        freshListing.status = "sold";
        freshListing.soldAt = nowMs;
        freshListing.buyerName = player.getName();
    }

    // Credit seller
    if (!marketData.payouts[freshListing.sellerUuid]) marketData.payouts[freshListing.sellerUuid] = 0;
    marketData.payouts[freshListing.sellerUuid] += priceToPay;

    // Save
    var key = getMarketDataKey(MARKET_ID);
    world.getStoreddata().put(key, JSON.stringify(marketData));

    // Give item
    var item = deserializeItem(freshListing.itemNbt, world);
    if (item) {
        item.setStackSize(1);
        player.giveItem(item);
    }

    player.updatePlayerInventory();
    return { success: true, price: priceToPay };
}

// ============================================================
//  MARKET-AVAILABLE FOOD DETECTION
// ============================================================

// Build a set of food item IDs that have active market listings
function getMarketFoodIds(world) {
    var marketData = loadMarketData(world);
    var active = getActiveListings(marketData);
    var foodIds = {};
    for (var i = 0; i < active.length; i++) {
        var itemId = getItemIdFromListing(active[i], world);
        if (itemId) {
            foodIds[itemId] = true;
        }
    }
    return foodIds;
}

// Get the best price for an item from the market (cheapest listing)
function getMarketBestPrice(marketData, itemId, world) {
    var listings = getListingsForItem(marketData, itemId, world);
    if (listings.length === 0) return null;
    return getUnitPrice(listings[0]);
}

// ============================================================
//  BUILD DYNAMIC SHOP DATA
// ============================================================

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

function createPotionItem(world, potionId) {
    var item = world.createItem("minecraft:splash_potion", 1);
    item.getNbt().putString("Potion", potionId);
    return item;
}

// Collect all allowed food IDs (hardcoded + allowed list)
function getAllAllowedFoodIds() {
    var ids = {};
    // Add hardcoded food items (tab 0)
    var foodItems = CONFIG_SHOP_ITEMS[0] || [];
    for (var i = 0; i < foodItems.length; i++) {
        ids[foodItems[i].id] = true;
    }
    // Add allowed foods
    for (var i = 0; i < ALLOWED_FOODS.length; i++) {
        ids[ALLOWED_FOODS[i]] = true;
    }
    return ids;
}

// Build shop data: static config first, then market-only foods
function buildShopDataFromConfig(player) {
    var world = player.getWorld();
    var api = Packages.noppes.npcs.api.NpcAPI.Instance();
    var shopData = {};

    // --- Tab 0: Food (static + market dynamic) ---
    var foodRows = CONFIG_TAB_ROWS[0] || 6;
    var totalFoodSlots = foodRows * numCols;
    var foodArr = makeNullArray(totalFoodSlots);
    var slotIdx = 0;

    var marketData = loadMarketData(world);
    var marketFoodIds = getMarketFoodIds(world);
    var allAllowed = getAllAllowedFoodIds();

    // First pass: hardcoded config items
    var staticFoods = CONFIG_SHOP_ITEMS[0] || [];
    for (var i = 0; i < staticFoods.length && slotIdx < totalFoodSlots; i++) {
        var cfg = staticFoods[i];
        if (!cfg) continue;

        // Check market for this item
        var marketPrice = getMarketBestPrice(marketData, cfg.id, world);

        try {
            var item = player.world.createItem(cfg.id, cfg.count || 1);
            // Use market price if available, otherwise config price
            var displayPrice = (marketPrice !== null) ? marketPrice : cfg.price;
            var source = (marketPrice !== null) ? "Market" : "Vending";

            var loreArr = cfg.lore ? cfg.lore.slice() : [];
            loreArr.push("");
            loreArr.push("§aPrice: §e" + displayPrice + "¢");
            loreArr.push("§7Source: " + source);
            item.setLore(loreArr);
            item.setCustomName(item.getDisplayName());
            foodArr[slotIdx] = item.getItemNbt().toJsonString();
            slotIdx++;
        } catch (e) {
            foodArr[slotIdx] = null;
            slotIdx++;
        }
    }

    // Second pass: market-only foods (allowed but not in static config)
    if (marketFoodIds && slotIdx < totalFoodSlots) {
        var marketIds = Object.keys(marketFoodIds);
        for (var i = 0; i < marketIds.length && slotIdx < totalFoodSlots; i++) {
            var foodId = marketIds[i];
            // Skip if already in static config
            if (staticFoods) {
                var alreadyStatic = false;
                for (var s = 0; s < staticFoods.length; s++) {
                    if (staticFoods[s] && staticFoods[s].id === foodId) {
                        alreadyStatic = true;
                        break;
                    }
                }
                if (alreadyStatic) continue;
            }

            // Get best market price
            var mPrice = getMarketBestPrice(marketData, foodId, world);
            if (mPrice === null) continue;

            try {
                var mItem = player.world.createItem(foodId, 1);
                var mLore = [];
                mLore.push("");
                mLore.push("§aPrice: §e" + mPrice + "¢");
                mLore.push("§7Source: Market");
                mItem.setLore(mLore);
                mItem.setCustomName(mItem.getDisplayName());
                foodArr[slotIdx] = mItem.getItemNbt().toJsonString();
                slotIdx++;
            } catch (e) {}
        }
    }

    shopData[0] = foodArr;

    // --- Tab 1: Potions (static, unchanged) ---
    var potionRows = CONFIG_TAB_ROWS[1] || 6;
    var totalPotionSlots = potionRows * numCols;
    var potionArr = makeNullArray(totalPotionSlots);
    var potions = CONFIG_SHOP_ITEMS[1] || [];
    for (var i = 0; i < potions.length && i < totalPotionSlots; i++) {
        var cfg = potions[i];
        if (!cfg) continue;
        try {
            var item;
            if (cfg.id.indexOf("potion:") === 0) {
                var potionId = cfg.id.substring(7);
                item = createPotionItem(player.world, potionId);
                var displayName = potionId.replace(/_/g, " ").replace(/\b\w/g, function(c) { return c.toUpperCase(); });
                item.setCustomName("§bSplash Potion of " + displayName);
            } else {
                item = player.world.createItem(cfg.id, cfg.count || 1);
            }
            var loreArr = cfg.lore ? cfg.lore.slice() : [];
            loreArr.push("");
            loreArr.push("§aPrice: §e" + (cfg.price || 0) + "¢");
            loreArr.push("§7Source: Vending");
            item.setLore(loreArr);
            potionArr[i] = item.getItemNbt().toJsonString();
        } catch (e) {
            potionArr[i] = null;
        }
    }
    shopData[1] = potionArr;

    return shopData;
}

// ============================================================
//  BLOCK INIT
// ============================================================

function init(event) {
    event.block.setModel("minecraft:barrier");
}

// ============================================================
//  INTERACT / OPEN GUI
// ============================================================

function interact(event) {
    var player = event.player;
    var api = event.API;

    maxPages = CONFIG_MAX_PAGES;
    totalRows = CONFIG_TAB_ROWS[currentPage] || 5;

    storedSlotItems = buildShopDataFromConfig(player);

    var totalSlots = totalRows * numCols;
    if (!storedSlotItems[currentPage]) {
        storedSlotItems[currentPage] = makeNullArray(totalSlots);
    }

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
        guiRef.addButton(ID_SCROLL_UP,   "↑", scrollX, scrollY,      18, 18);
        guiRef.addButton(ID_SCROLL_DOWN, "↓", scrollX, scrollY + 20, 18, 18);
        guiRef.addLabel(10, "", scrollX + 1, scrollY + 42, 0.7, 0.7);

        // Tab icons
        for (var i = 0; i < tabSlots.length; i++) {
            try {
                var iconItem = player.world.createItem(CONFIG_TAB_ICONS[i] || "minecraft:barrier", 1);
                iconItem.setCustomName(CONFIG_TAB_NAMES[i] || ("Tab " + (i + 1)));
                tabSlots[i].setStack(iconItem);
            } catch(e) {}
        }

        player.showCustomGui(guiRef);
    } else {
        for (var i = 0; i < tabSlots.length; i++) {
            try {
                var iconItem = player.world.createItem(CONFIG_TAB_ICONS[i] || "minecraft:barrier", 1);
                iconItem.setCustomName(CONFIG_TAB_NAMES[i] || ("Tab " + (i + 1)));
                tabSlots[i].setStack(iconItem);
            } catch(e) {}
        }
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
        var tabSpacing = 2;
        var tabStartX = 0;
        var tabY = -80;
        var highlightTabX = tabStartX + currentPage * (tabWidth + tabSpacing);
        guiRef.addColoredLine(20, highlightTabX - 1, tabY - 1, highlightTabX + tabWidth + 1, tabY - 1, 0xFFFF00, 2);
        guiRef.addColoredLine(21, highlightTabX - 1, tabY + tabHeight + 1, highlightTabX + tabWidth + 1, tabY + tabHeight + 1, 0xFFFF00, 2);
        guiRef.addColoredLine(22, highlightTabX - 1, tabY - 1, highlightTabX - 1, tabY + tabHeight + 1, 0xFFFF00, 2);
        guiRef.addColoredLine(23, highlightTabX + tabWidth + 1, tabY - 1, highlightTabX + tabWidth + 1, tabY + tabHeight + 1, 0xFFFF00, 2);
    } catch(e) {}

    updateVisibleSlots(player, api);
    updateScrollIndicator();
    if (guiRef) {
        guiRef.update();
    }
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
        if (globalIndex < storedSlotItems[currentPage].length && storedSlotItems[currentPage][globalIndex]) {
            try {
                var item = player.world.createItemFromNbt(api.stringToNbt(storedSlotItems[currentPage][globalIndex]));
                mySlots[i].setStack(item);
            } catch(e) {}
        }
    }
}

function refreshGui(player, api) {
    // Rebuild shop data with fresh market prices
    storedSlotItems = buildShopDataFromConfig(player);
    var totalSlots = totalRows * numCols;
    if (!storedSlotItems[currentPage]) {
        storedSlotItems[currentPage] = makeNullArray(totalSlots);
    }
    updateVisibleSlots(player, api);
    updateScrollIndicator();
    if (guiRef) guiRef.update();
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

    if (event.buttonId >= ID_TAB_BASE && event.buttonId < ID_TAB_BASE + maxPages) {
        var tabIndex = event.buttonId - ID_TAB_BASE;
        if (tabIndex !== currentPage) {
            currentPage = tabIndex;
            viewportRow = 0;
            totalRows = CONFIG_TAB_ROWS[currentPage] || 5;
            storedSlotItems = buildShopDataFromConfig(player);
            if (!storedSlotItems[currentPage]) {
                storedSlotItems[currentPage] = makeNullArray(totalRows * numCols);
            }
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
            updateVisibleSlots(player, api);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }
}

// ============================================================
//  PURCHASE HANDLER
// ============================================================

function customGuiSlotClicked(event) {
    var clickedSlot = event.slot;
    var player = event.player;
    var api = event.API;
    var world = player.world;
    var slotIndex = mySlots.indexOf(clickedSlot);

    if (slotIndex === -1) return;

    var globalIndex = viewportToGlobal(slotIndex);
    if (globalIndex >= storedSlotItems[currentPage].length) return;

    var item = mySlots[slotIndex].getStack();
    if (!item || item.isEmpty()) return;

    // Parse price from lore
    var price = null;
    var lore = item.getLore();
    for (var i = 0; i < lore.length; i++) {
        var line = lore[i];
        if (line.indexOf("Price:") !== -1 && line.indexOf("¢") !== -1) {
            var priceStr = line.replace(/§./g, "");
            var match = priceStr.match(/Price:\s*(\d+)¢/);
            if (match && match[1]) { price = parseInt(match[1]); break; }
        }
    }

    if (price === null || price === undefined) {
        player.message("§cThis item has no price set!");
        return;
    }

    // Check coins
    var playerCoins = countPlayerCoins(player);
    if (playerCoins < price) {
        player.message("§cNot enough coins! Need: §e" + price + "¢ §c, Have: §e" + playerCoins + "¢");
        return;
    }

    // Get the item ID from the slot
    var itemId = item.getName();
    var isPotion = false;
    var potionId = null;

    if (itemId === "minecraft:splash_potion") {
        isPotion = true;
        // Get potion type from NBT
        try {
            potionId = item.getNbt().getString("Potion");
        } catch(e) {}
    }

    // ---- MARKET PATH: Check auction house first (food tab only) ----
    var boughtFromMarket = false;
    if (currentPage === 0 && !isPotion) {
        var marketData = loadMarketData(world);
        var listings = getListingsForItem(marketData, itemId, world);

        if (listings.length > 0) {
            var listing = pickRandomFromCheapest(listings);
            if (listing) {
                var result = doMarketPurchase(player, listing);
                if (result.success) {
                    boughtFromMarket = true;
                    player.message("§aPurchased from market for §e" + result.price + "¢!");
                } else {
                    // Market purchase failed — fall through to static + show error
                    player.message("§cMarket error: " + result.error + " §7Falling back to vending stock.");
                }
            }
        }
    }

    // ---- STATIC PATH: Fall back to config item ----
    if (!boughtFromMarket) {
        // Re-check coins (market path may have consumed some)
        playerCoins = countPlayerCoins(player);
        if (playerCoins < price) {
            player.message("§cNot enough coins after market attempt! Need: §e" + price + "¢");
            return;
        }

        removeCoins(player, price);

        try {
            if (storedSlotItems[currentPage][globalIndex]) {
                var purchaseItem = player.world.createItemFromNbt(api.stringToNbt(storedSlotItems[currentPage][globalIndex]));
                // Clean lore before giving
                var purchaseLore = purchaseItem.getLore();
                var cleanLore = [];
                for (var i = 0; i < purchaseLore.length; i++) {
                    var line = purchaseLore[i];
                    if (line.indexOf("Price:") === -1 && line.indexOf("Source:") === -1 && line.indexOf("Click to purchase") === -1) {
                        cleanLore.push(line);
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

    // Refresh GUI with updated market prices after purchase
    refreshGui(player, api);
}

function customGuiClosed(event) {
    guiRef = null;
    viewportRow = 0;
    currentPage = 0;
}

// ============================================================
//  PRICE FORMATTING
// ============================================================

function formatPrice(amount) {
    if (amount >= STONE_TO_COAL * COAL_TO_EMERALD) {
        var dollars = Math.floor(amount / (STONE_TO_COAL * COAL_TO_EMERALD));
        var cents = amount % (STONE_TO_COAL * COAL_TO_EMERALD);
        var centStr = Math.floor(cents / STONE_TO_COAL);
        return dollars + "$" + (centStr > 0 ? centStr + "¢" : "");
    }
    return amount + "¢";
}
