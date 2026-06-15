// ============================================================================
// NPC DICE DUEL — Versus Screen, Single GUI
// ============================================================================
// Script Type: NpcEvent (place on NPC > Advanced > Scripts)
// Style: ES5 | No Semicolons | CNPC 1.20.1
//
// FLOW:
//   Player 1 right-clicks → picks wager → shown on LEFT side, right side = "???"
//   Player 2 right-clicks → shown on RIGHT side → hits Accept → dice roll
//   Both GUIs update to show result with both names, rolls, winner
//
// COIN CURRENCY:
//   stone_coin = 1¢   coal_coin = 100¢   emerald_coin = 10,000¢
// ============================================================================

var SYS = Java.type("java.lang.System")

// ============================================================================
// CONFIG
// ============================================================================
var BET_OPTIONS          = [10, 50, 200]
var DICE_SIDES           = 6
var CHALLENGE_TIMEOUT_MS = 60000

var STONE_TO_COAL   = 100
var COAL_TO_EMERALD = 100
var COIN_STONE      = "coins:stone_coin"
var COIN_COAL       = "coins:coal_coin"
var COIN_EMERALD    = "coins:emerald_coin"

// Dice face icons — 6 distinct items to represent 1-6
var DICE_ITEMS = [
    "minecraft:stone",
    "minecraft:iron_ingot",
    "minecraft:gold_ingot",
    "minecraft:emerald",
    "minecraft:diamond",
    "minecraft:nether_star"
]

// Spin animation config (like slot machine)
// Faster settings for snappier feel
var SPIN_FAST_INTERVAL   = 1    // ticks between flips in fast phase
var SPIN_FAST_DURATION   = 6    // ticks of fast phase
var SPIN_MEDIUM_INTERVAL = 3    // ticks between flips in medium phase
var SPIN_MEDIUM_DURATION = 5    // ticks of medium phase
var SPIN_SLOW_INTERVAL   = 6    // ticks between flips in slow phase
var SPIN_SLOW_DURATION   = 5    // ticks of slow phase

// ============================================================================
// GUI
// ============================================================================
var GUI_MAIN = 7300

var C = {
    // Left panel (Player 1 / initiator)
    LBL_P1_NAME:   1,
    LBL_P1_BAL:    2,
    LBL_P1_RESULT: 4,

    // Right panel (Player 2 / acceptor)
    LBL_P2_NAME:   5,
    LBL_P2_BAL:    6,
    LBL_P2_RESULT: 8,

    // Center
    LBL_VS:        9,
    LBL_WAGER:     10,
    LBL_STATUS:    11,
    LBL_POT:       12,

    // Bet buttons
    BTN_10:        20,
    BTN_50:        21,
    BTN_200:       22,

    // Action buttons
    BTN_ACCEPT:    30,
    BTN_DECLINE:   31,
    BTN_CANCEL:    32,
    BTN_CLOSE:     33
}

// ============================================================================
// STATE
// ============================================================================
var npcUuid   = null
var challenge = null
// {
//   initiatorUuid, initiatorName, initiatorBal,
//   amount, createdAt, state: "waiting"|"resolved",
//   result: { rollI, rollA, acceptorName, acceptorBal, isTie, initWins } | null
// }

// Track all players currently viewing the GUI so we can refresh them all on state changes
// Entry: { player, API, gui, slotP1 (IItemSlot), slotP2 (IItemSlot) }
var openPlayers = {}

// ── Spin animation state ─────────────────────────────────────
var spinning       = false
var spinTick       = 0
var displayRollI   = 0  // currently shown animation roll for initiator
var displayRollA   = 0  // currently shown animation roll for acceptor
var finalRollI     = 0  // the real final roll for initiator (0-based)
var finalRollA     = 0  // the real final roll for acceptor (0-based)
var spinPhase      = 0  // 0=fast, 1=medium, 2=slow
var spinPhaseStart = 0
var spinNextFlip   = 0
var pendingResult  = null  // stored to resolve after animation
// pendingResult: { acceptorName, acceptorBal, isTie, initWins, initiator }

// ============================================================================
// HELPERS
// ============================================================================
function getNpc(world) {
    if (!npcUuid) return null
    return world.getEntity(npcUuid)
}

function challengeExpired() {
    if (!challenge) return true
    return (SYS.currentTimeMillis() - challenge.createdAt) > CHALLENGE_TIMEOUT_MS
}

function findOnline(world, uuid) {
    try {
        var list = world.getOnlinePlayers()
        for (var i = 0; i < list.length; i++)
            if (list[i].getUUID() === uuid) return list[i]
    } catch (e) {}
    return null
}

// ============================================================================
// COINS
// ============================================================================
function countCoins(player) {
    var total = 0
    var inv   = player.getInventory()
    for (var i = 0; i < inv.getSize(); i++) {
        var s = inv.getSlot(i)
        if (s && !s.isEmpty()) {
            var n = s.getName()
            if      (n === COIN_STONE)   total += s.getStackSize()
            else if (n === COIN_COAL)    total += s.getStackSize() * STONE_TO_COAL
            else if (n === COIN_EMERALD) total += s.getStackSize() * STONE_TO_COAL * COAL_TO_EMERALD
        }
    }
    return total
}

function removeCoins(player, amount) {
    var rem   = amount
    var inv   = player.getInventory()
    var world = player.getWorld()
    for (var i = 0; i < inv.getSize() && rem > 0; i++) {
        var s = inv.getSlot(i)
        if (s && !s.isEmpty() && s.getName() === COIN_STONE) {
            var qty = s.getStackSize()
            if (qty <= rem) { inv.setSlot(i, null); rem -= qty }
            else { s.setStackSize(qty - rem); rem = 0 }
        }
    }
    for (var i = 0; i < inv.getSize() && rem > 0; i++) {
        var s = inv.getSlot(i)
        if (s && !s.isEmpty() && s.getName() === COIN_COAL) {
            var qty = s.getStackSize()
            var val = qty * STONE_TO_COAL
            if (val <= rem) { inv.setSlot(i, null); rem -= val }
            else {
                var need = Math.ceil(rem / STONE_TO_COAL)
                var over = need * STONE_TO_COAL - rem
                s.setStackSize(qty - need); rem = 0
                if (over > 0) player.giveItem(world.createItem(COIN_STONE, over))
            }
        }
    }
    for (var i = 0; i < inv.getSize() && rem > 0; i++) {
        var s = inv.getSlot(i)
        if (s && !s.isEmpty() && s.getName() === COIN_EMERALD) {
            var qty  = s.getStackSize()
            var unit = STONE_TO_COAL * COAL_TO_EMERALD
            var val  = qty * unit
            if (val <= rem) { inv.setSlot(i, null); rem -= val }
            else {
                var need = Math.ceil(rem / unit)
                var over = need * unit - rem
                s.setStackSize(qty - need); rem = 0
                var gc = Math.floor(over / STONE_TO_COAL)
                var gs = over % STONE_TO_COAL
                if (gc > 0) player.giveItem(world.createItem(COIN_COAL,  gc))
                if (gs > 0) player.giveItem(world.createItem(COIN_STONE, gs))
            }
        }
    }
    player.updatePlayerInventory()
    return rem <= 0
}

function giveCoins(player, amount) {
    var rem  = amount
    if (rem <= 0) return
    var world = player.getWorld()
    var unit  = STONE_TO_COAL * COAL_TO_EMERALD
    if (rem >= unit) {
        var em = Math.floor(rem / unit)
        while (em > 0) { var g = Math.min(em, 64); player.giveItem(world.createItem(COIN_EMERALD, g)); em -= g }
        rem %= unit
    }
    if (rem >= STONE_TO_COAL) {
        var co = Math.floor(rem / STONE_TO_COAL)
        while (co > 0) { var g = Math.min(co, 64); player.giveItem(world.createItem(COIN_COAL, g)); co -= g }
        rem %= STONE_TO_COAL
    }
    while (rem > 0) {
        var g = Math.min(rem, 64)
        player.giveItem(world.createItem(COIN_STONE, g))
        rem -= g
    }
    player.updatePlayerInventory()
}

function fmt(amount) {
    var major = Math.floor(amount / STONE_TO_COAL)
    var minor = amount % STONE_TO_COAL
    return "§e" + major + (minor < 10 ? ".0" : ".") + minor + "¢"
}

// ============================================================================
// UPDATE DICE SLOTS IN ALL OPEN GUIS (during animation)
// ============================================================================
function updateDiceSlots() {
    var uuids = Object.keys(openPlayers)
    for (var i = 0; i < uuids.length; i++) {
        var entry = openPlayers[uuids[i]]
        if (!entry || !entry.player || !entry.slotP1 || !entry.slotP2) continue
        try {
            var world = entry.player.getWorld()
            entry.slotP1.setStack(world.createItem(DICE_ITEMS[displayRollI], 1))
            entry.slotP2.setStack(world.createItem(DICE_ITEMS[displayRollA], 1))
            entry.gui.update()
        } catch (e) {}
    }
}

// ============================================================================
// THE GUI — versus layout, rebuilds based on state
//
//  |  LEFT (P1)  |   CENTER   |  RIGHT (P2)  |
//  |  name       |    VS      |  name        |
//  |  wallet     |   wager    |  wallet      |
//  | [p1 dice]   |  status    | [p2 dice]    |
//  |  result     |            |  result      |
// ============================================================================
function openGui(event) {
    var player = event.player
    var uuid   = player.getUUID()
    var bal    = countCoins(player)

    var w  = 360
    var h  = 210
    var lx = 10           // left panel x
    var cx = 130          // center x
    var rx = 230          // right panel x
    var pw = 110          // panel width

    var gui = event.API.createCustomGui(GUI_MAIN, w, h, false, player)

    // ── Column headers ──────────────────────────────────────────────────────
    gui.addLabel(C.LBL_VS, "§8§l— VS —", cx, 8, 100, 12)

    // ── No active challenge ─────────────────────────────────────────────────
    if (!challenge) {
        // Left = this player (they will be initiator)
        gui.addLabel(C.LBL_P1_NAME,   "§f§l" + player.getName(), lx, 8,  pw, 12)
        gui.addLabel(C.LBL_P1_BAL,    "§7" + fmt(bal),           lx, 24, pw, 10)
        gui.addLabel(C.LBL_P1_RESULT, "",                        lx, 60, pw, 10)

        // Right = empty slot
        gui.addLabel(C.LBL_P2_NAME,   "§8???",          rx, 8,  pw, 12)
        gui.addLabel(C.LBL_P2_BAL,    "§8Waiting...",   rx, 24, pw, 10)
        gui.addLabel(C.LBL_P2_RESULT, "",               rx, 60, pw, 10)

        // Center: pick wager
        gui.addLabel(C.LBL_WAGER,  "§7Pick wager:",  cx, 24, 100, 10)
        gui.addLabel(C.LBL_STATUS, "§8Both at NPC.", cx, 130, 100, 10)

        var bw = 62, gap = 4
        gui.addButton(C.BTN_10,  fmt(BET_OPTIONS[0]), cx,          42, bw, 16)
        gui.addButton(C.BTN_50,  fmt(BET_OPTIONS[1]), cx,          62, bw, 16)
        gui.addButton(C.BTN_200, fmt(BET_OPTIONS[2]), cx,          82, bw, 16)

        gui.addButton(C.BTN_CLOSE, "§7Close", cx + 6, h - 28, 50, 18)
    }

    // ── SPINNING: show animated dice ─────────────────────────────────────────
    else if (spinning) {
        gui.addLabel(C.LBL_P1_NAME,   "§f§l" + challenge.initiatorName,   lx, 8,  pw, 12)
        gui.addLabel(C.LBL_P1_BAL,    "§7" + fmt(challenge.initiatorBal),  lx, 24, pw, 10)

        var p2Name = challenge.result ? challenge.result.acceptorName : "???"
        gui.addLabel(C.LBL_P2_NAME,   "§f§l" + p2Name,                   rx, 8,  pw, 12)
        gui.addLabel(C.LBL_P2_BAL,    "§7" + fmt(challenge.amount > 0 ? challenge.amount * 2 : 0), rx, 24, pw, 10)

        gui.addLabel(C.LBL_WAGER,  "§7Wager: §r" + fmt(challenge.amount), cx, 24, 100, 10)
        gui.addLabel(C.LBL_STATUS, "§e§lDICE ROLLING...",                 cx, 42, 100, 20)
        gui.addLabel(C.LBL_POT,    "§8Pot: " + fmt(challenge.amount * 2), cx, 70, 100, 10)

        // No buttons while spinning
    }

    // ── Waiting: this player is the initiator ───────────────────────────────
    else if (challenge.state === "waiting" && challenge.initiatorUuid === uuid) {
        gui.addLabel(C.LBL_P1_NAME,   "§f§l" + challenge.initiatorName,  lx, 8,  pw, 12)
        gui.addLabel(C.LBL_P1_BAL,    "§7" + fmt(challenge.initiatorBal), lx, 24, pw, 10)
        gui.addLabel(C.LBL_P1_RESULT, "§aReady",                          lx, 60, pw, 10)

        gui.addLabel(C.LBL_P2_NAME,   "§8???",         rx, 8,  pw, 12)
        gui.addLabel(C.LBL_P2_BAL,    "§8Waiting...",  rx, 24, pw, 10)
        gui.addLabel(C.LBL_P2_RESULT, "",              rx, 60, pw, 10)

        gui.addLabel(C.LBL_WAGER,  "§7Wager: §r" + fmt(challenge.amount), cx, 24, 100, 10)
        gui.addLabel(C.LBL_STATUS, "§7Waiting for\nopponent...",           cx, 42, 100, 20)
        gui.addLabel(C.LBL_POT,    "§8Pot: " + fmt(challenge.amount * 2), cx, 70, 100, 10)

        gui.addButton(C.BTN_CANCEL, "§cCancel", cx + 6, h - 28, 50, 18)
    }

    // ── Waiting: this player is the opponent ────────────────────────────────
    else if (challenge.state === "waiting" && challenge.initiatorUuid !== uuid) {
        gui.addLabel(C.LBL_P1_NAME,   "§f§l" + challenge.initiatorName,   lx, 8,  pw, 12)
        gui.addLabel(C.LBL_P1_BAL,    "§7" + fmt(challenge.initiatorBal), lx, 24, pw, 10)
        gui.addLabel(C.LBL_P1_RESULT, "§aReady",                          lx, 60, pw, 10)

        gui.addLabel(C.LBL_P2_NAME,   "§f§l" + player.getName(), rx, 8,  pw, 12)
        gui.addLabel(C.LBL_P2_BAL,    "§7" + fmt(bal),           rx, 24, pw, 10)
        gui.addLabel(C.LBL_P2_RESULT, "",                         rx, 60, pw, 10)

        gui.addLabel(C.LBL_WAGER,  "§7Wager: §r" + fmt(challenge.amount), cx, 24, 100, 10)
        if (bal < challenge.amount) {
            gui.addLabel(C.LBL_STATUS, "§cNot enough\ncoins!",            cx, 42, 100, 20)
        } else {
            gui.addLabel(C.LBL_STATUS, "§7Accept the\nchallenge?",        cx, 42, 100, 20)
        }
        gui.addLabel(C.LBL_POT, "§8Pot: " + fmt(challenge.amount * 2),   cx, 70, 100, 10)

        gui.addButton(C.BTN_ACCEPT,  "§a§lAccept",  cx - 30, h - 28, 60, 18)
        gui.addButton(C.BTN_DECLINE, "§c§lDecline", cx + 34, h - 28, 60, 18)
    }

    // ── Resolved: show result ───────────────────────────────────────────────
    else if (challenge && challenge.state === "resolved" && challenge.result) {
        var r      = challenge.result
        var isInit = (uuid === challenge.initiatorUuid)
        var myRoll = isInit ? r.rollI : r.rollA
        var opRoll = isInit ? r.rollA : r.rollI
        var won    = myRoll > opRoll

        // Left = initiator always
        var p1won = r.initWins && !r.isTie
        gui.addLabel(C.LBL_P1_NAME,   "§f§l" + challenge.initiatorName,                    lx, 8,  pw, 12)
        gui.addLabel(C.LBL_P1_BAL,    "§7" + fmt(challenge.initiatorBal),                   lx, 24, pw, 10)
        gui.addLabel(C.LBL_P1_RESULT, r.isTie ? "§bTie" : (p1won ? "§a§lWIN" : "§c§lLOSE"), lx, 60, pw, 12)

        // Right = acceptor always
        var p2won = !r.initWins && !r.isTie
        gui.addLabel(C.LBL_P2_NAME,   "§f§l" + r.acceptorName,                              rx, 8,  pw, 12)
        gui.addLabel(C.LBL_P2_BAL,    "§7" + fmt(r.acceptorBal),                            rx, 24, pw, 10)
        gui.addLabel(C.LBL_P2_RESULT, r.isTie ? "§bTie" : (p2won ? "§a§lWIN" : "§c§lLOSE"), rx, 60, pw, 12)

        // Center
        gui.addLabel(C.LBL_WAGER, "§7Wager: §r" + fmt(challenge.amount), cx, 24, 100, 10)
        if (r.isTie) {
            gui.addLabel(C.LBL_STATUS, "§b§lTIE!\nRefunded.",            cx, 42, 100, 20)
        } else {
            var winName = r.initWins ? challenge.initiatorName : r.acceptorName
            gui.addLabel(C.LBL_STATUS, "§f" + winName + "\n§awins!",    cx, 42, 100, 20)
        }
        gui.addLabel(C.LBL_POT, "§8Pot: " + fmt(challenge.amount * 2),  cx, 70, 100, 10)

        gui.addButton(C.BTN_CLOSE, "§7Close", cx + 6, h - 28, 50, 18)
    }

    player.showCustomGui(gui)

    // Create dice item slots and store them for live animation updates
    var slotP1 = gui.addItemSlot(lx + 40, 40)
    var slotP2 = gui.addItemSlot(rx + 40, 40)

    // Set initial item if we have a result or spinning
    try {
        var world = player.getWorld()
        if (spinning) {
            slotP1.setStack(world.createItem(DICE_ITEMS[displayRollI], 1))
            slotP2.setStack(world.createItem(DICE_ITEMS[displayRollA], 1))
        } else if (challenge && challenge.state === "resolved" && challenge.result) {
            var r = challenge.result
            slotP1.setStack(world.createItem(DICE_ITEMS[r.rollI], 1))
            slotP2.setStack(world.createItem(DICE_ITEMS[r.rollA], 1))
        } else if (challenge && challenge.state === "waiting") {
            // Show a placeholder item
            slotP1.setStack(world.createItem("minecraft:barrier", 1))
            slotP2.setStack(world.createItem("minecraft:barrier", 1))
        }
    } catch(e) {}

    // Register this player with slot references
    openPlayers[uuid] = { player: player, API: event.API, gui: gui, slotP1: slotP1, slotP2: slotP2 }
}

// ============================================================================
// REFRESH ALL OPEN GUIS — called whenever the challenge state changes
// ============================================================================
function refreshAllGuis() {
    var uuids = Object.keys(openPlayers)
    for (var i = 0; i < uuids.length; i++) {
        var entry = openPlayers[uuids[i]]
        if (entry && entry.player && entry.API) {
            try {
                openGui(entry)
            } catch (e) {}
        }
    }
}

// ============================================================================
// FINALIZE RESULT — called after animation completes
// ============================================================================
function finalizeResult() {
    var world = null
    // Get world from any open player
    var uuids = Object.keys(openPlayers)
    for (var i = 0; i < uuids.length; i++) {
        var entry = openPlayers[uuids[i]]
        if (entry && entry.player) { world = entry.player.getWorld(); break }
    }
    if (!world && pendingResult) {
        // Try to find the npc
        var npc = getNpc(null)
        if (npc) world = npc.getWorld()
    }
    if (!world) return

    var pr = pendingResult
    if (!pr) return

    var player      = pr.acceptorPlayer
    var initiator   = pr.initiator
    var acceptorBal = pr.acceptorBal
    var isTie       = pr.isTie
    var initWins    = pr.initWins

    challenge.state  = "resolved"
    challenge.result = {
        rollI:        finalRollI,
        rollA:        finalRollA,
        acceptorName: player ? player.getName() : pr.acceptorName,
        acceptorBal:  acceptorBal,
        isTie:        isTie,
        initWins:     initWins
    }

    // Pay out
    if (isTie) {
        if (player) giveCoins(player, challenge.amount)
        if (initiator) giveCoins(initiator, challenge.amount)
    } else if (initWins) {
        if (initiator) giveCoins(initiator, challenge.amount * 2)
    } else {
        if (player) giveCoins(player, challenge.amount * 2)
    }

    // Clear animation state
    spinning      = false
    pendingResult = null

    // Refresh all GUIs to show final result
    refreshAllGuis()
}

// ============================================================================
// ACTIONS
// ============================================================================
function doPost(event, amount) {
    var player = event.player

    if (challenge && !challengeExpired()) {
        player.message("§c[Dice] A challenge is already active!")
        openGui(event)
        return
    }

    if (countCoins(player) < amount) {
        player.message("§c[Dice] Not enough coins! Need " + fmt(amount))
        openGui(event)
        return
    }
    if (!removeCoins(player, amount)) {
        player.message("§c[Dice] Coin deduction failed.")
        return
    }

    challenge = {
        initiatorUuid: player.getUUID(),
        initiatorName: player.getName(),
        initiatorBal:  countCoins(player),   // snapshot after deduction
        amount:        amount,
        createdAt:     SYS.currentTimeMillis(),
        state:         "waiting",
        result:        null
    }

    openGui(event)
    refreshAllGuis()
}

function doCancel(event) {
    var player = event.player
    if (!challenge || challenge.initiatorUuid !== player.getUUID()) {
        challenge = null
        player.closeGui()
        return
    }
    giveCoins(player, challenge.amount)
    player.message("§e[Dice] Challenge cancelled. Refunded " + fmt(challenge.amount))
    challenge = null
    player.closeGui()
    refreshAllGuis()
}

function doAccept(event) {
    var player = event.player
    var world  = player.getWorld()

    if (!challenge || challengeExpired()) {
        player.message("§c[Dice] That challenge expired!")
        if (challenge) {
            var init = findOnline(world, challenge.initiatorUuid)
            if (init) {
                giveCoins(init, challenge.amount)
                init.message("§e[Dice] Challenge expired. Refunded " + fmt(challenge.amount))
                init.closeGui()
            }
            challenge = null
        }
        openGui(event)
        return
    }
    if (challenge.initiatorUuid === player.getUUID()) {
        player.message("§c[Dice] That's your own challenge!")
        return
    }
    if (countCoins(player) < challenge.amount) {
        player.message("§c[Dice] Not enough coins!")
        return
    }
    if (!removeCoins(player, challenge.amount)) {
        player.message("§c[Dice] Coin deduction failed.")
        return
    }

    var acceptorBalAfter = countCoins(player)   // snapshot after deduction

    // Determine final rolls now (they won't change)
    var rollI    = Math.floor(Math.random() * DICE_SIDES) + 1
    var rollA    = Math.floor(Math.random() * DICE_SIDES) + 1
    var isTie    = (rollI === rollA)
    var initWins = rollI > rollA

    var initiator = findOnline(world, challenge.initiatorUuid)

    // Store final results (0-based index for DICE_ITEMS)
    finalRollI = rollI - 1
    finalRollA = rollA - 1

    // Store pending result data for after animation
    pendingResult = {
        acceptorPlayer: player,
        acceptorName:   player.getName(),
        acceptorBal:    acceptorBalAfter,
        isTie:          isTie,
        initWins:       initWins,
        initiator:      initiator
    }

    // Start spin animation
    spinning       = true
    spinTick       = 0
    displayRollI   = Math.floor(Math.random() * DICE_ITEMS.length)
    displayRollA   = Math.floor(Math.random() * DICE_ITEMS.length)
    spinPhase      = 0
    spinPhaseStart = 0
    spinNextFlip   = 0

    // Refresh all GUIs so they see "ROLLING..." + animated slots
    refreshAllGuis()
}

// ============================================================================
// EVENTS
// ============================================================================
function init(e) { npcUuid = e.npc.getUUID() }
function tick(e) {
    // ── Spin animation tick ────────────────────────────────────
    if (!spinning || !challenge) return

    spinTick++

    var anyFlip = false

    // Phase advancement
    var phaseAge = spinTick - spinPhaseStart
    var phaseDur = (spinPhase === 0) ? SPIN_FAST_DURATION : (spinPhase === 1) ? SPIN_MEDIUM_DURATION : SPIN_SLOW_DURATION

    if (phaseAge >= phaseDur) {
        if (spinPhase < 2) {
            spinPhase++
            spinPhaseStart = spinTick
            spinNextFlip   = spinTick
        } else {
            // Animation done! Lock in final results
            displayRollI = finalRollI
            displayRollA = finalRollA
            updateDiceSlots()
            finalizeResult()
            return
        }
    }

    // Time to flip?
    if (spinTick >= spinNextFlip) {
        displayRollI = Math.floor(Math.random() * DICE_ITEMS.length)
        displayRollA = Math.floor(Math.random() * DICE_ITEMS.length)
        anyFlip = true

        var interval = (spinPhase === 0) ? SPIN_FAST_INTERVAL : (spinPhase === 1) ? SPIN_MEDIUM_INTERVAL : SPIN_SLOW_INTERVAL
        spinNextFlip = spinTick + interval
    }

    if (anyFlip) {
        updateDiceSlots()
    }
}

function interact(e) {
    npcUuid = e.npc.getUUID()
    e.setCanceled(true)
    var player = e.player
    var world  = player.getWorld()

    // Prevent opening if spinning
    if (spinning) {
        player.message("§c[Dice] Dice are rolling! Wait for the result.")
        return
    }

    // Clean up expired challenge
    if (challenge && challengeExpired()) {
        var init = findOnline(world, challenge.initiatorUuid)
        if (init) {
            giveCoins(init, challenge.amount)
            init.message("§e[Dice] Challenge expired. Refunded " + fmt(challenge.amount))
            init.closeGui()
        }
        challenge = null
    }

    openGui(e)
}

function customGuiButton(e) {
    var bid = e.buttonId
    if (e.gui.getID() !== GUI_MAIN) return

    // Block all button presses while spinning
    if (spinning) {
        e.player.message("§c[Dice] Dice are rolling! Wait for the result.")
        return
    }

    if (bid === C.BTN_10)      { doPost(e, BET_OPTIONS[0]); return }
    if (bid === C.BTN_50)      { doPost(e, BET_OPTIONS[1]); return }
    if (bid === C.BTN_200)     { doPost(e, BET_OPTIONS[2]); return }
    if (bid === C.BTN_CANCEL)  { doCancel(e);               return }
    if (bid === C.BTN_ACCEPT)  { doAccept(e);               return }
    if (bid === C.BTN_DECLINE) { e.player.message("§7[Dice] You declined."); e.player.closeGui(); return }
    if (bid === C.BTN_CLOSE)   {
        var uuid = e.player.getUUID()
        delete openPlayers[uuid]
        if (challenge && challenge.state === "resolved") challenge = null
        e.player.closeGui()
        // Refresh other players still viewing
        refreshAllGuis()
        return
    }
}

function customGuiScroll(e) {}
function customGuiClosed(e) {
    // Remove this player from the tracking map when they close the GUI
    var uuid = e.player.getUUID()
    delete openPlayers[uuid]
}