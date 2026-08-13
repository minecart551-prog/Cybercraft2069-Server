// ===============================================================
// FLYING CAR TRACKER - Scripted Item
// Right-click to scan for nearby Flying Car NPCs and teleport to them
// NPCs are named "FC (playername)" — only shows cars owned by the player
// ===============================================================

var NpcAPI = Java.type("noppes.npcs.api.NpcAPI").Instance();

var GUI_MAIN = 4100;
var ID_LBL_TITLE = 10;
var ID_LBL_COUNT = 11;
var ID_SCROLL_CARS = 20;
var ID_BTN_TELEPORT = 30;
var ID_BTN_REFRESH = 31;
var ID_BTN_CLOSE = 32;
var ID_LBL_SELECTED = 33;

var SCAN_RANGE = 500;
var FC_PREFIX = "FC1 (";
var FC_SUFFIX = ")";

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
    carList = scanForFlyingCars(player);
    selectedIndex = -1;

    var width = 380;
    var height = 220;
    var gui = NpcAPI.createCustomGui(GUI_MAIN, width, height, false, player);

    gui.addLabel(ID_LBL_TITLE, "§6§lFlying Car Tracker", 10, 8, 200, 14);
    gui.addLabel(ID_LBL_COUNT, "§7Found: §f" + carList.length + " §7of your flying cars within " + SCAN_RANGE + " blocks", 10, 28, 340, 10);

    var scrollLabels = buildScrollLabels();
    gui.addScroll(ID_SCROLL_CARS, 10, 45, 340, 120, scrollLabels.length > 0 ? scrollLabels : ["§7You have no flying cars nearby"]);

    gui.addLabel(ID_LBL_SELECTED, "§7Select your flying car from the list, then click Call Car", 10, 172, 260, 10);

    gui.addButton(ID_BTN_TELEPORT, "§a§lCall Car", 10, 190, 80, 20);
    gui.addButton(ID_BTN_REFRESH, "§7Refresh", 100, 190, 60, 20);
    gui.addButton(ID_BTN_CLOSE, "§7Close", 320, 190, 50, 20);

    player.showCustomGui(gui);
}

function scanForFlyingCars(player) {
    var world = player.getWorld();
    var pos = player.getPos();
    var playerName = player.getName();
    var nearby = world.getNearbyEntities(pos, SCAN_RANGE, 2); // 2 = NPCs
    var cars = [];

    for (var i = 0; i < nearby.length; i++) {
        var ent = nearby[i];
        try {
            var entName = ent.getName();
            if (entName.indexOf(FC_PREFIX) === 0 && entName.indexOf(FC_SUFFIX) > 0) {
                var ownerName = entName.substring(FC_PREFIX.length, entName.indexOf(FC_SUFFIX));
                if (ownerName === playerName) {
                    var ePos = ent.getPos();
                    var dx = ePos.getX() - pos.getX();
                    var dy = ePos.getY() - pos.getY();
                    var dz = ePos.getZ() - pos.getZ();
                    var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    var hasRider = false;
                    try {
                        var riders = ent.getRiders();
                        if (riders && riders.length > 0) {
                            hasRider = true;
                        }
                    } catch(e) {}

                    cars.push({
                        entity: ent,
                        name: entName,
                        x: Math.floor(ePos.getX()),
                        y: Math.floor(ePos.getY()),
                        z: Math.floor(ePos.getZ()),
                        dist: Math.floor(dist),
                        hasRider: hasRider
                    });
                }
            }
        } catch(e) {}
    }

    cars.sort(function(a, b) { return a.dist - b.dist; });
    return cars;
}

function buildScrollLabels() {
    var labels = [];

    for (var i = 0; i < carList.length; i++) {
        var car = carList[i];
        var distStr = car.dist <= 5 ? "§a" + car.dist + "m" : (car.dist <= 20 ? "§e" + car.dist + "m" : "§c" + car.dist + "m");
        var riderStr = car.hasRider ? " §c(in use)" : "";
        labels.push("§f" + car.name + " §7@ §f" + car.x + ", " + car.y + ", " + car.z + " " + distStr + riderStr);
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
                player.message("§cPlease select your flying car from the list first!");
                return;
            }

            var car = carList[selectedIndex];
            if (car.hasRider) {
                player.message("§cCannot call car while someone is driving it!");
                return;
            }
            try {
                var pPos = player.getPos();
                car.entity.setPosition(pPos.getX(), pPos.getY() + 1, pPos.getZ());
                player.message("§aCalled §f" + car.name + "§a to your location!");
            } catch(e) {
                player.message("§cFailed to call car: " + e);
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
                lbl.setText("§aSelected: §f" + car.name + " §7@ §f" + car.x + ", " + car.y + ", " + car.z);
            }
        }
    }
}
