// ============================================================================
// MENU — PLAYER SCRIPT
// ============================================================================
// Single source for ALL chat commands and ALL customGuiButton / customGuiClosed
// handling across every GUI in the game. Other player scripts (teampc_player.js,
// etc.) must NOT define chat(), customGuiButton(), or customGuiClosed().
// Requires bombteam_config.js loaded FIRST.
// ============================================================================
var GUI_MENU     = 7604
var GUI_TUTORIAL = 7605
var GUI_TEAMPC_TUTORIAL = 7606
// ── Button ID constants ──────────────────────────────────────────────────────
var MN = { BTN_JOBS: 10, BTN_TUTORIAL: 11, BTN_CLOSE: 12 }
var TU = { BTN_BACK: 10, BTN_CLOSE: 11 }

// ── Tutorial topic IDs (also used as button IDs 20-29) ───────────────────────
var TU_TOPICS = {
    BASIC:      20,
    WEAPONS:    21,
    REPLICANTS: 22,
    DELIVERY:   23,
    RESTAURANT: 24,
    FARMING:    25,
    SMUGGLING:  26,
    BOUNTY:     27,
    FACTIONS:   28,
    COSMETIC:   29
}

// Per-player last-selected topic (defaults to BASIC on first open)
var tuTopicState = {}

// ── Topic definitions ─────────────────────────────────────────────────────────
// label  = text shown on the left nav button
// title  = heading shown in the right panel
// lines  = array of info lines rendered in the right panel
var TUTORIAL_TOPICS = {}
TUTORIAL_TOPICS[TU_TOPICS.BASIC] = {
    label: "\u00a7f\u2139 Basic Info",
    title: "\u00a7e\u00a7l\u2139 Basic Info",
    lines: [
        "\u00a7a\u2764 \u00a7fNo-PVP area: \u00a7aall items kept on death",
        "\u00a7c  \u00a7f(except bullets & sharper armor trim)",
        "\u00a7c\u2620 \u00a7fOutside no-PVP: \u00a7citems drop on death",
        "\u00a7e\ud83d\udd12 \u00a7fPackages & Keys \u00a7anever\u00a7f drop anywhere",
        "\u00a7b\ud83d\udecf \u00a7fSave spawn at any \u00a7eBed\u00a7f (Train Stations)",
        "\u00a7a\ud83c\udf5f \u00a7fBuy food from \u00a7evending machines\u00a7f in city",
        "\u00a7b/unstuckme\u00a7f to unstuck",
        "\u00a7b/spawnme\u00a7f to get back to spawn (only work 3 times)"
    ]
}
TUTORIAL_TOPICS[TU_TOPICS.WEAPONS] = {
    label: "\u00a7c\ud83d\udd2b Weapons",
    title: "\u00a7c\u00a7l\ud83d\udd2b Weapons & Gear",
    lines: [
        "\u00a7e\ud83d\uded2 \u00a7fBuy guns, ammo & gear at \u00a7eNiki's Shop",
        "\u00a7f  \u00a7f(Market level)",
        "\u00a7c\u26a1 \u00a7fGuns have \u00a7cdurability\u00a7f \u2014 repair by mining",
        "\u00a7f  at \u00a7eDesert Tunnel\u00a7f. Recipes at nearby table",
        "\u00a7c\u26a0 \u00a7fCrafted armor \u00a7cweaker\u00a7f than shop armor"
    ]
}
TUTORIAL_TOPICS[TU_TOPICS.REPLICANTS] = {
    label: "\u00a7c\u2620 Replicants",
    title: "\u00a7c\u00a7l\u2620 Replicant Hunting",
    lines: [
        "\u00a7e\ud83e\udd16 \u00a7fTypes: \u00a7fNeonites \u00a7c| \u00a7fTechnoVikings \u00a7c|",
        "\u00a7f  Neurobytes \u00a7c| \u00a7fEDrones \u00a7c| \u00a7fGang Members",
        "\u00a7c\u26a1 \u00a7fEach type has its own \u00a7cdifficulty",
        "\u00a7e\ud83d\udee1 \u00a7fReplicants defend same-faction bots \u2014",
        "\u00a7f  take \u00a7ecover\u00a7f & watch for nearby enemies",
        "\u00a7a\u2605 \u00a7fCheck \u00a7ereward ammount\u00a7f at Harald on market level",
        "\u00a7a\ud83d\udca1 \u00a7fStart with \u00a7aNeonites\u00a7f (weakest first!)"
    ]
}
TUTORIAL_TOPICS[TU_TOPICS.DELIVERY] = {
    label: "\u00a7b\ud83d\udce6 Delivery",
    title: "\u00a7b\u00a7l\ud83d\udce6 Delivery Job",
    lines: [
        "\u00a7e\ud83d\udcee \u00a7fGet a package from \u00a7eMailman at DeliveryInc",
        "\u00a7a\ud83d\udcb0 \u00a7fFarther destination \u00a7a= more money earned",
        "\u00a7a\ud83d\udd12 \u00a7fPackages \u00a7anever drop on death\u00a7f \u2014 safe!",
        "\u00a7f  You can deliver later, no rush"
    ]
}
TUTORIAL_TOPICS[TU_TOPICS.RESTAURANT] = {
    label: "\u00a7d\ud83c\udf7d Restaurant",
    title: "\u00a7d\u00a7l\ud83c\udf7d Restaurant Job",
    lines: [
        "\u00a7e\ud83e\udd69 \u00a7fIngredients drop from \u00a7creplicants\u00a7f & drones",
        "\u00a7a\ud83d\udcd6 \u00a7fLearn recipes at \u00a7eMarlene's Bar",
        "\u00a7b\ud83c\udf74 \u00a7fChoose your menu, then serve customers",
        "\u00a7f  Hunt replicants regularly to restock!"
    ]
}
TUTORIAL_TOPICS[TU_TOPICS.FARMING] = {
    label: "\u00a7a\ud83c\udf31 Farming",
    title: "\u00a7a\u00a7l\ud83c\udf31 Farming",
    lines: [
        "\u00a7e\ud83c\udf3f \u00a7fYou start with \u00a7e5 starter pots",
        "\u00a7f  (pots = sugarcane only; other plants",
        "\u00a7f   grow on dirt normally)",
        "\u00a7b\ud83d\uded2 \u00a7fBuy seeds & pots at \u00a7eSobiez\u00f3ja's Shop\u00a7f (lvl 2)",
        "\u00a7a\ud83c\udfe1 \u00a7fGrow in your \u00a7eapartment\u00a7f or \u00a7efaction land",
        "\u00a7d\ud83c\udf80 \u00a7fSobiez\u00f3ja also sells \u00a7edecorational items"
    ]
}
TUTORIAL_TOPICS[TU_TOPICS.SMUGGLING] = {
    label: "\u00a7e\ud83d\udc8a Smuggling",
    title: "\u00a7e\u00a7l\ud83d\udc8a Sugar Smuggling",
    lines: [
        "\u00a7c\u26a0 \u00a7fHigh-risk, \u00a7ahigh-reward\u00a7f sugar runs",
        "\u00a7a\ud83c\udf6c \u00a7fGet \u00a7e1 free sugarcane/day\u00a7f from the Dealer",
        "\u00a7f  Grow more in your apartment or land",
        "\u00a7e\ud83d\udcb0 \u00a7fPayout \u00a7emultiplies\u00a7f by amount carried",
        "\u00a7c\ud83d\udea8 \u00a7fLCPD \u00a7cchases & arrests\u00a7f on sight",
        "\u00a7f  if you carry sugar in their FOV",
        "\u00a7a\ud83d\udca1 \u00a7fStack more sugar before running!"
    ]
}
TUTORIAL_TOPICS[TU_TOPICS.BOUNTY] = {
    label: "\u00a7c\ud83c\udfaf Bounty",
    title: "\u00a7c\u00a7l\ud83c\udfaf Bounty Hunting",
    lines: [
        "\u00a7e\u26a1 \u00a7fAdvanced combat contracts",
        "\u00a7c\u26a0 \u00a7fFor \u00a7cexperienced hunters\u00a7f \u2014 needs",
        "\u00a7f  better gear than basic replicant hunts",
        "\u00a7b\ud83d\udccd \u00a7fMeet \u00a7eOskar at the Bounty Bar\u00a7f for info"
    ]
}
TUTORIAL_TOPICS[TU_TOPICS.FACTIONS] = {
    label: "\u00a7b\ud83c\udff0 Factions",
    title: "\u00a7b\u00a7l\ud83c\udff0 Factions",
    lines: [
        "\u00a7e\ud83d\udcb0 \u00a7fClaim cosmetic shop \u2192 earn \u00a7ereal money",
        "\u00a7a\ud83d\uddfa \u00a7fClaim land in \u00a7eFreezone\u00a7f (via Cable Car)",
        "\u00a7f  or Free Buildings in the city",
        "\u00a7c\u2694 \u00a7fFactions can \u00a7cfight & take over\u00a7f land",
        "\u00a7b\ud83c\udfe0 \u00a7fApartments via \u00a7eLena\u00a7f or \u00a7e#real-estate\u00a7f",
        "\u00a7f  on Discord",
        "\u00a7f\ud83d\udcac \u00a7fSee \u00a7e#faction\u00a7f on Discord for commands"
    ]
}
TUTORIAL_TOPICS[TU_TOPICS.COSMETIC] = {
    label: "\u00a7d\u2b50 Cosmetic Shop",
    title: "\u00a7d\u00a7l\u2b50 Cosmetic Shop",
    lines: [
        "\u00a7e\ud83c\udfe0 \u00a7fFactions claim shop: rename NPC at",
        "\u00a7e  1700 -48 -336\u00a7f coordinate",
        "\u00a7a\ud83d\udcb0 \u00a7fOwning faction earns \u00a7a25%\u00a7f of each",
        "\u00a7f  player's cosmetic purchase (\u00a7ereal money\u00a7f!)",
        "\u00a7d\ud83c\udfa8 \u00a7fCosmetic artists earn \u00a7d25%\u00a7f per purchase"
    ]
}

// Ordered list of topic IDs (top to bottom in nav)
var TU_TOPIC_ORDER = [
    TU_TOPICS.BASIC,
    TU_TOPICS.WEAPONS,
    TU_TOPICS.REPLICANTS,
    TU_TOPICS.DELIVERY,
    TU_TOPICS.RESTAURANT,
    TU_TOPICS.FARMING,
    TU_TOPICS.SMUGGLING,
    TU_TOPICS.BOUNTY,
    TU_TOPICS.FACTIONS,
    TU_TOPICS.COSMETIC
]

// ── Layout constants ──────────────────────────────────────────────────────────
var TU_BTN_W     = 118  // left nav button width
var TU_BTN_H     = 18   // left nav button height
var TU_BTN_X     = 5    // left nav button x
var TU_BTN_GAP   = 22   // vertical step (button height + 4px gap)
var TU_BTN_START = 34   // y of first nav button
var TU_RIGHT_X   = 130  // x of right info panel
var TU_RIGHT_W   = 282  // width of right info panel
var TU_INFO_Y    = 48   // y of first info line in right panel
var TU_LINE_H    = 12   // y step between info lines

// ============================================================================
// CHAT — all !commands live here
// ============================================================================
function chat(event) {
    var player = event.player; var message = event.message
    if (!message) return

    if (message.indexOf(".menu") !== -1) {
        event.setCanceled(true)
        openMenuGui(event)
        return
    }
    if (message.indexOf(".teampc") !== -1) {
        event.setCanceled(true)
        openTeamPCGui(event)
        return
    }
}

// ============================================================================
// MENU GUI  —  News / Jobs / Tutorial
// ============================================================================
function openMenuGui(event) {
    var player = event.player; var api = event.API; var uuid = player.getUUID()
    openPlayers[uuid] = { player: player, API: api }

    var gui = api.createCustomGui(GUI_MENU, 420, 300, false, player)

    // ── Title ────────────────────────────────────────────────────────────────
    gui.addLabel(1, "\u00a76\u00a7l\u2605 SERVER MENU \u2605", 165, 10, 200, 16)
    gui.addLabel(2, "\u00a78\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", 10, 25, 420, 8)

    // ── News Section — edit the label below to update news ───────────────────
    gui.addLabel(3, "\u00a7e\u00a7l\u27a4 LATEST NEWS", 15, 35, 200, 12)
    gui.addLabel(4,
        "\u00a7a\u2022 \u00a7fAdded \u00a7aVanilla zone\u00a7f, its as big as city, you can go directly to the East for use teleport button at boatdock\n" +
        "\u00a7a\u2022 \u00a7fJoining Police and Criminal team is now \u00a7afree\u00a7f\u2014 earn \u00a7e$1.00\u00a7f per Minecraft day to your team contribution share.\n" +
        "\u00a7a\u2022 \u00a7fBomb sites keep inventory on when die except for bullets\n" +
        "\u00a7a\u2022 \u00a7fAdded gangs to alley ways\n" +
        "\u00a7a\u2022 \u00a7f",
        15, 50, 390, 90)

    // ── Divider ──────────────────────────────────────────────────────────────
    gui.addLabel(5, "\u00a78\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", 10, 148, 420, 8)

    // ── Jobs Section ─────────────────────────────────────────────────────────
    gui.addLabel(6, "\u00a7b\u00a7l\u27a4 Police and Criminal team", 15, 158, 100, 12)
    gui.addLabel(7, "\u00a77Choose a side and compete for the city\u0027s prize fund.", 15, 172, 390, 10)
    gui.addButton(MN.BTN_JOBS, "\u00a7l\ud83d\udc6eOpen Team Menu\ud83e\udd77", 135, 186, 150, 18)

    // ── Divider ──────────────────────────────────────────────────────────────
    gui.addLabel(8, "\u00a78\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", 10, 210, 420, 8)

    // ── Tutorial Section ──────────────────────────────────────────────────────
    gui.addLabel(9,  "\u00a7d\u00a7l\u27a4 TUTORIAL", 15, 220, 120, 12)
    gui.addLabel(20, "\u00a77New here? Learn how the game works.", 15, 234, 390, 10)
    gui.addButton(MN.BTN_TUTORIAL, "\u00a7l\u2139 Open Tutorial", 145, 248, 130, 18)

    // ── Close ─────────────────────────────────────────────────────────────────
    gui.addButton(MN.BTN_CLOSE, "\u00a77\u2715 Close", 355, 283, 55, 12)

    player.showCustomGui(gui)
}

// ============================================================================
// TUTORIAL GUI  —  Two-panel: left nav buttons + right info panel
// ============================================================================
function openTutorialGui(event) {
    var player = event.player; var api = event.API; var uuid = player.getUUID()
    openPlayers[uuid] = { player: player, API: api }

    // Default to BASIC on first open
    if (tuTopicState[uuid] === undefined) tuTopicState[uuid] = TU_TOPICS.BASIC
    var activeTopic = tuTopicState[uuid]

    var gui = api.createCustomGui(GUI_TUTORIAL, 420, 320, false, player)

    // ── Title bar ─────────────────────────────────────────────────────────────
    gui.addLabel(1, "\u00a7d\u00a7l\u2139 HOW TO PLAY", 155, 6, 200, 12)
    gui.addLabel(2, "\u00a78\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", 10, 20, 420, 8)

    // ── Vertical divider (fake pipe column) ───────────────────────────────────
    gui.addLabel(900, "\u00a78|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|\n|", 124, 22, 8, 290)

    // ── Left nav buttons ──────────────────────────────────────────────────────
    for (var i = 0; i < TU_TOPIC_ORDER.length; i++) {
        var tid = TU_TOPIC_ORDER[i]
        var topic = TUTORIAL_TOPICS[tid]
        var btnY = TU_BTN_START + i * TU_BTN_GAP
        var btnLabel = (tid === activeTopic)
            ? "\u00a7e\u00bb\u00a7r " + topic.label
            : "  " + topic.label
        gui.addButton(tid, btnLabel, TU_BTN_X, btnY, TU_BTN_W, TU_BTN_H)
    }

    // ── Right panel — heading ─────────────────────────────────────────────────
    var active = TUTORIAL_TOPICS[activeTopic]
    gui.addLabel(800, active.title, TU_RIGHT_X + 4, 28, TU_RIGHT_W, 12)
    gui.addLabel(801, "\u00a78\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", TU_RIGHT_X, 42, TU_RIGHT_W, 6)

    // ── Right panel — info lines ──────────────────────────────────────────────
    var lines = active.lines
    for (var j = 0; j < lines.length; j++) {
        gui.addLabel(810 + j, lines[j], TU_RIGHT_X + 4, TU_INFO_Y + j * TU_LINE_H, TU_RIGHT_W - 4, TU_LINE_H)
    }

    // ── Footer ────────────────────────────────────────────────────────────────
    gui.addLabel(850, "\u00a78\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", 10, 304, 420, 6)
    gui.addButton(TU.BTN_BACK,  "\u00a77\u2190 Back",  310, 307, 50, 12)
    gui.addButton(TU.BTN_CLOSE, "\u00a77\u2715 Close", 365, 307, 50, 12)

    player.showCustomGui(gui)
}
function openTeamPCTutorialGui(event) {
    var player = event.player; var api = event.API; var uuid = player.getUUID()
    openPlayers[uuid] = { player: player, API: api }

    var gui = api.createCustomGui(GUI_TEAMPC_TUTORIAL, 420, 320, false, player)

    gui.addLabel(1, "§e§l👮 Police & Criminal — How It Works", 60, 8, 320, 12)
    gui.addLabel(2, "§8———————————————————————————————————————————————", 10, 20, 420, 8)

    var lines = [
        "§e§l1. §fRight-click the §elobby block §fat the police station or criminal den",
        "§7  (opposite furniture store §a2498 42 903§f), or type §e.teampc §7in chat.",
        "",
        "§e§l2. §fChoose a team. You earn §e100c/day §fto your contribution share.",
        "§7  Contribute more anytime to boost your payout share when you win.",
        "",
        "§e§l3a. §cCriminals: §fGrab the bomb from the criminal den, find a bomb",
        "§7  site block (coords listed there), hold the bomb & click §ePlant§7.",
        "§e§l3b. §bPolice: §fLocate the bomb site and defuse it §ebefore 6 mins§f are up.",
        "",
        "§e§l4. §fWinners split the losing team's §ewhole fund pool",
        "§7  proportional to each player's contribution:",
        "§7  Payout = §ayour contribution back §7+ §ayour % share of losing fund§7.",
        "§7  More contributed = larger slice of the prize.",
        "",
        "§7Went offline when the round ended? Your winnings are held in your",
        "§7balance. Open the lobby block and click §eReceive §7to claim anytime."
    ]

    for (var i = 0; i < lines.length; i++) {
        gui.addLabel(10 + i, lines[i], 14, 32 + i * 16, 400, 11)
    }

    gui.addLabel(99, "§8———————————————————————————————————————————————", 10, 300, 420, 8)
    gui.addButton(71, "§7← Back", 310, 304, 50, 12)
    gui.addButton(72, "§7✕ Close", 365, 304, 50, 12)

    player.showCustomGui(gui)
}
// ============================================================================
// customGuiButton — handles ALL GUIs across all scripts
// ============================================================================
function customGuiButton(event) {
    var guiId = event.gui.getID()
    var player = event.player; var uuid = player.getUUID(); var bid = event.buttonId
    openPlayers[uuid] = { player: player, API: event.API }

    // ── Menu GUI ──────────────────────────────────────────────────────────────
    if (guiId === GUI_MENU) {
        if (bid === MN.BTN_JOBS)     { openTeamPCGui(event); return }
        if (bid === MN.BTN_TUTORIAL) { openTutorialGui(event); return }
        if (bid === MN.BTN_CLOSE)    { player.closeGui(); return }
        return
    }

    // ── Tutorial GUI ──────────────────────────────────────────────────────────
    if (guiId === GUI_TUTORIAL) {
        // Topic nav buttons (IDs 20-29) — save state and re-render
        if (bid >= 20 && bid <= 29) {
            tuTopicState[uuid] = bid
            openTutorialGui(event)
            return
        }
        if (bid === TU.BTN_BACK)  { openMenuGui(event); return }
        if (bid === TU.BTN_CLOSE) { player.closeGui(); return }
        return
    }
    // ── TeamPC Tutorial GUI ───────────────────────────────────────────────────
    if (guiId === GUI_TEAMPC_TUTORIAL) {
        if (bid === 71) { openTeamPCGui(event); return }
        if (bid === 72) { player.closeGui(); return }
        return
    }
    // ── TeamPC GUI ────────────────────────────────────────────────────────────
    if (guiId === GUI_TEAMPC) {
        var g = getGame(); if (!g) return
        var players = getPlayers(g)
        var pIdx = -1
        for (var i = 0; i < players.length; i++) if (players[i].uuid === uuid) { pIdx = i; break }

        // Receive balance (62)
        if (bid === 62) {
            var bal = getPlayerBalance(g, uuid)
            if (bal <= 0) { player.message("\u00a7cNo balance to receive!"); return }
            clearBalance(g, uuid)
            giveCoins(player, bal)
            player.message("\u00a7aReceived " + fmt(bal) + " into your wallet!")
            openTeamPCGui(event); return
        }
        // Tutorial button (70)
        if (bid === 70) { openTeamPCTutorialGui(event); return }

        // Join Police (10)
        if (bid === 10) {
            if (g.phase === PHASE_BOMB_PLANTED || g.phase === PHASE_ROUND_END) { player.message("\u00a7cRound in progress!"); return }
            if (pIdx >= 0) { player.message("\u00a7cAlready in a team!"); return }
            players.push({ uuid: uuid, name: player.getName(), team: TEAM_POLICE, contributed: 0, lastDayTick: SYS.currentTimeMillis() })
            setPlayers(g, players); saveGame(g)
            player.message("\u00a7b[Team] Joined Police! You will be rewarded \u00a7e" + fmt(DAILY_CONTRIBUTION) + " \u00a7bas team contribution per Minecraft day.")
            try { player.setSpawnpoint(POLICE_RESPAWN.x, POLICE_RESPAWN.y, POLICE_RESPAWN.z) } catch(e) {}
            openTeamPCGui(event); return
        }

        // Join Criminal (11)
        if (bid === 11) {
            if (g.phase === PHASE_BOMB_PLANTED || g.phase === PHASE_ROUND_END) { player.message("\u00a7cRound in progress!"); return }
            if (pIdx >= 0) { player.message("\u00a7cAlready in a team!"); return }
            var firstCriminal = (countTeam(TEAM_CRIMINAL) === 0)
            if (g.phase === PHASE_IDLE) g.phase = PHASE_ACTIVE
            players.push({ uuid: uuid, name: player.getName(), team: TEAM_CRIMINAL, contributed: 0, lastDayTick: SYS.currentTimeMillis() })
            if (firstCriminal) {
                g.bombAvailableAtLobby = true
                g.bombRefreshTime = 0
                teamBroadcast("\u00a7c[Bomb] First criminal joined! \u00a7eGo to the lobby block to pick up the bomb!")
            }
            setPlayers(g, players); saveGame(g)
            player.message("\u00a7c[Team] Joined Criminal! You will be rewarded \u00a7e" + fmt(DAILY_CONTRIBUTION) + " \u00a7cas team contribution per Minecraft day. \u00a7eGo to the lobby block to pick up the bomb!")
            try { player.setSpawnpoint(CRIMINAL_RESPAWN.x, CRIMINAL_RESPAWN.y, CRIMINAL_RESPAWN.z) } catch(e) {}
            openTeamPCGui(event); return
        }

        // Leave (12)
        if (bid === 12) {
            if (g.phase === PHASE_BOMB_PLANTED) { player.message("\u00a7cCannot leave while the bomb is ticking!"); return }
            if (pIdx >= 0) {
                players.splice(pIdx, 1)
                setPlayers(g, players); saveGame(g)
                player.message("\u00a77Left your team.")
            }
            openTeamPCGui(event); return
        }

        // Add funds (13)
        if (bid === 13) {
            if (pIdx < 0) { player.message("\u00a7cJoin a team first!"); return }
            if (g.phase === PHASE_BOMB_PLANTED) { player.message("\u00a7cCannot add funds while the bomb is ticking!"); return }
            var p = players[pIdx]
            try {
                var tf = event.gui.getComponent(20)
                if (!tf) { player.message("\u00a7cCould not read field!"); return }
                var raw = tf.getText()
                if (!raw || raw === "") { player.message("\u00a7cEnter an amount!"); return }
                var cleaned = raw.replace("$", "").trim()
                var parsed = parseFloat(cleaned)
                if (isNaN(parsed) || parsed <= 0) { player.message("\u00a7cInvalid amount!"); return }
                var cents = Math.round(parsed * 100)
                if (cents < MIN_FUND_AMOUNT) { player.message("\u00a7cMin contribution is " + fmt(MIN_FUND_AMOUNT)); return }
                if (!removeCoins(player, cents)) { player.message("\u00a7cNot enough coins!"); return }
                p.contributed += cents
                if (p.team === TEAM_POLICE) g.policeFund += cents
                else if (p.team === TEAM_CRIMINAL) g.criminalFund += cents
                setPlayers(g, players); saveGame(g)
                player.message("\u00a7aAdded " + fmt(cents) + " to your team fund!")
                openTeamPCGui(event)
            } catch(e) { player.message("\u00a7cError: " + e) }
            return
        }
        return
    }
}

function customGuiClosed(event) {}
