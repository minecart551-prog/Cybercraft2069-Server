const MIN_SPEED = 0;
const MAX_SPEED = 0.13;
const DEFAULT_SPEED = 0.13;

const ATTRIBUTE_ID = 'minecraft:generic.movement_speed';

const INIT_FLAG = "walkSpeedInit_v5";

function applyDefaultSpeed(player) {
  var attr = player.getAttribute(ATTRIBUTE_ID);
  if (!attr) return;
  attr.setBaseValue(DEFAULT_SPEED);
}

PlayerEvents.loggedIn(function(event) {
  var player = event.player;
  applyDefaultSpeed(player);
  player.persistentData.putBoolean(INIT_FLAG, true);
});

ServerEvents.commandRegistry(function(event) {
  var Commands = event.commands;
  var Arguments = event.arguments;

  event.register(
    Commands.literal("walk")
      .executes(function(ctx) {
        var player = ctx.source.player;
        if (!player) return 0;
        player.tell("§eUsage: /walk <0-0.13> or /walk clear");
        return 1;
      })
      .then(
        Commands.literal("clear")
          .executes(function(ctx) {
            var player = ctx.source.player;
            if (!player) return 0;
            applyDefaultSpeed(player);
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
            var attr = player.getAttribute(ATTRIBUTE_ID);
            attr.setBaseValue(speed);
            player.tell("§aWalk speed set to §e" + speed);
            return 1;
          })
      )
  );
});