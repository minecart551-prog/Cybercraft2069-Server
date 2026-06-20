// ===============================================================
// Access NPC - manages door allowlist
// ===============================================================

var GUI_ACCESS = 9002;
var LBL_TITLE  = 1;
var LBL_HINT   = 2;
var TF_NAMES   = 10;
var BTN_SAVE   = 20;   // was 1, clashed with LBL_TITLE

var pendingNpc = null;

function init(e) {
    e.npc.getDisplay().setName("§eAccess");
    e.npc.getAi().setRetaliateType(0);
}

function interact(e) {
    pendingNpc = e.npc;
    var player = e.player;
    var api    = e.API;

    var stored = "";
    try {
        var raw = pendingNpc.getStoreddata().get("allowlist");
        if (raw) stored = String(raw);
    } catch (err) {}

    var gui = api.createCustomGui(GUI_ACCESS, 300, 130, false, player);
    gui.addLabel(LBL_TITLE, "§6§lDoor Access List",               15, 12, 200, 14);
    gui.addLabel(LBL_HINT,  "§7Allowed names (comma separated):", 15, 30, 270, 10);
    gui.addTextField(TF_NAMES, 15, 44, 270, 14).setText(stored);
    gui.addButton(BTN_SAVE, "§aSave", 15, 64, 270, 18);

    player.showCustomGui(gui);
}

function customGuiButton(e) {
    if (e.gui.getID() !== GUI_ACCESS) return;
    if (e.buttonId !== BTN_SAVE) return;
    if (!pendingNpc) return;

    var player = e.player;
    var names  = "";

    try {
        var tf = e.gui.getComponent(TF_NAMES);
        if (tf) names = tf.getText();
    } catch (err) {}

    pendingNpc.getStoreddata().put("allowlist", names);
    player.message("§aAccess list saved: §e" + (names.trim() === "" ? "(empty)" : names));
}

function customGuiClosed(e) {
    if (e.gui.getID() !== GUI_ACCESS) return;
    pendingNpc = null;
}
