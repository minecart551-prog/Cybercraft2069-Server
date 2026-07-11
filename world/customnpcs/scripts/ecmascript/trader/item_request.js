var SYS = Java.type("java.lang.System")
var NpcAPI_Class = Java.type("noppes.npcs.api.NpcAPI")

// ============================================================================
// CONFIGURATION — Adjust these values to tune the system
// ============================================================================
var MIN_PRICE = 1        // Minimum total price in cents (0.01$ = 1¢)
var MAX_PRICE = 10000000 // Maximum total price in cents (100000.00$)
var MIN_AMOUNT = 1        // Minimum amount wanted per request
var MAX_AMOUNT = 6400     // Maximum amount wanted per request (100 stacks)
var MAX_REQUESTS = 10    // Max concurrent active requests per player
var MAX_NOTE_LEN = 48     // Max characters kept from the note field
var ADMIN_ITEM = "minecraft:bedrock"
var CUR_SYMBOL = "$"
var DATA_KEY = "REQUEST_BOARD_DATA"
// Coin conversion: stone_coin = 1¢, coal_coin = 100¢ = $1, emerald_coin = 10000¢ = $100
var STONE_TO_COAL = 100
var COAL_TO_EMERALD = 100
var COIN_STONE = "coins:stone_coin"
var COIN_COAL = "coins:coal_coin"
var COIN_EMERALD = "coins:emerald_coin"
// Price input: "4.03" means $4.03 = 403¢ = 4 coal + 3 stone
// All internal amounts are stored in cents (¢)
// Item matching is by item id string ONLY (e.g. "minecraft:dirt") — NBT,
// enchants, and durability are ignored on both sides of the trade.

// ============================================================================
// GUI IDS
// ============================================================================
var GUIS = {
    MAIN: 7000,
    POST: 7001,
    BROWSE: 7002,
    CLAIM: 7004,
    ADMIN: 7005,
    CONFIRM: 7006,
    MY_REQS: 7007
}

// ============================================================================
// COMPONENT IDS
// ============================================================================
var C = {
    // Backgrounds & decorative layers
    BG_OUTER: 1, BG_INNER: 2, BG_TITLE_BAR: 3,
    BG_CONTENT: 4, BG_FOOTER: 5, BG_ACCENT_TOP: 6,
    BG_ACCENT_BOT: 7, BG_PANEL_L: 8, BG_PANEL_R: 9,
    BG_DIVIDER: 10, BG_ITEM_FRAME: 11,
    BG_SECTION1: 13, BG_SECTION2: 14,
    BG_STRIPE1: 16, BG_STRIPE2: 17,
    // Labels
    LBL_TITLE: 20, LBL_SUBTITLE: 21, LBL_INFO: 22,
    LBL_PAYOUT: 24, LBL_STATS: 25,
    LBL_D1: 26, LBL_D2: 27, LBL_D3: 28, LBL_D4: 29,
    LBL_HINT: 30, LBL_PRICE: 31,
    LBL_RETURNS: 33, LBL_FOOTER: 34, LBL_BALANCE: 35,
    LBL_ICON1: 36, LBL_ICON2: 37, LBL_ICON3: 38,
    LBL_ICON4: 39, LBL_D5: 40, LBL_D6: 41,
    LBL_SEC_TITLE: 42, LBL_SEC_TITLE2: 43, LBL_TOTAL_HINT: 53,
    // Preview panel labels
    LBL_PV_NAME: 44, LBL_PV_PRICE: 45, LBL_PV_REQUESTER: 46,
    LBL_PV_HINT: 48, LBL_PV_PROGRESS: 49,
    LBL_PV_NOTE: 50, LBL_PV_STATUS: 51, LBL_PV_HELD: 52,
    // Text fields
    TF_PRICE: 60, TF_ITEMID: 62,
    TF_AMOUNT: 63, TF_NOTE: 64, TF_FULFILL_AMOUNT: 65,
    // Scroll
    SCROLL: 80,
    // Buttons
    BTN_BROWSE: 100, BTN_POST: 101, BTN_CLAIM: 102,
    BTN_ADMIN: 103, BTN_CLOSE: 104, BTN_BACK: 105,
    BTN_SUBMIT_POST: 106, BTN_FULFILL: 107,
    BTN_CLAIM_EM: 109, BTN_CLAIM_ITEMS: 110,
    BTN_ADM_REMOVE: 111, BTN_ADM_REFUND: 112,
    BTN_YES: 113, BTN_NO: 114,
    BTN_REFRESH: 117, BTN_SORT: 118,
    BTN_MY_REQS: 120, BTN_CANCEL_REQ: 124,
    // Item display
    ITEM_PREVIEW: 150
}

// ============================================================================
// THEME — Texture palette (used only for the Main Menu background)
// ============================================================================
var TEX = {
    OUTER:     "minecraft:textures/block/deepslate_tiles.png",
    INNER:     "minecraft:textures/block/gray_concrete.png",
    TITLE_BAR: "minecraft:textures/block/dark_oak_planks.png",
    CONTENT:   "minecraft:textures/block/black_concrete.png",
    SECTION:   "minecraft:textures/block/smooth_stone.png",
    GOLD:      "minecraft:textures/block/gold_block.png",
    FOOTER:    "minecraft:textures/block/dark_oak_planks.png"
}

var SKIN = {
    MAIN: {
        outer: "minecraft:textures/block/deepslate_tiles.png",
        inner: "minecraft:textures/block/gray_concrete.png",
        titleBar: "minecraft:textures/block/dark_oak_planks.png",
        content: "minecraft:textures/block/spruce_planks.png",
        footer: "minecraft:textures/block/dark_oak_planks.png",
        accent: "minecraft:textures/block/gold_block.png",
        trim: "minecraft:textures/block/stripped_spruce_log.png",
        sectionA: "minecraft:textures/block/stripped_spruce_log.png",
        sectionB: "minecraft:textures/block/stripped_dark_oak_log.png"
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
var playerMyReqsIdx = {}
var playerMyReqsIds = {}
var playerConfirmAction = {}
var playerSortMode = {}

// ============================================================================
// SORT MODES (used for Browse and Admin lists)
// ============================================================================
var SORT_MODES = [
    { key: "price_asc",  label: "▲ Price/ea Low" },
    { key: "price_desc", label: "▼ Price/ea High" },
    { key: "name_asc",   label: "▲ Item A-Z" },
    { key: "name_desc",  label: "▼ Item Z-A" }
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

function sortRequests(requests, sortIdx, world) {
    var mode = SORT_MODES[sortIdx].key
    var sorted = requests.slice()
    sorted.sort(function(a, b) {
        if (mode === "price_asc") return pricePerUnit(a) - pricePerUnit(b)
        if (mode === "price_desc") return pricePerUnit(b) - pricePerUnit(a)
        if (mode === "name_asc" || mode === "name_desc") {
            var nA = getItemIdLabel(a.itemId, world).toLowerCase()
            var nB = getItemIdLabel(b.itemId, world).toLowerCase()
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
    return { requests: [], payouts: {}, returns: {} }
}

function sanitizeData(d) {
    if (!d) return emptyData()
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
// ITEM ID HELPERS — matching is by item id string only
// ============================================================================
function createItemSafe(itemId, count, world) {
    try {
        var item = world.createItem(itemId, count)
        if (!item || item.isEmpty()) return null
        return item
    } catch (e) {
        return null
    }
}

function getItemIdLabel(itemId, world) {
    var item = createItemSafe(itemId, 1, world)
    if (!item) return "§c[Unknown: " + itemId + "]"
    return "" + item.getDisplayName()
}

function addItemDisplay(gui, compId, x, y, item) {
    if (!item) return
    try {
        gui.addItemRenderer(compId, x, y, 18, 18, item)
    } catch (ex) {
        var fallbackId = compId + 1000
        gui.addLabel(fallbackId, "§e▣", x + 2, y + 2, 16, 16)
    }
}

// ============================================================================
// GENERIC INVENTORY ITEM HELPERS (item-id based, ignores NBT)
// ============================================================================
function countPlayerItem(player, itemId) {
    var total = 0
    var inv = player.getInventory()
    for (var i = 0; i < inv.getSize(); i++) {
        var stack = inv.getSlot(i)
        if (stack && !stack.isEmpty() && stack.getName() === itemId) {
            total += stack.getStackSize()
        }
    }
    return total
}

function removePlayerItem(player, itemId, amount) {
    var remaining = amount
    var inv = player.getInventory()
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i)
        if (stack && !stack.isEmpty() && stack.getName() === itemId) {
            var sz = stack.getStackSize()
            if (sz <= remaining) {
                inv.setSlot(i, null)
                remaining -= sz
            } else {
                stack.setStackSize(sz - remaining)
                remaining = 0
            }
        }
    }
    player.updatePlayerInventory()
    return remaining <= 0
}

function giveItemAmount(player, itemId, amount, world) {
    var remaining = amount
    while (remaining > 0) {
        var give = Math.min(remaining, 64)
        var stack = createItemSafe(itemId, give, world)
        if (!stack) return false
        if (!player.giveItem(stack)) player.dropItem(stack)
        remaining -= give
    }
    player.updatePlayerInventory()
    return true
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

function isAdmin(player) {
    if (player.getGamemode() !== 1) return false
    if (!player.isSneaking()) return false
    var held = player.getMainhandItem()
    if (!held || held.isEmpty()) return false
    return held.getName() === ADMIN_ITEM
}

// Returns true only when the player's main hand (and off hand, if the API
// exposes one) is completely empty.
function isBarehand(player) {
    var main = player.getMainhandItem()
    if (main && !main.isEmpty()) return false
    try {
        var off = player.getOffhandItem()
        if (off && !off.isEmpty()) return false
    } catch (e) {
        // Offhand API not available on this version — ignore.
    }
    return true
}

function findRequest(data, id) {
    for (var i = 0; i < data.requests.length; i++) {
        if (data.requests[i].id === id) return data.requests[i]
    }
    return null
}

function removeRequestById(data, id) {
    for (var i = 0; i < data.requests.length; i++) {
        if (data.requests[i].id === id) {
            data.requests.splice(i, 1)
            return true
        }
    }
    return false
}

function pricePerUnit(req) {
    if (!req.amountWanted) return 0
    return Math.round(req.totalPrice / req.amountWanted)
}

// ============================================================================
// REQUEST QUERY HELPERS
// ============================================================================
function getActiveRequests(data) {
    var result = []
    for (var i = 0; i < data.requests.length; i++) {
        var r = data.requests[i]
        if (r.status === "active" && r.amountRemaining > 0) {
            result.push(r)
        }
    }
    return result
}

function getPlayerRequests(data, uuid) {
    var result = []
    for (var i = 0; i < data.requests.length; i++) {
        if (data.requests[i].requesterUuid === uuid) result.push(data.requests[i])
    }

    return result
}

function countPlayerActiveRequests(data, uuid) {
    var count = 0
    for (var i = 0; i < data.requests.length; i++) {
        var r = data.requests[i]
        if (r.requesterUuid === uuid && r.status === "active") count++
    }
    return count
}

// ============================================================================
// AUTO-PAYOUT — Currency owed is paid directly the moment it's earned.
// The only case money sits in a queue is when it was refunded/paid to a
// player who wasn't online at the time (admin refund, expiry). This flushes
// that queue straight into the player's inventory as soon as they interact
// with the NPC, so there is no separate "Claim Earnings" screen anymore.
// ============================================================================
function autoFlushPayouts(player, npc) {
    if (!npc) return
    var data = loadData(npc)
    var uuid = player.getUUID()
    var owed = data.payouts[uuid] || 0
    if (owed > 0) {
        giveCoins(player, owed)
        delete data.payouts[uuid]
        saveData(npc, data)
        player.message("§a[Requests] Auto-collected " + formatPrice(owed) + " §afrom a processed request!")
    }
}

// ============================================================================
// GUI LAYOUT SYSTEM — Frame/title helper
// ============================================================================
// If a skin is passed, a textured background frame is drawn (currently only
// used by the Main Menu). Without a skin, this just adds the title label.
function buildFrame(gui, w, h, titleText, skin) {
    if (skin) {
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
    }
    gui.addLabel(C.LBL_TITLE, titleText, 10, 10, w - 20, 16)
}

function buildSection(gui, id, x, y, w, h, texture) {
    gui.addTexturedRect(id, texture || TEX.SECTION, x, y, w, h)
}

function buildDivider(gui, id, x, y, w, texture) {
    gui.addTexturedRect(id, texture || TEX.OUTER, x, y, w, 1)
}

// ============================================================================
// MAIN MENU — Request Board lobby
// ============================================================================
function openMainMenu(event) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)

    var w = 300
    var h = 255
    var gui = api.createCustomGui(GUIS.MAIN, w, h, false, player)
    buildFrame(gui, w, h, "§6§l\u2726 Item Request Board \u2726", SKIN.MAIN)

    var bal = 0
    var openCount = 0
    var myCount = 0
    if (npc) {
        autoFlushPayouts(player, npc)
        var data = loadData(npc)
        bal = countPlayerCoins(player)
        openCount = getActiveRequests(data).length
        myCount = countPlayerActiveRequests(data, player.getUUID())
    }

    gui.addLabel(C.LBL_SUBTITLE, "§7Post bounties, fulfill requests, get paid", 12, 34, w - 24, 10)

    // Left board: market info
    buildSection(gui, C.BG_SECTION1, 12, 44, 126, 160, SKIN.MAIN.sectionA)
    gui.addLabel(C.LBL_SEC_TITLE, "§6§lMarket Board", 18, 50, 114, 10)
    buildDivider(gui, C.BG_DIVIDER, 18, 62, 114, SKIN.MAIN.trim)
    gui.addLabel(C.LBL_BALANCE, "§7Wallet Balance", 18, 70, 100, 10)
    gui.addLabel(C.LBL_D1, "§a§l" + formatPrice(bal), 18, 82, 114, 10)
    gui.addLabel(C.LBL_D2, "§7Open requests", 18, 102, 100, 10)
    gui.addLabel(C.LBL_D3, "§f" + openCount + " §8active", 18, 114, 110, 10)
    gui.addLabel(C.LBL_D4, "§7Your requests", 18, 134, 100, 10)
    gui.addLabel(C.LBL_D5, "§f" + myCount + "§8/" + MAX_REQUESTS, 18, 146, 110, 10)

    // Right board: service counter
    buildSection(gui, C.BG_SECTION2, 146, 44, 142, 160, SKIN.MAIN.sectionB)
    gui.addLabel(C.LBL_SEC_TITLE2, "§e§lService Counter", 152, 50, 130, 10)
    buildDivider(gui, C.BG_STRIPE2, 152, 62, 130, SKIN.MAIN.trim)

    gui.addButton(C.BTN_BROWSE, "§f\u25B6 Browse Requests", 156, 70, 122, 18)
    gui.addButton(C.BTN_POST, "§f\u25B2 Post a Request", 156, 94, 122, 18)
    gui.addButton(C.BTN_MY_REQS, "§f\u25A0 My Requests", 156, 118, 122, 18)
    gui.addButton(C.BTN_CLAIM, "§f\u25C6 Claim Items", 156, 142, 122, 18)


    gui.addButton(C.BTN_CLOSE, "§7Close", Math.floor((w - 68) / 2), h - 16, 68, 14)
    player.showCustomGui(gui)
}

// ============================================================================
// POST REQUEST GUI — Form to create a new bounty
// ============================================================================
function openPostGui(event) {
    var player = event.player
    var api = event.API
    var w = 360
    var h = 260
    var gui = api.createCustomGui(GUIS.POST, w, h, false, player)
    buildFrame(gui, w, h, "§6§l\u25B2 Post a Request")

    gui.addLabel(C.LBL_SUBTITLE, "§7Describe what you want, deposit the pay, wait for a fulfiller", 12, 34, w - 24, 10)

    // --- Left panel: how it works ---
    gui.addLabel(C.LBL_SEC_TITLE, "§6§lHow It Works", 18, 50, 120, 10)
    gui.addLabel(C.LBL_HINT, "§71. Type the item id", 18, 72, 120, 20)
    gui.addLabel(C.LBL_ICON1, "§7   e.g. minecraft:dirt", 18, 84, 120, 10)
    gui.addLabel(C.LBL_ICON2, "§72. Set amount + $/ea", 18, 100, 120, 10)
    gui.addLabel(C.LBL_ICON3, "§73. Total is escrowed now", 18, 116, 120, 10)
    gui.addLabel(C.LBL_ICON4, "§74. Fulfillers turn in", 18, 132, 120, 10)
    gui.addLabel(C.LBL_D6, "§7   items for pay", 18, 144, 120, 10)
    gui.addLabel(C.LBL_D5, "§7Partial fills allowed", 18, 160, 120, 10)


    var bal = countPlayerCoins(player)
    gui.addLabel(C.LBL_BALANCE, "§7Wallet: §a" + formatPrice(bal), 18, 196, 118, 10)

    // --- Right panel: form fields ---
    gui.addLabel(C.LBL_SEC_TITLE2, "§e§lRequest Desk", 158, 50, 170, 10)

    gui.addLabel(C.LBL_D1, "§fItem ID", 158, 70, 100, 10)
    gui.addTextField(C.TF_ITEMID, 158, 82, w - 178, 16).setText("minecraft:dirt")

    gui.addLabel(C.LBL_D2, "§fAmount Wanted", 158, 102, 100, 10)
    gui.addTextField(C.TF_AMOUNT, 158, 114, 80, 16).setText("64")

    gui.addLabel(C.LBL_PRICE, "§fPrice/ea §7(" + CUR_SYMBOL + ")", 246, 102, 100, 10)
    gui.addTextField(C.TF_PRICE, 246, 114, w - 266, 16).setText("0.02")

    gui.addLabel(C.LBL_D3, "§fNote §7(optional)", 158, 136, 150, 10)
    gui.addTextField(C.TF_NOTE, 158, 148, w - 178, 16).setText("")

    gui.addLabel(C.LBL_TOTAL_HINT, "§8Total pay is calculated (amount \u00D7 price/ea) and shown before you confirm.", 158, 172, w - 178, 20)


    gui.addButton(C.BTN_SUBMIT_POST, "§a§l\u2714 Post Request", 12, h - 30, 150, 18)
    gui.addButton(C.BTN_BACK, "§7\u25C0 Back", w - 82, h - 30, 70, 18)
    player.showCustomGui(gui)
}

// ============================================================================
// PREVIEW PANEL BUILDER — Adds request details to a fresh GUI (no mutation)
// ============================================================================
function addPreviewToGui(gui, pvX, pvW, req, world, showRequester) {
    var item = createItemSafe(req.itemId, 1, world)
    if (item) {
        var frameX = pvX + Math.floor((pvW - 28) / 2)
        addItemDisplay(gui, C.ITEM_PREVIEW, frameX + 5, 63, item)
    }

    var y = 92
    gui.addLabel(C.LBL_PV_NAME, "§f§l" + getItemIdLabel(req.itemId, world), pvX + 4, y, pvW - 8, 10)
    y += 14
    gui.addLabel(C.LBL_PV_PROGRESS, "§7Needed: §f" + req.amountRemaining + "§7/" + req.amountWanted, pvX + 4, y, pvW - 8, 10)
    y += 12
    gui.addLabel(C.LBL_PV_PRICE, "§7Pay/ea: " + formatPrice(pricePerUnit(req)) + " §7| Total: " + formatPrice(req.totalPrice), pvX + 4, y, pvW - 8, 10)
    y += 12
    if (showRequester) {
        gui.addLabel(C.LBL_PV_REQUESTER, "§7From: §f" + req.requesterName, pvX + 4, y, pvW - 8, 10)
        y += 12
    }
    if (req.note) {
        gui.addLabel(C.LBL_PV_NOTE, "§7Note: §o" + req.note, pvX + 4, y, pvW - 8, 10)
        y += 12
    }
    return y + 2
}

// ============================================================================
// BROWSE GUI — Scroll + live preview + inline fulfillment
// ============================================================================
function openBrowseGui(event, selectedIdx) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Requests] NPC not found"); return }

    var data = loadData(npc)
    var active = getActiveRequests(data)
    active = sortRequests(active, getSortMode(player.getName()), world)

    var w = 470
    var h = 320
    var gui = api.createCustomGui(GUIS.BROWSE, w, h, false, player)

    gui.addLabel(C.LBL_TITLE, "§6§l\u25B6 Browse Requests", 10, 6, w - 20, 16)
    gui.addLabel(C.LBL_SUBTITLE, "§7Open requests: §f" + active.length + " §8| §7Wallet: §a" + formatPrice(countPlayerCoins(player)), 12, 30, w - 24, 10)

    // Request list (left side)
    var scrollW = 250
    var lines = []
    var ids = []
    for (var i = 0; i < active.length; i++) {
        var r = active[i]
        var itemName = getItemIdLabel(r.itemId, world)
        lines.push(formatPrice(pricePerUnit(r)) + "/ea §r§8|§r " + itemName + " §r§8|§r " + r.amountRemaining + "/" + r.amountWanted)
        ids.push(r.id)
    }
    if (lines.length === 0) lines.push("§7\u2014 No open requests \u2014")

    var pn = player.getName()
    playerBrowseIds[pn] = ids
    if (selectedIdx === undefined || selectedIdx < 0) selectedIdx = -1
    playerBrowseIdx[pn] = selectedIdx

    gui.addLabel(C.LBL_SEC_TITLE, "§6§lOpen Bounties", 16, 44, scrollW - 12, 10)
    var scroll = gui.addScroll(C.SCROLL, 14, 56, scrollW - 8, h - 138, lines)
    if (selectedIdx >= 0 && selectedIdx < lines.length) scroll.setDefaultSelection(selectedIdx)

    // Preview + fulfill panel (right side)
    var pvX = scrollW + 16
    var pvW = w - pvX - 10
    gui.addLabel(C.LBL_SEC_TITLE2, "§b§lSelected Request", pvX + 6, 44, pvW - 12, 10)

    var selReq = null
    if (selectedIdx >= 0 && selectedIdx < ids.length) {
        selReq = findRequest(data, ids[selectedIdx])
    }

    if (selReq) {
        var yAfter = addPreviewToGui(gui, pvX, pvW, selReq, world, true)
        var held = countPlayerItem(player, selReq.itemId)
        var suggested = Math.max(1, Math.min(held, selReq.amountRemaining))
        gui.addLabel(C.LBL_PV_HELD, "§7You hold: §f" + held + " §7of this item", pvX + 6, yAfter, pvW - 12, 10)
        gui.addLabel(C.LBL_D6, "§fAmount to fulfill", pvX + 6, yAfter + 14, pvW - 12, 10)
        gui.addTextField(C.TF_FULFILL_AMOUNT, pvX + 6, yAfter + 26, pvW - 12, 16).setText("" + suggested)
    } else {
        gui.addLabel(C.LBL_PV_HINT, "§8Select a request entry", pvX + 6, 80, pvW - 12, 10)
        gui.addLabel(C.LBL_D6, "§8to inspect and fulfill", pvX + 6, 94, pvW - 12, 10)
    }

    // Action row
    gui.addButton(C.BTN_SORT, "§f\u2195 " + getSortLabel(player.getName()), 10, h - 66, 104, 18)
    gui.addButton(C.BTN_REFRESH, "§b\u21BB", 118, h - 66, 34, 18)
    gui.addButton(C.BTN_BACK, "§7\u25C0 Back", 156, h - 66, 76, 18)
    if (selReq) {
        gui.addButton(C.BTN_FULFILL, "§a§l\u2714 Fulfill", pvX, h - 66, pvW, 18)
    }

    gui.addLabel(C.LBL_FOOTER, "§8Have the item anywhere in your inventory, set an amount, and Fulfill.", 10, h - 30, w - 20, 10)
    gui.addButton(C.BTN_CLOSE, "§7Close", Math.floor((w - 68) / 2), h - 16, 68, 14)
    player.showCustomGui(gui)
}

// ============================================================================
// MY REQUESTS GUI — Requester views/cancels their own bounties
// ============================================================================
function openMyRequestsGui(event, selectedIdx) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Requests] NPC not found"); return }

    var data = loadData(npc)
    var mine = getPlayerRequests(data, player.getUUID())

    var w = 470
    var h = 300
    var gui = api.createCustomGui(GUIS.MY_REQS, w, h, false, player)

    gui.addLabel(C.LBL_TITLE, "§6§l\u25A0 My Requests", 10, 6, w - 20, 16)
    gui.addLabel(C.LBL_SUBTITLE, "§7Total: §f" + mine.length + "§7/" + MAX_REQUESTS + " active §8| §7Wallet: §a" + formatPrice(countPlayerCoins(player)), 12, 30, w - 24, 10)

    var scrollW = 250
    var lines = []
    var ids = []
    for (var i = 0; i < mine.length; i++) {
        var r = mine[i]
        var iName = getItemIdLabel(r.itemId, world)
        var statusLabel = r.status === "active" ? "§ePending" : r.status === "completed" ? "§aDone" : "§7Unknown"
        lines.push(statusLabel + " §r§8|§r " + iName + " §r§8|§r " + r.amountRemaining + "/" + r.amountWanted)
        ids.push(r.id)
    }
    if (lines.length === 0) lines.push("§7\u2014 You have no requests \u2014")

    var pn = player.getName()
    playerMyReqsIds[pn] = ids
    if (selectedIdx === undefined || selectedIdx < 0) selectedIdx = -1
    playerMyReqsIdx[pn] = selectedIdx

    gui.addLabel(C.LBL_SEC_TITLE, "§6§lRequest Log", 16, 44, scrollW - 12, 10)
    var scroll = gui.addScroll(C.SCROLL, 14, 56, scrollW - 8, h - 128, lines)
    if (selectedIdx >= 0 && selectedIdx < lines.length) scroll.setDefaultSelection(selectedIdx)

    var pvX = scrollW + 16
    var pvW = w - pvX - 10
    gui.addLabel(C.LBL_SEC_TITLE2, "§b§lRequest Details", pvX + 6, 44, pvW - 12, 10)

    var canCancel = false
    if (selectedIdx >= 0 && selectedIdx < ids.length) {
        var selReq = findRequest(data, ids[selectedIdx])
        if (selReq) {
            addPreviewToGui(gui, pvX, pvW, selReq, world, false)
            var statusColor = selReq.status === "active" ? "§e" : selReq.status === "completed" ? "§a" : "§7"
            gui.addLabel(C.LBL_PV_STATUS, "§7Status: " + statusColor + selReq.status, pvX + 6, 200, pvW - 12, 10)
            gui.addLabel(C.LBL_ICON1, "§7Escrow left: §a" + formatPrice(selReq.escrowRemaining), pvX + 6, 214, pvW - 12, 10)
            canCancel = selReq.status === "active"
        }
    } else {
        gui.addLabel(C.LBL_PV_HINT, "§8Select one of your requests", pvX + 6, 80, pvW - 12, 10)
    }

    if (canCancel) {
        gui.addButton(C.BTN_CANCEL_REQ, "§c\u2716 Cancel Request", pvX, h - 56, pvW, 18)
    }

    gui.addButton(C.BTN_REFRESH, "§b\u21BB", 10, h - 56, 34, 18)
    gui.addButton(C.BTN_CLAIM, "§e\u25C6 Claim Items", 48, h - 56, 130, 18)
    gui.addButton(C.BTN_BACK, "§7\u25C0 Back", 182, h - 56, 62, 18)

    gui.addLabel(C.LBL_FOOTER, "§8Cancelling refunds remaining escrow straight to your wallet.", 10, h - 26, w - 20, 10)
    player.showCustomGui(gui)
}

// ============================================================================
// CLAIM GUI — Item deliveries collection (currency now pays out directly,
// so this screen only handles items requesters are owed).
// ============================================================================
function openClaimGui(event) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Requests] NPC not found"); return }

    autoFlushPayouts(player, npc)
    var data = loadData(npc)
    var uuid = player.getUUID()
    var pendingItems = data.returns[uuid] || []
    var totalQty = 0
    for (var i = 0; i < pendingItems.length; i++) totalQty += pendingItems[i].amount

    var w = 300
    var h = 200
    var gui = api.createCustomGui(GUIS.CLAIM, w, h, false, player)
    buildFrame(gui, w, h, "§6§l\u25C6 Claim Items")

    gui.addLabel(C.LBL_SUBTITLE, "§8Collect items delivered to fulfill your requests", 12, 34, w - 24, 10)

    gui.addLabel(C.LBL_SEC_TITLE, "§b§lItems Counter", 18, 54, w - 36, 10)
    gui.addLabel(C.LBL_RETURNS, "§7Deliveries waiting", 18, 76, w - 36, 10)
    gui.addLabel(C.LBL_D3, totalQty > 0 ? "§f§l" + totalQty + " item(s)" : "§8None", 18, 90, w - 36, 12)

    if (totalQty > 0) {
        gui.addButton(C.BTN_CLAIM_ITEMS, "§a\u2714 Claim Items", 18, 130, w - 36, 18)
    } else {
        gui.addLabel(C.LBL_D4, "§7§oNothing to claim right now.", 18, 130, w - 36, 12)
    }

    gui.addButton(C.BTN_BACK, "§7\u25C0 Back", Math.floor((w - 74) / 2), h - 30, 74, 18)
    player.showCustomGui(gui)
}

// ============================================================================
// ADMIN GUI — Management panel
// ============================================================================
function openAdminGui(event, selectedIdx) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) return

    autoFlushPayouts(player, npc)
    var data = loadData(npc)

    var totalPayouts = 0
    var payKeys = Object.keys(data.payouts)
    for (var i = 0; i < payKeys.length; i++) totalPayouts += data.payouts[payKeys[i]]

    var totalReturnQty = 0
    var retKeys = Object.keys(data.returns)
    for (var i = 0; i < retKeys.length; i++) {
        var arr = data.returns[retKeys[i]]
        for (var j = 0; j < arr.length; j++) totalReturnQty += arr[j].amount
    }

    var w = 450
    var h = 310
    var gui = api.createCustomGui(GUIS.ADMIN, w, h, false, player)

    gui.addLabel(C.LBL_TITLE, "§c§l\u2620 Admin \u2014 Request Board Manager", 10, 6, w - 20, 16)

    gui.addLabel(C.LBL_STATS,
        "§7Requests: §f" + data.requests.length +
        " §8| §7Queued auto-payouts (offline players): §e" + totalPayouts + CUR_SYMBOL +
        " §8| §7Items pending: §f" + totalReturnQty,
        12, 30, w - 24, 10)

    var scrollW = 280
    var lines = []
    var ids = []
    for (var i = 0; i < data.requests.length; i++) {
        var r = data.requests[i]
        var iName = getItemIdLabel(r.itemId, world)
        var status = r.status
        var statusTag = status === "active" ? "§a\u25CF" : status === "completed" ? "§b\u25CF" : "§7\u25CF"
        lines.push(statusTag + " " + iName + " §r§8|§r " + formatPrice(r.totalPrice) + " §r§8|§r §7" + r.requesterName)
        ids.push(r.id)
    }
    if (lines.length === 0) lines.push("§7\u2014 No requests in database \u2014")

    var pn = player.getName()
    playerAdminIds[pn] = ids
    if (selectedIdx === undefined || selectedIdx < 0) selectedIdx = -1
    playerAdminIdx[pn] = selectedIdx

    var scroll = gui.addScroll(C.SCROLL, 10, 44, scrollW, h - 110, lines)
    if (selectedIdx >= 0 && selectedIdx < lines.length) scroll.setDefaultSelection(selectedIdx)

    var pvX = scrollW + 16
    var pvW = w - pvX - 10

    if (selectedIdx >= 0 && selectedIdx < ids.length) {
        var selReq = findRequest(data, ids[selectedIdx])
        if (selReq) addPreviewToGui(gui, pvX, pvW, selReq, world, true)
    } else {
        gui.addLabel(C.LBL_PV_HINT, "§8Select a request", pvX + 6, 70, pvW - 12, 10)
        gui.addLabel(C.LBL_D6, "§8to preview", pvX + 6, 84, pvW - 12, 10)
    }

    gui.addButton(C.BTN_SORT, "§f\u2195 " + getSortLabel(player.getName()), 10, h - 56, 100, 18)
    gui.addButton(C.BTN_ADM_REMOVE, "§c\u2716 Remove", 116, h - 56, 76, 18)
    gui.addButton(C.BTN_ADM_REFUND, "§e\u21A9 Refund", 198, h - 56, 72, 18)
    gui.addButton(C.BTN_REFRESH, "§b\u21BB", 276, h - 56, 30, 18)
    gui.addButton(C.BTN_BACK, "§7\u25C0 Back", w - 72, h - 56, 62, 18)

    gui.addLabel(C.LBL_FOOTER, "§8\u26A0 Remove = no refund. Refund = escrow paid to requester (instantly if online, else queued).", 10, h - 30, w - 20, 10)
    player.showCustomGui(gui)
}

// ============================================================================
// CONFIRM DIALOG — Centered modal
// ============================================================================
function openConfirmGui(event, title, message, action, actionData) {
    var player = event.player
    var api = event.API
    var pn = player.getName()
    playerConfirmAction[pn] = { action: action, data: actionData }

    var w = 290
    var h = 150
    var gui = api.createCustomGui(GUIS.CONFIRM, w, h, false, player)
    buildFrame(gui, w, h, title)

    gui.addLabel(C.LBL_INFO, message, 14, 38, w - 28, 52)

    var bw = 90
    var gap = 20
    var totalBtns = bw * 2 + gap
    var startX = Math.floor((w - totalBtns) / 2)

    gui.addButton(C.BTN_YES, "§a§l\u2714 Confirm", startX, h - 28, bw, 18)
    gui.addButton(C.BTN_NO, "§c§l\u2716 Cancel", startX + bw + gap, h - 28, bw, 18)
    player.showCustomGui(gui)
}

// ============================================================================
// CORE LOGIC — Create Request (Post a bounty)
// price is always the pre-computed TOTAL price in cents (amount x price/ea)
// ============================================================================
function doCreateRequest(event, itemId, amount, price, note) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Requests] Error: NPC not found"); return }

    itemId = ("" + itemId).trim()
    var testItem = createItemSafe(itemId, 1, world)
    if (!itemId || !testItem) {
        player.message("§c[Requests] Invalid item id: " + itemId)
        return
    }

    amount = parseInt(amount)
    if (isNaN(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
        player.message("§c[Requests] Amount must be " + MIN_AMOUNT + "-" + MAX_AMOUNT)
        return
    }

    price = parseInt(price)
    if (isNaN(price) || price < MIN_PRICE || price > MAX_PRICE) {
        player.message("§c[Requests] Total price must be 0.01-" + (MAX_PRICE / 100) + CUR_SYMBOL)
        return
    }

    note = ("" + (note || "")).trim()
    if (note.length > MAX_NOTE_LEN) note = note.substring(0, MAX_NOTE_LEN)

    var data = loadData(npc)
    if (countPlayerActiveRequests(data, player.getUUID()) >= MAX_REQUESTS) {
        player.message("§c[Requests] You already have " + MAX_REQUESTS + " active requests!")
        return
    }

    if (countPlayerCoins(player) < price) {
        player.message("§c[Requests] You need " + formatPrice(price) + " to post this request!")
        return
    }

    if (!removeCoins(player, price)) {
        player.message("§c[Requests] Failed to charge escrow")
        return
    }

    var req = {
        id: generateId(),
        requesterUuid: player.getUUID(),
        requesterName: player.getName(),
        itemId: itemId,
        amountWanted: amount,
        amountRemaining: amount,
        totalPrice: price,
        escrowRemaining: price,
        note: note,
        status: "active"
    }
    data.requests.push(req)
    saveData(npc, data)

    player.message("§a[Requests] Posted request for " + amount + "x " + getItemIdLabel(itemId, world) + " §a, paying " + formatPrice(price) + " §atotal")
    openMainMenu(event)
}

// ============================================================================
// CORE LOGIC — Fulfill Request (instant trade, currency paid immediately)
// ============================================================================
function doFulfillRequest(event, requestId, fulfillAmount) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Requests] Error: NPC not found"); return }

    var data = loadData(npc)
    var req = findRequest(data, requestId)
    if (!req || req.status !== "active") {
        player.message("§c[Requests] Request no longer available")
        openBrowseGui(event)
        return
    }


    fulfillAmount = parseInt(fulfillAmount)
    if (isNaN(fulfillAmount) || fulfillAmount <= 0) {
        player.message("§c[Requests] Enter a valid amount to fulfill")
        return
    }
    if (fulfillAmount > req.amountRemaining) {
        player.message("§c[Requests] Only " + req.amountRemaining + " still needed")
        return
    }

    var held = countPlayerItem(player, req.itemId)
    if (held < fulfillAmount) {
        player.message("§c[Requests] You only hold " + held + "x " + getItemIdLabel(req.itemId, world))
        return
    }

    // Compute payout: last chunk absorbs any rounding remainder
    var payout
    if (fulfillAmount >= req.amountRemaining) {
        payout = req.escrowRemaining
    } else {
        payout = Math.floor(req.escrowRemaining * fulfillAmount / req.amountRemaining)
    }

    if (!removePlayerItem(player, req.itemId, fulfillAmount)) {
        player.message("§c[Requests] Failed to take items from your inventory")
        return
    }

    // Re-load fresh data to reduce race window, re-find request
    data = loadData(npc)
    req = findRequest(data, requestId)
    if (!req || req.status !== "active") {
        // Rollback — give items back to fulfiller
        giveItemAmount(player, req ? req.itemId : "minecraft:air", fulfillAmount, world)
        player.message("§c[Requests] Request changed! Items returned.")
        openBrowseGui(event)
        return
    }

    // Deliver items to requester's claim queue (requester may be offline).
    // Tagged with requestId so a fully-claimed, fully-fulfilled request can
    // be auto-removed from "My Requests" once the requester collects it.
    if (!data.returns[req.requesterUuid]) data.returns[req.requesterUuid] = []
    data.returns[req.requesterUuid].push({ itemId: req.itemId, amount: fulfillAmount, requestId: req.id })

    req.amountRemaining -= fulfillAmount
    req.escrowRemaining -= payout
    if (req.amountRemaining <= 0) {
        req.status = "completed"
    }

    saveData(npc, data)

    // Pay the fulfiller directly — they're online right now completing the trade.
    giveCoins(player, payout)

    player.message("§a[Requests] Fulfilled " + fulfillAmount + "x " + getItemIdLabel(req.itemId, world) + " §afor " + formatPrice(payout) + " §a(paid instantly)")
    player.updatePlayerInventory()
    openBrowseGui(event)
}

// ============================================================================
// CORE LOGIC — Cancel Own Request (refund remaining escrow instantly)
// ============================================================================
function doCancelRequest(event, requestId) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) { player.message("§c[Requests] Error: NPC not found"); return }

    var data = loadData(npc)
    var req = findRequest(data, requestId)
    if (!req || req.status !== "active") {
        player.message("§c[Requests] Request no longer active")
        return
    }
    if (req.requesterUuid !== player.getUUID()) {
        player.message("§c[Requests] This is not your request!")
        return
    }

    var refunded = req.escrowRemaining

    // Cancelled requests are removed immediately instead of being kept
    // around with a "cancelled" status, so they don't pile up in the list.
    removeRequestById(data, requestId)

    saveData(npc, data)

    // Player is right here cancelling it — refund goes straight to their wallet.
    giveCoins(player, refunded)

    player.message("§e[Requests] Request cancelled. " + formatPrice(refunded) + " §erefunded to your wallet.")
    openMyRequestsGui(event)
}

// ============================================================================
// CORE LOGIC — Claim Delivered Items
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
        player.message("§7[Requests] No items to claim.")
        return
    }

    var claimedQty = 0
    var claimedRequestIds = {}
    for (var i = 0; i < items.length; i++) {
        var entry = items[i]
        if (giveItemAmount(player, entry.itemId, entry.amount, world)) {
            claimedQty += entry.amount
        }
        if (entry.requestId) claimedRequestIds[entry.requestId] = true
    }

    delete data.returns[uuid]

    // Any request that's fully fulfilled AND has now had all its delivered
    // items claimed is done — drop it so "My Requests" doesn't pile up.
    var removedCount = 0
    var rids = Object.keys(claimedRequestIds)
    for (var j = 0; j < rids.length; j++) {
        var r = findRequest(data, rids[j])
        if (r && r.status === "completed") {
            removeRequestById(data, rids[j])
            removedCount++
        }
    }

    saveData(npc, data)

    player.message("§a[Requests] Claimed §f" + claimedQty + " §aitem(s)!")
    if (removedCount > 0) {
        player.message("§7[Requests] " + removedCount + " completed request(s) cleared from your list.")
    }
    player.updatePlayerInventory()
    openClaimGui(event)
}

// ============================================================================
// CORE LOGIC — Admin: Force Remove (no refund)
// ============================================================================
function doAdminRemove(event, requestId) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) return

    var data = loadData(npc)
    removeRequestById(data, requestId)
    saveData(npc, data)

    player.message("§c[Admin] Request force-removed (no refund)")
    openAdminGui(event)
}

// ============================================================================
// CORE LOGIC — Admin: Refund + Remove
// Pays the requester instantly if they're currently online, otherwise queues
// the refund so it auto-pays the moment they next interact with the NPC.
// ============================================================================
function doAdminRefund(event, requestId) {
    var player = event.player
    var world = player.getWorld()
    var npc = getNpc(world)
    if (!npc) return

    var data = loadData(npc)
    var req = findRequest(data, requestId)
    if (!req) { player.message("§c[Admin] Request not found"); return }

    var refunded = req.escrowRemaining
    var requesterUuid = req.requesterUuid
    removeRequestById(data, requestId)
    saveData(npc, data)

    var targetPlayer = null
    try {
        targetPlayer = world.getEntity(requesterUuid)
    } catch (e) {
        targetPlayer = null
    }

    if (targetPlayer) {
        giveCoins(targetPlayer, refunded)
        player.message("§e[Admin] Request refunded. " + formatPrice(refunded) + " §epaid directly (requester online).")
    } else {
        var data2 = loadData(npc)
        if (!data2.payouts[requesterUuid]) data2.payouts[requesterUuid] = 0
        data2.payouts[requesterUuid] += refunded
        saveData(npc, data2)
        player.message("§e[Admin] Request refunded. " + formatPrice(refunded) + " §equeued — requester is offline, will auto-pay on next interaction.")
    }

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

    // Everyone else must be completely empty-handed to open the interface.
    if (!isBarehand(e.player)) {
        var held = e.player.getMainhandItem()
        var heldName = (held && !held.isEmpty()) ? held.getName() : "an item"
        e.player.message("§fYou're holding §a" + heldName + "§f, use barehand to open interface")
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
        if (bid === C.BTN_BROWSE) openBrowseGui(e)
        else if (bid === C.BTN_POST) openPostGui(e)
        else if (bid === C.BTN_MY_REQS) openMyRequestsGui(e)
        else if (bid === C.BTN_CLAIM) openClaimGui(e)
        else if (bid === C.BTN_ADMIN) openAdminGui(e)
        else if (bid === C.BTN_CLOSE) player.closeGui()
        return
    }

    // ---- POST REQUEST GUI ----
    if (gid === GUIS.POST) {
        if (bid === C.BTN_BACK) { openMainMenu(e); return }
        if (bid === C.BTN_SUBMIT_POST) {
            var itemComp = gui.getComponent(C.TF_ITEMID)
            var amountComp = gui.getComponent(C.TF_AMOUNT)
            var priceComp = gui.getComponent(C.TF_PRICE)
            var noteComp = gui.getComponent(C.TF_NOTE)

            var itemId = itemComp ? itemComp.getText() : ""
            var amountStr = amountComp ? amountComp.getText() : "0"
            var priceEaStr = priceComp ? priceComp.getText() : "0"
            var note = noteComp ? noteComp.getText() : ""

            var world = player.getWorld()
            itemId = ("" + itemId).trim()
            var testItem = createItemSafe(itemId, 1, world)
            if (!itemId || !testItem) {
                player.message("§c[Requests] Invalid item id: " + itemId)
                return
            }

            var amount = parseInt(amountStr)
            if (isNaN(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
                player.message("§c[Requests] Amount must be " + MIN_AMOUNT + "-" + MAX_AMOUNT)
                return
            }

            var pricePerItem = parsePriceInput(priceEaStr)
            if (isNaN(pricePerItem) || pricePerItem <= 0) {
                player.message("§c[Requests] Enter a valid price per item (e.g. 0.02)")
                return
            }

            // Total is calculated from amount x price/ea
            var totalPrice = pricePerItem * amount
            if (totalPrice < MIN_PRICE || totalPrice > MAX_PRICE) {
                player.message("§c[Requests] Total pay (" + formatPrice(totalPrice) + "§c) must be between " + formatPrice(MIN_PRICE) + " §cand " + formatPrice(MAX_PRICE))
                return
            }

            var label = amount + "x " + getItemIdLabel(itemId, world)

            openConfirmGui(e,
                "§eConfirm Request",
                "§fPost request for §b" + label + "§f?\n§7" + formatPrice(pricePerItem) + "§7/ea \u00D7 " + amount + " = §f" + formatPrice(totalPrice) + " §7total\n§f(escrowed immediately, no fee)",
                "create_request",
                { itemId: itemId, amount: amount, price: totalPrice, note: note }
            )
        }
        return
    }

    // ---- BROWSE GUI ----
    if (gid === GUIS.BROWSE) {
        if (bid === C.BTN_BACK) { openMainMenu(e); return }
        if (bid === C.BTN_REFRESH) { openBrowseGui(e); return }
        if (bid === C.BTN_SORT) { nextSortMode(pn); openBrowseGui(e); return }
        if (bid === C.BTN_FULFILL) {
            var idx = playerBrowseIdx[pn]
            var ids = playerBrowseIds[pn]
            if (idx === undefined || idx < 0 || !ids || idx >= ids.length) {
                player.message("§c[Requests] Select a request first")
                return
            }
            var rid = ids[idx]
            var world = player.getWorld()
            var npc = getNpc(world)
            if (!npc) return
            var data = loadData(npc)
            var req = findRequest(data, rid)
            if (!req) { player.message("§c[Requests] Request not found"); return }

            var amountComp = gui.getComponent(C.TF_FULFILL_AMOUNT)
            var amountStr = amountComp ? amountComp.getText() : "0"
            var fulfillAmount = parseInt(amountStr)
            if (isNaN(fulfillAmount) || fulfillAmount <= 0) {
                player.message("§c[Requests] Enter a valid amount to fulfill")
                return
            }
            if (fulfillAmount > req.amountRemaining) {
                player.message("§c[Requests] Only " + req.amountRemaining + " still needed")
                return
            }
            var held = countPlayerItem(player, req.itemId)
            if (held < fulfillAmount) {
                player.message("§c[Requests] You only hold " + held + "x " + getItemIdLabel(req.itemId, world))
                return
            }

            var payoutPreview
            if (fulfillAmount >= req.amountRemaining) {
                payoutPreview = req.escrowRemaining
            } else {
                payoutPreview = Math.floor(req.escrowRemaining * fulfillAmount / req.amountRemaining)
            }

            openConfirmGui(e,
                "§eConfirm Fulfill",
                "§fTurn in §b" + fulfillAmount + "x " + getItemIdLabel(req.itemId, world) + "§f for " + formatPrice(payoutPreview) + "§f?",
                "fulfill_request",
                { requestId: rid, fulfillAmount: fulfillAmount }
            )
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
                player.message("§c[Requests] Select a request first")
                return
            }
            openConfirmGui(e,
                "§eCancel Request?",
                "§fCancel this request? §7(Remaining escrow will be refunded to your wallet instantly)",
                "cancel_request",
                { requestId: ids[idx] }
            )
        }
        return
    }

    // ---- CLAIM GUI ----
    if (gid === GUIS.CLAIM) {
        if (bid === C.BTN_BACK) { openMainMenu(e); return }
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
                player.message("§c[Admin] Select a request first")
                return
            }
            var rid = ids[idx]
            if (bid === C.BTN_ADM_REMOVE) {
                openConfirmGui(e, "§cAdmin Remove", "§fRemove request? §c(No refund to requester)", "admin_remove", { requestId: rid })
            } else {
                openConfirmGui(e, "§eAdmin Refund", "§fRefund request? §7(Paid to requester instantly if online, else queued)", "admin_refund", { requestId: rid })
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
            if (conf.action === "create_request") {
                doCreateRequest(e, conf.data.itemId, conf.data.amount, conf.data.price, conf.data.note)
            } else if (conf.action === "fulfill_request") {
                doFulfillRequest(e, conf.data.requestId, conf.data.fulfillAmount)
            } else if (conf.action === "cancel_request") {
                doCancelRequest(e, conf.data.requestId)
            } else if (conf.action === "admin_remove") {
                doAdminRemove(e, conf.data.requestId)
            } else if (conf.action === "admin_refund") {
                doAdminRefund(e, conf.data.requestId)
            }
        }
        return
    }
}

function customGuiScroll(e) {
    var idx = e.scrollIndex
    var gid = e.gui.getID()

    if (gid === GUIS.BROWSE && e.scrollId === C.SCROLL) {
        openBrowseGui(e, idx)
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
