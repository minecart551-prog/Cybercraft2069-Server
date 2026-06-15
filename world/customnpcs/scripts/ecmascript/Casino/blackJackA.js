// ============================================================================
// NPC BLACKJACK — Multiplayer Blackjack vs Dealer
// ============================================================================
// Script Type: NpcEvent (place on NPC > Advanced > Scripts)
// Style: ES5 | No Semicolons | CNPC 1.20.1
//
// FLOW:
//   Players right-click NPC to join the Blackjack table
//   Round phases: BETTING → PLAYER_TURNS → DEALER_TURN → RESULT
//   All players with GUI open see all hands update
//
// LAYOUT: Arc-style Blackjack table (up to 5 players)
//
// COIN CURRENCY:
//   stone_coin = 1¢   coal_coin = $1 (100¢)   emerald_coin = $100 (10,000¢)
// ============================================================================

var SYS = Java.type("java.lang.System")

// ============================================================================
// CONFIG
// ============================================================================
var BET_OPTIONS          = [10, 50, 200]   // in cents: 10¢, 50¢, $2.00
var MAX_PLAYERS          = 5
var CHALLENGE_TIMEOUT_MS = 30000
var TURN_TIMEOUT_MS      = 15000

var STONE_TO_COAL   = 100
var COAL_TO_EMERALD = 100
var COIN_STONE      = "coins:stone_coin"
var COIN_COAL       = "coins:coal_coin"
var COIN_EMERALD    = "coins:emerald_coin"

var SUITS = ["♠", "♥", "♦", "♣"]
var RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

// Card textures for face/back
var TEX_CARD_BACK   = "minecraft:textures/block/black_wool.png"
var TEX_CARD_BLACK  = "minecraft:textures/block/white_wool.png"   // spade/club
var TEX_CARD_RED    = "minecraft:textures/block/white_wool.png"   // heart/diamond

// ============================================================================
// GUI
// ============================================================================
var GUI_MAIN    = 7300
var GUI_W       = 420
var GUI_H       = 330

// Unique component ID counter (reset per GUI build)
var cid = 9000
function nextCid() { return cid++ }

// ============================================================================
// C — Component ID constants (for buttons that need stable handles)
// ============================================================================
var C = {
    LBL_DEALER_TITLE: 1,
    LBL_DEALER_HAND:  2,
    LBL_STATUS:       3,
    LBL_POT:          4,
    LBL_YOUR_HAND:    5,

    BTN_10:        20,
    BTN_50:        21,
    BTN_200:       22,
    BTN_HIT:       30,
    BTN_STAND:     31,
    BTN_DOUBLE:    32,
    BTN_START:     33,
    BTN_CLOSE:     34,
    BTN_NEW_ROUND: 35,
    BTN_LEAVE:     36,
    BTN_CUSTOM_BET: 37,
    TF_CUSTOM_BET:  38
}

// ============================================================================
// STATE
// ============================================================================
var npcUuid    = null
var game       = null
// game: {
//   phase, deck, dealerHand,
//   players: [ { uuid, name, hand, bet, state, result } ],
//   currentPlayerIdx, createdAt, turnStartedAt
// }
// Max 5 players in game.players

var openPlayers = {}         // uuid -> { player, API, gui }
var needsRefresh = false
var refreshExcludeUuid = null
var dealingIndex = 0          // current step in the card deal animation
var dealingQueue = []         // { type: "player"/"dealer", idx, card, hidden }
var LAST_TICK_MS = 0
var DEAL_DELAY_MS = 500       // ms between each dealt card

// ============================================================================
// HELPERS
// ============================================================================
function getNpc(world) {
    if (!npcUuid) return null
    return world.getEntity(npcUuid)
}

// ============================================================================
// CARD FUNCTIONS
// ============================================================================
function cardString(card) {
    if (card.hidden) return "§8[?]"
    var suitColor = (card.suit === 0 || card.suit === 3) ? "§0" : "§c"
    return suitColor + RANKS[card.rank] + SUITS[card.suit] + "§r"
}

function cardValue(rank) {
    if (rank === 0) return 11
    if (rank >= 10) return 10
    return rank + 1
}

function handValue(hand) {
    var total = 0
    var aces = 0
    for (var i = 0; i < hand.length; i++) {
        if (hand[i].hidden) continue
        var v = cardValue(hand[i].rank)
        total += v
        if (hand[i].rank === 0) aces++
    }
    while (total > 21 && aces > 0) { total -= 10; aces-- }
    return total
}

function createDeck() {
    var deck = []
    for (var s = 0; s < 4; s++)
        for (var r = 0; r < 13; r++)
            deck.push({ rank: r, suit: s, hidden: false })
    for (var i = deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var tmp = deck[i]; deck[i] = deck[j]; deck[j] = tmp
    }
    return deck
}

function drawCard() {
    if (!game || !game.deck || game.deck.length === 0) {
        if (game) game.deck = createDeck()
        else return null
    }
    return game.deck.pop()
}

function isBlackjack(hand) {
    return hand.length === 2 && handValue(hand) === 21 && !hand[0].hidden && !hand[1].hidden
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
    if (amount < STONE_TO_COAL) {
        return "§e" + amount + "¢"
    }
    var dollars = Math.floor(amount / STONE_TO_COAL)
    var cents = amount % STONE_TO_COAL
    if (cents === 0) return "§e$" + dollars + ".00"
    if (cents < 10) return "§e$" + dollars + ".0" + cents
    return "§e$" + dollars + "." + cents
}

// ============================================================================
// FIND PLAYER
// ============================================================================
function myPlayerIdx(uuid) {
    if (!game) return -1
    for (var i = 0; i < game.players.length; i++)
        if (game.players[i].uuid === uuid) return i
    return -1
}

function isMyTurn(uuid) {
    if (!game || game.phase !== "playing") return false
    return game.currentPlayerIdx >= 0 && game.players[game.currentPlayerIdx].uuid === uuid
}

// ============================================================================
// CARD RENDERER — Draws a playing card using textures + labels
// ============================================================================
function addCardToGui(gui, x, y, card, faceDown) {
    var cw = 32  // card width (was 22)
    var ch = 42  // card height (was 32)
    var id  = nextCid()

    if (faceDown) {
        gui.addTexturedRect(id, TEX_CARD_BACK, x, y, cw, ch)
        return
    }

    var isRed = (card.suit === 1 || card.suit === 2)
    var tex   = TEX_CARD_RED  // white background for all cards
    var color = isRed ? "§c" : "§0"  // dark blue for spades/clubs

    // Card background (always white)
    gui.addTexturedRect(id,   tex, x,   y,   cw, ch)

    // Border (4 colored lines)
    gui.addColoredLine(nextCid(), x,   y,   x+cw, y,   0x333333, 1)
    gui.addColoredLine(nextCid(), x,   y+ch, x+cw, y+ch, 0x333333, 1)
    gui.addColoredLine(nextCid(), x,   y,   x,   y+ch, 0x333333, 1)
    gui.addColoredLine(nextCid(), x+cw, y,   x+cw, y+ch, 0x333333, 1)

    // Top-left rank + suit (bigger)
    // Shift "10" left by 3px since it's wider
	var rankOffTop = (RANKS[card.rank] === "10") ? -1 : 0
    var rankOffBottom = (RANKS[card.rank] === "10") ? -3 : 0
    gui.addLabel(nextCid(), color + RANKS[card.rank], x+1+rankOffTop,  y+2,  14, 10)
    gui.addLabel(nextCid(), color + SUITS[card.suit],  x+1,  y+11, 12, 10)

    // Bottom-right rank + suit (bigger)
    gui.addLabel(nextCid(), color + SUITS[card.suit],  x+cw-10, y+ch-18, 12, 10)
    gui.addLabel(nextCid(), color + RANKS[card.rank],  x+cw-8+rankOffBottom, y+ch-9,  12, 10)

    // Center suit large (bigger)
    gui.addLabel(nextCid(), color + SUITS[card.suit] + "§r", x+12.5, y+17, 18, 16)
}

// ============================================================================
// THE GUI — Arc table layout
// ============================================================================
function openGui(event) {
    var player = event.player
    var uuid   = player.getUUID()
    var bal    = countCoins(player)

    var gui = event.API.createCustomGui(GUI_MAIN, GUI_W, GUI_H, false, player)

    // Reset component ID counter
    cid = 9000

    // ── Dealer area ──
    gui.addLabel(C.LBL_DEALER_TITLE, "§f§lDEALER", 180, 6, 60, 10)

    // Draw dealer's hand
    var dealerX = 200
    var CARD_GAP = 35  // spacing between cards (was 24)
    if (game && game.dealerHand && game.dealerHand.length > 0) {
        var showAll = (game.phase === "result" || game.phase === "dealer")
        // During dealing phase, only show cards up to dealingIndex
        var maxDealerCards = game.dealerHand.length
        if (game.phase === "dealing") {
            var dealtDealer = 0
            for (var di = 0; di < dealingQueue.length && di < dealingIndex; di++) {
                if (dealingQueue[di].type === "dealer") dealtDealer++
            }
            maxDealerCards = dealtDealer
        }
        var startX = dealerX - Math.floor((maxDealerCards * CARD_GAP) / 2)
        for (var d = 0; d < maxDealerCards; d++) {
            var isHidden = game.dealerHand[d].hidden && !showAll
            addCardToGui(gui, startX + d * CARD_GAP, 16, isHidden ? null : game.dealerHand[d], isHidden)
        }
        if (showAll) {
            gui.addLabel(C.LBL_DEALER_HAND, "§7Value: §f" + handValue(game.dealerHand), 180, 62, 120, 10)
        }
    }

    // ── Player positions — arc layout ─────────────────────────────────────
    // Arc coordinates: { x, y } for each of 5 seats (index 0-4)
    // Arranged in a semi-circle from left to right
    var playerSeats = [
        { x: -80,   y: 60  },  // P0 — far left (seat index 0)
        { x: 30,  y: 160 },  // P1 — left-center (seat index 1)
        { x: 177, y: 190 },  // P2 — center (seat index 2)
        { x: 330, y: 160 },  // P3 — right-center (seat index 3)
        { x: 440, y: 60 }   // P4 — far right (seat index 4)
    ]

    var pIdx = myPlayerIdx(uuid)

    // Draw seat circles (empty oval backgrounds for each seat)
    for (var s = 0; s < MAX_PLAYERS; s++) {
        var seat = playerSeats[s]
        // Seat marker
        gui.addLabel(nextCid(), "§8○", seat.x + 30, seat.y - 8, 12, 12)
    }

    // Draw seated players
    if (game) {
        for (var i = 0; i < game.players.length; i++) {
            var p   = game.players[i]
            var seat = playerSeats[i]
            var sx = seat.x - 20
            var sy = seat.y 

            var isActive  = (i === game.currentPlayerIdx && game.phase === "playing")
            var isBust    = (p.state === "bust")
            var isStood   = (p.state === "stood" || p.state === "blackjack")
            var nameColor = isBust  ? "§c" : (isStood ? "§a" : (isActive ? "§e" : "§f"))

            // Player name + highlight
            gui.addLabel(nextCid(), nameColor + "§l" + p.name, sx, sy, 80, 10)

            // Bet amount
            if (p.bet > 0) {
                gui.addLabel(nextCid(), "§7Bet: " + fmt(p.bet), sx, sy + 10, 80, 10)
            }

            // Hand cards — during dealing phase, only show up to dealingIndex
            if (p.hand && p.hand.length > 0) {
                var handStartX = sx
                var handStartY = sy + 22
                var maxCards = p.hand.length
                if (game.phase === "dealing") {
                    // Count how many of this player's cards have been dealt
                    var dealtForThisPlayer = 0
                    for (var di = 0; di < dealingQueue.length && di < dealingIndex; di++) {
                        if (dealingQueue[di].type === "player" && dealingQueue[di].idx === i) dealtForThisPlayer++
                    }
                    maxCards = dealtForThisPlayer
                }
                for (var c = 0; c < maxCards; c++) {
                    addCardToGui(gui, handStartX + c * CARD_GAP, handStartY, p.hand[c], false)
                }
                // Hand value
                var val = handValue(p.hand)
                gui.addLabel(nextCid(), "§7Value: §f" + val, sx, handStartY + 46, 60, 10)

                // State label (BUST, BLACKJACK)
                if (p.state === "bust") gui.addLabel(nextCid(), "§c§lBUST", sx + 48, handStartY + 46, 40, 10)
                if (p.state === "blackjack") gui.addLabel(nextCid(), "§6§lBJ!", sx + 48, handStartY + 46, 40, 10)
            }

            // Result
            if (p.result) {
                var resColor = (p.result === "win")  ? "§a" : (p.result === "push") ? "§e" : "§c"
                var resText  = (p.result === "win")  ? "WIN + " + fmt(p.bet * 2)
                             : (p.result === "push") ? "PUSH"
                             : "LOSE - " + fmt(p.bet)
                gui.addLabel(nextCid(), resColor + "§l" + resText, sx, sy + 80, 80, 10)
            }

            // Turn indicator
            if (isActive) {
                gui.addLabel(nextCid(), "§e◄ YOUR TURN", sx, sy + 80, 80, 10)
            }
        }
    }

    // ── Status bar (between player seats and controls) ─────────────────────
    var statusY = 256
    if (game) {
        if (game.phase === "betting") {
            gui.addLabel(C.LBL_STATUS, "§6§lBETTING PHASE — Place your bet!", 140, statusY, 260, 12)
        } else if (game.phase === "playing") {
            var cur = game.players[game.currentPlayerIdx]
            var turnText = (cur.uuid === uuid) ? "§e§lYOUR TURN" : "§7" + cur.name + "'s turn..."
            gui.addLabel(C.LBL_STATUS, turnText, 183, statusY, 300, 12)
            gui.addLabel(C.LBL_POT, "§7Pot: §f" + fmt(totalPot()), 321, statusY, 100, 12)
        } else if (game.phase === "dealer") {
            gui.addLabel(C.LBL_STATUS, "§c§lDealer's turn...", 120, statusY, 200, 12)
        } else if (game.phase === "result") {
            gui.addLabel(C.LBL_STATUS, "§a§lRound Over!", 186, statusY - 1, 120, 12)
            gui.addLabel(C.LBL_POT, "§7Pot: §f" + fmt(totalPot()), 310, statusY, 100, 12)
        }
    } else {
        gui.addLabel(C.LBL_STATUS, "§7No active game. Place a bet to start!", 140, statusY, 220, 12)
    }

    // ── Controls ──────────────────────────────────────────────────────────
    var cy = 270

    if (!game || game.phase === "idle" || game.phase === "betting") {
        var bw = 58
        gui.addButton(C.BTN_10,  fmt(BET_OPTIONS[0]), 110,  cy, bw, 16)
        gui.addButton(C.BTN_50,  fmt(BET_OPTIONS[1]), 180, cy, bw, 16)
        gui.addButton(C.BTN_200, fmt(BET_OPTIONS[2]), 250, cy, bw, 16)
        // Custom bet text field + button
        gui.addLabel(nextCid(), "§7Custom($)", 123, cy + 25, 50, 10)
        gui.addTextField(C.TF_CUSTOM_BET, 170, cy + 23, 78, 14).setText("")
        gui.addButton(C.BTN_CUSTOM_BET, "§aBet", 256, cy + 23, 35, 14)
        if (game && game.players.length > 0) {
            gui.addButton(C.BTN_START, "§a§lDeal", 340, cy, 60, 16)
        }
    } else if (game.phase === "playing") {
        if (isMyTurn(uuid) && pIdx >= 0) {
            var myP = game.players[pIdx]
            gui.addButton(C.BTN_HIT,   "§a§lHIT",   114,  cy, 58, 18)
            gui.addButton(C.BTN_STAND, "§e§lSTAND", 180, cy, 58, 18)
            if (myP.hand.length === 2 && bal >= myP.bet) {
                gui.addButton(C.BTN_DOUBLE, "§6§lDOUBLE", 246, cy, 58, 18)
            }
            gui.addLabel(C.LBL_YOUR_HAND, "§7Your hand value: §f" + handValue(myP.hand), 320, cy, 140, 10)
        } else {
            gui.addLabel(C.LBL_YOUR_HAND, "§7Waiting...", 180, cy, 100, 10)
        }
    } else if (game.phase === "dealer") {
        gui.addLabel(C.LBL_YOUR_HAND, "§7Dealer drawing...", 140, cy, 120, 10)
    } else if (game.phase === "result") {
        gui.addButton(C.BTN_NEW_ROUND, "§a§lNew Round", 120,  cy, 80, 16)
        gui.addButton(C.BTN_CLOSE,     "§7Close Table", 220, cy, 80, 16)
    }

    // Leave button (always visible, top-right)
    gui.addButton(C.BTN_LEAVE, "§7Leave", GUI_W - 50, 2, 46, 12)

    player.showCustomGui(gui)
    openPlayers[uuid] = { player: player, API: event.API, gui: gui }
}

// ============================================================================
// TOTAL POT
// ============================================================================
function totalPot() {
    if (!game) return 0
    var total = 0
    for (var i = 0; i < game.players.length; i++)
        if (game.players[i].bet > 0) total += game.players[i].bet * 2
    return total
}

// ============================================================================
// REFRESH
// ============================================================================
function refreshAllGuis(excludeUuid) {
    var uuids = Object.keys(openPlayers)
    for (var i = 0; i < uuids.length; i++) {
        if (excludeUuid && uuids[i] === excludeUuid) continue
        var entry = openPlayers[uuids[i]]
        if (entry && entry.player && entry.API) {
            try { openGui(entry) } catch (e) {}
        }
    }
    needsRefresh = false
    refreshExcludeUuid = null
}

// ============================================================================
// GAME LOGIC
// ============================================================================
function startNewGame() {
    if (!game || game.phase !== "betting") return
    if (game.players.length === 0) { game = null; return }

    // Only players with bets get dealt in
    var activePlayers = []
    for (var i = 0; i < game.players.length && activePlayers.length < MAX_PLAYERS; i++) {
        if (game.players[i].bet > 0) {
            game.players[i].hand = []
            game.players[i].state = "playing"
            activePlayers.push(game.players[i])
        }
    }
    if (activePlayers.length === 0) { game = null; return }
    game.players = activePlayers

    game.dealerHand = []
    game.deck = createDeck()
    game.dealerBlackjack = false

    // Build dealing queue: real-life order
    // Round 1: each player gets a face-up card, then dealer gets a face-up card
    // Round 2: each player gets a face-up card, then dealer gets a face-down card
    var queue = []

    // Round 1: player cards (face-up)
    for (var p = 0; p < game.players.length; p++) {
        queue.push({ type: "player", idx: p, card: null, hidden: false, round: 1 })
    }
    // Round 1: dealer card (face-up)
    queue.push({ type: "dealer", idx: 0, card: null, hidden: false, round: 1 })

    // Round 2: player cards (face-up)
    for (var p = 0; p < game.players.length; p++) {
        queue.push({ type: "player", idx: p, card: null, hidden: false, round: 2 })
    }
    // Round 2: dealer card (face-down)
    queue.push({ type: "dealer", idx: 1, card: null, hidden: true, round: 2 })

    // Pre-draw all cards so they're ready
    for (var q = 0; q < queue.length; q++) {
        var step = queue[q]
        var drawn = drawCard()
        step.card = drawn
        if (step.type === "player") {
            game.players[step.idx].hand.push(drawn)
        } else {
            game.dealerHand.push(drawn)
        }
    }

    // Set dealing phase and init the animation
    game.phase = "dealing"
    dealingQueue = queue
    dealingIndex = 0
    LAST_TICK_MS = SYS.currentTimeMillis()
    needsRefresh = true
}

function doPlaceBet(event, amount) {
    var player = event.player
    var uuid   = player.getUUID()
    var bal    = countCoins(player)

    // Max 5 players check
    if (game && game.players.length >= MAX_PLAYERS && myPlayerIdx(uuid) < 0) {
        player.message("§c[Blackjack] Table is full (" + MAX_PLAYERS + " players max)!")
        openGui(event)
        return
    }

    if (bal < amount) {
        player.message("§c[Blackjack] Not enough coins! Need " + fmt(amount))
        openGui(event)
        return
    }

    if (!game) {
        game = {
            phase: "betting", deck: [], dealerHand: [], players: [],
            currentPlayerIdx: -1, createdAt: SYS.currentTimeMillis(), turnStartedAt: 0
        }
    }

    if (game.phase !== "betting" && game.phase !== "idle") {
        player.message("§c[Blackjack] A round is already in progress!")
        openGui(event)
        return
    }

    if (game.phase === "idle") {
        game.phase = "betting"; game.players = []; game.dealerHand = []
        game.currentPlayerIdx = -1; game.createdAt = SYS.currentTimeMillis()
    }

    var pIdx = myPlayerIdx(uuid)
    if (pIdx >= 0) {
        var p = game.players[pIdx]
        if (p.bet > 0) {
            player.message("§c[Blackjack] You already placed a bet of " + fmt(p.bet) + "!")
            openGui(event)
            return
        }
        if (!removeCoins(player, amount)) { player.message("§c[Blackjack] Coin deduction failed."); return }
        p.bet = amount
        player.message("§a[Blackjack] You bet " + fmt(amount) + " at the Blackjack table!")
        openGui(event)
        needsRefresh = true; refreshExcludeUuid = uuid
        return
    }

    if (!removeCoins(player, amount)) { player.message("§c[Blackjack] Coin deduction failed."); return }

    game.players.push({
        uuid: uuid, name: player.getName(), hand: [], bet: amount,
        state: "waiting_bet", result: null
    })

    player.message("§a[Blackjack] You bet " + fmt(amount) + " at the Blackjack table!")
    openGui(event)
    needsRefresh = true; refreshExcludeUuid = uuid
}

function doCustomBet(event) {
    var player = event.player
    var uuid   = player.getUUID()
    var gui    = event.gui

    try {
        var textField = gui.getComponent(C.TF_CUSTOM_BET)
        if (!textField) { player.message("§c[Blackjack] Could not read custom bet field!"); return }
        var raw = textField.getText()
        if (!raw || raw === "") { player.message("§c[Blackjack] Enter a bet amount!"); return }

        // Parse dollar amount (e.g. "16.05", "$10", "0.50")
        var cleaned = raw.replace("$", "").trim()
        var parsed = parseFloat(cleaned)
        if (isNaN(parsed) || parsed <= 0) {
            player.message("§c[Blackjack] Invalid amount: " + raw)
            return
        }

        // Convert dollars to cents, ensure no sub-cent decimals
        var cents = Math.round(parsed * 100)
        if (cents < 1) { player.message("§c[Blackjack] Minimum bet is 1¢!"); return }
        if (cents > 10000) { player.message("§c[Blackjack] Maximum bet is $100.00!"); return } // $100 max

        var amount = cents
        var bal    = countCoins(player)

        // Max 5 players check
        if (game && game.players.length >= MAX_PLAYERS && myPlayerIdx(uuid) < 0) {
            player.message("§c[Blackjack] Table is full (" + MAX_PLAYERS + " players max)!")
            openGui(event)
            return
        }

        if (bal < amount) {
            player.message("§c[Blackjack] Not enough coins! Need " + fmt(amount))
            openGui(event)
            return
        }

        if (!game) {
            game = {
                phase: "betting", deck: [], dealerHand: [], players: [],
                currentPlayerIdx: -1, createdAt: SYS.currentTimeMillis(), turnStartedAt: 0
            }
        }

        if (game.phase !== "betting" && game.phase !== "idle") {
            player.message("§c[Blackjack] A round is already in progress!")
            openGui(event)
            return
        }

        if (game.phase === "idle") {
            game.phase = "betting"; game.players = []; game.dealerHand = []
            game.currentPlayerIdx = -1; game.createdAt = SYS.currentTimeMillis()
        }

        var pIdx = myPlayerIdx(uuid)
        if (pIdx >= 0) {
            var p = game.players[pIdx]
            if (p.bet > 0) {
                player.message("§c[Blackjack] You already placed a bet of " + fmt(p.bet) + "!")
                openGui(event)
                return
            }
            if (!removeCoins(player, amount)) { player.message("§c[Blackjack] Coin deduction failed."); return }
            p.bet = amount
            player.message("§a[Blackjack] You bet " + fmt(amount) + " at the Blackjack table!")
            openGui(event)
            needsRefresh = true; refreshExcludeUuid = uuid
            return
        }

        if (!removeCoins(player, amount)) { player.message("§c[Blackjack] Coin deduction failed."); return }

        game.players.push({
            uuid: uuid, name: player.getName(), hand: [], bet: amount,
            state: "waiting_bet", result: null
        })

        player.message("§a[Blackjack] You bet " + fmt(amount) + " at the Blackjack table!")
        openGui(event)
        needsRefresh = true; refreshExcludeUuid = uuid
    } catch (err) {
        player.message("§c[Blackjack] Error processing custom bet: " + err)
    }
}

function doStart(event) {
    if (!game) return
    var uuid = event.player.getUUID()
    startNewGame()
    openGui(event)
    needsRefresh = true; refreshExcludeUuid = uuid
    var uuids = Object.keys(openPlayers)
    for (var i = 0; i < uuids.length; i++) {
        var entry = openPlayers[uuids[i]]
        if (entry && entry.player) entry.player.message("§e[Blackjack] Cards dealt! Good luck!")
    }
}

function doHit(event) {
    var player = event.player; var uuid = player.getUUID()
    if (!game || game.phase !== "playing") return
    if (!isMyTurn(uuid)) { player.message("§c[Blackjack] It's not your turn!"); return }

    var pIdx = myPlayerIdx(uuid); var p = game.players[pIdx]
    var card = drawCard(); p.hand.push(card)
    var val = handValue(p.hand)

    if (val > 21) {
        p.state = "bust"
        player.message("§c[Blackjack] Bust! You drew a " + cardString(card) + " (" + val + ")")
        nextTurn(uuid)
    } else if (val === 21) {
        player.message("§a[Blackjack] 21! Nice!")
        nextTurn(uuid)
    } else {
        player.message("§e[Blackjack] You drew a " + cardString(card) + " (" + val + ")")
        game.turnStartedAt = SYS.currentTimeMillis()
        openGui(event)
        needsRefresh = true; refreshExcludeUuid = uuid
    }
}

function doStand(event) {
    var player = event.player; var uuid = player.getUUID()
    if (!game || game.phase !== "playing") return
    if (!isMyTurn(uuid)) { player.message("§c[Blackjack] It's not your turn!"); return }
    var pIdx = myPlayerIdx(uuid)
    game.players[pIdx].state = "stood"
    player.message("§e[Blackjack] You stand at " + handValue(game.players[pIdx].hand))
    nextTurn(uuid)
}

function doDouble(event) {
    var player = event.player; var uuid = player.getUUID(); var bal = countCoins(player)
    if (!game || game.phase !== "playing") return
    if (!isMyTurn(uuid)) { player.message("§c[Blackjack] It's not your turn!"); return }
    var pIdx = myPlayerIdx(uuid); var p = game.players[pIdx]
    if (p.hand.length !== 2) { player.message("§c[Blackjack] Can only double down on first two cards!"); return }
    if (bal < p.bet) { player.message("§c[Blackjack] Not enough coins to double down!"); return }
    if (!removeCoins(player, p.bet)) { player.message("§c[Blackjack] Coin deduction failed."); return }
    p.bet *= 2
    var card = drawCard(); p.hand.push(card)
    var val = handValue(p.hand)
    if (val > 21) { p.state = "bust"; player.message("§c[Blackjack] Double down bust! (" + val + ")") }
    else { p.state = "stood"; player.message("§e[Blackjack] Double down! You stand at " + val) }
    nextTurn(uuid)
}

function nextTurn(excludeUuid) {
    if (!game) return
    for (var i = game.currentPlayerIdx + 1; i < game.players.length; i++) {
        if (game.players[i].state === "playing") {
            game.currentPlayerIdx = i; game.turnStartedAt = SYS.currentTimeMillis()
            needsRefresh = true; refreshExcludeUuid = excludeUuid
            return
        }
    }
    finishDealerTurn()
}

function finishDealerTurn() {
    if (!game) return
    game.phase = "dealer"; game.currentPlayerIdx = -1

    if (game.dealerHand && game.dealerHand.length > 1) game.dealerHand[1].hidden = false

    var dVal = handValue(game.dealerHand)
    while (dVal < 17) { var card = drawCard(); game.dealerHand.push(card); dVal = handValue(game.dealerHand) }

    for (var i = 0; i < game.players.length; i++) {
        var p = game.players[i]
        if (p.state === "bust") { p.result = "lose"; continue }
        if (p.state === "blackjack") {
            if (game.dealerBlackjack) { p.result = "push" }
            else {
                p.result = "win"
                var payout = p.bet + Math.floor(p.bet * 1.5)
                var entry = openPlayers[p.uuid]
                if (entry && entry.player) { giveCoins(entry.player, payout); entry.player.message("§6[Blackjack] BLACKJACK! You won " + fmt(payout) + "!") }
            }
            continue
        }
        var pVal = handValue(p.hand)
        if (dVal > 21 || pVal > dVal) {
            p.result = "win"
            var payout = p.bet * 2
            var entry = openPlayers[p.uuid]
            if (entry && entry.player) { giveCoins(entry.player, payout); entry.player.message("§a[Blackjack] You won " + fmt(payout) + "!") }
        } else if (pVal === dVal) {
            p.result = "push"
            var entry = openPlayers[p.uuid]
            if (entry && entry.player) { giveCoins(entry.player, p.bet); entry.player.message("§e[Blackjack] Push! " + fmt(p.bet) + " returned.") }
        } else {
            p.result = "lose"
            var entry = openPlayers[p.uuid]
            if (entry && entry.player) { entry.player.message("§c[Blackjack] Dealer wins with " + dVal + ". You lost " + fmt(p.bet) + ".") }
        }
    }

    game.phase = "result"
    needsRefresh = true
}

function doNewRound(event) {
    if (!game) return
    var uuid = event.player.getUUID()
    for (var i = 0; i < game.players.length; i++) {
        var p = game.players[i]; p.hand = []; p.bet = 0; p.state = "waiting_bet"; p.result = null
    }
    game.phase = "betting"; game.dealerHand = []; game.deck = []; game.currentPlayerIdx = -1
    game.createdAt = SYS.currentTimeMillis()
    openGui(event)
    needsRefresh = true; refreshExcludeUuid = uuid
}

function findOnline(world, uuid) {
    try {
        if (!world) {
            var uuids = Object.keys(openPlayers)
            for (var i = 0; i < uuids.length; i++) {
                var entry = openPlayers[uuids[i]]
                if (entry && entry.player) { world = entry.player.getWorld(); break }
            }
        }
        if (!world) return null
        var list = world.getOnlinePlayers()
        for (var i = 0; i < list.length; i++)
            if (list[i].getUUID() === uuid) return list[i]
    } catch (e) {}
    return null
}

// ============================================================================
// EVENTS
// ============================================================================
function init(e) { npcUuid = e.npc.getUUID() }

function tick(e) {
    if (needsRefresh) { refreshAllGuis(refreshExcludeUuid) }

    if (game && game.phase === "dealing") {
        var now = SYS.currentTimeMillis()
        if (now - LAST_TICK_MS >= DEAL_DELAY_MS) {
            dealingIndex++
            LAST_TICK_MS = now
            needsRefresh = true

            // Check if all cards have been dealt
            if (dealingIndex >= dealingQueue.length) {
                // Dealer's hole card is already hidden from pre-draw
                // Check for blackjacks
                for (var p = 0; p < game.players.length; p++)
                    if (isBlackjack(game.players[p].hand)) game.players[p].state = "blackjack"

                game.dealerBlackjack = isBlackjack(game.dealerHand)
                if (game.dealerBlackjack) {
                    game.dealerHand[1].hidden = false  // reveal
                    for (var p = 0; p < game.players.length; p++) {
                        if (game.players[p].state === "blackjack") game.players[p].result = "push"
                        else { game.players[p].state = "bust"; game.players[p].result = "lose" }
                    }
                    finishDealerTurn()
                    return
                }

                var allDone = true
                for (var p = 0; p < game.players.length; p++)
                    if (game.players[p].state === "playing") { allDone = false; break }
                if (allDone) { finishDealerTurn(); return }

                game.phase = "playing"
                game.currentPlayerIdx = 0
                game.turnStartedAt = SYS.currentTimeMillis()
                needsRefresh = true
            }
        }
    }

    if (game && game.phase === "playing" && game.currentPlayerIdx >= 0) {
        var elapsed = SYS.currentTimeMillis() - game.turnStartedAt
        if (elapsed > TURN_TIMEOUT_MS) {
            var p = game.players[game.currentPlayerIdx]; p.state = "stood"; nextTurn()
        }
    }

    if (game && game.phase === "betting") {
        var elapsed = SYS.currentTimeMillis() - game.createdAt
        if (elapsed > CHALLENGE_TIMEOUT_MS) {
            if (game.players.length > 0) startNewGame()
            else { game = null; refreshAllGuis() }
        }
    }
}

function interact(e) {
    npcUuid = e.npc.getUUID()
    e.setCanceled(true)
    openGui(e)
}

function customGuiButton(e) {
    var bid = e.buttonId
    if (e.gui.getID() !== GUI_MAIN) return

    if (bid === C.BTN_10)       { doPlaceBet(e, BET_OPTIONS[0]); return }
    if (bid === C.BTN_50)       { doPlaceBet(e, BET_OPTIONS[1]); return }
    if (bid === C.BTN_200)      { doPlaceBet(e, BET_OPTIONS[2]); return }
    if (bid === C.BTN_CUSTOM_BET){ doCustomBet(e);              return }
    if (bid === C.BTN_START)    { doStart(e);                   return }
    if (bid === C.BTN_HIT)      { doHit(e);                    return }
    if (bid === C.BTN_STAND)    { doStand(e);                  return }
    if (bid === C.BTN_DOUBLE)   { doDouble(e);                 return }
    if (bid === C.BTN_NEW_ROUND){ doNewRound(e);               return }
    if (bid === C.BTN_LEAVE)    {
        var uuid = e.player.getUUID()
        delete openPlayers[uuid]
        if (game && game.phase === "betting") {
            var pIdx = myPlayerIdx(uuid)
            if (pIdx >= 0) {
                var p = game.players[pIdx]
                var player = e.player
                giveCoins(player, p.bet)
                player.message("§e[Blackjack] Bet refunded: " + fmt(p.bet))
                game.players.splice(pIdx, 1)
                if (game.players.length === 0) game = null
            }
        }
        e.player.closeGui()
        needsRefresh = true
        return
    }
    if (bid === C.BTN_CLOSE)    {
        var uuid = e.player.getUUID()
        delete openPlayers[uuid]
        if (game && game.phase === "betting") {
            var pIdx = myPlayerIdx(uuid)
            if (pIdx >= 0) {
                var p = game.players[pIdx]
                var player = e.player
                giveCoins(player, p.bet)
                player.message("§e[Blackjack] Bet refunded: " + fmt(p.bet))
                game.players.splice(pIdx, 1)
                if (game.players.length === 0) game = null
            }
        }
        e.player.closeGui()
        needsRefresh = true
        return
    }
}

function customGuiScroll(e) {}
function customGuiClosed(e) {
    var uuid = e.player.getUUID()
    delete openPlayers[uuid]
}