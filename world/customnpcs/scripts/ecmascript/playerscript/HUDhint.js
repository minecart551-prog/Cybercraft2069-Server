// ============================================================================
// HUD HINT — PLAYER SCRIPT
// ============================================================================
// Shows a small persistent hint on the player's screen.
// Requires bombteam_config.js loaded FIRST (for OVERLAY_HUD).
// ============================================================================

var OVERLAY_HINT = 2
var hintTimerId  = 69423

function init(event) {
    event.player.getTimers().forceStart(hintTimerId, 20, true)
}

function timer(event) {
    if (event.id !== hintTimerId) return
    var player = event.player; var api = event.API
    var overlay = api.createOverlay(OVERLAY_HINT)
    overlay.addLabel(1, "\u00a7b.menu\u00a7f to open menu", -157, 80)
    player.showOverlay(overlay)
}
