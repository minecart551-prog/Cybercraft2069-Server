// ============================================================================
// SHOP RENT BLOCK - Remote claim & overview for rented shops
// ============================================================================
// Script Type: BlockEvent
// Target: CustomNPCs 1.20.1
// Style: ES5 | No Semicolons
//
// Shows a player's rented shops, expired shops, and allows claiming
// items/coins remotely.
// ============================================================================

var SYS = Java.type("java.lang.System")
var API = Java.type("noppes.npcs.api.NpcAPI").Instance()

// GUI IDs
var GUI_MAIN = 3000
var GUI_SHOP_DETAIL = 3001

// Component IDs
var ID_SCROLL_SHOPS = 10
var ID_BTN_CLAIM_ALL_COINS = 20
var ID_BTN_CLAIM_ALL_ITEMS = 21
var ID_BTN_REFRESH = 22
var ID_BTN_CLOSE = 23
var ID_LBL_INFO = 30
var ID_LBL_COINS = 31
var ID_LBL_ITEMS = 32
var ID_LBL_RENTED = 33
var ID_LBL_EXPIRED = 34
// Detail GUI
var ID_DTL_LBL_NAME = 50
var ID_DTL_LBL_COORDS = 51
var ID_DTL_LBL_STATUS = 52
var ID_DTL_LBL_EARNINGS = 53
var ID_DTL_BTN_CLAIM_ITEMS = 54
var ID_DTL_BTN_CLAIM_COINS = 55
var ID_DTL_BTN_BACK = 56
var ID_DTL_LBL_ITEMS = 57

// Constants (must match shop_rent.js)
var STONE_TO_COAL = 100
var COAL_TO_EMERALD = 100

// State
var currentPlayerData = null
var currentShopList = []
var currentScrollIndex = 0
var selectedShopIndex = -1

// ============================================================================
// WORLD DATA (shared with shop_rent.js)
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
        wd.playerShops[playerUUID] = { ownedShops: [], expiredShops: [], rentedByOther: [], claimableCoins: 0, claimableItems: [] }
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

function registerNpc(world, npcUUID, npcName, npcDisplayName, pos) {
    var reg = getNpcRegistry(world)
    reg[npcUUID] = {
        name: npcName,
        displayName: npcDisplayName,
        x: pos.getX(),
        y: pos.getY(),
        z: pos.getZ(),
        npcUUID: npcUUID
    }
    var wd = getWorldData(world)
    wd.npcRegistry = reg
    saveWorldData(world, wd)
}

function getCurrentNpcCoords(world, npcUUID) {
    try {
        var npcs = world.getNpcs()
        for (var i = 0; i < npcs.length; i++) {
            if (npcs[i].getUUID() === npcUUID) {
                var pos = npcs[i].getPos()
                return { x: pos.getX(), y: pos.getY(), z: pos.getZ() }
            }
        }
    } catch(e) {}
    return null
}

// ============================================================================
// CURRENCY (copied from shop_rent.js)
// ============================================================================
function countPlayerCoins(player) {
    var stoneTotal = 0, coalTotal = 0, emeraldTotal = 0
    var inv = player.getInventory()
    for (var i = 0; i < inv.getSize(); i++) {
        var stack = inv.getSlot(i)
        if (stack && !stack.isEmpty()) {
            var name = stack.getName()
            if (name === "coins:stone_coin") stoneTotal += stack.getStackSize()
            else if (name === "coins:coal_coin") coalTotal += stack.getStackSize()
            else if (name === "coins:emerald_coin") emeraldTotal += stack.getStackSize()
        }
    }
    return stoneTotal + (coalTotal * STONE_TO_COAL) + (emeraldTotal * STONE_TO_COAL * COAL_TO_EMERALD)
}

function giveCoins(player, amount) {
    if (amount <= 0) return true
    var world = player.getWorld()
    var remaining = amount
    if (remaining >= STONE_TO_COAL * COAL_TO_EMERALD) {
        var emCount = Math.floor(remaining / (STONE_TO_COAL * COAL_TO_EMERALD))
        while (emCount > 0) {
            var give = Math.min(emCount, 64)
            var stack = world.createItem("coins:emerald_coin", give)
            if (!player.giveItem(stack)) player.dropItem(stack)
            emCount -= give
        }
        remaining = remaining % (STONE_TO_COAL * COAL_TO_EMERALD)
    }
    if (remaining >= STONE_TO_COAL) {
        var coalCount = Math.floor(remaining / STONE_TO_COAL)
        while (coalCount > 0) {
            var give = Math.min(coalCount, 64)
            var stack = world.createItem("coins:coal_coin", give)
            if (!player.giveItem(stack)) player.dropItem(stack)
            coalCount -= give
        }
        remaining = remaining % STONE_TO_COAL
    }
    if (remaining > 0) {
        while (remaining > 0) {
            var give = Math.min(remaining, 64)
            var stack = world.createItem("coins:stone_coin", give)
            if (!player.giveItem(stack)) player.dropItem(stack)
            remaining -= give
        }
    }
    player.updatePlayerInventory()
    return true
}

function formatPrice(cents) {
    var dollars = Math.floor(cents / 100)
    var c = cents % 100
    return "$" + dollars + "." + (c < 10 ? "0" + c : c)
}

function deserializeItem(nbtStr, world) {
    if (!nbtStr) return null
    try {
        var nbt = API.stringToNbt(nbtStr)
        return world.createItemFromNbt(nbt)
    } catch(e) { return null }
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
// MAIN GUI
// ============================================================================
function openMainGui(player, api, world) {
    var playerUUID = player.getUUID()
    var pd = getPlayerData(world, playerUUID)
    currentPlayerData = pd
    currentScrollIndex = 0
    
    // Build shop list from player's rented + expired shops
    currentShopList = buildShopList(world, pd, playerUUID)
    
    var width = 420
    var height = 240
    var gui = api.createCustomGui(GUI_MAIN, width, height, false, player)
    
    gui.addLabel(ID_LBL_INFO, "§6§lYour Shop Rentals", 10, 8, 200, 14)
    
    // Stats - sum claimable coins + all shop earnings (owned + expired + rentedByOther)
    var totalCoins = pd.claimableCoins || 0
    if (pd.ownedShops) {
        for (var si = 0; si < pd.ownedShops.length; si++) {
            totalCoins += (pd.ownedShops[si].totalEarnings || 0)
        }
    }
    if (pd.expiredShops) {
        for (var si = 0; si < pd.expiredShops.length; si++) {
            totalCoins += (pd.expiredShops[si].totalEarnings || 0)
        }
    }
    if (pd.rentedByOther) {
        for (var si = 0; si < pd.rentedByOther.length; si++) {
            totalCoins += (pd.rentedByOther[si].totalEarnings || 0)
        }
    }
    var totalItems = (pd.claimableItems || []).length
    gui.addLabel(ID_LBL_RENTED, "§aOwned: §f" + countRented(pd), 10, 30, 120, 10)
    gui.addLabel(ID_LBL_EXPIRED, "§eExpired: §f" + countExpired(pd), 10, 42, 120, 10)
    gui.addLabel(ID_LBL_COINS, "§6Claimable Coins: §a" + formatPrice(totalCoins), 140, 30, 180, 10)
    gui.addLabel(ID_LBL_ITEMS, "§6Claimable Items: §e" + totalItems, 140, 42, 180, 10)
    
    // Scroll list of shops
    var scrollLabels = buildScrollLabels(currentShopList, world)
    gui.addScroll(ID_SCROLL_SHOPS, 10, 60, 380, 120, scrollLabels.length > 0 ? scrollLabels : ["§7No shops found"]).setDefaultSelection(0)
    
    // Buttons
    gui.addButton(ID_BTN_CLAIM_ALL_COINS, "§a§lClaim All Coins", 10, 190, 100, 20)
    gui.addButton(ID_BTN_CLAIM_ALL_ITEMS, "§e§lClaim All Items", 120, 190, 100, 20)
    gui.addButton(ID_BTN_REFRESH, "§7Refresh", 230, 190, 60, 20)
    gui.addButton(ID_BTN_CLOSE, "§7Close", 340, 190, 60, 20)
    
    player.showCustomGui(gui)
}

function buildShopList(world, pd, playerUUID) {
    var list = []
    var reg = getNpcRegistry(world)
    var now = SYS.currentTimeMillis()
    
    // Add owned shops (currently rented by this player)
    if (pd.ownedShops) {
        for (var i = 0; i < pd.ownedShops.length; i++) {
            var shop = pd.ownedShops[i]
            if (shop.expiryDate > now) {
                list.push({ type: "owned", data: shop, index: i })
            }
        }
    }
    
    // Add expired shops (not rented by anyone else)
    if (pd.expiredShops) {
        for (var i = 0; i < pd.expiredShops.length; i++) {
            var shop = pd.expiredShops[i]
            list.push({ type: "expired", data: shop, index: i })
        }
    }
    
    // Add shops rented by other players
    if (pd.rentedByOther) {
        for (var i = 0; i < pd.rentedByOther.length; i++) {
            var shop = pd.rentedByOther[i]
            list.push({ type: "rentedByOther", data: shop, index: i })
        }
    }
    
    return list
}

function buildScrollLabels(shopList, world) {
    var labels = []
    var reg = getNpcRegistry(world)
    var now = SYS.currentTimeMillis()
    
    for (var i = 0; i < shopList.length; i++) {
        var entry = shopList[i]
        var shop = entry.data
        // Look up NPC info by UUID
        var npcInfo = reg[shop.npcUUID]
        var name = npcInfo ? npcInfo.displayName : (shop.npcName || "Unknown Shop")
        
        // Try to get current NPC position if it exists in the world
        var currentCoords = getCurrentNpcCoords(world, shop.npcUUID)
        var coords = currentCoords ? "§7(" + currentCoords.x + ", " + currentCoords.y + ", " + currentCoords.z + ")" : (npcInfo ? "§7(" + npcInfo.x + ", " + npcInfo.y + ", " + npcInfo.z + ")" : "§7(Unknown)")
        
        if (entry.type === "owned") {
            // Green - actively rented by this player
            var rem = shop.expiryDate - now
            var hrs = Math.floor(rem / 3600000)
            var d = Math.floor(hrs / 24)
            var h = hrs % 24
            var timeStr = d > 0 ? d + "d " + h + "h" : (h > 0 ? h + "h" : Math.floor(rem / 60000) + "m")
            labels.push("§a▶ §f" + name + " " + coords + " §7(" + timeStr + ")")
        } else if (entry.type === "expired") {
            // Yellow - expired, available for others
            labels.push("§e■ §7" + name + " " + coords + " §8(Expired)")
        } else if (entry.type === "rentedByOther") {
            // Red - rented by another player
            labels.push("§c● §7" + name + " " + coords + " §8(Rented by other)")
        }
    }
    
    return labels
}

function countRented(pd) {
    if (!pd.ownedShops) return 0
    var now = SYS.currentTimeMillis()
    var count = 0
    for (var i = 0; i < pd.ownedShops.length; i++) {
        if (pd.ownedShops[i].expiryDate > now) count++
    }
    return count
}

function countExpired(pd) {
    if (!pd.expiredShops) return 0
    return pd.expiredShops.length
}

// ============================================================================
// SHOP DETAIL GUI
// ============================================================================
function openShopDetailGui(player, api, world, shopEntry) {
    var width = 350
    var height = 200
    var gui = api.createCustomGui(GUI_SHOP_DETAIL, width, height, false, player)
    
    var shop = shopEntry.data
    var reg = getNpcRegistry(world)
    var npcInfo = reg[shop.npcUUID]
    var name = npcInfo ? npcInfo.displayName : (shop.npcName || "Unknown Shop")
    
    // Try to get current NPC position if it exists in the world
    var currentCoords = getCurrentNpcCoords(world, shop.npcUUID)
    var coords = currentCoords ? "§7" + currentCoords.x + ", " + currentCoords.y + ", " + currentCoords.z : (npcInfo ? "§7" + npcInfo.x + ", " + npcInfo.y + ", " + npcInfo.z : "§7Unknown")
    
    gui.addLabel(ID_DTL_LBL_NAME, "§6§l" + name, 10, 10, 300, 14)
    gui.addLabel(ID_DTL_LBL_COORDS, coords, 10, 30, 300, 10)
    
    if (shopEntry.type === "owned") {
        // Green - actively rented by this player
        var now = SYS.currentTimeMillis()
        var rem = shop.expiryDate - now
        var hrs = Math.floor(rem / 3600000)
        var d = Math.floor(hrs / 24)
        var h = hrs % 24
        var timeStr = d > 0 ? d + "d " + h + "h" : (h > 0 ? h + "h" : Math.floor(rem / 60000) + "m")
        gui.addLabel(ID_DTL_LBL_STATUS, "§aStatus: §fRented §7(expires in " + timeStr + ")", 10, 50, 300, 10)
        gui.addLabel(ID_DTL_LBL_EARNINGS, "§7Earnings: §a" + formatPrice(shop.totalEarnings || 0), 10, 65, 300, 10)
        gui.addLabel(ID_DTL_LBL_ITEMS, "§7Items in shop: §e" + (shop.itemCount || 0), 10, 80, 300, 10)
        
        gui.addButton(ID_DTL_BTN_CLAIM_COINS, "§a§lClaim Earnings", 10, 110, 120, 20)
        gui.addButton(ID_DTL_BTN_BACK, "§7Back", 250, 160, 80, 20)
    } else if (shopEntry.type === "expired") {
        // Yellow - expired, available for others
        gui.addLabel(ID_DTL_LBL_STATUS, "§eStatus: §fExpired", 10, 50, 300, 10)
        gui.addLabel(ID_DTL_LBL_EARNINGS, "§7This shop is available for others to rent", 10, 65, 300, 10)
        
        // Check if this shop has claimable items for this player
        var pd = currentPlayerData
        var hasItems = pd.claimableItems && pd.claimableItems.length > 0
        var hasCoins = (pd.claimableCoins || 0) > 0
        
        if (hasItems || hasCoins) {
            gui.addLabel(ID_DTL_LBL_ITEMS, "§6You have items/coins to claim!", 10, 85, 300, 10)
            gui.addButton(ID_DTL_BTN_CLAIM_ITEMS, "§e§lClaim Items", 10, 110, 120, 20)
            gui.addButton(ID_DTL_BTN_CLAIM_COINS, "§a§lClaim Coins", 140, 110, 120, 20)
        }
        
        gui.addButton(ID_DTL_BTN_BACK, "§7Back", 250, 160, 80, 20)
    } else if (shopEntry.type === "rentedByOther") {
        // Red - rented by another player
        gui.addLabel(ID_DTL_LBL_STATUS, "§cStatus: §fRented by other player", 10, 50, 300, 10)
        gui.addLabel(ID_DTL_LBL_EARNINGS, "§7This shop is currently rented", 10, 65, 300, 10)
        gui.addLabel(ID_DTL_LBL_ITEMS, "§7You cannot claim while someone else rents", 10, 80, 300, 10)
        
        gui.addButton(ID_DTL_BTN_BACK, "§7Back", 250, 160, 80, 20)
    }
    
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
    var playerUUID = player.getUUID()
    
    if (gui.getID() === GUI_MAIN) {
        if (buttonId === ID_BTN_CLOSE) {
            player.closeGui()
            return
        }
        
        if (buttonId === ID_BTN_REFRESH) {
            openMainGui(player, api, world)
            return
        }
        
        if (buttonId === ID_BTN_CLAIM_ALL_COINS) {
            var pd = getPlayerData(world, playerUUID)
            var coins = pd.claimableCoins || 0
            
            // Also collect earnings from all owned shops
            if (pd.ownedShops) {
                for (var i = 0; i < pd.ownedShops.length; i++) {
                    coins += (pd.ownedShops[i].totalEarnings || 0)
                    pd.ownedShops[i].totalEarnings = 0
                }
            }
            
            // Also collect earnings from expired shops (for stopped renters)
            if (pd.expiredShops) {
                for (var i = 0; i < pd.expiredShops.length; i++) {
                    coins += (pd.expiredShops[i].totalEarnings || 0)
                    pd.expiredShops[i].totalEarnings = 0
                }
            }
            
            if (coins <= 0) {
                player.message("§7No coins to claim.")
                return
            }
            
            giveCoins(player, coins)
            pd.claimableCoins = 0
            savePlayerData(world, playerUUID, pd)
            player.message("§aClaimed §e" + formatPrice(coins) + " §afrom all shops!")
            openMainGui(player, api, world)
            return
        }
        
        if (buttonId === ID_BTN_CLAIM_ALL_ITEMS) {
            var pd = getPlayerData(world, playerUUID)
            var items = pd.claimableItems || []
            
            if (items.length === 0) {
                player.message("§7No items to claim.")
                return
            }
            
            var given = 0
            for (var i = 0; i < items.length; i++) {
                var item = deserializeItem(items[i], world)
                if (item) {
                    if (!player.giveItem(item)) player.dropItem(item)
                    given++
                }
            }
            
            pd.claimableItems = []
            savePlayerData(world, playerUUID, pd)
            player.message("§aClaimed §e" + given + " §aitems from all shops!")
            player.updatePlayerInventory()
            openMainGui(player, api, world)
            return
        }
    }
    
    if (gui.getID() === GUI_SHOP_DETAIL) {
        if (buttonId === ID_DTL_BTN_BACK) {
            openMainGui(player, api, world)
            return
        }
        
        if (buttonId === ID_DTL_BTN_CLAIM_COINS) {
            var pd = getPlayerData(world, playerUUID)
            var coins = pd.claimableCoins || 0
            
            if (selectedShopIndex >= 0 && selectedShopIndex < currentShopList.length) {
                var entry = currentShopList[selectedShopIndex]
                if (entry.type === "owned" || entry.type === "expired") {
                    // Find this shop in fresh data by matching UUID
                    var npcUUID = entry.data.npcUUID
                    var found = false
                    // Check owned shops first
                    if (pd.ownedShops) {
                        for (var si = 0; si < pd.ownedShops.length; si++) {
                            if (pd.ownedShops[si].npcUUID === npcUUID) {
                                coins += (pd.ownedShops[si].totalEarnings || 0)
                                pd.ownedShops[si].totalEarnings = 0
                                found = true
                                break
                            }
                        }
                    }
                    // If not in owned, check expired shops (for stopped renters)
                    if (!found && pd.expiredShops) {
                        for (var si = 0; si < pd.expiredShops.length; si++) {
                            if (pd.expiredShops[si].npcUUID === npcUUID) {
                                coins += (pd.expiredShops[si].totalEarnings || 0)
                                pd.expiredShops[si].totalEarnings = 0
                                break
                            }
                        }
                    }
                }
            }
            
            if (coins <= 0) {
                player.message("§7No coins to claim.")
                return
            }
            
            giveCoins(player, coins)
            pd.claimableCoins = 0
            savePlayerData(world, playerUUID, pd)
            player.message("§aClaimed §e" + formatPrice(coins) + "!")
            openMainGui(player, api, world)
            return
        }
        
        if (buttonId === ID_DTL_BTN_CLAIM_ITEMS) {
            var pd = getPlayerData(world, playerUUID)
            var items = pd.claimableItems || []
            
            if (items.length === 0) {
                player.message("§7No items to claim.")
                return
            }
            
            var given = 0
            for (var i = 0; i < items.length; i++) {
                var item = deserializeItem(items[i], world)
                if (item) {
                    if (!player.giveItem(item)) player.dropItem(item)
                    given++
                }
            }
            
            pd.claimableItems = []
            savePlayerData(world, playerUUID, pd)
            player.message("§aClaimed §e" + given + " §aitems!")
            player.updatePlayerInventory()
            openMainGui(player, api, world)
            return
        }
    }
}

// ============================================================================
// SCROLL HANDLER
// ============================================================================
function customGuiScroll(event) {
    var player = event.player
    var api = event.API
    var gui = event.gui
    var world = player.getWorld()
    
    if (gui.getID() === GUI_MAIN && event.scrollId === ID_SCROLL_SHOPS) {
        currentScrollIndex = event.scrollIndex
        
        if (currentScrollIndex >= 0 && currentScrollIndex < currentShopList.length) {
            selectedShopIndex = currentScrollIndex
            var entry = currentShopList[currentScrollIndex]
            openShopDetailGui(player, api, world, entry)
        }
    }
}

// ============================================================================
// INIT
// ============================================================================
function init(e) {
}