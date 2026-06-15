var flightTimerId = 20;
var checkTimerId = 21;
var step = 1.3;
var pitch, pl, rot;
var motionX = 0, motionY = 0, motionZ = 0;
var decay = 0.05;
var npcYaw = 0;

var restrictedItems = [
    "yuushya:package_0",
    "minecraft:sugar"
];

function init(event) {
    event.npc.ai.stopOnInteract = false;
    event.npc.ai.returnsHome = false;
    npcYaw = event.npc.getRotation();
}

function interact(event) {
    var player = event.player;

    if (hasRestrictedItem(player)) {
        player.message("§cYou cannot use the taxi with packages!");
        return;
    }

    event.npc.addRider(player);

    event.npc.timers.stop(flightTimerId);
    event.npc.timers.start(flightTimerId, 1, true);

    event.npc.timers.stop(checkTimerId);
    event.npc.timers.start(checkTimerId, 400, true);
}

function toRadians(angle) { return angle * (Math.PI / 180); }
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpAngle(a, b, t) {
    var diff = ((b - a + 540) % 360) - 180;
    return (a + diff * t + 360) % 360;
}

function timer(event) {
    var npc = event.npc;

    if (event.id == flightTimerId) {
        var riders = npc.getRiders();
        var usingControl = false;

        if (riders.length > 0) {
            pl = riders[0];
            if (pl.mainhandItem && pl.mainhandItem.displayName == "Flight Control") {
                usingControl = true;

                pitch = Number(pl.getPitch().toFixed(2));
                rot = Number(pl.getRotation().toFixed(2));
                if (rot < 0) rot += 360;

                npcYaw = lerpAngle(npcYaw, rot, 0.2);
                npc.setRotation(npcYaw);

                var targetX = step * -Math.sin(toRadians(rot));
                var targetZ = step * Math.cos(toRadians(rot));
                var targetY = 0;

                if (pitch >= 20) targetY = -step;
                else if (pitch <= -20) targetY = step;

                motionX = lerp(motionX, targetX, 0.2);
                motionY = lerp(motionY, targetY, 0.2);
                motionZ = lerp(motionZ, targetZ, 0.2);
            }
        }

        if (!usingControl) {
            motionX = lerp(motionX, 0, decay);
            motionY = lerp(motionY, 0, decay);
            motionZ = lerp(motionZ, 0, decay);
        }

        npc.setMotionX(motionX);
        npc.setMotionY(motionY);
        npc.setMotionZ(motionZ);
    }

    if (event.id == checkTimerId) {
        var riders = npc.getRiders();
        if (riders.length > 0) {
            var p = riders[0];
            if (hasRestrictedItem(p)) {
                removeRestrictedItems(p);
                p.setMount(null);
                p.message("§cYour package was confiscated and you were removed from the taxi!");
            }
        } else {
            npc.timers.stop(checkTimerId);
        }
    }
}

function hasRestrictedItem(player) {
    var inv = player.getInventory().getItems();
    for (var i = 0; i < inv.length; i++) {
        var item = inv[i];
        if (item != null) {
            for (var r = 0; r < restrictedItems.length; r++) {
                if (item.getName() == restrictedItems[r]) return true;
            }
        }
    }
    return false;
}

function removeRestrictedItems(player) {
    var inv = player.getInventory().getItems();
    for (var i = 0; i < inv.length; i++) {
        var item = inv[i];
        if (item != null) {
            for (var r = 0; r < restrictedItems.length; r++) {
                if (item.getName() == restrictedItems[r]) {
                    item.setStackSize(0);
                }
            }
        }
    }
}