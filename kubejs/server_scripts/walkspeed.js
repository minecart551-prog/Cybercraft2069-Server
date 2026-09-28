const MIN_SPEED = 0;
const MAX_SPEED = 0.13;      // raised so /walk can still reach the new default
const DEFAULT_SPEED = 0.13; // 1.2x vanilla (0.1)

// Apply the new default once per player (new joins AND existing players on their next login)
PlayerEvents.loggedIn(function(event) {
  var player = event.player;
  if (player.persistentData.getBoolean("walkSpeedInit")) return;

  player.server.runCommand('attribute ' + player.username + ' minecraft:generic.movement_speed base set ' + DEFAULT_SPEED);
  player.persistentData.putBoolean("walkSpeedInit", true);
});

ServerEvents.commandRegistry(function(event) {
  var Commands = event.commands;
  var Arguments = event.arguments;

  event.register(
    Commands.literal("walk")
      .executes(function(ctx) {
        var player = ctx.source.player;
        if (!player) return 0;
        player.tell("§eUsage: /walk <0-0.12> or /walk clear");
        return 1;
      })
      .then(
        Commands.literal("clear")
          .executes(function(ctx) {
            var player = ctx.source.player;
            if (!player) return 0;
            player.server.runCommand('attribute ' + player.username + ' minecraft:generic.movement_speed base set ' + DEFAULT_SPEED);
            player.tell("§aWalk speed reset to default");
            return 1;
          })
      )
      .then(
        Commands.argument("speed", Arguments.DOUBLE.create(event))
          .executes(function(ctx) {
            var player = ctx.source.player;
            if (!player) return 0;
            var speed = Arguments.DOUBLE.getResult(ctx, "speed");
            speed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, speed));
            player.server.runCommand('attribute ' + player.username + ' minecraft:generic.movement_speed base set ' + speed);
            player.tell("§aWalk speed set to §e" + speed);
            return 1;
          })
      )
  );
});