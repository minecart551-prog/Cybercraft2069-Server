// KubeJS Server Script
// Place in: kubejs/server_scripts/tpme_command.js

// =============================================================================
// CONFIGURATION
// =============================================================================

// Players allowed to use /tpme (by username)
const ALLOWED_PLAYERS = [
  "cccneon",
  "BerryGoodBox",
  // Add more usernames here
];

// Items that block teleportation

// Restricted coordinate zones — teleporting TO or FROM inside these boxes is blocked.
// Each entry: { dim, x1, y1, z1, x2, y2, z2, name }
// Use the dimension string e.g. "minecraft:overworld", "minecraft:the_nether", "minecraft:the_end"
// x1/y1/z1 = one corner, x2/y2/z2 = opposite corner (order doesn't matter)
const RESTRICTED_ZONES = [
  {
    name: "SugarBuilding1",
    dim: "minecraft:overworld",
    x1: 2005, y1: -53,  z1: 117,  
    x2:  2042, y2: -14, z2:  87, 
  },
  {
    name: "SugarBuilding2",
    dim: "minecraft:overworld",
    x1: 1968, y1: -55,  z1: -171,  
    x2:  1934, y2: -15, z2:  -198, 
  },
  {
    name: "SugarBuilding3",
    dim: "minecraft:overworld",
    x1: 948, y1: -44,  z1: -318,  
    x2:  967, y2: 7, z2:  -274, 
  },
];


// =============================================================================
// STATE
// =============================================================================

const tpmeQueue = {};

// =============================================================================
// HELPERS
// =============================================================================

function isAllowed(player) {
  var name = player.username;
  for (var i = 0; i < ALLOWED_PLAYERS.length; i++) {
    if (ALLOWED_PLAYERS[i] === name) return true;
  }
  return false;
}

function findBlockedItem(player) {
  for (var i = 0; i < BLOCKED_ITEMS.length; i++) {
    var itemId = BLOCKED_ITEMS[i];
    if (player.inventory.contains(Item.of(itemId))) {
      return itemId;
    }
  }
  return null;
}

function formatItemName(itemId) {
  return itemId
    .split(":")[1]
    .replace(/_/g, " ")
    .replace(/\b\w/g, function(c) { return c.toUpperCase(); });
}

function isInZone(zone, dim, x, y, z) {
  if (zone.dim !== dim) return false;
  var minX = Math.min(zone.x1, zone.x2);
  var maxX = Math.max(zone.x1, zone.x2);
  var minY = Math.min(zone.y1, zone.y2);
  var maxY = Math.max(zone.y1, zone.y2);
  var minZ = Math.min(zone.z1, zone.z2);
  var maxZ = Math.max(zone.z1, zone.z2);
  return x >= minX && x <= maxX &&
         y >= minY && y <= maxY &&
         z >= minZ && z <= maxZ;
}

// Returns the name of the first restricted zone that blocks this teleport, or null
function findRestrictedZone(fromDim, fromX, fromY, fromZ, toDim, toX, toY, toZ) {
  for (var i = 0; i < RESTRICTED_ZONES.length; i++) {
    var zone = RESTRICTED_ZONES[i];
    if (isInZone(zone, fromDim, fromX, fromY, fromZ)) return zone.name + " (your location)";
    if (isInZone(zone, toDim,   toX,   toY,   toZ))   return zone.name + " (destination)";
  }
  return null;
}

function getPlayerByName(server, name) {
  var found = null;
  server.getPlayerList().getPlayers().forEach(function(p) {
    if (p.username === name) found = p;
  });
  return found;
}

// =============================================================================
// TICK — process queued teleports
// =============================================================================

ServerEvents.tick(function(event) {
  event.server.getPlayerList().getPlayers().forEach(function(player) {
    var uuid = player.uuid.toString();
    if (!tpmeQueue[uuid]) return;

    var queue = tpmeQueue[uuid];
    var startPos = queue.startPos;

    // Movement check
    var distMoved = Math.sqrt(
      Math.pow(player.getX() - startPos.x, 2) +
      Math.pow(player.getY() - startPos.y, 2) +
      Math.pow(player.getZ() - startPos.z, 2)
    );
    if (distMoved > MOVEMENT_THRESHOLD) {
      player.tell("§cTeleportation cancelled! You moved.");
      delete tpmeQueue[uuid];
      return;
    }

    // Blocked item check
    var blockedItem = findBlockedItem(player);
    if (blockedItem) {
      player.tell("§cTeleportation cancelled! You are carrying §e" + formatItemName(blockedItem) + "§c.");
      delete tpmeQueue[uuid];
      return;
    }

    queue.tickCounter++;

    // Countdown messages
    if (queue.tickCounter % 20 === 0 && queue.tickCounter < TELEPORT_DELAY * 20) {
      var secondsRemaining = TELEPORT_DELAY - Math.floor(queue.tickCounter / 20);
      player.tell("§eStay still... teleporting in §c" + secondsRemaining + "s");
    }

    // Fire teleport
    if (queue.tickCounter >= TELEPORT_DELAY * 20) {
      var dest = queue.destination;

      // Re-check origin restriction at fire time (player's current dim may differ if they cheated)
      var fromDim = player.level.dimension.toString();
      var zoneBlocked = findRestrictedZone(
        fromDim, player.getX(), player.getY(), player.getZ(),
        dest.dim, dest.x, dest.y, dest.z
      );
      if (zoneBlocked) {
        player.tell("§cTeleportation cancelled! Restricted zone: §e" + zoneBlocked + "§c.");
        delete tpmeQueue[uuid];
        return;
      }

      // If target was a player, resolve their current position now
      if (dest.targetPlayerName) {
        var target = getPlayerByName(event.server, dest.targetPlayerName);
        if (!target) {
          player.tell("§cTeleportation cancelled! §e" + dest.targetPlayerName + " §cwent offline.");
          delete tpmeQueue[uuid];
          return;
        }
        dest.dim = target.level.dimension.toString();
        dest.x   = target.getX();
        dest.y   = target.getY();
        dest.z   = target.getZ();

        // Re-check zone with fresh target position
        zoneBlocked = findRestrictedZone(
          fromDim, player.getX(), player.getY(), player.getZ(),
          dest.dim, dest.x, dest.y, dest.z
        );
        if (zoneBlocked) {
          player.tell("§cTeleportation cancelled! Restricted zone: §e" + zoneBlocked + "§c.");
          delete tpmeQueue[uuid];
          return;
        }
      }

      player.teleportTo(dest.dim, dest.x, dest.y, dest.z, 0, 0);

      if (dest.targetPlayerName) {
        player.tell(
          "§a✔ Teleported to §e" + dest.targetPlayerName +
          " §7(" + Math.round(dest.x) + ", " + Math.round(dest.y) + ", " + Math.round(dest.z) + ")"
        );
      } else {
        player.tell(
          "§a✔ Teleported to §7(" +
          Math.round(dest.x) + ", " +
          Math.round(dest.y) + ", " +
          Math.round(dest.z) + ")"
        );
      }

      delete tpmeQueue[uuid];
    }
  });
});

// =============================================================================
// COMMAND REGISTRATION
// =============================================================================

ServerEvents.commandRegistry(function(event) {
  var Commands  = event.commands;
  var Arguments = event.arguments;

  // Shared logic to kick off a queued teleport
  function startTpme(player, dest) {
    if (!isAllowed(player)) {
      player.tell("§cYou do not have permission to use §e/tpme§c.");
      return 0;
    }

    var uuid = player.uuid.toString();
    if (tpmeQueue[uuid]) {
      player.tell("§cYou are already queuing for a teleport!");
      return 0;
    }

    var blockedItem = findBlockedItem(player);
    if (blockedItem) {
      player.tell("§cYou cannot teleport while carrying §e" + formatItemName(blockedItem) + "§c!");
      return 0;
    }

    var fromDim = player.level.dimension.toString();
    var zoneBlocked = findRestrictedZone(
      fromDim, player.getX(), player.getY(), player.getZ(),
      dest.dim, dest.x, dest.y, dest.z
    );
    if (zoneBlocked) {
      player.tell("§cCannot teleport — restricted zone: §e" + zoneBlocked + "§c.");
      return 0;
    }

    tpmeQueue[uuid] = {
      startPos:    { x: player.getX(), y: player.getY(), z: player.getZ() },
      tickCounter: 0,
      destination: dest,
    };

    if (dest.targetPlayerName) {
      player.tell("§eStay still... teleporting to §b" + dest.targetPlayerName + " §ein §c" + TELEPORT_DELAY + "s");
    } else {
      player.tell(
        "§eStay still... teleporting to §7(" +
        Math.round(dest.x) + ", " + Math.round(dest.y) + ", " + Math.round(dest.z) +
        ") §ein §c" + TELEPORT_DELAY + "s"
      );
    }
    return 1;
  }

  event.register(
    Commands.literal("tpme")

      // /tpme <x> <y> <z>  — teleport to coordinates (in current dimension)
      .then(
        Commands.argument("x", Arguments.DOUBLE.create(event))
          .then(
            Commands.argument("y", Arguments.DOUBLE.create(event))
              .then(
                Commands.argument("z", Arguments.DOUBLE.create(event))
                  .executes(function(ctx) {
                    var player = ctx.source.player;
                    if (!player) return 0;

                    var x = Arguments.DOUBLE.getResult(ctx, "x");
                    var y = Arguments.DOUBLE.getResult(ctx, "y");
                    var z = Arguments.DOUBLE.getResult(ctx, "z");

                    return startTpme(player, {
                      dim: player.level.dimension.toString(),
                      x: x, y: y, z: z,
                      targetPlayerName: null,
                    });
                  })
              )
          )
      )

      // /tpme <playername>  — teleport to an online player
      .then(
        Commands.argument("playername", Arguments.STRING.create(event))
          .executes(function(ctx) {
            var player = ctx.source.player;
            if (!player) return 0;

            var targetName = Arguments.STRING.getResult(ctx, "playername");

            if (targetName === player.username) {
              player.tell("§cYou can't teleport to yourself!");
              return 0;
            }

            var target = getPlayerByName(ctx.source.server, targetName);
            if (!target) {
              player.tell("§cPlayer §e" + targetName + " §cis not online.");
              return 0;
            }

            return startTpme(player, {
              dim: target.level.dimension.toString(),
              x: target.getX(),
              y: target.getY(),
              z: target.getZ(),
              targetPlayerName: targetName,
            });
          })
      )
  );
});