var skinAvail = 34;
var rewardItem = "coins:coal_coin";  
var rewardCount = 16;

function getContracts(wdata) {
    if (!wdata.has("allContracts")) {
        return {};
    }
    try {
        return JSON.parse(wdata.get("allContracts"));
    } catch (e) {
        return {};
    }
}

function saveContracts(wdata, contracts) {
    wdata.put("allContracts", JSON.stringify(contracts));
}

function init(e){
    var npc = e.npc;
    var item = npc.world.createItem(rewardItem, rewardCount);
    var display = npc.getDisplay();
    
    npc.getStats().setMaxHealth(400);
    npc.getStats().setRespawnType(3);
    npc.getStats().getRanged().setStrength(20);
    npc.getStats().getRanged().setAccuracy(70);
  //  npc.getStats().getRanged().setSpeed(10);
    npc.getInventory().setDropItem(1, item, 100);
         npc.getInventory().setExp(30,30);
    var isMale = Math.random() < 0.5;
    if (isMale) {
        var maleSkins = [];
        for (var i = 1; i <= skinAvail; i++) {
            var num = (i < 10 ? "0" + i : i);
            maleSkins.push("cyberpunkskins:textures/b/b" + num + ".png");
        } 
        display.setSkinTexture(randomFrom(maleSkins));    
    } else {
        var femaleSkins = [];
        for (var i = 1; i <= skinAvail; i++) {
            var num = (i < 10 ? "0" + i : i);
            femaleSkins.push("cyberpunkskins:textures/g/g" + num + ".png");   
        } 
        display.setSkinTexture(randomFrom(femaleSkins));  
    }
}

function died(event) {
    var npc = event.npc;
    var npcData = npc.getStoreddata();
    
    if (!npcData.has("owner")) {
        return;
    }
    
    var ownerName = npcData.get("owner");
    var wdata = npc.getWorld().getStoreddata();
    var contracts = getContracts(wdata);
    
    var killer = event.source;
    var killerName = null;
    if (killer && killer.getName) {
        killerName = killer.getName();
    }
    
    var isOwnerKill = (killerName === ownerName);
    
    if (contracts[ownerName]) {
        var contractData = contracts[ownerName];
        
        // Always decrease remaining, regardless of who killed it
        if (contractData.remaining > 0) {
            contractData.remaining = contractData.remaining - 1;
        } else {
            contractData.remaining = 0;
        }
        
        saveContracts(wdata, contracts);
        
        var players = npc.getWorld().getAllPlayers();
        for (var i = 0; i < players.length; i++) {
            if (players[i].getName() === ownerName) {
                var owner = players[i];
                
                if (!isOwnerKill) {
                    // Notify it was stolen, but still counts down
                    owner.message("§c⚠ Someone else killed one of your targets! (" + contractData.remaining + " remaining)");
                } else if (contractData.remaining <= 0) {
                    owner.message("§aContract complete! Return for a new one.");
                } else {
                    owner.message("§a" + contractData.remaining + " targets remaining.");
                }
                break;
            }
        }
    }
}

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
