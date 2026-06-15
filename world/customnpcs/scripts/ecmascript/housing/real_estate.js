// ============================================================================
// NPC AUCTIONEER — Apartment Hosting & Request System
// ============================================================================
// Script Type: NpcEvent (place on NPC > Advanced > Scripts)
// Style: ES5 | No Semicolons | CNPC 1.20.1
// ============================================================================
//
// INSTALLATION:
//   1. Place or select a Custom NPC in your world
//   2. Open: NPC Settings > Advanced > Scripting
//   3. Set language to "ECMAScript"
//   4. Paste this entire script, save, close
//
// PLAYER USAGE:
//   Right-click the NPC to open the Apartment Board
//   - Browse Apartments: view active host listings and request an apartment
//   - Host Apartment: hold the key item in your main hand, set price
//   - My Listings: view your own host listings and manage incoming requests
//   - My Requests: view your pending/accepted/rejected requests
//   - Claim Earnings: collect coin payouts and claimed key items
//
// REQUEST FLOW:
//   1. Host creates a listing (holds key item, sets price)
//   2. Player browses listings and places a request (deposits full price)
//   3. Host sees pending requests and can Accept or Reject
//   4. If Accepted: key item goes to requester's claims, money to host's payouts
//   5. If Rejected: money returned to requester's payouts
//   6. Player can also Cancel their own pending request (money back)
//
// ADMIN ACCESS (default):
//   Creative mode + Sneaking + Hold Bedrock + Right-click NPC
//
// COIN CURRENCY:
//   stone_coin = 1¢, coal_coin = 100¢, emerald_coin = 10000¢
//   Auto-converts higher denominations when paying/receiving
//
// DATA: Stored in the NPC's storeddata with key "APARTMENT_DATA"
// - Each NPC has its own independent listings, requests, payouts, and returns
//
// ============================================================================

// ============================================================================
// JAVA TYPES
// ============================================================================
var SYS = Java.type("java.lang.System")
var NpcAPI_Class = Java.type("noppes.npcs.api.NpcAPI")

// ============================================================================
// CONFIGURATION — Adjust these values to tune the system
// ============================================================================
var MAX_DAYS = 0     // Max listing duration in days (0 = no limit / no expiry)
var MIN_PRICE = 1     // Minimum listing price in cents (0.01$ = 1¢)
var MAX_PRICE = 10000000  // Maximum listing price in cents (100000.00$)
var MAX_LISTINGS = 10 // Max concurrent active listings per player
var FEE_RATE = 0.00   // Listing fee rate as decimal (0.00 = free, 0.01 = 1%, 0.10 = 10%)
var DESK_FEE = 0      // Flat desk fee in cents charged per listing (0 = free, 100 = 1$)
var ADMIN_ITEM = "minecraft:bedrock"
var DAY_MS = 86400000
var CUR_SYMBOL = "$"
var DATA_KEY = "APARTMENT_DATA"
// Coin conversion: stone_coin = 1¢, coal_coin = 100¢ = $1, emerald_coin = 10000¢ = $100
var STONE_TO_COAL = 100
var COAL_TO_EMERALD = 100
var COIN_STONE = "coins:stone_coin"
var COIN_COAL = "coins:coal_coin"
var COIN_EMERALD = "coins:emerald_coin"
// Price input: "4.03" means $4.03 = 403¢ = 4 coal + 3 stone
// All internal amounts are stored in cents (¢)

// ============================================================================
// GUI IDS
// ============================================================================
var GUIS = {
    MAIN: 7000,
    HOST: 7001,
    BROWSER: 7002,
    DETAIL: 7003,
    CLAIM: 7004,
    ADMIN: 7005,
    CONFIRM: 7006,
    MY_LIST: 7007,
    REQ_MGR: 7008,
    MY_REQS: 7009
}

// ============================================================================
// COMPONENT IDS (expanded for rich UI)
// ============================================================================
var C = {
    // Backgrounds & decorative layers (1-19)
    BG_OUTER: 1, BG_INNER: 2, BG_TITLE_BAR: 3,
    BG_CONTENT: 4, BG_FOOTER: 5, BG_ACCENT_TOP: 6,
    BG_ACCENT_BOT: 7, BG_PANEL_L: 8, BG_PANEL_R: 9,
    BG_DIVIDER: 10, BG_ITEM_FRAME: 11, BG_GLOW: 12,
    BG_SECTION1: 13, BG_SECTION2: 14, BG_CORNER: 15,
    BG_STRIPE1: 16, BG_STRIPE2: 17, BG_SHADOW: 18,
    // Labels (20-59)
    LBL_TITLE: 20, LBL_SUBTITLE: 21, LBL_INFO: 22,
    LBL_FEE: 23, LBL_PAYOUT: 24, LBL_STATS: 25,
    LBL_D1: 26, LBL_D2: 27, LBL_D3: 28, LBL_D4: 29,
    LBL_HINT: 30, LBL_PRICE: 31, LBL_DAYS: 32,
    LBL_RETURNS: 33, LBL_FOOTER: 34, LBL_BALANCE: 35,
    LBL_ICON1: 36, LBL_ICON2: 37, LBL_ICON3: 38,
    LBL_ICON4: 39, LBL_D5: 40, LBL_D6: 41,
    LBL_SEC_TITLE: 42, LBL_SEC_TITLE2: 43,
    // Preview panel labels (44-55)
    LBL_PV_NAME: 44, LBL_PV_PRICE: 45, LBL_PV_SELLER: 46,
    LBL_PV_TIME: 47, LBL_PV_HINT: 48, LBL_PV_QTY: 49,
    LBL_MARKET_ID: 50,
    LBL_REQ_COUNT: 51, LBL_REQ_STATUS: 52, LBL_REQ_REQUESTER: 53,
    LBL_REQ_AMOUNT: 54, LBL_REQ_TIME: 55,
    BG_PREVIEW: 19,
    // Text fields (60-69)
    TF_PRICE: 60, TF_DAYS: 61, TF_MARKET_ID: 62,
    // Scrolls (80-89)
    SCROLL: 80,
    // Buttons (100-139)
    BTN_BROWSE: 100, BTN_HOST: 101, BTN_CLAIM: 102,
    BTN_ADMIN: 103, BTN_CLOSE: 104, BTN_BACK: 105,
    BTN_LIST: 106, BTN_REQUEST: 107, BTN_VIEW: 108,
    BTN_CLAIM_EM: 109, BTN_CLAIM_ITEMS: 110,
    BTN_ADM_REMOVE: 111, BTN_ADM_REFUND: 112,
    BTN_YES: 113, BTN_NO: 114,
    BTN_MY_LIST: 115, BTN_CANCEL_LST: 116,
    BTN_REFRESH: 117, BTN_SORT: 118,
    BTN_SET_MARKET: 119,
    BTN_MY_REQS: 120, BTN_VIEW_REQS: 121,
    BTN_ACCEPT: 122, BTN_REJECT: 123,
    BTN_CANCEL_REQ: 124,
    // Item display (150-159)
    ITEM_PREVIEW: 150, ITEM_PREVIEW2: 151
}

// ============================================================================
// THEME — Texture palette for the auction house UI
// ============================================================================
var TEX = {
    OUTER:     "minecraft:textures/block/deepslate_tiles.png",
    INNER:     "minecraft:textures/block/gray_concrete.png",
    TITLE_BAR: "minecraft:textures/block/dark_oak_planks.png",
    CONTENT:   "minecraft:textures/block/black_concrete.png",
    PANEL:     "minecraft:textures/block/gray_concrete_powder.png",
    SECTION:   "minecraft:textures/block/smooth_stone.png",
    GOLD:      "minecraft:textures/block/gold_block.png",
    ACCENT:    "minecraft:textures/block/stripped_dark_oak_log.png",
    DIVIDER:   "minecraft:textures/block/dark_oak_log.png",
    FOOTER:    "minecraft:textures/block/dark_oak_planks.png",
    FRAME:     "minecraft:textures/block/deepslate_tile_slab.png",
    ADMIN_BAR: "minecraft:textures/block/red_nether_bricks.png",
    WARN:      "minecraft:textures/block/orange_terracotta.png"
}

var SKIN = {
    MAIN: {
        outer: "minecraft:textures/block/dark_oak_log.png",
        inner: "minecraft:textures/block/stripped_dark_oak_log.png",
        titleBar: "minecraft:textures/block/dark_oak_planks.png",
        content: "minecraft:textures/block/spruce_planks.png",
        footer: "minecraft:textures/block/dark_oak_planks.png",
        accent: "minecraft:textures/block/gold_block.png",
        trim: "minecraft:textures/block/stripped_spruce_log.png",
        sectionA: "minecraft:textures/block/stripped_spruce_log.png",
        sectionB: "minecraft:textures/block/stripped_dark_oak_log.png"
    },
    HOST: {
        outer: "minecraft:textures/block/oak_log.png",
        inner: "minecraft:textures/block/stripped_oak_log.png",
        titleBar: "minecraft:textures/block/oak_planks.png",
        content: "minecraft:textures/block/spruce_planks.png",
        footer: "minecraft:textures/block/oak_planks.png",
        accent: "minecraft:textures/block/hay_block_top.png",
        trim: "minecraft:textures/block/stripped_oak_log.png",
        sectionA: "minecraft:textures/block/stripped_oak_log.png",
        sectionB: "minecraft:textures/block/stripped_spruce_log.png"
    },
    BROWSER: {
        outer: "minecraft:textures/block/spruce_log.png",
        inner: "minecraft:textures/block/stripped_spruce_log.png",
        titleBar: "minecraft:textures/block/spruce_planks.png",
        content: "minecraft:textures/block/dark_oak_planks.png",
        footer: "minecraft:textures/block/spruce_planks.png",
        accent: "minecraft:textures/block/hay_block_top.png",
        trim: "minecraft:textures/block/stripped_spruce_log.png",
        sectionA: "minecraft:textures/block/stripped_spruce_log.png",
        preview: "minecraft:textures/block/stripped_dark_oak_log.png"
    },
    DETAIL: {
        outer: "minecraft:textures/block/acacia_log.png",
        inner: "minecraft:textures/block/stripped_acacia_log.png",
        titleBar: "minecraft:textures/block/acacia_planks.png",
        content: "minecraft:textures/block/jungle_planks.png",
        footer: "minecraft:textures/block/acacia_planks.png",
        accent: "minecraft:textures/block/hay_block_top.png",
        trim: "minecraft:textures/block/stripped_acacia_log.png",
        sectionA: "minecraft:textures/block/stripped_acacia_log.png",
        sectionB: "minecraft:textures/block/stripped_jungle_log.png"
    },
    MY_LIST: {
        outer: "minecraft:textures/block/birch_log.png",
        inner: "minecraft:textures/block/stripped_birch_log.png",
        titleBar: "minecraft:textures/block/birch_planks.png",
        content: "minecraft:textures/block/jungle_planks.png",
        footer: "minecraft:textures/block/birch_planks.png",
        accent: "minecraft:textures/block/hay_block_top.png",
        trim: "minecraft:textures/block/stripped_birch_log.png",
        sectionA: "minecraft:textures/block/stripped_birch_log.png",
        preview: "minecraft:textures/block/stripped_jungle_log.png"
    },
    CLAIM: {
        outer: "minecraft:textures/block/oak_log.png",
        inner: "minecraft:textures/block/stripped_oak_log.png",
        titleBar: "minecraft:textures/block/birch_planks.png",
        content: "minecraft:textures/block/oak_planks.png",
        footer: "minecraft:textures/block/birch_planks.png",
        accent: "minecraft:textures/block/gold_block.png",
        trim: "minecraft:textures/block/birch_log.png",
        sectionA: "minecraft:textures/block/stripped_oak_log.png",
        sectionB: "minecraft:textures/block/stripped_birch_log.png"
    },
    ADMIN: {
        outer: "minecraft:textures/block/dark_oak_log.png",
        inner: "minecraft:textures/block/stripped_dark_oak_log.png",
        titleBar: "minecraft:textures/block/spruce_planks.png",
        content: "minecraft:textures/block/dark_oak_planks.png",
        footer: "minecraft:textures/block/spruce_planks.png",
        accent: "minecraft:textures/block/redstone_block.png",
        trim: "minecraft:textures/block/stripped_dark_oak_log.png",
        preview: "minecraft:textures/block/stripped_spruce_log.png"
    },
    CONFIRM: {
        outer: "minecraft:textures/block/dark_oak_log.png",
        inner: "minecraft:textures/block/stripped_dark_oak_log.png",
        titleBar: "minecraft:textures/block/acacia_planks.png",
        content: "minecraft:textures/block/dark_oak_planks.png",
        footer: "minecraft:textures/block/dark_oak_planks.png",
        accent: "minecraft:textures/block/gold_block.png",
        trim: "minecraft:textures/block/stripped_acacia_log.png"
    },
    REQ_MGR: {
        outer: "minecraft:textures/block/jungle_log.png",
        inner: "minecraft:textures/block/stripped_jungle_log.png",
        titleBar: "minecraft:textures/block/jungle_planks.png",
        content: "minecraft:textures/block/dark_oak_planks.png",
        footer: "minecraft:textures/block/jungle_planks.png",
        accent: "minecraft:textures/block/gold_block.png",
        trim: "minecraft:textures/block/stripped_dark_oak_log.png",
        sectionA: "minecraft:textures/block/stripped_jungle_log.png",
        preview: "minecraft:textures/block/stripped_dark_oak_log.png"
    },
    MY_REQS: {
        outer: "minecraft:textures/block/acacia_log.png",
        inner: "minecraft:textures/block/stripped_acacia_log.png",
        titleBar: "minecraft:textures/block/acacia_planks.png",
        content: "minecraft:textures/block/spruce_planks.png",
        footer: "minecraft:textures/block/acacia_planks.png",
        accent: "minecraft:textures/block/emerald_block.png",
        trim: "minecraft:textures/block/stripped_acacia_log.png",
        sectionA: "minecraft:textures/block/stripped_acacia_log.png",
        preview: "minecraft:textures/block/stripped_spruce_log.png"
    }
}

// ============================================================================
// RUNTIME STATE (session-only, not persisted)
// ============================================================================
var npcUuid = null
var playerBrowseIdx = {}
var playerBrowseIds = {}
var playerAdminIdx = {}
var playerAdminIds = {}
var playerDetailId = {}
var playerConfirmAction = {}
var playerMyIdx = {}
var playerMyIds = {}
var playerSortMode = {}
var playerReqMgrIdx = {}
var playerReqMgrIds = {}
var playerReqMgrListingId = {}
var playerMyReqsIdx = {}
var playerMyReqsIds = {}

// ============================================================================
// SORT MODES
// ============================================================================
var SORT_MODES = [
    { key: "price_asc",  label: "▲ Price Low" },
    { key: "price_desc", label: "▼ Price High" },
    { key: "time_asc",   label: "▲ Ending Soon" },
    { key: "time_desc",  label: "▼ Newest" },
    { key: "name_asc",   label: "▲ Name A-Z" },
    { key: "name_desc",  label: "▼ Name Z-A" }
]

function getSortMode(playerName) {
    return playerSortMode[playerName] || 0
}

function nextSortMode(playerName) {
    var cur = getSortMode(playerName)
    playerSortMode[playerName] = (cur + 1) % SORT_MODES.length
    return playerSortMode[playerName]
}

function getSortLabel(playerName) {
    return SORT_MODES[getSortMode(playerName)].label
}

function sortListings(listings, sortIdx, world) {
    var mode = SORT_MODES[sortIdx].key
    var sorted = listings.slice()
    sorted.sort(function(a, b) {
        if (mode === "price_asc") return a.price - b.price
        if (mode === "price_desc") return b.price - a.price
        if (mode === "time_asc") {
            var remA = (a.createdAt + a.days * DAY_MS) - now()
            var remB = (b.createdAt + b.days * DAY_MS) - now()
            return remA - remB
        }
        if (mode === "time_desc") return b.createdAt - a.createdAt
        if (mode === "name_asc" || mode === "name_desc") {
            var nA = getItemLabel(a.itemNbt, world).toLowerCase()
            var nB = getItemLabel(b.itemNbt, world).toLowerCase()
            var cmp = nA < nB ? -1 : nA > nB ? 1 : 0
            return mode === "name_asc" ? cmp : -cmp
        }
        return 0
    })
    return sorted
}

// ============================================================================
// NPC REFERENCE HELPER
// ============================================================================
function getNpc(world) {
    if (!npcUuid) return null
    return world.getEntity(npcUuid)
}

// ============================================================================
// DATA MANAGEMENT — Uses NPC's storeddata (independent per NPC)
// ============================================================================
function emptyData() {
    return { listings: [], requests: [], payouts: {}, returns: {} }
}

function sanitizeData(d) {
    if (!d) return emptyData()
    if (!d.listings) d.listings = []
    if (!d.requests) d.requests = []
    if (!d.payouts) d.payouts = {}
    if (!d.returns) d.returns = {}
    return d
}

function parseDataJson(json) {
    if (!json) return null
    try {
        return sanitizeData(JSON.parse(json))
    } catch (e) {
        return null
    }
}

function loadData(npc) {
    if (!npc) return emptyData()
    var store = npc.getStoreddata()
    var raw = store.get(DATA_KEY)
    if (!raw) return emptyData()
    return parseDataJson("" + raw)
}

function saveData(npc, data) {
    if (!npc) return
    var store = npc.getStoreddata()
    store.put(DATA_KEY, JSON.stringify(sanitizeData(data)))
}

// ============================================================================
// ITEM SERIALIZATION
// ============================================================================
function serializeItem(itemStack) {
    if (!itemStack || itemStack.isEmpty()) return null
    try {
        return itemStack.getItemNbt().toJsonString()
    } catch (e) {
        return null
    }
}

function deserializeItem(nbtStr, world) {
    if (!nbtStr) return null
    try {
        var api = NpcAPI_Class.Instance()
        var nbt = api.stringToNbt(nbtStr)
        return world.createItemFromNbt(nbt)
    } catch (e) {
        return null
    }
}

function getItemLabel(nbtStr, world) {
    var item = deserializeItem(nbtStr, world)
    if (!item) return "§c[Invalid Item]"
    var name = item.getDisplayName()
    var count = item.getStackSize()
    if (count > 1) return name + " x" + count
    return "" + name
}

function addItemDisplay(gui, compId, x, y, item) {
    if (!item) return
    try {
        gui.addItemRenderer(compId, x, y, 18, 18, item)
    } catch(ex) {
        var fallbackId = compId + 1000
        gui.addLabel(fallbackId, "§e▣", x + 2, y + 2, 16, 16)
    }
}

// ============================================================================
// COIN CURRENCY HELPERS
// ============================================================================
// stone_coin = 1¢, coal_coin = 100¢, emerald_coin = 10000¢
// ============================================================================

function countPlayerCoins(player) {
    var total = 0
    var inv = player.getInventory()
    for (var i = 0; i < inv.getSize(); i++) {
        var stack = inv.getSlot(i)
        if (stack && !stack.isEmpty()) {
            var name = stack.getName()
            if      (name === COIN_STONE)   total += stack.getStackSize()
            else if (name === COIN_COAL)    total += stack.getStackSize() * STONE_TO_COAL
            else if (name === COIN_EMERALD) total += stack.getStackSize() * STONE_TO_COAL * COAL_TO_EMERALD
        }
    }
    return total
}

function removeCoins(player, amount) {
    var remaining = amount
    var inv = player.getInventory()
    var world = player.getWorld()

    // Remove stone coins first
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i)
        if (stack && !stack.isEmpty() && stack.getName() === COIN_STONE) {
            var stackAmount = stack.getStackSize()
            if (stackAmount <= remaining) {
                inv.setSlot(i, null)
                remaining -= stackAmount
            } else {
                stack.setStackSize(stackAmount - remaining)
                remaining = 0
            }
        }
    }

    // Remove coal coins
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i)
        if (stack && !stack.isEmpty() && stack.getName() === COIN_COAL) {
            var stackAmount = stack.getStackSize()
            var stoneValue = stackAmount * STONE_TO_COAL
            if (stoneValue <= remaining) {
                inv.setSlot(i, null)
                remaining -= stoneValue
            } else {
                var coalsNeeded = Math.ceil(remaining / STONE_TO_COAL)
                stack.setStackSize(stackAmount - coalsNeeded)
                var overpaid = (coalsNeeded * STONE_TO_COAL) - remaining
                remaining = 0
                if (overpaid > 0) {
                    player.giveItem(world.createItem(COIN_STONE, overpaid))
                }
            }
        }
    }

    // Remove emerald coins
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i)
        if (stack && !stack.isEmpty() && stack.getName() === COIN_EMERALD) {
            var stackAmount = stack.getStackSize()
            var stoneValue = stackAmount * STONE_TO_COAL * COAL_TO_EMERALD
            if (stoneValue <= remaining) {
                inv.setSlot(i, null)
                remaining -= stoneValue
            } else {
                var emeraldsNeeded = Math.ceil(remaining / (STONE_TO_COAL * COAL_TO_EMERALD))
                stack.setStackSize(stackAmount - emeraldsNeeded)
                var overpaid = (emeraldsNeeded * STONE_TO_COAL * COAL_TO_EMERALD) - remaining
                remaining = 0
                var changeCoal  = Math.floor(overpaid / STONE_TO_COAL)
                var changeStone = overpaid % STONE_TO_COAL
                if (changeCoal  > 0) player.giveItem(world.createItem(COIN_COAL, changeCoal))
                if (changeStone > 0) player.giveItem(world.createItem(COIN_STONE, changeStone))
            }
        }
    }

    player.updatePlayerInventory()
    return remaining <= 0
}

function giveCoins(player, amount) {
    var remaining = amount
    if (remaining <= 0) return true
    var world = player.getWorld()

    // Give emerald coins (10000¢ each)
    if (remaining >= STONE_TO_COAL * COAL_TO_EMERALD) {
        var emCount = Math.floor(remaining / (STONE_TO_COAL * COAL_TO_EMERALD))
        while (emCount > 0) {
            var give = Math.min(emCount, 64)
            var stack = world.createItem(COIN_EMERALD, give)
            if (!player.giveItem(stack)) player.dropItem(stack)
            emCount -= give
        }
        remaining = remaining % (STONE_TO_COAL * COAL_TO_EMERALD)
    }

    // Give coal coins (100¢ each)
    if (remaining >= STONE_TO_COAL) {
        var coalCount = Math.floor(remaining / STONE_TO_COAL)
        while (coalCount > 0) {
            var give = Math.min(coalCount, 64)
            var stack = world.createItem(COIN_COAL, give)
            if (!player.giveItem(stack)) player.dropItem(stack)
            coalCount -= give
        }
        remaining = remaining % STONE_TO_COAL
    }

    // Give stone coins (1¢ each)
    if (remaining > 0) {
        while (remaining > 0) {
            var give = Math.min(remaining, 64)
            var stack = world.createItem(COIN_STONE, give)
            if (!player.giveItem(stack)) player.dropItem(stack)
            remaining -= give
        }
    }

    player.updatePlayerInventory()
    return true
}

function formatPrice(amount) {
    // amount is in cents, display as dollars.cents
    var dollars = Math.floor(amount / 100)
    var cents = amount % 100
    if (cents < 10) return "§e" + dollars + ".0" + cents + CUR_SYMBOL
    return "§e" + dollars + "." + cents + CUR_SYMBOL
}

function parsePriceInput(str) {
    // Input like "4.03" -> 403¢, "1.5" -> 150¢, "0.99" -> 99¢
    var num = parseFloat(str)
    if (isNaN(num) || num < 0) return NaN
    return Math.round(num * 100)
}

// ============================================================================
// UTILITY HELPERS
// ============================================================================
function now() {
    return SYS.currentTimeMillis()
}

function generateId() {
    return "" + now() + "-" + Math.floor(Math.random() * 99999999)
}

function calcFee(price, days) {
    var pctFee = Math.floor(price * days * FEE_RATE)
    return pctFee + DESK_FEE
}

function isExpired(listing) {
    if (MAX_DAYS <= 0) return false  // No expiry when MAX_DAYS is 0
    return now() > (listing.createdAt + listing.days * DAY_MS)
}

function timeLeftStr(listing) {
    if (MAX_DAYS <= 0) return "§7\u221E"  // Infinity symbol when no expiry
    var rem = (listing.createdAt + listing.days * DAY_MS) - now()
    if (rem <= 0) return "EXPIRED"
    var hrs = Math.floor(rem / 3600000)
    var d = Math.floor(hrs / 24)
    var h = hrs % 24
    if (d > 0) return d + "d " + h + "h"
    if (h > 0) return h + "h"
    return Math.floor(rem / 60000) + "m"
}

function isAdmin(player) {
    if (player.getGamemode() !== 1) return false
    if (!player.isSneaking()) return false
    var held = player.getMainhandItem()
    if (!held || held.isEmpty()) return false
    return held.getName() === ADMIN_ITEM
}

function findListing(data, id) {
    for (var i = 0; i < data.listings.length; i++) {
        if (data.listings[i].id === id) return data.listings[i]
    }
    return null
}

function findRequest(data, id) {
    for (var i = 0; i < data.requests.length; i++) {
        if (data.requests[i].id === id) return data.requests[i]
    }
    return null
}

function removeListing(data, id) {
    for (var i = 0; i < data.listings.length; i++) {
        if (data.listings[i].id === id) {
            data.listings.splice(i, 1)
            return true
        }
    }
    return false
}

function removeRequest(data, id) {
    for (var i = 0; i < data.requests.length; i++) {
        if (data.requests[i].id === id) {
            data.requests.splice(i, 1)
            return true
        }
    }
    return false
}

// ============================================================================
// REQUEST HELPERS
// ============================================================================

function getPendingRequestsForListing(data, listingId) {
    var result = []
    for (var i = 0; i < data.requests.length; i++) {
        if (data.requests[i].listingId === listingId && data.requests[i].status === "pending") {
            result.push(data.requests[i])
        }
    }
    return result
}

function getPendingRequestCountForListing(data, listingId) {
    return getPendingRequestsForListing(data, listingId).length
}

function getRequestsForHost(data, hostUuid) {
    var result = []
    for (var i = 0; i < data.requests.length; i++) {
        var req = data.requests[i]
        if (req.status !== "pending") continue
        var listing = findListing(data, req.listingId)
        if (listing && listing.sellerUuid === hostUuid) {
            result.push({ request: req, listing: listing })
        }
    }
    return result
}

function getPlayerRequests(data, playerUuid) {
    var result = []
    for (var i = 0; i < data.requests.length; i++) {
        if (data.requests[i].requesterUuid === playerUuid) {
            result.push(data.requests[i])
        }
    }
    return result
}

function getPlayerPendingRequestCount(data, playerUuid) {
    var count = 0
    for (var i = 0; i < data.requests.length; i++) {
        if (data.requests[i].requesterUuid === playerUuid && data.requests[i].status === "pending") {
            count++
        }
    }
    return count
}

function autoRejectOtherRequests(data, listingId, acceptedRequestId) {
    var count = 0
    for (var i = 0; i < data.requests.length; i++) {
        var req = data.requests[i]
        if (req.listingId === listingId && req.id !== acceptedRequestId && req.status === "pending") {
            req.status = "rejected"
            req.resolvedAt = now()
            // Return money to requester's payouts
            if (!data.payouts[req.requesterUuid]) data.payouts[req.requesterUuid] = 0
            data.payouts[req.requesterUuid] += req.amountDeposited
            count++
        }
    }
    return count
}

function cleanExpired(npc, world) {
    var data = loadData(npc)
    var changed = false

    // Calculate cutoff for pruning old data (only if MAX_DAYS > 0)
    var cutoff = MAX_DAYS > 0 ? now() - (MAX_DAYS * 2 * DAY_MS) : 0

    // Auto-reject pending requests for removed listings (always happens)
    for (var i = data.requests.length - 1; i >= 0; i--) {
        var req = data.requests[i]
        if (req.status !== "pending") continue
        var listing = findListing(data, req.listingId)
        if (!listing || listing.status !== "active") {
            if (!data.payouts[req.requesterUuid]) data.payouts[req.requesterUuid] = 0
            data.payouts[req.requesterUuid] += req.amountDeposited
            req.status = "rejected"
            req.resolvedAt = now()
            changed = true
        }
    }

    // Auto-reject pending requests for expired listings (only if MAX_DAYS > 0)
    if (MAX_DAYS > 0) {
        for (var i = data.requests.length - 1; i >= 0; i--) {
            var req = data.requests[i]
            if (req.status !== "pending") continue
            var listing = findListing(data, req.listingId)
            if (listing && isExpired(listing)) {
                if (!data.payouts[req.requesterUuid]) data.payouts[req.requesterUuid] = 0
                data.payouts[req.requesterUuid] += req.amountDeposited
                req.status = "rejected"
                req.resolvedAt = now()
                changed = true
            }
        }

        // Move expired listings to seller's returns
        for (var i = data.listings.length - 1; i >= 0; i--) {
            var L = data.listings[i]
            if (L.status !== "active" || !isExpired(L)) continue
            if (!data.returns[L.sellerUuid]) data.returns[L.sellerUuid] = []
            data.returns[L.sellerUuid].push(L.itemNbt)
            L.status = "expired"
            changed = true
        }
    }

    // Prune old resolved requests (only if we have a cutoff)
    if (cutoff > 0) {
        for (var i = data.requests.length - 1; i >= 0; i--) {
            var req = data.requests[i]
            if (req.status !== "pending" && req.resolvedAt && req.resolvedAt < cutoff) {
                data.requests.splice(i, 1)
                changed = true
            }
        }

        // Prune old sold listings older than 2x max duration
        for (var i = data.listings.length - 1; i >= 0; i--) {
            var L = data.listings[i]
            if (L.status === "sold" && L.soldAt && L.soldAt < cutoff) {
                data.listings.splice(i, 1)
                changed = true
            }
        }
    }

    if (changed) saveData(npc, data)
}

function getActiveListings(data) {
    var result = []
    for (var i = 0; i < data.listings.length; i++) {
        if (data.listings[i].status === "active" && !isExpired(data.listings[i])) {
            result.push(data.listings[i])
        }
    }
    return result
}

function getPlayerListings(data, uuid) {
    var result = []
    for (var i = 0; i < data.listings.length; i++) {
        var L = data.listings[i]
        if (L.sellerUuid === uuid && L.status === "active") {
            result.push(L)
        }
    }
    return result
}

function countPlayerListings(data, uuid) {
    var count = 0
    for (var i = 0; i < data.listings.length; i++) {
        if (data.listings[i].sellerUuid === uuid && data.listings[i].status === "active") count++
    }
    return count
}

// ============================================================================
// GUI LAYOUT SYSTEM — Layered frame builder
// ============================================================================
function normalizeFrameSkin(skinOrTitleBar) {
    if (!skinOrTitleBar) return {}
    if (typeof skinOrTitleBar === "string") return { titleBar: skinOrTitleBar }
    return skinOrTitleBar
}

function buildFrame(gui, w, h, titleText, titleBarTex) {
    var skin = normalizeFrameSkin(titleBarTex)
    var outerTex = skin.outer || TEX.OUTER
    var innerTex = skin.inner || TEX.INNER
    var accentTex = skin.accent || TEX.GOLD
    var bar = skin.titleBar || TEX.TITLE_BAR
    var contentTex = skin.content || TEX.CONTENT
    var footerTex = skin.footer || TEX.FOOTER

    gui.addTexturedRect(C.BG_OUTER, outerTex, 0, 0, w, h)
    gui.addTexturedRect(C.BG_INNER, innerTex, 4, 4, w - 8, h - 8)
    gui.addTexturedRect(C.BG_ACCENT_TOP, accentTex, 4, 4, w - 8, 2)
    gui.addTexturedRect(C.BG_TITLE_BAR, bar, 4, 6, w - 8, 22)
    gui.addTexturedRect(C.BG_ACCENT_BOT, accentTex, 4, 28, w - 8, 1)
    gui.addTexturedRect(C.BG_CONTENT, contentTex, 8, 33, w - 16, h - 72)
    gui.addTexturedRect(C.BG_FOOTER, footerTex, 4, h - 35, w - 8, 31)
    gui.addTexturedRect(C.BG_STRIPE1, accentTex, 4, h - 35, w - 8, 1)
    gui.addLabel(C.LBL_TITLE, titleText, 10, 10, w - 20, 16)
}

function buildSection(gui, id, x, y, w, h, texture) {
    gui.addTexturedRect(id, texture || TEX.SECTION, x, y, w, h)
}

function buildDivider(gui, id, x, y, w, texture) {
    gui.addTexturedRect(id, texture || TEX.DIVIDER, x, y, w, 1)
}

// ============================================================================
// MAIN MENU — Apartment Board lobby
// ============================================================================
function openMainMenu(event) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)

    var w = 300
    var h = 255
    var gui = api.createCustomGui(GUIS.MAIN, w, h, false, player)
    buildFrame(gui, w, h, "§6§l\u2726 Apartment Board \u2726", SKIN.MAIN)

    var bal = 0
    var listCount = 0
    var myCount = 0
    var reqCount = 0
    if (npc) {
        cleanExpired(npc, world)
        var data = loadData(npc)
        bal = countPlayerCoins(player)
        listCount = getActiveListings(data).length
        myCount = countPlayerListings(data, player.getUUID())
        reqCount = getPlayerPendingRequestCount(data, player.getUUID())
    }

    gui.addLabel(C.LBL_SUBTITLE, "§8Apartment rental board", 12, 34, w - 24, 10)

    // Left board: market info
    buildSection(gui, C.BG_SECTION1, 12, 44, 126, 160, SKIN.MAIN.sectionA || TEX.SECTION)
    gui.addLabel(C.LBL_SEC_TITLE, "§6§lMarket Board", 18, 50, 114, 10)
    buildDivider(gui, C.BG_DIVIDER, 18, 62, 114, SKIN.MAIN.trim)
    gui.addLabel(C.LBL_BALANCE, "§7Wallet Balance", 18, 70, 100, 10)
    gui.addLabel(C.LBL_D1, "§a§l" + formatPrice(bal), 18, 82, 114, 10)
    gui.addLabel(C.LBL_D2, "§7Available listings", 18, 102, 100, 10)
    gui.addLabel(C.LBL_D3, "§f" + listCount + " §8active", 18, 114, 110, 10)
    gui.addLabel(C.LBL_D4, "§7Your host listings", 18, 134, 100, 10)
    gui.addLabel(C.LBL_D5, "§f" + myCount + "§8/" + MAX_LISTINGS, 18, 146, 110, 10)
    gui.addLabel(C.LBL_D6, "§7Pending requests", 18, 162, 100, 10)
    gui.addLabel(C.LBL_ICON1, "§f" + reqCount, 18, 174, 110, 10)
    var feePct = Math.round(FEE_RATE * 100)
    var deskFeeStr = DESK_FEE > 0 ? " + " + formatPrice(DESK_FEE) + " desk" : ""
    gui.addLabel(C.LBL_ICON2, "§8Listing fee: " + feePct + "% per day" + deskFeeStr, 18, 190, 114, 10)

    // Right board: service counter
    buildSection(gui, C.BG_SECTION2, 146, 44, 142, 160, SKIN.MAIN.sectionB || TEX.PANEL)
    gui.addLabel(C.LBL_SEC_TITLE2, "§e§lService Counter", 152, 50, 130, 10)
    buildDivider(gui, C.BG_STRIPE2, 152, 62, 130, SKIN.MAIN.trim)

    gui.addButton(C.BTN_BROWSE, "§f\u25B6 Browse Apartments", 156, 70, 122, 18)
    gui.addButton(C.BTN_HOST, "§f\u25B2 Host Apartment", 156, 94, 122, 18)
    gui.addButton(C.BTN_MY_LIST, "§f\u25A0 My Listings", 156, 118, 122, 18)
    gui.addButton(C.BTN_MY_REQS, "§f\u25C7 My Requests", 156, 142, 122, 18)
    gui.addButton(C.BTN_CLAIM, "§f\u25C6 Visit Cashier / Claim key", 156, 166, 122, 18)

    if (isAdmin(player)) {
        gui.addButton(C.BTN_ADMIN, "§c\u2620 Admin Office", 156, 190, 122, 18)
    } else {
        gui.addLabel(C.LBL_INFO, "§8Admin office is restricted", 156, 196, 122, 10)
    }

    gui.addLabel(C.LBL_FOOTER, "§1Coin: stone(1¢) coal(1$) emerald(100$)", 10, h - 26, w - 20, 10)
    gui.addButton(C.BTN_CLOSE, "§7Close", Math.floor((w - 68) / 2), h - 16, 68, 14)
    player.showCustomGui(gui)
}

// ============================================================================
// HOST GUI — Showcase panel with item frame + form fields
// ============================================================================
function openHostGui(event) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)
    var w = 360
    var h = 238
    var gui = api.createCustomGui(GUIS.HOST, w, h, false, player)
    buildFrame(gui, w, h, "§6§l\u25B2 Host an Apartment", SKIN.HOST)

    var held = player.getMainhandItem()
    var hasItem = held && !held.isEmpty() && held.getName() !== "minecraft:air"

    gui.addLabel(C.LBL_SUBTITLE, "§8Set rental price, then list your apartment key", 12, 34, w - 24, 10)

    // --- Left panel: Key showcase counter ---
    buildSection(gui, C.BG_SECTION1, 12, 44, 132, 150, SKIN.HOST.sectionA)
    gui.addLabel(C.LBL_SEC_TITLE, "§6§lApartment Key", 18, 50, 120, 10)
    buildDivider(gui, C.BG_DIVIDER, 18, 62, 120, SKIN.HOST.trim)

    if (hasItem) {
        gui.addTexturedRect(C.BG_ITEM_FRAME, TEX.FRAME, 56, 72, 44, 44)
        addItemDisplay(gui, C.ITEM_PREVIEW, 69, 85, held)
        var dName = held.getDisplayName()
        var cnt = held.getStackSize()
        gui.addLabel(C.LBL_HINT, "§f" + dName, 18, 124, 120, 10)
        if (cnt > 1) {
            gui.addLabel(C.LBL_ICON1, "§7Qty: §f" + cnt, 18, 136, 120, 10)
        }
        gui.addLabel(C.LBL_ICON2, "§a\u2714 Key ready", 18, 150, 120, 10)
    } else {
        gui.addLabel(C.LBL_HINT, "§c\u2716 No key in hand", 18, 92, 120, 10)
        gui.addLabel(C.LBL_ICON1, "§7Hold apartment key in main hand", 18, 108, 120, 10)
        gui.addLabel(C.LBL_ICON2, "§7then reopen desk", 18, 120, 120, 10)
    }

    // --- Right panel: Price form ---
    buildSection(gui, C.BG_SECTION2, 150, 44, w - 162, 150, SKIN.HOST.sectionB)

    gui.addLabel(C.LBL_SEC_TITLE2, "§e§lHost Desk", 158, 50, 170, 10)
    buildDivider(gui, C.BG_STRIPE2, 158, 62, w - 178, SKIN.HOST.trim)

    gui.addLabel(C.LBL_PRICE, "§fRental Price §7(" + CUR_SYMBOL + ")", 158, 74, 132, 10)
    gui.addTextField(C.TF_PRICE, 158, 86, 168, 16).setText("1.00")

    var daysLabel = MAX_DAYS > 0 ? "(1-" + MAX_DAYS + " days)" : "(0 = no limit)"
    gui.addLabel(C.LBL_DAYS, "§fListing Duration §7" + daysLabel, 158, 108, 150, 10)
    gui.addTextField(C.TF_DAYS, 158, 120, 62, 16).setText("0")

    var feePct = Math.round(FEE_RATE * 100)
    var deskFeeStr = DESK_FEE > 0 ? " + " + formatPrice(DESK_FEE) + " desk" : ""
    gui.addLabel(C.LBL_FEE, "§7Desk fee: " + formatPrice(DESK_FEE) + " + " + feePct + "%", 158, 144, 170, 10)
    gui.addLabel(C.LBL_ICON3, "§8Fee = " + feePct + "% × price × days" + deskFeeStr, 158, 156, 170, 10)

    var bal = countPlayerCoins(player)
    gui.addLabel(C.LBL_BALANCE, "§7Wallet: §a" + formatPrice(bal), 12, 200, 200, 10)

    gui.addButton(C.BTN_LIST, "§a§l\u2714 List Apartment", 12, h - 30, 150, 18)
    gui.addButton(C.BTN_BACK, "§7\u25C0 Back", w - 82, h - 30, 70, 18)
    player.showCustomGui(gui)
}

// ============================================================================
// PREVIEW PANEL BUILDER — Adds item preview to a fresh GUI (no mutation)
// ============================================================================
function addPreviewToGui(gui, pvX, pvW, listing, world, showSeller) {
    // Item renderer (hoverable for tooltip)
    var item = deserializeItem(listing.itemNbt, world)
    if (item) {
        var frameX = pvX + Math.floor((pvW - 28) / 2)
        gui.addTexturedRect(C.BG_ITEM_FRAME, TEX.FRAME, frameX, 58, 28, 28)
        addItemDisplay(gui, C.ITEM_PREVIEW, frameX + 5, 63, item)
    }

    gui.addLabel(C.LBL_PV_NAME, "§f§l" + getItemLabel(listing.itemNbt, world), pvX + 4, 92, pvW - 8, 10)
    gui.addLabel(C.LBL_PV_PRICE, "§7Price: " + formatPrice(listing.price), pvX + 4, 106, pvW - 8, 10)

    if (showSeller) {
        gui.addLabel(C.LBL_PV_SELLER, "§7Host: §f" + listing.sellerName, pvX + 4, 118, pvW - 8, 10)
    }

    var tl = timeLeftStr(listing)
    var tlColor = tl === "EXPIRED" ? "§c" : "§b"
    gui.addLabel(C.LBL_PV_TIME, "§7Time: " + tlColor + tl, pvX + 4, showSeller ? 130 : 118, pvW - 8, 10)
}

// ============================================================================
// BROWSER GUI — Scroll + live item preview panel
// ============================================================================
function openBrowserGui(event, selectedIdx) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Apartment] NPC not found"); return }

    cleanExpired(npc, world)
    var data = loadData(npc)
    var active = getActiveListings(data)
    active = sortListings(active, getSortMode(player.getName()), world)

    var w = 470
    var h = 300
    var gui = api.createCustomGui(GUIS.BROWSER, w, h, false, player)

    // Title
    gui.addLabel(C.LBL_TITLE, "§6§l\u25B6 Browse Apartments", 10, 6, w - 20, 16)

    gui.addLabel(C.LBL_SUBTITLE, "§7Open listings: §f" + active.length + " §8| §7Wallet: §a" + formatPrice(countPlayerCoins(player)), 12, 30, w - 24, 10)

    // Apartment list (left side)
    var scrollW = 286
    var lines = []
    var ids = []
    for (var i = 0; i < active.length; i++) {
        var L = active[i]
        var itemName = getItemLabel(L.itemNbt, world)
        lines.push(formatPrice(L.price) + " §r§8|§r " + itemName + " §r§8|§r §b" + timeLeftStr(L))
        ids.push(L.id)
    }
    if (lines.length === 0) {
        lines.push("§7\u2014 No apartments listed \u2014")
    }

    var pn = player.getName()
    playerBrowseIds[pn] = ids
    if (selectedIdx === undefined || selectedIdx < 0) selectedIdx = -1
    playerBrowseIdx[pn] = selectedIdx

    gui.addLabel(C.LBL_SEC_TITLE, "§6§lApartment Directory", 16, 44, scrollW - 12, 10)

    var scroll = gui.addScroll(C.SCROLL, 14, 56, scrollW - 8, h - 120, lines)
    if (selectedIdx >= 0 && selectedIdx < lines.length) {
        scroll.setDefaultSelection(selectedIdx)
    }

    // Preview stall (right side)
    var pvX = scrollW + 16
    var pvW = w - pvX - 10
    gui.addLabel(C.LBL_SEC_TITLE2, "§b§lSelected Listing", pvX + 6, 44, pvW - 12, 10)

    if (selectedIdx >= 0 && selectedIdx < ids.length) {
        var selListing = findListing(data, ids[selectedIdx])
        if (selListing) {
            addPreviewToGui(gui, pvX, pvW, selListing, world, true)
        }
    } else {
        gui.addLabel(C.LBL_PV_HINT, "§8Select a listing entry", pvX + 6, 80, pvW - 12, 10)
        gui.addLabel(C.LBL_PV_QTY, "§8to inspect the apartment", pvX + 6, 94, pvW - 12, 10)
    }

    // Action row
    gui.addButton(C.BTN_SORT, "§f\u2195 " + getSortLabel(player.getName()), 10, h - 56, 104, 18)
    gui.addButton(C.BTN_REFRESH, "§b\u21BB", 118, h - 56, 34, 18)
    gui.addButton(C.BTN_BACK, "§7\u25C0 Back", 156, h - 56, 76, 18)
    gui.addButton(C.BTN_VIEW, "§e\u25C6 Inspect", pvX + 8, h - 56, 70, 18)
    gui.addButton(C.BTN_REQUEST, "§a§l\u2714 Request", pvX + 82, h - 56, pvW - 90, 18)

    gui.addLabel(C.LBL_FOOTER, "§8Select and request an apartment. Host will approve or reject.", 10, h - 30, w - 20, 10)
    gui.addButton(C.BTN_CLOSE, "§7Close", Math.floor((w - 68) / 2), h - 16, 68, 14)
    player.showCustomGui(gui)
}

// ============================================================================
// LISTING DETAIL GUI — Card-style item showcase
// ============================================================================
function openDetailGui(event, listingId) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) return

    var data = loadData(npc)
    var L = findListing(data, listingId)
    if (!L) { player.message("§c[Apartment] Listing not found"); return }

    var pn = player.getName()
    playerDetailId[pn] = listingId

    var w = 330
    var h = 245
    var gui = api.createCustomGui(GUIS.DETAIL, w, h, false, player)
    buildFrame(gui, w, h, "§6§l\u25C6 Listing Details", SKIN.DETAIL)

    gui.addLabel(C.LBL_SUBTITLE, "§8Inspect this listing before requesting", 12, 34, w - 24, 10)

    // --- Item showcase card ---
    buildSection(gui, C.BG_SECTION1, 12, 42, w - 24, 84, SKIN.DETAIL.sectionA)
    var item = deserializeItem(L.itemNbt, world)
    if (item) {
        gui.addTexturedRect(C.BG_ITEM_FRAME, TEX.FRAME, 20, 58, 34, 34)
        addItemDisplay(gui, C.ITEM_PREVIEW, 28, 66, item)
    }
    var iName = getItemLabel(L.itemNbt, world)
    gui.addLabel(C.LBL_D1, "§f§l" + iName, 62, 58, 250, 12)
    gui.addLabel(C.LBL_D5, "§7Host: §f" + L.sellerName, 62, 74, 250, 10)
    gui.addLabel(C.LBL_D6, "§7Listing fee paid: " + formatPrice(L.feePaid), 62, 88, 250, 10)
    gui.addLabel(C.LBL_HINT, "§8Posted as a rental listing", 62, 102, 250, 10)

    // --- Deal section ---
    buildSection(gui, C.BG_SECTION2, 12, 132, w - 24, 66, SKIN.DETAIL.sectionB || TEX.SECTION)
    buildDivider(gui, C.BG_DIVIDER, 18, 146, w - 36, SKIN.DETAIL.trim)

    gui.addLabel(C.LBL_D2, "§7Price", 20, 152, 80, 12)
    gui.addLabel(C.LBL_ICON1, "§e§l" + formatPrice(L.price), 100, 152, 210, 12)

    gui.addLabel(C.LBL_D3, "§7Time left", 20, 166, 80, 12)
    var tl = timeLeftStr(L)
    var tlColor = tl === "EXPIRED" ? "§c" : "§b"
    gui.addLabel(C.LBL_ICON2, tlColor + tl, 100, 166, 210, 12)

    gui.addLabel(C.LBL_D4, "§7Your wallet", 20, 180, 80, 12)
    var bal = countPlayerCoins(player)
    var canAfford = bal >= L.price
    gui.addLabel(C.LBL_ICON3, (canAfford ? "§a" : "§c") + formatPrice(bal) + (canAfford ? "" : " §c(insufficient)"), 100, 180, 210, 12)

    // Actions
    var isSeller = (L.sellerUuid === player.getUUID())
    if (!isSeller) {
        gui.addButton(C.BTN_REQUEST, "§a§l\u2714 Request", 12, h - 44, 130, 20)
    } else {
        gui.addLabel(C.LBL_INFO, "§7§oThis is your listing", 12, h - 40, 180, 12)
    }
    gui.addButton(C.BTN_BACK, "§7\u25C0 Back", w - 82, h - 44, 70, 20)

    gui.addLabel(C.LBL_FOOTER, "§8Requesting deposits the full price as escrow.", 10, h - 26, w - 20, 10)
    player.showCustomGui(gui)
}

// ============================================================================
// MY LISTINGS GUI — Scroll + live item preview panel
// ============================================================================
function openMyListingsGui(event, selectedIdx) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Apartment] NPC not found"); return }

    cleanExpired(npc, world)
    var data = loadData(npc)
    var mine = getPlayerListings(data, player.getUUID())
    mine = sortListings(mine, getSortMode(player.getName()), world)

    var w = 470
    var h = 290
    var gui = api.createCustomGui(GUIS.MY_LIST, w, h, false, player)

    // Title
    gui.addLabel(C.LBL_TITLE, "§6§l\u25A0 My Host Listings", 10, 6, w - 20, 16)

    gui.addLabel(C.LBL_SUBTITLE, "§7Your active listings: §f" + mine.length + "§7/" + MAX_LISTINGS + "  §8|  §7Wallet: §a" + formatPrice(countPlayerCoins(player)), 12, 30, w - 24, 10)

    // Left: host ledger
    var scrollW = 286
    var lines = []
    var ids = []
    for (var i = 0; i < mine.length; i++) {
        var L = mine[i]
        var iName = getItemLabel(L.itemNbt, world)
        var reqCount = getPendingRequestCountForListing(data, L.id)
        var reqTag = reqCount > 0 ? " §e[" + reqCount + " req]" : ""
        lines.push(formatPrice(L.price) + " §r§8|§r " + iName + reqTag + " §r§8|§r §b" + timeLeftStr(L))
        ids.push(L.id)
    }
    if (lines.length === 0) lines.push("§7\u2014 You have no active listings \u2014")

    var pn = player.getName()
    playerMyIds[pn] = ids
    if (selectedIdx === undefined || selectedIdx < 0) selectedIdx = -1
    playerMyIdx[pn] = selectedIdx

    gui.addLabel(C.LBL_SEC_TITLE, "§6§lHost Ledger", 16, 58, scrollW - 12, 10)

    var scroll = gui.addScroll(C.SCROLL, 14, 74, scrollW - 8, h - 142, lines)
    if (selectedIdx >= 0 && selectedIdx < lines.length) {
        scroll.setDefaultSelection(selectedIdx)
    }

    // Right: selected listing
    var pvX = scrollW + 16
    var pvW = w - pvX - 10
    gui.addLabel(C.LBL_SEC_TITLE2, "§e§lSelected Listing", pvX + 6, 58, pvW - 12, 10)

    if (selectedIdx >= 0 && selectedIdx < ids.length) {
        var selListing = findListing(data, ids[selectedIdx])
        if (selListing) {
            addPreviewToGui(gui, pvX, pvW, selListing, world, false)
        }
    } else {
        gui.addLabel(C.LBL_PV_HINT, "§8Select one of your listings", pvX + 6, 106, pvW - 12, 10)
        gui.addLabel(C.LBL_PV_QTY, "§8to preview or manage", pvX + 6, 120, pvW - 12, 10)
    }

    // Actions
    gui.addButton(C.BTN_SORT, "§f\u2195 " + getSortLabel(player.getName()), 10, h - 46, 104, 18)
    gui.addButton(C.BTN_VIEW_REQS, "§e\u25C6 View Requests", 118, h - 46, 114, 18)
    gui.addButton(C.BTN_CANCEL_LST, "§c\u2716 Remove Listing", 236, h - 46, 114, 18)
    gui.addButton(C.BTN_BACK, "§7\u25C0 Back", w - 82, h - 46, 70, 18)
    gui.addLabel(C.LBL_FOOTER, "§8Removing returns the key. Use View Requests to manage tenants.", 10, h - 26, w - 20, 10)
    player.showCustomGui(gui)
}

// ============================================================================
// REQUESTS MANAGER GUI — Host views & accepts/rejects pending requests
// ============================================================================
function openRequestsManagerGui(event, listingId, selectedIdx) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Apartment] NPC not found"); return }

    cleanExpired(npc, world)
    var data = loadData(npc)
    var listing = findListing(data, listingId)
    if (!listing || listing.sellerUuid !== player.getUUID()) {
        player.message("§c[Apartment] Listing not found or not yours")
        return
    }

    var pending = getPendingRequestsForListing(data, listingId)

    var w = 440
    var h = 290
    var gui = api.createCustomGui(GUIS.REQ_MGR, w, h, false, player)

    var iName = getItemLabel(listing.itemNbt, world)
    gui.addLabel(C.LBL_TITLE, "§6§l\u25C6 Requests: " + iName, 10, 6, w - 20, 16)
    gui.addLabel(C.LBL_SUBTITLE, "§7Pending: §f" + pending.length + "  §8|  §7Price: " + formatPrice(listing.price) + "  §8|  §7Host: §f" + listing.sellerName, 12, 30, w - 24, 10)

    // Left: pending requests list
    var scrollW = 240
    var lines = []
    var reqIds = []
    for (var i = 0; i < pending.length; i++) {
        var req = pending[i]
        lines.push(req.requesterName + " §r§8-§r " + formatPrice(req.amountDeposited))
        reqIds.push(req.id)
    }
    if (lines.length === 0) lines.push("§7\u2014 No pending requests \u2014")

    var pn = player.getName()
    playerReqMgrIds[pn] = reqIds
    playerReqMgrListingId[pn] = listingId
    if (selectedIdx === undefined || selectedIdx < 0) selectedIdx = -1
    playerReqMgrIdx[pn] = selectedIdx

    gui.addLabel(C.LBL_SEC_TITLE, "§6§lPending Tenants", 14, 44, scrollW, 10)
    var scroll = gui.addScroll(C.SCROLL, 12, 56, scrollW - 6, h - 120, lines)
    if (selectedIdx >= 0 && selectedIdx < lines.length) {
        scroll.setDefaultSelection(selectedIdx)
    }

    // Right: selected request preview
    var pvX = scrollW + 18
    var pvW = w - pvX - 12
    gui.addLabel(C.LBL_SEC_TITLE2, "§b§lRequest Details", pvX + 6, 44, pvW - 12, 10)

    if (selectedIdx >= 0 && selectedIdx < reqIds.length) {
        var selReq = findRequest(data, reqIds[selectedIdx])
        if (selReq) {
            gui.addLabel(C.LBL_REQ_REQUESTER, "§7Requester: §f" + selReq.requesterName, pvX + 6, 68, pvW - 12, 10)
            gui.addLabel(C.LBL_REQ_AMOUNT, "§7Deposited: §a" + formatPrice(selReq.amountDeposited), pvX + 6, 82, pvW - 12, 10)
            gui.addLabel(C.LBL_REQ_TIME, "§7Requested: §b" + timeAgoStr(selReq.createdAt), pvX + 6, 96, pvW - 12, 10)
            gui.addLabel(C.LBL_REQ_STATUS, "§7Status: §ePending", pvX + 6, 110, pvW - 12, 10)
        }
    } else {
        gui.addLabel(C.LBL_PV_HINT, "§8Select a pending request", pvX + 6, 80, pvW - 12, 10)
        gui.addLabel(C.LBL_PV_QTY, "§8to view details", pvX + 6, 94, pvW - 12, 10)
    }

    // Action buttons
    gui.addButton(C.BTN_ACCEPT, "§a§l\u2714 Accept", 12, h - 36, 96, 18)
    gui.addButton(C.BTN_REJECT, "§c§l\u2716 Reject", 112, h - 36, 96, 18)
    gui.addButton(C.BTN_REFRESH, "§b\u21BB Refresh", 212, h - 36, 50, 18)
    gui.addButton(C.BTN_BACK, "§7\u25C0 Back", w - 72, h - 36, 62, 18)
    gui.addLabel(C.LBL_FOOTER, "§8Accept sends key + collects rent. Reject refunds the deposit.", 10, h - 18, w - 20, 10)
    player.showCustomGui(gui)
}

function timeAgoStr(timestamp) {
    var diff = now() - timestamp
    var mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return mins + "m ago"
    var hrs = Math.floor(mins / 60)
    if (hrs < 24) return hrs + "h ago"
    return Math.floor(hrs / 24) + "d ago"
}

// ============================================================================
// MY REQUESTS GUI — Player views their own requests & cancels pending ones
// ============================================================================
function openMyRequestsGui(event, selectedIdx) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Apartment] NPC not found"); return }

    cleanExpired(npc, world)
    var data = loadData(npc)
    var myReqs = getPlayerRequests(data, player.getUUID())

    var w = 440
    var h = 280
    var gui = api.createCustomGui(GUIS.MY_REQS, w, h, false, player)

    gui.addLabel(C.LBL_TITLE, "§6§l\u25C7 My Requests", 10, 6, w - 20, 16)
    gui.addLabel(C.LBL_SUBTITLE, "§7Total requests: §f" + myReqs.length + "  §8|  §7Wallet: §a" + formatPrice(countPlayerCoins(player)), 12, 30, w - 24, 10)

    // Left: request list
    var scrollW = 240
    var lines = []
    var reqIds = []
    for (var i = 0; i < myReqs.length; i++) {
        var req = myReqs[i]
        var listing = findListing(data, req.listingId)
        var aptName = listing ? getItemLabel(listing.itemNbt, world) : "§c[Removed]"
        var statusLabel = req.status === "pending" ? "§ePending" : req.status === "accepted" ? "§aAccepted" : req.status === "rejected" ? "§cRejected" : "§7Cancelled"
        lines.push(statusLabel + " §r§8|§r " + aptName + " §r§8|§r " + formatPrice(req.amountDeposited))
        reqIds.push(req.id)
    }
    if (lines.length === 0) lines.push("§7\u2014 You have no requests \u2014")

    var pn = player.getName()
    playerMyReqsIds[pn] = reqIds
    if (selectedIdx === undefined || selectedIdx < 0) selectedIdx = -1
    playerMyReqsIdx[pn] = selectedIdx

    gui.addLabel(C.LBL_SEC_TITLE, "§6§lRequest Log", 14, 44, scrollW, 10)
    var scroll = gui.addScroll(C.SCROLL, 12, 56, scrollW - 6, h - 110, lines)
    if (selectedIdx >= 0 && selectedIdx < lines.length) {
        scroll.setDefaultSelection(selectedIdx)
    }

    // Right: selected request details
    var pvX = scrollW + 18
    var pvW = w - pvX - 12
    gui.addLabel(C.LBL_SEC_TITLE2, "§b§lRequest Details", pvX + 6, 44, pvW - 12, 10)

    var canCancel = false
    if (selectedIdx >= 0 && selectedIdx < reqIds.length) {
        var selReq = findRequest(data, reqIds[selectedIdx])
        if (selReq) {
            var apt = findListing(data, selReq.listingId)
            gui.addLabel(C.LBL_REQ_REQUESTER, "§7Apartment: §f" + (apt ? getItemLabel(apt.itemNbt, world) : "§c[Removed]"), pvX + 6, 68, pvW - 12, 10)
            gui.addLabel(C.LBL_REQ_AMOUNT, "§7Amount: §a" + formatPrice(selReq.amountDeposited), pvX + 6, 82, pvW - 12, 10)
            gui.addLabel(C.LBL_REQ_TIME, "§7Requested: §b" + timeAgoStr(selReq.createdAt), pvX + 6, 96, pvW - 12, 10)
            var statusColor = selReq.status === "pending" ? "§e" : selReq.status === "accepted" ? "§a" : selReq.status === "rejected" ? "§c" : "§7"
            gui.addLabel(C.LBL_REQ_STATUS, "§7Status: " + statusColor + selReq.status.charAt(0).toUpperCase() + selReq.status.slice(1), pvX + 6, 110, pvW - 12, 10)
            canCancel = selReq.status === "pending"
        }
    } else {
        gui.addLabel(C.LBL_PV_HINT, "§8Select a request", pvX + 6, 80, pvW - 12, 10)
        gui.addLabel(C.LBL_PV_QTY, "§8to view details", pvX + 6, 94, pvW - 12, 10)
    }

    // Actions
    if (canCancel) {
        gui.addButton(C.BTN_CANCEL_REQ, "§c\u2716 Cancel Request", 12, h - 36, 114, 18)
    }
    gui.addButton(C.BTN_REFRESH, "§b\u21BB", 130, h - 36, 40, 18)
    gui.addButton(C.BTN_CLAIM, "§e\u25C6 Claim Earnings", 174, h - 36, 114, 18)
    gui.addButton(C.BTN_BACK, "§7\u25C0 Back", w - 72, h - 36, 62, 18)

    gui.addLabel(C.LBL_FOOTER, "§8Pending = waiting for host. Accepted = key ready in Cashier.", 10, h - 18, w - 20, 10)
    player.showCustomGui(gui)
}

// ============================================================================
// CLAIM GUI — Earnings & returned items collection
// ============================================================================
function openClaimGui(event) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Apartment] NPC not found"); return }

    cleanExpired(npc, world)
    var data = loadData(npc)
    var uuid = player.getUUID()
    var owed = data.payouts[uuid] || 0
    var returnItems = data.returns[uuid] || []

    var w = 340
    var h = 235
    var gui = api.createCustomGui(GUIS.CLAIM, w, h, false, player)
    buildFrame(gui, w, h, "§6§l\u25C6 Claim Earnings", SKIN.CLAIM)

    gui.addLabel(C.LBL_SUBTITLE, "§8Cashier desk for collected rent and approved keys", 12, 34, w - 24, 10)

    // Earnings counter (left)
    buildSection(gui, C.BG_SECTION1, 12, 44, 156, 136, SKIN.CLAIM.sectionA)
    gui.addLabel(C.LBL_SEC_TITLE, "§e§lCurrency Counter", 18, 50, 144, 10)
    buildDivider(gui, C.BG_DIVIDER, 18, 62, 144, SKIN.CLAIM.trim)
    gui.addLabel(C.LBL_PAYOUT, "§7Owed", 18, 72, 140, 10)
    gui.addLabel(C.LBL_D1, owed > 0 ? "§a§l" + formatPrice(owed) : "§8" + formatPrice(0), 18, 84, 140, 12)
    if (owed > 0) {
        gui.addButton(C.BTN_CLAIM_EM, "§a\u2714 Claim Currency", 18, 148, 144, 18)
    } else {
        gui.addLabel(C.LBL_D2, "§8No currency pending", 18, 148, 144, 10)
    }

    // Returns counter (right)
    buildSection(gui, C.BG_SECTION2, 172, 44, 156, 136, SKIN.CLAIM.sectionB)
    gui.addLabel(C.LBL_SEC_TITLE2, "§b§lKeys Counter", 178, 50, 144, 10)
    buildDivider(gui, C.BG_STRIPE2, 178, 62, 144, SKIN.CLAIM.trim)
    gui.addLabel(C.LBL_RETURNS, "§7Keys waiting", 178, 72, 144, 10)
    gui.addLabel(C.LBL_D3, returnItems.length > 0 ? "§f§l" + returnItems.length + " key(s)" : "§8None", 178, 84, 144, 12)
    if (returnItems.length > 0) {
        gui.addButton(C.BTN_CLAIM_ITEMS, "§a\u2714 Claim Keys", 178, 148, 144, 18)
    } else {
        gui.addLabel(C.LBL_D4, "§8No keys pending", 178, 148, 144, 10)
    }

    if (owed === 0 && returnItems.length === 0) {
        gui.addLabel(C.LBL_INFO, "§7§oNothing to claim. Rent or keys will appear here.", 12, 186, w - 24, 12)
    }

    gui.addButton(C.BTN_BACK, "§7\u25C0 Back", Math.floor((w - 74) / 2), h - 30, 74, 18)
    player.showCustomGui(gui)
}

// ============================================================================
// ADMIN GUI — Red-accented management panel
// ============================================================================
function openAdminGui(event, selectedIdx) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) return

    cleanExpired(npc, world)
    var data = loadData(npc)

    var totalPayouts = 0
    var payKeys = Object.keys(data.payouts)
    for (var i = 0; i < payKeys.length; i++) totalPayouts += data.payouts[payKeys[i]]

    var totalReturns = 0
    var retKeys = Object.keys(data.returns)
    for (var i = 0; i < retKeys.length; i++) totalReturns += data.returns[retKeys[i]].length

    var totalPendingReqs = 0
    for (var i = 0; i < data.requests.length; i++) {
        if (data.requests[i].status === "pending") totalPendingReqs++
    }

    var w = 450
    var h = 310
    var gui = api.createCustomGui(GUIS.ADMIN, w, h, false, player)

    // Title
    gui.addLabel(C.LBL_TITLE, "§c§l\u2620 Admin \u2014 Apartment Manager", 10, 6, w - 20, 16)

    // Stats bar
    gui.addLabel(C.LBL_STATS,
        "§7Listings: §f" + data.listings.length +
        " §8| §7Requests: §e" + totalPendingReqs +
        " §8| §7Payouts: §e" + totalPayouts + CUR_SYMBOL +
        " §8| §7Returns: §f" + totalReturns + " items",
        12, 30, w - 24, 10)

    // Scroll (left side)
    var scrollW = 280
    var lines = []
    var ids = []
    for (var i = 0; i < data.listings.length; i++) {
        var L = data.listings[i]
        var iName = getItemLabel(L.itemNbt, world)
        var status = L.status
        if (L.status === "active" && isExpired(L)) status = "expired"
        var statusTag = status === "active" ? "§a\u25CF" : status === "expired" ? "§c\u25CF" : "§7\u25CF"
        lines.push(
            statusTag + " " + iName +
            " §r§8|§r " + formatPrice(L.price) +
            " §r§8|§r §7" + L.sellerName
        )
        ids.push(L.id)
    }
    if (lines.length === 0) lines.push("§7\u2014 No listings in database \u2014")

    var pn = player.getName()
    playerAdminIds[pn] = ids
    if (selectedIdx === undefined || selectedIdx < 0) selectedIdx = -1
    playerAdminIdx[pn] = selectedIdx

    var scroll = gui.addScroll(C.SCROLL, 10, 44, scrollW, h - 110, lines)
    if (selectedIdx >= 0 && selectedIdx < lines.length) {
        scroll.setDefaultSelection(selectedIdx)
    }

    // Preview panel (right side)
    var pvX = scrollW + 16
    var pvW = w - pvX - 10

    if (selectedIdx >= 0 && selectedIdx < ids.length) {
        var selListing = findListing(data, ids[selectedIdx])
        if (selListing) {
            addPreviewToGui(gui, pvX, pvW, selListing, world, true)
        }
    } else {
        gui.addLabel(C.LBL_PV_HINT, "§8Select a listing", pvX + 6, 70, pvW - 12, 10)
        gui.addLabel(C.LBL_PV_QTY, "§8to preview", pvX + 6, 84, pvW - 12, 10)
    }

    // Admin action bar
    gui.addButton(C.BTN_SORT, "§f\u2195 " + getSortLabel(player.getName()), 10, h - 56, 100, 18)
    gui.addButton(C.BTN_ADM_REMOVE, "§c\u2716 Remove", 116, h - 56, 76, 18)
    gui.addButton(C.BTN_ADM_REFUND, "§e\u21A9 Refund", 198, h - 56, 72, 18)
    gui.addButton(C.BTN_REFRESH, "§b\u21BB", 276, h - 56, 30, 18)
    gui.addButton(C.BTN_BACK, "§7\u25C0 Back", w - 72, h - 56, 62, 18)

    gui.addLabel(C.LBL_FOOTER, "§8\u26A0 Admin actions are permanent. Select listing first.", 10, h - 30, w - 20, 10)
    player.showCustomGui(gui)
}

// ============================================================================
// CONFIRM DIALOG — Centered modal with warning accent
// ============================================================================
function openConfirmGui(event, title, message, action, actionData) {
    var player = event.player
    var api = event.API
    var pn = player.getName()
    playerConfirmAction[pn] = { action: action, data: actionData }

    var w = 280
    var h = 140
    var gui = api.createCustomGui(GUIS.CONFIRM, w, h, false, player)
    buildFrame(gui, w, h, title, SKIN.CONFIRM)

    gui.addLabel(C.LBL_INFO, message, 14, 38, w - 28, 42)

    var bw = 90
    var gap = 20
    var totalBtns = bw * 2 + gap
    var startX = Math.floor((w - totalBtns) / 2)

    gui.addButton(C.BTN_YES, "§a§l\u2714 Confirm", startX, h - 28, bw, 18)
    gui.addButton(C.BTN_NO, "§c§l\u2716 Cancel", startX + bw + gap, h - 28, bw, 18)
    player.showCustomGui(gui)
}

// ============================================================================
// CORE LOGIC — Create Listing (Host Apartment)
// ============================================================================
function doCreateListing(event, price, days) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Apartment] Error: NPC not found"); return }

    var held = player.getMainhandItem()
    if (!held || held.isEmpty() || held.getName() === "minecraft:air") {
        player.message("§c[Apartment] You must hold the key item in your main hand!")
        return
    }

    // Price is already in cents (parsed by parsePriceInput in the button handler)
    price = parseInt(price)
    days = parseInt(days)
    if (isNaN(price) || price < MIN_PRICE || price > MAX_PRICE) {
        player.message("§c[Apartment] Price must be 0.01-" + (MAX_PRICE / 100) + CUR_SYMBOL)
        return
    }
    var maxDaysAllowed = MAX_DAYS > 0 ? MAX_DAYS : 99999
    if (isNaN(days) || days < 0 || days > maxDaysAllowed) {
        var msg = MAX_DAYS > 0 ? "§c[Apartment] Days must be 1-" + MAX_DAYS : "§c[Apartment] Days must be 0 or greater"
        player.message(msg)
        return
    }

    var data = loadData(npc)
    if (countPlayerListings(data, player.getUUID()) >= MAX_LISTINGS) {
        player.message("§c[Apartment] You already have " + MAX_LISTINGS + " active listings!")
        return
    }

    var fee = calcFee(price, days)
    if (countPlayerCoins(player) < fee) {
        player.message("§c[Apartment] You need " + formatPrice(fee) + " for the listing fee!")
        return
    }

    var itemNbt = serializeItem(held)
    if (!itemNbt) {
        player.message("§c[Apartment] Failed to serialize key item")
        return
    }

    // Charge fee
    if (!removeCoins(player, fee)) {
        player.message("§c[Apartment] Failed to charge listing fee")
        return
    }

    // Remove item from main hand
    player.setMainhandItem(world.createItem("minecraft:air", 1))
    player.updatePlayerInventory()

    // Create listing entry
    var listing = {
        id: generateId(),
        sellerUuid: player.getUUID(),
        sellerName: player.getName(),
        itemNbt: itemNbt,
        price: price,
        days: days,
        feePaid: fee,
        createdAt: now(),
        status: "active"
    }
    data.listings.push(listing)
    saveData(npc, data)

    player.message("§a[Apartment] Listed key for " + formatPrice(price) + " §a(" + days + " days). Fee: " + formatPrice(fee))
    openMainMenu(event)
}

// ============================================================================
// CORE LOGIC — Request Apartment (deposit money, create pending request)
// ============================================================================
function doRequestApartment(event, listingId) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Apartment] Error: NPC not found"); return }

    // Load fresh data
    var data = loadData(npc)
    var L = findListing(data, listingId)

    // Verify listing still active
    if (!L || L.status !== "active") {
        player.message("§c[Apartment] Listing no longer available")
        openBrowserGui(event)
        return
    }
    if (isExpired(L)) {
        player.message("§c[Apartment] Listing has expired")
        openBrowserGui(event)
        return
    }

    // Can't request own listing
    if (L.sellerUuid === player.getUUID()) {
        player.message("§c[Apartment] You cannot request your own listing!")
        return
    }

    // Check if player already has a pending request for this listing
    var myReqs = getPlayerRequests(data, player.getUUID())
    for (var i = 0; i < myReqs.length; i++) {
        if (myReqs[i].listingId === listingId && myReqs[i].status === "pending") {
            player.message("§c[Apartment] You already have a pending request for this listing!")
            return
        }
    }

    // Check buyer funds
    var priceToPay = L.price
    if (countPlayerCoins(player) < priceToPay) {
        player.message("§c[Apartment] You need " + formatPrice(priceToPay) + " to deposit")
        return
    }

    // Remove coins from player (deposit into escrow)
    if (!removeCoins(player, priceToPay)) {
        player.message("§c[Apartment] Payment failed")
        return
    }

    // Re-verify listing after payment (race condition guard)
    data = loadData(npc)
    L = findListing(data, listingId)
    if (!L || L.status !== "active") {
        // Rollback — refund buyer
        giveCoins(player, priceToPay)
        player.message("§c[Apartment] Listing was removed! Refunded.")
        openBrowserGui(event)
        return
    }

    // Create request
    var request = {
        id: generateId(),
        listingId: listingId,
        requesterUuid: player.getUUID(),
        requesterName: player.getName(),
        amountDeposited: priceToPay,
        status: "pending",
        createdAt: now()
    }
    data.requests.push(request)
    saveData(npc, data)

    player.message("§a[Apartment] Request sent! " + formatPrice(priceToPay) + " §aheld in escrow. Awaiting host approval.")
    player.updatePlayerInventory()
    openBrowserGui(event)
}

// ============================================================================
// CORE LOGIC — Accept Request (give key to requester, money to host)
// ============================================================================
function doAcceptRequest(event, requestId) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Apartment] Error: NPC not found"); return }

    var data = loadData(npc)
    var req = findRequest(data, requestId)
    if (!req || req.status !== "pending") {
        player.message("§c[Apartment] Request no longer pending")
        return
    }

    var listing = findListing(data, req.listingId)
    if (!listing || listing.status !== "active") {
        player.message("§c[Apartment] Listing no longer available")
        return
    }

    // Verify host owns this listing
    if (listing.sellerUuid !== player.getUUID()) {
        player.message("§c[Apartment] This listing is not yours!")
        return
    }

    // Mark request as accepted
    req.status = "accepted"
    req.resolvedAt = now()

    // Add key item to requester's returns (they claim from GUI)
    if (!data.returns[req.requesterUuid]) data.returns[req.requesterUuid] = []
    data.returns[req.requesterUuid].push(listing.itemNbt)

    // Add money to host's payouts
    if (!data.payouts[listing.sellerUuid]) data.payouts[listing.sellerUuid] = 0
    data.payouts[listing.sellerUuid] += req.amountDeposited

    // Mark listing as sold (the key has been given away)
    listing.status = "sold"
    listing.soldAt = now()

    // Auto-reject all other pending requests for this listing
    var autoRejected = autoRejectOtherRequests(data, req.listingId, req.id)

    saveData(npc, data)

    player.message("§a[Apartment] Accepted! Key sent to " + req.requesterName + "§a. Rent +" + formatPrice(req.amountDeposited))
    if (autoRejected > 0) {
        player.message("§e[Apartment] Auto-rejected " + autoRejected + " other pending request(s)")
    }
    openRequestsManagerGui(event, req.listingId)
}

// ============================================================================
// CORE LOGIC — Reject Request (return money to requester)
// ============================================================================
function doRejectRequest(event, requestId) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Apartment] Error: NPC not found"); return }

    var data = loadData(npc)
    var req = findRequest(data, requestId)
    if (!req || req.status !== "pending") {
        player.message("§c[Apartment] Request no longer pending")
        return
    }

    var listing = findListing(data, req.listingId)
    if (!listing || listing.sellerUuid !== player.getUUID()) {
        player.message("§c[Apartment] This listing is not yours!")
        return
    }

    // Mark request as rejected
    req.status = "rejected"
    req.resolvedAt = now()

    // Return money to requester's payouts (they claim from GUI)
    if (!data.payouts[req.requesterUuid]) data.payouts[req.requesterUuid] = 0
    data.payouts[req.requesterUuid] += req.amountDeposited

    saveData(npc, data)

    player.message("§e[Apartment] Rejected " + req.requesterName + "§e. Deposit refunded to their claims.")
    openRequestsManagerGui(event, req.listingId)
}

// ============================================================================
// CORE LOGIC — Cancel Own Request (player cancels their pending request)
// ============================================================================
function doCancelRequest(event, requestId) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Apartment] Error: NPC not found"); return }

    var data = loadData(npc)
    var req = findRequest(data, requestId)
    if (!req || req.status !== "pending") {
        player.message("§c[Apartment] Request no longer pending")
        return
    }

    if (req.requesterUuid !== player.getUUID()) {
        player.message("§c[Apartment] This is not your request!")
        return
    }

    // Mark request as cancelled
    req.status = "cancelled"
    req.resolvedAt = now()

    // Return money to requester's payouts (they claim from GUI)
    if (!data.payouts[req.requesterUuid]) data.payouts[req.requesterUuid] = 0
    data.payouts[req.requesterUuid] += req.amountDeposited

    saveData(npc, data)

    player.message("§e[Apartment] Request cancelled. " + formatPrice(req.amountDeposited) + " §ereturned to your claims.")
    player.updatePlayerInventory()
    openMyRequestsGui(event)
}

// ============================================================================
// CORE LOGIC — Claim Earnings
// ============================================================================
function doClaimEmeralds(event) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) return

    var data = loadData(npc)
    var uuid = player.getUUID()
    var owed = data.payouts[uuid] || 0
    if (owed <= 0) {
        player.message("§7[Apartment] No coins to claim.")
        return
    }

    giveCoins(player, owed)
    delete data.payouts[uuid]
    saveData(npc, data)

    player.message("§a[Apartment] Claimed " + formatPrice(owed) + "§a!")
    openClaimGui(event)
}

// ============================================================================
// CORE LOGIC — Claim Returned Items (keys)
// ============================================================================
function doClaimItems(event) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) return

    var data = loadData(npc)
    var uuid = player.getUUID()
    var items = data.returns[uuid] || []
    if (items.length === 0) {
        player.message("§7[Apartment] No keys to claim.")
        return
    }

    var claimed = 0
    for (var i = 0; i < items.length; i++) {
        var item = deserializeItem(items[i], world)
        if (item) {
            if (!player.giveItem(item)) {
                player.dropItem(item)
            }
            claimed++
        }
    }

    delete data.returns[uuid]
    saveData(npc, data)

    player.message("§a[Apartment] Claimed §f" + claimed + " §akey(s)!")
    player.updatePlayerInventory()
    openClaimGui(event)
}

// ============================================================================
// CORE LOGIC — Cancel Own Listing (remove listing, return key to host)
// ============================================================================
function doCancelListing(event, listingId) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) return

    var data = loadData(npc)
    var L = findListing(data, listingId)
    if (!L || L.sellerUuid !== player.getUUID()) {
        player.message("§c[Apartment] Listing not found or not yours")
        return
    }

    // Auto-reject any pending requests for this listing
    var rejected = autoRejectOtherRequests(data, listingId, null)
    if (rejected > 0) {
        player.message("§e[Apartment] Auto-rejected " + rejected + " pending request(s)")
    }

    // Return key item to seller
    var item = deserializeItem(L.itemNbt, world)
    if (item) {
        if (!player.giveItem(item)) {
            player.dropItem(item)
        }
    }

    // Remove listing (fee is NOT refunded)
    removeListing(data, listingId)
    saveData(npc, data)

    player.message("§e[Apartment] Listing removed. Key returned. (Fee not refunded)")
    player.updatePlayerInventory()
    openMyListingsGui(event)
}

// ============================================================================
// CORE LOGIC — Admin: Force Remove (no refund)
// ============================================================================
function doAdminRemove(event, listingId) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) return

    var data = loadData(npc)

    // Auto-reject any pending requests
    autoRejectOtherRequests(data, listingId, null)

    removeListing(data, listingId)
    saveData(npc, data)

    player.message("§c[Admin] Listing force-removed (no refund)")
    openAdminGui(event)
}

// ============================================================================
// CORE LOGIC — Admin: Refund + Remove (item + fee returned to seller claims)
// ============================================================================
function doAdminRefund(event, listingId) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) return

    var data = loadData(npc)
    var L = findListing(data, listingId)
    if (!L) { player.message("§c[Admin] Listing not found"); return }

    // Auto-reject any pending requests
    autoRejectOtherRequests(data, listingId, null)

    // Return item to seller's returns
    if (!data.returns[L.sellerUuid]) data.returns[L.sellerUuid] = []
    data.returns[L.sellerUuid].push(L.itemNbt)

    // Refund fee to seller's payouts
    if (!data.payouts[L.sellerUuid]) data.payouts[L.sellerUuid] = 0
    data.payouts[L.sellerUuid] += L.feePaid

    removeListing(data, listingId)
    saveData(npc, data)

    player.message("§e[Admin] Listing refunded. Key + fee returned to seller's claims.")
    openAdminGui(event)
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

function init(e) {
    npcUuid = e.npc.getUUID()
}

function tick(e) {
    // Cleanup is driven by player interactions, not tick.
    // NPC tick is unreliable (chunk may not be loaded).
}

function interact(e) {
    npcUuid = e.npc.getUUID()
    e.setCanceled(true)

    // Admin access: Creative + Sneak + Hold Bedrock
    if (isAdmin(e.player)) {
        openAdminGui(e)
        return
    }

    openMainMenu(e)
}

function customGuiButton(e) {
    var player = e.player
    var gui = e.gui
    var bid = e.buttonId
    var gid = gui.getID()
    var pn = player.getName()

    // ---- MAIN MENU ----
    if (gid === GUIS.MAIN) {
        if (bid === C.BTN_BROWSE) openBrowserGui(e)
        else if (bid === C.BTN_HOST) openHostGui(e)
        else if (bid === C.BTN_MY_LIST) openMyListingsGui(e)
        else if (bid === C.BTN_MY_REQS) openMyRequestsGui(e)
        else if (bid === C.BTN_CLAIM) openClaimGui(e)
        else if (bid === C.BTN_ADMIN) openAdminGui(e)
        else if (bid === C.BTN_CLOSE) player.closeGui()
        return
    }

    // ---- HOST GUI ----
    if (gid === GUIS.HOST) {
        if (bid === C.BTN_BACK) { openMainMenu(e); return }
        if (bid === C.BTN_LIST) {
            var priceComp = gui.getComponent(C.TF_PRICE)
            var daysComp = gui.getComponent(C.TF_DAYS)
            var priceStr = priceComp ? priceComp.getText() : "0"
            var daysStr = daysComp ? daysComp.getText() : "1"
            var price = parsePriceInput(priceStr)
            var days = parseInt(daysStr)

            if (isNaN(price) || price < MIN_PRICE || price > MAX_PRICE) {
                player.message("§c[Apartment] Invalid price (0.01-" + (MAX_PRICE / 100) + CUR_SYMBOL + ")")
                return
            }
            var maxDaysAllowed = MAX_DAYS > 0 ? MAX_DAYS : 99999
            if (isNaN(days) || days < 0 || days > maxDaysAllowed) {
                var msg = MAX_DAYS > 0 ? "§c[Apartment] Invalid days (1-" + MAX_DAYS + ")" : "§c[Apartment] Invalid days"
                player.message(msg)
                return
            }

            var held = player.getMainhandItem()
            if (!held || held.isEmpty() || held.getName() === "minecraft:air") {
                player.message("§c[Apartment] Hold the key item you want to list in your main hand!")
                return
            }

            var fee = calcFee(price, days)
            var itemName = held.getDisplayName()
            var count = held.getStackSize()
            var label = itemName + (count > 1 ? " x" + count : "")

            openConfirmGui(e,
                "§eConfirm Listing",
                "§fList §b" + label + "§f for " + formatPrice(price) + "§f? Duration: " + days + "d, Fee: " + formatPrice(fee),
                "create_listing",
                { price: price, days: days }
            )
        }
        return
    }

    // ---- BROWSER GUI ----
    if (gid === GUIS.BROWSER) {
        if (bid === C.BTN_BACK) { openMainMenu(e); return }
        if (bid === C.BTN_REFRESH) { openBrowserGui(e); return }
        if (bid === C.BTN_SORT) { nextSortMode(pn); openBrowserGui(e); return }
        if (bid === C.BTN_REQUEST || bid === C.BTN_VIEW) {
            var idx = playerBrowseIdx[pn]
            var ids = playerBrowseIds[pn]
            if (idx === undefined || idx < 0 || !ids || idx >= ids.length) {
                player.message("§c[Apartment] Select a listing first")
                return
            }
            var lid = ids[idx]
            if (bid === C.BTN_VIEW) {
                openDetailGui(e, lid)
            } else {
                var world = player.getWorld()
                var npc = getNpc(world)
                if (!npc) return
                var data = loadData(npc)
                var L = findListing(data, lid)
                if (!L) { player.message("§c[Apartment] Listing not found"); return }
                var iName = getItemLabel(L.itemNbt, world)
                openConfirmGui(e,
                    "§eConfirm Request",
                    "§fRequest §b" + iName + "§f? Deposit " + formatPrice(L.price) + "§f (refundable if host rejects)",
                    "request_apartment",
                    { listingId: lid }
                )
            }
        }
        return
    }

    // ---- DETAIL GUI ----
    if (gid === GUIS.DETAIL) {
        if (bid === C.BTN_BACK) { openBrowserGui(e); return }
        if (bid === C.BTN_REQUEST) {
            var lid = playerDetailId[pn]
            if (!lid) return
            var world = player.getWorld()
            var npc = getNpc(world)
            if (!npc) return
            var data = loadData(npc)
            var L = findListing(data, lid)
            if (!L) { player.message("§c[Apartment] Listing not found"); return }
            var iName = getItemLabel(L.itemNbt, world)
            openConfirmGui(e,
                "§eConfirm Request",
                "§fRequest §b" + iName + "§f? Deposit " + formatPrice(L.price) + "§f (refundable if host rejects)",
                "request_apartment",
                { listingId: lid }
            )
        }
        return
    }

    // ---- MY LISTINGS GUI ----
    if (gid === GUIS.MY_LIST) {
        if (bid === C.BTN_BACK) { openMainMenu(e); return }
        if (bid === C.BTN_SORT) { nextSortMode(pn); openMyListingsGui(e); return }
        if (bid === C.BTN_VIEW_REQS) {
            var idx = playerMyIdx[pn]
            var ids = playerMyIds[pn]
            if (idx === undefined || idx < 0 || !ids || idx >= ids.length) {
                player.message("§c[Apartment] Select a listing first")
                return
            }
            openRequestsManagerGui(e, ids[idx])
            return
        }
        if (bid === C.BTN_CANCEL_LST) {
            var idx = playerMyIdx[pn]
            var ids = playerMyIds[pn]
            if (idx === undefined || idx < 0 || !ids || idx >= ids.length) {
                player.message("§c[Apartment] Select a listing first")
                return
            }
            var world = player.getWorld()
            var npc = getNpc(world)
            if (!npc) return
            var data = loadData(npc)
            var selListing = findListing(data, ids[idx])
            var reqCount = selListing ? getPendingRequestCountForListing(data, selListing.id) : 0
            var warn = reqCount > 0 ? " §c(+" + reqCount + " pending requests will be rejected)" : ""
            openConfirmGui(e,
                "§eRemove Listing?",
                "§fRemove this listing and get the key back? §7(Fee not refunded)" + warn,
                "cancel_listing",
                { listingId: ids[idx] }
            )
        }
        return
    }

    // ---- REQUESTS MANAGER GUI ----
    if (gid === GUIS.REQ_MGR) {
        if (bid === C.BTN_BACK) { openMyListingsGui(e); return }
        if (bid === C.BTN_REFRESH) {
            openRequestsManagerGui(e, playerReqMgrListingId[pn])
            return
        }
        if (bid === C.BTN_ACCEPT || bid === C.BTN_REJECT) {
            var idx = playerReqMgrIdx[pn]
            var ids = playerReqMgrIds[pn]
            if (idx === undefined || idx < 0 || !ids || idx >= ids.length) {
                player.message("§c[Apartment] Select a request first")
                return
            }
            var rid = ids[idx]
            var world = player.getWorld()
            var npc = getNpc(world)
            if (!npc) return
            var data = loadData(npc)
            var req = findRequest(data, rid)
            if (!req) { player.message("§c[Apartment] Request not found"); return }
            if (bid === C.BTN_ACCEPT) {
                openConfirmGui(e,
                    "§aAccept Request?",
                    "§fAccept §b" + req.requesterName + "§f? Key will be sent. Rent +" + formatPrice(req.amountDeposited),
                    "accept_request",
                    { requestId: rid }
                )
            } else {
                openConfirmGui(e,
                    "§cReject Request?",
                    "§fReject §b" + req.requesterName + "§f? Their deposit will be refunded.",
                    "reject_request",
                    { requestId: rid }
                )
            }
        }
        return
    }

    // ---- MY REQUESTS GUI ----
    if (gid === GUIS.MY_REQS) {
        if (bid === C.BTN_BACK) { openMainMenu(e); return }
        if (bid === C.BTN_REFRESH) { openMyRequestsGui(e); return }
        if (bid === C.BTN_CLAIM) { openClaimGui(e); return }
        if (bid === C.BTN_CANCEL_REQ) {
            var idx = playerMyReqsIdx[pn]
            var ids = playerMyReqsIds[pn]
            if (idx === undefined || idx < 0 || !ids || idx >= ids.length) {
                player.message("§c[Apartment] Select a request first")
                return
            }
            openConfirmGui(e,
                "§eCancel Request?",
                "§fCancel this request? §7(Deposit will be refunded to your claims)",
                "cancel_request",
                { requestId: ids[idx] }
            )
        }
        return
    }

    // ---- CLAIM GUI ----
    if (gid === GUIS.CLAIM) {
        if (bid === C.BTN_BACK) { openMainMenu(e); return }
        if (bid === C.BTN_CLAIM_EM) doClaimEmeralds(e)
        if (bid === C.BTN_CLAIM_ITEMS) doClaimItems(e)
        return
    }

    // ---- ADMIN GUI ----
    if (gid === GUIS.ADMIN) {
        if (bid === C.BTN_BACK) { openMainMenu(e); return }
        if (bid === C.BTN_REFRESH) { openAdminGui(e); return }
        if (bid === C.BTN_SORT) { nextSortMode(pn); openAdminGui(e); return }
        if (bid === C.BTN_ADM_REMOVE || bid === C.BTN_ADM_REFUND) {
            var idx = playerAdminIdx[pn]
            var ids = playerAdminIds[pn]
            if (idx === undefined || idx < 0 || !ids || idx >= ids.length) {
                player.message("§c[Admin] Select a listing first")
                return
            }
            var lid = ids[idx]
            if (bid === C.BTN_ADM_REMOVE) {
                openConfirmGui(e, "§cAdmin Remove", "§fRemove listing? §c(No refund to host. Pending requests auto-rejected)", "admin_remove", { listingId: lid })
            } else {
                openConfirmGui(e, "§eAdmin Refund", "§fRefund listing? §7(Key + fee returned to host's claims. Requests auto-rejected)", "admin_refund", { listingId: lid })
            }
        }
        return
    }

    // ---- CONFIRM DIALOG ----
    if (gid === GUIS.CONFIRM) {
        var conf = playerConfirmAction[pn]
        if (bid === C.BTN_NO) {
            delete playerConfirmAction[pn]
            openMainMenu(e)
            return
        }
        if (bid === C.BTN_YES && conf) {
            delete playerConfirmAction[pn]
            if (conf.action === "create_listing") {
                doCreateListing(e, conf.data.price, conf.data.days)
            } else if (conf.action === "request_apartment") {
                doRequestApartment(e, conf.data.listingId)
            } else if (conf.action === "accept_request") {
                doAcceptRequest(e, conf.data.requestId)
            } else if (conf.action === "reject_request") {
                doRejectRequest(e, conf.data.requestId)
            } else if (conf.action === "cancel_request") {
                doCancelRequest(e, conf.data.requestId)
            } else if (conf.action === "cancel_listing") {
                doCancelListing(e, conf.data.listingId)
            } else if (conf.action === "admin_remove") {
                doAdminRemove(e, conf.data.listingId)
            } else if (conf.action === "admin_refund") {
                doAdminRefund(e, conf.data.listingId)
            }
        }
        return
    }
}

function customGuiScroll(e) {
    var idx = e.scrollIndex
    var gid = e.gui.getID()

    if (gid === GUIS.BROWSER && e.scrollId === C.SCROLL) {
        openBrowserGui(e, idx)
    } else if (gid === GUIS.MY_LIST && e.scrollId === C.SCROLL) {
        openMyListingsGui(e, idx)
    } else if (gid === GUIS.REQ_MGR && e.scrollId === C.SCROLL) {
        var listingId = playerReqMgrListingId[e.player.getName()]
        if (listingId) openRequestsManagerGui(e, listingId, idx)
    } else if (gid === GUIS.MY_REQS && e.scrollId === C.SCROLL) {
        openMyRequestsGui(e, idx)
    } else if (gid === GUIS.ADMIN && e.scrollId === C.SCROLL) {
        openAdminGui(e, idx)
    }
}

function customGuiClosed(e) {
    // Optional: cleanup player state on GUI close
    // State is lightweight so we leave it for re-use
}