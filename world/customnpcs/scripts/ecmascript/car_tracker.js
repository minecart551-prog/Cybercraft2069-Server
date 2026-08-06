// ===============================================================
// CAR TRACKER - Scripted Item
// Right-click to scan for nearby Automobile entities and teleport
// ===============================================================

var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();

var GUI_MAIN = 4000;
var ID_LBL_TITLE = 10;
var ID_LBL_COUNT = 11;
var ID_SCROLL_CARS = 20;
var ID_BTN_TELEPORT = 30;
var ID_BTN_REFRESH = 31;
var ID_BTN_CLOSE = 32;
var ID_LBL_SELECTED = 33;

var SCAN_RANGE = 100;
var CAR_TYPE = "automobility:automobile";

var carList = [];
var selectedIndex = -1;

function init(t) {
    t.item.setTexture(0, "minecraft:compass");
    t.item.setDurabilityShow(false);
    t.item.setItemDamage(0);
}

function interact(t) {
    var player = t.player;
    var world = player.getWorld();
    openMainGui(player, world);
}

function openMainGui(player, world) {
    carList = scanForCars(player);
    selectedIndex = -1;

    var width = 380;
    var height = 220;
    var gui = NpcAPI.createCustomGui(GUI_MAIN, width, height, false, player);

    gui.addLabel(ID_LBL_TITLE, "§6§lCar Tracker", 10, 8, 200, 14);
    gui.addLabel(ID_LBL_COUNT, "§7Found: §f" + carList.length + " §7automobiles within " + SCAN_RANGE + " blocks", 10, 28, 300, 10);

    var scrollLabels = buildScrollLabels(player);
    gui.addScroll(ID_SCROLL_CARS, 10, 45, 340, 120, scrollLabels.length > 0 ? scrollLabels : ["§7No automobiles found nearby"]);

    gui.addLabel(ID_LBL_SELECTED, "§7Select a car from the list, then click Teleport", 10, 172, 260, 10);

    gui.addButton(ID_BTN_TELEPORT, "§a§lTeleport", 10, 190, 80, 20);
    gui.addButton(ID_BTN_REFRESH, "§7Refresh", 100, 190, 60, 20);
    gui.addButton(ID_BTN_CLOSE, "§7Close", 320, 190, 50, 20);

    player.showCustomGui(gui);
}

function scanForCars(player) {
    var world = player.getWorld();
    var pos = player.getPos();
    var nearby = world.getNearbyEntities(pos, SCAN_RANGE, -1);
    var cars = [];

    for (var i = 0; i < nearby.length; i++) {
        var ent = nearby[i];
        try {
            if (ent.getTypeName() === CAR_TYPE) {
                var ePos = ent.getPos();
                var dx = ePos.getX() - pos.getX();
                var dy = ePos.getY() - pos.getY();
                var dz = ePos.getZ() - pos.getZ();
                var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                var frameName = "Automobile";
                try {
                    var nbt = ent.getEntityNbt();
                    var frame = nbt.getString("frame");
                    if (frame && frame.length > 0) {
                        frameName = formatFrameName(frame);
                    }
                } catch(e) {}

                var rider = "§7Empty";
                try {
                    var passengers = ent.getPassengers();
                    if (passengers && passengers.length > 0) {
                        rider = "§a" + passengers[0].getEntityName();
                    }
                } catch(e) {}

                cars.push({
                    entity: ent,
                    x: Math.floor(ePos.getX()),
                    y: Math.floor(ePos.getY()),
                    z: Math.floor(ePos.getZ()),
                    dist: Math.floor(dist),
                    frame: frameName,
                    rider: rider
                });
            }
        } catch(e) {}
    }

    cars.sort(function(a, b) { return a.dist - b.dist; });
    return cars;
}

function formatFrameName(raw) {
    var name = raw.replace(/_/g, " ");
    var words = name.split(" ");
    for (var i = 0; i < words.length; i++) {
        if (words[i].length > 0) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1);
        }
    }
    return words.join(" ");
}

function buildScrollLabels(player) {
    var labels = [];

    for (var i = 0; i < carList.length; i++) {
        var car = carList[i];
        var distStr = car.dist <= 5 ? "§a" + car.dist + "m" : (car.dist <= 20 ? "§e" + car.dist + "m" : "§c" + car.dist + "m");
        labels.push("§f" + car.frame + " §7@ §f" + car.x + ", " + car.y + ", " + car.z + " " + distStr + " §8- " + car.rider);
    }

    return labels;
}

function customGuiButton(event) {
    var player = event.player;
    var gui = event.gui;
    var buttonId = event.buttonId;
    var world = player.getWorld();

    if (gui.getID() === GUI_MAIN) {
        if (buttonId === ID_BTN_CLOSE) {
            player.closeGui();
            return;
        }

        if (buttonId === ID_BTN_REFRESH) {
            openMainGui(player, world);
            return;
        }

        if (buttonId === ID_BTN_TELEPORT) {
            if (selectedIndex < 0 || selectedIndex >= carList.length) {
                player.message("§cPlease select a car from the list first!");
                return;
            }

            var car = carList[selectedIndex];
            try {
                player.setPosition(car.entity.getPos().getX(), car.entity.getPos().getY() + 1, car.entity.getPos().getZ());
                player.message("§aTeleported to §f" + car.frame + "§a!");
            } catch(e) {
                player.message("§cTeleport failed: " + e);
            }
            player.closeGui();
            return;
        }
    }
}

function customGuiScroll(event) {
    var player = event.player;
    var gui = event.gui;

    if (gui.getID() === GUI_MAIN && event.scrollId === ID_SCROLL_CARS) {
        selectedIndex = event.scrollIndex;

        if (selectedIndex >= 0 && selectedIndex < carList.length) {
            var car = carList[selectedIndex];
            var lbl = gui.getComponent(ID_LBL_SELECTED);
            if (lbl) {
                lbl.setText("§aSelected: §f" + car.frame + " §7@ §f" + car.x + ", " + car.y + ", " + car.z);
            }
        }
    }
}
