// ============================================================================
// KILL EFFECT PREVIEW NPC
// ============================================================================
// Script Type: NpcEvent (place on NPC > Advanced > Scripts)
// Target: CustomNPCs 1.20.1
// Style: ES5 | No Semicolons
//
// HOW IT WORKS:
//   - Click the NPC to open a GUI listing all kill effects
//   - Select one and click Preview to see it play on the NPC
//   - Select one and click "Set NPC Effect" to assign it permanently to this NPC
//   - When any player kills this NPC (or a player near it), the assigned effect plays
//   - Nothing is granted or saved to any player — purely cosmetic preview
//
// ADMIN:
//   NPC effect is stored in NPC storeddata under key "preview_effect_id"
//   Admins (creative mode) see the "Set NPC Effect" button
// ============================================================================

var API = Java.type("noppes.npcs.api.NpcAPI").Instance()
var Thread = Java.type("java.lang.Thread")

var NPC_DATA_KEY             = "preview_effect_id"
var PREVIEW_GUI_ID           = 9100
var PREVIEW_GUI_W            = 340
var PREVIEW_GUI_H            = 246

var PREVIEW_ACTIVE_THREADS   = 0
var PREVIEW_MAX_THREADS      = 8

var BTN_SET_NPC_EFFECT       = 50
var BTN_PREVIEW              = 51
var BTN_CLOSE                = 52
var SCROLL_EFFECTS           = 60

// Per-player UI state (scroll index)
var UI_STATE = {}

var _npcRef = null

// ============================================================================
// KILL EFFECTS LIST  (copied verbatim — do not modify ids)
// ============================================================================
var KILL_EFFECTS = [
    { id: "ember_ring",          name: "Ember Ring",          rarity: "common",    color: "\u00A7f", description: "A quick flame ring around the kill",              sound: "minecraft:block.fire.extinguish",          particle: "minecraft:flame",            pattern: "ring",      radius: 1.55, points: 30, yOffset: 0.18, speed: 0.01, count: 1, volume: 0.7,  pitch: 1.25 },
    { id: "crit_spark",          name: "Crit Spark",          rarity: "common",    color: "\u00A7f", description: "A clean critical spark pop",                      sound: "minecraft:entity.player.attack.crit",      particle: "minecraft:crit",             pattern: "burst",     radius: 0.95, points: 18, yOffset: 0.7,  speed: 0.08, count: 1, volume: 0.65, pitch: 1.35 },
    { id: "smoke_puff",          name: "Smoke Puff",          rarity: "common",    color: "\u00A7f", description: "A soft smoke puff",                               sound: "minecraft:block.campfire.crackle",          particle: "minecraft:smoke",            pattern: "pillar",    radius: 0.55, points: 18, yOffset: 0.2,  height: 1.5,  speed: 0.02, count: 2, volume: 0.55, pitch: 1.2  },
    { id: "heart_pop",           name: "Heart Pop",           rarity: "common",    color: "\u00A7f", description: "A lighthearted heart pop",                        sound: "minecraft:entity.experience_orb.pickup",   particle: "minecraft:heart",            pattern: "bloom",     radius: 0.9,  points: 14, yOffset: 0.85, speed: 0.01, count: 1, volume: 0.55, pitch: 1.75 },
    { id: "villager_cheer",      name: "Villager Cheer",      rarity: "common",    color: "\u00A7f", description: "Small happy sparks",                              sound: "minecraft:entity.villager.yes",            particle: "minecraft:happy_villager",   pattern: "bloom",     radius: 1.05, points: 18, yOffset: 0.45, speed: 0.02, count: 1, volume: 0.6,  pitch: 1.45 },
    { id: "cloud_step",          name: "Cloud Step",          rarity: "common",    color: "\u00A7f", description: "A low cloud ring",                                sound: "minecraft:block.wool.step",                particle: "minecraft:cloud",            pattern: "ring",      radius: 1.35, points: 24, yOffset: 0.1,  speed: 0.02, count: 2, volume: 0.5,  pitch: 1.1  },
    { id: "soul_spiral",         name: "Soul Spiral",         rarity: "rare",      color: "\u00A7b", description: "A rising soul spiral",                            sound: "minecraft:entity.warden.sonic_boom",       particle: "minecraft:soul_fire_flame",  pattern: "spiral",    radius: 1.15, points: 34, yOffset: 0.1,  height: 2.25, speed: 0.01, count: 1, volume: 0.55, pitch: 1.6  },
    { id: "aqua_bloom",          name: "Aqua Bloom",          rarity: "rare",      color: "\u00A7b", description: "A blue dust flower",                              sound: "minecraft:block.amethyst_block.hit",       particle: "dust", dustRed: 0.1, dustGreen: 0.75, dustBlue: 1, dustScale: 1.25, pattern: "bloom", radius: 1.45, points: 26, yOffset: 0.55, speed: 0, count: 1, volume: 0.7, pitch: 1.4 },
    { id: "frost_shatter",       name: "Frost Shatter",       rarity: "rare",      color: "\u00A7b", description: "A cold shatter burst",                            sound: "minecraft:block.glass.break",              particle: "minecraft:snowflake",        pattern: "nova",      radius: 1.65, points: 32, yOffset: 0.55, speed: 0.03, count: 1, volume: 0.65, pitch: 1.35 },
    { id: "emerald_runeburst",   name: "Emerald Runeburst",   rarity: "rare",      color: "\u00A7b", description: "Green runes flash under the target",              sound: "minecraft:block.enchantment_table.use",    particle: "dust", dustRed: 0.1, dustGreen: 1, dustBlue: 0.35, dustScale: 1.1, pattern: "rune", radius: 1.4, points: 36, yOffset: 0.12, speed: 0, count: 1, volume: 0.65, pitch: 1.2 },
    { id: "spark_column",        name: "Spark Column",        rarity: "rare",      color: "\u00A7b", description: "A bright vertical spark column",                  sound: "minecraft:block.beacon.power_select",      particle: "minecraft:electric_spark",   pattern: "pillar",    radius: 0.75, points: 28, yOffset: 0.15, height: 2.8,  speed: 0.04, count: 1, volume: 0.7,  pitch: 1.35 },
    { id: "nautilus_wave",       name: "Nautilus Wave",       rarity: "rare",      color: "\u00A7b", description: "A small nautilus wave",                           sound: "minecraft:item.trident.return",            particle: "minecraft:nautilus",         pattern: "helix",     radius: 1.15, points: 30, yOffset: 0.15, height: 1.9,  speed: 0.01, count: 1, volume: 0.65, pitch: 1.25 },
    { id: "gold_burst",          name: "Gold Burst",          rarity: "epic",      color: "\u00A7d", description: "A cosmetic gold dust burst",                      sound: "minecraft:block.amethyst_block.chime",     particle: "dust", dustRed: 1, dustGreen: 0.72, dustBlue: 0.18, dustScale: 1.3, pattern: "burst", radius: 1.35, points: 28, yOffset: 0.75, speed: 0, count: 1, volume: 0.85, pitch: 1.1 },
    { id: "arcane_vortex",       name: "Arcane Vortex",       rarity: "epic",      color: "\u00A7d", description: "Purple magic twists inward",                      sound: "minecraft:block.portal.ambient",           particle: "minecraft:portal",           pattern: "vortex",    radius: 2,    points: 42, yOffset: 0.25, height: 2.2,  speed: 0.04, count: 1, volume: 0.75, pitch: 1.4  },
    { id: "dragon_whisper",      name: "Dragon Whisper",      rarity: "epic",      color: "\u00A7d", description: "Dragon breath coils upward",                      sound: "minecraft:entity.ender_dragon.flap",       particle: "minecraft:dragon_breath",    pattern: "helix",     radius: 1.55, points: 42, yOffset: 0.15, height: 2.6,  speed: 0.02, count: 1, volume: 0.75, pitch: 1.3  },
    { id: "witch_hex",           name: "Witch Hex",           rarity: "epic",      color: "\u00A7d", description: "A crooked witch sigil",                           sound: "minecraft:entity.witch.celebrate",         particle: "minecraft:witch",            pattern: "rune",      radius: 1.75, points: 42, yOffset: 0.22, speed: 0.04, count: 1, volume: 0.7,  pitch: 1.15 },
    { id: "end_rod_crown",       name: "End Rod Crown",       rarity: "epic",      color: "\u00A7d", description: "A crown of pale end sparks",                      sound: "minecraft:block.end_portal_frame.fill",    particle: "minecraft:end_rod",          pattern: "crown",     radius: 1.45, points: 34, yOffset: 1.55, height: 0.9,  speed: 0.02, count: 1, volume: 0.85, pitch: 1.25 },
    { id: "totem_echo",          name: "Totem Echo",          rarity: "epic",      color: "\u00A7d", description: "A golden-green totem echo",                       sound: "minecraft:item.totem.use",                 particle: "minecraft:totem_of_undying", pattern: "bloom",     radius: 1.75, points: 36, yOffset: 0.45, speed: 0.08, count: 2, volume: 0.7,  pitch: 1.65 },
    { id: "meteor_fall",         name: "Meteor Fall",         rarity: "legendary", color: "\u00A76", description: "A meteor drops onto the killed entity",           sound: "minecraft:entity.generic.explode",         particle: "minecraft:flame",            pattern: "meteor",    radius: 2.25, points: 28, yOffset: 0.15, height: 7,    speed: 0.02, count: 2, volume: 1,    pitch: 0.8  },
    { id: "void_rift",           name: "Void Rift",           rarity: "legendary", color: "\u00A76", description: "A lingering void tear opens and collapses",       sound: "minecraft:entity.enderman.teleport",       particle: "minecraft:reverse_portal",   pattern: "rift",      radius: 2.2,  points: 58, yOffset: 0.4,  height: 3,    speed: 0.08, count: 2, volume: 1,    pitch: 0.75 },
    { id: "celestial_judgement", name: "Celestial Judgement", rarity: "legendary", color: "\u00A76", description: "A beam descends into a radiant sigil",            sound: "minecraft:item.trident.thunder",           particle: "minecraft:end_rod",          pattern: "judgement", radius: 2.4,  points: 64, yOffset: 0.1,  height: 6,    speed: 0.02, count: 2, volume: 1,    pitch: 0.9  },
    { id: "phoenix_ascension",   name: "Phoenix Ascension",   rarity: "legendary", color: "\u00A76", description: "Fire wings rise from the kill",                   sound: "minecraft:entity.blaze.shoot",             particle: "minecraft:flame",            pattern: "phoenix",   radius: 2.2,  points: 62, yOffset: 0.25, height: 2.8,  speed: 0.03, count: 2, volume: 1,    pitch: 0.8  },
    { id: "galaxy_collapse",     name: "Galaxy Collapse",     rarity: "legendary", color: "\u00A76", description: "A tiny galaxy spins then collapses",              sound: "minecraft:block.respawn_anchor.deplete",   particle: "minecraft:enchant",          pattern: "galaxy",    radius: 2.45, points: 72, yOffset: 0.8,  height: 1.8,  speed: 0.04, count: 2, volume: 1,    pitch: 0.85 },
    { id: "soul_reaper",         name: "Soul Reaper",         rarity: "legendary", color: "\u00A76", description: "Souls orbit, rise, and vanish",                   sound: "minecraft:entity.warden.heartbeat",        particle: "minecraft:soul",             pattern: "reaper",    radius: 2.05, points: 64, yOffset: 0.35, height: 3.4,  speed: 0.015,count: 2, volume: 1,    pitch: 0.7  },
    { id: "soul_harvest",        name: "Soul Harvest",        rarity: "legendary", color: "\u00A76", description: "A harvested soul flies from the kill into the player", sound: "minecraft:block.soul_sand.break",      particle: "minecraft:soul",             pattern: "soul_harvest", radius: 1.35, points: 26, yOffset: 1, height: 2.6, speed: 0.01, count: 2, volume: 1, pitch: 0.85 }
]

// ============================================================================
// HELPERS
// ============================================================================
function trim(v) { return String(v || "").replace(/^\s+|\s+$/g, "") }

function isAdmin(player) {
    try { return player.getGamemode() === 1 } catch(e) { return false }
}

function getUi(playerName) {
    if (!UI_STATE[playerName]) UI_STATE[playerName] = { effectIndex: 0, effectIds: [] }
    return UI_STATE[playerName]
}

function effectById(id) {
    for (var i = 0; i < KILL_EFFECTS.length; i++) {
        if (KILL_EFFECTS[i].id === id) return KILL_EFFECTS[i]
    }
    return null
}

function effectColor(effect) {
    if (!effect) return "\u00A7f"
    if (effect.color) return effect.color
    if (effect.rarity === "rare")      return "\u00A7b"
    if (effect.rarity === "epic")      return "\u00A7d"
    if (effect.rarity === "legendary") return "\u00A76"
    return "\u00A7f"
}

function rarityLabel(effect) {
    if (!effect) return "\u00A7fCommon"
    if (effect.rarity === "rare")      return "\u00A7bRare"
    if (effect.rarity === "epic")      return "\u00A7dEpic"
    if (effect.rarity === "legendary") return "\u00A76Legendary"
    return "\u00A7fCommon"
}

function coloredName(effect) {
    if (!effect) return "\u00A7fUnknown"
    return effectColor(effect) + effect.name
}

// ============================================================================
// NPC STORED EFFECT
// ============================================================================
function getNpcEffect(npc) {
    try {
        var data = npc.getStoreddata()
        if (!data.has(NPC_DATA_KEY)) return null
        var id = trim(data.get(NPC_DATA_KEY))
        return id || null
    } catch(e) { return null }
}

function setNpcEffect(npc, effectId) {
    try { npc.getStoreddata().put(NPC_DATA_KEY, effectId) } catch(e) {}
}

// ============================================================================
// GUI
// ============================================================================
function openGui(player, note) {
    var npc    = _npcRef
    var ui     = getUi(player.getName())
    var labels = []
    var gui    = API.createCustomGui(PREVIEW_GUI_ID, PREVIEW_GUI_W, PREVIEW_GUI_H, false, player)
    var i, effect, suffix

    ui.effectIds = []

    var npcEffectId = npc ? getNpcEffect(npc) : null

    for (i = 0; i < KILL_EFFECTS.length; i++) {
        effect = KILL_EFFECTS[i]
        ui.effectIds.push(effect.id)
        suffix = (effect.id === npcEffectId) ? " \u00A7e\u00AB NPC effect" : ""
        labels.push(coloredName(effect) + " \u00A78(" + rarityLabel(effect) + "\u00A78)" + suffix)
    }

    if (ui.effectIndex < 0) ui.effectIndex = 0
    if (ui.effectIndex >= ui.effectIds.length) ui.effectIndex = ui.effectIds.length - 1

    var selected = ui.effectIds.length > 0 ? effectById(ui.effectIds[ui.effectIndex]) : null

    // Frame
  

    // Header
    gui.addLabel(100, "\u00A7d\u00A7lKill Effect Browser", 24, 12, 200, 14, 0xFF55FF)
    gui.addLabel(101, "\u00A78Preview effects \u00A77— nothing is granted to you", 24, 28, 240, 12, 0xAAAAAA)

    // NPC current effect display
    var npcEffectDisplay = npcEffectId ? (coloredName(effectById(npcEffectId)) + " \u00A78(active on NPC)") : "\u00A78None set"
    gui.addLabel(102, "\u00A77NPC Effect: " + npcEffectDisplay, 178, 12, 148, 12, 0xAAAAAA)

    // Left — scroll list
    gui.addLabel(110, "\u00A76All Effects", 24, 36, 100, 12, 0xFFAA00)
    gui.addScroll(SCROLL_EFFECTS, 24, 54, 140, 154, labels).setDefaultSelection(ui.effectIndex)

    // Right — selected info panel
    gui.addLabel(111, "\u00A76Selected", 178, 36, 100, 12, 0xFFAA00)
    gui.addLabel(112, selected ? coloredName(selected)          : "\u00A78None",       178, 56, 140, 12, 0xFFFFFF)
    gui.addLabel(113, selected ? rarityLabel(selected)          : "\u00A78—",          178, 72, 140, 12, 0xAAAAAA)
    gui.addLabel(114, selected ? ("\u00A77" + (selected.description || "")) : "\u00A78Select an effect on the left.", 178, 88, 140, 28, 0xAAAAAA)
    gui.addLabel(115, selected ? ("\u00A78Pattern: \u00A7f" + selected.pattern) : "", 178, 122, 140, 12, 0xAAAAAA)
    gui.addLabel(116, selected ? ("\u00A78Sound: \u00A7f" + (selected.sound || "").replace("minecraft:", "")) : "", 178, 136, 140, 12, 0xAAAAAA)

    // Buttons
    gui.addButton(BTN_PREVIEW,        "\u00A7ePreview",        178, 168, 100, 20)
    if (isAdmin(player)) {
        gui.addButton(BTN_SET_NPC_EFFECT, "\u00A7aSet NPC Effect", 178, 194, 100, 20)
    }
    gui.addButton(BTN_CLOSE, "X", PREVIEW_GUI_W - 28, 8, 20, 20)

    // Footer note
    gui.addLabel(120, note ? ("\u00A7e" + note) : "Kill NPC to view effect", 24, 228, 280, 10, 0xAAAAAA)

    player.showCustomGui(gui)
}

// ============================================================================
// PLAYBACK — all particle/sound code copied verbatim from the player script
// ============================================================================
function previewDelay(ms) { Thread.sleep(ms) }

function previewRunAsync(fn) {
    if (PREVIEW_ACTIVE_THREADS >= PREVIEW_MAX_THREADS) return false
    PREVIEW_ACTIVE_THREADS++
    new (Java.extend(Thread, {
        run: function() {
            try { fn() }
            catch(e) {}
            finally {
                PREVIEW_ACTIVE_THREADS--
                if (PREVIEW_ACTIVE_THREADS < 0) PREVIEW_ACTIVE_THREADS = 0
            }
        }
    }))().start()
    return true
}

function particleName(effect) {
    if (effect.particle === "dust") {
        return "dust " + effect.dustRed + " " + effect.dustGreen + " " + effect.dustBlue + " " + effect.dustScale
    }
    return effect.particle
}

function directParticleName(effect) {
    if (effect.particle.indexOf("minecraft:") === 0) return effect.particle.substring("minecraft:".length)
    return effect.particle
}

function numStr(v) {
    var n = parseFloat(v)
    if (isNaN(n)) n = 0
    return n.toFixed(3)
}

function spawnParticle(world, effect, x, y, z) {
    if (effect.particle !== "dust") {
        try {
            world.spawnParticle(directParticleName(effect), x, y, z, 0, 0, 0, effect.speed || 0, effect.count || 1)
            return "direct"
        } catch(e) {}
    }
    try {
        var cmd = "/particle " + particleName(effect) + " " + numStr(x) + " " + numStr(y) + " " + numStr(z) + " 0 0 0 " + (effect.speed || 0) + " " + (effect.count || 1) + " force"
        return API.executeCommand(world, cmd)
    } catch(e) { return "cmd failed" }
}

function playSound(world, effect, x, y, z) {
    try {
        world.playSoundAt(API.getIPos(x, y, z), effect.sound, effect.volume || 0.8, effect.pitch || 1)
    } catch(e) {
        try {
            var cmd = "/execute positioned " + numStr(x) + " " + numStr(y) + " " + numStr(z) + " run playsound " + effect.sound + " master @a[distance=..32] " + numStr(x) + " " + numStr(y) + " " + numStr(z) + " " + (effect.volume || 0.8) + " " + (effect.pitch || 1)
            API.executeCommand(world, cmd)
        } catch(e2) {}
    }
}

function particleStub(particle, speed, count) {
    return { particle: particle, speed: speed || 0, count: count || 1 }
}

function safeX(e) { try { return e.getX() } catch(err) { return 0 } }
function safeY(e) { try { return e.getY() } catch(err) { return 0 } }
function safeZ(e) { try { return e.getZ() } catch(err) { return 0 } }
function safeRot(e) { try { return e.getRotation() } catch(err) { return 0 } }
function safePitch(e) { try { return e.getPitch() } catch(err) { return 0 } }

function frontVectors(entity, dr, dp, distance, mode) {
    var angle, pitch
    if (!mode) mode = 0
    if (mode === 1) {
        angle = dr + safeRot(entity)
        pitch = (-safePitch(entity) + dp) * Math.PI / 180
    } else {
        angle = dr
        pitch = dp * Math.PI / 180
    }
    return [
        -Math.sin(angle * Math.PI / 180) * (distance * Math.cos(pitch)),
        Math.sin(pitch) * distance,
        Math.cos(angle * Math.PI / 180) * (distance * Math.cos(pitch))
    ]
}

function cross(a, b) {
    return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]
}

function makeAxis(entity, rotation, pitch) {
    var a = frontVectors(entity, rotation, pitch, 1, 0)
    var b = frontVectors(entity, rotation, pitch - 90, 1, 0)
    return [b, a, cross(b, a)]
}

function transformVector(axis, vector) {
    return [
        axis[0][0]*-vector[0] + axis[1][0]*vector[1] + axis[2][0]*vector[2],
        axis[0][1]*-vector[0] + axis[1][1]*vector[1] + axis[2][1]*vector[2],
        axis[0][2]*-vector[0] + axis[1][2]*vector[1] + axis[2][2]*vector[2]
    ]
}

function frontInPlane(newYRot, newYPitch, entity, dr, dp, distance) {
    return transformVector(makeAxis(entity, newYRot, newYPitch), frontVectors(entity, dr, dp, distance, 0))
}

function playPattern(world, entity, effect) {
    var baseX = safeX(entity)
    var baseY = safeY(entity) + (effect.yOffset || 0)
    var baseZ = safeZ(entity)
    var points = effect.points || 24
    var radius = effect.radius || 1
    var height = effect.height || 1.8
    var i, t, angle, vector, y, side, wing, layer
    var first = ""

    function sp(eff, x, yy, z) { if (!first) first = spawnParticle(world, eff, x, yy, z); else spawnParticle(world, eff, x, yy, z) }

    if (effect.pattern === "ring") {
        for (i = 0; i < points; i++) { angle = i * (360/points); vector = frontInPlane(0, 90, entity, angle, 0, radius); sp(effect, baseX+vector[0], baseY+vector[1], baseZ+vector[2]) }
        return first
    }
    if (effect.pattern === "spiral") {
        for (i = 0; i < points; i++) { angle = i*42; y = baseY+height*(i/points); vector = frontInPlane(0,90,entity,angle,0,radius*(1-(i/points)*0.35)); sp(effect,baseX+vector[0],y+vector[1],baseZ+vector[2]) }
        return first
    }
    if (effect.pattern === "pillar") {
        for (i = 0; i < points; i++) { t = points<=1?1:i/(points-1); angle=i*137; vector=frontInPlane(0,90,entity,angle,0,radius*(0.35+(i%4)*0.18)); y=baseY+height*t; sp(effect,baseX+vector[0],y,baseZ+vector[2]) }
        return first
    }
    if (effect.pattern === "bloom") {
        for (i = 0; i < points; i++) { angle=i*(360/points); vector=frontInPlane(0,90,entity,angle,0,radius*(0.4+(i%3)*0.28)); y=baseY+Math.sin(i*0.7)*0.25; sp(effect,baseX+vector[0],y,baseZ+vector[2]) }
        return first
    }
    if (effect.pattern === "nova") {
        for (i = 0; i < points; i++) { angle=i*(360/points); vector=frontInPlane(safeRot(entity),-35+(i%7)*12,entity,angle,0,radius); sp(effect,baseX+vector[0],baseY+0.45+vector[1],baseZ+vector[2]) }
        return first
    }
    if (effect.pattern === "rune") {
        for (i = 0; i < points; i++) { angle=i*(360/points); radius=i%2===0?(effect.radius||1.4):(effect.radius||1.4)*0.55; vector=frontInPlane(0,90,entity,angle,0,radius); sp(effect,baseX+vector[0],baseY,baseZ+vector[2]) }
        return first
    }
    if (effect.pattern === "helix") {
        for (i = 0; i < points; i++) { t=points<=1?1:i/(points-1); angle=i*38; y=baseY+height*t; vector=frontInPlane(0,90,entity,angle,0,radius); sp(effect,baseX+vector[0],y,baseZ+vector[2]); vector=frontInPlane(0,90,entity,angle+180,0,radius*0.82); spawnParticle(world,effect,baseX+vector[0],y+0.06,baseZ+vector[2]) }
        return first
    }
    if (effect.pattern === "vortex") {
        for (i = 0; i < points; i++) { t=points<=1?1:i/(points-1); angle=i*32; vector=frontInPlane(0,90,entity,angle,0,radius*(1-t*0.75)); y=baseY+height*t; sp(effect,baseX+vector[0],y,baseZ+vector[2]) }
        return first
    }
    if (effect.pattern === "crown") {
        for (i = 0; i < points; i++) { angle=i*(360/points); vector=frontInPlane(0,90,entity,angle,0,radius); y=baseY+(i%4===0?height:0); sp(effect,baseX+vector[0],y,baseZ+vector[2]) }
        return first
    }
    if (effect.pattern === "burst") {
        for (i = 0; i < points; i++) { angle=i*(360/points); vector=frontInPlane(safeRot(entity),30+(i%5)*14,entity,angle,0,radius); sp(effect,baseX+vector[0],baseY+vector[1],baseZ+vector[2]) }
        return first
    }
    if (effect.pattern === "meteor") {
        var flameE=particleStub("minecraft:flame",0.02,3); var smokeE=particleStub("minecraft:smoke",0.02,2); var lavaE=particleStub("minecraft:lava",0.12,2)
        for (i=0;i<points;i++){t=points<=1?1:i/(points-1);vector=frontInPlane(safeRot(entity)+30,62,entity,0,0,radius*(1-t));y=baseY+height*(1-t);sp(flameE,baseX+vector[0],y,baseZ+vector[2]);if(i%2===0)spawnParticle(world,smokeE,baseX+vector[0]*0.85,y+0.08,baseZ+vector[2]*0.85)}
        for (i=0;i<points;i++){angle=i*(360/points);vector=frontInPlane(0,90,entity,angle,0,radius*0.45);spawnParticle(world,lavaE,baseX+vector[0],baseY+0.15,baseZ+vector[2]);if(i%3===0)spawnParticle(world,smokeE,baseX+vector[0]*0.7,baseY+0.35,baseZ+vector[2]*0.7)}
        return first
    }
    if (effect.pattern === "rift") {
        var portalE=particleStub("minecraft:reverse_portal",0.08,2); var soulE=particleStub("minecraft:dragon_breath",0.02,1)
        for (i=0;i<points;i++){t=points<=1?1:i/(points-1);angle=i*31;vector=frontInPlane(safeRot(entity),8+Math.sin(i)*20,entity,angle,0,radius*(0.3+Math.sin(t*Math.PI)*0.7));y=baseY+height*t;sp(portalE,baseX+vector[0]*0.45,y,baseZ+vector[2]*0.45);if(i%3===0)spawnParticle(world,soulE,baseX+vector[0],y,baseZ+vector[2])}
        return first
    }
    if (effect.pattern === "judgement") {
        var endE=particleStub("minecraft:end_rod",0.01,2); var sparkE=particleStub("minecraft:electric_spark",0.06,1)
        for (i=0;i<points;i++){t=points<=1?1:i/(points-1);y=baseY+height*t;sp(endE,baseX,y,baseZ);if(i%4===0){angle=i*47;vector=frontInPlane(0,90,entity,angle,0,radius*(1-t*0.45));spawnParticle(world,sparkE,baseX+vector[0],baseY+0.2,baseZ+vector[2])}}
        for (i=0;i<points;i++){angle=i*(360/points);vector=frontInPlane(0,90,entity,angle,0,radius);spawnParticle(world,endE,baseX+vector[0],baseY+0.1,baseZ+vector[2])}
        return first
    }
    if (effect.pattern === "phoenix") {
        var flameE=particleStub("minecraft:flame",0.035,2); var lavaE=particleStub("minecraft:lava",0.08,1)
        for (i=0;i<points;i++){t=points<=1?1:i/(points-1);side=i%2===0?1:-1;wing=Math.sin(t*Math.PI);vector=frontInPlane(safeRot(entity),20+side*32,entity,side*65,0,radius*wing);y=baseY+height*t;sp(flameE,baseX+vector[0],y,baseZ+vector[2]);if(i%5===0)spawnParticle(world,lavaE,baseX+vector[0]*0.45,y-0.2,baseZ+vector[2]*0.45)}
        return first
    }
    if (effect.pattern === "galaxy") {
        var portalE=particleStub("minecraft:portal",0.06,1); var endE=particleStub("minecraft:end_rod",0.02,1)
        for (i=0;i<points;i++){t=points<=1?1:i/(points-1);layer=i%3;angle=i*29+layer*120;vector=frontInPlane(0,90,entity,angle,0,radius*(1-t*0.55));y=baseY+Math.sin(t*Math.PI*2)*height*0.35+layer*0.18;sp(portalE,baseX+vector[0],y,baseZ+vector[2]);if(i%6===0)spawnParticle(world,endE,baseX+vector[0]*0.45,y,baseZ+vector[2]*0.45)}
        return first
    }
    if (effect.pattern === "reaper") {
        var soulE=particleStub("minecraft:soul",0.015,2); var sfE=particleStub("minecraft:soul_fire_flame",0.02,1)
        for (i=0;i<points;i++){t=points<=1?1:i/(points-1);angle=i*41;vector=frontInPlane(0,90,entity,angle,0,radius*(1-t*0.25));y=baseY+height*t;sp(soulE,baseX+vector[0],y,baseZ+vector[2]);if(i%4===0)spawnParticle(world,sfE,baseX+vector[0]*0.65,y-0.2,baseZ+vector[2]*0.65)}
        return first
    }
    // fallback ring
    for (i = 0; i < points; i++) { angle=i*(360/points); vector=frontInPlane(0,90,entity,angle,0,radius); sp(effect,baseX+vector[0],baseY+vector[1],baseZ+vector[2]) }
    return first
}

function playSoulHarvest(killerEntity, deadEntity, effect) {
    var world  = killerEntity.getWorld ? killerEntity.getWorld() : _npcRef.getWorld()
    var startX = safeX(deadEntity), startY = safeY(deadEntity) + (effect.yOffset || 1), startZ = safeZ(deadEntity)
    var endX   = safeX(killerEntity), endY = safeY(killerEntity) + 1.15, endZ = safeZ(killerEntity)
    var steps  = effect.points || 26
    var soulE  = particleStub("minecraft:soul", 0.01, 2)
    var flameE = particleStub("minecraft:soul_fire_flame", 0.015, 1)
    var smokeE = particleStub("minecraft:reverse_portal", 0.06, 1)

    previewRunAsync(function() {
        var i, t, arc, wobble, x, y, z, angle, rx, rz
        for (i = 0; i <= steps; i++) {
            t = i / steps
            arc    = Math.sin(t * Math.PI) * (effect.height || 2.6)
            wobble = Math.sin(t * Math.PI * 6) * (effect.radius || 1.35) * (1 - t) * 0.25
            x = startX + (endX - startX) * t + wobble
            y = startY + (endY - startY) * t + arc
            z = startZ + (endZ - startZ) * t + Math.cos(t * Math.PI * 6) * (effect.radius || 1.35) * (1 - t) * 0.25
            spawnParticle(world, soulE, x, y, z)
            if (i % 2 === 0) spawnParticle(world, flameE, x, y - 0.08, z)
            if (i % 4 === 0) spawnParticle(world, smokeE, x, y + 0.1, z)
            previewDelay(25)
        }
        for (i = 0; i < 24; i++) {
            angle = i * 15; rx = Math.cos(angle * Math.PI/180) * 0.85; rz = Math.sin(angle * Math.PI/180) * 0.85
            spawnParticle(world, soulE, endX+rx, endY, endZ+rz)
            if (i % 3 === 0) spawnParticle(world, flameE, endX+rx*0.55, endY+0.25, endZ+rz*0.55)
        }
        playSound(world, { sound: "minecraft:entity.experience_orb.pickup", volume: 0.8, pitch: 0.65 }, endX, endY, endZ)
    })
}

// Play an effect.
// targetEntity  = entity the particles spawn on / sound plays at
// killerEntity  = who triggered the kill (soul_harvest arc flies toward this entity)
// deadEntity    = where the soul originates from (only used by soul_harvest; defaults to targetEntity)
function playEffect(effectId, targetEntity, killerEntity, deadEntity) {
    var effect = effectById(effectId)
    if (!effect) return
    var world = targetEntity.getWorld ? targetEntity.getWorld() : _npcRef.getWorld()
    playSound(world, effect, safeX(targetEntity), safeY(targetEntity), safeZ(targetEntity))
    if (effect.pattern === "soul_harvest") {
        // soul starts at deadEntity, arcs toward killerEntity
        var origin = deadEntity || targetEntity
        playSoulHarvest(killerEntity || targetEntity, origin, effect)
    } else {
        playPattern(world, targetEntity, effect)
    }
}

// ============================================================================
// EVENTS
// ============================================================================
function init(event) {
    _npcRef = event.npc
}

function interact(event) {
    _npcRef = event.npc
    event.setCanceled(true)
    openGui(event.player, "")
}

// Fires when THIS NPC is killed — play the assigned effect
function died(event) {
    var npc      = event.npc || _npcRef
    // CNPC exposes the killer as event.player on NpcEvent.DiedEvent
    var killer   = event.player || event.killer || null
    var effectId = npc ? getNpcEffect(npc) : null
    if (!effectId) return
    // soul starts at the NPC corpse position, arcs toward the killer
    // playEffect(id, targetEntity, killerEntity, deadEntity)
    // targetEntity = killer (sound plays here, non-soul effects show here)
    // deadEntity   = npc   (soul_harvest arc starts here)
    var target = killer || npc
    playEffect(effectId, target, target, npc)
}

function customGuiScroll(event) {
    if (event.gui.getID() !== PREVIEW_GUI_ID) return
    if (event.scrollId === SCROLL_EFFECTS) {
        var ui = getUi(event.player.getName())
        ui.effectIndex = event.scrollIndex
        openGui(event.player, "")
    }
}

function customGuiButton(event) {
    if (event.gui.getID() !== PREVIEW_GUI_ID) return
    var player = event.player
    var ui     = getUi(player.getName())
    var effectId = ui.effectIds[ui.effectIndex]
    var effect   = effectById(effectId)

    if (event.buttonId === BTN_CLOSE) {
        player.closeGui()
        return
    }

    if (!effect) {
        openGui(player, "Select an effect first")
        return
    }

    if (event.buttonId === BTN_PREVIEW) {
        // Play the effect on the player — same as what they would see on a kill
        playEffect(effect.id, player, player)
        openGui(player, "Previewing: " + effect.name)
        return
    }

    if (event.buttonId === BTN_SET_NPC_EFFECT && isAdmin(player)) {
        if (_npcRef) {
            setNpcEffect(_npcRef, effect.id)
            player.message("\u00A7a[KillFX] NPC effect set to \u00A7e" + effect.name)
        }
        openGui(player, "NPC effect set: " + effect.name)
        return
    }
}

function customGuiClosed(event) {}
function tick(event)            {}