// ===============================================================
// Secure Door - name whitelist + money-protection door
//
// - Right-click opens / closes the door
// - Shift + right-click opens the management GUI
// - Left-click to drains the door balance
// - Hold ADMIN_TOOL and right-click to open GUI without whitelist check
// ===============================================================

// ----------------- CONFIGURATION (edit these) -----------------

var DOOR_UNLOCKED_MODEL = "customnpcs:npcscripteddoortool"; // always used while balance is 0
var DOOR_LOCKED_MODEL   = "minecraft:iron_door";            // default skin while locked
var ADMIN_TOOL     = "minecraft:barrier";    // item that opens GUI without whitelist check
var BREAK_COOLDOWN = 40;                      // ticks between break attempts (40 = 2 seconds)
var BREAK_DAMAGE   = 2.0;                    // damage to attacker (2.0 = 1 heart)
var BREAK_COST     = 5;                     // balance drained per hit in cents ($0.10 = 10)
var OPEN_DURATION  = 60;                     // ticks door stays open (60 = 3 seconds)

// ----------------- GUI IDS -----------------

var GUI_DOOR      = 9100;
var LBL_TITLE     = 1;
var LBL_BALANCE   = 2;
var LBL_STATUS    = 3;
var LBL_WHITELIST = 4;
var LBL_AMOUNT    = 6;
var LBL_MODEL     = 5;
var LBL_INFO      = 99;
var TF_WHITELIST  = 10;
var TF_AMOUNT     = 11;
var TF_MODEL      = 12;
var BTN_SAVE_WL   = 20;
var BTN_DEPOSIT   = 22;
var BTN_WITHDRAW  = 23;
var BTN_SAVE_MODEL = 24;

// ----------------- PENDING STATE -----------------
// Stored during interact() so customGuiButton can read them
// (e.block is undefined in GUI callback events in CustomNPCs)

var pendingBlock = null;
var pendingWorld = null;
var scriptOpening = false;   // suppresses doorToggle veto while script opens door

// ----------------- ENTRY POINTS -----------------

function init(e) {
    applyModel(e.block);
    e.block.setHardness(-1);   // unbreakable - stick only drains money, never breaks block
}

function interact(e) {
    e.setCanceled(true);       // never let vanilla toggle the door

    var player  = e.player;
    var block   = e.block;
    var balance = getBalance(block);
    var white   = getWhitelist(block);
    var unlocked = balance <= 0;

    // --- Admin tool: right-click while holding barrier opens GUI without whitelist check ---
    var held = player.getMainhandItem();
    var isAdmin = held && !held.isEmpty() && held.getName() === ADMIN_TOOL;

    if (!unlocked && !isAdmin && !isAllowed(player, white)) {
        player.message("§cAccess denied. You are not on the whitelist. Left click to raid door");
        return;
    }

    // --- Shift + right-click = open management GUI ---
    if (player.isSneaking() || isAdmin) {
        pendingBlock = block;
        pendingWorld = block.world;
        openDoorGui(e, player, block, balance, white, unlocked, isAdmin);
        return;
    }

    // --- Normal right-click = toggle door ---
    if (block.getOpen()) {
        safeSetOpen(block, false);
        player.message("§7Door closed.");
    } else {
        safeSetOpen(block, true);
        block.getTimers().forceStart(1, OPEN_DURATION, false);
        player.message("§aDoor opened. Shift + right click to open panel. Left click to raid door");
    }
}

// Left-click on the door (attack event)
function clicked(e) {
    var player = e.player;
    var block  = e.block;


    var now  = block.world.getTotalTime();
    var last = getLastAttack(block);

    // --- Cooldown ---
    if (now - last < BREAK_COOLDOWN) {
        var waitSec = Math.ceil((BREAK_COOLDOWN - (now - last)) / 20);
        player.message("§cToo fast! Wait " + waitSec + "s before next attempt.");
        return;
    }

    // --- Apply damage to attacker ---
    player.damage(BREAK_DAMAGE);

    // --- Drain balance ---
    var balance = getBalance(block);
    balance = Math.max(0, balance - BREAK_COST);
    block.getStoreddata().put("balance", String(balance));
    block.getStoreddata().put("lastAttack", String(now));
    applyModel(block);

    if (balance <= 0) {
        player.message("§cDoor protection depleted! The door is now unlocked.");
        player.message("§7Its texture has returned to §f" + DOOR_UNLOCKED_MODEL);
    } else {
        player.message("§eYou struck the door. Remaining balance: §6" + fmt(balance));
    }
}

// Auto-close timer
function timer(e) {
    if (e.id === 1) {
        safeSetOpen(e.block, false);
    }
}

// Veto redstone / external toggles while the door is locked.
// getOpen() still returns the OLD state here: false = about to open.
function doorToggle(e) {
    if (scriptOpening) return;            // allow our own setOpen calls
    if (e.block.getOpen()) return;        // closing is always fine
    var balance = getBalance(e.block);
    if (balance > 0) {
        e.setCanceled(true);              // block redstone from opening a locked door
    }
}

// ----------------- GUI -----------------

function openDoorGui(e, player, block, balance, white, unlocked, isAdmin) {
    var width  = 260;
    var height = 180;
    var api    = e.API;

    var gui = api.createCustomGui(GUI_DOOR, width, height, false, player);

    gui.addLabel(LBL_TITLE, "§6§lDoor Control Panel", width / 2 - 65, 8, 130, 14);
    gui.addLabel(LBL_BALANCE, "§7Balance: §6" + fmt(balance), 15, 28, width - 30, 10);
    gui.addLabel(LBL_STATUS, "§7Status: " + (unlocked ? "§aUnlocked" : "§cLocked"), 15, 40, width - 30, 10);

    // --- Whitelist text field (comma-separated, like spawner.js) ---
    gui.addLabel(LBL_WHITELIST, "§7Name whitelist (comma-separated):", 15, 56, width - 30, 10);
    var wlText = white.length > 0 ? white.join(", ") : "";
    gui.addTextField(TF_WHITELIST, 15, 68, 190, 14).setText(wlText);
    gui.addButton(BTN_SAVE_WL, "§aSave", 210, 67, 40, 16);

    // --- Money ---
    gui.addLabel(LBL_AMOUNT, "§7Amount ($):", 15, 94, 80, 10);
    gui.addTextField(TF_AMOUNT, 15, 106, 100, 14);
    gui.addButton(BTN_DEPOSIT,  "§aDeposit",  120, 105, 65, 16);
    gui.addButton(BTN_WITHDRAW, "§eWithdraw", 190, 105, 65, 16);

    // --- Door texture (only editable while locked) ---
    gui.addLabel(LBL_MODEL, unlocked ? "§7Door texture (any door block id):"
                                     : "§7Door texture (any door block id):", 15, 128, width - 30, 10);
    var modelTf = gui.addTextField(TF_MODEL, 15, 140, 190, 14);
    modelTf.setText(unlocked ? DOOR_UNLOCKED_MODEL : (getCustomModel(block) || DOOR_LOCKED_MODEL));
    var applyBtn = gui.addButton(BTN_SAVE_MODEL, "§aApply", 210, 139, 40, 16);
    if (unlocked) {
        modelTf.setEnabled(false);
        applyBtn.setEnabled(false);
    }

    gui.addLabel(LBL_INFO, "§7Raid: left-click to attack", 15, 164, width - 30, 10);

    player.showCustomGui(gui);
}

function customGuiButton(e) {
    if (e.gui.getID() !== GUI_DOOR) return;

    var player = e.player;
    var bid    = e.buttonId;

    if (!pendingBlock) {
        player.message("§cError: door reference lost. Please close and reopen the menu.");
        return;
    }

    var block = pendingBlock;

    if      (bid === BTN_SAVE_WL)    handleSaveWhitelist(e, player, block);
    else if (bid === BTN_DEPOSIT)    handleDeposit(e, player, block);
    else if (bid === BTN_WITHDRAW)   handleWithdraw(e, player, block);
    else if (bid === BTN_SAVE_MODEL) handleSaveModel(e, player, block);
}

function customGuiClosed(e) {
    // Intentionally left empty: refreshGui() replaces the GUI which may
    // fire this callback, and clearing pending state here would break
    // subsequent button clicks. Pending state is simply overwritten on
    // the next interact() and is harmless while idle.
}

// ----------------- BUTTON HANDLERS -----------------

function handleSaveWhitelist(e, player, block) {
    var raw = readField(e, TF_WHITELIST);
    var names = [];

    if (raw && raw.trim() !== "") {
        var parts = raw.split(",");
        for (var i = 0; i < parts.length; i++) {
            var nm = parts[i].trim();
            if (nm !== "") names.push(nm);
        }
    }

    block.getStoreddata().put("whitelist", JSON.stringify(names));
    player.message("§aWhitelist saved: " + (names.length > 0 ? "§f" + names.join(", ") : "§7(empty)"));

    // Make sure the player saving a non-empty list is on it (prevents lockout)
    if (names.length > 0) {
        var onList = false;
        var myName = player.getName().toLowerCase();
        for (var j = 0; j < names.length; j++) {
            if (names[j].toLowerCase() === myName) { onList = true; break; }
        }
        if (!onList) {
            // Player is editing the list but removed themselves - that's their choice
        }
    }

    refreshGui(e, player, block);
}

function handleDeposit(e, player, block) {
    var cents = readAmount(e, player);
    if (cents <= 0) return;

    if (countCoins(player) < cents) {
        player.message("§cYou need " + fmt(cents) + " to deposit.");
        return;
    }

    if (!removeCoins(player, cents)) {
        player.message("§cFailed to take coins. Not enough funds.");
        return;
    }

    var balance = getBalance(block) + cents;
    block.getStoreddata().put("balance", String(balance));
    applyModel(block);

    // Auto-add depositor to whitelist so they never lock themselves out
    var white  = getWhitelist(block);
    var onList = false;
    for (var i = 0; i < white.length; i++) {
        if (white[i].toLowerCase() === player.getName().toLowerCase()) {
            onList = true;
            break;
        }
    }
    if (!onList) {
        white.push(player.getName());
        block.getStoreddata().put("whitelist", JSON.stringify(white));
    }

    player.message("§aDeposited §6" + fmt(cents) + "§a. Balance: §6" + fmt(balance));
    if (!onList) {
        player.message("§7Your name was added to the whitelist automatically.");
    }

    refreshGui(e, player, block);
}

function handleWithdraw(e, player, block) {
    var cents = readAmount(e, player);
    if (cents <= 0) return;

    var balance = getBalance(block);
    if (cents > balance) {
        player.message("§cDoor balance is only " + fmt(balance) + ".");
        return;
    }

    giveCoins(player, cents);
    balance -= cents;
    block.getStoreddata().put("balance", String(balance));
    applyModel(block);

    player.message("§aWithdrew §6" + fmt(cents) + "§a. Balance: §6" + fmt(balance));
    refreshGui(e, player, block);
}

// ----------------- DOOR TEXTURE -----------------

function handleSaveModel(e, player, block) {
    var balance = getBalance(block);
    if (balance <= 0) {
        player.message("§cThe door is unlocked, so its texture is fixed. Deposit money first.");
        refreshGui(e, player, block);
        return;
    }

    var raw = readField(e, TF_MODEL);
    raw = raw ? raw.trim().toLowerCase() : "";

    if (raw === "") {
        block.getStoreddata().put("model", "");
        applyModel(block);
        player.message("§7Texture reset to §f" + DOOR_LOCKED_MODEL);
        refreshGui(e, player, block);
        return;
    }

    if (!/^[a-z0-9_.-]+:[a-z0-9_./-]+$/.test(raw)) {
        player.message("§cInvalid id. Use the form namespace:block_name, e.g. minecraft:oak_door");
        refreshGui(e, player, block);
        return;
    }

    var before = block.getBlockModel();
    block.setBlockModel(raw);
    var after = block.getBlockModel();
    if (after !== raw) {
        block.setBlockModel(before);   // reject, keep whatever skin was active
        player.message("§c'" + raw + "' is not a door block.");
        refreshGui(e, player, block);
        return;
    }

    block.getStoreddata().put("model", raw);
    player.message("§aDoor texture set to §f" + raw);
    refreshGui(e, player, block);
}

// ----------------- GUI HELPERS -----------------

function readField(e, id) {
    try {
        var tf = e.gui.getComponent(id);
        if (tf) return tf.getText().trim();
    } catch (err) {}
    return "";
}

function readAmount(e, player) {
    var raw = readField(e, TF_AMOUNT);
    var dollars = parseFloat(raw);
    if (isNaN(dollars) || dollars <= 0) {
        player.message("§cPlease enter a valid positive amount.");
        return 0;
    }
    return Math.round(dollars * 100);
}

function refreshGui(e, player, block) {
    var balance  = getBalance(block);
    var white    = getWhitelist(block);
    var unlocked = balance <= 0;

    pendingBlock = block;
    pendingWorld = block.world;
    openDoorGui(e, player, block, balance, white, unlocked, false);
}

// ----------------- DOOR HELPERS -----------------

// Texture rule:
//   balance <= 0  -> always the unlocked skin, player choice is ignored
//   balance >  0  -> player's saved block id, or the default locked skin
function applyModel(block) {
    var want;
    if (getBalance(block) <= 0) {
        want = DOOR_UNLOCKED_MODEL;
    } else {
        want = getCustomModel(block) || DOOR_LOCKED_MODEL;
    }
    try {
        block.setBlockModel(want);
    } catch (err) {
        block.setBlockModel(DOOR_LOCKED_MODEL);
    }
}

function getCustomModel(block) {
    try {
        var raw = block.getStoreddata().get("model");
        if (raw !== null && raw !== undefined) return String(raw);
    } catch (err) {}
    return "";
}

// setOpen fires doorToggle which our handler may veto.
// Set scriptOpening so the veto is bypassed for script-initiated calls.
function safeSetOpen(block, open) {
    scriptOpening = true;
    try {
        block.setOpen(open);
    } finally {
        scriptOpening = false;
    }
}

function getBalance(block) {
    try {
        var raw = block.getStoreddata().get("balance");
        if (raw !== null && raw !== undefined) return parseFloat(String(raw));
    } catch (err) {}
    return 0;
}

function getWhitelist(block) {
    try {
        var raw = block.getStoreddata().get("whitelist");
        if (raw) return JSON.parse(String(raw));
    } catch (err) {}
    return [];
}

function getLastAttack(block) {
    try {
        var raw = block.getStoreddata().get("lastAttack");
        if (raw !== null && raw !== undefined) return parseFloat(String(raw));
    } catch (err) {}
    return -9999999;
}

function isAllowed(player, white) {
    var name = player.getName().toLowerCase();
    for (var i = 0; i < white.length; i++) {
        if (white[i].toLowerCase() === name) return true;
    }
    return false;
}

// ----------------- CURRENCY (same system as spawner.js) -----------------

var STONE_TO_COAL   = 100;
var COAL_TO_EMERALD = 100;

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

// Drain stone first, then coal, then emerald. Give exact change when breaking a larger coin.
function removeCoins(player, amount) {
    if (countCoins(player) < amount) return false;
    var remaining = amount;
    var inv = player.getInventory();

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

function giveCoins(player, cents) {
    var remaining = cents;
    var emeralds  = Math.floor(remaining / (STONE_TO_COAL * COAL_TO_EMERALD));
    remaining    -= emeralds * STONE_TO_COAL * COAL_TO_EMERALD;
    var coals     = Math.floor(remaining / STONE_TO_COAL);
    remaining    -= coals * STONE_TO_COAL;
    var stones    = remaining;
    if (emeralds > 0) try { player.giveItem(player.world.createItem("coins:emerald_coin", emeralds)); } catch (e) {}
    if (coals    > 0) try { player.giveItem(player.world.createItem("coins:coal_coin",    coals));    } catch (e) {}
    if (stones   > 0) try { player.giveItem(player.world.createItem("coins:stone_coin",   stones));   } catch (e) {}
}

function fmt(cents) {
    var dollars = Math.floor(cents / 100);
    var c       = cents % 100;
    return "$" + dollars + "." + (c < 10 ? "0" + c : c);
}
