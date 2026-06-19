// ===============================================================
// Clone Spawner - vendor NPC that sells "protector" clones
// ===============================================================
// Attach this script to a CustomNPCs NPC (e.g. a "Clone Dealer").
// Players talk to it, pick a clone type from the GUI, pay the
// price, type in names to exclude, and a clone is spawned that
// will defend them against anyone NOT on that safe list.
//
// Pair this with clone_defender.js, which must be assigned to
// EVERY clone NPC template listed in CLONE_TYPES below.
// ===============================================================

// ----------------- CONFIGURATION -----------------

var MAX_CLONES        = 3;
var OWNED_SEARCH_RANGE    = 50;    // XZ range to count a player's existing clones
var OWNED_Y_TOLERANCE     = 3;      // Max Y difference to count a clone as "nearby"
var SPAWN_MIN_RADIUS      = 0;
var SPAWN_MAX_RADIUS      = 0;
// Coin denominations - item id -> cent value.
// Must match whatever the coins mod uses on your server.
var COIN_DENOMINATIONS = [
    { id: "coins:emerald_coin",    value: 10000  },
    { id: "coins:coal_coin",    value: 100   },
    { id: "coins:stone_coin",   value: 1    }
];

// Add as many clone types here as you like - the GUI builds itself
// automatically from this list (more entries = more rows, no other
// changes needed). "name" must match the saved NPC clone's name/tab
// exactly, the same way it's used with world.spawnClone elsewhere.
var CLONE_TYPES = [
    { tab: 5, name: "M3",  displayName: "§bM3",   price: 50  },

];

// ----------------- GUI LAYOUT -----------------

var GUI_SPAWNER      = 9001;
var LBL_TITLE        = 1;
var LBL_COUNT        = 2;
var LBL_CURRENCY     = 3;
var LBL_EXCLUDE      = 4;
var TF_EXCLUDE_NAMES = 10;
var BTN_CLONE_BASE   = 100; // BTN_CLONE_BASE + index per clone type

var COLS   = 2;
var ROW_H  = 22;
var COL_W  = 170;
var LIST_X = 15;
var LIST_Y = 70;

// ----------------- PENDING STATE -----------------
// Holds data between button click (spawn) and GUI close (safelist write).
// Cleared on close regardless of outcome.

var pendingNpc          = null;
var pendingWorld        = null;
var pendingExcludeNames = [];
var pendingSx           = 0;
var pendingSy           = 0;
var pendingSz           = 0;
var pendingTemplateName = "";

// ----------------- ENTRY POINTS -----------------

function init(e) {
    var npc = e.npc;
    npc.getDisplay().setName("§eClone Dealer");
    npc.getAi().setRetaliateType(0);
}

function interact(e) {
    openSpawnerGui(e);
}

function openSpawnerGui(e) {
    var player = e.player;
    var api    = e.API;
    var npc    = e.npc;
    var world  = npc.world;

    var owned  = countOwnedClones(player, world);
    var rows   = Math.ceil(CLONE_TYPES.length / COLS);
    var width  = LIST_X * 2 + COLS * COL_W;
    var height = LIST_Y + rows * ROW_H + 90;

    var gui = api.createCustomGui(GUI_SPAWNER, width, height, false, player);

    gui.addLabel(LBL_TITLE, "§6§lClone Dealer", width / 2 - 40, 12, 120, 14);
    gui.addLabel(LBL_COUNT, "§7Active clones: " + owned + " / " + MAX_CLONES, 15, 30, width - 30, 10);
    gui.addLabel(LBL_CURRENCY, "§6Wallet: §e" + fmt(countCoins(player)), 15, 44, width - 30, 10);

    for (var i = 0; i < CLONE_TYPES.length; i++) {
        var c   = CLONE_TYPES[i];
        var row  = Math.floor(i / COLS);
        var col  = i % COLS;
        var x    = LIST_X + col * COL_W;
        var y    = LIST_Y + row * ROW_H;
        gui.addButton(BTN_CLONE_BASE + i, c.displayName + " §7(" + fmt(c.price) + ")", x, y, COL_W - 10, 18);
    }

    var footerY = LIST_Y + rows * ROW_H + 10;
    gui.addLabel(LBL_EXCLUDE, "§7Names to exclude (comma separated):", 15, footerY, width - 30, 10);
    gui.addTextField(TF_EXCLUDE_NAMES, 15, footerY + 12, width - 30, 14).setText("");

    player.showCustomGui(gui);
}

function customGuiButton(e) {
    if (e.gui.getID() !== GUI_SPAWNER) return;

    var player = e.player;
    var npc    = e.npc;
    var world  = npc.world;
    var bid    = e.buttonId;

    if (bid < BTN_CLONE_BASE || bid >= BTN_CLONE_BASE + CLONE_TYPES.length) return;

    var index     = bid - BTN_CLONE_BASE;
    var cloneType = CLONE_TYPES[index];

    // ---- Cap check ----
    var owned = countOwnedClones(player, world);
    if (owned >= MAX_CLONES) {
        player.message("§cThe maximum number of clones (" + MAX_CLONES + ") are already active!");
        return;
    }

    // ---- Payment check ----
    if (!removeCoins(player, cloneType.price)) {
        player.message("§cYou need " + fmt(cloneType.price) + " to hire a " + cloneType.displayName + "§c!");
        return;
    }

    // ---- Read exclusion list from the text field ----
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
        }
    } catch (err) {}

    // The owner is always safe, regardless of what they typed
    excludeNames.push(player.getName());

    // ---- Spawn the clone near the dealer NPC ----
    var pos   = npc.getPos();
    var angle = Math.random() * Math.PI * 2;
    var dist  = SPAWN_MIN_RADIUS + Math.random() * (SPAWN_MAX_RADIUS - SPAWN_MIN_RADIUS);
    var sx    = Math.floor(pos.getX() + Math.cos(angle) * dist);
    var sz    = Math.floor(pos.getZ() + Math.sin(angle) * dist);
    var sy    = pos.getY();

    try {
        world.spawnClone(sx, sy, sz, cloneType.tab, cloneType.name);
    } catch (err) {
        player.message("§cSomething went wrong spawning your clone - refunding payment.");
        giveCoins(player, cloneType.price);
        return;
    }

    // ---- Locate all matching clones at the spawn position and store
    //      the reference list — safelist is written to all of them on GUI close. ----
    var clones = findNearbyClones(world, sx, sy, sz, cloneType.name);
    for (var c = 0; c < clones.length; c++) {
        clones[c].getStoreddata().putString("safelist", JSON.stringify(excludeNames));
    }

    // Store state for customGuiClosed to re-apply on close
    pendingNpc          = npc;
    pendingWorld        = world;
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

    // Re-scan to catch any clones that loaded after the button click
    var clones = findNearbyClones(pendingWorld, pendingSx, pendingSy, pendingSz, pendingTemplateName);
    for (var i = 0; i < clones.length; i++) {
        clones[i].getStoreddata().putString("safelist", JSON.stringify(pendingExcludeNames));
    }

    // Clear all pending state
    pendingNpc          = null;
    pendingWorld        = null;
    pendingExcludeNames = [];
    pendingSx           = 0;
    pendingSy           = 0;
    pendingSz           = 0;
    pendingTemplateName = "";
}

// ----------------- HELPERS -----------------

// Counts a player's active clones by scanning nearby NPCs whose name
// matches any clone template name, within OWNED_SEARCH_RANGE on XZ
// and OWNED_Y_TOLERANCE blocks on Y. No data is stored anywhere.
function countOwnedClones(player, world) {
    var prefix  = player.getName() + "'s ";
    var playerY = player.getY();
    var nearby  = world.getNearbyEntities(player.getPos(), OWNED_SEARCH_RANGE, 2); // 2 = NPCs
    var count   = 0;

    for (var i = 0; i < nearby.length; i++) {
        var npc = nearby[i];
        var nm  = npc.getName();
        if (!nm) continue;
        if (nm.indexOf(prefix) !== 0) continue;
        if (Math.abs(npc.getY() - playerY) > OWNED_Y_TOLERANCE) continue;
        count++;
    }

    return count;
}

// Returns ALL nearby NPCs matching templateName within range and Y tolerance.
function findNearbyClones(world, sx, sy, sz, templateName) {
    var nearby  = world.getNearbyEntitiesAt(sx, sy, sz, SPAWN_MAX_RADIUS + 2, 2); // 2 = NPCs
    var matches = [];
    for (var i = 0; i < nearby.length; i++) {
        var npc = nearby[i];
        if (npc.getName() !== templateName) continue;
        if (Math.abs(npc.getY() - sy) > OWNED_Y_TOLERANCE) continue;
        matches.push(npc);
    }
    return matches;
}

// ----------------- CURRENCY (matches lobby block system) -----------------

// Returns total cents across all coin denominations in the player's inventory.
function countCoins(player) {
    var inv   = player.getInventory();
    var size  = inv.getSize();
    var total = 0;
    for (var i = 0; i < size; i++) {
        var item = inv.getSlot(i);
        if (!item) continue;
        for (var d = 0; d < COIN_DENOMINATIONS.length; d++) {
            if (item.getName() === COIN_DENOMINATIONS[d].id) {
                total += item.getStackSize() * COIN_DENOMINATIONS[d].value;
                break;
            }
        }
    }
    return total;
}

// Removes coins worth `cents` from the player's inventory, preferring
// larger denominations first. Returns false if the player can't afford it.
function removeCoins(player, cents) {
    if (countCoins(player) < cents) return false;
    var inv       = player.getInventory();
    var size      = inv.getSize();
    var remaining = cents;
    // Iterate denominations largest -> smallest
    for (var d = 0; d < COIN_DENOMINATIONS.length && remaining > 0; d++) {
        var denom = COIN_DENOMINATIONS[d];
        for (var i = 0; i < size && remaining > 0; i++) {
            var item = inv.getSlot(i);
            if (!item || item.getName() !== denom.id) continue;
            var canTake  = Math.floor(remaining / denom.value);
            var inStack  = item.getStackSize();
            var toRemove = Math.min(canTake, inStack);
            if (toRemove <= 0) continue;
            remaining -= toRemove * denom.value;
            if (toRemove >= inStack) {
                inv.setSlot(i, null);
            } else {
                item.setStackSize(inStack - toRemove);
                inv.setSlot(i, item);
            }
        }
    }
    return true;
}

// Gives coins to the player, using the largest denominations that fit evenly.
function giveCoins(player, cents) {
    var remaining = cents;
    for (var d = 0; d < COIN_DENOMINATIONS.length && remaining > 0; d++) {
        var denom = COIN_DENOMINATIONS[d];
        var count = Math.floor(remaining / denom.value);
        if (count <= 0) continue;
        remaining -= count * denom.value;
        try { player.giveItem(player.world.createItem(denom.id, count)); } catch (e) {}
    }
}

// Formats a cent value to a dollar string, matching the lobby display style.
function fmt(cents) {
    var dollars = Math.floor(cents / 100);
    var c       = cents % 100;
    return "$" + dollars + "." + (c < 10 ? "0" + c : c);
}
