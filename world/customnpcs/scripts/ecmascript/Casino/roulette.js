var SYS = Java.type("java.lang.System")

// ============================================================================
// CONFIG
// ============================================================================
var MAX_PLAYERS          = 5
var SPIN_DURATION_MS     = 4000
var MIN_BET              = 1
var MAX_BET              = 100000   // per single bet: 10 emeralds = $1000
var MAX_TOTAL_BET        = 100000   // total across ALL placed bets: 10 emeralds = $1000

var STONE_TO_COAL   = 100
var COAL_TO_EMERALD = 100
var COIN_STONE      = "coins:stone_coin"
var COIN_COAL       = "coins:coal_coin"
var COIN_EMERALD    = "coins:emerald_coin"

// European roulette: 0-36 (37 numbers)
var NUMBERS = [
    {num: 0,  color: "green"},
    {num: 1,  color: "red"},   {num: 2,  color: "black"}, {num: 3,  color: "red"},
    {num: 4,  color: "black"}, {num: 5,  color: "red"},   {num: 6,  color: "black"},
    {num: 7,  color: "red"},   {num: 8,  color: "black"}, {num: 9,  color: "red"},
    {num: 10, color: "black"}, {num: 11, color: "black"}, {num: 12, color: "red"},
    {num: 13, color: "black"}, {num: 14, color: "red"},   {num: 15, color: "black"},
    {num: 16, color: "red"},   {num: 17, color: "black"}, {num: 18, color: "red"},
    {num: 19, color: "red"},   {num: 20, color: "black"}, {num: 21, color: "red"},
    {num: 22, color: "black"}, {num: 23, color: "red"},   {num: 24, color: "black"},
    {num: 25, color: "red"},   {num: 26, color: "black"}, {num: 27, color: "red"},
    {num: 28, color: "black"}, {num: 29, color: "black"}, {num: 30, color: "red"},
    {num: 31, color: "black"}, {num: 32, color: "red"},   {num: 33, color: "black"},
    {num: 34, color: "red"},   {num: 35, color: "black"}, {num: 36, color: "red"}
]

var RED_NUMBERS = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]

var BET_TYPES = {
    STRAIGHT_UP:  { name: "Straight Up",    payout: 35 },
    RED:          { name: "Red",            payout: 1  },
    BLACK:        { name: "Black",          payout: 1  },
    ODD:          { name: "Odd",            payout: 1  },
    EVEN:         { name: "Even",           payout: 1  },
    LOW:          { name: "1-18",           payout: 1  },
    HIGH:         { name: "19-36",          payout: 1  },
    DOZEN_1:      { name: "1st Dozen",      payout: 2  },
    DOZEN_2:      { name: "2nd Dozen",      payout: 2  },
    DOZEN_3:      { name: "3rd Dozen",      payout: 2  },
    COL_1:        { name: "Column 1",       payout: 2  },
    COL_2:        { name: "Column 2",       payout: 2  },
    COL_3:        { name: "Column 3",       payout: 2  }
}

// Physical wheel layout (European wheel sequence)
var WHEEL_ORDER = [0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,
                   10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26]

// ============================================================================
// WHEEL RADII — adjust these to change wheel proportions
// ============================================================================
var WHEEL_CENTER_X = 74
var WHEEL_CENTER_Y = 146
var WHEEL_OUTER_R  = 47
var WHEEL_NUM_R    = 72
var WHEEL_INNER_R  = 27
var WHEEL_DOT_SIZE = 5
var WHEEL_HUB_SIZE = 12

// ============================================================================
// GUI
// ============================================================================
var GUI_MAIN    = 7400
var GUI_W       = 440
var GUI_H       = 350

var cid = 9000
function nextCid() { return cid++ }

function buildBackground(gui, width, height) {
    gui.addTexturedRect(0, "casino:textures/roulette.png", -53, 18, 300, 300)
}

// ============================================================================
// C — Component ID constants
// ============================================================================
var C = {
    LBL_TITLE:         1,
    LBL_RESULT:        2,
    LBL_BALANCE:       3,
    LBL_TIMER:         4,
    LBL_BALL:          5,

    BTN_10:            20,
    BTN_50:            21,
    BTN_200:           22,
    BTN_CUSTOM_BET:    23,
    TF_CUSTOM_BET:     24,
    BTN_SPIN:          25,
    BTN_LEAVE:         26,

    BTN_RED:           30,
    BTN_BLACK:         31,
    BTN_ODD:           32,
    BTN_EVEN:          33,
    BTN_LOW:           34,
    BTN_HIGH:          35,
    BTN_DOZEN1:        36,
    BTN_DOZEN2:        37,
    BTN_DOZEN3:        38,
    BTN_COL1:          39,
    BTN_COL2:          40,
    BTN_COL3:          41,

    BTN_NUM_BASE:      100,
    LBL_WHEEL_NUM:     201
}

// ============================================================================
// STATE — no global game, each player has their own
// ============================================================================
var npcUuid    = null
var openPlayers = {}         // uuid -> { player, API, phase, bets, winningNumber, spinStartedAt, selectedAmount, ballTargetSector }

// ============================================================================
// COIN HELPERS
// ============================================================================
function getNpc(world) {
    if (!npcUuid) return null
    return world.getEntity(npcUuid)
}

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
    if (amount < STONE_TO_COAL) return "§e" + amount + "¢"
    var dollars = Math.floor(amount / STONE_TO_COAL)
    var cents = amount % STONE_TO_COAL
    if (cents === 0) return "§e$" + dollars + ".00"
    if (cents < 10) return "§e$" + dollars + ".0" + cents
    return "§e$" + dollars + "." + cents
}

function totalPlayerBets(entry) {
    if (!entry || !entry.bets) return 0
    var total = 0
    for (var i = 0; i < entry.bets.length; i++)
        total += entry.bets[i].amount
    return total
}

// ============================================================================
// WHEEL DRAWING — ball jumps to random sectors during spin, lands on final
// ============================================================================
function drawWheel(gui, entry) {
    var cx = WHEEL_CENTER_X
    var cy = WHEEL_CENTER_Y
    var numSectors = 37

    if (!entry) return

    var ballAngle = 20
    var ballColor = "§f"

    if ((entry.phase === "spinning" || entry.phase === "result") && entry.winningNumber) {
        if (entry.phase === "spinning") {
            var randomSector = Math.floor(Math.random() * 37)
            ballAngle = (randomSector / numSectors) * 2 * Math.PI - Math.PI / 2
            ballColor = "§f"
        } else {
            ballAngle = (entry.ballTargetSector / numSectors) * 2 * Math.PI - Math.PI / 2
            ballColor = "§f"
        }
    }

    var ballR = WHEEL_DOT_SIZE + 1
    var ballX = cx + Math.cos(ballAngle) * (WHEEL_OUTER_R - ballR) - ballR/2
    var ballY = cy + Math.sin(ballAngle) * (WHEEL_OUTER_R - ballR) - ballR/2
    gui.addLabel(C.LBL_BALL, ballColor + "●", ballX, ballY, ballR, ballR)
}

// ============================================================================
// PER-PLAYER ROULETTE LOGIC
// ============================================================================
function spinWheelFor(entry) {
    var idx = Math.floor(Math.random() * NUMBERS.length)
    var result = NUMBERS[idx]

    var targetSector = -1
    for (var w = 0; w < WHEEL_ORDER.length; w++) {
        if (WHEEL_ORDER[w] === result.num) { targetSector = w; break }
    }

    entry.phase = "spinning"
    entry.winningNumber = result
    entry.spinStartedAt = SYS.currentTimeMillis()
    entry.ballTargetSector = targetSector
}

function finishSpinFor(entry) {
    if (!entry || entry.phase !== "spinning") return

    var wn = entry.winningNumber
    entry.phase = "result"

    var totalPayout = 0
    var winMessages = []

    for (var b = 0; b < entry.bets.length; b++) {
        var bet = entry.bets[b]
        var won = checkWin(bet, wn)
        if (won) {
            var payout = bet.amount + bet.amount * getPayout(bet.type)
            totalPayout += payout
            winMessages.push("§a" + getBetDisplayName(bet) + " §fwon " + fmt(payout))
        } else {
            winMessages.push("§c" + getBetDisplayName(bet) + " §flost " + fmt(bet.amount))
        }
    }

    if (totalPayout > 0) giveCoins(entry.player, totalPayout)

    entry.player.message("§6[Roulette] Result: §f" + wn.num + " " + getColorName(wn.color))
    for (var m = 0; m < winMessages.length && m < 3; m++) {
        entry.player.message(winMessages[m])
    }
    if (winMessages.length > 3)
        entry.player.message("§7... and " + (winMessages.length - 3) + " more bets")
    if (totalPayout > 0)
        entry.player.message("§aTotal won: " + fmt(totalPayout))
    else
        entry.player.message("§cNo winning bets this spin.")
}

function checkWin(bet, winningNumber) {
    var num = parseInt(bet.number)
    switch (bet.type) {
        case "STRAIGHT_UP": return num === winningNumber.num
        case "RED":   return winningNumber.color === "red"
        case "BLACK": return winningNumber.color === "black"
        case "ODD":   return winningNumber.num !== 0 && winningNumber.num % 2 === 1
        case "EVEN":  return winningNumber.num !== 0 && winningNumber.num % 2 === 0
        case "LOW":   return winningNumber.num >= 1 && winningNumber.num <= 18
        case "HIGH":  return winningNumber.num >= 19 && winningNumber.num <= 36
        case "DOZEN_1": return winningNumber.num >= 1 && winningNumber.num <= 12
        case "DOZEN_2": return winningNumber.num >= 13 && winningNumber.num <= 24
        case "DOZEN_3": return winningNumber.num >= 25 && winningNumber.num <= 36
        case "COL_1": return winningNumber.num !== 0 && winningNumber.num % 3 === 1
        case "COL_2": return winningNumber.num !== 0 && winningNumber.num % 3 === 2
        case "COL_3": return winningNumber.num !== 0 && winningNumber.num % 3 === 0
    }
    return false
}

function getPayout(type) {
    if (type === "STRAIGHT_UP") return 35
    if (type.indexOf("DOZEN") === 0 || type.indexOf("COL_") === 0) return 2
    return 1
}

function getBetDisplayName(bet) {
    if (bet.type === "STRAIGHT_UP") return "Number " + bet.number
    return BET_TYPES[bet.type].name
}

function getColorName(color) {
    if (color === "red") return "§cRed§r"
    if (color === "black") return "§8Black§r"
    return "§aGreen§r"
}

function isRedNum(num) {
    for (var i = 0; i < RED_NUMBERS.length; i++)
        if (RED_NUMBERS[i] === num) return true
    return false
}

// ============================================================================
// GUI — per-player, no shared global state
// ============================================================================
function openGui(event) {
    var player = event.player
    var uuid   = player.getUUID()
    var bal    = countCoins(player)

    if (!openPlayers[uuid]) {
        openPlayers[uuid] = {
            player: player,
            API: event.API,
            phase: "betting",
            bets: [],
            winningNumber: null,
            spinStartedAt: 0,
            selectedAmount: 10,
            ballTargetSector: -1
        }
    }

    var entry = openPlayers[uuid]

    var gui = event.API.createCustomGui(GUI_MAIN, GUI_W, GUI_H, false, player)
    cid = 9000

    buildBackground(gui, GUI_W, GUI_H)

    gui.addLabel(C.LBL_TITLE, "§6§lROULETTE", 52, 50, 100, 12)
    gui.addLabel(C.LBL_BALANCE, "§7Balance: " + fmt(bal), 170, 50, 200, 50)

    if (entry.phase === "result" && entry.winningNumber) {
        var wn = entry.winningNumber
        var colorCode = (wn.color === "red") ? "§c" : (wn.color === "black") ? "§8" : "§a"
        gui.addLabel(C.LBL_WHEEL_NUM, "§fResult: " + colorCode + "§l" + wn.num + "§r " + getColorName(wn.color), 170, 62, 180, 10)
    } else if (entry.phase === "spinning") {
        gui.addLabel(C.LBL_WHEEL_NUM, "§e§lSpinning...", 160, 16, 100, 10)
    }

    drawWheel(gui, entry)

    var gridX = 168
    var gridY = 97.5
    var numW = 18
    var numH = 16
    var gap = 1

    var zeroColor = (entry.phase === "result" && entry.winningNumber && entry.winningNumber.num === 0) ? "§a§l" : "§2§l"
    gui.addButton(C.BTN_NUM_BASE + 0, zeroColor + "0", gridX, gridY + 1, numW, numH * 3 + gap * 2)

    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 12; col++) {
            var num = row * 12 + col + 1
            if (num > 36) continue

            var isRed = isRedNum(num)
            var colorCode = isRed ? "§c§l" : "§8§l"
            var isWin = (entry.phase === "result" && entry.winningNumber && entry.winningNumber.num === num)
            var btnColor = isWin ? "§a§l" : colorCode
            var btnId = C.BTN_NUM_BASE + num

            var nx = gridX + (col + 1) * (numW + gap) + 2
            var ny = gridY + row * (numH + gap)
            gui.addButton(btnId, btnColor + num, nx, ny, numW, numH)
        }
    }

    var betY = gridY + 3 * (numH + gap) - 8
    var betH = 13
    var bx = gridX + 21

    gui.addButton(C.BTN_DOZEN1, "§b§l1st 12",  bx,       betY + 12, 75, betH)
    gui.addButton(C.BTN_DOZEN2, "§e§l2nd 12",  bx + 76,  betY + 12, 75, betH)
    gui.addButton(C.BTN_DOZEN3, "§d§l3rd 12",  bx + 152, betY + 12, 75, betH)

    gui.addButton(C.BTN_COL1, "§b§lCol 1", bx,       betY + 27, 75, betH)
    gui.addButton(C.BTN_COL2, "§e§lCol 2", bx + 76,  betY + 27, 75, betH)
    gui.addButton(C.BTN_COL3, "§d§lCol 3", bx + 152, betY + 27, 75, betH)

    gui.addButton(C.BTN_RED,   "§c§lRED",    bx,              betY + 42, 37, betH)
    gui.addButton(C.BTN_BLACK, "§8§lBLACK",  bx + 38,         betY + 42, 37, betH)
    gui.addButton(C.BTN_ODD,   "§f§lODD",   bx + 76,         betY + 42, 37, betH)
    gui.addButton(C.BTN_EVEN,  "§f§lEVEN",  bx + 114,        betY + 42, 37, betH)
    gui.addButton(C.BTN_LOW,   "§f§l1-18",  bx + 152,        betY + 42, 37, betH)
    gui.addButton(C.BTN_HIGH,  "§f§l19-36", bx + 190,        betY + 42, 37, betH)

    var cy = 250

    if (entry.phase === "betting") {
        gui.addButton(C.BTN_10,  fmt(10),  0,   cy, 48, 16)
        gui.addButton(C.BTN_50,  fmt(50),  52,  cy, 48, 16)
        gui.addButton(C.BTN_200, fmt(200), 104, cy, 48, 16)

        gui.addLabel(nextCid(), "§7Custom($)", 0, cy + 22, 50, 10)
        gui.addTextField(C.TF_CUSTOM_BET, 50, cy + 20, 55, 14).setText("")
        gui.addButton(C.BTN_CUSTOM_BET, "§aSet", 108, cy + 20, 35, 14)

        gui.addButton(C.BTN_SPIN, "§c§lSPIN!", 270, cy + 5, 70, 20)

        var betTotal = totalPlayerBets(entry)
        var remaining = MAX_TOTAL_BET - betTotal
        gui.addLabel(nextCid(), "§7Total: " + fmt(betTotal) + " §8/ §7Max: " + fmt(MAX_TOTAL_BET), 0, cy + 40, 160, 10)
        gui.addLabel(nextCid(), "§7Per: " + fmt(entry.selectedAmount) + "  §7Left: " + fmt(remaining), 0, cy + 50, 160, 10)
    } else if (entry.phase === "spinning") {
        gui.addLabel(nextCid(), "§e§lSpinning...", 120, cy + 10, 100, 14)
    } else if (entry.phase === "result") {
        gui.addButton(C.BTN_SPIN, "§a§lNew Round", 160, cy + 5, 100, 20)
    }

    if (entry.bets && entry.bets.length > 0) {
        var ly = 228
        gui.addLabel(nextCid(), "§7§lBets:", 270, ly - 10, 60, 10)
        var maxShow = Math.min(entry.bets.length, 4)
        for (var bi = 0; bi < maxShow; bi++) {
            var bet = entry.bets[bi]
            var display = getBetDisplayName(bet)
            var txt = display.length > 10 ? display.substring(0, 10) + ".." : display
            gui.addLabel(nextCid(), "§f" + txt + " " + fmt(bet.amount), 270, ly + bi * 10, 150, 10)
        }
        if (entry.bets.length > 4)
            gui.addLabel(nextCid(), "§7...+" + (entry.bets.length - 4), 270, ly + 4 * 10, 60, 10)
    }

    gui.addButton(C.BTN_LEAVE, "§7Leave", 370, 80, 46, 14)

    player.showCustomGui(gui)
    entry.gui = gui
    entry.API = event.API
}

// ============================================================================
// TICKS — per-player spin completion
// ============================================================================
function tick(e) {
    var uuids = Object.keys(openPlayers)
    for (var i = 0; i < uuids.length; i++) {
        var entry = openPlayers[uuids[i]]
        if (!entry || !entry.player) continue

        if (entry.phase === "spinning") {
            var elapsed = SYS.currentTimeMillis() - entry.spinStartedAt
            if (elapsed > SPIN_DURATION_MS) {
                finishSpinFor(entry)
                if (entry.API && entry.player) {
                    refreshGui(entry)
                }
            } else {
                if (entry.API && entry.player) {
                    refreshGui(entry)
                }
            }
        }
    }
}

function refreshGui(entry) {
    if (!entry || !entry.player || !entry.API) return
    var player = entry.player
    var uuid   = player.getUUID()
    var bal    = countCoins(player)

    var gui = entry.API.createCustomGui(GUI_MAIN, GUI_W, GUI_H, false, player)
    cid = 9000

    buildBackground(gui, GUI_W, GUI_H)
    gui.addLabel(C.LBL_TITLE, "§6§lROULETTE", 52, 50, 100, 12)
    gui.addLabel(C.LBL_BALANCE, "§7Balance: " + fmt(bal), 170, 50, 200, 50)

    if (entry.phase === "result" && entry.winningNumber) {
        var wn = entry.winningNumber
        var colorCode = (wn.color === "red") ? "§c" : (wn.color === "black") ? "§8" : "§a"
        gui.addLabel(C.LBL_WHEEL_NUM, "§fResult: " + colorCode + "§l" + wn.num + "§r " + getColorName(wn.color), 170, 62, 180, 10)
    } else if (entry.phase === "spinning") {
        gui.addLabel(C.LBL_WHEEL_NUM, "§e§lSpinning...", 160, 16, 100, 10)
    }

    drawWheel(gui, entry)

    var gridX = 168
    var gridY = 97.5
    var numW = 18
    var numH = 16
    var gap = 1

    var zeroColor = (entry.phase === "result" && entry.winningNumber && entry.winningNumber.num === 0) ? "§a§l" : "§2§l"
    gui.addButton(C.BTN_NUM_BASE + 0, zeroColor + "0", gridX, gridY + 1, numW, numH * 3 + gap * 2)

    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 12; col++) {
            var num = row * 12 + col + 1
            if (num > 36) continue
            var isRed = isRedNum(num)
            var colorCode = isRed ? "§c§l" : "§8§l"
            var isWin = (entry.phase === "result" && entry.winningNumber && entry.winningNumber.num === num)
            var btnColor = isWin ? "§a§l" : colorCode
            var btnId = C.BTN_NUM_BASE + num
            var nx = gridX + (col + 1) * (numW + gap) + 2
            var ny = gridY + row * (numH + gap)
            gui.addButton(btnId, btnColor + num, nx, ny, numW, numH)
        }
    }

    var betY = gridY + 3 * (numH + gap) - 8
    var betH = 13
    var bx = gridX + 21

    gui.addButton(C.BTN_DOZEN1, "§b§l1st 12",  bx,       betY + 12, 75, betH)
    gui.addButton(C.BTN_DOZEN2, "§e§l2nd 12",  bx + 76,  betY + 12, 75, betH)
    gui.addButton(C.BTN_DOZEN3, "§d§l3rd 12",  bx + 152, betY + 12, 75, betH)
    gui.addButton(C.BTN_COL1, "§b§lCol 1", bx,       betY + 27, 75, betH)
    gui.addButton(C.BTN_COL2, "§e§lCol 2", bx + 76,  betY + 27, 75, betH)
    gui.addButton(C.BTN_COL3, "§d§lCol 3", bx + 152, betY + 27, 75, betH)
    gui.addButton(C.BTN_RED,   "§c§lRED",    bx,              betY + 42, 37, betH)
    gui.addButton(C.BTN_BLACK, "§8§lBLACK",  bx + 38,         betY + 42, 37, betH)
    gui.addButton(C.BTN_ODD,   "§f§lODD",   bx + 76,         betY + 42, 37, betH)
    gui.addButton(C.BTN_EVEN,  "§f§lEVEN",  bx + 114,        betY + 42, 37, betH)
    gui.addButton(C.BTN_LOW,   "§f§l1-18",  bx + 152,        betY + 42, 37, betH)
    gui.addButton(C.BTN_HIGH,  "§f§l19-36", bx + 190,        betY + 42, 37, betH)

    var cy = 250

    if (entry.phase === "betting") {
        gui.addButton(C.BTN_10,  fmt(10),  0,   cy, 48, 16)
        gui.addButton(C.BTN_50,  fmt(50),  52,  cy, 48, 16)
        gui.addButton(C.BTN_200, fmt(200), 104, cy, 48, 16)
        gui.addLabel(nextCid(), "§7Custom($)", 0, cy + 22, 50, 10)
        gui.addTextField(C.TF_CUSTOM_BET, 50, cy + 20, 55, 14).setText("")
        gui.addButton(C.BTN_CUSTOM_BET, "§aSet", 108, cy + 20, 35, 14)
        gui.addButton(C.BTN_SPIN, "§c§lSPIN!", 270, cy + 5, 70, 20)
        var betTotal = totalPlayerBets(entry)
        var remaining = MAX_TOTAL_BET - betTotal
        gui.addLabel(nextCid(), "§7Total: " + fmt(betTotal) + " §8/ §7Max: " + fmt(MAX_TOTAL_BET), 0, cy + 40, 160, 10)
        gui.addLabel(nextCid(), "§7Per: " + fmt(entry.selectedAmount) + "  §7Left: " + fmt(remaining), 0, cy + 50, 160, 10)
    } else if (entry.phase === "spinning") {
        gui.addLabel(nextCid(), "§e§lSpinning...", 120, cy + 10, 100, 14)
    } else if (entry.phase === "result") {
        gui.addButton(C.BTN_SPIN, "§a§lNew Round", 160, cy + 5, 100, 20)
    }

    if (entry.bets && entry.bets.length > 0) {
        var ly = 228
        gui.addLabel(nextCid(), "§7§lBets:", 270, ly - 10, 60, 10)
        var maxShow = Math.min(entry.bets.length, 4)
        for (var bi = 0; bi < maxShow; bi++) {
            var bet = entry.bets[bi]
            var display = getBetDisplayName(bet)
            var txt = display.length > 10 ? display.substring(0, 10) + ".." : display
            gui.addLabel(nextCid(), "§f" + txt + " " + fmt(bet.amount), 270, ly + bi * 10, 150, 10)
        }
        if (entry.bets.length > 4)
            gui.addLabel(nextCid(), "§7...+" + (entry.bets.length - 4), 270, ly + 4 * 10, 60, 10)
    }

    gui.addButton(C.BTN_LEAVE, "§7Leave", 380, 2, 46, 12)

    player.showCustomGui(gui)
    entry.gui = gui
}

// ============================================================================
// BET HANDLING — per-player
// ============================================================================
function doPlaceBet(event, amount) {
    var player = event.player
    var uuid   = player.getUUID()
    var bal    = countCoins(player)

    if (bal < amount) { player.message("§c[Roulette] Not enough coins!"); openGui(event); return }

    if (!openPlayers[uuid]) {
        openPlayers[uuid] = {
            player: player,
            API: event.API,
            phase: "betting",
            bets: [],
            winningNumber: null,
            spinStartedAt: 0,
            selectedAmount: 10,
            ballTargetSector: -1
        }
    }

    var entry = openPlayers[uuid]
    if (entry.phase !== "betting") { player.message("§c[Roulette] Not accepting bets!"); openGui(event); return }

    // Clamp selected amount so it won't exceed the total cap on the next bet
    var currentTotal = totalPlayerBets(entry)
    var remaining = MAX_TOTAL_BET - currentTotal
    if (amount > remaining) {
        amount = remaining
        if (amount <= 0) {
            player.message("§c[Roulette] Total bet limit of " + fmt(MAX_TOTAL_BET) + " reached!")
            openGui(event); return
        }
        player.message("§e[Roulette] Amount capped to " + fmt(amount) + " (total limit: " + fmt(MAX_TOTAL_BET) + ")")
    }

    entry.selectedAmount = amount
    player.message("§a[Roulette] Bet amount set to " + fmt(amount))
    openGui(event)
}

function doCustomBetSet(event) {
    var player = event.player
    var uuid   = player.getUUID()
    var gui    = event.gui

    try {
        var textField = gui.getComponent(C.TF_CUSTOM_BET)
        if (!textField) { player.message("§c[Roulette] Could not read custom bet field!"); return }
        var raw = textField.getText()
        if (!raw || raw === "") { player.message("§c[Roulette] Enter a bet amount!"); return }

        var cleaned = raw.replace("$", "").trim()
        var parsed = parseFloat(cleaned)
        if (isNaN(parsed) || parsed <= 0) { player.message("§c[Roulette] Invalid amount!"); return }

        var cents = Math.round(parsed * 100)
        if (cents < MIN_BET) { player.message("§c[Roulette] Minimum bet is " + fmt(MIN_BET) + "!"); return }
        if (cents > MAX_BET) { player.message("§c[Roulette] Maximum single bet is " + fmt(MAX_BET) + "!"); return }

        if (!openPlayers[uuid]) {
            openPlayers[uuid] = {
                player: player,
                API: event.API,
                phase: "betting",
                bets: [],
                winningNumber: null,
                spinStartedAt: 0,
                selectedAmount: 10,
                ballTargetSector: -1
            }
        }

        var entry = openPlayers[uuid]
        var currentTotal = totalPlayerBets(entry)
        var remaining = MAX_TOTAL_BET - currentTotal
        if (cents > remaining) {
            cents = remaining
            if (cents <= 0) {
                player.message("§c[Roulette] Total bet limit of " + fmt(MAX_TOTAL_BET) + " reached!")
                openGui(event); return
            }
            player.message("§e[Roulette] Amount capped to " + fmt(cents) + " (total limit: " + fmt(MAX_TOTAL_BET) + ")")
        }

        entry.selectedAmount = cents
        player.message("§a[Roulette] Bet amount set to " + fmt(cents))
        openGui(event)
    } catch (err) { player.message("§c[Roulette] Error: " + err) }
}

function doBetType(event, type) {
    var player = event.player
    var uuid   = player.getUUID()

    if (!openPlayers[uuid]) {
        openPlayers[uuid] = {
            player: player,
            API: event.API,
            phase: "betting",
            bets: [],
            winningNumber: null,
            spinStartedAt: 0,
            selectedAmount: 10,
            ballTargetSector: -1
        }
    }

    var entry = openPlayers[uuid]
    if (entry.phase !== "betting") { player.message("§c[Roulette] Not accepting bets!"); openGui(event); return }

    var amount = entry.selectedAmount || 10
    var currentTotal = totalPlayerBets(entry)

    // Block if already at cap
    if (currentTotal >= MAX_TOTAL_BET) {
        player.message("§c[Roulette] Total bet limit of " + fmt(MAX_TOTAL_BET) + " reached!")
        openGui(event); return
    }

    // Clamp amount to remaining allowance
    var remaining = MAX_TOTAL_BET - currentTotal
    if (amount > remaining) {
        amount = remaining
        player.message("§e[Roulette] Bet capped to " + fmt(amount) + " (total limit: " + fmt(MAX_TOTAL_BET) + ")")
    }

    if (countCoins(player) < currentTotal + amount) {
        player.message("§c[Roulette] Not enough coins! Need " + fmt(amount) + " more.")
        openGui(event); return
    }

    entry.bets.push({ type: type, amount: amount, number: null })
    player.message("§a[Roulette] " + BET_TYPES[type].name + " " + fmt(amount))
    openGui(event)
}

function doBetNumber(event, num) {
    var player = event.player
    var uuid   = player.getUUID()

    if (!openPlayers[uuid]) {
        openPlayers[uuid] = {
            player: player,
            API: event.API,
            phase: "betting",
            bets: [],
            winningNumber: null,
            spinStartedAt: 0,
            selectedAmount: 10,
            ballTargetSector: -1
        }
    }

    var entry = openPlayers[uuid]
    if (entry.phase !== "betting") { player.message("§c[Roulette] Not accepting bets!"); openGui(event); return }

    var amount = entry.selectedAmount || 10
    var currentTotal = totalPlayerBets(entry)

    // Block if already at cap
    if (currentTotal >= MAX_TOTAL_BET) {
        player.message("§c[Roulette] Total bet limit of " + fmt(MAX_TOTAL_BET) + " reached!")
        openGui(event); return
    }

    // Clamp amount to remaining allowance
    var remaining = MAX_TOTAL_BET - currentTotal
    if (amount > remaining) {
        amount = remaining
        player.message("§e[Roulette] Bet capped to " + fmt(amount) + " (total limit: " + fmt(MAX_TOTAL_BET) + ")")
    }

    if (countCoins(player) < currentTotal + amount) {
        player.message("§c[Roulette] Not enough coins! Need " + fmt(amount) + " more.")
        openGui(event); return
    }

    entry.bets.push({ type: "STRAIGHT_UP", amount: amount, number: num })
    player.message("§a[Roulette] Number " + num + " " + fmt(amount))
    openGui(event)
}

function doSpin(event) {
    var player = event.player
    var uuid   = player.getUUID()
    var entry = openPlayers[uuid]

    if (!entry) { player.message("§c[Roulette] Need to be at table!"); return }

    if (entry.phase === "result") {
        startNewRoundFor(entry)
        openGui(event)
        return
    }

    if (entry.phase !== "betting") { player.message("§c[Roulette] Not accepting bets!"); return }
    if (!entry.bets || entry.bets.length === 0) { player.message("§c[Roulette] No bets placed!"); return }

    var totalBet = totalPlayerBets(entry)
    if (totalBet <= 0) { player.message("§c[Roulette] No bets placed!"); return }

    if (!removeCoins(entry.player, totalBet)) {
        player.message("§c[Roulette] Not enough coins!")
        entry.bets = []
        openGui(event)
        return
    }

    player.message("§c[Roulette] " + fmt(totalBet) + " deducted.")

    spinWheelFor(entry)
    openGui(event)
}

function startNewRoundFor(entry) {
    if (!entry) return
    entry.bets = []
    entry.phase = "betting"
    entry.winningNumber = null
    entry.ballTargetSector = -1
    entry.player.message("§e[Roulette] New round! Place your bets!")
}

// ============================================================================
// EVENTS
// ============================================================================
function init(e) { npcUuid = e.npc.getUUID() }

function interact(e) {
    npcUuid = e.npc.getUUID()
    e.setCanceled(true)
    openGui(e)
}

function customGuiButton(e) {
    var bid = e.buttonId
    if (e.gui.getID() !== GUI_MAIN) return

    if (bid === C.BTN_10)        { doPlaceBet(e, 10);        return }
    if (bid === C.BTN_50)        { doPlaceBet(e, 50);        return }
    if (bid === C.BTN_200)       { doPlaceBet(e, 200);       return }
    if (bid === C.BTN_CUSTOM_BET){ doCustomBetSet(e);        return }
    if (bid === C.BTN_SPIN)      { doSpin(e);                return }

    if (bid === C.BTN_RED)       { doBetType(e, "RED");      return }
    if (bid === C.BTN_BLACK)     { doBetType(e, "BLACK");    return }
    if (bid === C.BTN_ODD)       { doBetType(e, "ODD");      return }
    if (bid === C.BTN_EVEN)      { doBetType(e, "EVEN");     return }
    if (bid === C.BTN_LOW)       { doBetType(e, "LOW");      return }
    if (bid === C.BTN_HIGH)      { doBetType(e, "HIGH");     return }
    if (bid === C.BTN_DOZEN1)    { doBetType(e, "DOZEN_1");  return }
    if (bid === C.BTN_DOZEN2)    { doBetType(e, "DOZEN_2");  return }
    if (bid === C.BTN_DOZEN3)    { doBetType(e, "DOZEN_3");  return }
    if (bid === C.BTN_COL1)      { doBetType(e, "COL_1");    return }
    if (bid === C.BTN_COL2)      { doBetType(e, "COL_2");    return }
    if (bid === C.BTN_COL3)      { doBetType(e, "COL_3");    return }

    if (bid >= C.BTN_NUM_BASE && bid <= C.BTN_NUM_BASE + 36) {
        doBetNumber(e, bid - C.BTN_NUM_BASE)
        return
    }

    if (bid === C.BTN_LEAVE) {
        delete openPlayers[e.player.getUUID()]
        e.player.closeGui()
        return
    }
}

function customGuiScroll(e) {}
function customGuiClosed(e) {}