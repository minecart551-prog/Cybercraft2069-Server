// ============================================================
// UNSTUCK POINTS — paste F3 coords here: [x, y, z]
// ============================================================
const UNSTUCK_POINTS = [
  [1556, 84, 7943 ],
  [1907, -49, 2119],
  [1907, -49, 2180],
  [1812, -49, 2180],
  [1812, -49, 2119],
  [2647, -50, -379],
  [2649, -51, -203],
  [2652, -51, -9],
  [2653, -51, 185],
  [2652, -51, 383],
  [2649, -51, 577],
  [2648, -51, 769],
  [2648, -51, 958],
  [2649, -51, 1154],
  [2649, -51, 1342],
  [2649, -51, 1537],
  [2650, -51, 1731],
  [2650, -51, 1930],
  [2616, -51, 2120],
  [2388, -51, 2099],
  [2387, -49, 1889],
  [2388, -51, 1694],
  [2387, -51, 1504],
  [2388, -51, 1306],
  [2387, -51, 1119],
  [2387, -49, 922],
  [2389, -51, 736],
  [2391, -51, 543],
  [2390, -51, 347],
  [2389, -51, 155],
  [2389, -51, -40],
  [2389, -51, -234],
  [2389, -51, -422],
  [2095, -51, -409],
  [2115, -51, -205],
  [2115, -51, -10],
  [2116, -51, 184],
  [2117, -51, 379],
  [2116, -51, 572],
  [2118, -51, 766],
  [2118, -51, 957],
  [2114, -51, 1155],
  [2113, -51, 1342],
  [2116, -51, 1538],
  [2116, -51, 1731],
  [2114, -51, 1932],
  [2119, -51, 2117],
  [2385, -51, -535],
  [2233, -51, -619],
  [2179, -51, -804],
  [2271, -51, -934],
  [2438, -51, -963],
  [2576, -51, -850],
  [2584, -51, -663],
  [2055, -40, -634],
  [1974, -50, -795],
  [1955, -45, -959],
  [1659, -41, -957],
  [1305, -41, -891],
  [1179, -41, -755],
  [1061, -41, -595],
  [1031, -41, -382],
  [1040, -40, -152],
  [1267, -40, -106],
  [1422, -41, -55],
  [1504, -40, -214],
  [1344, -41, -291],
  [1187, -46, -380],
  [1286, -46, -494],
  [1345, -46, -590],
  [1117, -41, -920],
  [866,  -40, -250],
  [1754, -49, -230],
  [3013, -55, 1000],
  [2988, -49, 1652],
  [2422,  43, 845],
  [2313, -48, 845],
  [2548,  43, 823],
];
// ============================================================
const COOLDOWN_SECONDS = 120; // 5 minutes
const TELEPORT_DELAY = 6; // seconds to wait before teleporting
const MOVEMENT_THRESHOLD = 0.1; // blocks moved to trigger cancel

const cooldowns = {};
const teleportQueue = {}; // Stores: {uuid: {destination, startPos, startTime, tickCounter}}

function getDist(px, pz, point) {
  const dx = px - Number(point[0]);
  const dz = pz - Number(point[2]);
  return dx*dx + dz*dz;
}

function getClosest(px, pz) {
  let best = UNSTUCK_POINTS[0];
  let bestDist = getDist(px, pz, best);
  let i = 1;
  function check() {
    if (i >= UNSTUCK_POINTS.length) return;
    const d = getDist(px, pz, UNSTUCK_POINTS[i]);
    if (d < bestDist) {
      bestDist = d;
      best = UNSTUCK_POINTS[i];
    }
    i++;
    check();
  }
  check();
  return best;
}

// Check every tick if players have moved or if teleport time is reached
ServerEvents.tick(function(event) {
  // Iterate through all players on the server
  event.server.getPlayerList().getPlayers().forEach(function(player) {
    const uuid = player.uuid.toString();
    
    if (!teleportQueue[uuid]) {
      return; // Player not in queue
    }
    
    const queue = teleportQueue[uuid];
    const currentPos = {x: player.getX(), y: player.getY(), z: player.getZ()};
    const startPos = queue.startPos;
    
    // Check if player moved beyond threshold
    const distMoved = Math.sqrt(
      Math.pow(currentPos.x - startPos.x, 2) + 
      Math.pow(currentPos.y - startPos.y, 2) + 
      Math.pow(currentPos.z - startPos.z, 2)
    );
    
    if (distMoved > MOVEMENT_THRESHOLD) {
      player.tell("§cTeleportation cancelled! You moved.");
      delete teleportQueue[uuid];
      return;
    }
    
    queue.tickCounter++;
    const secondsRemaining = TELEPORT_DELAY - Math.floor(queue.tickCounter / 20);
    
    // Send message every second
    if (queue.tickCounter % 20 === 0 && secondsRemaining > 0) {
      player.tell("§eStay still... teleporting in §c" + secondsRemaining + "s");
    }
    
    // Time to teleport
    if (queue.tickCounter >= TELEPORT_DELAY * 20) {
      const dest = queue.destination;
      player.teleportTo("minecraft:overworld", dest[0], dest[1], dest[2], 0, 0);
      player.tell("§aTeleported! Cooldown: §e" + (COOLDOWN_SECONDS / 60) + " min");
      cooldowns[uuid] = Date.now(); // Set cooldown only on successful teleport
      delete teleportQueue[uuid];
    }
  });
});

ServerEvents.commandRegistry(function(event) {
  const Commands = event.commands;
  event.register(
    Commands.literal("unstuckme")
      .executes(function(ctx) {
        const player = ctx.source.player;
        if (!player) return 0;
        
        const uuid = player.uuid.toString();
        const now = Date.now();
        
        // Check cooldown
        if (cooldowns[uuid]) {
          const elapsed = (now - cooldowns[uuid]) / 1000;
          if (elapsed < COOLDOWN_SECONDS) {
            const remaining = Math.ceil(COOLDOWN_SECONDS - elapsed);
            player.tell("§cYou must wait §e" + remaining + "s §cbefore using /unstuck again.");
            return 0;
          }
        }
        
        // Check if already queued for teleport
        if (teleportQueue[uuid]) {
          player.tell("§cYou are already queued for teleportation!");
          return 0;
        }
        
        const px = Number(player.getX());
        const pz = Number(player.getZ());
        const dest = getClosest(px, pz);
        
        // Add to teleport queue
        teleportQueue[uuid] = {
          destination: dest,
          startPos: {x: player.getX(), y: player.getY(), z: player.getZ()},
          startTime: Date.now(),
          tickCounter: 0
        };
        
        player.tell("§eStay still... teleporting in §c" + TELEPORT_DELAY + "s");
        
        return 1;
      })
  );
});