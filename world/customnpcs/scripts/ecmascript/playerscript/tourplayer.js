// === Player Script - Tour Resume ===
// Attach this script to the player. On login (init), if the player has
// unfinished tour progress saved, respawn the Tour Guide NPC clone at their
// last known tour location and lock it to them by name.

var STEP_KEY = "tourStep";
var LOCK_NAME_KEY = "lockedPlayerName";
var EXISTING_NPC_SEARCH_RANGE = 10; // how far to check for an already-spawned guide

// The clone id/name used in world.spawnClone() — must match your existing
// "Tour Guide" clone setup (id 3 in your original spawn call).
var CLONE_ID = 3;
var CLONE_NAME = "Tour Guide";

// If the player disconnected right at step 4 (the elevator/path step whose
// saved position isn't safe to resume at), instead resume them at step 5's
// location/coords.
var UNSAFE_STEP = 4;
var UNSAFE_STEP_RESUME_COORDS = [2462, -41, 842];
var UNSAFE_STEP_RESUME_STEP = 5;

function init(event) {
    var player = event.player;

    var savedStep = player.storeddata.get(STEP_KEY);
    if (savedStep === null || savedStep === undefined || savedStep <= 0) {
        return; // no unfinished tour, nothing to do
    }

    var x, y, z, resumeStep;

    if (savedStep === UNSAFE_STEP) {
        x = UNSAFE_STEP_RESUME_COORDS[0];
        y = UNSAFE_STEP_RESUME_COORDS[1];
        z = UNSAFE_STEP_RESUME_COORDS[2];
        resumeStep = UNSAFE_STEP_RESUME_STEP;
    } else {
        x = player.storeddata.get("tourX");
        y = player.storeddata.get("tourY");
        z = player.storeddata.get("tourZ");
        resumeStep = savedStep;

        if (x === null || x === undefined ||
            y === null || y === undefined ||
            z === null || z === undefined) {
            return; // no saved position, can't safely respawn
        }
    }

    // Bring the player to the saved tour location first so we can search
    // from there for a guide NPC that might already be alive (e.g. if this
    // player reconnected during the old NPC's missing-player grace period).
    player.setPosition(x, y, z);

    var world = player.world;
    var nearbyNpcs = world.getNearbyEntities(player.getPos(), EXISTING_NPC_SEARCH_RANGE, 2); // 2 = npcs

    var existingNpc = null;
    if (nearbyNpcs !== null && nearbyNpcs !== undefined) {
        for (var i = 0; i < nearbyNpcs.length; i++) {
            var candidate = nearbyNpcs[i];
            if (candidate.getName() === CLONE_NAME &&
                candidate.storeddata.get(LOCK_NAME_KEY) === player.getName()) {
                existingNpc = candidate;
                break;
            }
        }
    }

    if (existingNpc !== null) {
        player.message("§e[Tour Guide] Welcome back! Your guide is right here.");
        return;
    }

    var npc = world.spawnClone(x, y, z, CLONE_ID, CLONE_NAME);

    // Lock the freshly spawned NPC to this player and restore its step.
    npc.storeddata.put(LOCK_NAME_KEY, player.getName());
    npc.storeddata.put(STEP_KEY, resumeStep);
    npc.reset();

    player.message("§e[Tour Guide] Welcome back! Talk to me to continue your tour.");
}
