let warningIssued = false;
let shutdownTickTarget = -1;
let nightForced = false;

ServerEvents.tick(event => {
    let server = event.server;

    if (server.tickCount % 3600 === 0) {
        server.runCommandSilent("save-all");
    }
    if (server.tickCount % 1200 === 0) {
        server.runCommandSilent("memcheck");
        try {
            let scoreboard = server.scoreboard;
            let objective = scoreboard.getObjective("allocated_pct");

            if (objective) {
                // Correct method: getOrCreatePlayerScore(playerName, objective)
                let allocatedPtc = scoreboard.getOrCreatePlayerScore("MEMDATA", objective).getScore();
                if (allocatedPtc >= 90 && !warningIssued) {
                    warningIssued = true;
                    shutdownTickTarget = server.tickCount + 1200;
                    server.runCommandSilent("say Server restarting in 1 minute, remove your ingredients from cooking equipments they will not be saved");
                }
            }
        } catch(e) {
        }
    }

    // Force night time to 13200 once when night starts to trigger serial killer announcements
    if (server.tickCount % 100 === 0) {
        let world = server.overworld();
        let time = world.getDayTime() % 24000;
        if (time >= 13000 && time <= 23000) {
            if (!nightForced) {
                nightForced = true;
                world.setDayTime(13200);
            }
        } else {
            nightForced = false;
        }
    }

if (shutdownTickTarget > 0) {
        let ticksLeft = shutdownTickTarget - server.tickCount;
        let secondsLeft = Math.ceil(ticksLeft / 20);

        if (secondsLeft <= 10 && ticksLeft % 20 === 0 && secondsLeft > 0) {
            server.runCommandSilent(`say Restarting in ${secondsLeft}s`);
        }

        if (server.tickCount >= shutdownTickTarget) {
            shutdownTickTarget = -1;
            server.runCommandSilent("save-all");
            server.runCommandSilent("stop");
        }
    }

});
