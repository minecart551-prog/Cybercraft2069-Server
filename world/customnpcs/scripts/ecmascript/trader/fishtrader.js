// ========== FISH SELLING NPC SCRIPT ==========
// Player right-clicks NPC while holding a fish to sell it
// Payment based on: Fish type (value multiplier) + Fish size + Category bonus

// ========== PRICING CONFIGURATION ==========
var BASE_COIN_VALUE = 1.5;    // Base price for 1.5x multiplier fish at typical low size
var BASE_MULTIPLIER = 1.0;  // Base multiplier (Cave Crawler)
var CURRENCY_ITEM = "coins:stone_coin"; // Stone coin currency
var CURRENCY_FALLBACK = "minecraft:gold_nugget";    // Fallback if currency doesn't exist

// ========== CATEGORY VALUE MULTIPLIERS ==========
// Adjust these to make certain categories more/less valuable
var CATEGORY_MULTIPLIERS = {
    "underground": 1.0,     // Base category (no bonus)
    "cold_ocean": 1.2,      

};

// ========== UNDERGROUND FISH DATABASE ========== BIOME:FOREST
var UNDERGROUND_FISH = {
"tide:devils_hole_pupfish": [5.5, 1.4, 2.6, 4.3, "Devil's Hole Pupfish"],
"tide:chasm_eel": [4.5, 120, 180, 300, "Chasm Eel"],
"tide:midas_fish": [5.1, 50, 80, 130, "Midas Fish"],
"tide:bedrock_tetra": [3.8, 2.8, 4.5, 8, "Bedrock Tetra"],
"tide:gilded_minnow": [3.6, 8, 15, 28, "Gilded Minnow"],
"tide:crystalline_carp": [3.3, 40, 80, 120, "Crystalline Carp"],
"tide:luminescent_jellyfish": [3.3, 40, 50, 80, "Luminescent Jellyfish"],
"tide:echo_snapper": [3.6, 65, 85, 140, "Echo Snapper"],
"tide:crystal_shrimp": [3.3, 4, 8, 15, "Crystal Shrimp"],
"tide:dripstone_darter": [3.9, 35, 55, 95, "Dripstone Darter"],
"tide:lapis_lanternfish": [3.1, 5, 15, 40, "Lapis Lanternfish"],
"tide:iron_tetra": [3.1, 2.8, 4.5, 8, "Iron Tetra"],
"tide:abyss_angler": [2.7, 20, 35, 75, "Abyss Angler"],
"tide:anglerfish": [2.6, 20, 35, 75, "Anglerfish"],
"tide:glowfish": [2.6, 55, 75, 110, "Glowfish"],
"tide:shadow_snapper": [2.0, 35, 65, 120, "Shadow Snapper"],
"tide:cave_crawler": [1.8, 45, 60, 100, "Cave Crawler"],
"tide:cave_eel": [1.9, 90, 115, 150, "Cave Eel"],
"tide:deep_grouper": [1.9, 55, 75, 115, "Deep Grouper"]

};

// ========== COLD OCEAN FISH DATABASE ========== BIOME: COLD OCEAN
var COLD_OCEAN_FISH = {
"tide:coelacanth": [5.2, 140, 190, 270, "Coelacanth"],
"tide:shooting_starfish": [5.7, 70, 85, 120, "Shooting Starfish"],
"tide:great_white_shark": [5.1, 370, 490, 610, "Great White Shark"],
"tide:uranias_pisces": [5.0, 180, 220, 350, "Urania's Pisces"],
"tide:marstilus": [4.7, 100, 124, 185, "Marstilus"],
"tide:saturn_cuttlefish": [4.5, 90, 120, 180, "Saturn Cuttlefish"],
"tide:sun_emblem": [4.6, 50, 60, 85, "Sun Emblem"],
"tide:pluto_snail": [4.2, 10, 20, 35, "Pluto Snail"],
"tide:neptune_koi": [4.5, 40, 50, 80, "Neptune Koi"],
"tide:swordfish": [4.2, 180, 290, 455, "Swordfish"],
"tide:manta_ray": [4.1, 400, 650, 900, "Manta Ray"],
"tide:sailfish": [4.2, 180, 270, 380, "Sailfish"],
"tide:mahi_mahi": [4.0, 85, 130, 200, "Mahi Mahi"],
"tide:spore_stalker": [3.6, 35, 55, 90, "Spore Stalker"],
"tide:aquathorn": [3.8, 32, 45, 70, "Aquathorn"],
"tide:angelfish": [2.9, 10, 13, 20, "Angelfish"],
"tide:flounder": [2.0, 40, 55, 75, "Flounder"],
"tide:anchovy": [2.8, 6, 12, 20, "Anchovy"],
"tide:snook": [2.0, 38, 68, 125, "Snook"],
"tide:tuna": [1.9, 90, 150, 300, "Tuna"],
"tide:ocean_perch": [1.6, 40, 50, 67, "Ocean Perch"],
"tide:red_snapper": [1.5, 30, 60, 115, "Red Snapper"],
"tide:mackerel": [1.7, 30, 45, 65, "Mackerel"]

    
};






// ========== MASTER FISH DATABASE WITH CATEGORIES ==========
// Combines all fish databases with their category
function getFishData(fishId) {
    if (UNDERGROUND_FISH[fishId]) {
        return {
            data: UNDERGROUND_FISH[fishId],
            category: "underground"
        };
    }
    if (COLD_OCEAN_FISH[fishId]) {
        return {
            data: COLD_OCEAN_FISH[fishId],
            category: "cold_ocean"
        };
    }

    
    
    return null;
}

// ========== HELPER FUNCTIONS ==========

// Get fish size from NBT - Parse the JSON string directly
function getFishSize(itemStack) {
    try {
        var nbt = itemStack.getItemNbt();
        var nbtString = nbt.toJsonString();
        
        // Parse the JSON string to extract FishLength
        var fishLengthMatch = nbtString.match(/"FishLength":\s*([0-9.]+)d?/);
        
        if (fishLengthMatch && fishLengthMatch[1]) {
            var size = parseFloat(fishLengthMatch[1]);
            return size;
        }
        
        return null;
    } catch(e) {
        return null;
    }
}

// Calculate size multiplier based on where the fish size falls in its range
function getSizeMultiplier(fishSize, typicalLow, typicalHigh, recordHigh) {
    if (!fishSize) {
        return 1.0;
    }
    
    if (fishSize >= recordHigh) {
        return 2.5;
    } else if (fishSize >= typicalHigh) {
        var percent = (fishSize - typicalHigh) / (recordHigh - typicalHigh);
        return 1.3 + (percent * 0.7);
    } else if (fishSize >= typicalLow) {
        var percent = (fishSize - typicalLow) / (typicalHigh - typicalLow);
        return 1.0 + (percent * 0.3);
    } else {
        return 0.8;
    }
}

// Format size for display
function formatSize(size) {
    if (!size) return "unknown";
    if (size < 1) return (size * 10).toFixed(1) + "mm";
    return size.toFixed(1) + "cm";
}

// Calculate total price with category multiplier
function calculatePrice(fishData, fishSize, category) {
    var valueMultiplier = fishData[0];
    var typicalLow = fishData[1];
    var typicalHigh = fishData[2];
    var recordHigh = fishData[3];
    
    // Base price from fish type
    var basePrice = (valueMultiplier / BASE_MULTIPLIER) * BASE_COIN_VALUE;
    
    // Size multiplier
    var sizeMultiplier = getSizeMultiplier(fishSize, typicalLow, typicalHigh, recordHigh);
    
    // Category multiplier
    var categoryMultiplier = CATEGORY_MULTIPLIERS[category] || 1.0;
    
    // Final price = base × size × category
    return Math.round(basePrice * sizeMultiplier * categoryMultiplier);
}

// Get size category for message
function getSizeCategory(fishSize, typicalLow, typicalHigh, recordHigh) {
    if (!fishSize) return "";
    
    if (fishSize >= recordHigh) {
        return "§6§lRECORD SIZE ";
    } else if (fishSize >= typicalHigh) {
        return "§e§lLARGE ";
    } else if (fishSize >= typicalLow) {
        return "§a";
    } else {
        return "§7Small ";
    }
}

// ========== MAIN INTERACTION ==========
function interact(event) {
    var player = event.player;
    var npc = event.npc;
    var world = player.world;
    
    var heldItem = player.getMainhandItem();
    
    if (!heldItem || heldItem.isEmpty()) {
        npc.say("§eHold a fish in your hand to sell it to me!");
        return;
    }
    
    var itemId = heldItem.getName();
    
    // Get fish data with category
    var fishInfo = getFishData(itemId);
    
    if (!fishInfo) {
        npc.say("§cI don't buy " + heldItem.getDisplayName() + "!");
        return;
    }
    
    var fishData = fishInfo.data;
    var category = fishInfo.category;
    var fishName = fishData[4];
    
    // Get fish size
    var fishSize = getFishSize(heldItem);
    
    var price = calculatePrice(fishData, fishSize, category);
    var sizeCategory = getSizeCategory(fishSize, fishData[1], fishData[2], fishData[3]);
    var sizeText = formatSize(fishSize);
    
    var currency;
    try {
        currency = world.createItem(CURRENCY_ITEM, price);
    } catch(e) {
        currency = world.createItem(CURRENCY_FALLBACK, price);
    }
    
    heldItem.setStackSize(heldItem.getStackSize() - 1);
    player.giveItem(currency);
    
    // NPC message
    if (fishSize && fishSize >= fishData[3]) {
        npc.say("§6§l★ RECORD SIZE! ★");
        npc.say("§eSold " + fishName + " " + sizeCategory + sizeText + " for §6" + price + " coins§e!");
        player.message("§6§l★ You caught a RECORD SIZE fish! ★");
    } else if (fishSize && fishSize >= fishData[2]) {
        npc.say("§eSold " + fishName + " " + sizeCategory + sizeText + " for §6" + price + " coins§e!");
    } else if (!fishSize) {
        npc.say("§eSold " + fishName + " for §6" + price + " coins§e!");
    } else {
        npc.say("§eSold " + fishName + " " + sizeCategory + sizeText + " for §6" + price + " coins§e!");
    }
}

function role(event) {
    var npc = event.npc;
    npc.say("§eI buy all kinds of fish!");
    npc.say("§aHold a fish in your hand and right-click me to sell it.");
    npc.say("§7Larger fish are worth more coins!");
}