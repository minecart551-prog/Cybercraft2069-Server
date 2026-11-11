// === Player Script - Tour Resume ===
// Attach this script to the player. On login (init), if the player has
// unfinished tour progress saved, put them back at their last known tour
// location. The guide is only re-created AND locked to them when they were
// genuinely locked into the tour (saved step >= 4); before that the guide
// stays shared so other players can still click it to reset the tour.

var STEP_KEY = "tourStep";
var LOCK_NAME_KEY = "lockedPlayerName";
var EARLY_OWNER_KEY = "earlyOwner"; // pre-lock tour owner, owned by tourguide.js
var EXISTING_NPC_SEARCH_RANGE = 150; // how far to check for an already-spawned guide
var LOCAL_GUIDE_SEARCH_RANGE = 30;   // how far to look for a guide at the resume spot

// The clone id/name used in world.spawnClone() — must match your existing
// "Tour Guide" clone setup (id 3 in your original spawn call).
var CLONE_ID = 3;
var CLONE_NAME = "Tour Guide";

// Keep in sync with tourguide.js: LOCKED_IN_STEP is the step index where the
// NPC actually calls lockToPlayer(). Because the NPC persists tourStep after
// incrementing it, a saved step of <= 3 means the player only ever saw index
// 0-2 (e.g. the "Your items will be kept..." message) and was NEVER locked in.
var LOCKED_IN_STEP = 3;

// If the player disconnected right at step 4 (the elevator/path step whose
// saved position isn't safe to resume at), instead resume them at step 5's
// location/coords.
var UNSAFE_STEP = 4;
var UNSAFE_STEP_RESUME_COORDS = [2462, -41, 842];
var UNSAFE_STEP_RESUME_STEP = 5;

// storeddata.put(key, null) can come back as the literal string "null", so
// treat null / undefined / "null" / "" as "nothing stored here" (same helper
// as tourguide.js — scripts don't share scope).
function isBlank(v) {
    return v === null || v === undefined || v === "null" || v === "";
}

// A guide this player is allowed to use: one that isn't locked to somebody
// else. Returns null when there's none, in which case a fresh one is spawned.
// Used so a returning player doesn't get a second guide spawned on top of
// them — the spawner block already keeps one alive at spawn.
function findUsableGuide(player) {
    var nearby = player.world.getNearbyEntities(player.getPos(), LOCAL_GUIDE_SEARCH_RANGE, 2);
    if (nearby === null || nearby === undefined) return null;
    for (var i = 0; i < nearby.length; i++) {
        if (nearby[i].getName() !== CLONE_NAME) continue;
        var lock = nearby[i].storeddata.get(LOCK_NAME_KEY);
        if (isBlank(lock) || lock === player.getName()) return nearby[i];
    }
    return null;
}

function init(event) {
    var player = event.player;

    var savedStep = player.storeddata.get(STEP_KEY);
    // storeddata.put(key, null) stores the literal string "null" in some APIs,
    // so we must also check for that, empty string, and string "0".
    if (savedStep === null || savedStep === undefined || savedStep === "null" || savedStep === "" || savedStep <= 0) {
        return; // no unfinished tour, nothing to do
    }
    // Convert to number for numeric comparisons
    savedStep = parseInt(savedStep, 10);
    if (isNaN(savedStep) || savedStep <= 0) return;

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

    // ── PRE-LOCK RESUME (saved step <= 3) ──────────────────────────────────
    // The guide never moved from spawn and lockToPlayer() never ran, so there
    // is nothing to respawn "with" the player: the spawner block already keeps
    // a guide alive at spawn. Spawn one only if it's genuinely missing, and
    // above all do NOT write LOCK_NAME_KEY here — locking on resume used to
    // freeze the tour to this player one step early, which stopped other
    // players from clicking the guide to reset it.
    if (resumeStep <= LOCKED_IN_STEP) {
        var existing = findUsableGuide(player);
        if (existing === null) {
            var earlyGuide = world.spawnClone(x, y + 2, z, CLONE_ID, CLONE_NAME);
            // Make sure a clone that inherited stale data comes back unlocked,
            // with this player as the pre-lock owner of their own tour.
            earlyGuide.storeddata.put(LOCK_NAME_KEY, "");
            earlyGuide.storeddata.put(EARLY_OWNER_KEY, player.getName());
            earlyGuide.storeddata.put(STEP_KEY, resumeStep);
            earlyGuide.reset();
        } else {
            // A usable guide is already here — reuse it instead of spawning a
            // second one on top of the player. Nudge it forward to where this
            // player left off, but never rewind it if someone else is further
            // along in the tour.
            var guideStep = parseInt(existing.storeddata.get(STEP_KEY), 10);
            if (isNaN(guideStep)) guideStep = 0;
            if (guideStep < resumeStep) {
                existing.storeddata.put(STEP_KEY, resumeStep);
                existing.reset();
            }
        }
        player.message("§e[Tour Guide] Welcome back! Talk to me to continue your tour.");
        return;
    }

    // ── GENUINE LOCK-IN RESUME (saved step >= 4) ───────────────────────────
    // The player was locked into the tour before they left, so the guide is
    // theirs again on return.
    var npc = world.spawnClone(x, y+2, z, CLONE_ID, CLONE_NAME);

    // Lock the freshly spawned NPC to this player and restore its step.
    npc.storeddata.put(LOCK_NAME_KEY, player.getName());
    npc.storeddata.put(STEP_KEY, resumeStep);
    npc.reset();

    // The NPC's own init() will check for duplicates and despawn if another
    // guide with the same LOCK_NAME_KEY already exists nearby.
    // If it does despawn, the player already has a guide nearby.
    player.message("§e[Tour Guide] Welcome back! Talk to me to continue your tour.");
}
