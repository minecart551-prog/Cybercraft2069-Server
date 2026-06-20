// ===============================================================
// Door Block - checks nearby Access NPC for allowlist
// ===============================================================

var ACCESS_NPC_NAME   = "Access";       // must match the NPC's display name (no colour codes)
var ACCESS_NPC_RANGE  = 20;             // block radius to search for an Access NPC
var OPEN_DURATION     = 60;             // ticks the door stays open (60 = 3 seconds)

function interact(t) {
    t.setCanceled(true);   // never let vanilla toggle the door

    var player = t.player;
    var world  = t.block.world;

    // --- Find the nearest Access NPC ---
    var pos   = t.block.getPos();
    var found = null;

    // getNearbyEntities(pos, range, type) — type 2 = NPC
    var nearby = world.getNearbyEntities(pos, ACCESS_NPC_RANGE, 2);
    for (var i = 0; i < nearby.length; i++) {
        var npc = nearby[i];
        // Strip colour codes from name before comparing
        var rawName = npc.getName().replace(/§./g, "");
        if (rawName === ACCESS_NPC_NAME) {
            found = npc;
            break;
        }
    }

    if (!found) {
        player.message("§cNo Access NPC found nearby — door is locked.");
        return;
    }

    // --- Read allowlist from Access NPC ---
    var allowlist = [];
    try {
        var raw = found.getStoreddata().get("allowlist");
        if (raw) {
            var parts = String(raw).split(",");
            for (var p = 0; p < parts.length; p++) {
                var nm = parts[p].trim().toLowerCase();
                if (nm !== "") allowlist.push(nm);
            }
        }
    } catch (err) {}

    // --- Check if this player is allowed ---
    var playerName = player.getName().toLowerCase();
    var allowed    = false;
    for (var a = 0; a < allowlist.length; a++) {
        if (allowlist[a] === playerName) { allowed = true; break; }
    }

    if (!allowed) {
        player.message("§cAccess denied.");
        return;
    }

    // --- Open the door and start close timer ---
    t.block.setOpen(true);
    t.block.timers.forceStart(1, OPEN_DURATION, false);
    player.message("§aAccess granted.");
}

function timer(t) {
    if (t.id === 1) {
        t.block.setOpen(false);
    }
}
