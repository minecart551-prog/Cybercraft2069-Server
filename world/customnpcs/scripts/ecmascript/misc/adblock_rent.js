// ===============================================================
// AdBlock Rent - Scripted Block rental system
// ===============================================================
// Place on a Scripted Block.
// Admins (holding bedrock) can set rent cost and teleport coords.
// Normal players can rent the block for 1-10 real-world days.
// All data stored in world.getStoreddata() under "adblock_rent" array.
// ===============================================================

// ----------------- CONSTANTS -----------------
var MAX_RENT_DAYS = 10;
var DATA_KEY = "adblock_rent";

// Coin denominations (matching spawner.js)
var STONE_TO_COAL   = 100;
var COAL_TO_EMERALD = 100;

// GUI IDs
var GUI_INFO    = 11001;
var GUI_RENT    = 11002;
var GUI_ADMIN   = 11003;

// Info GUI component IDs
var INFO_LBL_TITLE        = 1;
var INFO_LBL_STATUS       = 2;
var INFO_LBL_RENTER       = 3;
var INFO_LBL_CURRENT_TIME = 4;
var INFO_LBL_EXPIRY_TIME  = 5;
var INFO_LBL_COST         = 6;
var INFO_BTN_TELEPORT     = 7;
var INFO_BTN_RENT         = 8;
var INFO_BTN_CLOSE        = 9;
var INFO_BTN_CANCEL_RENT  = 40;

// Rent GUI component IDs
var RENT_LBL_TITLE      = 10;
var RENT_LBL_COST_DAY   = 11;
var RENT_LBL_BALANCE    = 12;
var RENT_TF_DAYS        = 13;
var RENT_BTN_PAY        = 14;
var RENT_BTN_CANCEL     = 15;
var RENT_LBL_DAYS_LABEL = 16;
var RENT_LBL_TOTAL      = 17;

// Admin GUI component IDs
var ADM_LBL_TITLE      = 20;
var ADM_LBL_COST       = 21;
var ADM_TF_COST        = 22;
var ADM_LBL_TP         = 23;
var ADM_TF_TPX         = 24;
var ADM_TF_TPY         = 25;
var ADM_TF_TPZ         = 26;
var ADM_BTN_SAVE       = 27;
var ADM_BTN_DELETE     = 28;
var ADM_BTN_CLOSE      = 29;
var ADM_LBL_STATUS     = 30;

// Store block position for GUI button callbacks (block reference not available in customGuiButton)
var pendingBlockKey = null;
var pendingAdminBlockKey = null;

// ----------------- WORLD DATA HELPERS -----------------
function getRentData(world) {
    var wdata = world.getStoreddata();
    if (!wdata.has(DATA_KEY)) return [];
    try {
        return JSON.parse(wdata.get(DATA_KEY));
    } catch (e) {
        return [];
    }
}

function saveRentData(world, data) {
    world.getStoreddata().put(DATA_KEY, JSON.stringify(data));
}

function getBlockKey(block) {
    return block.getX() + "," + block.getY() + "," + block.getZ();
}

function findEntry(data, blockKey) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].blockPos === blockKey) return data[i];
    }
    return null;
}

function removeEntry(data, blockKey) {
    for (var i = data.length - 1; i >= 0; i--) {
        if (data[i].blockPos === blockKey) {
            data.splice(i, 1);
            return true;
        }
    }
    return false;
}

function isExpired(entry) {
    if (!entry || !entry.renter || entry.renter === "") return true;
    var now = System.currentTimeMillis();
    return now >= entry.expiryDate;
}

// ----------------- CURRENCY HELPERS (exact same as spawner.js) -----------------
function countCoins(player) {
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
    if (countCoins(player) < amount) return false;
    var remaining = amount;
    var inv = player.getInventory();

    // stone coins
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (!stack || stack.isEmpty() || stack.getName() !== "coins:stone_coin") continue;
        var stackAmount = stack.getStackSize();
        if (stackAmount <= remaining) {
            inv.setSlot(i, null);
            remaining -= stackAmount;
        } else {
            stack.setStackSize(stackAmount - remaining);
            remaining = 0;
        }
    }

    // coal coins
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (!stack || stack.isEmpty() || stack.getName() !== "coins:coal_coin") continue;
        var stackAmount = stack.getStackSize();
        var stoneValue  = stackAmount * STONE_TO_COAL;
        if (stoneValue <= remaining) {
            inv.setSlot(i, null);
            remaining -= stoneValue;
        } else {
            var coalsNeeded = Math.ceil(remaining / STONE_TO_COAL);
            stack.setStackSize(stackAmount - coalsNeeded);
            var overpaid = (coalsNeeded * STONE_TO_COAL) - remaining;
            remaining = 0;
            if (overpaid > 0) {
                try { player.giveItem(player.world.createItem("coins:stone_coin", overpaid)); } catch (e) {}
            }
        }
    }

    // emerald coins
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (!stack || stack.isEmpty() || stack.getName() !== "coins:emerald_coin") continue;
        var stackAmount = stack.getStackSize();
        var stoneValue  = stackAmount * STONE_TO_COAL * COAL_TO_EMERALD;
        if (stoneValue <= remaining) {
            inv.setSlot(i, null);
            remaining -= stoneValue;
        } else {
            var emeraldsNeeded = Math.ceil(remaining / (STONE_TO_COAL * COAL_TO_EMERALD));
            stack.setStackSize(stackAmount - emeraldsNeeded);
            var overpaid    = (emeraldsNeeded * STONE_TO_COAL * COAL_TO_EMERALD) - remaining;
            remaining = 0;
            var changeCoal  = Math.floor(overpaid / STONE_TO_COAL);
            var changeStone = overpaid % STONE_TO_COAL;
            if (changeCoal  > 0) {
                try { player.giveItem(player.world.createItem("coins:coal_coin",  changeCoal));  } catch (e) {}
            }
            if (changeStone > 0) {
                try { player.giveItem(player.world.createItem("coins:stone_coin", changeStone)); } catch (e) {}
            }
        }
    }

    return true;
}

function fmtTime(ms) {
    var Date = Java.type('java.util.Date');
    var SimpleDateFormat = Java.type('java.text.SimpleDateFormat');
    var formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    return formatter.format(new Date(ms));
}

function fmtCoins(cents) {
    var dollars = Math.floor(cents / 100);
    var c       = cents % 100;
    return "$" + dollars + "." + (c < 10 ? "0" + c : c);
}

// ----------------- INTERACT (ENTRY POINT) -----------------
function interact(e) {
    var player = e.player;
    var block  = e.block;
    var world  = block.getWorld();
    var api    = e.API;

    // --- Admin mode (holding bedrock) ---
    var handItem = player.getMainhandItem();
    if (handItem && !handItem.isEmpty() && handItem.getName() === "minecraft:bedrock") {
        openAdminGui(player, api, block, world);
        return;
    }

    // --- Normal player interaction ---
    var data = getRentData(world);
    var blockKey = getBlockKey(block);
    var entry = findEntry(data, blockKey);

    // If no entry exists, or expired -> show rent GUI directly
    if (!entry || isExpired(entry)) {
        pendingBlockKey = blockKey;
        openRentGui(player, api, block, world, entry);
        return;
    }

    // Entry exists and not expired -> show info GUI
    openInfoGui(player, api, block, world, entry);
}

// ----------------- INFO GUI -----------------
function openInfoGui(player, api, block, world, entry) {
    var width  = 280;
    var height = 200;
    var gui = api.createCustomGui(GUI_INFO, width, height, false, player);

    gui.addLabel(INFO_LBL_TITLE, "§6§lAdBlock Rental Info", width / 2 - 60, 10, 160, 14);

    var now = System.currentTimeMillis();
    var currentTimeStr = fmtTime(now);

    gui.addLabel(INFO_LBL_CURRENT_TIME, "§7Current Time: §f" + currentTimeStr, 15, 35, 250, 10);

    if (entry && entry.renter && entry.renter !== "" && !isExpired(entry)) {
        gui.addLabel(INFO_LBL_RENTER, "§7Rented by: §e" + entry.renter, 15, 55, 250, 10);
        gui.addLabel(INFO_LBL_EXPIRY_TIME, "§7Expires: §c" + fmtTime(entry.expiryDate), 15, 75, 250, 10);
        gui.addLabel(INFO_LBL_COST, "§7Cost per day: §a" + fmtCoins(entry.rentCost || 0), 15, 95, 250, 10);

        // Teleport and Cancel buttons only for the current renter
        var playerName = player.getName();
        if (playerName === entry.renter) {
            gui.addButton(INFO_BTN_TELEPORT, "§b§lTeleport", width / 2 - 60, 120, 120, 20);
            gui.addButton(INFO_BTN_CANCEL_RENT, "§c§lCancel Rent", width / 2 - 60, 145, 120, 20);
        }
    } else {
        gui.addLabel(INFO_LBL_RENTER, "§7Status: §aAvailable for rent", 15, 55, 250, 10);
        gui.addButton(INFO_BTN_RENT, "§a§lRent This Block", width / 2 - 60, 125, 120, 20);
    }

    gui.addButton(INFO_BTN_CLOSE, "§7Close", width / 2 - 30, 170, 60, 20);

    player.showCustomGui(gui);
}

// ----------------- RENT GUI -----------------
function openRentGui(player, api, block, world, existingEntry) {
    var width  = 260;
    var height = 180;
    var gui = api.createCustomGui(GUI_RENT, width, height, false, player);

    var costPerDay = existingEntry ? (existingEntry.rentCost || 0) : 0;

    gui.addLabel(RENT_LBL_TITLE, "§6§lRent This AdBlock", width / 2 - 60, 10, 160, 14);
    gui.addLabel(RENT_LBL_COST_DAY, "§7Cost per day: §a" + fmtCoins(costPerDay), 15, 35, 200, 10);
    gui.addLabel(RENT_LBL_BALANCE, "§6Wallet: §e" + fmtCoins(countCoins(player)), 15, 55, 200, 10);

    gui.addLabel(RENT_LBL_DAYS_LABEL, "§7Days (1-" + MAX_RENT_DAYS + "):", 15, 80, 100, 10);
    gui.addTextField(RENT_TF_DAYS, 110, 77, 50, 16).setText("1");

    gui.addLabel(RENT_LBL_TOTAL, "§7Total: §a" + fmtCoins(costPerDay * 1), 15, 105, 200, 10);

    gui.addButton(RENT_BTN_PAY, "§a§lPay & Rent", width / 2 - 70, 135, 80, 20);
    gui.addButton(RENT_BTN_CANCEL, "§7Cancel", width / 2 + 10, 135, 60, 20);

    player.showCustomGui(gui);
}

// ----------------- ADMIN GUI -----------------
function openAdminGui(player, api, block, world) {
    var width  = 280;
    var height = 220;
    var gui = api.createCustomGui(GUI_ADMIN, width, height, false, player);

    var data = getRentData(world);
    var blockKey = getBlockKey(block);
    pendingAdminBlockKey = blockKey;
    var entry = findEntry(data, blockKey);

    gui.addLabel(ADM_LBL_TITLE, "§6§lAdmin - AdBlock Settings", width / 2 - 80, 10, 180, 14);

    gui.addLabel(ADM_LBL_COST, "§7Rent Cost per Day (in coins):", 15, 35, 200, 10);
    gui.addTextField(ADM_TF_COST, 15, 48, 100, 16).setText(entry ? String(entry.rentCost || 0) : "0");

    gui.addLabel(ADM_LBL_TP, "§7Teleport Coordinates:", 15, 75, 200, 10);
    gui.addLabel(23, "§7X:", 15, 92, 20, 10);
    gui.addTextField(ADM_TF_TPX, 35, 89, 60, 16).setText(entry ? String(entry.tpX || 0) : "0");
    gui.addLabel(24, "§7Y:", 105, 92, 20, 10);
    gui.addTextField(ADM_TF_TPY, 125, 89, 60, 16).setText(entry ? String(entry.tpY || 0) : "0");
    gui.addLabel(25, "§7Z:", 195, 92, 20, 10);
    gui.addTextField(ADM_TF_TPZ, 215, 89, 60, 16).setText(entry ? String(entry.tpZ || 0) : "0");

    gui.addButton(ADM_BTN_SAVE,   "§a§lSave",   40,  130, 80, 20);
    gui.addButton(ADM_BTN_DELETE, "§c§lDelete", 140, 130, 80, 20);
    gui.addButton(ADM_BTN_CLOSE,  "§7Close",    width / 2 - 30, 175, 60, 20);

    gui.addLabel(ADM_LBL_STATUS, "", 15, 155, 250, 10);

    if (entry && entry.renter && entry.renter !== "") {
        gui.addLabel(26, "§7Current Renter: §e" + entry.renter, 15, 200, 250, 10);
        gui.addLabel(27, "§7Expires: §c" + fmtTime(entry.expiryDate), 15, 215, 250, 10);
    }

    player.showCustomGui(gui);
}

// ----------------- GUI BUTTON HANDLER -----------------
function customGuiButton(e) {
    var player  = e.player;
    var gui     = e.gui;
    var world   = player.world;
    var api     = e.API;
    var buttonId = e.buttonId;

    // --- INFO GUI ---
    if (gui.getID() === GUI_INFO) {
        // Close
        if (buttonId === INFO_BTN_CLOSE) {
            player.closeGui();
            return;
        }

        // Teleport (only renter can see this button, but double-check)
        if (buttonId === INFO_BTN_TELEPORT) {
            var data = getRentData(world);
            var playerName = player.getName();
            for (var i = 0; i < data.length; i++) {
                if (data[i].renter === playerName) {
                    var tpX = data[i].tpX;
                    var tpY = data[i].tpY;
                    var tpZ = data[i].tpZ;
                    if (tpX !== undefined && tpY !== undefined && tpZ !== undefined) {
                        player.setPos(tpX, tpY, tpZ);
                        player.message("§aTeleported to your rented adblock location!");
                    } else {
                        player.message("§cNo teleport coordinates have been set by the admin.");
                    }
                    player.closeGui();
                    return;
                }
            }
            player.message("§cYou are not currently renting any adblock.");
            player.closeGui();
            return;
        }

        // Cancel Rent button (renter only)
        if (buttonId === INFO_BTN_CANCEL_RENT) {
            handleCancelRent(e);
            return;
        }

        // Rent button (available block)
        if (buttonId === INFO_BTN_RENT) {
            player.closeGui();
            openRentFromInfo(player, api, world);
            return;
        }
        return;
    }

    // --- RENT GUI ---
    if (gui.getID() === GUI_RENT) {
        if (buttonId === RENT_BTN_CANCEL) {
            player.closeGui();
            return;
        }

        if (buttonId === RENT_BTN_PAY) {
            handleRentPayment(e);
            return;
        }
        return;
    }

    // --- ADMIN GUI ---
    if (gui.getID() === GUI_ADMIN) {
        // Close
        if (buttonId === ADM_BTN_CLOSE) {
            player.closeGui();
            return;
        }

        // Save
        if (buttonId === ADM_BTN_SAVE) {
            handleAdminSave(e);
            return;
        }

        // Delete
        if (buttonId === ADM_BTN_DELETE) {
            handleAdminDelete(e);
            return;
        }
        return;
    }
}

// ----------------- RENT FROM INFO (helper when clicking "Rent" from info GUI) -----------------
function openRentFromInfo(player, api, world) {
    var data = getRentData(world);
    var playerX = Math.floor(player.getX());
    var playerY = Math.floor(player.getY());
    var playerZ = Math.floor(player.getZ());

    // Search for the nearest available block entry
    var nearestEntry = null;
    var nearestDist = 999999;
    var nearestKey = null;

    for (var i = 0; i < data.length; i++) {
        var ep = data[i];
        if (ep.renter && ep.renter !== "" && !isExpired(ep)) continue;
        var parts = ep.blockPos.split(",");
        var bx = parseInt(parts[0]);
        var by = parseInt(parts[1]);
        var bz = parseInt(parts[2]);
        var dx = bx - playerX;
        var dy = by - playerY;
        var dz = bz - playerZ;
        var dist = dx*dx + dy*dy + dz*dz;
        if (dist < nearestDist && dist < 100) {
            nearestDist = dist;
            nearestEntry = ep;
            nearestKey = ep.blockPos;
        }
    }

    if (!nearestEntry) {
        // No existing entry found - the block might not have been configured yet
        openNewRentGui(player, api, world, playerX, playerY, playerZ);
        return;
    }

    openRentGuiForEntry(player, api, world, nearestEntry, nearestKey);
}

function openNewRentGui(player, api, world, bx, by, bz) {
    var width  = 260;
    var height = 180;
    var gui = api.createCustomGui(GUI_RENT, width, height, false, player);

    gui.addLabel(RENT_LBL_TITLE, "§6§lRent This AdBlock", width / 2 - 60, 10, 160, 14);
    gui.addLabel(RENT_LBL_COST_DAY, "§cNo rental cost configured! Ask admin.", 15, 35, 230, 10);
    gui.addLabel(RENT_LBL_BALANCE, "", 15, 55, 200, 10);
    gui.addLabel(RENT_LBL_DAYS_LABEL, "§7Days (1-" + MAX_RENT_DAYS + "):", 15, 80, 100, 10);
    gui.addTextField(RENT_TF_DAYS, 110, 77, 50, 16).setText("1");
    gui.addLabel(RENT_LBL_TOTAL, "§cCannot rent - no cost set", 15, 105, 200, 10);
    gui.addButton(RENT_BTN_CANCEL, "§7Close", width / 2 - 30, 135, 60, 20);

    player.showCustomGui(gui);
}

function openRentGuiForEntry(player, api, world, entry, blockKey) {
    pendingBlockKey = blockKey;

    var width  = 260;
    var height = 180;
    var gui = api.createCustomGui(GUI_RENT, width, height, false, player);

    var costPerDay = entry ? (entry.rentCost || 0) : 0;

    gui.addLabel(RENT_LBL_TITLE, "§6§lRent This AdBlock", width / 2 - 60, 10, 160, 14);
    gui.addLabel(RENT_LBL_COST_DAY, "§7Cost per day: §a" + fmtCoins(costPerDay), 15, 35, 200, 10);
    gui.addLabel(RENT_LBL_BALANCE, "§6Wallet: §e" + fmtCoins(countCoins(player)), 15, 55, 200, 10);

    gui.addLabel(RENT_LBL_DAYS_LABEL, "§7Days (1-" + MAX_RENT_DAYS + "):", 15, 80, 100, 10);
    gui.addTextField(RENT_TF_DAYS, 110, 77, 50, 16).setText("1");

    gui.addLabel(RENT_LBL_TOTAL, "§7Total: §a" + fmtCoins(costPerDay * 1), 15, 105, 200, 10);

    gui.addButton(RENT_BTN_PAY, "§a§lPay & Rent", width / 2 - 70, 135, 80, 20);
    gui.addButton(RENT_BTN_CANCEL, "§7Cancel", width / 2 + 10, 135, 60, 20);

    player.showCustomGui(gui);
}

function handleRentPayment(e) {
    var player  = e.player;
    var gui     = e.gui;
    var world   = player.world;

    // Get days from text field
    var daysField = gui.getComponent(RENT_TF_DAYS);
    if (!daysField) {
        player.message("§cError reading days field.");
        return;
    }
    var daysText = daysField.getText().trim();
    var days = parseInt(daysText);
    if (isNaN(days) || days < 1 || days > MAX_RENT_DAYS) {
        player.message("§cInvalid days! Must be between 1 and " + MAX_RENT_DAYS + ".");
        return;
    }

    // Find the entry by pendingBlockKey, or search nearby
    var data = getRentData(world);
    var entry = null;
    var blockKey = null;

    if (pendingBlockKey) {
        entry = findEntry(data, pendingBlockKey);
        blockKey = pendingBlockKey;
    }

    // If no pending block key or entry not found, search nearby
    if (!entry) {
        var playerX = Math.floor(player.getX());
        var playerY = Math.floor(player.getY());
        var playerZ = Math.floor(player.getZ());
        var nearestDist = 999999;

        for (var i = 0; i < data.length; i++) {
            var ep = data[i];
            if (ep.renter && ep.renter !== "" && !isExpired(ep)) continue;
            var parts = ep.blockPos.split(",");
            var bx = parseInt(parts[0]);
            var by = parseInt(parts[1]);
            var bz = parseInt(parts[2]);
            var dx = bx - playerX;
            var dy = by - playerY;
            var dz = bz - playerZ;
            var dist = dx*dx + dy*dy + dz*dz;
            if (dist < nearestDist && dist < 100) {
                nearestDist = dist;
                entry = ep;
                blockKey = ep.blockPos;
            }
        }
    }

    if (!entry) {
        player.message("§cNo available adblock found nearby. Ask an admin to configure one.");
        return;
    }

    var costPerDay = entry.rentCost || 0;
    if (costPerDay <= 0) {
        player.message("§cThis adblock has no rent cost configured. Ask an admin to set it.");
        return;
    }

    var totalCost = costPerDay * days;
    var now = System.currentTimeMillis();
    var expiryMs = days * 24 * 60 * 60 * 1000; // days to ms

    // Check if player has enough coins
    if (countCoins(player) < totalCost) {
        player.message("§cYou need " + fmtCoins(totalCost) + " to rent for " + days + " day(s). You have " + fmtCoins(countCoins(player)) + ".");
        return;
    }

    // Remove coins
    if (!removeCoins(player, totalCost)) {
        player.message("§cTransaction failed! Could not remove coins.");
        return;
    }

    // Update the entry
    entry.renter = player.getName();
    entry.rentedDate = now;
    entry.expiryDate = now + expiryMs;

    saveRentData(world, data);

    pendingBlockKey = null;
    player.message("§aYou have rented this adblock for " + days + " day(s)! Cost: " + fmtCoins(totalCost));
    player.closeGui();
}

function handleAdminSave(e) {
    var player  = e.player;
    var gui     = e.gui;
    var world   = player.world;

    // Get admin-set values from text fields
    var costField = gui.getComponent(ADM_TF_COST);
    var xField    = gui.getComponent(ADM_TF_TPX);
    var yField    = gui.getComponent(ADM_TF_TPY);
    var zField    = gui.getComponent(ADM_TF_TPZ);

    if (!costField || !xField || !yField || !zField) {
        player.message("§cError reading admin fields.");
        return;
    }

    var costText = costField.getText().trim();
    var xText    = xField.getText().trim();
    var yText    = yField.getText().trim();
    var zText    = zField.getText().trim();

    var cost = parseInt(costText);
    var tpX  = parseInt(xText);
    var tpY  = parseInt(yText);
    var tpZ  = parseInt(zText);

    if (isNaN(cost) || cost < 0) {
        player.message("§cRent cost must be a valid positive number.");
        return;
    }
    if (isNaN(tpX) || isNaN(tpY) || isNaN(tpZ)) {
        player.message("§cTeleport coordinates must be valid numbers.");
        return;
    }

    if (!pendingAdminBlockKey) {
        player.message("§cError: Block position lost. Please reopen the admin GUI.");
        return;
    }

    var data = getRentData(world);
    var blockKey = pendingAdminBlockKey;
    var entry = findEntry(data, blockKey);

    if (!entry) {
        // Create a new entry at this block's position
        entry = {
            blockPos: blockKey,
            renter: "",
            rentedDate: 0,
            expiryDate: 0,
            rentCost: cost,
            tpX: tpX,
            tpY: tpY,
            tpZ: tpZ
        };
        data.push(entry);
        player.message("§aNew adblock entry created at " + blockKey);
    } else {
        entry.rentCost = cost;
        entry.tpX = tpX;
        entry.tpY = tpY;
        entry.tpZ = tpZ;
        player.message("§aAdblock settings saved!");
    }

    saveRentData(world, data);

    // Update the status label dynamically
    var statusLbl = gui.getComponent(ADM_LBL_STATUS);
    if (statusLbl) {
        statusLbl.setText("§aSaved successfully!");
    }
}

function handleAdminDelete(e) {
    var player  = e.player;
    var gui     = e.gui;
    var world   = player.world;

    if (!pendingAdminBlockKey) {
        player.message("§cError: Block position lost. Please reopen the admin GUI.");
        return;
    }
    var blockKey = pendingAdminBlockKey;

    var data = getRentData(world);
    if (removeEntry(data, blockKey)) {
        saveRentData(world, data);
        player.message("§aAdblock entry at " + blockKey + " deleted from registry.");
        player.closeGui();
    } else {
        player.message("§cNo adblock entry found at your location.");
    }
}

// ----------------- CANCEL RENT -----------------
function handleCancelRent(e) {
    var player  = e.player;
    var gui     = e.gui;
    var world   = player.world;

    var data = getRentData(world);
    var playerName = player.getName();

    for (var i = 0; i < data.length; i++) {
        if (data[i].renter === playerName) {
            // Clear the renter and dates - no refund given
            data[i].renter = "";
            data[i].rentedDate = 0;
            data[i].expiryDate = 0;
            saveRentData(world, data);
            player.message("§cYour rent has been cancelled. No refund was given.");
            player.closeGui();
            return;
        }
    }
    player.message("§cYou are not currently renting any adblock.");
    player.closeGui();
}

// ----------------- GUI CLOSED -----------------
function customGuiClosed(e) {
    pendingBlockKey = null;
    pendingAdminBlockKey = null;
}
