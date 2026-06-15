// --- Bounty Manager Block Script ---
// Allows admins to view and clear active contracts for any player

// ID MAP (all unique, no overlaps):
// Labels:  500=title, 501=player label, 502=active count, 503=empty msg, 504=overflow msg
// TextField: 600=search field
// Buttons: 700=search, 701=clear player, 702=close
// Row info labels: 800+row
// Row delete buttons: 900+row
// Hidden name labels: 1000+row

var guiRef = null;
var lastAPI = null;
var searchQuery = "";

function getContracts(wdata) {
    if (!wdata.has("allContracts")) return {};
    try {
        return JSON.parse(wdata.get("allContracts"));
    } catch (e) {
        return {};
    }
}

function saveContracts(wdata, contracts) {
    wdata.put("allContracts", JSON.stringify(contracts));
}

function interact(t) {
    var player = t.player;
    lastAPI = t.API;
    searchQuery = "";
    renderManagerGUI(player, lastAPI, t.block.world);
}

function renderManagerGUI(player, api, world) {
    var wdata = world.getStoreddata();
    var contracts = getContracts(wdata);

    // Build list of active contracts
    var activeList = [];
    for (var name in contracts) {
        activeList.push({ playerName: name, data: contracts[name] });
    }

    // Filter by search query
    var filteredList = activeList;
    if (searchQuery && searchQuery.length > 0) {
        var lowerQuery = searchQuery.toLowerCase();
        filteredList = [];
        for (var i = 0; i < activeList.length; i++) {
            if (activeList[i].playerName.toLowerCase().indexOf(lowerQuery) !== -1) {
                filteredList.push(activeList[i]);
            }
        }
    }

    guiRef = api.createCustomGui(320, 240, 0, false, player);

    guiRef.addLabel(500, "§l§nBounty Contract Manager", 10, -118, 1.0, 1.0);
    guiRef.addLabel(501, "§7Player Name:", 10, -100, 1.0, 1.0);
    guiRef.addTextField(600, 85, -100, 120, 18).setText(searchQuery);
    guiRef.addButton(700, "Search", 210, -100, 50, 18);
    guiRef.addButton(701, "Clear Player", 265, -100, 50, 18);
    guiRef.addLabel(502, "§8Active Contracts: §f" + activeList.length, 10, -78, 1.0, 1.0);

    if (filteredList.length == 0) {
        var emptyMsg = searchQuery
            ? "§7No active contract for '" + searchQuery + "'"
            : "§7No active contracts found";
        guiRef.addLabel(503, emptyMsg, 10, -60, 1.0, 1.0);
    } else {
        var yPos = -62;
        var displayLimit = Math.min(filteredList.length, 7);

        for (var j = 0; j < displayLimit; j++) {
            var entry = filteredList[j];
            var cd = entry.data;

            var infoText = "§e" + entry.playerName
                + " §7| §fRemaining: §c" + cd.remaining
                + " §7| §fAt: §b(" + cd.x + ", " + cd.y + ", " + cd.z + ")";

            guiRef.addButton(900 + j, "§cX", 10, yPos, 15, 15);
            guiRef.addLabel(800 + j, infoText, 30, yPos + 3, 0.65, 0.65);
            // Hidden label storing the player name for this row
            guiRef.addLabel(1000 + j, entry.playerName, -9999, -9999, 0.1, 0.1);

            yPos += 20;
        }

        if (filteredList.length > 7) {
            guiRef.addLabel(504, "§7... and " + (filteredList.length - 7) + " more (use search to narrow)", 10, yPos, 0.65, 0.65);
        }
    }

    guiRef.addButton(702, "Close", 255, 90, 50, 20);

    player.showCustomGui(guiRef);
}

function clearContractForPlayer(playerName, player, world) {
    var wdata = world.getStoreddata();
    var contracts = getContracts(wdata);

    if (contracts[playerName]) {
        delete contracts[playerName];
        saveContracts(wdata, contracts);
        player.message("§aCleared contract for: §f" + playerName);
    } else {
        player.message("§cNo active contract found for: §f" + playerName);
    }
}

function customGuiButton(t) {
    var player = t.player;
    var gui = t.gui;

    // Close
    if (t.buttonId == 702) {
        player.closeGui();
        guiRef = null;
        searchQuery = "";
        return;
    }

    // Search
    if (t.buttonId == 700) {
        if (gui) {
            var field = gui.getComponent(600);
            if (field) searchQuery = field.getText();
        }
        renderManagerGUI(player, lastAPI, player.world);
        return;
    }

    // Clear Player (by typed name)
    if (t.buttonId == 701) {
        var targetName = "";
        if (gui) {
            var field = gui.getComponent(600);
            if (field) targetName = field.getText().trim();
        }
        if (!targetName || targetName.length == 0) {
            player.message("§cEnter a player name first.");
            return;
        }
        clearContractForPlayer(targetName, player, player.world);
        searchQuery = "";
        renderManagerGUI(player, lastAPI, player.world);
        return;
    }

    // Row X delete buttons (900 to 906)
    if (t.buttonId >= 900 && t.buttonId < 910) {
        if (gui) {
            var field = gui.getComponent(600);
            if (field) searchQuery = field.getText();
        }
        var rowIndex = t.buttonId - 900;
        var labelComp = gui.getComponent(1000 + rowIndex);
        if (!labelComp) {
            player.message("§cCould not resolve player from row.");
            return;
        }
        var targetName = labelComp.getText();
        clearContractForPlayer(targetName, player, player.world);
        renderManagerGUI(player, lastAPI, player.world);
        return;
    }
}

function customGuiClosed(t) {
    guiRef = null;
    searchQuery = "";
}