var NpcFOV = 200;
var TeleportDestination = [2380, 43, 955];

// Track which player is being chased (entity)
var chasingTarget = null;

// Track sugar state per player UUID
var playerSugar = {}; // uuid -> true/undefined

// Keep track so we don't scan a player more than once per detection
var scannedPlayers = {}; // uuid -> true

// Fly state for chasing sugar carriers
var flyTimer = 0;
var isFlying = false;
var FLY_DURATION = 30; // 15 seconds (30 CNPC ticks = 300 MC ticks)
// Ground phase between flights — same length as the air phase
var groundTimer = 0;
var GROUND_DURATION = FLY_DURATION;
var FLY_SPEED = 0.8;

var isPolice = 1;

function init(e) {
    var npc = e.npc;
    var display = npc.getDisplay();
    npc.setFaction(17);
    npc.getAi().setAvoidsWater(true);
    npc.getInventory().setDropItem(0, npc.world.createItem("coins:stone_coin", 3), 40);
    npc.getInventory().setDropItem(1, npc.world.createItem("coins:stone_coin", 5), 40);
    npc.getInventory().setDropItem(2, npc.world.createItem("minecraft:apple", 1), 50);

    // Clear any flight state left over from a previous session (e.g. saved
    // mid-chase) so the NPC never starts out flying
    isFlying = false;
    flyTimer = 0;
    groundTimer = 0;
    chasingTarget = null;
    npc.getAi().setNavigationType(0);
    npc.getAi().setReturnsHome(true);
    npc.setMotionX(0);
    npc.setMotionY(0);
    npc.setMotionZ(0);

    display.setSkinTexture("cyberpunkskins:textures/lcpd.png");
    display.setName("LCPD");
    npc.getAi().setRetaliateType(0);
    npc.getStats().setMaxHealth(100);

    var gun = npc.world.createItem("tacz:modern_kinetic_gun", 1);
    gun.getNbt().putString("GunId", "tacz:vector45");

    npc.setMainhandItem(gun);
    npc.getInventory().setProjectile(npc.world.createItem("minecraft:gold_nugget", 1));

    npc.getStats().getRanged().setStrength(2);
    npc.getStats().getRanged().setAccuracy(80);
    npc.getStats().getRanged().setRange(100);
    npc.getStats().getRanged().setDelay(1, 1);
    npc.getStats().getRanged().setBurstDelay(1);
    npc.getStats().getRanged().setHasGravity(false);
    npc.getStats().getRanged().setSpeed(40);
    npc.getStats().setAggroRange(100);
    npc.getStats().getRanged().setSound(0, "customnpcs:gun.pistol.shot");
    npc.getStats().getRanged().setSound(1, "");
    npc.getStats().getRanged().setSound(2, "tacz:target_block_hit");
    npc.getStats().getRanged().setMeleeRange(4);
}

function tick(e) {
    if (isPolice == 1) {
        var npc = e.npc;

        // Fly timer — drop to ground after the air phase, then re-take-off later
        if (isFlying) {
            flyTimer--;
            if (flyTimer <= 0) {
                npc.getAi().setNavigationType(0);
                isFlying = false;
                groundTimer = GROUND_DURATION;
                stopMotion(npc);
            }
        }

        if (chasingTarget == null) {

            npc.getStats().setCombatRegen(0);
            npc.getStats().setMaxHealth(100);
            var ents = npc.world.getNearbyEntities(npc.getPos(), 30, 1); // 1 = players
            for (var i = 0; i < ents.length; i++) {
                var player = ents[i];
                // only detect sugar on players inside the NPC's FOV
                if (!CheckFOV(npc, player, NpcFOV)) continue;
                var uuid = player.getUUID();
                if (!scannedPlayers[uuid]) {
                    // mark scanned so we don't rescan immediately
                    scannedPlayers[uuid] = true;

                    var sugarItem = npc.world.createItem("minecraft:sugar", 1);
                    var sugarCount = player.getInventory().count(sugarItem, true, true);

                    if (sugarCount > 0) {
                        player.message("§e[Scanner] Police detected sugar on you!");
                        playerSugar[uuid] = true; // per-player sugar flag
                        chasingTarget = player;
                        npc.getAi().setWalkingSpeed(4);
                        npc.getAi().setReturnsHome(false);
                        npc.getStats().setCombatRegen(300);
                        npc.getStats().setMaxHealth(300);
                        // Enable flight immediately
                        groundTimer = 0;
                        startFlight(npc);
                    } else {
                        // if no sugar, allow future re-scan by removing the scanned mark
                        delete scannedPlayers[uuid];
                    }
                }
            }
        } else {
            // Already have a chasing target
            if (!chasingTarget.isAlive()) {
                resetChase(npc, chasingTarget);
                return;
            }

            var pos = chasingTarget.getPos();
            if (isFlying) {
                flyToward(npc, pos);
            } else {
                // Ground phase — count down, then take off again
                if (groundTimer > 0) {
                    groundTimer--;
                    if (groundTimer <= 0) {
                        startFlight(npc);
                    }
                }
                if (!isFlying) {
                    npc.navigateTo(pos.getX(), pos.getY(), pos.getZ(), 10);
                }
            }

            var dist = npc.getPos().distanceTo(pos);

            if (dist > 30) {
                npc.say("Lost sight of " + chasingTarget.getName() + "...");
                npc.getStats().setCombatRegen(0);
                resetChase(npc, chasingTarget);
                return;
            }

            if (dist < 2 && npc.canSeeEntity(chasingTarget)) {
                npc.setAttackTarget(chasingTarget);
            }
        }
    }
}

function meleeAttack(e) {
    var target = e.target;
    var npc = e.npc;

    // Only handle players and only if that player had sugar flagged
    if (target.getType() == 1) {
        var uuid = target.getUUID();
        if (playerSugar[uuid]) {
            target.setPosition(TeleportDestination[0], TeleportDestination[1], TeleportDestination[2]);
            npc.executeCommand('kill @e[type=minecraft:item,nbt={Item:{id:"minecraft:sugar"}}]');
            var inv = target.getInventory();
            var size = inv.getSize();
            for (var slot = 0; slot < size; slot++) {
                var item = inv.getSlot(slot);
                if (item != null && item.getName() == "minecraft:sugar") {
                    inv.setSlot(slot, null);
                }
            }
            target.message("§cYou've been locked up");

            // Clear player-specific state and reset NPC chase
            resetChase(npc, target);
        }
    }
}

function resetChase(npc, player) {
    npc.getAi().setWalkingSpeed(5);
    npc.getAi().setNavigationType(0);
    npc.getAi().setReturnsHome(true);
    isFlying = false;
    flyTimer = 0;
    groundTimer = 0;
    stopMotion(npc);
    if (player) {
        var uuid = player.getUUID();
        // remove scanned and sugar flags so the player can be detected again next time
        delete scannedPlayers[uuid];
        delete playerSugar[uuid];
    }
    chasingTarget = null;
}

function startFlight(npc) {
    isFlying = true;
    flyTimer = FLY_DURATION;
    npc.getAi().setNavigationType(1);
}

function flyToward(npc, targetPos) {
    var myPos = npc.getPos();
    var dx = targetPos.getX() - myPos.getX();
    var dy = targetPos.getY() - myPos.getY();
    var dz = targetPos.getZ() - myPos.getZ();
    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (dist < 0.01) dist = 0.01;

    // Fly straight at the target, slowing down as we close in
    var speedScale = Math.min(1, dist / 2);
    npc.setMotionX((dx / dist) * FLY_SPEED * speedScale);
    npc.setMotionY((dy / dist) * FLY_SPEED * speedScale);
    npc.setMotionZ((dz / dist) * FLY_SPEED * speedScale);
}

function stopMotion(npc) {
    npc.setMotionX(0);
    npc.setMotionY(0);
    npc.setMotionZ(0);
}

var VERTICAL_FOV = 60; // degrees total (±30° up/down)

function CheckFOV(seer, seen, FOV) {
    // Horizontal check
    var P = seer.getRotation();
    if (P < 0) P = P + 360;
    var rot = Math.abs(GetPlayerRotation(seer, seen) - P);
    if (rot > 180) rot = Math.abs(rot - 360);
    if (rot >= FOV / 2) return false;

    // Vertical check
    var dy = seen.getY() + seen.getEyeHeight() - (seer.getY() + seer.getEyeHeight());
    var dxh = seen.getX() - seer.getX();
    var dzh = seen.getZ() - seer.getZ();
    var hDist = Math.sqrt(dxh * dxh + dzh * dzh);
    if (hDist < 0.01) hDist = 0.01;
    var vertAngle = Math.atan2(dy, hDist) * 180 / Math.PI;
    return Math.abs(vertAngle) < VERTICAL_FOV / 2;
}

function GetPlayerRotation(npc, player) {
    var dx = npc.getX() - player.getX();
    var dz = player.getZ() - npc.getZ();
    var angle;
    if (dz >= 0) {
        angle = (Math.atan(dx / dz) * 180 / Math.PI);
        if (angle < 0) angle = 360 + angle;
    } else {
        dz = -dz;
        angle = 180 - (Math.atan(dx / dz) * 180 / Math.PI);
    }
    return angle;
}

function died(e) {
    var npc = e.npc;

    var killer = e.source; // the entity that killed this npc
    if (killer == null) return;

    // Only react to player kills
    if (killer.getType() != 1) return; // 1 = IPlayer

    var killerName = killer.getName();
    var pos = npc.getPos();

    // Store killer name in world tempdata for MaxtacAV to read
    var tempData = npc.getWorld().getTempdata();
    tempData.put("maxtacav_killer", JSON.stringify(killerName));

    // Spawn MaxtacAV 20 blocks above where the police died
    var spawnX = Math.floor(pos.getX());
    var spawnY = Math.floor(pos.getY()) + 40;
    var spawnZ = Math.floor(pos.getZ());
    npc.getWorld().spawnClone(spawnX, spawnY, spawnZ, 3, "MaxtacAV");
}
