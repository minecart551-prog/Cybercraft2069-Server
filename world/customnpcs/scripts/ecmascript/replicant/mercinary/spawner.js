// ===============================================================
// Clone Spawner - vendor NPC that sells "protector" clones
// ===============================================================

// ----------------- CONFIGURATION -----------------

var MAX_CLONES            = 5;
var OWNED_SEARCH_RANGE    = 100;
var OWNED_Y_TOLERANCE     = 3;
var SPAWN_MIN_RADIUS      = 0;
var SPAWN_MAX_RADIUS      = 0;
var COIN_DENOMINATIONS = [
    { id: "coins:emerald_coin", value: 10000 },
    { id: "coins:coal_coin",    value: 100   },
    { id: "coins:stone_coin",   value: 1     }
];

var CLONE_TYPES = [
    { tab: 5, name: "M3", displayName: "§bM3", price: 230 },
    { tab: 5, name: "M4", displayName: "§dM4", price: 1400 }
];

// ----------------- GUI LAYOUT -----------------

var GUI_SPAWNER      = 9001;
var LBL_TITLE        = 1;
var LBL_COUNT        = 2;
var LBL_CURRENCY     = 3;
var LBL_EXCLUDE      = 4;
var TF_EXCLUDE_NAMES = 10;
var BTN_CLONE_BASE   = 100;

var COLS   = 2;
var ROW_H  = 22;
var COL_W  = 170;
var LIST_X = 15;
var LIST_Y = 70;

// ----------------- PENDING STATE -----------------
// Store npc and world here when the GUI opens (in interact/openSpawnerGui)
// so customGuiButton and customGuiClosed can access them — e.npc is undefined
// in GUI callback events in CustomNPCs.

var pendingNpc          = null;
var pendingWorld        = null;
var pendingExcludeNames = [];
var pendingSx           = 0;
var pendingSy           = 0;
var pendingSz           = 0;
var pendingTemplateName = "";
var savedExcludeText    = "";   // persists the exclude field across GUI opens

// FIX (bug 2): store the spawner pos object in interact() so findNearbyClones
// can use it even after pendingNpc is cleared — world.createPos does not exist.
var pendingSpawnerPos   = null;

// ----------------- ENTRY POINTS -----------------

function init(e) {
    var npc = e.npc;
    npc.getDisplay().setName("§eMercinary Spawner");
    npc.getAi().setRetaliateType(0);
}

function interact(e) {
    var player = e.player;
    var npc    = e.npc;
    var world  = npc.getWorld();

    // Load the safelist from the spawner NPC's stored data
    var safelist = [];
    try {
        var stored = npc.getStoreddata().get("safelist");
        if (stored) { safelist = JSON.parse(String(stored)); }
    } catch (err) {}

    // If the player is NOT on the safelist, they can only open the GUI if
    // there are no clones active nearby (all must be cleared first).
    if (!isPlayerOnSafelist(player, safelist)) {
        var pos = npc.getPos();
        var nearbyClones = world.getNearbyEntities(pos, OWNED_SEARCH_RANGE, 2);
        var spawnerY = pos.getY();
        var cloneNames = {};
        for (var t = 0; t < CLONE_TYPES.length; t++) {
            cloneNames[CLONE_TYPES[t].name] = true;
        }
        var activeCount = 0;
        for (var i = 0; i < nearbyClones.length; i++) {
            var n = nearbyClones[i];
            if (!cloneNames[n.getName()]) continue;
            if (Math.abs(n.getY() - spawnerY) > OWNED_Y_TOLERANCE) continue;
            activeCount++;
        }
        if (activeCount > 0) {
            player.message("§cYou are not on the safe list! All active clones must be cleared first before you can use this spawner.");
            return;
        }
    }

    // Store npc and world NOW, while e.npc is valid, mirroring how the
    // contract script always accesses event.npc inside interact().
    pendingNpc   = npc;
    pendingWorld = world;

    // FIX (bug 2): snapshot the pos object here so findNearbyClones can use
    // it even after pendingNpc is cleared.
    pendingSpawnerPos = npc.getPos();

    // Load persisted exclude text from NPC stored data
    try {
        var stored = npc.getStoreddata().get("excludeText");
        if (stored) { savedExcludeText = String(stored); }
    } catch (err) {}

    openSpawnerGui(e);
}

function openSpawnerGui(e) {
    var player = e.player;
    var api    = e.API;

    var owned  = countOwnedClones(player, pendingWorld);
    var rows   = Math.ceil(CLONE_TYPES.length / COLS);
    var width  = LIST_X * 2 + COLS * COL_W;
    var height = LIST_Y + rows * ROW_H + 90;

    var gui = api.createCustomGui(GUI_SPAWNER, width, height, false, player);

    gui.addLabel(LBL_TITLE,    "§6§lClone Dealer",                              width / 2 - 40, 12, 120, 14);
    gui.addLabel(LBL_COUNT,    "§7Active clones: " + owned + " / " + MAX_CLONES, 15, 30, width - 30, 10);
    gui.addLabel(LBL_CURRENCY, "§6Wallet: §e" + fmt(countCoins(player)),         15, 44, width - 30, 10);

    for (var i = 0; i < CLONE_TYPES.length; i++) {
        var c   = CLONE_TYPES[i];
        var row = Math.floor(i / COLS);
        var col = i % COLS;
        var x   = LIST_X + col * COL_W;
        var y   = LIST_Y + row * ROW_H;
        gui.addButton(BTN_CLONE_BASE + i, c.displayName + " §7(" + fmt(c.price) + ")", x, y, COL_W - 10, 18);
    }

    var footerY = LIST_Y + rows * ROW_H + 10;
    gui.addLabel(LBL_EXCLUDE, "§eNames to exclude (comma separated, at least 1 required):", 15, footerY, width - 30, 10);
    gui.addTextField(TF_EXCLUDE_NAMES, 15, footerY + 12, width - 30, 14).setText(savedExcludeText);

    player.showCustomGui(gui);
}

function customGuiButton(e) {
    if (e.gui.getID() !== GUI_SPAWNER) return;

    var player = e.player;
    var bid    = e.buttonId;

    // Use pendingNpc/pendingWorld set during interact() — e.npc is undefined here
    if (!pendingNpc || !pendingWorld) {
        player.message("§cError: NPC reference lost. Please close and reopen the shop.");
        return;
    }

    if (bid < BTN_CLONE_BASE || bid >= BTN_CLONE_BASE + CLONE_TYPES.length) return;

    var index     = bid - BTN_CLONE_BASE;
    var cloneType = CLONE_TYPES[index];

    // ---- Read exclusion list from the text field (MUST come before payment) ----
    var excludeNames = [];
    try {
        var tf = e.gui.getComponent(TF_EXCLUDE_NAMES);
        if (tf) {
            var raw = tf.getText();
            if (raw && raw.trim() !== "") {
                var parts = raw.split(",");
                for (var p = 0; p < parts.length; p++) {
                    var nm = parts[p].trim();
                    if (nm !== "") excludeNames.push(nm);
                }
            }
            // Persist the text field value immediately so it survives GUI close/reopen
            savedExcludeText = tf.getText();
            if (pendingNpc) {
                pendingNpc.getStoreddata().put("excludeText", savedExcludeText);
            }
        }
    } catch (err) {}

    // Require at least one name in the safelist — without it the clone has no
    // safe list and would attack everyone, including the player who spawned it.
    if (excludeNames.length === 0) {
        player.message("§cYou must specify at least one name to exclude (your own name)!");
        return;
    }

    // ---- Cap check ----
    // FIX (bug 1): countOwnedClones now searches by template name from CLONE_TYPES
    // instead of a player-name prefix, so it correctly counts all active clones
    // regardless of what the spawned NPC is named.
    var owned = countOwnedClones(player, pendingWorld);
    if (owned >= MAX_CLONES) {
        player.message("§cThe maximum number of clones (" + MAX_CLONES + ") are already active!");
        return;
    }

    // ---- Payment check ----
    if (!removeCoins(player, cloneType.price)) {
        player.message("§cYou need " + fmt(cloneType.price) + " to hire a " + cloneType.displayName + "§c!");
        return;
    }

    // Store the safelist on the spawner NPC's own stored data BEFORE spawning.
    // The clone reads from the spawner directly (not itself), avoiding timing
    // issues where the clone isn't in the entity list right after spawnClone().
    if (pendingNpc) {
        pendingNpc.getStoreddata().put("safelist", JSON.stringify(excludeNames));
    }

    // ---- Spawn the clone near the dealer NPC ----
    var angle = Math.random() * Math.PI * 2;
    var dist  = SPAWN_MIN_RADIUS + Math.random() * (SPAWN_MAX_RADIUS - SPAWN_MIN_RADIUS);
    var sx    = Math.floor(pendingSpawnerPos.getX() + Math.cos(angle) * dist);
    var sz    = Math.floor(pendingSpawnerPos.getZ() + Math.sin(angle) * dist);
    var sy    = pendingSpawnerPos.getY();

    var spawnedClone = null;
    try {
        spawnedClone = pendingWorld.spawnClone(sx, sy, sz, cloneType.tab, cloneType.name);
    } catch (err) {
        player.message("§cSomething went wrong spawning your clone - refunding payment.");
        giveCoins(player, cloneType.price);
        return;
    }

    // Write safelist directly to the spawned entity if spawnClone returned it
    if (spawnedClone) {
        try {
            spawnedClone.getStoreddata().put("safelist", JSON.stringify(excludeNames));
        } catch (err) {}
    }

    // Broadcast the updated safelist to ALL existing clones owned by this player
    updateAllCloneSafelists(pendingWorld, player, excludeNames);

    // Also try to write safelist directly to any clones already in the world
    var clones = findNearbyClones(pendingWorld, sx, sy, cloneType.name);
    for (var c = 0; c < clones.length; c++) {
        clones[c].getStoreddata().put("safelist", JSON.stringify(excludeNames));
    }

    // Store remaining pending state for customGuiClosed
    pendingExcludeNames = excludeNames;
    pendingSx           = sx;
    pendingSy           = sy;
    pendingSz           = sz;
    pendingTemplateName = cloneType.name;

    player.message("§aHired a " + cloneType.displayName + "§a! Close this menu to confirm your safe list.");
}

function customGuiClosed(e) {
    if (e.gui.getID() !== GUI_SPAWNER) return;
    if (!pendingWorld) return;

    // Read the current text field value and build the exclude list
    var excludeNames = [];
    try {
        var tf = e.gui.getComponent(TF_EXCLUDE_NAMES);
        if (tf) {
            var raw = tf.getText();
            savedExcludeText = raw;
            if (raw && raw.trim() !== "") {
                var parts = raw.split(",");
                for (var p = 0; p < parts.length; p++) {
                    var nm = parts[p].trim();
                    if (nm !== "") excludeNames.push(nm);
                }
            }
        }
    } catch (err) {}

    // If we have names from the text field, broadcast to ALL clones
    if (excludeNames.length > 0) {
        // The player might not be available here, so find a player near the spawner
        // to use for the broadcast function. Fall back to the player from pending state.
        if (pendingNpc) {
            pendingNpc.getStoreddata().put("safelist", JSON.stringify(excludeNames));
        }
        // Broadcast to all clones within range of the spawner
        updateAllCloneSafelists(pendingWorld, null, excludeNames);
    }

    // Re-scan to catch any clones that loaded after the button click
    var clones = findNearbyClones(pendingWorld, pendingSx, pendingSy, pendingTemplateName);
    for (var i = 0; i < clones.length; i++) {
        clones[i].getStoreddata().put("safelist", JSON.stringify(pendingExcludeNames.length > 0 ? pendingExcludeNames : excludeNames));
    }

    // Save the exclude text to NPC stored data
    if (pendingNpc) {
        pendingNpc.getStoreddata().put("excludeText", savedExcludeText);
    }

    // Clear all pending state
    pendingNpc          = null;
    pendingWorld        = null;
    pendingExcludeNames = [];
    pendingSx           = 0;
    pendingSy           = 0;
    pendingSz           = 0;
    pendingTemplateName = "";
    pendingSpawnerPos   = null;
}

// ----------------- HELPERS -----------------

function isPlayerOnSafelist(player, safelist) {
    var name = player.getName().toLowerCase();
    for (var i = 0; i < safelist.length; i++) {
        if (safelist[i].toLowerCase() === name) return true;
    }
    return false;
}

// Update the safelist on ALL existing clones within range of the spawner NPC.
// This ensures old clones get the updated list when the player changes it.
function updateAllCloneSafelists(world, player, safeList) {
    if (!pendingSpawnerPos) return;
    var spawnerY = pendingSpawnerPos.getY();
    var allNpcs = world.getNearbyEntities(pendingSpawnerPos, OWNED_SEARCH_RANGE, 2);
    var listStr = JSON.stringify(safeList);

    // Build a lookup set of all valid clone template names
    var cloneNames = {};
    for (var t = 0; t < CLONE_TYPES.length; t++) {
        cloneNames[CLONE_TYPES[t].name] = true;
    }

    for (var i = 0; i < allNpcs.length; i++) {
        var n = allNpcs[i];
        if (!cloneNames[n.getName()]) continue;
        if (Math.abs(n.getY() - spawnerY) > OWNED_Y_TOLERANCE) continue;
        n.getStoreddata().put("safelist", listStr);
    }
}

// FIX (bug 1): count clones by matching any name from CLONE_TYPES within
// search range of the spawner NPC, using the spawner's Y level with tolerance.
function countOwnedClones(player, world) {
    if (!pendingSpawnerPos) return 0;
    var spawnerY = pendingSpawnerPos.getY();
    var nearby  = world.getNearbyEntities(pendingSpawnerPos, OWNED_SEARCH_RANGE, 2);
    var count   = 0;

    // Build a lookup set of all valid clone template names
    var cloneNames = {};
    for (var t = 0; t < CLONE_TYPES.length; t++) {
        cloneNames[CLONE_TYPES[t].name] = true;
    }

    for (var i = 0; i < nearby.length; i++) {
        var npc = nearby[i];
        var nm  = npc.getName();
        if (!nm) continue;
        if (!cloneNames[nm]) continue;  // not a clone type we sell
        if (Math.abs(npc.getY() - spawnerY) > OWNED_Y_TOLERANCE) continue;
        count++;
    }

    return count;
}

// FIX (bug 2): search from pendingSpawnerPos captured in interact() —
// world.createPos does not exist in CustomNPCs; we reuse the real pos object.
function findNearbyClones(world, sx, sy, templateName) {
    if (!pendingSpawnerPos) return [];
    var spawnerY = pendingSpawnerPos.getY();
    var nearby    = world.getNearbyEntities(pendingSpawnerPos, SPAWN_MAX_RADIUS + 5, 2);
    var matches   = [];

    for (var i = 0; i < nearby.length; i++) {
        var npc = nearby[i];
        if (npc.getName() !== templateName) continue;
        if (Math.abs(npc.getY() - spawnerY) > OWNED_Y_TOLERANCE) continue;
        matches.push(npc);
    }

    return matches;
}

// ----------------- CURRENCY -----------------

// Conversion rates — must match COIN_DENOMINATIONS values above:
//   1 coal   = 100  stone
//   1 emerald = 100 coal = 10,000 stone
var STONE_TO_COAL    = 100;
var COAL_TO_EMERALD  = 100;

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

// Drain stone first, then coal, then emerald.
// When breaking a larger coin, give exact change back in smaller denominations.
function removeCoins(player, amount) {
    if (countCoins(player) < amount) return false;
    var remaining = amount;
    var inv = player.getInventory();

    // --- stone coins ---
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

    // --- coal coins ---
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

    // --- emerald coins ---
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
    var remaining   = cents;
    var emeralds    = Math.floor(remaining / (STONE_TO_COAL * COAL_TO_EMERALD));
    remaining      -= emeralds * STONE_TO_COAL * COAL_TO_EMERALD;
    var coals       = Math.floor(remaining / STONE_TO_COAL);
    remaining      -= coals * STONE_TO_COAL;
    var stones      = remaining;
    if (emeralds > 0) try { player.giveItem(player.world.createItem("coins:emerald_coin", emeralds)); } catch (e) {}
    if (coals    > 0) try { player.giveItem(player.world.createItem("coins:coal_coin",    coals));    } catch (e) {}
    if (stones   > 0) try { player.giveItem(player.world.createItem("coins:stone_coin",   stones));   } catch (e) {}
}

function fmt(cents) {
    var dollars = Math.floor(cents / 100);
    var c       = cents % 100;
    return "$" + dollars + "." + (c < 10 ? "0" + c : c);
}
