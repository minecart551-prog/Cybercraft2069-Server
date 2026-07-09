// ===============================
// Gang Loot Chest - Randomized gang spawn + loot chest
// ===============================

// Configuration
var RANGE = 30;                 // Range to check for nearby NPCs
var SPAWN_MIN_RADIUS = 1;       // Minimum spawn distance from block
var SPAWN_MAX_RADIUS = 1;       // Maximum spawn distance from block
var EMPTY_CHANCE = 0.1;        // 25% chance the chest is empty on server restart
var Grid_GUI   = 100;


var availableGangs = [

    {
        tab: 1, name: "G4", count: 5,
        loot: [
            { id: "coins:coal_coin",          count: 60,  weight: 100 },
            { id: "coins:emerald_coin",          count: 1,  weight: 100 },
            { id: "minecraft:diamond",          count: 1,  weight: 10 }
        ]
    }
];

// Chest GUI template variables
var guiRef;                 
var mySlots = [];           
var highlightLineIds = [];  
var rows = 3;
var cols = 9;
var slotSize = 18;
var slotPadding = 0;
var offsetX = 0;
var offsetY = 36;
var highlightedSlot = null;
var storedSlotItems = [];
var lastBlock = null;

// ===== Get a unique key string for the block =====
function getBlockKey(block) {
    return "gangloot_" + block.getX() + "_" + block.getY() + "_" + block.getZ();
}

// ===== Set block model =====
function init(e) {
    e.block.setModel("yuushya:safe");
}

// ===== Tick - initialize gang + loot on first run or after restart =====
function tick(event) {
    var block = event.block;
    var world = block.getWorld();
    var tempData = world.getTempdata();
    var blockKey = getBlockKey(block);

    // If chest hasn't been initialized yet this server session, set it up
    if (!tempData.has(blockKey + "_init")) {
        initializeChest(block, world, tempData, blockKey);
    }
}

// ===== Initialize chest: roll for empty or pick gang + spawn =====
function initializeChest(block, world, tempData, blockKey) {
    // Mark as initialized so this only runs once per server session
    tempData.put(blockKey + "_init", "true");

    // Always clean up any leftover NPCs from previous sessions before doing anything
    despawnAllGangNpcs(block, world);

    // Roll the dice: chance to be empty
    if (Math.random() < EMPTY_CHANCE) {
        // Chest is empty this session
        return;
    }

    // Not empty — pick a random gang and proceed normally
    var gang = availableGangs[Math.floor(Math.random() * availableGangs.length)];

    // Store gang info in tempdata (only what's needed: tab, name, count)
    var gangInfo = { tab: gang.tab, name: gang.name, count: gang.count };
    tempData.put(blockKey + "_gang", JSON.stringify(gangInfo));

    // Spawn NPCs around the block in a circle
    var pos = block.getPos();
    for (var i = 0; i < gang.count; i++) {
        var angle = (Math.PI * 2 / gang.count) * i;
        var dist = SPAWN_MIN_RADIUS + Math.random() * (SPAWN_MAX_RADIUS - SPAWN_MIN_RADIUS);
        var x = pos.getX() + Math.cos(angle) * dist;
        var z = pos.getZ() + Math.sin(angle) * dist;
        var y = pos.getY() + 2;
        world.spawnClone(Math.floor(x), y, Math.floor(z), gang.tab, gang.name);
    }

    // Generate random loot items into tempdata using this gang's loot pool
    generateLoot(gang.loot, tempData, blockKey);
}

// ===== Despawn any leftover NPCs matching any gang name within range =====
function despawnAllGangNpcs(block, world) {
    var npcs = world.getNearbyEntities(block.getPos(), RANGE, 2);
    for (var j = 0; j < npcs.length; j++) {
        var npc = npcs[j];
        // Check if this NPC's name matches any gang name
        for (var g = 0; g < availableGangs.length; g++) {
            if (npc.getName() === availableGangs[g].name) {
                npc.despawn();
                break;
            }
        }
    }
}

// ===== Generate loot: each item in the pool rolls its own % chance independently =====
// Each item's weight = percentage chance (0-100) to spawn in the chest
// Example: weight: 30 means 30% chance that item appears
// Multiple items can all succeed independently, each placed in a random empty slot
function generateLoot(lootPool, tempData, blockKey) {
    var usedSlots = {};

    for (var i = 0; i < lootPool.length; i++) {
        var item = lootPool[i];
        // Roll a 0-100, if <= weight then it spawns
        if (item.weight > 0 && Math.random() * 100 <= item.weight) {
            // Find a random empty slot
            var slotIndex;
            var attempts = 0;
            do {
                slotIndex = Math.floor(Math.random() * (rows * cols));
                attempts++;
                // Safety: if all slots somehow taken, break
                if (attempts > 100) break;
            } while (usedSlots[slotIndex]);
            
            if (usedSlots[slotIndex]) continue;
            usedSlots[slotIndex] = true;

            // Store as NBT string in tempdata
            var nbtStr = "{id:\"" + item.id + "\",Count:" + item.count + "b}";
            tempData.put(blockKey + "_slot_" + slotIndex, nbtStr);
        }
    }
}

// ===== Right-click entry point =====
function interact(e) {
    var api = e.API;
    var b   = e.block;
    var p   = e.player;
    var world = b.getWorld();
    var tempData = world.getTempdata();
    var blockKey = getBlockKey(b);

    // Get the spawned gang name from tempdata
    var gangDataStr = tempData.get(blockKey + "_gang");
    if (!gangDataStr) {
        p.message("§cNo gang has been assigned yet...");
        return;
    }

    // --- LOCK CHECK: block if another player already has this chest open ---
    var lockKey = blockKey + "_lock";
    if (tempData.has(lockKey)) {
        var lockedBy = tempData.get(lockKey);
        // Allow the same player back in (e.g. accidental double-click)
        if (lockedBy !== p.getName()) {
            p.message("§cSomeone else is looting this chest!");
            world.playSoundAt(p.getPos(), "minecraft:block.chest.locked", 1.0, 1.0);
            return;
        }
    }

    // Only check for nearby NPCs if the chest hasn't been opened yet
    if (tempData.get(blockKey + "_opened") !== "true") {
        var gangData;
        try {
            gangData = JSON.parse(gangDataStr);
        } catch(e) {
            p.message("§cError loading gang data");
            return;
        }

        // Check if any gang NPCs are nearby
        var npcs = world.getNearbyEntities(b.getPos(), RANGE, 2);
        var gangNpcs = [];
        for (var j = 0; j < npcs.length; j++) {
            if (npcs[j].getName() === gangData.name) {
                gangNpcs.push(npcs[j]);
            }
        }

        if (gangNpcs.length > 0) {
            p.message("§cGang members are nearby! Eliminate them first!");
            world.playSoundAt(p.getPos(), "minecraft:entity.villager.no", 1.0, 1.0);

            // Aggro every nearby gang member onto the player
            for (var k = 0; k < gangNpcs.length; k++) {
                try {
                    gangNpcs[k].setAttackTarget(p);
                } catch(err) {}
            }

            return;
        }

        // First time opening — mark it so NPC check is skipped on future opens
        tempData.put(blockKey + "_opened", "true");
    }

    // --- ACQUIRE LOCK: record that this player now has the chest open ---
    tempData.put(lockKey, p.getName());

    // Open the chest GUI with remaining loot
    lastBlock = b;
    openChestGui(p, api, blockKey, tempData);
}

// ===== Working chest GUI (adapted from safe.js, no password) =====
function openChestGui(player, api, blockKey, tempData){
    if (!lastBlock) return;

    // Load stored items from tempdata
    storedSlotItems = [];
    for (var i = 0; i < rows * cols; i++){
        var key = blockKey + "_slot_" + i;
        storedSlotItems.push(tempData.has(key) ? tempData.get(key) : null);
    }

    highlightedSlot = null;
    highlightLineIds = [];
    guiRef = api.createCustomGui(Grid_GUI, 176, 166, false, player);
    mySlots = [];

    for (var r = 0; r < rows; r++){
        for (var c = 0; c < cols; c++){
            var x = offsetX + c * (slotSize + slotPadding);
            var y = offsetY + r * (slotSize + slotPadding);
            var slot = guiRef.addItemSlot(x, y);
            var index = r * cols + c;

            if (storedSlotItems[index]) {
                try {
                    slot.setStack(player.world.createItemFromNbt(api.stringToNbt(storedSlotItems[index])));
                } catch(e){}
            }

            mySlots.push(slot);
        }
    }

    guiRef.showPlayerInventory(offsetX, offsetY + rows * slotSize + 5, false);
    player.showCustomGui(guiRef);
}

// ===== Handle slot clicks (from safe.js) =====
function customGuiSlotClicked(e){
    var clickedSlot = e.slot;
    var stack = e.stack;
    var player = e.player;

    var slotIndex = mySlots.indexOf(clickedSlot);
    if (slotIndex !== -1) {
        highlightedSlot = clickedSlot;
        highlightLineIds.forEach(function(id){ try{ guiRef.removeComponent(id); }catch(e){} });
        highlightLineIds = [];

        var row = Math.floor(slotIndex / cols);
        var col = slotIndex % cols;
        var x = offsetX + col * (slotSize + slotPadding);
        var y = offsetY + row * (slotSize + slotPadding);
        var w = slotSize, h = slotSize;
        highlightLineIds.push(guiRef.addColoredLine(1, x, y, x + w, y, 0xADD8E6, 2));
        highlightLineIds.push(guiRef.addColoredLine(2, x, y + h, x + w, y + h, 0xADD8E6, 2));
        highlightLineIds.push(guiRef.addColoredLine(3, x, y, x, y + h, 0xADD8E6, 2));
        highlightLineIds.push(guiRef.addColoredLine(4, x + w, y, x + w, y + h, 0xADD8E6, 2));
        guiRef.update();
        return;
    }

    if (!highlightedSlot) return;

    try{
        var slotStack = highlightedSlot.getStack();
        var maxStack = stack ? stack.getMaxStackSize() : 64;

        if (stack && !stack.isEmpty()){
            if (slotStack && !slotStack.isEmpty() && slotStack.getDisplayName() === stack.getDisplayName()){
                var total = slotStack.getStackSize() + stack.getStackSize();
                if (total <= maxStack){
                    slotStack.setStackSize(total);
                    highlightedSlot.setStack(slotStack);
                    player.removeItem(stack, stack.getStackSize());
                } else {
                    var overflow = total - maxStack;
                    slotStack.setStackSize(maxStack);
                    highlightedSlot.setStack(slotStack);

                    var overflowCopy = player.world.createItemFromNbt(stack.getItemNbt());
                    overflowCopy.setStackSize(overflow);
                    player.removeItem(stack, stack.getStackSize());
                    player.giveItem(overflowCopy);
                }
            } else {
                var itemCopy = player.world.createItemFromNbt(stack.getItemNbt());
                if (slotStack && !slotStack.isEmpty()) player.giveItem(slotStack);
                highlightedSlot.setStack(itemCopy);
                player.removeItem(stack, stack.getStackSize());
            }
        } else if (slotStack && !slotStack.isEmpty()){
            player.giveItem(slotStack);
            highlightedSlot.setStack(player.world.createItem("minecraft:air", 1));
        }

        guiRef.update();
    } catch(e){}
}

// ===== On GUI close, save remaining items back to tempdata AND release lock =====
function customGuiClosed(e){
    if (e.gui.getID() !== Grid_GUI) return;
    if (!lastBlock) return;

    var world = lastBlock.getWorld();
    var tempData = world.getTempdata();
    var blockKey = getBlockKey(lastBlock);

    // Save whatever items are still in the slots back to tempdata
    mySlots.forEach(function(slot, i){
        var key = blockKey + "_slot_" + i;
        var st = slot.getStack();
        if (!st || st.getName() === "minecraft:air"){
            tempData.remove(key);
        } else {
            tempData.put(key, st.getItemNbt().toJsonString());
        }
    });

    // --- RELEASE LOCK: allow others to open the chest again ---
    tempData.remove(blockKey + "_lock");
}
