// === Tour Guide NPC Script - Shared Group Tour === s

var currentTourStep = 0;
var isMoving = false;
var pathProgress = 0;
var currentLeaderUUID = null;

// Steps 0-3 are "early" steps — a different player clicking resets the tour.
// From step 4 onward the tour is locked in and any player can continue.
var LOCKED_IN_STEP = 4;

// Step index that qualifies the clicking player (grants tourQualified=true).
// This is index 3: "Let's now go to the second level..."
// Granted immediately when the player clicks to trigger it, not after the path finishes.
var QUALIFY_STEP = 3;
var TOUR_QUALIFIED_KEY = "tourQualified";

var tourStops = [
    { msg: "§aAre you ready for a tour?" }, 
    { msg: "§aHere at the park you can catch fishes and trade for money on the market above, I've given you some starting money, you can try to catch a fish and we'll go to the market." },
    { msg: "§aYour items will be kept if you die in nopvp area, outside of it they will drop, i'll be showing you the zone later" },
    { msg: "§aLet's now go to the second level. If you get stuck you can do §e/unstuckme §a, if youre lost do §e/spawnme §a. You can get food from all vending machines around the city", path: [[2338, -48, 848],
     [2396, -41, 848], 
     [2418, -41, 828],
     [2462, -41, 842]
     ] },
    { msg: "§aTake the elevator to second level, I'll be waiting for you up there", coords: [2461, 47, 843], teleport: true },
    { msg: "§aYou can save your spawn location here with bed for quick items retrieval", coords: [2424, 42, 855] },
    { msg: "§aClick the glass rod behind the sign here to teleport to cable car on the otherside where you can go to Fishing hub and Freezone, you can also teleport back from there, come back here because we still have to finish the tour", coords: [2423, 42, 858] },
    { msg: "§aHere at Owen's market you can trade fish for money", coords: [2424, 42, 866] },
    { msg: "§aAlso store your excess items in the Enderchest" },
    { msg: "§aNow you can buy a gun and ammos to do some gigs, there are also Beds at every Train Station for you to save spawnpoint for quick items retrievals when you die", coords: [2435, 42, 880] },
    { msg: "§aGuns have durability as well, you'll have to go to §eDesert Tunnel §aon the map to mine for materials to repair the gun, the recipes are at the table behind there" },
    { msg: "§aReady for next location?" },
    { msg: "§aHere you can get more info about Replicants hunting and rewards", path: [[2427, 42, 870],[2425, 42, 845]] },
    { msg: "§aReplicants also drop Restaurant Ingredients that you can use at Restaurant job" },
    { msg: "§aIn here is a drones shop, you can hire them to assist you with hunting replicants", coords: [2432, 42, 833] },
    { msg: "§aOver here is a money exchange", path: [[2421, 42, 834],[2428, 42, 815]] },
    { msg: "§aYou can buy your apartments from faction owners here, or check §e#real-estate §aand message faction owners on discord for one.", coords: [2427, 42, 806] },
    { msg: "§aOver here is a cars shop", coords: [2427, 42, 806] },
    { msg: "§aYou can also buy seeds and grow crops to make profits, Sobiezója also sell decorational items", path: [[2419, 42, 809],[2390, 42, 760]] },
    { msg: "§aReady for next location?" },
    { msg: "§aLet's go check out the restaurant job", path: [[2426, 42, 859],[2436, 46, 858],[2437, 47, 843]] },
    { msg: "§aIn here you will find instruction on how to cook, the ingredients are dropped from the replicants, you can choose your menu in there to serve the customers", coords: [2437, 47, 843] },
    { msg: "§aReady for next location?" },
    { msg: "§aOver here is the faction commands guides, you can check our LIVE Map at §etinyurl.com/cybercraftmap §ato see where factions claim are, check out more on #faction-guide on discord", path: [[2436, 46, 858],[2482, 47, 852]]},
    { msg: "§aYou can claim land in the freezone and build there or there are some buildings in the main city area that you can claim, factions can fight and take over each other's land/buildings as well"},
    { msg: "§aNow we will go check out the delivery job", path: [[2503, 42, 843],[2497, 42,846]] },
    { msg: "§aYou can check the guides here, you don't have to complete the delivery now, you can deliver it later", coords: [2497, 42,846] },
    { msg: "§aThe Neonites are the first level enemy you will deal with, after that are the drones you see around here, the same enemy type will defend each other so watch out for nearby enemies", coords: [2546, 42, 831] },
    { msg: "§aHere is the Elevator down to the §eMetro §awhere you can go to different parts of the city, on street level you can also go to §eDesert Tunnel §afor mining", coords: [2560, 42, 848] },
    { msg: "§aOver here we have a furniture store", coords: [2550, 42, 887] },
    { msg: "§aOver here is the sugar dealer, he will give you one sugarcane per day, you can grow more in your apartment or faction claim. The job is the same as delivery but times the ammount of sugar you can carry, LCPD will chase and arrest you if youre in their FOV", path: [[2549, 42, 920],[2578, 42, 936],[2602, 42, 930]] },
    { msg: "§aThe there are currently 4 places you can fish with different fish rarities: Spawn park -> Fishinghub = Boat dock -> Far sea (green water area in the east)", coords: [2602, 42, 930]},
    { msg: "§aThat's the end of our tour, follow the markers on the map if you get lost, there are more things to explore so feel free to ask other players and on discord if you have any questions! Thanks for joining us, Have fun exploring!", coords: [2602, 42, 930]},
    { msg: "§aend", coords: [2602, 42, 930], teleport: true }
];

function getStopPosition(stop) {
    if (stop.path) return stop.path[stop.path.length - 1];
    if (stop.coords) return stop.coords;
    return null;
}

function recoverStepFromPosition(npc) {
    var nx = npc.getX();
    var ny = npc.getY();
    var nz = npc.getZ();

    var bestStep = -1;
    var bestDist = 999999;

    for (var i = 0; i < tourStops.length; i++) {
        var pos = getStopPosition(tourStops[i]);
        if (!pos) continue;

        var dx = nx - pos[0];
        var dy = ny - pos[1];
        var dz = nz - pos[2];
        var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < bestDist) {
            bestDist = dist;
            bestStep = i;
        }
    }

    if (bestStep >= 0 && bestDist < 15) {
        return bestStep + 1;
    }

    return -1;
}

function interact(e) {
    var npc = e.npc;
    var player = e.player;
    var uuid = player.getUUID();

    // --- World-restart position recovery ---
    if (currentTourStep === 0 && !isMoving) {
        var spawnX = 2325, spawnY = -48, spawnZ = 855;
        var sdx = npc.getX() - spawnX;
        var sdy = npc.getY() - spawnY;
        var sdz = npc.getZ() - spawnZ;
        var spawnDist = Math.sqrt(sdx * sdx + sdy * sdy + sdz * sdz);

        if (spawnDist > 20) {
            var recovered = recoverStepFromPosition(npc);
            if (recovered > 0 && recovered < tourStops.length) {
                currentTourStep = recovered;
                player.message("§e[Tour Guide] Resuming tour from where I left off...");
            }
        }
    }

    // --- Early-step reset logic ---
    // A different player clicking before LOCKED_IN_STEP resets the tour for them.
    if (currentTourStep < LOCKED_IN_STEP && currentLeaderUUID !== null && currentLeaderUUID !== uuid) {
        currentTourStep = 0;
        isMoving = false;
        pathProgress = 0;
        currentLeaderUUID = null;
        player.message("§a[Tour Guide] Starting a fresh tour for you!");
    }

    if (currentLeaderUUID === null) {
        currentLeaderUUID = uuid;
    }

    // Block interaction if NPC is still moving
    if (isMoving) {
        player.message("§c[Tour Guide] Please wait, I'm still moving to the next location!");
        return;
    }

    // Progress to next step
    if (currentTourStep < tourStops.length) {
        var stop = tourStops[currentTourStep];
        npc.say(stop.msg);

        // --- Qualify the clicking player at step 3 ---
        // Only the player who clicks to trigger step 3 gets qualified.
        // Only applies if they actually have the tourQualified key (new players only).
        if (currentTourStep === QUALIFY_STEP) {
            var existing = player.storeddata.get(TOUR_QUALIFIED_KEY);
            if (existing !== null && existing !== undefined) {
                player.storeddata.put(TOUR_QUALIFIED_KEY, 1);
            }
        }

        if (stop.coords || stop.path) {
            if (stop.teleport) {
                var target = stop.coords ? stop.coords : stop.path[stop.path.length - 1];
                npc.setPosition(target[0], target[1], target[2]);
                isMoving = false;

                if (currentTourStep === tourStops.length - 1) {
                    npc.despawn();
                    currentTourStep = 0;
                    currentLeaderUUID = null;
                    return;
                }
            } else if (stop.coords) {
                npc.navigateTo(stop.coords[0], stop.coords[1], stop.coords[2], 7);
                isMoving = true;
            } else if (stop.path) {
                pathProgress = 0;
                var wp = stop.path[pathProgress];
                npc.navigateTo(wp[0], wp[1], wp[2], 7);
                isMoving = true;
            }
        }

        currentTourStep++;
    }
}

function tick(e) {
    var npc = e.npc;

    if (!isMoving) return;

    var step = currentTourStep - 1;
    if (step < 0 || step >= tourStops.length) return;

    var stop = tourStops[step];
    if (!stop) return;

    if (stop.path) {
        if (pathProgress >= stop.path.length) {
            isMoving = false;
            return;
        }

        var wp = stop.path[pathProgress];
        var dx = npc.getX() - wp[0];
        var dy = npc.getY() - wp[1];
        var dz = npc.getZ() - wp[2];
        var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 2) {
            pathProgress++;
            if (pathProgress < stop.path.length) {
                var nextWp = stop.path[pathProgress];
                npc.navigateTo(nextWp[0], nextWp[1], nextWp[2], 7);
            } else {
                isMoving = false;
            }
        } else if (!npc.isNavigating()) {
            npc.navigateTo(wp[0], wp[1], wp[2], 7);
        }
    }

    if (stop.coords && !stop.path && !stop.teleport) {
        var dx2 = npc.getX() - stop.coords[0];
        var dy2 = npc.getY() - stop.coords[1];
        var dz2 = npc.getZ() - stop.coords[2];
        var dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2 + dz2 * dz2);

        if (dist2 < 2) {
            isMoving = false;
        } else if (!npc.isNavigating()) {
            npc.navigateTo(stop.coords[0], stop.coords[1], stop.coords[2], 7);
        }
    }
}
