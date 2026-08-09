// ===============================================================
// SK DEBUG - Serial Killer AI Behavior Test Script
// Tests: cover-seeking, peek-and-fire, push, retreat
// ===============================================================

// ── Stats ────────────────────────────────────────────────────────
var HEALTH = 200;
var HEALTH_REGEN = 3;
var COMBAT_REGEN = 3;
var SPEED = 6.0;
var RANGED_STRENGTH = 1;
var RANGED_ACCURACY = 95;
var RANGED_RANGE = 100;
var RANGED_DELAY = 15;
var RANGED_SPEED = 40;
var SKIN_URL = "https://www.minecraftskins.com/uploads/skins/2025/12/16/tattered-cyborg-23723445.png?v964";
var DISPLAY_NAME = "S4";
var HAND_ITEM_ID = "tacz:modern_kinetic_gun";
var HAND_ITEM_NBT = '{"HasBulletInBarrel":1,"GunCurrentAmmoCount":11,"GunFireMode":"SEMI","GunId":"cyber_armorer:unity_cheetah"}';
var EXP_MIN = 8;
var EXP_MAX = 8;

// ── AI Behavior Settings ─────────────────────────────────────────
var COVER_RANGE        = 16;
var PEEK_MIN_TICKS     = 30;
var PEEK_MAX_TICKS     = 60;
var PUSH_TIMEOUT_TICKS = 200;
var RETREAT_HP_PCT     = 0.30;
var RETREAT_DISTANCE   = 30;
var AI_CHECK_INTERVAL  = 6;
var PUSH_BURST_TICKS   = 80;

// ── State ────────────────────────────────────────────────────────
var tickCount = 0;
var trackedTarget = null;  // Script-level target — never triggers built-in AI

function init(e) {
    var npc = e.npc;
    var stats = npc.getStats();

    stats.setMaxHealth(HEALTH);
    stats.setHealthRegen(HEALTH_REGEN);
    stats.setCombatRegen(COMBAT_REGEN);
    stats.setAggroRange(0);  // Disable auto-targeting — we control it manually

    var ranged = stats.getRanged();
    ranged.setStrength(RANGED_STRENGTH);
    ranged.setAccuracy(RANGED_ACCURACY);
    ranged.setRange(RANGED_RANGE);
    ranged.setDelay(RANGED_DELAY, RANGED_DELAY);
    ranged.setBurstDelay(1);
    ranged.setSpeed(RANGED_SPEED);
    ranged.setHasGravity(false);
    ranged.setSound(0, "customnpcs:gun.pistol.shot");
    ranged.setSound(1, "");
    ranged.setSound(2, "tacz:target_block_hit");


    npc.getInventory().setExp(EXP_MIN, EXP_MAX);
    npc.getAi().setWalkingSpeed(SPEED);
    npc.getAi().setMovingType(0);
    npc.getAi().setReturnsHome(false);
    npc.getAi().setRetaliateType(0);
    npc.setName(DISPLAY_NAME);

    try { npc.setSkinUrl(SKIN_URL); } catch (err) {}

    try {
        var hand = npc.getWorld().createItem(HAND_ITEM_ID, 1);
        if (HAND_ITEM_NBT) {
            var tag = Packages.noppes.npcs.api.NpcAPI.Instance().stringToNbt(HAND_ITEM_NBT);
            hand.setTag(tag);
        }
        npc.setMainhandItem(hand);
    } catch (err) {}

    setAiState(npc, "idle");
    setShooting(npc, false);
    trackedTarget = null;
}

// ============================================================================
// MAIN TICK
// ============================================================================
function tick(e) {
    var npc = e.npc;
    var world = npc.getWorld();
    tickCount++;

    // ── Crawl check (every 1s) ──────────────────────────────────
    if (tickCount % 2 === 0) {
        try {
            var blocked = isBlocked(npc);
            var animType = npc.getAi().getAnimation();
            if (blocked && animType !== 7) {
                npc.getAi().setMovingType(0);
                npc.getAi().setAnimation(7);
            } else if (!blocked && animType === 7) {
                npc.getAi().setMovingType(0);
                npc.getAi().setAnimation(0);
            }
        } catch (err) {}
    }

    // ── Get target (script-level, NOT npc.setAttackTarget) ────────
    if (trackedTarget && !trackedTarget.isAlive()) {
        trackedTarget = null;
    }
    if (!trackedTarget) {
        trackedTarget = findNearestPlayer(npc);
    }
    if (!trackedTarget) return;
    var target = trackedTarget;

    // ── AI State Machine ─────────────────────────────────────────
    if (tickCount % AI_CHECK_INTERVAL !== 0) return;

    var aiState = getAiState(npc);
    var hp = npc.getHealth();
    var maxHp = npc.getMaxHealth();
    var hpPct = maxHp > 0 ? hp / maxHp : 1;
    var dist = distanceBetween(npc, target);
    var los = raycastLOS(npc, target);

    npc.say("§7[AI] §f" + aiState + " §7hp=" + Math.floor(hp) + "/" + Math.floor(maxHp)
        + " dist=" + Math.floor(dist) + " los=" + los);

    // ── Priority 1: Retreat at low HP ────────────────────────────
    if (hpPct <= RETREAT_HP_PCT && aiState !== "retreating") {
        npc.say("§c[AI] LOW HP → retreating!");
        stopShooting(npc);
        startRetreat(npc, target);
        return;
    }

    // ── State machine ────────────────────────────────────────────
    switch (aiState) {

        case "idle":
            if (los) {
                npc.say("§e[AI] LOS → seeking cover");
                stopShooting(npc);
                seekCover(npc, target);
            } else {
                npc.say("§a[AI] no LOS → entering cover");
                stopShooting(npc);
                enterCover(npc);
            }
            break;

        case "seek_cover":
            if (!npc.isNavigating() || !los) {
                npc.say("§a[AI] at cover");
                stopShooting(npc);
                enterCover(npc);
            }
            break;

        case "in_cover":
            var coverTimer = getCoverTimer(npc) + AI_CHECK_INTERVAL;
            setCoverTimer(npc, coverTimer);

            if (coverTimer >= PUSH_TIMEOUT_TICKS) {
                npc.say("§c[AI] timeout → PUSH");
                startPush(npc, target);
            } else {
                npc.say("§e[AI] peeking out");
                startPeek(npc, target);
            }
            break;

        case "peeking":
            var peekTimer = getPeekTimer(npc) - AI_CHECK_INTERVAL;
            setPeekTimer(npc, peekTimer);

            if (peekTimer <= 0) {
                npc.say("§7[AI] peek done → cover");
                stopShooting(npc);
                seekCover(npc, target);
            }
            break;

        case "pushing":
            var pushTimer = getPushTimer(npc) - AI_CHECK_INTERVAL;
            setPushTimer(npc, pushTimer);

            if (pushTimer <= 0 || dist < 8) {
                npc.say("§7[AI] push done → cover");
                stopShooting(npc);
                seekCover(npc, target);
            }
            break;

        case "retreating":
            var retreatTimer = getRetreatTimer(npc) - AI_CHECK_INTERVAL;
            setRetreatTimer(npc, retreatTimer);

            if (retreatTimer <= 0 || !npc.isNavigating()) {
                npc.say("§a[AI] retreat done → re-engage");
                setAiState(npc, "idle");
            }
            break;
    }
}

// ============================================================================
// SHOOTING CONTROL - Toggle built-in CNPC ranged attack
// ============================================================================
function startShooting(npc, target) {
    if (isShooting(npc)) return;
    setShooting(npc, true);
    // Give target to built-in AI so EntityAIRangedAttack fires
    npc.setAttackTarget(target);
}

function stopShooting(npc) {
    if (!isShooting(npc)) return;
    setShooting(npc, false);
    // Remove target so built-in AI stops shooting and stops navigating
    npc.setAttackTarget(null);
}

function isShooting(npc) {
    try { return npc.tempdata.get("_shooting") === true; } catch (e) { return false; }
}

function setShooting(npc, v) { npc.tempdata.put("_shooting", v); }

// ============================================================================
// AI STATE HELPERS
// ============================================================================
function getAiState(npc) {
    try {
        var s = npc.tempdata.get("_ai_state");
        return s || "idle";
    } catch (e) { return "idle"; }
}

function setAiState(npc, state) {
    npc.tempdata.put("_ai_state", state);
}

function getCoverTimer(npc) {
    try { return parseInt(npc.tempdata.get("_cover_timer")) || 0; } catch (e) { return 0; }
}
function setCoverTimer(npc, v) { npc.tempdata.put("_cover_timer", "" + v); }

function getPeekTimer(npc) {
    try { return parseInt(npc.tempdata.get("_peek_timer")) || 0; } catch (e) { return 0; }
}
function setPeekTimer(npc, v) { npc.tempdata.put("_peek_timer", "" + v); }

function getPushTimer(npc) {
    try { return parseInt(npc.tempdata.get("_push_timer")) || 0; } catch (e) { return 0; }
}
function setPushTimer(npc, v) { npc.tempdata.put("_push_timer", "" + v); }

function getRetreatTimer(npc) {
    try { return parseInt(npc.tempdata.get("_retreat_timer")) || 0; } catch (e) { return 0; }
}
function setRetreatTimer(npc, v) { npc.tempdata.put("_retreat_timer", "" + v); }

// ============================================================================
// LINE OF SIGHT - Manual raycast
// ============================================================================
function raycastLOS(npc, target) {
    var from = npc.getPos();
    var to = target.getPos();
    var dx = to.getX() - from.getX();
    var dy = (to.getY() + 1) - (from.getY() + 1);
    var dz = to.getZ() - from.getZ();
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < 1) return true;

    var world = npc.getWorld();
    var steps = Math.ceil(dist * 2);
    var sx = dx / steps;
    var sy = dy / steps;
    var sz = dz / steps;

    for (var i = 1; i < steps; i++) {
        var bx = Math.floor(from.getX() + sx * i);
        var by = Math.floor(from.getY() + 1 + sy * i);
        var bz = Math.floor(from.getZ() + sz * i);
        if (isSolid(world.getBlock(bx, by, bz))) return false;
    }
    return true;
}

// ============================================================================
// COVER FINDING
// ============================================================================
function findCoverPosition(npc, target) {
    var from = npc.getPos();
    var to = target.getPos();
    var dx = to.getX() - from.getX();
    var dz = to.getZ() - from.getZ();
    var hDist = Math.sqrt(dx * dx + dz * dz);
    if (hDist < 1) return null;

    var world = npc.getWorld();
    var dirX = dx / hDist;
    var dirZ = dz / hDist;

    // Find first solid block between us and target
    var hitStep = -1;
    for (var step = 2; step <= COVER_RANGE; step++) {
        var bx = Math.floor(from.getX() + dirX * step);
        var bz = Math.floor(from.getZ() + dirZ * step);
        var by = Math.floor(from.getY());
        if (isSolid(world.getBlock(bx, by, bz)) || isSolid(world.getBlock(bx, by + 1, bz))) {
            hitStep = step;
            break;
        }
    }

    if (hitStep < 0) {
        return findPerpendicularCover(npc, target);
    }

    // Stand on the near side of the wall (between us and the wall)
    var coverX = Math.floor(from.getX() + dirX * (hitStep - 1));
    var coverZ = Math.floor(from.getZ() + dirZ * (hitStep - 1));
    var coverY = findGroundY(world, coverX, Math.floor(from.getY()), coverZ);
    if (coverY === null) return null;

    return { x: coverX + 0.5, y: coverY, z: coverZ + 0.5 };
}

function findPerpendicularCover(npc, target) {
    var from = npc.getPos();
    var to = target.getPos();
    var dx = to.getX() - from.getX();
    var dz = to.getZ() - from.getZ();
    var hDist = Math.sqrt(dx * dx + dz * dz);
    if (hDist < 1) return null;

    var perpX = -dz / hDist;
    var perpZ = dx / hDist;
    var world = npc.getWorld();
    var candidates = [];

    for (var side = -1; side <= 1; side += 2) {
        for (var step = 2; step <= 8; step++) {
            var cx = Math.floor(from.getX() + perpX * side * step);
            var cz = Math.floor(from.getZ() + perpZ * side * step);
            var cy = findGroundY(world, cx, Math.floor(from.getY()), cz);
            if (cy === null) continue;

            if (raycastBlockBetween(world, cx + 0.5, cy + 1, cz + 0.5, to.getX(), to.getY() + 1, to.getZ())) {
                candidates.push({ x: cx + 0.5, y: cy, z: cz + 0.5, d: step });
            }
        }
    }

    if (candidates.length === 0) return null;
    candidates.sort(function(a, b) { return a.d - b.d; });
    return candidates[0];
}

function raycastBlockBetween(world, x1, y1, z1, x2, y2, z2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var dz = z2 - z1;
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < 1) return false;
    var steps = Math.ceil(dist * 2);
    var sx = dx / steps;
    var sy = dy / steps;
    var sz = dz / steps;
    for (var i = 0; i < steps; i++) {
        var bx = Math.floor(x1 + sx * i);
        var by = Math.floor(y1 + sy * i);
        var bz = Math.floor(z1 + sz * i);
        if (isSolid(world.getBlock(bx, by, bz))) return true;
    }
    return false;
}

function findGroundY(world, x, startY, z) {
    for (var y = startY + 3; y >= startY - 5; y--) {
        if (isSolid(world.getBlock(x, y, z)) && !isSolid(world.getBlock(x, y + 1, z)) && !isSolid(world.getBlock(x, y + 2, z))) {
            return y + 1;
        }
    }
    return null;
}

// ============================================================================
// AI ACTIONS
// ============================================================================
function seekCover(npc, target) {
    var coverPos = findCoverPosition(npc, target);
    if (coverPos) {
        npc.say("§7[AI] → cover " + Math.floor(coverPos.x) + "," + Math.floor(coverPos.z));
        npc.navigateTo(coverPos.x, coverPos.y, coverPos.z, 1.0);
        setAiState(npc, "seek_cover");
        setCoverTimer(npc, 0);
    } else {
        npc.say("§c[AI] no cover → peek in place");
        startPeek(npc, target);
    }
}

function enterCover(npc) {
    npc.clearNavigation();
    setAiState(npc, "in_cover");
    setCoverTimer(npc, 0);
}

function startPeek(npc, target) {
    var pos = npc.getPos();
    var to = target.getPos();
    var dx = to.getX() - pos.getX();
    var dz = to.getZ() - pos.getZ();
    var hDist = Math.sqrt(dx * dx + dz * dz);
    if (hDist < 1) hDist = 1;

    var perpX = -dz / hDist;
    var perpZ = dx / hDist;
    var side = Math.random() < 0.5 ? 1 : -1;
    var peekDist = 2 + Math.random() * 2;

    var peekX = pos.getX() + perpX * side * peekDist;
    var peekZ = pos.getZ() + perpZ * side * peekDist;

    npc.say("§e[AI] peek " + (side > 0 ? "right" : "left"));
    npc.navigateTo(peekX, pos.getY(), peekZ, 1.2);
    setAiState(npc, "peeking");
    setPeekTimer(npc, PEEK_MIN_TICKS + Math.floor(Math.random() * (PEEK_MAX_TICKS - PEEK_MIN_TICKS)));

    // Enable shooting — give target to built-in AI
    startShooting(npc, target);
}

function startPush(npc, target) {
    var to = target.getPos();
    npc.say("§c[AI] PUSH!");
    npc.navigateTo(to.getX(), to.getY(), to.getZ(), 1.3);
    setAiState(npc, "pushing");
    setPushTimer(npc, PUSH_BURST_TICKS);
    setCoverTimer(npc, 0);

    // Enable shooting
    startShooting(npc, target);
}

function startRetreat(npc, target) {
    var pos = npc.getPos();
    var to = target.getPos();
    var dx = pos.getX() - to.getX();
    var dz = pos.getZ() - to.getZ();
    var dist = Math.sqrt(dx * dx + dz * dz);
    if (dist < 1) { dx = 1; dz = 0; dist = 1; }

    var rx = pos.getX() + (dx / dist) * RETREAT_DISTANCE;
    var rz = pos.getZ() + (dz / dist) * RETREAT_DISTANCE;

    npc.say("§c[AI] RETREAT");
    npc.navigateTo(rx, pos.getY(), rz, 1.3);
    setAiState(npc, "retreating");
    setRetreatTimer(npc, 100);
}

// ============================================================================
// TARGET SCANNING - Returns player, does NOT call setAttackTarget
// ============================================================================
function findNearestPlayer(npc) {
    var world = npc.getWorld();
    var pos = npc.getPos();
    var nearby = world.getNearbyEntities(pos, 50, 1);
    var nearest = null;
    var nearestDist = 99999;

    for (var i = 0; i < nearby.length; i++) {
        var player = nearby[i];
        if (!player.isAlive()) continue;
        var d = pos.distanceTo(player.getPos());
        if (d < nearestDist) {
            nearestDist = d;
            nearest = player;
        }
    }
    return nearest;
}

// ============================================================================
// UTILITY
// ============================================================================
function distanceBetween(npc, target) {
    var a = npc.getPos();
    var b = target.getPos();
    var dx = a.getX() - b.getX();
    var dy = a.getY() - b.getY();
    var dz = a.getZ() - b.getZ();
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function isBlocked(npc) {
    var pos = npc.getPos();
    var world = npc.getWorld();
    var ix = Math.floor(pos.getX());
    var iy = Math.floor(pos.getY());
    var iz = Math.floor(pos.getZ());

    return isSolid(world.getBlock(ix, iy + 1, iz))
        || isSolid(world.getBlock(ix + 1, iy + 1, iz))
        || isSolid(world.getBlock(ix - 1, iy + 1, iz))
        || isSolid(world.getBlock(ix, iy + 1, iz + 1))
        || isSolid(world.getBlock(ix, iy + 1, iz - 1));
}

function isSolid(block) {
    if (!block) return false;
    var name = block.getName();
    return name !== "minecraft:air" && name !== "minecraft:cave_air" && name !== "minecraft:void_air"
        && name.indexOf("water") === -1 && name.indexOf("lava") === -1;
}
