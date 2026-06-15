var timerID = 20;
var speed = 0.3;

function init(event) {
    event.npc.ai.stopOnInteract = false;
    event.npc.ai.returnsHome = false;
}

function interact(event) {
    var npc = event.npc;
    npc.addRider(event.player);
    npc.timers.stop(timerID);
    npc.timers.start(timerID, 1, true);
}

function timer(event) {
    var npc = event.npc;
    var riders = npc.getRiders();

    if (riders.length === 0) {
        npc.setMotionY(0);
        npc.timers.stop(timerID);
        return;
    }

    var player = riders[0];
    var handItem = player.getMainhandItem();
    var isEmpty = !handItem || handItem.isEmpty();

    npc.setMotionY(isEmpty ? speed : -speed);
}