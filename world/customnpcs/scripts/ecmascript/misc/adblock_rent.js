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

// Currency: stone_coin = cent, coal_coin = dollar, emerald_coin = 100 dollars
var STONE_TO_COAL   = 100;  // 1 dollar = 100 cents
var COAL_TO_EMERALD = 100;  // 1 emerald = 100 dollars

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
var INFO_BTN_CANCEL_RENT  = 46;

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
var ADM_LBL_TITLE      = 50;
var ADM_LBL_COST       = 51;
var ADM_TF_COST        = 52;
var ADM_LBL_TP         = 53;
var ADM_TF_TP          = 54;
var ADM_BTN_SAVE       = 60;
var ADM_BTN_DELETE     = 61;
var ADM_BTN_CLOSE      = 62;
var ADM_LBL_STATUS     = 63;
var ADM_LBL_RENTER     = 64;
var ADM_LBL_RENTER_EXP = 65;

// Store block position for GUI button callbacks (block reference not available in customGuiButton)
var pendingBlockKey = null;
var pendingAdminBlockKey = null;

function init(e) {
    e.block.setModel("minecraft:light_gray_concrete");
}

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
    var now = java.lang.System.currentTimeMillis();
    return now >= entry.expiryDate;
}

// ----------------- CURRENCY HELPERS -----------------
// stone_coin = cent, coal_coin = dollar (100 cents), emerald_coin = 100 dollars (10000 cents)
// All amounts stored internally in cents.

function countCents(player) {
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

function removeCents(player, amount) {
    if (countCents(player) < amount) return false;
    var remaining = amount;
    var inv = player.getInventory();

    // stone coins (cents)
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

    // coal coins (dollars)
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (!stack || stack.isEmpty() || stack.getName() !== "coins:coal_coin") continue;
        var stackAmount = stack.getStackSize();
        var centValue  = stackAmount * STONE_TO_COAL;
        if (centValue <= remaining) {
            inv.setSlot(i, null);
            remaining -= centValue;
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

    // emerald coins (100 dollars each)
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (!stack || stack.isEmpty() || stack.getName() !== "coins:emerald_coin") continue;
        var stackAmount = stack.getStackSize();
        var centValue  = stackAmount * STONE_TO_COAL * COAL_TO_EMERALD;
        if (centValue <= remaining) {
            inv.setSlot(i, null);
            remaining -= centValue;
        } else {
            var emeraldsNeeded = Math.ceil(remaining / (STONE_TO_COAL * COAL_TO_EMERALD));
            stack.setStackSize(stackAmount - emeraldsNeeded);
            var overpaid    = (emeraldsNeeded * STONE_TO_COAL * COAL_TO_EMERALD) - remaining;
            remaining = 0;
            var changeDollars = Math.floor(overpaid / STONE_TO_COAL);
            var changeCents   = overpaid % STONE_TO_COAL;
            if (changeDollars > 0) {
                try { player.giveItem(player.world.createItem("coins:coal_coin",  changeDollars)); } catch (e) {}
            }
            if (changeCents > 0) {
                try { player.giveItem(player.world.createItem("coins:stone_coin", changeCents)); } catch (e) {}
            }
        }
    }

    return true;
}

// Parses "5.20" into cents (520)
function dollarsToCents(dollarStr) {
    dollarStr = dollarStr.trim();
    if (dollarStr.indexOf(".") === -1) {
        return parseInt(dollarStr) * 100;
    }
    var parts = dollarStr.split(".");
    var dollars = parseInt(parts[0]) || 0;
    var centsStr = parts[1];
    if (centsStr.length === 1) centsStr = centsStr + "0";
    else if (centsStr.length > 2) centsStr = centsStr.substring(0, 2);
    var cents = parseInt(centsStr) || 0;
    return dollars * 100 + cents;
}

// Formats cents as "$X.XX"
function fmtDollars(cents) {
    var dollars = Math.floor(cents / 100);
    var c = cents % 100;
    return "$" + dollars + "." + (c < 10 ? "0" + c : c);
}

function fmtTime(ms) {
    var Date = Java.type('java.util.Date');
    var SimpleDateFormat = Java.type('java.text.SimpleDateFormat');
    var formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    return formatter.format(new Date(ms));
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

    var now = java.lang.System.currentTimeMillis();
    var currentTimeStr = fmtTime(now);

    gui.addLabel(INFO_LBL_CURRENT_TIME, "§7Current Time: §f" + currentTimeStr, 15, 35, 250, 10);

    if (entry && entry.renter && entry.renter !== "" && !isExpired(entry)) {
        gui.addLabel(INFO_LBL_RENTER, "§7Rented by: §e" + entry.renter, 15, 55, 250, 10);
        gui.addLabel(INFO_LBL_EXPIRY_TIME, "§7Expires: §c" + fmtTime(entry.expiryDate), 15, 75, 250, 10);
        gui.addLabel(INFO_LBL_COST, "§7Cost per day: §a" + fmtDollars(entry.rentCostCents || 0), 15, 95, 250, 10);

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

    var costCentsPerDay = existingEntry ? (existingEntry.rentCostCents || 0) : 0;

    gui.addLabel(RENT_LBL_TITLE, "§6§lRent This AdBlock", width / 2 - 60, 10, 160, 14);
    gui.addLabel(RENT_LBL_COST_DAY, "§7Cost per day: §a" + fmtDollars(costCentsPerDay), 15, 35, 200, 10);
    gui.addLabel(RENT_LBL_BALANCE, "§6Wallet: §e" + fmtDollars(countCents(player)), 15, 55, 200, 10);

    gui.addLabel(RENT_LBL_DAYS_LABEL, "§7Days (1-" + MAX_RENT_DAYS + "):", 15, 80, 100, 10);
    gui.addTextField(RENT_TF_DAYS, 110, 77, 50, 16).setText("1");

    gui.addLabel(RENT_LBL_TOTAL, "§7Total: §a" + fmtDollars(costCentsPerDay * 1), 15, 105, 200, 10);

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

    gui.addLabel(ADM_LBL_COST, "§7Rent Cost per Day (enter as §eD.CC §7e.g. 5.20):", 15, 35, 250, 10);
    gui.addTextField(ADM_TF_COST, 15, 48, 100, 16).setText(entry ? fmtDollarsNoSign(entry.rentCostCents || 0) : "0.00");

    gui.addLabel(ADM_LBL_TP, "§7Teleport Coordinates (X Y Z):", 15, 75, 250, 10);
    gui.addTextField(ADM_TF_TP, 15, 90, 200, 16).setText(formatTpCoords(entry));

    gui.addButton(ADM_BTN_SAVE,   "§a§lSave",   40,  130, 80, 20);
    gui.addButton(ADM_BTN_DELETE, "§c§lDelete", 140, 130, 80, 20);
    gui.addButton(ADM_BTN_CLOSE,  "§7Close",    width / 2 - 30, 175, 60, 20);

    gui.addLabel(ADM_LBL_STATUS, "", 15, 155, 250, 10);

    if (entry && entry.renter && entry.renter !== "") {
        gui.addLabel(ADM_LBL_RENTER, "§7Current Renter: §e" + entry.renter, 15, 200, 250, 10);
        gui.addLabel(ADM_LBL_RENTER_EXP, "§7Expires: §c" + fmtTime(entry.expiryDate), 15, 215, 250, 10);
    }

    player.showCustomGui(gui);
}

function fmtDollarsNoSign(cents) {
    var dollars = Math.floor(cents / 100);
    var c = cents % 100;
    return dollars + "." + (c < 10 ? "0" + c : c);
}

function formatTpCoords(entry) {
    if (!entry || entry.tpX === undefined) return "0 0 0";
    return entry.tpX + " " + entry.tpY + " " + entry.tpZ;
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
        if (buttonId === INFO_BTN_CLOSE) {
            player.closeGui();
            return;
        }

        if (buttonId === INFO_BTN_TELEPORT) {
            var data = getRentData(world);
            var playerName = player.getName();
            for (var i = 0; i < data.length; i++) {
                if (data[i].renter === playerName) {
                    var tpX = data[i].tpX;
                    var tpY = data[i].tpY;
                    var tpZ = data[i].tpZ;
                    if (tpX !== undefined && tpY !== undefined && tpZ !== undefined) {
                        player.setPosition(tpX, tpY, tpZ);
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

        if (buttonId === INFO_BTN_CANCEL_RENT) {
            handleCancelRent(e);
            return;
        }

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
        if (buttonId === ADM_BTN_CLOSE) {
            player.closeGui();
            return;
        }

        if (buttonId === ADM_BTN_SAVE) {
            handleAdminSave(e);
            return;
        }

        if (buttonId === ADM_BTN_DELETE) {
            handleAdminDelete(e);
            return;
        }
        return;
    }
}

// ----------------- RENT FROM INFO -----------------
function openRentFromInfo(player, api, world) {
    var data = getRentData(world);
    var playerX = Math.floor(player.getX());
    var playerY = Math.floor(player.getY());
    var playerZ = Math.floor(player.getZ());

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

    var costCentsPerDay = entry ? (entry.rentCostCents || 0) : 0;

    gui.addLabel(RENT_LBL_TITLE, "§6§lRent This AdBlock", width / 2 - 60, 10, 160, 14);
    gui.addLabel(RENT_LBL_COST_DAY, "§7Cost per day: §a" + fmtDollars(costCentsPerDay), 15, 35, 200, 10);
    gui.addLabel(RENT_LBL_BALANCE, "§6Wallet: §e" + fmtDollars(countCents(player)), 15, 55, 200, 10);

    gui.addLabel(RENT_LBL_DAYS_LABEL, "§7Days (1-" + MAX_RENT_DAYS + "):", 15, 80, 100, 10);
    gui.addTextField(RENT_TF_DAYS, 110, 77, 50, 16).setText("1");

    gui.addLabel(RENT_LBL_TOTAL, "§7Total: §a" + fmtDollars(costCentsPerDay * 1), 15, 105, 200, 10);

    gui.addButton(RENT_BTN_PAY, "§a§lPay & Rent", width / 2 - 70, 135, 80, 20);
    gui.addButton(RENT_BTN_CANCEL, "§7Cancel", width / 2 + 10, 135, 60, 20);

    player.showCustomGui(gui);
}

function handleRentPayment(e) {
    var player  = e.player;
    var gui     = e.gui;
    var world   = player.world;

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

    var data = getRentData(world);
    var entry = null;
    var blockKey = null;

    if (pendingBlockKey) {
        entry = findEntry(data, pendingBlockKey);
        blockKey = pendingBlockKey;
    }

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

    var costCentsPerDay = entry.rentCostCents || 0;
    if (costCentsPerDay <= 0) {
        player.message("§cThis adblock has no rent cost configured. Ask an admin to set it.");
        return;
    }

    var totalCents = costCentsPerDay * days;
    var now = java.lang.System.currentTimeMillis();
    var expiryMs = days * 24 * 60 * 60 * 1000;

    if (countCents(player) < totalCents) {
        player.message("§cYou need " + fmtDollars(totalCents) + " to rent for " + days + " day(s). You have " + fmtDollars(countCents(player)) + ".");
        return;
    }

    if (!removeCents(player, totalCents)) {
        player.message("§cTransaction failed! Could not remove coins.");
        return;
    }

    entry.renter = player.getName();
    entry.rentedDate = now;
    entry.expiryDate = now + expiryMs;

    saveRentData(world, data);

    pendingBlockKey = null;
    player.message("§aYou have rented this adblock for " + days + " day(s)! Cost: " + fmtDollars(totalCents));
    player.closeGui();
}

// ----------------- ADMIN SAVE -----------------
function handleAdminSave(e) {
    var player  = e.player;
    var gui     = e.gui;
    var world   = player.world;

    var costField = gui.getComponent(ADM_TF_COST);
    var tpField   = gui.getComponent(ADM_TF_TP);

    if (!costField || !tpField) {
        player.message("§cError reading admin fields.");
        return;
    }

    // Parse cost in dollar.cents format
    var costStr = costField.getText().trim();
    if (costStr === "") costStr = "0.00";
    var costCents = dollarsToCents(costStr);
    if (costCents < 0) {
        player.message("§cInvalid cost! Enter as dollars.cents (e.g. 5.20).");
        return;
    }

    // Parse teleport coords "x y z"
    var tpStr = tpField.getText().trim();
    var tpParts = tpStr.split(/\s+/);
    if (tpParts.length < 3) {
        player.message("§cEnter teleport coords as: X Y Z (space separated)");
        return;
    }
    var tpX = parseInt(tpParts[0]);
    var tpY = parseInt(tpParts[1]);
    var tpZ = parseInt(tpParts[2]);
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
        entry = {
            blockPos: blockKey,
            renter: "",
            rentedDate: 0,
            expiryDate: 0,
            rentCostCents: costCents,
            tpX: tpX,
            tpY: tpY,
            tpZ: tpZ
        };
        data.push(entry);
        player.message("§aNew adblock entry created at " + blockKey);
    } else {
        entry.rentCostCents = costCents;
        entry.tpX = tpX;
        entry.tpY = tpY;
        entry.tpZ = tpZ;
        player.message("§aAdblock settings saved!");
    }

    saveRentData(world, data);

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