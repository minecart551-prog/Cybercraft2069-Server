// ╔══════════════════════════════════════════════════════════╗
// ║              ★  LOOT BOX — GUI LAYOUT  ★                ║
// ╚══════════════════════════════════════════════════════════╝

var GUI_WIDTH  = 140;
var GUI_HEIGHT = 160;

// ── Single reel slot ─────────────────────────────────────────
var REEL_X         = 70;   // centre of the single slot
var REEL_Y         = -30;
var REEL_SLOT_SIZE = 18;

// ── Gold frame around the reel ───────────────────────────────
var FRAME_PADDING   = 6;
var FRAME_COLOR     = 0xFFD700;
var FRAME_THICKNESS = 2;

// ── Title label ──────────────────────────────────────────────
var TITLE_X     = 38;
var TITLE_Y     = -75;
var TITLE_SCALE = 1.0;

// ── Key counter label ──────────────────────────────────────
var KEYS_X     = -35;
var KEYS_Y     = -90;
var KEYS_SCALE = 0.8;

// ── Status / result message label ────────────────────────────
var MSG_X     = 20;
var MSG_Y     = 10;
var MSG_SCALE = 0.85;

// ── Payout hint label (bottom of GUI) ────────────────────────
var HINT_X     = 0;
var HINT_Y     = 80;
var HINT_SCALE = 0.65;

// ── Spin button ──────────────────────────────────────────────
var BTN_X      = 40;
var BTN_Y      = 40;
var BTN_WIDTH  = 78;
var BTN_HEIGHT = 20;

// ╔══════════════════════════════════════════════════════════╗
// ║                ★  LOOT BOX CONFIG  ★                    ║
// ╚══════════════════════════════════════════════════════════╝

// Cost to spin (keys consumed per pull)
var KEY_COST = 1;

var LOOT_POOL = [
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "ClawK",
    tag: { ArmourersWorkshop: { Identifier: "db:KMA8zMeLB8", SkinType: "armourers:head" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "SculkFlower",
    tag: { ArmourersWorkshop: { Identifier: "db:NYKduRYbt9", SkinType: "armourers:head" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "SilverWolfGoggles",
    tag: { ArmourersWorkshop: { Identifier: "db:cDJ3wvFly6", SkinType: "armourers:head" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "unicorn",
    tag: { ArmourersWorkshop: { Identifier: "db:bab7qNoUb2", SkinType: "armourers:head" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "Kyubi Legs Purple",
    tag: { ArmourersWorkshop: { Identifier: "db:kGYWGWEAIO", SkinType: "armourers:legs" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "Interphone",
    tag: { ArmourersWorkshop: { Identifier: "db:8b1epW1BoP", SkinType: "armourers:chest" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "Dogtag",
    tag: { ArmourersWorkshop: { Identifier: "db:i1Rcst2uck", SkinType: "armourers:chest" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "flickereye",
    tag: { ArmourersWorkshop: { Identifier: "db:LqkmUggPSq", SkinType: "armourers:head" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "redclaw",
    tag: { ArmourersWorkshop: { Identifier: "db:6ESpTssjDd", SkinType: "armourers:chest" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "Dante's Sony walkman: music player",
    tag: { ArmourersWorkshop: { Identifier: "db:JkKgqtTjUN", SkinType: "armourers:chest" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "handred",
    tag: { ArmourersWorkshop: { Identifier: "db:ws0U4ZS6WO", SkinType: "armourers:chest" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "NekoTail",
    tag: { ArmourersWorkshop: { Identifier: "db:71k5JLrFFG", SkinType: "armourers:chest" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "Halo",
    tag: { ArmourersWorkshop: { Identifier: "db:EZQJQTUuDH", SkinType: "armourers:head" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "DHILHorns",
    tag: { ArmourersWorkshop: { Identifier: "db:jxFscbzFiK", SkinType: "armourers:head" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "ColdWeatherParka",
    tag: { ArmourersWorkshop: { Identifier: "db:BkZaq4SdEQ", SkinType: "armourers:outfit" } }
},
{
    id:    "armourers_workshop:skin",
    count: 1,
    label: "DiscoGlasses",
    tag: { ArmourersWorkshop: { Identifier: "db:g6OF3Orwkb", SkinType: "armourers:head" } }
},
];

// ── Spin animation phases ─────────────────────────────────────
var PHASE_FAST_INTERVAL   = 1;
var PHASE_FAST_DURATION   = 4;

var PHASE_MEDIUM_INTERVAL = 3;
var PHASE_MEDIUM_DURATION = 12;

var PHASE_SLOW_INTERVAL   = 7;
var PHASE_SLOW_DURATION   = 4;

// ── Concrete powder items shown while spinning ────────────────
var SPIN_VISUALS = [
    { id: "minecraft:white_concrete_powder",      count: 1, label: "", tag: {} },
    { id: "minecraft:yellow_concrete_powder",     count: 1, label: "", tag: {} },
    { id: "minecraft:green_concrete_powder",      count: 1, label: "", tag: {} },
    { id: "minecraft:orange_concrete_powder",     count: 1, label: "", tag: {} },
    { id: "minecraft:light_blue_concrete_powder", count: 1, label: "", tag: {} },
    { id: "minecraft:pink_concrete_powder",       count: 1, label: "", tag: {} },
    { id: "minecraft:red_concrete_powder",        count: 1, label: "", tag: {} },
];

// ╔══════════════════════════════════════════════════════════╗
// ║           SNBT BUILDER — same as shop script            ║
// ╚══════════════════════════════════════════════════════════╝

function snbtValue(v) {
    if (v === null || v === undefined) return "0";
    if (typeof v === "string" && v.charAt(0) === "[") return v;
    if (typeof v === "string") return '"' + v.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    if (typeof v === "boolean") return v ? "1b" : "0b";
    if (typeof v === "number") {
        if (v === Math.floor(v)) return String(v);
        return v + "d";
    }
    if (Array.isArray(v)) {
        var parts = [];
        for (var i = 0; i < v.length; i++) parts.push(snbtValue(v[i]));
        return "[" + parts.join(",") + "]";
    }
    if (typeof v === "object") return snbtCompound(v);
    return String(v);
}

function snbtCompound(obj) {
    var parts = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            parts.push(key + ":" + snbtValue(obj[key]));
        }
    }
    return "{" + parts.join(",") + "}";
}

// Build a full SNBT string from a pool entry
function buildEntrySnbt(entry) {
    var tagObj = entry.tag ? entry.tag : {};
    var tagParts = [];
    for (var key in tagObj) {
        if (!tagObj.hasOwnProperty(key)) continue;
        tagParts.push(key + ":" + snbtValue(tagObj[key]));
    }
    var count = entry.count || 1;
    return '{id:"' + entry.id + '",Count:' + count + 'b,tag:{' + tagParts.join(",") + '}}';
}

// Create the actual ItemStack for a pool entry
function createEntryItem(entry, player, api) {
    var snbt = buildEntrySnbt(entry);
    return player.world.createItemFromNbt(api.stringToNbt(snbt));
}

// Create a plain concrete powder item (no custom tag needed)
function createVisualItem(entry, player, api) {
    var snbt = '{id:"' + entry.id + '",Count:1b,tag:{}}';
    return player.world.createItemFromNbt(api.stringToNbt(snbt));
}

// ╔══════════════════════════════════════════════════════════╗
// ║              INTERNAL — do not edit below               ║
// ╚══════════════════════════════════════════════════════════╝

var ID_SPIN_BTN = 10;
var ID_TITLE    = 20;
var ID_MSG      = 21;
var ID_KEYS     = 22;

// ── Spin-lock globals ─────────────────────────────────────────
var spinningPlayer = null;
var spinningGui    = null;
var spinningReel   = null;
var spinningResult = -1;   // index into LOOT_POOL

// ── Per-session GUI state ─────────────────────────────────────
var guiRef     = null;
var lastBlock  = null;
var lastPlayer = null;
var lastApi    = null;
var reelSlot   = null;

var spinning      = false;
var spinTick      = 0;
var displayIndex  = 0;   // which SPIN_VISUALS frame we are on
var finalIndex    = -1;  // chosen LOOT_POOL index

// ── Reel animation state ──────────────────────────────────────
var reelLocked     = false;
var reelPhase      = 0;
var reelPhaseStart = 0;
var reelNextFlip   = 0;

// ── Safe GUI update helper ────────────────────────────────────
function safeUpdate(gui) {
    if (!gui) return;
    try { gui.update(); } catch(e) {}
}

// ── Block init ────────────────────────────────────────────────
function init(event) {
    event.block.setModel("minecraft:light_blue_shulker_box");
    event.block.setRotation(0, 0, 0);
}

// ── Open GUI ──────────────────────────────────────────────────
function interact(event) {
    var player = event.player;

    if (spinning) {
        player.message("§cThe loot box is currently spinning!");
        return;
    }

    var api    = event.API;
    lastBlock  = event.block;
    lastPlayer = player;
    lastApi    = api;

    spinTick      = 0;
    displayIndex  = 0;
    finalIndex    = -1;

    try { player.closeScreen(); } catch(e) {}

    guiRef = api.createCustomGui(GUI_WIDTH, GUI_HEIGHT, 0, true, player);
    if (!guiRef) {
        player.message("§cFailed to open the loot box GUI. Try again.");
        return;
    }

    guiRef.addLabel(ID_TITLE, "§5§b✦ RARE LOOT BOX ✦", TITLE_X, TITLE_Y, TITLE_SCALE, TITLE_SCALE);

    // Single reel slot — show question mark before player spins
    reelSlot = guiRef.addItemSlot(REEL_X, REEL_Y);
    try {
        var initItem = player.world.createItemFromNbt(api.stringToNbt('{id:"yuushya:button_sign_question",Count:1b,tag:{}}'));
        reelSlot.setStack(initItem);
    } catch(e) {}

    // Gold frame
    var fl = REEL_X    - FRAME_PADDING;
    var fr = REEL_X    + REEL_SLOT_SIZE + FRAME_PADDING;
    var ft = REEL_Y    - FRAME_PADDING;
    var fb = REEL_Y    + REEL_SLOT_SIZE + FRAME_PADDING;
    guiRef.addColoredLine(30, fl, ft, fr, ft, FRAME_COLOR, FRAME_THICKNESS);
    guiRef.addColoredLine(31, fl, fb, fr, fb, FRAME_COLOR, FRAME_THICKNESS);
    guiRef.addColoredLine(32, fl, ft, fl, fb, FRAME_COLOR, FRAME_THICKNESS);
    guiRef.addColoredLine(33, fr, ft, fr, fb, FRAME_COLOR, FRAME_THICKNESS);

    // Spin button
    guiRef.addButton(ID_SPIN_BTN, "§e§lSPIN", BTN_X, BTN_Y, BTN_WIDTH, BTN_HEIGHT);

    guiRef.addLabel(ID_MSG,  "§7Open to receive a random skin!", MSG_X,  MSG_Y,  MSG_SCALE,  MSG_SCALE);
    guiRef.addLabel(ID_KEYS, "§7Key: §f" + countKeys(player),   KEYS_X, KEYS_Y, KEYS_SCALE, KEYS_SCALE);

    try {
        player.showCustomGui(guiRef);
    } catch(e) {
        player.message("§cCould not open GUI. Please try again.");
        guiRef = null;
    }
}

// ── Spin button clicked ───────────────────────────────────────
function customGuiButton(event) {
    var player = event.player;
    var api    = event.API;
    var btnId  = event.buttonId;

    if (btnId !== ID_SPIN_BTN) return;

    if (spinning) {
        player.message("§cAlready spinning!");
        return;
    }

    if (LOOT_POOL.length === 0) {
        player.message("§cThe loot pool is empty! Tell an admin.");
        return;
    }

    var keys = countKeys(player);
    if (keys < KEY_COST) {
        player.message("§cYou need §e" + KEY_COST + " Rare Key§c to spin! You have §e" + keys + "§c.");
        updateMessage("§cNeed a key to spin!");
        safeUpdate(guiRef);
        return;
    }

    var inv2 = player.getInventory();
    var emptyHotbar = 0;
    for (var h = 0; h < 9; h++) {
        var hs = inv2.getSlot(h);
        if (!hs || hs.isEmpty()) emptyHotbar++;
    }
    if (emptyHotbar < 2) {
        player.message("§cYou need at least §e2 empty hotbar slots §cbefore spinning!");
        updateMessage("§cFree up 2 hotbar slots!");
        safeUpdate(guiRef);
        return;
    }

    removeKeys(player, KEY_COST);

    // Choose the winning item now (hidden until reel stops)
    finalIndex = Math.floor(Math.random() * LOOT_POOL.length);

    spinning       = true;
    spinTick       = 0;
    displayIndex   = Math.floor(Math.random() * SPIN_VISUALS.length);
    reelLocked     = false;
    reelPhase      = 0;
    reelPhaseStart = 0;
    reelNextFlip   = 0;

    // Lock in spin references
    spinningPlayer = player;
    spinningGui    = guiRef;
    spinningReel   = reelSlot;
    spinningResult = finalIndex;

    updateMessage("§e§lSPINNING...");
    updateKeysLabel(player);
    safeUpdate(guiRef);

    lastPlayer = player;
    lastApi    = api;

    if (!lastBlock) {
        player.message("§cError: block reference lost. Close and reopen the loot box.");
        spinning       = false;
        spinningPlayer = null;
        spinningGui    = null;
        spinningReel   = null;
        spinningResult = -1;
        return;
    }
    lastBlock.timers.forceStart(1, 1, true);
}

// ── Timer tick (fires every 1 game-tick) ──────────────────────
function timer(event) {
    if (event.id !== 1) return;

    if (!spinning || !lastBlock) {
        if (lastBlock) lastBlock.timers.stop(1);
        return;
    }

    spinTick++;

    var flipped  = false;
    var phaseAge = spinTick - reelPhaseStart;

    if (!reelLocked) {
        // Advance phase when current phase duration expires
        var phaseDone = false;
        if (reelPhase === 0 && phaseAge >= PHASE_FAST_DURATION)   phaseDone = true;
        if (reelPhase === 1 && phaseAge >= PHASE_MEDIUM_DURATION)  phaseDone = true;
        if (reelPhase === 2 && phaseAge >= PHASE_SLOW_DURATION)    phaseDone = true;

        if (phaseDone) {
            if (reelPhase < 2) {
                reelPhase++;
                reelPhaseStart = spinTick;
                reelNextFlip   = spinTick;
            } else {
                // Phase 2 done → lock reel and show actual reward
                reelLocked = true;
                flipped    = true;
            }
        }

        if (!reelLocked && spinTick >= reelNextFlip) {
            // Cycle through concrete powder visuals
            displayIndex = (displayIndex + 1) % SPIN_VISUALS.length;
            flipped      = true;
            var interval = (reelPhase === 0) ? PHASE_FAST_INTERVAL
                         : (reelPhase === 1) ? PHASE_MEDIUM_INTERVAL
                         :                     PHASE_SLOW_INTERVAL;
            reelNextFlip = spinTick + interval;
        }
    }

    if (flipped) {
        updateReelDisplay();
    }

    if (reelLocked) {
        lastBlock.timers.stop(1);
        spinning = false;
        spinTick = 0;
        resolveResult();
    }
}

// ── Refresh reel display ──────────────────────────────────────
function updateReelDisplay() {
    if (!spinningGui || !spinningPlayer || !spinningReel) return;
    try {
        if (reelLocked) {
            // Show the actual won item once the reel stops
            var winEntry = LOOT_POOL[spinningResult % LOOT_POOL.length];
            var winItem  = createEntryItem(winEntry, spinningPlayer, lastApi);
            spinningReel.setStack(winItem);
        } else {
            // Show cycling concrete powder while spinning
            var visual     = SPIN_VISUALS[displayIndex % SPIN_VISUALS.length];
            var visualItem = createVisualItem(visual, spinningPlayer, lastApi);
            spinningReel.setStack(visualItem);
        }
    } catch(e) {}
    safeUpdate(spinningGui);
}

// ── Resolve and award the item ────────────────────────────────
function resolveResult() {
    if (!spinningPlayer) return;

    var player = spinningPlayer;
    var gui    = spinningGui;
    var idx    = spinningResult;

    if (idx < 0 || idx >= LOOT_POOL.length) {
        player.message("§cError resolving loot. Contact an admin.");
        cleanupSpin();
        return;
    }

    var entry = LOOT_POOL[idx];

    try {
        var item = createEntryItem(entry, player, lastApi);
        player.giveItem(item);
        player.message("§5§l✦ LOOT BOX ✦ §r§aYou received: §e" + entry.label + "§a!");
        updateMessageOnGui(gui, "§a§l✦ " + entry.label + " §r§a+1");
    } catch(e) {
        player.message("§cFailed to create item. Contact an admin. Error: " + e);
        updateMessageOnGui(gui, "§cItem creation failed!");
    }

    updateKeysLabelOnGui(gui, player);
    safeUpdate(gui);

    cleanupSpin();
}

function cleanupSpin() {
    spinningPlayer = null;
    spinningGui    = null;
    spinningReel   = null;
    spinningResult = -1;
}

// ── Label update helpers ──────────────────────────────────────
function updateMessage(text) {
    updateMessageOnGui(guiRef, text);
}

function updateMessageOnGui(gui, text) {
    if (!gui) return;
    try { gui.removeComponent(ID_MSG); } catch(e) {}
    try { gui.addLabel(ID_MSG, text, MSG_X, MSG_Y, MSG_SCALE, MSG_SCALE); } catch(e) {}
}

function updateKeysLabel(player) {
    updateKeysLabelOnGui(guiRef, player);
}

function updateKeysLabelOnGui(gui, player) {
    if (!gui || !player) return;
    try { gui.removeComponent(ID_KEYS); } catch(e) {}
    try { gui.addLabel(ID_KEYS, "§7Keys: §f" + countKeys(player), KEYS_X, KEYS_Y, KEYS_SCALE, KEYS_SCALE); } catch(e) {}
}

// ── Slot clicked (display-only) ───────────────────────────────
function customGuiSlotClicked(event) {
    if (!guiRef) return;
    safeUpdate(guiRef);
}

// ── GUI closed ────────────────────────────────────────────────
function customGuiClosed(event) {
    guiRef = null;
    // spinningGui is NOT cleared here — resolveResult() owns that lifecycle
}

// ── Key helpers ─────────────────────────────────────────────
function countKeys(player) {
    var count = 0;
    var inv   = player.getInventory();
    for (var i = 0; i < inv.getSize(); i++) {
        var s = inv.getSlot(i);
        if (s && !s.isEmpty() && s.getName() === "kubejs:key_rare") {
            count += s.getStackSize();
        }
    }
    return count;
}

function removeKeys(player, amount) {
    var remaining = amount;
    var inv = player.getInventory();
    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var s = inv.getSlot(i);
        if (s && !s.isEmpty() && s.getName() === "kubejs:key_rare") {
            var qty = s.getStackSize();
            if (qty <= remaining) {
                inv.setSlot(i, null);
                remaining -= qty;
            } else {
                s.setStackSize(qty - remaining);
                remaining = 0;
            }
        }
    }
}