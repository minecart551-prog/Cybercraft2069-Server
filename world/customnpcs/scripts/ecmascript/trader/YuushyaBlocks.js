// ============================================================
//  SHOP CONFIGURATION — Edit everything here
// ============================================================

var CONFIG_MAX_PAGES = 4;

var CONFIG_TAB_ICONS = [
    "yuushya:decorative_light_blue_wool",
    "yuushya:fire_hydrant",
    "yuushya:iron_hollow_stairs_0",
    "yuushya:cyan_windows_door",
];

var CONFIG_TAB_NAMES = [
    "Yuushya Blocks",
    "Facilities",
    "Extra Shapes",
    "Windows",
];

var CONFIG_TAB_ROWS = [
    28,
    8,
    19,
    8,
];

var CONFIG_SHOP_ITEMS = [
    // Tab 0 — Yuushya Blocks
[
    { id: "yuushya:columned_sandstone_a", count: 1, price: 5, lore: [] },
    { id: "yuushya:columned_sandstone_b", count: 1, price: 5, lore: [] },
    { id: "yuushya:sandstone_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:japanese_wall", count: 1, price: 5, lore: [] },
    { id: "yuushya:tatami", count: 1, price: 5, lore: [] },
    { id: "yuushya:tatami_rotated", count: 1, price: 5, lore: [] },
    { id: "yuushya:straw_mat_a", count: 1, price: 5, lore: [] },
    { id: "yuushya:straw_mat_b", count: 1, price: 5, lore: [] },
    { id: "yuushya:grass", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_metal_blindwall_0", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_metal_blindwall_1", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_metal_blindwall_0", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_metal_blindwall_1", count: 1, price: 5, lore: [] },
    { id: "yuushya:blue_metal", count: 1, price: 5, lore: [] },
    { id: "yuushya:familymart_acrylic_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:familymart_acrylic_bottom", count: 1, price: 5, lore: [] },
    { id: "yuushya:warning_sign", count: 1, price: 5, lore: [] },
    { id: "yuushya:tree_base", count: 1, price: 5, lore: [] },
    { id: "yuushya:colorful_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:wore_metal", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_black_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_blue_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_brown_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_cyan_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_gray_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_green_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_light_blue_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_light_gray_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_lime_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_magenta_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_orange_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_pink_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_purple_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_red_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_white_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_yellow_wool", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_black_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_blue_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_brown_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_cyan_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_gray_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_green_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_light_blue_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_light_gray_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_lime_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_magenta_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_orange_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_pink_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_purple_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_red_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_yellow_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:decorative_white_wool_plain", count: 1, price: 5, lore: [] },
    { id: "yuushya:market_block_blue", count: 1, price: 5, lore: [] },
    { id: "yuushya:market_block_brown", count: 1, price: 5, lore: [] },
    { id: "yuushya:market_block_green", count: 1, price: 5, lore: [] },
    { id: "yuushya:market_block_light_gray", count: 1, price: 5, lore: [] },
    { id: "yuushya:market_block_mixed", count: 1, price: 5, lore: [] },
    { id: "yuushya:market_block_purple", count: 1, price: 5, lore: [] },
    { id: "yuushya:market_block_red", count: 1, price: 5, lore: [] },
    { id: "yuushya:quartz_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:black_framed_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:black_framed_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:light_blue_framed_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:light_blue_framed_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:lime_framed_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:lime_framed_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:red_framed_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:red_framed_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:yellow_framed_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:yellow_framed_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:blue_framed_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:blue_framed_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:purple_framed_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:purple_framed_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_black_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_black_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_blue_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_blue_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_brown_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_brown_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_cyan_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_cyan_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_gray_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_gray_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_green_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_green_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_light_blue_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_light_blue_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_light_gray_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_white_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_yellow_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_yellow_blindwall", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_black_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_black_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_black_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_black_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_blue_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_blue_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_blue_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_blue_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_brown_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_brown_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_brown_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_brown_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_cyan_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_cyan_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_cyan_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_cyan_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_gray_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_gray_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_gray_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_gray_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_green_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_green_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_green_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_green_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_light_blue_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_light_blue_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_light_blue_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_light_blue_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_light_gray_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_light_gray_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_light_gray_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_light_gray_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_lime_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_lime_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_lime_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_lime_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_magenta_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_magenta_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_magenta_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_magenta_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_orange_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_orange_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_orange_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_orange_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_pink_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_pink_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_pink_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_pink_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_purple_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_purple_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_purple_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_purple_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_red_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_red_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_red_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_red_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_white_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_white_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_white_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_white_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_yellow_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_yellow_horizontal_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:a_yellow_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:b_yellow_vertical_compact", count: 1, price: 5, lore: [] },
    { id: "yuushya:black_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:blue_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:brown_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:cyan_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:gray_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:green_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:light_blue_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:light_gray_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:lime_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:magenta_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:orange_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:pink_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:red_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:purple_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:white_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:yellow_concrete_top", count: 1, price: 5, lore: [] },
    { id: "yuushya:black_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:blue_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:brown_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:cyan_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:gray_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:green_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:light_blue_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:light_gray_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:lime_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:magenta_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:orange_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:pink_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:purple_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:red_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:white_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:yellow_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_black_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_black_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_black_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_black_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_light_blue_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_light_blue_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_light_blue_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_light_blue_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_lime_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_lime_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_lime_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_lime_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_red_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_red_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_red_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_red_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_yellow_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_yellow_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_yellow_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_yellow_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_blue_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_blue_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_blue_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_blue_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_purple_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:horizontal_chiseled_purple_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_purple_acrylic", count: 1, price: 5, lore: [] },
    { id: "yuushya:vertical_chiseled_purple_acrylic_alt", count: 1, price: 5, lore: [] },
    { id: "yuushya:road_marking_0", count: 1, price: 5, lore: [] },
    { id: "yuushya:road_marking_1", count: 1, price: 5, lore: [] },
    { id: "yuushya:road_marking_2", count: 1, price: 5, lore: [] },
    { id: "yuushya:road_marking_3", count: 1, price: 5, lore: [] },
    { id: "yuushya:road_marking_4", count: 1, price: 5, lore: [] },
    { id: "yuushya:road_marking_5", count: 1, price: 5, lore: [] },
    { id: "yuushya:road_marking_6", count: 1, price: 5, lore: [] },
    { id: "yuushya:road_marking_7", count: 1, price: 5, lore: [] },
    { id: "yuushya:road_marking_arrow_backward", count: 1, price: 5, lore: [] },
    { id: "yuushya:road_marking_arrow_forward", count: 1, price: 5, lore: [] },
    { id: "yuushya:road_marking_arrow_left", count: 1, price: 5, lore: [] },
    { id: "yuushya:road_marking_arrow_right", count: 1, price: 5, lore: [] },
    null
],
// Facliliteis
[
{ id: "yuushya:burglar_mesh", count: 1, price: 25, lore: [] },
{ id: "yuushya:iron_burglar_mesh", count: 1, price: 35, lore: [] },
{ id: "yuushya:steel_structure", count: 1, price: 20, lore: [] },
{ id: "yuushya:steel_structure_horizontal", count: 1, price: 20, lore: [] },
{ id: "yuushya:steel_structure_vertical", count: 1, price: 20, lore: [] },
{ id: "yuushya:steel_structure_big_vertical", count: 1, price: 25, lore: [] },
{ id: "yuushya:steel_structure_big_horizontal", count: 1, price: 25, lore: [] },
{ id: "yuushya:crate", count: 1, price: 15, lore: [] },
{ id: "yuushya:crate_horizontal", count: 1, price: 15, lore: [] },
{ id: "yuushya:crate_vertical", count: 1, price: 15, lore: [] },
{ id: "yuushya:exit_sign", count: 1, price: 20, lore: [] },
{ id: "yuushya:exit_sign_sym", count: 1, price: 20, lore: [] },
{ id: "yuushya:exit_sign_middle", count: 1, price: 20, lore: [] },
{ id: "yuushya:public_toilet_sign", count: 1, price: 20, lore: [] },
{ id: "yuushya:public_toilet_sign_man", count: 1, price: 20, lore: [] },
{ id: "yuushya:public_toilet_sign_woman", count: 1, price: 20, lore: [] },
{ id: "yuushya:stone_pier", count: 1, price: 30, lore: [] },
{ id: "yuushya:safe", count: 1, price: 80, lore: [] },
{ id: "yuushya:unlocked_safe", count: 1, price: 80, lore: [] },
{ id: "yuushya:tall_safe", count: 1, price: 100, lore: [] },
{ id: "yuushya:drain", count: 1, price: 15, lore: [] },
{ id: "yuushya:drainage_channel", count: 1, price: 15, lore: [] },
{ id: "yuushya:drainage_channel_", count: 1, price: 15, lore: [] },
{ id: "yuushya:scroll_door_0", count: 1, price: 50, lore: [] },
{ id: "yuushya:scroll_door_1", count: 1, price: 50, lore: [] },
{ id: "yuushya:recycle_bin_0", count: 1, price: 20, lore: [] },
{ id: "yuushya:recycle_bin_1", count: 1, price: 20, lore: [] },
{ id: "yuushya:recycle_bin_2", count: 1, price: 20, lore: [] },
{ id: "yuushya:recycle_bin_3", count: 1, price: 20, lore: [] },
{ id: "yuushya:recycle_bin_4", count: 1, price: 20, lore: [] },
{ id: "yuushya:recycle_bin_5", count: 1, price: 20, lore: [] },
{ id: "yuushya:fire_hydrant", count: 1, price: 40, lore: [] },
{ id: "yuushya:fire_extinguisher", count: 1, price: 35, lore: [] },
{ id: "yuushya:cctv_camera", count: 1, price: 45, lore: [] },
{ id: "yuushya:ceiling_cctv_camera", count: 1, price: 45, lore: [] },
{ id: "yuushya:spiral_razor_wire", count: 1, price: 30, lore: [] },
{ id: "yuushya:power_house", count: 1, price: 60, lore: [] },
{ id: "yuushya:rusty_power_house", count: 1, price: 30, lore: [] },
{ id: "yuushya:power_distributor", count: 1, price: 50, lore: [] },
{ id: "yuushya:utility_pole", count: 1, price: 35, lore: [] },
{ id: "yuushya:horizontal_utility_pole", count: 1, price: 35, lore: [] },
{ id: "yuushya:utility_pole_cross", count: 1, price: 35, lore: [] },
{ id: "yuushya:wire", count: 1, price: 10, lore: [] },
{ id: "yuushya:deployed_utility_service_drop", count: 1, price: 20, lore: [] },
{ id: "yuushya:mounted_utility_service_drop", count: 1, price: 20, lore: [] },
{ id: "yuushya:voltage_transformer", count: 1, price: 55, lore: [] },
{ id: "yuushya:basketball_net", count: 1, price: 30, lore: [] },
{ id: "yuushya:basketball_hoop_head", count: 1, price: 35, lore: [] },
{ id: "yuushya:generator", count: 1, price: 70, lore: [] },
{ id: "yuushya:ventilator", count: 1, price: 40, lore: [] },
{ id: "yuushya:ventilator_outer_part", count: 1, price: 40, lore: [] },
{ id: "yuushya:rusty_ventilator", count: 1, price: 20, lore: [] },
{ id: "yuushya:rusty_ventilator_outer_part", count: 1, price: 20, lore: [] },
{ id: "yuushya:platform_metal", count: 1, price: 25, lore: [] },
{ id: "yuushya:satellite_dish", count: 1, price: 60, lore: [] },
{ id: "yuushya:soot_pipe", count: 1, price: 15, lore: [] },
{ id: "yuushya:soot_pipe_horizontal", count: 1, price: 15, lore: [] },
{ id: "yuushya:soot_pipe_bottom", count: 1, price: 15, lore: [] },
{ id: "yuushya:soot_pipe_top", count: 1, price: 15, lore: [] },
{ id: "yuushya:soot_pipe_top_corner", count: 1, price: 15, lore: [] },
{ id: "yuushya:soot_pipe_exhaust", count: 1, price: 15, lore: [] },
{ id: "yuushya:pipe_vertical", count: 1, price: 15, lore: [] },
{ id: "yuushya:pipe_horizontal", count: 1, price: 15, lore: [] },
{ id: "yuushya:mounted_pipe_vertical", count: 1, price: 15, lore: [] },
{ id: "yuushya:mounted_pipe_horizontal", count: 1, price: 15, lore: [] },
{ id: "yuushya:pipe_corner_bottom_left", count: 1, price: 15, lore: [] },
{ id: "yuushya:pipe_corner_bottom_right", count: 1, price: 15, lore: [] },
{ id: "yuushya:pipe_corner_top_left", count: 1, price: 15, lore: [] },
{ id: "yuushya:pipe_corner_top_right", count: 1, price: 15, lore: [] },
{ id: "yuushya:pipe_hub", count: 1, price: 20, lore: [] },
{ id: "yuushya:gas_pump", count: 1, price: 55, lore: [] },
{ id: "yuushya:street_phone", count: 1, price: 45, lore: [] },

],

//Extra shapes
    [
{ id: "yuushya:stairs", count: 1, price: 15, lore: [] },
{ id: "yuushya:slab", count: 1, price: 10, lore: [] },
{ id: "yuushya:side_slab", count: 1, price: 10, lore: [] },
{ id: "yuushya:ridge", count: 1, price: 10, lore: [] },
{ id: "yuushya:half_slab", count: 1, price: 10, lore: [] },
{ id: "yuushya:half_side_slab", count: 1, price: 10, lore: [] },
{ id: "yuushya:column", count: 1, price: 15, lore: [] },
{ id: "yuushya:post", count: 1, price: 12, lore: [] },
{ id: "yuushya:pole", count: 1, price: 10, lore: [] },
{ id: "yuushya:stick", count: 1, price: 8, lore: [] },
{ id: "yuushya:horizontal_column", count: 1, price: 15, lore: [] },
{ id: "yuushya:horizontal_post", count: 1, price: 12, lore: [] },
{ id: "yuushya:horizontal_pole", count: 1, price: 10, lore: [] },
{ id: "yuushya:horizontal_stick", count: 1, price: 8, lore: [] },
{ id: "yuushya:snow_layer", count: 1, price: 8, lore: [] },
{ id: "yuushya:platform", count: 1, price: 15, lore: [] },
{ id: "yuushya:white_bow_gift_box", count: 1, price: 20, lore: [] },
{ id: "yuushya:black_bow_gift_box", count: 1, price: 20, lore: [] },
{ id: "yuushya:white_bow_small_gift_box", count: 1, price: 15, lore: [] },
{ id: "yuushya:black_bow_small_gift_box", count: 1, price: 15, lore: [] },
{ id: "yuushya:decorative_shelf", count: 1, price: 25, lore: [] },
{ id: "yuushya:mounted_fern_pot", count: 1, price: 20, lore: [] },
{ id: "yuushya:frame_top", count: 1, price: 15, lore: [] },
{ id: "yuushya:frame_bottom", count: 1, price: 15, lore: [] },
{ id: "yuushya:frame_left", count: 1, price: 15, lore: [] },
{ id: "yuushya:frame_right", count: 1, price: 15, lore: [] },
{ id: "yuushya:fence", count: 1, price: 15, lore: [] },
{ id: "yuushya:fence_corner", count: 1, price: 15, lore: [] },
{ id: "yuushya:new_fence", count: 1, price: 18, lore: [] },
{ id: "yuushya:bucket", count: 1, price: 15, lore: [] },
{ id: "yuushya:hollow_stairs", count: 1, price: 18, lore: [] },
{ id: "yuushya:handrail_left", count: 1, price: 15, lore: [] },
{ id: "yuushya:handrail_middle", count: 1, price: 15, lore: [] },
{ id: "yuushya:handrail_right", count: 1, price: 15, lore: [] },

{ id: "yuushya:cart", count: 1, price: 30, lore: [] },
{ id: "yuushya:board", count: 1, price: 20, lore: [] },
{ id: "yuushya:bottle_container", count: 1, price: 20, lore: [] },

{ id: "yuushya:warning_slab", count: 1, price: 12, lore: [] },

{ id: "yuushya:roof_0", count: 1, price: 20, lore: [] },
{ id: "yuushya:roof_1", count: 1, price: 20, lore: [] },
{ id: "yuushya:roof_2", count: 1, price: 20, lore: [] },
{ id: "yuushya:roof_3", count: 1, price: 20, lore: [] },
{ id: "yuushya:roof_ridge_0", count: 1, price: 15, lore: [] },
{ id: "yuushya:roof_ridge_1", count: 1, price: 15, lore: [] },
{ id: "yuushya:roof_ridge_2", count: 1, price: 15, lore: [] },
{ id: "yuushya:roof_ridge_3", count: 1, price: 15, lore: [] },
{ id: "yuushya:roof_corner_0_outer", count: 1, price: 20, lore: [] },
{ id: "yuushya:roof_corner_0_inner", count: 1, price: 20, lore: [] },
{ id: "yuushya:roof_corner_1_outer", count: 1, price: 20, lore: [] },
{ id: "yuushya:roof_corner_1_inner", count: 1, price: 20, lore: [] },
{ id: "yuushya:roof_corner_2_outer", count: 1, price: 20, lore: [] },
{ id: "yuushya:roof_corner_2_inner", count: 1, price: 20, lore: [] },
{ id: "yuushya:roof_corner_3_outer", count: 1, price: 20, lore: [] },
{ id: "yuushya:roof_corner_3_inner", count: 1, price: 20, lore: [] },
{ id: "yuushya:iron_ladder", count: 1, price: 25, lore: [] },
{ id: "yuushya:iron_ladder_top", count: 1, price: 25, lore: [] },
{ id: "yuushya:road_fence", count: 1, price: 20, lore: [] },
{ id: "yuushya:sideway_road_fence", count: 1, price: 20, lore: [] },
{ id: "yuushya:stone_fence", count: 1, price: 20, lore: [] },
{ id: "yuushya:stone_handrail_left", count: 1, price: 20, lore: [] },
{ id: "yuushya:stone_handrail_right", count: 1, price: 20, lore: [] },
{ id: "yuushya:stone_handrail_middle", count: 1, price: 20, lore: [] },
{ id: "yuushya:iron_fence", count: 1, price: 25, lore: [] },
{ id: "yuushya:black_iron_fence", count: 1, price: 25, lore: [] },
{ id: "yuushya:tall_classical_fence", count: 1, price: 35, lore: [] },
{ id: "yuushya:iron_hollow_stairs_0", count: 1, price: 30, lore: [] },
{ id: "yuushya:iron_hollow_stairs_1", count: 1, price: 30, lore: [] },
{ id: "yuushya:tall_iron_fence_middle_support", count: 1, price: 30, lore: [] },
{ id: "yuushya:tall_iron_fence_middle", count: 1, price: 30, lore: [] },
{ id: "yuushya:tall_iron_fence_left", count: 1, price: 30, lore: [] },
{ id: "yuushya:tall_iron_fence_right", count: 1, price: 30, lore: [] },
{ id: "yuushya:tall_iron_fence_stairs", count: 1, price: 30, lore: [] },
{ id: "yuushya:tall_iron_fence_stairs_sym", count: 1, price: 30, lore: [] },
{ id: "yuushya:black_tall_iron_fence_middle_support", count: 1, price: 30, lore: [] },
{ id: "yuushya:black_tall_iron_fence_middle", count: 1, price: 30, lore: [] },
{ id: "yuushya:black_tall_iron_fence_left", count: 1, price: 30, lore: [] },
{ id: "yuushya:black_tall_iron_fence_right", count: 1, price: 30, lore: [] },
{ id: "yuushya:black_tall_iron_fence_stairs", count: 1, price: 30, lore: [] },
{ id: "yuushya:black_tall_iron_fence_stairs_sym", count: 1, price: 30, lore: [] },
{ id: "yuushya:white_curtain", count: 1, price: 20, lore: [] },
{ id: "yuushya:red_curtain", count: 1, price: 20, lore: [] },
{ id: "yuushya:blue_curtain", count: 1, price: 20, lore: [] },
{ id: "yuushya:yellow_curtain", count: 1, price: 20, lore: [] },
{ id: "yuushya:cyan_curtain", count: 1, price: 20, lore: [] },
{ id: "yuushya:grille_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:grille_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:grille_2", count: 1, price: 25, lore: [] },
{ id: "yuushya:retaining_wall", count: 1, price: 15, lore: [] },
{ id: "yuushya:retaining_wall_top", count: 1, price: 15, lore: [] },
{ id: "yuushya:retaining_wall_corner", count: 1, price: 15, lore: [] },
{ id: "yuushya:retaining_wall_top_corner", count: 1, price: 15, lore: [] },
{ id: "yuushya:half_carved_retaining_wall_0", count: 1, price: 15, lore: [] },
{ id: "yuushya:half_carved_retaining_wall_1", count: 1, price: 15, lore: [] },
{ id: "yuushya:half_hollow_retaining_wall_0", count: 1, price: 15, lore: [] },
{ id: "yuushya:half_hollow_retaining_wall_1", count: 1, price: 15, lore: [] },
{ id: "yuushya:half_carved_retaining_wall_top_0", count: 1, price: 15, lore: [] },
{ id: "yuushya:half_carved_retaining_wall_top_1", count: 1, price: 15, lore: [] },
{ id: "yuushya:half_hollow_retaining_wall_top_0", count: 1, price: 15, lore: [] },
{ id: "yuushya:half_hollow_retaining_wall_top_1", count: 1, price: 15, lore: [] },
{ id: "yuushya:white_wall_frame", count: 1, price: 25, lore: [] },
{ id: "yuushya:pale_wall_frame", count: 1, price: 25, lore: [] },
{ id: "yuushya:stone_wall_frame", count: 1, price: 25, lore: [] },
{ id: "yuushya:marble_column", count: 1, price: 40, lore: [] },
{ id: "yuushya:marble_fence", count: 1, price: 35, lore: [] },
{ id: "yuushya:classical_white_window_sideway_frame", count: 1, price: 30, lore: [] },
{ id: "yuushya:elaborate_white_window_sideway_frame", count: 1, price: 35, lore: [] },
{ id: "yuushya:classical_white_window_bottom", count: 1, price: 30, lore: [] },
{ id: "yuushya:classical_white_window_top", count: 1, price: 30, lore: [] },
{ id: "yuushya:classical_white_window_top_round", count: 1, price: 35, lore: [] },
{ id: "yuushya:classical_half_round_windows_frame_top_left", count: 1, price: 35, lore: [] },
{ id: "yuushya:classical_half_round_windows_frame_top_right", count: 1, price: 35, lore: [] },
{ id: "yuushya:classical_white_window_top_round_alt", count: 1, price: 35, lore: [] },
{ id: "yuushya:classical_white_trim", count: 1, price: 25, lore: [] },
{ id: "yuushya:classical_white_door_top", count: 1, price: 30, lore: [] },
{ id: "yuushya:tiles_fix_lower", count: 1, price: 10, lore: [] },
{ id: "yuushya:tiles_fix_upper", count: 1, price: 10, lore: [] },
{ id: "yuushya:orange_tile_lower", count: 1, price: 15, lore: [] },
{ id: "yuushya:orange_tile_upper", count: 1, price: 15, lore: [] },
{ id: "yuushya:orange_tile_ridge_upper", count: 1, price: 15, lore: [] },
{ id: "yuushya:orange_tile_ridge_lower", count: 1, price: 15, lore: [] },
{ id: "yuushya:orange_tile_with_ridge_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:orange_tile_with_ridge_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:dark_tile_lower", count: 1, price: 15, lore: [] },
{ id: "yuushya:dark_tile_upper", count: 1, price: 15, lore: [] },
{ id: "yuushya:dark_tile_ridge_upper", count: 1, price: 15, lore: [] },
{ id: "yuushya:dark_tile_ridge_lower", count: 1, price: 15, lore: [] },
{ id: "yuushya:dark_tile_with_ridge_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:dark_tile_with_ridge_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:gray_tile_lower", count: 1, price: 15, lore: [] },
{ id: "yuushya:gray_tile_upper", count: 1, price: 15, lore: [] },
{ id: "yuushya:gray_tile_ridge_upper", count: 1, price: 15, lore: [] },
{ id: "yuushya:gray_tile_ridge_lower", count: 1, price: 15, lore: [] },
{ id: "yuushya:gray_tile_with_ridge_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:gray_tile_with_ridge_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:blue_tile_lower", count: 1, price: 15, lore: [] },
{ id: "yuushya:blue_tile_upper", count: 1, price: 15, lore: [] },
{ id: "yuushya:blue_tile_ridge_upper", count: 1, price: 15, lore: [] },
{ id: "yuushya:blue_tile_ridge_lower", count: 1, price: 15, lore: [] },
{ id: "yuushya:blue_tile_with_ridge_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:blue_tile_with_ridge_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:pale_tile_lower", count: 1, price: 15, lore: [] },
{ id: "yuushya:pale_tile_upper", count: 1, price: 15, lore: [] },
{ id: "yuushya:pale_tile_ridge_upper", count: 1, price: 15, lore: [] },
{ id: "yuushya:pale_tile_ridge_lower", count: 1, price: 15, lore: [] },
{ id: "yuushya:pale_tile_with_ridge_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:pale_tile_with_ridge_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:orange_tile_outer_corner_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:orange_tile_inner_corner_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:orange_tile_outer_corner_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:orange_tile_inner_corner_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:dark_tile_outer_corner_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:dark_tile_inner_corner_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:dark_tile_outer_corner_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:dark_tile_inner_corner_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:gray_tile_outer_corner_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:gray_tile_inner_corner_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:gray_tile_outer_corner_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:gray_tile_inner_corner_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:blue_tile_outer_corner_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:blue_tile_inner_corner_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:blue_tile_outer_corner_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:blue_tile_inner_corner_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:pale_tile_outer_corner_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:pale_tile_inner_corner_upper", count: 1, price: 18, lore: [] },
{ id: "yuushya:pale_tile_outer_corner_lower", count: 1, price: 18, lore: [] },
{ id: "yuushya:pale_tile_inner_corner_lower", count: 1, price: 18, lore: [] },
],
    //windows
    [

{ id: "yuushya:white_windows_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:white_windows_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:white_windows_2", count: 1, price: 25, lore: [] },
{ id: "yuushya:white_windows_corner_0", count: 1, price: 30, lore: [] },
{ id: "yuushya:white_windows_corner_1", count: 1, price: 30, lore: [] },
{ id: "yuushya:white_windows_deviated_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:white_windows_deviated_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:white_windows_open_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:white_windows_open_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:white_windows_diagonal", count: 1, price: 30, lore: [] },
{ id: "yuushya:white_windows_door", count: 1, price: 40, lore: [] },
{ id: "yuushya:white_windows_door_slide", count: 1, price: 45, lore: [] },
{ id: "yuushya:red_windows_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:red_windows_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:red_windows_2", count: 1, price: 25, lore: [] },
{ id: "yuushya:red_windows_corner_0", count: 1, price: 30, lore: [] },
{ id: "yuushya:red_windows_corner_1", count: 1, price: 30, lore: [] },
{ id: "yuushya:red_windows_deviated_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:red_windows_deviated_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:red_windows_open_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:red_windows_open_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:red_windows_diagonal", count: 1, price: 30, lore: [] },
{ id: "yuushya:red_windows_door", count: 1, price: 40, lore: [] },
{ id: "yuushya:red_windows_door_slide", count: 1, price: 45, lore: [] },
{ id: "yuushya:gray_windows_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:gray_windows_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:gray_windows_2", count: 1, price: 25, lore: [] },
{ id: "yuushya:gray_windows_corner_0", count: 1, price: 30, lore: [] },
{ id: "yuushya:gray_windows_corner_1", count: 1, price: 30, lore: [] },
{ id: "yuushya:gray_windows_deviated_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:gray_windows_deviated_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:gray_windows_open_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:gray_windows_open_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:gray_windows_diagonal", count: 1, price: 30, lore: [] },
{ id: "yuushya:gray_windows_door", count: 1, price: 40, lore: [] },
{ id: "yuushya:gray_windows_door_slide", count: 1, price: 45, lore: [] },
{ id: "yuushya:cyan_windows_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:cyan_windows_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:cyan_windows_2", count: 1, price: 25, lore: [] },
{ id: "yuushya:cyan_windows_corner_0", count: 1, price: 30, lore: [] },
{ id: "yuushya:cyan_windows_corner_1", count: 1, price: 30, lore: [] },
{ id: "yuushya:cyan_windows_deviated_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:cyan_windows_deviated_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:cyan_windows_open_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:cyan_windows_open_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:cyan_windows_diagonal", count: 1, price: 30, lore: [] },
{ id: "yuushya:cyan_windows_door", count: 1, price: 40, lore: [] },
{ id: "yuushya:cyan_windows_door_slide", count: 1, price: 45, lore: [] },
{ id: "yuushya:oak_windows_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:oak_windows_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:oak_windows_2", count: 1, price: 25, lore: [] },
{ id: "yuushya:oak_windows_corner_0", count: 1, price: 30, lore: [] },
{ id: "yuushya:oak_windows_corner_1", count: 1, price: 30, lore: [] },
{ id: "yuushya:oak_windows_deviated_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:oak_windows_deviated_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:oak_windows_open_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:oak_windows_open_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:oak_windows_diagonal", count: 1, price: 30, lore: [] },
{ id: "yuushya:oak_windows_door", count: 1, price: 40, lore: [] },
{ id: "yuushya:oak_windows_door_slide", count: 1, price: 45, lore: [] },
{ id: "yuushya:black_windows_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:black_windows_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:black_windows_2", count: 1, price: 25, lore: [] },
{ id: "yuushya:black_windows_corner_0", count: 1, price: 30, lore: [] },
{ id: "yuushya:black_windows_corner_1", count: 1, price: 30, lore: [] },
{ id: "yuushya:black_windows_deviated_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:black_windows_deviated_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:black_windows_open_0", count: 1, price: 25, lore: [] },
{ id: "yuushya:black_windows_open_1", count: 1, price: 25, lore: [] },
{ id: "yuushya:black_windows_diagonal", count: 1, price: 30, lore: [] },
{ id: "yuushya:black_windows_door", count: 1, price: 40, lore: [] },
{ id: "yuushya:black_windows_door_slide", count: 1, price: 45, lore: [] },


],
    
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


        var inv2 = player.getInventory();

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