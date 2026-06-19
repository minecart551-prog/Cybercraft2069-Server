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

var MAX_CLONES_PER_PLAYER = 3;      // Max clones a single player may have active at once
var OWNED_SEARCH_RANGE    = 200;    // Range around the player used to count their existing clones
var SPAWN_MIN_RADIUS      = 2;
var SPAWN_MAX_RADIUS      = 4;
var CURRENCY_ITEM         = "coins:stone_coin"; // Item used to pay for clones

// Add as many clone types here as you like - the GUI builds itself
// automatically from this list (more entries = more rows, no other
// changes needed). "name" must match the saved NPC clone's name/tab
// exactly, the same way it's used with world.spawnClone elsewhere.
var CLONE_TYPES = [
    { tab: 1, name: "M3",  displayName: "§bM3",   price: 50  },

];

var SAFE_LIST_PREFIX = "clonespawner_safelist_";

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
    gui.addLabel(LBL_COUNT, "§7Your clones: " + owned + " / " + MAX_CLONES_PER_PLAYER, 15, 30, width - 30, 10);
    gui.addLabel(LBL_CURRENCY, "§7Prices shown in " + CURRENCY_ITEM, 15, 44, width - 30, 10);

    for (var i = 0; i < CLONE_TYPES.length; i++) {
        var c   = CLONE_TYPES[i];
        var row  = Math.floor(i / COLS);
        var col  = i % COLS;
        var x    = LIST_X + col * COL_W;
        var y    = LIST_Y + row * ROW_H;
        gui.addButton(BTN_CLONE_BASE + i, c.displayName + " §7(" + c.price + ")", x, y, COL_W - 10, 18);
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
    if (owned >= MAX_CLONES_PER_PLAYER) {
        player.message("§cYou already have the maximum number of clones (" + MAX_CLONES_PER_PLAYER + ")!");
        return;
    }

    // ---- Payment check ----
    if (!removeItemAmount(player, CURRENCY_ITEM, cloneType.price)) {
        player.message("§cYou need " + cloneType.price + " " + CURRENCY_ITEM + " to hire a " + cloneType.displayName + "§c!");
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
    var sx    = pos.getX() + Math.cos(angle) * dist;
    var sz    = pos.getZ() + Math.sin(angle) * dist;
    var sy    = pos.getY();

    var clone = null;
    try {
        clone = world.spawnClone(Math.floor(sx), sy, Math.floor(sz), cloneType.tab, cloneType.name);
    } catch (err) {}

    // Some CustomNPCs versions don't hand back a usable reference from
    // spawnClone - fall back to grabbing the freshly-created NPC by
    // scanning right next to the spawn point.
    if (!clone || typeof clone.getUUID !== "function") {
        clone = claimFreshClone(world, npc, cloneType.name);
    }

    if (!clone) {
        player.message("§cSomething went wrong spawning your clone - refunding payment.");
        try { player.giveItem(world.createItem(CURRENCY_ITEM, cloneType.price)); } catch (err) {}
        return;
    }

    try {
        clone.getDisplay().setName(player.getName() + "'s " + cloneType.displayName);
    } catch (err) {}

    var tempData = world.getTempdata();
    tempData.put(SAFE_LIST_PREFIX + clone.getUUID(), JSON.stringify(excludeNames));

    player.message("§aHired a " + cloneType.displayName + "§a! It will protect you from anyone not on your safe list.");
    player.closeGui();
}

function customGuiClosed(e) {}

// ----------------- HELPERS -----------------

// Counts this player's clones by looking for the owner-prefixed name
// among nearby NPCs - the same "scan nearby + match on name" approach
// used elsewhere for tracking spawned entities.
function countOwnedClones(player, world) {
    var prefix = player.getName() + "'s ";
    var nearby = world.getNearbyEntities(player.getPos(), OWNED_SEARCH_RANGE, 2); // 2 = NPCs
    var count = 0;
    for (var i = 0; i < nearby.length; i++) {
        var nm = nearby[i].getName();
        if (nm && nm.indexOf(prefix) === 0) count++;
    }
    return count;
}

// Fallback claim: find the just-spawned NPC of this template that
// hasn't been tagged with a safe list yet.
function claimFreshClone(world, npc, cloneName) {
    var tempData = world.getTempdata();
    var nearby = world.getNearbyEntities(npc.getPos(), SPAWN_MAX_RADIUS + 5, 2);
    for (var i = 0; i < nearby.length; i++) {
        var candidate = nearby[i];
        if (candidate.getName() === cloneName) {
            try {
                if (!tempData.has(SAFE_LIST_PREFIX + candidate.getUUID())) {
                    return candidate;
                }
            } catch (err) {}
        }
    }
    return null;
}

function removeItemAmount(player, itemId, amount) {
    var inv = player.getInventory();
    var size = inv.getSize();
    var remaining = amount;
    for (var i = 0; i < size && remaining > 0; i++) {
        var item = inv.getSlot(i);
        if (item != null && item.getName() === itemId) {
            var stackSize = item.getStackSize();
            if (stackSize <= remaining) {
                remaining -= stackSize;
                inv.setSlot(i, null);
            } else {
                item.setStackSize(stackSize - remaining);
                inv.setSlot(i, item);
                remaining = 0;
            }
        }
    }
    return remaining === 0;
}
