// ============================================================
//  SHOP CONFIGURATION — Edit everything here
// ============================================================

var CONFIG_MAX_PAGES = 5;

var CONFIG_TAB_ICONS = [
    "minecraft:bricks",
    "minecraft:light_blue_wool",
    "minecraft:grass_block",
    "minecraft:barrier",
    "minecraft:barrier",
];

var CONFIG_TAB_NAMES = [
    "Building Blocks",
    "Colored Blocks",
    "Natural Blocks",
    "Tab 4",
    "Tab 5",
];

var CONFIG_TAB_ROWS = [
    10,
    19,
    7,
    1,
    1,
];

var CONFIG_SHOP_ITEMS = [
    // Tab 0 — Building Blocks
    [
    { id: "kubejs:barrier", count: 1, price: BUILDINGBLOCKS_PRICES["kubejs:barrier"], lore: [] },
    { id: "minecraft:anvil", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:anvil"], lore: [] },
    { id: "minecraft:loom", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:loom"], lore: [] },
    { id: "minecraft:scaffolding", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:scaffolding"], lore: [] },
    { id: "minecraft:oak_log", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:oak_log"], lore: [] },
    { id: "minecraft:oak_wood", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:oak_wood"], lore: [] },
    { id: "minecraft:spruce_log", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:spruce_log"], lore: [] },
    { id: "minecraft:spruce_wood", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:spruce_wood"], lore: [] },
    { id: "minecraft:birch_log", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:birch_log"], lore: [] },
    { id: "minecraft:birch_wood", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:birch_wood"], lore: [] },
    { id: "minecraft:jungle_log", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:jungle_log"], lore: [] },
    { id: "minecraft:jungle_wood", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:jungle_wood"], lore: [] },
    { id: "minecraft:acacia_log", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:acacia_log"], lore: [] },
    { id: "minecraft:acacia_wood", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:acacia_wood"], lore: [] },
    { id: "minecraft:dark_oak_log", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:dark_oak_log"], lore: [] },
    { id: "minecraft:dark_oak_wood", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:dark_oak_wood"], lore: [] },
    { id: "minecraft:mangrove_log", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:mangrove_log"], lore: [] },
    { id: "minecraft:mangrove_wood", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:mangrove_wood"], lore: [] },
    { id: "minecraft:cherry_log", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cherry_log"], lore: [] },
    { id: "minecraft:cherry_wood", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cherry_wood"], lore: [] },
    { id: "minecraft:bamboo_block", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:bamboo_block"], lore: [] },
    { id: "minecraft:crimson_stem", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:crimson_stem"], lore: [] },
    { id: "minecraft:crimson_hyphae", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:crimson_hyphae"], lore: [] },
    { id: "minecraft:warped_stem", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:warped_stem"], lore: [] },
    { id: "minecraft:warped_hyphae", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:warped_hyphae"], lore: [] },
    { id: "minecraft:stone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:stone"], lore: [] },
    { id: "minecraft:cobblestone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cobblestone"], lore: [] },
    { id: "minecraft:mossy_cobblestone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:mossy_cobblestone"], lore: [] },
    { id: "minecraft:smooth_stone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:smooth_stone"], lore: [] },
    { id: "minecraft:stone_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:stone_bricks"], lore: [] },
    { id: "minecraft:cracked_stone_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cracked_stone_bricks"], lore: [] },
    { id: "minecraft:chiseled_stone_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:chiseled_stone_bricks"], lore: [] },
    { id: "minecraft:mossy_stone_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:mossy_stone_bricks"], lore: [] },
    { id: "minecraft:granite", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:granite"], lore: [] },
    { id: "minecraft:diorite", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:diorite"], lore: [] },
    { id: "minecraft:andesite", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:andesite"], lore: [] },
    { id: "minecraft:polished_andesite", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:polished_andesite"], lore: [] },
    { id: "minecraft:deepslate", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:deepslate"], lore: [] },
    { id: "minecraft:cobbled_deepslate", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cobbled_deepslate"], lore: [] },
    { id: "minecraft:chiseled_deepslate", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:chiseled_deepslate"], lore: [] },
    { id: "minecraft:polished_deepslate", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:polished_deepslate"], lore: [] },
    { id: "minecraft:deepslate_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:deepslate_bricks"], lore: [] },
    { id: "minecraft:cracked_deepslate_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cracked_deepslate_bricks"], lore: [] },
    { id: "minecraft:deepslate_tiles", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:deepslate_tiles"], lore: [] },
    { id: "minecraft:cracked_deepslate_tiles", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cracked_deepslate_tiles"], lore: [] },
    { id: "minecraft:reinforced_deepslate", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:reinforced_deepslate"], lore: [] },
    { id: "minecraft:bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:bricks"], lore: [] },
    { id: "minecraft:packed_mud", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:packed_mud"], lore: [] },
    { id: "minecraft:mud_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:mud_bricks"], lore: [] },
    { id: "minecraft:sandstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:sandstone"], lore: [] },
    { id: "minecraft:chiseled_sandstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:chiseled_sandstone"], lore: [] },
    { id: "minecraft:smooth_sandstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:smooth_sandstone"], lore: [] },
    { id: "minecraft:cut_sandstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cut_sandstone"], lore: [] },
    { id: "minecraft:red_sandstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_sandstone"], lore: [] },
    { id: "minecraft:chiseled_red_sandstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:chiseled_red_sandstone"], lore: [] },
    { id: "minecraft:smooth_red_sandstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:smooth_red_sandstone"], lore: [] },
    { id: "minecraft:cut_red_sandstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cut_red_sandstone"], lore: [] },
    { id: "minecraft:sea_lantern", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:sea_lantern"], lore: [] },
    { id: "minecraft:prismarine", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:prismarine"], lore: [] },
    { id: "minecraft:prismarine_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:prismarine_bricks"], lore: [] },
    { id: "minecraft:dark_prismarine", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:dark_prismarine"], lore: [] },
    { id: "minecraft:netherrack", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:netherrack"], lore: [] },
    { id: "minecraft:nether_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:nether_bricks"], lore: [] },
    { id: "minecraft:cracked_nether_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cracked_nether_bricks"], lore: [] },
    { id: "minecraft:chiseled_nether_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:chiseled_nether_bricks"], lore: [] },
    { id: "minecraft:red_nether_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_nether_bricks"], lore: [] },
    { id: "minecraft:basalt", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:basalt"], lore: [] },
    { id: "minecraft:smooth_basalt", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:smooth_basalt"], lore: [] },
    { id: "minecraft:polished_basalt", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:polished_basalt"], lore: [] },
    { id: "minecraft:blackstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:blackstone"], lore: [] },
    { id: "minecraft:gilded_blackstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:gilded_blackstone"], lore: [] },
    { id: "minecraft:chiseled_polished_blackstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:chiseled_polished_blackstone"], lore: [] },
    { id: "minecraft:polished_blackstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:polished_blackstone"], lore: [] },
    { id: "minecraft:polished_blackstone_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:polished_blackstone_bricks"], lore: [] },
    { id: "minecraft:cracked_polished_blackstone_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cracked_polished_blackstone_bricks"], lore: [] },
    { id: "minecraft:end_stone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:end_stone"], lore: [] },
    { id: "minecraft:end_stone_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:end_stone_bricks"], lore: [] },
    { id: "minecraft:purpur_block", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:purpur_block"], lore: [] },
    { id: "minecraft:purpur_pillar", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:purpur_pillar"], lore: [] },
    { id: "minecraft:quartz", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:quartz"], lore: [] },
    { id: "minecraft:quartz_block", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:quartz_block"], lore: [] },
    { id: "minecraft:chiseled_quartz_block", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:chiseled_quartz_block"], lore: [] },
    { id: "minecraft:quartz_bricks", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:quartz_bricks"], lore: [] },
    { id: "minecraft:quartz_pillar", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:quartz_pillar"], lore: [] },
    { id: "minecraft:smooth_quartz", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:smooth_quartz"], lore: [] },
    { id: "minecraft:end_rod", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:end_rod"], lore: [] },
    { id: "minecraft:ochre_froglight", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:ochre_froglight"], lore: [] },
    { id: "minecraft:pearlescent_froglight", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:pearlescent_froglight"], lore: [] },
    { id: "minecraft:verdant_froglight", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:verdant_froglight"], lore: [] },
    null
],
    // Tab 1 — Colored Blocks
    [
    { id: "bbs:chroma_red", count: 1, price: BUILDINGBLOCKS_PRICES["bbs:chroma_red"], lore: [] },
    { id: "bbs:chroma_blue", count: 1, price: BUILDINGBLOCKS_PRICES["bbs:chroma_blue"], lore: [] },
    { id: "bbs:chroma_cyan", count: 1, price: BUILDINGBLOCKS_PRICES["bbs:chroma_cyan"], lore: [] },
    { id: "bbs:chroma_green", count: 1, price: BUILDINGBLOCKS_PRICES["bbs:chroma_green"], lore: [] },
    { id: "bbs:chroma_magenta", count: 1, price: BUILDINGBLOCKS_PRICES["bbs:chroma_magenta"], lore: [] },
    { id: "bbs:chroma_white", count: 1, price: BUILDINGBLOCKS_PRICES["bbs:chroma_white"], lore: [] },
    { id: "bbs:chroma_yellow", count: 1, price: BUILDINGBLOCKS_PRICES["bbs:chroma_yellow"], lore: [] },
    { id: "minecraft:ink_sac", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:ink_sac"], lore: [] },
    { id: "minecraft:glow_ink_sac", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:glow_ink_sac"], lore: [] },
    { id: "minecraft:purple_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:purple_dye"], lore: [] },
    { id: "minecraft:cyan_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cyan_dye"], lore: [] },
    { id: "minecraft:light_gray_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_gray_dye"], lore: [] },
    { id: "minecraft:gray_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:gray_dye"], lore: [] },
    { id: "minecraft:pink_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:pink_dye"], lore: [] },
    { id: "minecraft:lime_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:lime_dye"], lore: [] },
    { id: "minecraft:dandelion_yellow", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:dandelion_yellow"], lore: [] },
    { id: "minecraft:light_blue_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_blue_dye"], lore: [] },
    { id: "minecraft:magenta_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:magenta_dye"], lore: [] },
    { id: "minecraft:orange_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:orange_dye"], lore: [] },
    { id: "minecraft:red_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_dye"], lore: [] },
    { id: "minecraft:green_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:green_dye"], lore: [] },
    { id: "minecraft:yellow_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:yellow_dye"], lore: [] },
    { id: "minecraft:blue_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:blue_dye"], lore: [] },
    { id: "minecraft:brown_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:brown_dye"], lore: [] },
    { id: "minecraft:black_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:black_dye"], lore: [] },
    { id: "minecraft:white_dye", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:white_dye"], lore: [] },

    { id: "minecraft:white_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:white_wool"], lore: [] },
    { id: "minecraft:light_gray_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_gray_wool"], lore: [] },
    { id: "minecraft:gray_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:gray_wool"], lore: [] },
    { id: "minecraft:black_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:black_wool"], lore: [] },
    { id: "minecraft:brown_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:brown_wool"], lore: [] },
    { id: "minecraft:red_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_wool"], lore: [] },
    { id: "minecraft:orange_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:orange_wool"], lore: [] },
    { id: "minecraft:yellow_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:yellow_wool"], lore: [] },
    { id: "minecraft:lime_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:lime_wool"], lore: [] },
    { id: "minecraft:green_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:green_wool"], lore: [] },
    { id: "minecraft:cyan_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cyan_wool"], lore: [] },
    { id: "minecraft:light_blue_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_blue_wool"], lore: [] },
    { id: "minecraft:blue_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:blue_wool"], lore: [] },
    { id: "minecraft:purple_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:purple_wool"], lore: [] },
    { id: "minecraft:magenta_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:magenta_wool"], lore: [] },
    { id: "minecraft:pink_wool", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:pink_wool"], lore: [] },
    { id: "minecraft:terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:terracotta"], lore: [] },
    { id: "minecraft:white_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:white_terracotta"], lore: [] },
    { id: "minecraft:light_gray_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_gray_terracotta"], lore: [] },
    { id: "minecraft:gray_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:gray_terracotta"], lore: [] },
    { id: "minecraft:black_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:black_terracotta"], lore: [] },
    { id: "minecraft:brown_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:brown_terracotta"], lore: [] },
    { id: "minecraft:red_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_terracotta"], lore: [] },
    { id: "minecraft:orange_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:orange_terracotta"], lore: [] },
    { id: "minecraft:yellow_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:yellow_terracotta"], lore: [] },
    { id: "minecraft:lime_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:lime_terracotta"], lore: [] },
    { id: "minecraft:green_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:green_terracotta"], lore: [] },
    { id: "minecraft:cyan_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cyan_terracotta"], lore: [] },
    { id: "minecraft:light_blue_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_blue_terracotta"], lore: [] },
    { id: "minecraft:blue_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:blue_terracotta"], lore: [] },
    { id: "minecraft:purple_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:purple_terracotta"], lore: [] },
    { id: "minecraft:magenta_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:magenta_terracotta"], lore: [] },
    { id: "minecraft:pink_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:pink_terracotta"], lore: [] },
    { id: "minecraft:white_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:white_concrete"], lore: [] },
    { id: "minecraft:light_gray_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_gray_concrete"], lore: [] },
    { id: "minecraft:gray_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:gray_concrete"], lore: [] },
    { id: "minecraft:black_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:black_concrete"], lore: [] },
    { id: "minecraft:brown_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:brown_concrete"], lore: [] },
    { id: "minecraft:red_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_concrete"], lore: [] },
    { id: "minecraft:orange_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:orange_concrete"], lore: [] },
    { id: "minecraft:yellow_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:yellow_concrete"], lore: [] },
    { id: "minecraft:lime_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:lime_concrete"], lore: [] },
    { id: "minecraft:green_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:green_concrete"], lore: [] },
    { id: "minecraft:cyan_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cyan_concrete"], lore: [] },
    { id: "minecraft:light_blue_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_blue_concrete"], lore: [] },
    { id: "minecraft:blue_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:blue_concrete"], lore: [] },
    { id: "minecraft:purple_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:purple_concrete"], lore: [] },
    { id: "minecraft:magenta_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:magenta_concrete"], lore: [] },
    { id: "minecraft:pink_concrete", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:pink_concrete"], lore: [] },
    { id: "minecraft:white_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:white_concrete_powder"], lore: [] },
    { id: "minecraft:light_gray_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_gray_concrete_powder"], lore: [] },
    { id: "minecraft:gray_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:gray_concrete_powder"], lore: [] },
    { id: "minecraft:black_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:black_concrete_powder"], lore: [] },
    { id: "minecraft:brown_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:brown_concrete_powder"], lore: [] },
    { id: "minecraft:red_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_concrete_powder"], lore: [] },
    { id: "minecraft:orange_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:orange_concrete_powder"], lore: [] },
    { id: "minecraft:yellow_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:yellow_concrete_powder"], lore: [] },
    { id: "minecraft:lime_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:lime_concrete_powder"], lore: [] },
    { id: "minecraft:green_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:green_concrete_powder"], lore: [] },
    { id: "minecraft:cyan_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cyan_concrete_powder"], lore: [] },
    { id: "minecraft:light_blue_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_blue_concrete_powder"], lore: [] },
    { id: "minecraft:blue_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:blue_concrete_powder"], lore: [] },
    { id: "minecraft:purple_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:purple_concrete_powder"], lore: [] },
    { id: "minecraft:magenta_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:magenta_concrete_powder"], lore: [] },
    { id: "minecraft:pink_concrete_powder", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:pink_concrete_powder"], lore: [] },
    { id: "minecraft:white_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:white_glazed_terracotta"], lore: [] },
    { id: "minecraft:light_gray_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_gray_glazed_terracotta"], lore: [] },
    { id: "minecraft:gray_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:gray_glazed_terracotta"], lore: [] },
    { id: "minecraft:black_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:black_glazed_terracotta"], lore: [] },
    { id: "minecraft:brown_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:brown_glazed_terracotta"], lore: [] },
    { id: "minecraft:red_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_glazed_terracotta"], lore: [] },
    { id: "minecraft:orange_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:orange_glazed_terracotta"], lore: [] },
    { id: "minecraft:yellow_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:yellow_glazed_terracotta"], lore: [] },
    { id: "minecraft:lime_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:lime_glazed_terracotta"], lore: [] },
    { id: "minecraft:green_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:green_glazed_terracotta"], lore: [] },
    { id: "minecraft:cyan_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cyan_glazed_terracotta"], lore: [] },
    { id: "minecraft:light_blue_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_blue_glazed_terracotta"], lore: [] },
    { id: "minecraft:blue_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:blue_glazed_terracotta"], lore: [] },
    { id: "minecraft:purple_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:purple_glazed_terracotta"], lore: [] },
    { id: "minecraft:magenta_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:magenta_glazed_terracotta"], lore: [] },
    { id: "minecraft:pink_glazed_terracotta", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:pink_glazed_terracotta"], lore: [] },
    { id: "minecraft:glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:glass"], lore: [] },
    { id: "minecraft:tinted_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:tinted_glass"], lore: [] },
    { id: "minecraft:white_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:white_stained_glass"], lore: [] },
    { id: "minecraft:light_gray_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_gray_stained_glass"], lore: [] },
    { id: "minecraft:gray_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:gray_stained_glass"], lore: [] },
    { id: "minecraft:black_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:black_stained_glass"], lore: [] },
    { id: "minecraft:brown_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:brown_stained_glass"], lore: [] },
    { id: "minecraft:red_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_stained_glass"], lore: [] },
    { id: "minecraft:orange_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:orange_stained_glass"], lore: [] },
    { id: "minecraft:yellow_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:yellow_stained_glass"], lore: [] },
    { id: "minecraft:lime_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:lime_stained_glass"], lore: [] },
    { id: "minecraft:green_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:green_stained_glass"], lore: [] },
    { id: "minecraft:cyan_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cyan_stained_glass"], lore: [] },
    { id: "minecraft:light_blue_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_blue_stained_glass"], lore: [] },
    { id: "minecraft:blue_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:blue_stained_glass"], lore: [] },
    { id: "minecraft:purple_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:purple_stained_glass"], lore: [] },
    { id: "minecraft:magenta_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:magenta_stained_glass"], lore: [] },
    { id: "minecraft:pink_stained_glass", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:pink_stained_glass"], lore: [] },
    { id: "minecraft:glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:glass_pane"], lore: [] },
    { id: "minecraft:white_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:white_stained_glass_pane"], lore: [] },
    { id: "minecraft:light_gray_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_gray_stained_glass_pane"], lore: [] },
    { id: "minecraft:gray_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:gray_stained_glass_pane"], lore: [] },
    { id: "minecraft:black_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:black_stained_glass_pane"], lore: [] },
    { id: "minecraft:brown_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:brown_stained_glass_pane"], lore: [] },
    { id: "minecraft:red_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_stained_glass_pane"], lore: [] },
    { id: "minecraft:orange_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:orange_stained_glass_pane"], lore: [] },
    { id: "minecraft:yellow_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:yellow_stained_glass_pane"], lore: [] },
    { id: "minecraft:lime_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:lime_stained_glass_pane"], lore: [] },
    { id: "minecraft:green_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:green_stained_glass_pane"], lore: [] },
    { id: "minecraft:cyan_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cyan_stained_glass_pane"], lore: [] },
    { id: "minecraft:light_blue_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_blue_stained_glass_pane"], lore: [] },
    { id: "minecraft:blue_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:blue_stained_glass_pane"], lore: [] },
    { id: "minecraft:purple_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:purple_stained_glass_pane"], lore: [] },
    { id: "minecraft:magenta_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:magenta_stained_glass_pane"], lore: [] },
    { id: "minecraft:pink_stained_glass_pane", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:pink_stained_glass_pane"], lore: [] },
    { id: "minecraft:candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:candle"], lore: [] },
    { id: "minecraft:white_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:white_candle"], lore: [] },
    { id: "minecraft:light_gray_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_gray_candle"], lore: [] },
    { id: "minecraft:gray_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:gray_candle"], lore: [] },
    { id: "minecraft:black_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:black_candle"], lore: [] },
    { id: "minecraft:brown_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:brown_candle"], lore: [] },
    { id: "minecraft:red_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_candle"], lore: [] },
    { id: "minecraft:orange_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:orange_candle"], lore: [] },
    { id: "minecraft:yellow_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:yellow_candle"], lore: [] },
    { id: "minecraft:lime_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:lime_candle"], lore: [] },
    { id: "minecraft:green_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:green_candle"], lore: [] },
    { id: "minecraft:cyan_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cyan_candle"], lore: [] },
    { id: "minecraft:light_blue_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_blue_candle"], lore: [] },
    { id: "minecraft:blue_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:blue_candle"], lore: [] },
    { id: "minecraft:purple_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:purple_candle"], lore: [] },
    { id: "minecraft:magenta_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:magenta_candle"], lore: [] },
    { id: "minecraft:pink_candle", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:pink_candle"], lore: [] },
    { id: "minecraft:white_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:white_banner"], lore: [] },
    { id: "minecraft:light_gray_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_gray_banner"], lore: [] },
    { id: "minecraft:gray_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:gray_banner"], lore: [] },
    { id: "minecraft:black_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:black_banner"], lore: [] },
    { id: "minecraft:brown_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:brown_banner"], lore: [] },
    { id: "minecraft:red_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_banner"], lore: [] },
    { id: "minecraft:orange_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:orange_banner"], lore: [] },
    { id: "minecraft:yellow_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:yellow_banner"], lore: [] },
    { id: "minecraft:lime_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:lime_banner"], lore: [] },
    { id: "minecraft:green_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:green_banner"], lore: [] },
    { id: "minecraft:cyan_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cyan_banner"], lore: [] },
    { id: "minecraft:light_blue_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:light_blue_banner"], lore: [] },
    { id: "minecraft:blue_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:blue_banner"], lore: [] },
    { id: "minecraft:purple_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:purple_banner"], lore: [] },
    { id: "minecraft:magenta_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:magenta_banner"], lore: [] },
    { id: "minecraft:pink_banner", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:pink_banner"], lore: [] },

    null,
    null,
    null,
    null
],
    // Tab 2 — Natural Blocks
    [
    { id: "minecraft:grass_block", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:grass_block"], lore: [] },
    { id: "minecraft:mud", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:mud"], lore: [] },
    { id: "minecraft:clay", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:clay"], lore: [] },
    { id: "minecraft:gravel", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:gravel"], lore: [] },
    { id: "minecraft:glowstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:glowstone"], lore: [] },
    { id: "minecraft:sand", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:sand"], lore: [] },
    { id: "minecraft:sandstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:sandstone"], lore: [] },
    { id: "minecraft:red_sand", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_sand"], lore: [] },
    { id: "minecraft:red_sandstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_sandstone"], lore: [] },
    { id: "minecraft:ice", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:ice"], lore: [] },
    { id: "minecraft:packed_ice", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:packed_ice"], lore: [] },
    { id: "minecraft:blue_ice", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:blue_ice"], lore: [] },
    { id: "minecraft:snow_block", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:snow_block"], lore: [] },
    { id: "minecraft:snow", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:snow"], lore: [] },
    { id: "minecraft:moss_block", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:moss_block"], lore: [] },
    { id: "minecraft:moss_carpet", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:moss_carpet"], lore: [] },
    { id: "minecraft:stone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:stone"], lore: [] },
    { id: "minecraft:deepslate", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:deepslate"], lore: [] },
    { id: "minecraft:granite", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:granite"], lore: [] },
    { id: "minecraft:diorite", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:diorite"], lore: [] },
    { id: "minecraft:andesite", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:andesite"], lore: [] },
    { id: "minecraft:calcite", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:calcite"], lore: [] },
    { id: "minecraft:tuff", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:tuff"], lore: [] },
    { id: "minecraft:dripstone_block", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:dripstone_block"], lore: [] },
    { id: "minecraft:pointed_dripstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:pointed_dripstone"], lore: [] },
    { id: "minecraft:prismarine", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:prismarine"], lore: [] },
    { id: "minecraft:magma_block", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:magma_block"], lore: [] },
    { id: "minecraft:obsidian", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:obsidian"], lore: [] },
    { id: "minecraft:crying_obsidian", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:crying_obsidian"], lore: [] },
    { id: "minecraft:netherrack", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:netherrack"], lore: [] },
    { id: "minecraft:crimson_nylium", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:crimson_nylium"], lore: [] },
    { id: "minecraft:warped_nylium", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:warped_nylium"], lore: [] },
    { id: "minecraft:soul_sand", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:soul_sand"], lore: [] },
    { id: "minecraft:soul_soil", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:soul_soil"], lore: [] },
    { id: "minecraft:bone_block", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:bone_block"], lore: [] },
    { id: "minecraft:blackstone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:blackstone"], lore: [] },
    { id: "minecraft:basalt", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:basalt"], lore: [] },
    { id: "minecraft:smooth_basalt", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:smooth_basalt"], lore: [] },
    { id: "minecraft:end_stone", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:end_stone"], lore: [] },
 
    { id: "minecraft:oak_leaves", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:oak_leaves"], lore: [] },
    { id: "minecraft:spruce_leaves", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:spruce_leaves"], lore: [] },
    { id: "minecraft:birch_leaves", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:birch_leaves"], lore: [] },
    { id: "minecraft:jungle_leaves", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:jungle_leaves"], lore: [] },
    { id: "minecraft:acacia_leaves", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:acacia_leaves"], lore: [] },
    { id: "minecraft:dark_oak_leaves", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:dark_oak_leaves"], lore: [] },
    { id: "minecraft:mangrove_leaves", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:mangrove_leaves"], lore: [] },
    { id: "minecraft:cherry_leaves", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:cherry_leaves"], lore: [] },
    { id: "minecraft:azalea_leaves", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:azalea_leaves"], lore: [] },
    { id: "minecraft:flowering_azalea_leaves", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:flowering_azalea_leaves"], lore: [] },
    { id: "minecraft:red_mushroom_block", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:red_mushroom_block"], lore: [] },
    { id: "minecraft:nether_wart_block", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:nether_wart_block"], lore: [] },
    { id: "minecraft:shroomlight", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:shroomlight"], lore: [] },
    { id: "minecraft:warped_wart_block", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:warped_wart_block"], lore: [] },
    { id: "minecraft:honeycomb", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:honeycomb"], lore: [] },
    { id: "minecraft:glow_ink_sac", count: 1, price: BUILDINGBLOCKS_PRICES["minecraft:glow_ink_sac"], lore: [] },
    null,
    null
],
    // Tab 3 — (empty)
    [],
    // Tab 4 — (empty)
    [],
];

// ============================================================

var guiRef;
var mySlots = [];
var tabSlots = [];
var highlightLineIds = [];
var lastNpc = null;
var storedSlotItems = {};
var currentPage = 0;
var maxPages = CONFIG_MAX_PAGES;

// Viewport system
var viewportRow = 0;
var viewportRows = 6;
var totalRows = CONFIG_TAB_ROWS[0];
var numCols = 9;

// Currency conversion rates
var STONE_TO_COAL = 100;
var COAL_TO_EMERALD = 100;

// Component IDs
var ID_TAB_BASE    = 102;
var ID_SCROLL_UP   = 111;
var ID_SCROLL_DOWN = 112;

// ========== Layout ==========
var slotPositions = [];
var startX = 0;
var startY = -50;
var rowSpacing = 18;
var colSpacing = 18;
for (var row = 0; row < viewportRows; row++) {
    var y = startY + row * rowSpacing;
    for (var col = 0; col < numCols; col++) {
        var x = startX + col * colSpacing;
        slotPositions.push({x: x, y: y});
    }
}

function viewportToGlobal(slotIndex) {
    var localRow = Math.floor(slotIndex / numCols);
    var localCol = slotIndex % numCols;
    var globalRow = viewportRow + localRow;
    return globalRow * numCols + localCol;
}

function makeNullArray(n) {
    var a = new Array(n);
    for (var i = 0; i < n; i++) { a[i] = null; }
    return a;
}

// Build storedSlotItems from config
function buildShopDataFromConfig(player, api) {
    var shopData = {};
    for (var t = 0; t < CONFIG_MAX_PAGES; t++) {
        var rows = CONFIG_TAB_ROWS[t] || 5;
        var totalSlots = rows * numCols;
        var arr = makeNullArray(totalSlots);
        var items = CONFIG_SHOP_ITEMS[t] || [];
        for (var idx = 0; idx < items.length && idx < totalSlots; idx++) {
            var cfg = items[idx];
            if (!cfg) { arr[idx] = null; continue; }
            try {
                var item = player.world.createItem(cfg.id, cfg.count || 1);
                // Do NOT set a custom name — keep the item's default name
                var loreArr = cfg.lore ? cfg.lore.slice() : [];
                loreArr.push("");
                loreArr.push("§aPrice: §e" + (cfg.price || 0) + "¢");
                item.setLore(loreArr);
                arr[idx] = item.getItemNbt().toJsonString();
            } catch(e) {
                arr[idx] = null;
            }
        }
        shopData[t] = arr;
    }
    return shopData;
}

// ========== Open GUI ==========
function init(event) {
    event.npc.addScript("economy.js");
}

function interact(event) {
    var player = event.player;
    var api = event.API;
    lastNpc = event.npc;

    maxPages = CONFIG_MAX_PAGES;
    totalRows = CONFIG_TAB_ROWS[currentPage] || 5;

    // Build shop items from config
    storedSlotItems = buildShopDataFromConfig(player, api);

    var totalSlots = totalRows * numCols;
    if (!storedSlotItems[currentPage]) {
        storedSlotItems[currentPage] = makeNullArray(totalSlots);
    }

    highlightLineIds = [];

    if (!guiRef) {
        guiRef = api.createCustomGui(176, 166, 0, true, player);

        // Tabs
        var tabWidth = 25;
        var tabHeight = 28;
        var tabSpacing = 2;
        var tabStartX = 0;
        var tabY = -80;
        tabSlots = [];
        for (var i = 0; i < maxPages; i++) {
            var tabX = tabStartX + i * (tabWidth + tabSpacing);
            var tabSlot = guiRef.addItemSlot(tabX + 4, tabY + 5);
            tabSlots.push(tabSlot);
            guiRef.addButton(ID_TAB_BASE + i, "", tabX, tabY, tabWidth, tabHeight);
        }

        // Item slots
        mySlots = slotPositions.map(function(pos) {
            return guiRef.addItemSlot(pos.x, pos.y);
        });

        // Scroll buttons
        var scrollX = startX + (numCols * colSpacing) + 2;
        var scrollY = startY;
        guiRef.addButton(ID_SCROLL_UP,   "↑", scrollX, scrollY,      18, 18);
        guiRef.addButton(ID_SCROLL_DOWN, "↓", scrollX, scrollY + 20, 18, 18);
        guiRef.addLabel(10, "", scrollX + 1, scrollY + 42, 0.7, 0.7);

        // Set tab icons — only tab icons get a custom name
        for (var i = 0; i < tabSlots.length; i++) {
            try {
                var iconItem = player.world.createItem(CONFIG_TAB_ICONS[i] || "minecraft:barrier", 1);
                iconItem.setCustomName(CONFIG_TAB_NAMES[i] || ("Tab " + (i + 1)));
                tabSlots[i].setStack(iconItem);
            } catch(e) {}
        }

        player.showCustomGui(guiRef);
    } else {
        // GUI already exists, reload tab icons
        for (var i = 0; i < tabSlots.length; i++) {
            try {
                var iconItem = player.world.createItem(CONFIG_TAB_ICONS[i] || "minecraft:barrier", 1);
                iconItem.setCustomName(CONFIG_TAB_NAMES[i] || ("Tab " + (i + 1)));
                tabSlots[i].setStack(iconItem);
            } catch(e) {}
        }
    }

    // Highlight current tab
    try {
        guiRef.removeComponent(20);
        guiRef.removeComponent(21);
        guiRef.removeComponent(22);
        guiRef.removeComponent(23);
    } catch(e) {}
    try {
        var tabWidth = 25;
        var tabHeight = 28;
        var tabSpacing = 2;
        var tabStartX = 0;
        var tabY = -80;
        var highlightTabX = tabStartX + currentPage * (tabWidth + tabSpacing);
        guiRef.addColoredLine(20, highlightTabX - 1, tabY - 1, highlightTabX + tabWidth + 1, tabY - 1, 0xFFFF00, 2);
        guiRef.addColoredLine(21, highlightTabX - 1, tabY + tabHeight + 1, highlightTabX + tabWidth + 1, tabY + tabHeight + 1, 0xFFFF00, 2);
        guiRef.addColoredLine(22, highlightTabX - 1, tabY - 1, highlightTabX - 1, tabY + tabHeight + 1, 0xFFFF00, 2);
        guiRef.addColoredLine(23, highlightTabX + tabWidth + 1, tabY - 1, highlightTabX + tabWidth + 1, tabY + tabHeight + 1, 0xFFFF00, 2);
    } catch(e) {}

    updateVisibleSlots(player, api);
    updateScrollIndicator();
    if (guiRef) {
        guiRef.update();
    }
}

function updateScrollIndicator() {
    if (!guiRef) return;
    var maxViewportRow = Math.max(0, totalRows - viewportRows);
    try {
        guiRef.removeComponent(10);
        var scrollX = startX + (numCols * colSpacing) + 2;
        var scrollY = startY;
        guiRef.addLabel(10, "§7" + (viewportRow + 1) + "/" + (maxViewportRow + 1), scrollX + 1, scrollY + 42, 0.7, 0.7);
    } catch(e) {}
}

function updateVisibleSlots(player, api) {
    for (var i = 0; i < mySlots.length; i++) {
        mySlots[i].setStack(null);
        var globalIndex = viewportToGlobal(i);
        if (globalIndex < storedSlotItems[currentPage].length && storedSlotItems[currentPage][globalIndex]) {
            try {
                var item = player.world.createItemFromNbt(api.stringToNbt(storedSlotItems[currentPage][globalIndex]));
                mySlots[i].setStack(item);
            } catch(e) {}
        }
    }
}

function customGuiButton(event) {
    var player = event.player;
    var api = event.API;
    var maxViewportRow = Math.max(0, totalRows - viewportRows);

    if (event.buttonId === ID_SCROLL_UP) {
        if (viewportRow > 0) {
            viewportRow--;
            updateVisibleSlots(player, api);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }

    if (event.buttonId === ID_SCROLL_DOWN) {
        if (viewportRow < maxViewportRow) {
            viewportRow++;
            updateVisibleSlots(player, api);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }

    if (event.buttonId >= ID_TAB_BASE && event.buttonId < ID_TAB_BASE + maxPages) {
        var tabIndex = event.buttonId - ID_TAB_BASE;
        if (tabIndex !== currentPage) {
            currentPage = tabIndex;
            viewportRow = 0;
            totalRows = CONFIG_TAB_ROWS[currentPage] || 5;
            storedSlotItems = buildShopDataFromConfig(player, api);
            if (!storedSlotItems[currentPage]) {
                storedSlotItems[currentPage] = makeNullArray(totalRows * numCols);
            }
            try {
                guiRef.removeComponent(20);
                guiRef.removeComponent(21);
                guiRef.removeComponent(22);
                guiRef.removeComponent(23);
            } catch(e) {}
            try {
                var tw = 25, th = 28, ts = 2, tx = 0, ty = -80;
                var hx = tx + currentPage * (tw + ts);
                guiRef.addColoredLine(20, hx - 1,      ty - 1,      hx + tw + 1, ty - 1,      0xFFFF00, 2);
                guiRef.addColoredLine(21, hx - 1,      ty + th + 1, hx + tw + 1, ty + th + 1, 0xFFFF00, 2);
                guiRef.addColoredLine(22, hx - 1,      ty - 1,      hx - 1,      ty + th + 1, 0xFFFF00, 2);
                guiRef.addColoredLine(23, hx + tw + 1, ty - 1,      hx + tw + 1, ty + th + 1, 0xFFFF00, 2);
            } catch(e) {}
            updateVisibleSlots(player, api);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }
}

function customGuiSlotClicked(event) {
    var clickedSlot = event.slot;
    var player = event.player;
    var api = event.API;
    var slotIndex = mySlots.indexOf(clickedSlot);

    if (slotIndex === -1) return;

    var globalIndex = viewportToGlobal(slotIndex);
    if (globalIndex >= storedSlotItems[currentPage].length) return;

    var item = mySlots[slotIndex].getStack();
    if (!item || item.isEmpty()) return;

    var price = null;
    var lore = item.getLore();
    for (var i = 0; i < lore.length; i++) {
        var line = lore[i];
        if (line.indexOf("Price:") !== -1 && line.indexOf("¢") !== -1) {
            var priceStr = line.replace(/§./g, "");
            var match = priceStr.match(/Price:\s*(\d+)¢/);
            if (match && match[1]) { price = parseInt(match[1]); break; }
        }
    }

    if (price === null || price === undefined) {
        player.message("§cThis item has no price set!");
        return;
    }



        var playerCoins = countPlayerCoins(player);
        if (playerCoins < price) {
        player.message("§cNot enough coins! Need: §e" + price + "¢ §c, Have: §e" + playerCoins + "¢");
        return;
    }

    removeCoins(player, price);

    try {
        if (storedSlotItems[currentPage][globalIndex]) {
            var purchaseItem = player.world.createItemFromNbt(api.stringToNbt(storedSlotItems[currentPage][globalIndex]));
            var purchaseLore = purchaseItem.getLore();
            var cleanLore = [];
            for (var i = 0; i < purchaseLore.length; i++) {
                var line = purchaseLore[i];
                if (line.indexOf("Price:") === -1 && line.indexOf("Click to purchase") === -1) {
                    cleanLore.push(line);
                }
            }
            while (cleanLore.length > 0 && cleanLore[cleanLore.length - 1] === "") { cleanLore.pop(); }
            purchaseItem.setLore(cleanLore);
            player.giveItem(purchaseItem);
            player.message("§aPurchased item for §e" + price + "¢!");
        }
    } catch(e) {
        player.message("§cError purchasing item: " + e);
    }
}

function customGuiClosed(event) {
    guiRef = null;
    viewportRow = 0;
    currentPage = 0;
}

function countPlayerCoins(player) {
    var stoneTotal = 0;
    var coalTotal = 0;
    var emeraldTotal = 0;
    var inv = player.getInventory();
    for (var i = 0; i < inv.getSize(); i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty()) {
            var name = stack.getName();
            if      (name === "coins:stone_coin")   stoneTotal   += stack.getStackSize();
            else if (name === "coins:coal_coin")    coalTotal    += stack.getStackSize();
            else if (name === "coins:emerald_coin") emeraldTotal += stack.getStackSize();
        }
    }
    return stoneTotal + (coalTotal * STONE_TO_COAL) + (emeraldTotal * STONE_TO_COAL * COAL_TO_EMERALD);
}

function removeCoins(player, amount) {
    var remaining = amount;
    var inv = player.getInventory();

    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty() && stack.getName() === "coins:stone_coin") {
            var stackAmount = stack.getStackSize();
            if (stackAmount <= remaining) { inv.setSlot(i, null); remaining -= stackAmount; }
            else { stack.setStackSize(stackAmount - remaining); remaining = 0; }
        }
    }

    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty() && stack.getName() === "coins:coal_coin") {
            var stackAmount = stack.getStackSize();
            var stoneValue = stackAmount * STONE_TO_COAL;
            if (stoneValue <= remaining) { inv.setSlot(i, null); remaining -= stoneValue; }
            else {
                var coalsNeeded = Math.ceil(remaining / STONE_TO_COAL);
                stack.setStackSize(stackAmount - coalsNeeded);
                var overpaid = (coalsNeeded * STONE_TO_COAL) - remaining;
                remaining = 0;
                if (overpaid > 0) player.giveItem(player.world.createItem("coins:stone_coin", overpaid));
            }
        }
    }

    for (var i = 0; i < inv.getSize() && remaining > 0; i++) {
        var stack = inv.getSlot(i);
        if (stack && !stack.isEmpty() && stack.getName() === "coins:emerald_coin") {
            var stackAmount = stack.getStackSize();
            var stoneValue = stackAmount * STONE_TO_COAL * COAL_TO_EMERALD;
            if (stoneValue <= remaining) { inv.setSlot(i, null); remaining -= stoneValue; }
            else {
                var emeraldsNeeded = Math.ceil(remaining / (STONE_TO_COAL * COAL_TO_EMERALD));
                stack.setStackSize(stackAmount - emeraldsNeeded);
                var overpaid = (emeraldsNeeded * STONE_TO_COAL * COAL_TO_EMERALD) - remaining;
                remaining = 0;
                var changeCoal  = Math.floor(overpaid / STONE_TO_COAL);
                var changeStone = overpaid % STONE_TO_COAL;
                if (changeCoal  > 0) player.giveItem(player.world.createItem("coins:coal_coin",  changeCoal));
                if (changeStone > 0) player.giveItem(player.world.createItem("coins:stone_coin", changeStone));
            }
        }
    }
}
