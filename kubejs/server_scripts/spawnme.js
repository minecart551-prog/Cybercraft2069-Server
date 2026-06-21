const SPAWN_POINT = [2332, -46, 848];
const MAX_USES = 3;
const spawnQueue = {};

ServerEvents.tick(function(event) {
  event.server.getPlayerList().getPlayers().forEach(function(player) {
    const uuid = player.uuid.toString();

    if (!spawnQueue[uuid]) return;

    const queue = spawnQueue[uuid];
    const currentPos = { x: player.getX(), y: player.getY(), z: player.getZ() };
    const startPos = queue.startPos;

    const distMoved = Math.sqrt(
      Math.pow(currentPos.x - startPos.x, 2) +
      Math.pow(currentPos.y - startPos.y, 2) +
      Math.pow(currentPos.z - startPos.z, 2)
    );

    if (distMoved > MOVEMENT_THRESHOLD) {
      player.tell("§cTeleportation cancelled! You moved.");
      delete spawnQueue[uuid];
      return;
    }

    queue.tickCounter++;
    const secondsRemaining = TELEPORT_DELAY - Math.floor(queue.tickCounter / 20);

    if (queue.tickCounter % 20 === 0 && secondsRemaining > 0) {
      player.tell("§eStay still... teleporting to spawn in §c" + secondsRemaining + "s");
    }

    if (queue.tickCounter >= TELEPORT_DELAY * 20) {
      player.teleportTo("minecraft:overworld", SPAWN_POINT[0], SPAWN_POINT[1], SPAWN_POINT[2], 0, 0);

      const newUses = player.persistentData.getInt("spawnme_uses") + 1;
      player.persistentData.putInt("spawnme_uses", newUses);
      const usesLeft = MAX_USES - newUses;

      if (usesLeft <= 0) {
        player.tell("§aTeleported to spawn! §cThat was your last use — /spawnme is now disabled for you.");
      } else {
        player.tell("§aTeleported to spawn! §7Uses remaining: §e" + usesLeft);
      }

      delete spawnQueue[uuid];
    }
  });
});

ServerEvents.commandRegistry(function(event) {
  const Commands = event.commands;
  event.register(
    Commands.literal("spawnme")
      .executes(function(ctx) {
        const player = ctx.source.player;
        if (!player) return 0;

        const uuid = player.uuid.toString();
        const uses = player.persistentData.getInt("spawnme_uses");

        if (uses >= MAX_USES) {
          player.tell("§cYou have used all " + MAX_USES + " of your /spawnme uses.");
          return 0;
        }

        if (spawnQueue[uuid]) {
          player.tell("§cYou are already queued for teleportation!");
          return 0;
        }

        const usesLeft = MAX_USES - uses;
        spawnQueue[uuid] = {
          startPos: { x: player.getX(), y: player.getY(), z: player.getZ() },
          tickCounter: 0
        };

        player.tell("§eStay still... teleporting to spawn in §c" + TELEPORT_DELAY + "s §7(§e" + usesLeft + "§7 use(s) left)");
        return 1;
      })
  );
});