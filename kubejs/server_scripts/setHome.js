// KubeJS Server Script
// Place in: kubejs/server_scripts/home_commands.js

// =============================================================================
// CONFIGURATION
// =============================================================================

const BLOCKED_ITEMS = [
  "minecraft:sugar",
  "yuushya:package_0",
];

// How many times a player can use /home per server session (resets on restart)
const MAX_HOME_USES = 2;


const HOME_KEY = "kubejs_home";

const homeQueue = {};
const homeUses = {}; // tracks uses this session only, not persistent

// =============================================================================
// HELPERS
// =============================================================================

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

function saveHome(player) {
  var data = JSON.stringify({
    x: player.getX(),
    y: player.getY(),
    z: player.getZ(),
    dim: player.level.dimension.toString()
  });
  player.persistentData.putString(HOME_KEY, data);
}

function loadHome(player) {
  var raw = player.persistentData.getString(HOME_KEY);
  if (!raw || raw === "") return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function getUses(player) {
  var uuid = player.uuid.toString();
  return homeUses[uuid] || 0;
}

function incrementUses(player) {
  var uuid = player.uuid.toString();
  homeUses[uuid] = (homeUses[uuid] || 0) + 1;
}

// =============================================================================
// TICK
// =============================================================================

ServerEvents.tick(function(event) {
  event.server.getPlayerList().getPlayers().forEach(function(player) {
    var uuid = player.uuid.toString();
    if (!homeQueue[uuid]) return;

    var queue = homeQueue[uuid];
    var startPos = queue.startPos;

    var distMoved = Math.sqrt(
      Math.pow(player.getX() - startPos.x, 2) +
      Math.pow(player.getY() - startPos.y, 2) +
      Math.pow(player.getZ() - startPos.z, 2)
    );

    if (distMoved > MOVEMENT_THRESHOLD) {
      player.tell("§cTeleportation cancelled! You moved.");
      delete homeQueue[uuid];
      return;
    }

    var blockedItem = findBlockedItem(player);
    if (blockedItem) {
      player.tell("§cTeleportation cancelled! You are carrying §e" + formatItemName(blockedItem) + "§c.");
      delete homeQueue[uuid];
      return;
    }

    queue.tickCounter++;

    if (queue.tickCounter % 20 === 0 && queue.tickCounter < TELEPORT_DELAY * 20) {
      var secondsRemaining = TELEPORT_DELAY - Math.floor(queue.tickCounter / 20);
      player.tell("§eStay still... teleporting home in §c" + secondsRemaining + "s");
    }

    if (queue.tickCounter >= TELEPORT_DELAY * 20) {
      var home = loadHome(player);
      if (!home) {
        player.tell("§cHome data was lost, please §e/sethome §cagain.");
        delete homeQueue[uuid];
        return;
      }

      player.teleportTo(home.dim, home.x, home.y, home.z, 0, 0);
      incrementUses(player);

      var usesLeft = MAX_HOME_USES - getUses(player);
      if (usesLeft <= 0) {
        player.tell("§a✔ Teleported home! §cThat was your last use — §e/home §cis now disabled until restart.");
      } else {
        player.tell(
          "§a✔ Teleported home! §7(" +
          Math.round(home.x) + ", " +
          Math.round(home.y) + ", " +
          Math.round(home.z) +
          ") §7Uses left: §e" + usesLeft
        );
      }

      delete homeQueue[uuid];
    }
  });
});

// =============================================================================
// COMMANDS
// =============================================================================

ServerEvents.commandRegistry(function(event) {
  var Commands = event.commands;

  event.register(
    Commands.literal("sethome")
      .executes(function(ctx) {
        var player = ctx.source.player;
        if (!player) return 0;

        saveHome(player);

        player.tell(
          "§a✔ Home set at §e" +
          Math.round(player.getX()) + ", " +
          Math.round(player.getY()) + ", " +
          Math.round(player.getZ()) +
          "§a in §e" + player.level.dimension + "§a!"
        );
        return 1;
      })
  );

  event.register(
    Commands.literal("home")
      .executes(function(ctx) {
        var player = ctx.source.player;
        if (!player) return 0;

        var uuid = player.uuid.toString();

        if (homeQueue[uuid]) {
          player.tell("§cYou are already queuing for home teleport!");
          return 0;
        }

        var uses = getUses(player);
        if (uses >= MAX_HOME_USES) {
          player.tell("§cYou have used all §e" + MAX_HOME_USES + "§c /home uses for this session. Resets on server restart.");
          return 0;
        }

        var home = loadHome(player);
        if (!home) {
          player.tell("§cYou haven't set a home yet! Use §e/sethome §cfirst.");
          return 0;
        }

        var blockedItem = findBlockedItem(player);
        if (blockedItem) {
          player.tell("§cYou cannot teleport while carrying §e" + formatItemName(blockedItem) + "§c!");
          return 0;
        }

        homeQueue[uuid] = {
          startPos: { x: player.getX(), y: player.getY(), z: player.getZ() },
          tickCounter: 0
        };

        var usesLeft = MAX_HOME_USES - uses;
        player.tell("§eStay still... teleporting home in §c" + TELEPORT_DELAY + "s §7(§e" + usesLeft + "§7 use(s) left)");
        return 1;
      })
  );
});
