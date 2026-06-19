// ===============================================================
// Clone Spawner - vendor NPC that sells "protector" clones
// ===============================================================

// ----------------- CONFIGURATION -----------------

var MAX_CLONES            = 5;
var OWNED_SEARCH_RANGE    = 50;
var OWNED_Y_TOLERANCE     = 3;
var SPAWN_MIN_RADIUS      = 0;
var SPAWN_MAX_RADIUS      = 0;
var COIN_DENOMINATIONS = [
    { id: "coins:emerald_coin", value: 10000 },
    { id: "coins:coal_coin",    value: 100   },
    { id: "coins:stone_coin",   value: 1     }
];

var CLONE_TYPES = [
    { tab: 5, name: "M3", displayName: "§bM3", price: 50 }
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
// FIX: store npc and world here when the GUI opens (in interact/openSpawnerGui)
// so customGuiButton and customGuiClosed can access them — e.npc is undefined
// in GUI callback events in CustomNPCs.

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
    // Store npc and world NOW, while e.npc is valid, mirroring how the
    // contract script always accesses event.npc inside interact().
    pendingNpc   = e.npc;
    pendingWorld = e.npc.getWorld();
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

    gui.addLabel(LBL_TITLE,    "§6§lClone Dealer",                             width / 2 - 40, 12, 120, 14);
    gui.addLabel(LBL_COUNT,    "§7Active clones: " + owned + " / " + MAX_CLONES, 15, 30, width - 30, 10);
    gui.addLabel(LBL_CURRENCY, "§6Wallet: §e" + fmt(countCoins(player)),        15, 44, width - 30, 10);

    for (var i = 0; i < CLONE_TYPES.length; i++) {
        var c   = CLONE_TYPES[i];
        var row = Math.floor(i / COLS);
        var col = i % COLS;
        var x   = LIST_X + col * COL_W;
        var y   = LIST_Y + row * ROW_H;
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
    var bid    = e.buttonId;

    // Use pendingNpc/pendingWorld set during interact() — e.npc is undefined here
    if (!pendingNpc || !pendingWorld) {
        player.message("§cError: NPC reference lost. Please close and reopen the shop.");
        return;
    }

    if (bid < BTN_CLONE_BASE || bid >= BTN_CLONE_BASE + CLONE_TYPES.length) return;

    var index     = bid - BTN_CLONE_BASE;
    var cloneType = CLONE_TYPES[index];

    // ---- Cap check ----
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

    // Owner is always safe
    excludeNames.push(player.getName());

    // ---- Spawn the clone near the dealer NPC ----
    var pos   = pendingNpc.getPos();
    var angle = Math.random() * Math.PI * 2;
    var dist  = SPAWN_MIN_RADIUS + Math.random() * (SPAWN_MAX_RADIUS - SPAWN_MIN_RADIUS);
    var sx    = Math.floor(pos.getX() + Math.cos(angle) * dist);
    var sz    = Math.floor(pos.getZ() + Math.sin(angle) * dist);
    var sy    = pos.getY();

    try {
        pendingWorld.spawnClone(sx, sy, sz, cloneType.tab, cloneType.name);
    } catch (err) {
        player.message("§cSomething went wrong spawning your clone - refunding payment.");
        giveCoins(player, cloneType.price);
        return;
    }

    // Write safelist to newly spawned clones
    var clones = findNearbyClones(pendingWorld, sx, sy, sz, cloneType.name);
    for (var c = 0; c < clones.length; c++) {
        clones[c].getStoreddata().putString("safelist", JSON.stringify(excludeNames));
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

function countOwnedClones(player, world) {
    var prefix  = player.getName() + "'s ";
    var playerY = player.getY();
    var nearby  = world.getNearbyEntities(player.getPos(), OWNED_SEARCH_RANGE, 2);
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

function findNearbyClones(world, sx, sy, sz, templateName) {
    var pos     = pendingNpc.getPos(); 
    var nearby  = world.getNearbyEntities(pos, SPAWN_MAX_RADIUS + 5, 2);
    var matches = [];
    for (var i = 0; i < nearby.length; i++) {
        var npc = nearby[i];
        if (npc.getName() !== templateName) continue;
        if (Math.abs(npc.getY() - sy) > OWNED_Y_TOLERANCE) continue;
        matches.push(npc);
    }
    return matches;
}

// ----------------- CURRENCY -----------------

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

function removeCoins(player, cents) {
    if (countCoins(player) < cents) return false;
    var inv       = player.getInventory();
    var size      = inv.getSize();
    var remaining = cents;
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

function fmt(cents) {
    var dollars = Math.floor(cents / 100);
    var c       = cents % 100;
    return "$" + dollars + "." + (c < 10 ? "0" + c : c);
}
