// ===============================================================
// Secure Door - name whitelist + money-protection door
//
// - Only whitelisted players can open the door while it has balance
// - Balance = 0 => door is unlocked, anyone can open + manage GUI
// - Sneak + right-click opens the management GUI
// - Left-click with the break tool drains the door balance
// - Hold ADMIN_TOOL and right-click to open GUI without whitelist check
// ===============================================================

// ----------------- CONFIGURATION (edit these) -----------------

var DOOR_MODEL     = "minecraft:iron_door";  // default door model (edit to taste)
var BREAK_TOOL     = "minecraft:stick";      // item used to drain door balance
var ADMIN_TOOL     = "minecraft:barrier";    // item that opens GUI without whitelist check
var BREAK_COOLDOWN = 40;                     // ticks between break attempts (40 = 2 seconds)
var BREAK_DAMAGE   = 2.0;                    // damage to attacker (2.0 = 1 heart)
var BREAK_COST     = 10;                     // balance drained per hit in cents ($0.10 = 10)
var OPEN_DURATION  = 60;                     // ticks door stays open (60 = 3 seconds)

// ----------------- GUI IDS -----------------

var GUI_DOOR     = 9100;
var LBL_TITLE    = 1;
var LBL_BALANCE  = 2;
var LBL_STATUS   = 3;
var LBL_WHITELIST = 4;
var LBL_NAME     = 5;
var LBL_AMOUNT   = 6;
var LBL_INFO     = 99;
var TF_NAME      = 10;
var TF_AMOUNT    = 11;
var BTN_ADD      = 20;
var BTN_REMOVE   = 21;
var BTN_DEPOSIT  = 22;
var BTN_WITHDRAW = 23;

// ----------------- PENDING STATE -----------------
// Stored during interact() so customGuiButton can read them
// (e.block is undefined in GUI callback events in CustomNPCs)

var pendingBlock = null;
var pendingWorld = null;
var scriptOpening = false;   // suppresses doorToggle veto while script opens door

// ----------------- ENTRY POINTS -----------------

function init(e) {
    e.block.setBlockModel(DOOR_MODEL);
    e.block.setHardness(-1);   // unbreakable - stick only drains money, never breaks block
}

function interact(e) {
    e.setCanceled(true);       // never let vanilla toggle the door

    var player  = e.player;
    var block   = e.block;
    var balance = getBalance(block);
    var white   = getWhitelist(block);
    var unlocked = balance <= 0;

    // --- Admin tool: right-click while holding barrier opens GUI directly ---
    var held = player.getMainhandItem();
    if (held && !held.isEmpty() && held.getName() === ADMIN_TOOL) {
        pendingBlock = block;
        pendingWorld = block.world;
        openDoorGui(e, player, balance, white, unlocked);
        return;
    }

    // --- Sneak + right-click = management GUI ---
    if (player.isSneaking()) {
        if (!unlocked && !isAllowed(player, white)) {
            player.message("§cAccess denied. You are not on the whitelist.");
            return;
        }
        pendingBlock = block;
        pendingWorld = block.world;
        openDoorGui(e, player, balance, white, unlocked);
        return;
    }

    // --- Normal right-click = toggle door if authorized ---
    if (!unlocked && !isAllowed(player, white)) {
        player.message("§cAccess denied.");
        return;
    }

    if (block.getOpen()) {
        // Door is open -> close it
        safeSetOpen(block, false);
    } else {
        // Door is closed -> open it and start auto-close timer
        safeSetOpen(block, true);
        block.getTimers().forceStart(1, OPEN_DURATION, false);
        player.message("§aAccess granted.");
    }
}

// Left-click on the door (attack event)
function clicked(e) {
    var player = e.player;
    var block  = e.block;

    var hand = player.getMainhandItem();
    if (!hand || hand.isEmpty() || hand.getName() !== BREAK_TOOL) return;

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

    if (balance <= 0) {
        player.message("§cDoor protection depleted! The door is now unlocked.");
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

function openDoorGui(e, player, balance, white, unlocked) {
    var width  = 260;
    var height = 165;
    var api    = e.API;

    var gui = api.createCustomGui(GUI_DOOR, width, height, false, player);

    gui.addLabel(LBL_TITLE, "§6§lDoor Control Panel", width / 2 - 65, 8, 130, 14);
    gui.addLabel(LBL_BALANCE, "§7Balance: §6" + fmt(balance), 15, 28, width - 30, 10);
    gui.addLabel(LBL_STATUS, "§7Status: " + (unlocked ? "§aUnlocked" : "§cLocked"), 15, 40, width - 30, 10);

    var wlText = white.length > 0 ? white.join(", ") : "(empty)";
    gui.addLabel(LBL_WHITELIST, "§7Whitelist: §f" + wlText, 15, 52, width - 30, 10);

    gui.addLabel(LBL_NAME, "§7Player name:", 15, 70, 80, 10);
    gui.addTextField(TF_NAME, 15, 82, 140, 14);
    gui.addButton(BTN_ADD,    "§aAdd",    160, 81, 42, 16);
    gui.addButton(BTN_REMOVE, "§cRemove", 207, 81, 45, 16);

    gui.addLabel(LBL_AMOUNT, "§7Amount ($):", 15, 106, 80, 10);
    gui.addTextField(TF_AMOUNT, 15, 118, 100, 14);
    gui.addButton(BTN_DEPOSIT,  "§aDeposit",  120, 117, 65, 16);
    gui.addButton(BTN_WITHDRAW, "§eWithdraw", 190, 117, 65, 16);

    gui.addLabel(LBL_INFO, "§8Sneak + right-click to reopen this menu", 15, 145, width - 30, 10);

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

    if      (bid === BTN_ADD)      handleAddName(e, player, block);
    else if (bid === BTN_REMOVE)   handleRemoveName(e, player, block);
    else if (bid === BTN_DEPOSIT)  handleDeposit(e, player, block);
    else if (bid === BTN_WITHDRAW) handleWithdraw(e, player, block);
}

function customGuiClosed(e) {
    // Intentionally left empty: refreshGui() replaces the GUI which may
    // fire this callback, and clearing pending state here would break
    // subsequent button clicks. Pending state is simply overwritten on
    // the next interact() and is harmless while idle.
}

// ----------------- BUTTON HANDLERS -----------------

function handleAddName(e, player, block) {
    var name = readField(e, TF_NAME);
    if (name === "") {
        player.message("§cPlease enter a player name.");
        return;
    }

    var white = getWhitelist(block);
    for (var i = 0; i < white.length; i++) {
        if (white[i].toLowerCase() === name.toLowerCase()) {
            player.message("§e" + name + " is already on the whitelist.");
            return;
        }
    }

    white.push(name);
    block.getStoreddata().put("whitelist", JSON.stringify(white));
    player.message("§aAdded §f" + name + " §ato the whitelist.");
    refreshGui(e, player, block);
}

function handleRemoveName(e, player, block) {
    var name = readField(e, TF_NAME);
    if (name === "") {
        player.message("§cPlease enter a player name to remove.");
        return;
    }

    var white = getWhitelist(block);
    var found = false;
    for (var i = 0; i < white.length; i++) {
        if (white[i].toLowerCase() === name.toLowerCase()) {
            white.splice(i, 1);
            found = true;
            break;
        }
    }

    if (!found) {
        player.message("§c" + name + " is not on the whitelist.");
        return;
    }

    block.getStoreddata().put("whitelist", JSON.stringify(white));
    player.message("§aRemoved §f" + name + " §afrom the whitelist.");
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

    player.message("§aWithdrew §6" + fmt(cents) + "§a. Balance: §6" + fmt(balance));
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
    openDoorGui(e, player, balance, white, unlocked);
}

// ----------------- DOOR HELPERS -----------------

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
