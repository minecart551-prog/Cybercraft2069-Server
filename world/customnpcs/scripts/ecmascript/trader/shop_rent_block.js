// ============================================================================
// SHOP RENT BLOCK - Display only: owned / expired / taken-over shops
// ============================================================================
// Script Type: BlockEvent
// Target: CustomNPCs 1.20.1
// Style: ES5 | No Semicolons
//
// Shows three lists for the interacting player:
//   1. Owned  - NPCs currently rented by this player (active)
//   2. Expired - NPCs this player rented that expired (no new renter)
//   3. Taken over - NPCs this player owned but another player now rents
//
// Expired and taken-over entries are kept for 10 days from when the
// rental ended, then removed from world data to free space.
// Nothing else - no claims, no employees, no workplaces.
// ============================================================================

var SYS = Java.type("java.lang.System")

// GUI IDs
var GUI_MAIN = 3000

// Component IDs
var ID_SCROLL_SHOPS = 10
var ID_BTN_REFRESH = 22
var ID_BTN_CLOSE = 23
var ID_LBL_OWNED = 30
var ID_LBL_EXPIRED = 31
var ID_LBL_TAKEN = 32

// Retention: expired / taken-over entries live 10 days after rental end
var RETENTION_DAYS = 10
var RETENTION_MS = RETENTION_DAYS * 86400000

// State
var currentShopList = []

// ============================================================================
// WORLD DATA (shared with shop_rent.js / shop_rent_auction.js)
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
        wd.playerShops[playerUUID] = { ownedShops: [], expiredShops: [] }
        saveWorldData(world, wd)
    }
    var pd = wd.playerShops[playerUUID]
    if (!pd.ownedShops) pd.ownedShops = []
    if (!pd.expiredShops) pd.expiredShops = []
    return pd
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

// ============================================================================
// CLEANUP - 10-day retention for expired / taken-over entries
// ============================================================================
// Normalizes world data on open:
//   - ownedShops entries with a past expiry are stale: moved to expiredShops
//     (or removed if already older than 10 days)
//   - expiredShops entries older than 10 days (from expiryDate) are removed
// Returns true if data changed.
function cleanupStaleEntries(pd) {
    var now = SYS.currentTimeMillis()
    var changed = false

    // Pass 1: drop expired entries past retention
    for (var i = pd.expiredShops.length - 1; i >= 0; i--) {
        var e = pd.expiredShops[i]
        if (!e.expiryDate || now > e.expiryDate + RETENTION_MS) {
            pd.expiredShops.splice(i, 1)
            changed = true
        } else if (e.expiryDate > now) {
            // Legacy/future expiry in expired list - clock starts now
            e.expiryDate = now
            changed = true
        }
    }

    // Pass 2: stale owned entries (rental ended but never moved)
    for (var j = pd.ownedShops.length - 1; j >= 0; j--) {
        var s = pd.ownedShops[j]
        if (!s.expiryDate || s.expiryDate > now) continue

        if (now > s.expiryDate + RETENTION_MS) {
            pd.ownedShops.splice(j, 1)
            changed = true
            continue
        }

        // Move into expired list (dedupe by npcUUID)
        pd.ownedShops.splice(j, 1)
        for (var k = pd.expiredShops.length - 1; k >= 0; k--) {
            if (pd.expiredShops[k].npcUUID === s.npcUUID) {
                pd.expiredShops.splice(k, 1)
            }
        }
        pd.expiredShops.push(s)
        changed = true
    }

    return changed
}

// ============================================================================
// LIST BUILDING
// ============================================================================
function isOwnedByOtherPlayer(world, npcUUID, playerUUID) {
    var now = SYS.currentTimeMillis()
    var wd = getWorldData(world)
    if (!wd.playerShops) return false
    for (var ownerUUID in wd.playerShops) {
        if (!wd.playerShops.hasOwnProperty(ownerUUID)) continue
        if (ownerUUID === playerUUID) continue
        var otherPd = wd.playerShops[ownerUUID]
        if (!otherPd.ownedShops) continue
        for (var i = 0; i < otherPd.ownedShops.length; i++) {
            var o = otherPd.ownedShops[i]
            if (o.npcUUID === npcUUID && o.expiryDate > now) return true
        }
    }
    return false
}

function buildShopList(world, pd, playerUUID) {
    var list = []
    var now = SYS.currentTimeMillis()

    // 1) Currently owned (active rental)
    for (var i = 0; i < pd.ownedShops.length; i++) {
        var shop = pd.ownedShops[i]
        if (shop.expiryDate > now) {
            list.push({ type: "owned", data: shop })
        }
    }

    // 2/3) Expired history: expired or taken over by another player
    for (var j = 0; j < pd.expiredShops.length; j++) {
        var hist = pd.expiredShops[j]
        if (isOwnedByOtherPlayer(world, hist.npcUUID, playerUUID)) {
            list.push({ type: "takenOver", data: hist })
        } else {
            list.push({ type: "expired", data: hist })
        }
    }

    return list
}

function countTypes(list) {
    var counts = { owned: 0, expired: 0, takenOver: 0 }
    for (var i = 0; i < list.length; i++) {
        counts[list[i].type]++
    }
    return counts
}

function buildScrollLabels(shopList, world) {
    var labels = []
    var reg = getNpcRegistry(world)
    var now = SYS.currentTimeMillis()

    for (var i = 0; i < shopList.length; i++) {
        var entry = shopList[i]
        var shop = entry.data
        var npcInfo = reg[shop.npcUUID]
        var name = npcInfo ? npcInfo.displayName : "Unknown Shop"
        var coords = npcInfo ? "§7(" + npcInfo.x + ", " + npcInfo.y + ", " + npcInfo.z + ")" : "§7(Unknown)"

        if (entry.type === "owned") {
            var rem = shop.expiryDate - now
            var hrs = Math.floor(rem / 3600000)
            var d = Math.floor(hrs / 24)
            var h = hrs % 24
            var timeStr = d > 0 ? d + "d " + h + "h" : (h > 0 ? h + "h" : Math.floor(rem / 60000) + "m")
            labels.push("§a▶ §f" + name + " " + coords + " §7(" + timeStr + ")")
        } else if (entry.type === "expired") {
            labels.push("§e■ §7" + name + " " + coords + " §8(Expired)")
        } else if (entry.type === "takenOver") {
            labels.push("§c● §7" + name + " " + coords + " §8(Rented by other)")
        }
    }

    return labels
}

// ============================================================================
// MAIN INTERACT
// ============================================================================
function interact(event) {
    var player = event.player
    var api = event.API
    var world = player.getWorld()

    openMainGui(player, api, world)
}

// ============================================================================
// MAIN GUI - display only
// ============================================================================
function openMainGui(player, api, world) {
    var playerUUID = player.getUUID()
    var pd = getPlayerData(world, playerUUID)

    // 10-day retention cleanup (writes back only when something changed)
    if (cleanupStaleEntries(pd)) {
        savePlayerData(world, playerUUID, pd)
    }

    currentShopList = buildShopList(world, pd, playerUUID)
    var counts = countTypes(currentShopList)

    var width = 420
    var height = 240
    var gui = api.createCustomGui(GUI_MAIN, width, height, false, player)

    gui.addLabel(1, "§6§lYour Shop Rentals", 10, 8, 200, 14)

    gui.addLabel(ID_LBL_OWNED, "§aOwned: §f" + counts.owned, 10, 30, 120, 10)
    gui.addLabel(ID_LBL_EXPIRED, "§eExpired: §f" + counts.expired, 140, 30, 120, 10)
    gui.addLabel(ID_LBL_TAKEN, "§cTaken over: §f" + counts.takenOver, 270, 30, 140, 10)
    gui.addLabel(2, "§8Expired / taken-over entries are removed after " + RETENTION_DAYS + " days", 10, 44, 400, 10)

    var scrollLabels = buildScrollLabels(currentShopList, world)
    gui.addScroll(ID_SCROLL_SHOPS, 10, 60, 400, 130, scrollLabels.length > 0 ? scrollLabels : ["§7No shops found"]).setDefaultSelection(0)

    gui.addButton(ID_BTN_REFRESH, "§7Refresh", 230, 200, 60, 20)
    gui.addButton(ID_BTN_CLOSE, "§7Close", 340, 200, 60, 20)

    player.showCustomGui(gui)
}

// ============================================================================
// BUTTON HANDLER
// ============================================================================
function customGuiButton(event) {
    var player = event.player
    var api = event.API
    var gui = event.gui
    var buttonId = event.buttonId
    var world = player.getWorld()

    if (gui.getID() === GUI_MAIN) {
        if (buttonId === ID_BTN_CLOSE) {
            player.closeGui()
            return
        }
        if (buttonId === ID_BTN_REFRESH) {
            openMainGui(player, api, world)
            return
        }
    }
}

// ============================================================================
// INIT
// ============================================================================
function init(e) {
}
