
// Auto restart every 5 hours + save-all every 5 minutes (KubeJS server script) 
// Put in: kubejs/server_scripts/auto_restart.js 
// Uses scheduled callbacks instead of checking every tick, so it costs ~nothing while idle.

const RESTART_INTERVAL_TICKS = 5 * 60 * 60 * 20; // 5 hours
const WARNING_TICKS = 60 * 20;                   // warn 1 minute before
const COUNTDOWN_FROM = 10;                       // count down the last 10 seconds
const SAVE_INTERVAL_TICKS = 5 * 60 * 20;         // save-all every 5 minutes

let restartStarted = false;

function autoSave(server) {
    // Stop saving once the 1 minute restart timer has started
    if (restartStarted) return;
    server.runCommandSilent("save-all");
    server.scheduleInTicks(SAVE_INTERVAL_TICKS, () => autoSave(server));
}

function countdown(server, secondsLeft) {
    if (secondsLeft <= 0) {
        server.runCommandSilent("stop");
        return;
    }
    server.runCommandSilent(`say Restarting in ${secondsLeft}s`);
    server.scheduleInTicks(20, () => countdown(server, secondsLeft - 1));
}

ServerEvents.loaded(event => {
    let server = event.server;
    restartStarted = false;

    // First autosave 5 minutes after startup, then every 5 minutes
    server.scheduleInTicks(SAVE_INTERVAL_TICKS, () => autoSave(server));

    // Fires once, 1 minute before the restart
    server.scheduleInTicks(RESTART_INTERVAL_TICKS - WARNING_TICKS, () => {
        restartStarted = true; // autosave stops from here on
        server.runCommandSilent("say Server restarting in 1 minute");

        // Wait until 10 seconds remain, then start the countdown
        server.scheduleInTicks(WARNING_TICKS - COUNTDOWN_FROM * 20, () => {
            countdown(server, COUNTDOWN_FROM);
        });
    });
});
