// === Scripted Block Script ===
// - When a new player enters range: set tourQualified=false, spawn Tour Guide
// - Every tick: if Tour Guide is missing, respawn it
// - Gate: teleport unqualified players back to spawn when they LEAVE the safe range,
//         UNLESS they're currently locked into the tour, OR have ever been locked in before
//         (covers players who already finished, since tourStep resets to 0 on completion).
var RANGE          = 25;
var TOURTAG        = "tourGuideTriggered";
var TOUR_QUALIFIED = "tourQualified";
var TOUR_STEP      = "tourStep";       // written by the NPC script's persistProgress()
var EVER_LOCKED    = "tourEverLocked"; // owned entirely by this block script
var LOCKED_IN_STEP = 3;                // keep in sync with the NPC script's LOCKED_IN_STEP
var CLONE_X        = 2325;
var CLONE_Y        = -48;
var CLONE_Z        = 855;
var CLONE_TAB      = 3;
var CLONE_NAME     = "Tour Guide";
var SPAWN_X        = 2325;
var SPAWN_Y        = -48;
var SPAWN_Z        = 855;
var NEW_PLAYER_CARROT_COUNT = 32;
var CARROT_ITEM    = "minecraft:carrot";
var playersInRange = {};
var leaveGrace = {};

function tick(event) {
    var block   = event.block;
    var world   = block.getWorld();
    var pos     = block.getPos();
    var players = world.getNearbyEntities(pos, RANGE, 1);
    var currentlyHere = {};

    // ── AUTO-RESPAWN: always ensure Tour Guide is present ───────────────────
    var npcs       = world.getNearbyEntities(pos, RANGE, 2);
    var guideFound = false;
    for (var k = 0; k < npcs.length; k++) {
        if (npcs[k].getName() == CLONE_NAME) {
            guideFound = true;
            break;
        }
    }
    if (!guideFound) {
        world.spawnClone(CLONE_X, CLONE_Y, CLONE_Z, CLONE_TAB, CLONE_NAME);
    }

    // ── PLAYER LOOP ─────────────────────────────────────────────────────────
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        var uuid   = player.getUUID();
        currentlyHere[uuid] = player;

        // ── NEW PLAYER SETUP (runs once per player) ──────────────────────────
        if (player.storeddata.get(TOURTAG) != 1) {
            var carrotItem  = world.createItem(CARROT_ITEM, 1);
            var carrotCount = player.getInventory().count(carrotItem, true, true);
            if (carrotCount >= NEW_PLAYER_CARROT_COUNT) {
                if (player.storeddata.get(TOUR_QUALIFIED) == null) {
                    player.storeddata.put(TOUR_QUALIFIED, 0);
                }
                player.storeddata.put(TOURTAG, 1);
            }
        }

        // ── TRACK "ever locked in", purely from tourStep, while they're near us ──
        var liveStep = player.storeddata.get(TOUR_STEP);
        if (liveStep !== null && liveStep !== undefined && liveStep >= LOCKED_IN_STEP) {
            if (player.storeddata.get(EVER_LOCKED) != 1) {
                player.storeddata.put(EVER_LOCKED, 1);
            }
        }
    }

    // ── LEAVE DETECTION ─────────────────────────────────────────────────────
    for (var leftUuid in playersInRange) {
        if (!playersInRange.hasOwnProperty(leftUuid)) continue;
        if (currentlyHere[leftUuid]) {
            delete leaveGrace[leftUuid];
            continue;
        }

        var leftPlayer     = playersInRange[leftUuid];
        var qualifiedValue = leftPlayer.storeddata.get(TOUR_QUALIFIED);
        var tourStepValue  = leftPlayer.storeddata.get(TOUR_STEP);
        var everLocked     = leftPlayer.storeddata.get(EVER_LOCKED);

        var isCurrentlyLocked = tourStepValue !== null && tourStepValue !== undefined && tourStepValue >= LOCKED_IN_STEP;
        var hasFinishedBefore = everLocked == 1;

        // Skip the gate for anyone mid-tour right now, or who has ever completed
        // lock-in in the past (covers the post-completion tourStep-reset-to-0 case).
        if (isCurrentlyLocked || hasFinishedBefore) continue;

        // Grace period: don't teleport immediately on leaving range
        if (leaveGrace[leftUuid] === undefined) {
            leaveGrace[leftUuid] = 20;
            continue;
        }
        if (leaveGrace[leftUuid] > 0) {
            leaveGrace[leftUuid]--;
            continue;
        }

        if (qualifiedValue !== null && qualifiedValue !== undefined && qualifiedValue != 1) {
            leftPlayer.setPosition(SPAWN_X, SPAWN_Y, SPAWN_Z);
            leftPlayer.message("§e[Tour Guide] Please use the Tour Guide and finish the tour first!");
        }
    }

    playersInRange = currentlyHere;
}