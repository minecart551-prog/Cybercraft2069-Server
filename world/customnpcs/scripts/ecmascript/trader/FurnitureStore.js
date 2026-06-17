// ============================================================
//  SHOP CONFIGURATION — Edit everything here
// ============================================================
// Persistent state — survives GUI close/reopen
var savedPage = 0;
var savedViewportRow = 0;
var CONFIG_MAX_PAGES = 8;
var SELL_LOSS_PERCENTAGE = 0.3;
var CONFIG_TAB_ICONS = [
    { id: "webstreamer:big_tv", nbt: {} },
    { id: "yuushya:gothic_ceiling_lamp", nbt: {} },
    { id: "yuushya:monobloc", nbt: {} },
    { id: "yuushya:inner_bed_4", nbt: {} },
    { id: "yuushya:bottles", nbt: {} },
    { id: "yuushya:sink", nbt: {} },
    { id: "yuushya:globe", nbt: {} },
    { id: "yuushya:sign_0", nbt: {} },
    { id: "decocraft:usa", nbt: {} },
];

var CONFIG_TAB_NAMES = [
    "Electronics",
    "Lighting",
    "Seating & Tables",
    "Bedroom",
    "Kitchen",
    "Bathroom",
    "Decor & Misc",
    "Signs & Flags",
];

var CONFIG_TAB_ROWS = [
    12,
    10,
    17,
    7,
    17,
    6,
    49,
    13,
];
// ============================================================
//  VARIANT FORMAT
//
//  Items with color/material variants use the "variants" key.
//  "id" on the parent is used as the representative display item
//  (shown in the main grid). "variantLabel" is the panel title.
//  Each entry in "variants" is a FULL normal item object —
//  exactly the same format as any other shop item.
//
//  Example:
//    {
//      id: "decocraft:single_bed_palm_black", price: 50, count: 1, nbt: {}, lore: [],
//      variantLabel: "Single Bed (Palm)",
//      variants: [
//        { id: "decocraft:single_bed_palm_black", price: 50, count: 1, nbt: {}, lore: [] },
//        { id: "decocraft:single_bed_palm_blue",  price: 50, count: 1, nbt: {}, lore: [] },
//        ...
//      ]
//    }
//
//  The main grid shows the parent "id" item with a variant-count hint.
//  Clicking it opens the variant panel on the LEFT.
//  Normal items (no "variants" key) work exactly as before.
// ============================================================


var CONFIG_SHOP_ITEMS = [
    // Tab 0 - Electronics
[
{ id: "universal_shops:trade_block", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "movingelevators:display_block", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "movingelevators:button_block", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "movingelevators:elevator_block", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "webstreamer:display_p", count: 1, price: 200000, nbt: {}, lore: [] },
{ id: "webstreamer:big_tv", count: 1, price: 50000, nbt: {}, lore: [] },
{ id: "webstreamer:tv", count: 1, price: 40000, nbt: {}, lore: [] },
{ id: "yuushya:monitor_with_keyboard_and_mouse", count: 1, price: 2000, nbt: {}, lore: [] },
{ id: "yuushya:monitor_with_tablet", count: 1, price: 2000, nbt: {}, lore: [] },
{ id: "yuushya:monitor", count: 1, price: 1600, nbt: {}, lore: [] },
{ id: "yuushya:classic_terminal", count: 1, price: 1800, nbt: {}, lore: [] },
{ id: "yuushya:laptop", count: 1, price: 1800, nbt: {}, lore: [] },
{ id: "yuushya:pc_case", count: 1, price: 2000, nbt: {}, lore: [] },
{ id: "yuushya:printer", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "yuushya:mini_printer", count: 1, price: 400, nbt: {}, lore: [] },
{ id: "yuushya:vinyl_record_player", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "yuushya:tv_online", count: 1, price: 10000, nbt: {}, lore: [] },
{ id: "yuushya:mounted_tv_online", count: 1, price: 10000, nbt: {}, lore: [] },
{ id: "yuushya:old_tv", count: 1, price: 1800, nbt: {}, lore: [] },
{ id: "yuushya:ps4", count: 1, price: 2000, nbt: {}, lore: [] },
{ id: "yuushya:switch", count: 1, price: 2000, nbt: {}, lore: [] },
{ id: "yuushya:switch_", count: 1, price: 2000, nbt: {}, lore: [] },
{ id: "yuushya:telephone_0", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:air_conditioner", count: 1, price: 1000, nbt: {}, lore: [] },
{ id: "yuushya:air_conditioner_sym", count: 1, price: 1000, nbt: {}, lore: [] },
{ id: "decocraft:air_conditioner", count: 1, price: 1000, nbt: {}, lore: [] },
{ id: "yuushya:air_conditioning_condenser", count: 1, price: 1000, nbt: {}, lore: [] },
{ id: "yuushya:rusty_air_conditioning_condenser", count: 1, price: 1000, nbt: {}, lore: [] },
{ id: "yuushya:meshed_air_conditioning_condenser", count: 1, price: 1000, nbt: {}, lore: [] },
{ id: "yuushya:air_conditioner_floor", count: 1, price: 1500, nbt: {}, lore: [] },
{ id: "yuushya:fan", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "yuushya:fan_", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "yuushya:floor_fan", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "yuushya:floor_fan_", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "yuushya:ceiling_fan", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "yuushya:jack", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:washing_machine", count: 1, price: 1000, nbt: {}, lore: [] },
{ id: "yuushya:washing_machine_sym", count: 1, price: 1000, nbt: {}, lore: [] },
{ id: "yuushya:refrigerator", count: 1, price: 2000, nbt: {}, lore: [] },
{ id: "yuushya:decorated_refrigerator", count: 1, price: 2000, nbt: {}, lore: [] },
{ id: "yuushya:freezer", count: 1, price: 2500, nbt: {}, lore: [] },
{ id: "yuushya:freezer_", count: 1, price: 2500, nbt: {}, lore: [] },
{ id: "yuushya:beverage_drawer", count: 1, price: 8000, nbt: {}, lore: [] },
{ id: "yuushya:beverage_drawer_sym", count: 1, price: 8000, nbt: {}, lore: [] },
{ id: "yuushya:vending_machine_blue_v", count: 1, price: 8000, nbt: {}, lore: [] },
{ id: "yuushya:vending_machine_blue_h", count: 1, price: 8000, nbt: {}, lore: [] },
{ id: "yuushya:vending_machine_red_v", count: 1, price: 8000, nbt: {}, lore: [] },
{ id: "yuushya:vending_machine_red_h", count: 1, price: 8000, nbt: {}, lore: [] },
{ id: "yuushya:vending_machine_gray_v", count: 1, price: 8000, nbt: {}, lore: [] },
{ id: "yuushya:vending_machine_gray_h", count: 1, price: 8000, nbt: {}, lore: [] },
{ id: "yuushya:electric_piano", count: 1, price: 1000, nbt: {}, lore: [] },
{ id: "yuushya:audio", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:audio_large", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:boom_box", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "lockandblock:reinforced_iron_door", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "lockandblock:key", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "lockandblock:keycard", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "lockandblock:keycard_cloner", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "lockandblock:keycard_reader", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "lockandblock:keycard_writer", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "lockandblock:keypad", count: 1, price: 10, nbt: {}, lore: [] },
// ── Decocraft Electronics & Office ──
{
    id: "decocraft:alarm_clock_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Alarm Clock",
    variants: [
        { id: "decocraft:alarm_clock_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:alarm_clock_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:alarm_clock_cyan", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:alarm_clock_gray", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:alarm_clock_green", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:alarm_clock_lime", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:alarm_clock_magenta", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:alarm_clock_orange", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:alarm_clock_pink", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:alarm_clock_purple", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:alarm_clock_red", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:alarm_clock_white", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:alarm_clock_yellow", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:alarm_clock_light_blue", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Alarm Clock Light",
    variants: [
        { id: "decocraft:alarm_clock_light_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:alarm_clock_light_gray", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:anatomical_model", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:atm", count: 1, price: 2500, nbt: {}, lore: [] },
{ id: "decocraft:calendar", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:cash_register", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "decocraft:chalkboard", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:chemistry_set_flipbook", count: 1, price: 150, nbt: {}, lore: [] },
{ id: "decocraft:cork_board", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:crt_tv", count: 1, price: 1200, nbt: {}, lore: [] },

{ id: "decocraft:gameboy", count: 1, price: 200, nbt: {}, lore: [] },
{
    id: "decocraft:keyboard_black", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Keyboard",
    variants: [
        { id: "decocraft:keyboard_black", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:keyboard_blue", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:keyboard_cyan", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:keyboard_green", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:keyboard_lime", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:keyboard_magenta", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:keyboard_orange", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:keyboard_pink", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:keyboard_purple", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:keyboard_red", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:keyboard_white", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:keyboard_yellow", count: 1, price: 200, nbt: {}, lore: [] },
		{ id: "decocraft:keyboard_light_blue", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:laptop_black", price: 1800, count: 1, nbt: {}, lore: [],
    variantLabel: "Laptop",
    variants: [
        { id: "decocraft:laptop_black", count: 1, price: 1800, nbt: {}, lore: [] },
        { id: "decocraft:laptop_pink", count: 1, price: 1800, nbt: {}, lore: [] },
        { id: "decocraft:laptop_silver", count: 1, price: 1800, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:microphone_stand_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Microphone Stand",
    variants: [
        { id: "decocraft:microphone_stand_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:microphone_stand_silver", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:microscope", count: 1, price: 300, nbt: {}, lore: [] },
{
    id: "decocraft:monitor_1_black", price: 1600, count: 1, nbt: {}, lore: [],
    variantLabel: "Monitor 1",
    variants: [
        { id: "decocraft:monitor_1_black", count: 1, price: 1600, nbt: {}, lore: [] },
        { id: "decocraft:monitor_1_pink", count: 1, price: 1600, nbt: {}, lore: [] },
        { id: "decocraft:monitor_1_white", count: 1, price: 1600, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:monitor_2_black", price: 1600, count: 1, nbt: {}, lore: [],
    variantLabel: "Monitor 2",
    variants: [
        { id: "decocraft:monitor_2_black", count: 1, price: 1600, nbt: {}, lore: [] },
        { id: "decocraft:monitor_2_pink", count: 1, price: 1600, nbt: {}, lore: [] },
        { id: "decocraft:monitor_2_white", count: 1, price: 1600, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:monitor_3_black", price: 1600, count: 1, nbt: {}, lore: [],
    variantLabel: "Monitor 3",
    variants: [
        { id: "decocraft:monitor_3_black", count: 1, price: 1600, nbt: {}, lore: [] },
        { id: "decocraft:monitor_3_pink", count: 1, price: 1600, nbt: {}, lore: [] },
        { id: "decocraft:monitor_3_white", count: 1, price: 1600, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:notebook_black", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Notebook",
    variants: [
        { id: "decocraft:notebook_black", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:notebook_blue", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:notebook_cyan", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:notebook_gray", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:notebook_green", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:notebook_lime", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:notebook_magenta", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:notebook_orange", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:notebook_pink", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:notebook_purple", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:notebook_red", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:notebook_white", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:notebook_yellow", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:notebook_light_blue", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Notebook Light",
    variants: [
        { id: "decocraft:notebook_light_blue", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:notebook_light_gray", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:office_phone_beige", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Office Phone",
    variants: [
        { id: "decocraft:office_phone_beige", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:office_phone_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:office_phone_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:pc_tower_black", price: 2000, count: 1, nbt: {}, lore: [],
    variantLabel: "Pc Tower",
    variants: [
        { id: "decocraft:pc_tower_black", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:pc_tower_pink", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:pc_tower_white", count: 1, price: 2000, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:portable_record_player_black", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Portable Record Player",
    variants: [
        { id: "decocraft:portable_record_player_black", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:portable_record_player_blue", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:portable_record_player_cyan", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:portable_record_player_gray", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:portable_record_player_green", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:portable_record_player_lime", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:portable_record_player_magenta", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:portable_record_player_orange", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:portable_record_player_pink", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:portable_record_player_purple", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:portable_record_player_red", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:portable_record_player_white", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:portable_record_player_yellow", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:portable_record_player_light_blue", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Portable Record Player Light",
    variants: [
        { id: "decocraft:portable_record_player_light_blue", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:portable_record_player_light_gray", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:printer_black", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Printer",
    variants: [
        { id: "decocraft:printer_black", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:printer_white", count: 1, price: 500, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:rotary_phone_aqua", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Rotary Phone",
    variants: [
        { id: "decocraft:rotary_phone_aqua", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rotary_phone_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rotary_phone_blue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rotary_phone_coral", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rotary_phone_lavender", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rotary_phone_lime", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rotary_phone_mint", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rotary_phone_orange", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rotary_phone_pink", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rotary_phone_red", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rotary_phone_white", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rotary_phone_yellow", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:rotary_phone_light_gray", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "decocraft:safe", count: 1, price: 500, nbt: {}, lore: [] },
{
    id: "decocraft:security_camera_black", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Security Camera",
    variants: [
        { id: "decocraft:security_camera_black", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:security_camera_silver", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:smartphone_black", price: 600, count: 1, nbt: {}, lore: [],
    variantLabel: "Smartphone",
    variants: [
        { id: "decocraft:smartphone_black", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:smartphone_blue", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:smartphone_lavender", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:smartphone_mint", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:smartphone_orange", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:smartphone_pink", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:smartphone_teal", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:smartphone_white", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:smartphone_yellow", count: 1, price: 600, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:switch_green_blue", count: 1, price: 1500, nbt: {}, lore: [] },
{ id: "decocraft:switch_pink_green", count: 1, price: 1500, nbt: {}, lore: [] },
{ id: "decocraft:switch_purple_orange", count: 1, price: 1500, nbt: {}, lore: [] },
{ id: "decocraft:switch_red_blue", count: 1, price: 1500, nbt: {}, lore: [] },
{ id: "decocraft:tablet_black", count: 1, price: 1500, nbt: {}, lore: [] },
{
    id: "decocraft:tv_large", price: 1800, count: 1, nbt: {}, lore: [],
    variantLabel: "Tv",
    variants: [
        { id: "decocraft:tv_large", count: 1, price: 1800, nbt: {}, lore: [] },
        { id: "decocraft:tv_old", count: 1, price: 1800, nbt: {}, lore: [] },
        { id: "decocraft:tv_small", count: 1, price: 1800, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:tv_wall_large", price: 10000, count: 1, nbt: {}, lore: [],
    variantLabel: "Tv Wall",
    variants: [
        { id: "decocraft:tv_wall_large", count: 1, price: 10000, nbt: {}, lore: [] },
        { id: "decocraft:tv_wall_small", count: 1, price: 10000, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:typewriter_black", price: 300, count: 1, nbt: {}, lore: [],
    variantLabel: "Typewriter",
    variants: [
        { id: "decocraft:typewriter_black", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:typewriter_blue", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:typewriter_cyan", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:typewriter_green", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:typewriter_lavender", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:typewriter_lime", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:typewriter_magenta", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:typewriter_orange", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:typewriter_pink", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:typewriter_red", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:typewriter_white", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:typewriter_yellow", count: 1, price: 300, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:vintage_cash_register", count: 1, price: 400, nbt: {}, lore: [] },
{ id: "decocraft:whiteboard", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "decocraft:table_top_craft:acacia_chess", count: 1, price: 100, nbt: {}, lore: [] },
],
    // Tab 1 - Lighting
[
{ id: "yuushya:desk_lamp_0", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:incandescent_lamp", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:desk_lamp_1", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:desk_lamp_2", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:luorescent_lamp", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:incandescent_bulb", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:hanging_light", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:ring_light", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:tall_work_light", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:medieval_street_light", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:medieval_street_light_base", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:medieval_lamp", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:goth_lantern", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:gothic_ceiling_lamp", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:oriental_lantern", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:road_light", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:street_light", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:work_light", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:modern_lamp_0", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:modern_lamp_1", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:modern_lamp_2", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:modern_lamp_ceiling", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:round_ceiling_lamp", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:strip_light", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:fluorescent_lamp", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:medieval_street_light_post", count: 1, price: 3, nbt: {}, lore: [] },
{ id: "yuushya:medieval_street_light_pole", count: 1, price: 3, nbt: {}, lore: [] },
// ── Decocraft Lighting ──
{ id: "decocraft:chandelier_1_black_flipbook", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:chandelier_1_gold_flipbook", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:chandelier_1_silver_flipbook", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:chandelier_2_black_flipbook", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:chandelier_2_gold_flipbook", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:chandelier_2_silver_flipbook", count: 1, price: 200, nbt: {}, lore: [] },
{
    id: "decocraft:chandelier_chain_black", price: 10, count: 1, nbt: {}, lore: [],
    variantLabel: "Chandelier Chain",
    variants: [
        { id: "decocraft:chandelier_chain_black", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:chandelier_chain_brass", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:chandelier_chain_gold", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:chandelier_chain_silver", count: 1, price: 10, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:chandelier_medieval", count: 1, price: 150, nbt: {}, lore: [] },
{
    id: "decocraft:curved_floor_lamp_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Curved Floor Lamp",
    variants: [
        { id: "decocraft:curved_floor_lamp_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:curved_floor_lamp_brass", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:curved_floor_lamp_gold", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:curved_floor_lamp_silver", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:curved_pendant_lamp_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Curved Pendant Lamp",
    variants: [
        { id: "decocraft:curved_pendant_lamp_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:curved_pendant_lamp_brass", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:curved_pendant_lamp_gold", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:curved_pendant_lamp_silver", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:floor_lamp_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Floor Lamp",
    variants: [
        { id: "decocraft:floor_lamp_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:floor_lamp_brass", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:floor_lamp_gold", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:floor_lamp_silver", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:hanging_lamp_1_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Hanging Lamp 1",
    variants: [
        { id: "decocraft:hanging_lamp_1_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_lamp_1_brass", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_lamp_1_gold", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_lamp_1_silver", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:hanging_lamp_2_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Hanging Lamp 2",
    variants: [
        { id: "decocraft:hanging_lamp_2_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_lamp_2_brass", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_lamp_2_gold", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_lamp_2_silver", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:hanging_lamp_3_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Hanging Lamp 3",
    variants: [
        { id: "decocraft:hanging_lamp_3_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_lamp_3_brass", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_lamp_3_gold", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_lamp_3_silver", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:lamp_cable_base_black_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Lamp Cable Base Black",
    variants: [
        { id: "decocraft:lamp_cable_base_black_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_brass", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_cyan", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_gold", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_green", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_lime", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_magenta", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_orange", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_pink", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_purple", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_red", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_silver", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_white", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_black_yellow", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:lamp_cable_base_black_light_blue", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:lamp_cable_base_black_rose_gold", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:lamp_cable_base_white_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Lamp Cable Base White",
    variants: [
        { id: "decocraft:lamp_cable_base_white_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_brass", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_cyan", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_gold", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_green", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_lime", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_magenta", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_orange", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_pink", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_purple", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_red", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_silver", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_white", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_base_white_yellow", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:lamp_cable_base_white_light_blue", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:lamp_cable_base_white_rose_gold", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:lamp_cable_standalone_black", price: 10, count: 1, nbt: {}, lore: [],
    variantLabel: "Lamp Cable Standalone",
    variants: [
        { id: "decocraft:lamp_cable_standalone_black", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:lamp_cable_standalone_white", count: 1, price: 10, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:lava_lamp_blue", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Lava Lamp",
    variants: [
        { id: "decocraft:lava_lamp_blue", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:lava_lamp_cyan", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:lava_lamp_green", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:lava_lamp_lime", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:lava_lamp_magenta", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:lava_lamp_orange", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:lava_lamp_pink", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:lava_lamp_purple", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:lava_lamp_red", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:lava_lamp_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:lava_lamp_light_blue", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:lights_ground", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:lights_ground_edge", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Lights Ground",
    variants: [
        { id: "decocraft:lights_ground_edge", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:lights_ground_rainbow", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:lights_ground_white", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:lights_ground_edge_rainbow", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Lights Ground Edge",
    variants: [
        { id: "decocraft:lights_ground_edge_rainbow", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:lights_ground_edge_white", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:light_tree_rainbow_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:light_tree_white_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:meteor_lights_rainbow_2_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:meteor_lights_rainbow_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:meteor_lights_white_2_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:meteor_lights_white_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:meteor_lights_yellow_2_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:meteor_lights_yellow_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:neon_lamp_boba", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Neon Lamp",
    variants: [
        { id: "decocraft:neon_lamp_boba", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:neon_lamp_cactus", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:neon_lamp_flamingo", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:neon_lamp_music", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:neon_lamp_rainbow", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:neon_lamp_unicorn", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:neon_lamp_dog_and_cat", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "decocraft:neon_lamp_ice_pop", count: 1, price: 100, nbt: {}, lore: [] },
{
    id: "decocraft:pendant_lamp_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Pendant Lamp",
    variants: [
        { id: "decocraft:pendant_lamp_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_brass", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_cyan", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_gold", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_green", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_lime", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_magenta", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_orange", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_pink", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_purple", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_red", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_silver", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_white", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pendant_lamp_yellow", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:sconce_1_black", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Sconce 1",
    variants: [
        { id: "decocraft:sconce_1_black", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:sconce_1_brass", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:sconce_1_gold", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:sconce_1_silver", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:sconce_2_black", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Sconce 2",
    variants: [
        { id: "decocraft:sconce_2_black", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:sconce_2_brass", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:sconce_2_gold", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:sconce_2_silver", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:stained_glass_chandelier_dusk", price: 300, count: 1, nbt: {}, lore: [],
    variantLabel: "Stained Glass Chandelier",
    variants: [
        { id: "decocraft:stained_glass_chandelier_dusk", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_chandelier_embers", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_chandelier_emerald", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_chandelier_flamingo", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_chandelier_meadow", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_chandelier_monarch", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_chandelier_peacock", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_chandelier_popsicle", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_chandelier_raspberry", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_chandelier_sea", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_chandelier_sunrise", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_chandelier_vineyard", count: 1, price: 300, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:stained_glass_hanging_lamp_dusk", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Stained Glass Hanging Lamp",
    variants: [
        { id: "decocraft:stained_glass_hanging_lamp_dusk", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_hanging_lamp_embers", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_hanging_lamp_emerald", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_hanging_lamp_flamingo", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_hanging_lamp_meadow", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_hanging_lamp_monarch", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_hanging_lamp_peacock", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_hanging_lamp_popsicle", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_hanging_lamp_raspberry", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_hanging_lamp_sea", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_hanging_lamp_sunrise", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_hanging_lamp_vineyard", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:stained_glass_sconce_dusk", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Stained Glass Sconce",
    variants: [
        { id: "decocraft:stained_glass_sconce_dusk", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_sconce_embers", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_sconce_emerald", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_sconce_flamingo", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_sconce_meadow", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_sconce_monarch", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_sconce_peacock", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_sconce_popsicle", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_sconce_raspberry", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_sconce_sea", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_sconce_sunrise", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_sconce_vineyard", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:stained_glass_table_lamp_dusk", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Stained Glass Table Lamp",
    variants: [
        { id: "decocraft:stained_glass_table_lamp_dusk", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_table_lamp_embers", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_table_lamp_emerald", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_table_lamp_flamingo", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_table_lamp_meadow", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_table_lamp_monarch", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_table_lamp_peacock", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_table_lamp_popsicle", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_table_lamp_raspberry", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_table_lamp_sea", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_table_lamp_sunrise", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:stained_glass_table_lamp_vineyard", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},

{ id: "decocraft:string_light_stars_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:string_light_stars_rainbow_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:string_light_stars_white_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:table_lamp_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Table Lamp",
    variants: [
        { id: "decocraft:table_lamp_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:table_lamp_clay", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:table_lamp_cyan", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:table_lamp_gray", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:table_lamp_pink", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:table_lamp_white", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:table_lamp_tall_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Table Lamp Tall",
    variants: [
        { id: "decocraft:table_lamp_tall_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:table_lamp_tall_clay", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:table_lamp_tall_cyan", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:table_lamp_tall_gray", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:table_lamp_tall_pink", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:table_lamp_tall_white", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},

],
    // Tab 2 - Seating & Tables
[
// ── Yuushya Tables ──
{ id: "yuushya:average_table", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:medium_table", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "yuushya:big_table", count: 1, price: 400, nbt: {}, lore: [] },
{ id: "yuushya:classroom_desk", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:oak_foldable_table", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "yuushya:acacia_foldable_table", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "yuushya:birch_table", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:acacia_table", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:dark_oak_table", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:jungle_table", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:oak_table", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:stone_table", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "yuushya:marble_table", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "yuushya:hay_table", count: 1, price: 50, nbt: {}, lore: [] },
// ── Decocraft Tables ──
{ id: "decocraft:baking_table", count: 1, price: 150, nbt: {}, lore: [] },
{
    id: "decocraft:bamboo_coffee_table_round_green", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Bamboo Coffee Table Round",
    variants: [
        { id: "decocraft:bamboo_coffee_table_round_green", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:bamboo_coffee_table_round_yellow", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bamboo_coffee_table_square_green", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Bamboo Coffee Table Square",
    variants: [
        { id: "decocraft:bamboo_coffee_table_square_green", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:bamboo_coffee_table_square_yellow", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bamboo_side_table_green", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Bamboo Side Table",
    variants: [
        { id: "decocraft:bamboo_side_table_green", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:bamboo_side_table_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bamboo_table_green", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Bamboo Table",
    variants: [
        { id: "decocraft:bamboo_table_green", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:bamboo_table_yellow", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:blackjack_table", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "decocraft:cottage_coffee_table", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:cottage_coffee_table_long", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Cottage Coffee Table",
    variants: [
        { id: "decocraft:cottage_coffee_table_long", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:cottage_coffee_table_oval", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_counter_black", price: 120, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Counter",
    variants: [
        { id: "decocraft:diner_counter_black", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_blue", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_cyan", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_gray", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_green", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_lime", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_magenta", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_orange", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_pink", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_purple", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_red", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_yellow", count: 1, price: 120, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_counter_corner_black", price: 120, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Counter Corner",
    variants: [
        { id: "decocraft:diner_counter_corner_black", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_corner_blue", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_corner_cyan", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_corner_gray", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_corner_green", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_corner_lime", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_corner_magenta", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_corner_orange", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_corner_pink", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_corner_purple", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_corner_red", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_corner_yellow", count: 1, price: 120, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_counter_corner_light_blue", price: 120, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Counter Corner Light",
    variants: [
        { id: "decocraft:diner_counter_corner_light_blue", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_corner_light_gray", count: 1, price: 120, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_counter_edge_black", price: 120, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Counter Edge",
    variants: [
        { id: "decocraft:diner_counter_edge_black", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_edge_blue", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_edge_cyan", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_edge_gray", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_edge_green", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_edge_lime", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_edge_magenta", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_edge_orange", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_edge_pink", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_edge_purple", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_edge_red", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_edge_yellow", count: 1, price: 120, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_counter_edge_light_blue", price: 120, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Counter Edge Light",
    variants: [
        { id: "decocraft:diner_counter_edge_light_blue", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_edge_light_gray", count: 1, price: 120, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_counter_light_blue", price: 120, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Counter Light",
    variants: [
        { id: "decocraft:diner_counter_light_blue", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:diner_counter_light_gray", count: 1, price: 120, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_table_black", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Table",
    variants: [
        { id: "decocraft:diner_table_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_blue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_cyan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_gray", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_green", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_lime", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_magenta", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_orange", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_pink", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_purple", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_red", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_yellow", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_table_light_blue", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Table Light",
    variants: [
        { id: "decocraft:diner_table_light_blue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_light_gray", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_table_round_black", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Table Round",
    variants: [
        { id: "decocraft:diner_table_round_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_round_blue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_round_cyan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_round_gray", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_round_green", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_round_lime", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_round_magenta", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_round_orange", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_round_pink", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_round_purple", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_round_red", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_round_yellow", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_table_round_light_blue", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Table Round Light",
    variants: [
        { id: "decocraft:diner_table_round_light_blue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:diner_table_round_light_gray", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:foosball_table", count: 1, price: 800, nbt: {}, lore: [] },
{
    id: "decocraft:kitchen_table_birch", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Kitchen Table",
    variants: [
        { id: "decocraft:kitchen_table_birch", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:kitchen_table_black", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:kitchen_table_cherry", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:kitchen_table_ebony", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:kitchen_table_oak", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:kitchen_table_palm", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:kitchen_table_spruce", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:kitchen_table_white", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:kotatsu_black", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Kotatsu",
    variants: [
        { id: "decocraft:kotatsu_black", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:kotatsu_blossom", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:kotatsu_cyan", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:kotatsu_green", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:kotatsu_kanagawa", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:kotatsu_lime", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:kotatsu_magenta", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:kotatsu_orange", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:kotatsu_purple", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:kotatsu_red", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:kotatsu_yellow", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:kotatsu_light_blue", count: 1, price: 200, nbt: {}, lore: [] },
{
    id: "decocraft:modular_desk_left_birch", price: 120, count: 1, nbt: {}, lore: [],
    variantLabel: "Modular Desk Left",
    variants: [
        { id: "decocraft:modular_desk_left_birch", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_left_black", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_left_cherry", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_left_ebony", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_left_oak", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_left_palm", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_left_spruce", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_left_white", count: 1, price: 120, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:modular_desk_plank_birch", price: 120, count: 1, nbt: {}, lore: [],
    variantLabel: "Modular Desk Plank",
    variants: [
        { id: "decocraft:modular_desk_plank_birch", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_plank_black", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_plank_cherry", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_plank_ebony", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_plank_oak", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_plank_palm", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_plank_spruce", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_plank_white", count: 1, price: 120, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:modular_desk_right_birch", price: 120, count: 1, nbt: {}, lore: [],
    variantLabel: "Modular Desk Right",
    variants: [
        { id: "decocraft:modular_desk_right_birch", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_right_black", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_right_cherry", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_right_ebony", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_right_oak", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_right_palm", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_right_spruce", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_right_white", count: 1, price: 120, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:picnic_table", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "decocraft:poker_table", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "decocraft:pool_table", count: 1, price: 1000, nbt: {}, lore: [] },
{
    id: "decocraft:rattan_coffee_table_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Rattan Coffee Table",
    variants: [
        { id: "decocraft:rattan_coffee_table_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:rattan_coffee_table_brown", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:rattan_coffee_table_gray", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:rattan_coffee_table_orange", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:rattan_coffee_table_white", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:rattan_coffee_table_yellow", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:rattan_coffee_table_light_gray", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:restaurant_table_1_black", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Restaurant Table 1",
    variants: [
        { id: "decocraft:restaurant_table_1_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_1_blue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_1_cyan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_1_gray", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_1_green", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_1_lime", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_1_magenta", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_1_orange", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_1_pink", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_1_purple", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_1_red", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_1_white", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_1_yellow", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:restaurant_table_1_light_blue", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Restaurant Table 1 Light",
    variants: [
        { id: "decocraft:restaurant_table_1_light_blue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_1_light_gray", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:restaurant_table_2_black", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Restaurant Table 2",
    variants: [
        { id: "decocraft:restaurant_table_2_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_2_blue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_2_cyan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_2_gray", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_2_green", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_2_lime", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_2_magenta", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_2_orange", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_2_pink", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_2_purple", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_2_red", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_2_white", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_2_yellow", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:restaurant_table_2_light_blue", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Restaurant Table 2 Light",
    variants: [
        { id: "decocraft:restaurant_table_2_light_blue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:restaurant_table_2_light_gray", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:roulette_table", count: 1, price: 500, nbt: {}, lore: [] },
{
    id: "decocraft:school_desk_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "School Desk",
    variants: [
        { id: "decocraft:school_desk_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:school_desk_blue", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:school_desk_cyan", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:school_desk_gray", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:school_desk_green", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:school_desk_lime", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:school_desk_magenta", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:school_desk_orange", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:school_desk_pink", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:school_desk_purple", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:school_desk_red", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:school_desk_white", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:school_desk_yellow", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:school_desk_light_blue", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "School Desk Light",
    variants: [
        { id: "decocraft:school_desk_light_blue", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:school_desk_light_gray", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:wooden_table_birch", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Wooden Table",
    variants: [
        { id: "decocraft:wooden_table_birch", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:wooden_table_black", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:wooden_table_cherry", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:wooden_table_ebony", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:wooden_table_oak", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:wooden_table_palm", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:wooden_table_spruce", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:wooden_table_white", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:wrought_iron_table_black", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Wrought Iron Table",
    variants: [
        { id: "decocraft:wrought_iron_table_black", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:wrought_iron_table_green", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:wrought_iron_table_white", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:wrought_iron_table_small_black", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Wrought Iron Table Small",
    variants: [
        { id: "decocraft:wrought_iron_table_small_black", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:wrought_iron_table_small_green", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:wrought_iron_table_small_white", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},
// ── Decocraft Seating ──
{
    id: "decocraft:armchair_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Armchair",
    variants: [
        { id: "decocraft:armchair_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:armchair_blue", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:armchair_cream", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:armchair_cyan", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:armchair_gray", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:armchair_green", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:armchair_lime", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:armchair_magenta", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:armchair_orange", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:armchair_pink", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:armchair_purple", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:armchair_red", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:armchair_white", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:armchair_yellow", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:armchair_dark_gray", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:armchair_leather_black", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Armchair Leather",
    variants: [
        { id: "decocraft:armchair_leather_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:armchair_leather_brown", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:armchair_light_blue", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "decocraft:armchair_ocean_blue", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:arm_desk_black", price: 120, count: 1, nbt: {}, lore: [],
    variantLabel: "Arm Desk",
    variants: [
        { id: "decocraft:arm_desk_black", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:arm_desk_blue", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:arm_desk_cyan", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:arm_desk_gray", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:arm_desk_green", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:arm_desk_lime", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:arm_desk_magenta", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:arm_desk_orange", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:arm_desk_pink", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:arm_desk_purple", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:arm_desk_red", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:arm_desk_white", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:arm_desk_yellow", count: 1, price: 120, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:arm_desk_light_blue", price: 120, count: 1, nbt: {}, lore: [],
    variantLabel: "Arm Desk Light",
    variants: [
        { id: "decocraft:arm_desk_light_blue", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:arm_desk_light_gray", count: 1, price: 120, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bamboo_armchair_green", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Bamboo Armchair",
    variants: [
        { id: "decocraft:bamboo_armchair_green", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bamboo_armchair_yellow", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bamboo_chair_green", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Bamboo Chair",
    variants: [
        { id: "decocraft:bamboo_chair_green", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bamboo_chair_yellow", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bamboo_couch_left_green", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Bamboo Couch Left",
    variants: [
        { id: "decocraft:bamboo_couch_left_green", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:bamboo_couch_left_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bamboo_couch_middle_green", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Bamboo Couch Middle",
    variants: [
        { id: "decocraft:bamboo_couch_middle_green", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:bamboo_couch_middle_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bamboo_couch_right_green", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Bamboo Couch Right",
    variants: [
        { id: "decocraft:bamboo_couch_right_green", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:bamboo_couch_right_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:beach_chair_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Beach Chair",
    variants: [
        { id: "decocraft:beach_chair_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_chair_blue", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_chair_cyan", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_chair_gray", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_chair_green", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_chair_lime", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_chair_magenta", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_chair_orange", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_chair_pink", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_chair_purple", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_chair_red", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_chair_white", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_chair_yellow", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:beach_chair_light_blue", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Beach Chair Light",
    variants: [
        { id: "decocraft:beach_chair_light_blue", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_chair_light_gray", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:bistro_chair", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:casino_chair_green", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Casino Chair",
    variants: [
        { id: "decocraft:casino_chair_green", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:casino_chair_red", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:casino_stool_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Casino Stool",
    variants: [
        { id: "decocraft:casino_stool_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:casino_stool_green", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:casino_stool_red", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:chair_1_birch", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Chair 1",
    variants: [
        { id: "decocraft:chair_1_birch", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_1_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_1_cherry", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_1_ebony", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_1_oak", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_1_palm", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_1_spruce", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_1_white", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:chair_1_white_alt", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:chair_2_birch", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Chair 2",
    variants: [
        { id: "decocraft:chair_2_birch", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_2_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_2_cherry", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_2_ebony", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_2_oak", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_2_palm", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_2_spruce", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:chair_2_white", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:chair_2_white_alt", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:cottage_armchair", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Cottage",
    variants: [
        { id: "decocraft:cottage_armchair", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:cottage_footstool", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:cottage_couch_left", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Cottage Couch",
    variants: [
        { id: "decocraft:cottage_couch_left", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:cottage_couch_middle", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:cottage_couch_right", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:couch_corner_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Couch Corner",
    variants: [
        { id: "decocraft:couch_corner_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_blue", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_cream", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_cyan", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_gray", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_green", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_lime", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_magenta", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_orange", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_pink", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_purple", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_red", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_white", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:couch_corner_dark_gray", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:couch_corner_leather_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Couch Corner Leather",
    variants: [
        { id: "decocraft:couch_corner_leather_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_corner_leather_brown", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:couch_corner_light_blue", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:couch_corner_ocean_blue", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:couch_edge_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Couch Edge",
    variants: [
        { id: "decocraft:couch_edge_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_blue", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_cream", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_cyan", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_gray", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_green", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_lime", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_magenta", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_orange", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_pink", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_purple", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_red", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_white", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:couch_edge_dark_gray", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:couch_edge_leather_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Couch Edge Leather",
    variants: [
        { id: "decocraft:couch_edge_leather_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_edge_leather_brown", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:couch_edge_light_blue", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:couch_edge_ocean_blue", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:couch_left_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Couch Left",
    variants: [
        { id: "decocraft:couch_left_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_blue", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_cream", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_cyan", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_gray", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_green", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_lime", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_magenta", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_orange", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_pink", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_purple", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_red", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_white", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:couch_left_dark_gray", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:couch_left_leather_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Couch Left Leather",
    variants: [
        { id: "decocraft:couch_left_leather_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_left_leather_brown", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:couch_left_light_blue", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:couch_left_ocean_blue", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:couch_middle_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Couch Middle",
    variants: [
        { id: "decocraft:couch_middle_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_blue", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_cream", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_cyan", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_gray", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_green", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_lime", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_magenta", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_orange", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_pink", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_purple", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_red", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_white", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:couch_middle_dark_gray", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:couch_middle_leather_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Couch Middle Leather",
    variants: [
        { id: "decocraft:couch_middle_leather_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_middle_leather_brown", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:couch_middle_light_blue", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:couch_middle_ocean_blue", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:couch_right_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Couch Right",
    variants: [
        { id: "decocraft:couch_right_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_blue", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_cream", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_cyan", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_gray", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_green", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_lime", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_magenta", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_orange", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_pink", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_purple", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_red", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_white", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:couch_right_dark_gray", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:couch_right_leather_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Couch Right Leather",
    variants: [
        { id: "decocraft:couch_right_leather_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:couch_right_leather_brown", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:couch_right_light_blue", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:couch_right_ocean_blue", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:diner_chair_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Chair",
    variants: [
        { id: "decocraft:diner_chair_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_chair_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_chair_cyan", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_chair_gray", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_chair_green", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_chair_lime", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_chair_magenta", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_chair_orange", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_chair_pink", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_chair_purple", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_chair_red", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_chair_yellow", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_chair_light_blue", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Chair Light",
    variants: [
        { id: "decocraft:diner_chair_light_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_chair_light_gray", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_seat_double_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Seat Double",
    variants: [
        { id: "decocraft:diner_seat_double_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_seat_double_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_seat_double_cyan", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_seat_double_gray", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_seat_double_green", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_seat_double_lime", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_seat_double_magenta", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_seat_double_orange", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_seat_double_pink", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_seat_double_purple", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_seat_double_red", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_seat_double_yellow", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_seat_double_light_blue", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Seat Double Light",
    variants: [
        { id: "decocraft:diner_seat_double_light_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_seat_double_light_gray", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_stool_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Stool",
    variants: [
        { id: "decocraft:diner_stool_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_stool_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_stool_cyan", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_stool_gray", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_stool_green", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_stool_lime", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_stool_magenta", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_stool_orange", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_stool_pink", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_stool_purple", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_stool_red", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_stool_yellow", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:diner_stool_light_blue", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Diner Stool Light",
    variants: [
        { id: "decocraft:diner_stool_light_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:diner_stool_light_gray", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:floor_cushion_black", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Floor Cushion",
    variants: [
        { id: "decocraft:floor_cushion_black", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:floor_cushion_blue", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:floor_cushion_cyan", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:floor_cushion_green", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:floor_cushion_lime", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:floor_cushion_magenta", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:floor_cushion_orange", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:floor_cushion_pink", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:floor_cushion_purple", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:floor_cushion_red", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:floor_cushion_white", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:floor_cushion_yellow", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:floor_cushion_light_blue", count: 1, price: 20, nbt: {}, lore: [] },
{
    id: "decocraft:gaming_chair_black", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Gaming Chair",
    variants: [
        { id: "decocraft:gaming_chair_black", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:gaming_chair_blue", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:gaming_chair_cyan", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:gaming_chair_gray", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:gaming_chair_green", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:gaming_chair_lime", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:gaming_chair_magenta", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:gaming_chair_orange", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:gaming_chair_pink", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:gaming_chair_purple", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:gaming_chair_red", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:gaming_chair_white", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:gaming_chair_yellow", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:gaming_chair_light_blue", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Gaming Chair Light",
    variants: [
        { id: "decocraft:gaming_chair_light_blue", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:gaming_chair_light_gray", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:gaming_chair_pink_white", count: 1, price: 150, nbt: {}, lore: [] },
{ id: "decocraft:gaming_chair_violet_white", count: 1, price: 150, nbt: {}, lore: [] },
{
    id: "decocraft:lifeguard_chair_blue", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Lifeguard Chair",
    variants: [
        { id: "decocraft:lifeguard_chair_blue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:lifeguard_chair_cyan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:lifeguard_chair_lime", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:lifeguard_chair_magenta", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:lifeguard_chair_orange", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:lifeguard_chair_pink", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:lifeguard_chair_purple", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:lifeguard_chair_red", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:lifeguard_chair_white", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:lifeguard_chair_yellow", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:lifeguard_chair_light_blue", count: 1, price: 100, nbt: {}, lore: [] },
{
    id: "decocraft:lounge_chair_birch", price: 120, count: 1, nbt: {}, lore: [],
    variantLabel: "Lounge Chair",
    variants: [
        { id: "decocraft:lounge_chair_birch", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:lounge_chair_oak", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:lounge_chair_palm", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:lounge_chair_spruce", count: 1, price: 120, nbt: {}, lore: [] },
        { id: "decocraft:lounge_chair_white", count: 1, price: 120, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:office_chair_birch", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Office Chair",
    variants: [
        { id: "decocraft:office_chair_birch", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:office_chair_black", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:office_chair_cherry", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:office_chair_ebony", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:office_chair_oak", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:office_chair_palm", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:office_chair_spruce", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:office_chair_white", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:rattan_armchair_black", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Rattan Armchair",
    variants: [
        { id: "decocraft:rattan_armchair_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rattan_armchair_brown", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rattan_armchair_gray", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rattan_armchair_orange", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rattan_armchair_white", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rattan_armchair_yellow", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:rattan_armchair_light_gray", count: 1, price: 100, nbt: {}, lore: [] },
{
    id: "decocraft:rattan_couch_center_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Rattan Couch Center",
    variants: [
        { id: "decocraft:rattan_couch_center_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_center_brown", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_center_gray", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_center_orange", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_center_white", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_center_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:rattan_couch_center_light_gray", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:rattan_couch_corner_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Rattan Couch Corner",
    variants: [
        { id: "decocraft:rattan_couch_corner_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_corner_brown", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_corner_gray", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_corner_orange", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_corner_white", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_corner_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:rattan_couch_corner_light_gray", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:rattan_couch_left_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Rattan Couch Left",
    variants: [
        { id: "decocraft:rattan_couch_left_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_left_brown", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_left_gray", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_left_orange", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_left_white", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_left_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:rattan_couch_left_light_gray", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:rattan_couch_right_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Rattan Couch Right",
    variants: [
        { id: "decocraft:rattan_couch_right_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_right_brown", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_right_gray", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_right_orange", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_right_white", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:rattan_couch_right_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:rattan_couch_right_light_gray", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:rocking_chair_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Rocking Chair",
    variants: [
        { id: "decocraft:rocking_chair_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rocking_chair_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rocking_chair_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rocking_chair_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rocking_chair_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rocking_chair_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:school_chair_black", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "School Chair",
    variants: [
        { id: "decocraft:school_chair_black", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:school_chair_blue", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:school_chair_cyan", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:school_chair_gray", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:school_chair_green", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:school_chair_lime", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:school_chair_magenta", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:school_chair_orange", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:school_chair_pink", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:school_chair_purple", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:school_chair_red", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:school_chair_white", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:school_chair_yellow", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:school_chair_light_blue", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "School Chair Light",
    variants: [
        { id: "decocraft:school_chair_light_blue", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:school_chair_light_gray", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:stool_1_birch", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Stool 1",
    variants: [
        { id: "decocraft:stool_1_birch", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_1_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_1_cherry", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_1_ebony", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_1_oak", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_1_palm", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_1_spruce", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_1_white", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:stool_1_white_alt", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:stool_2_birch", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Stool 2",
    variants: [
        { id: "decocraft:stool_2_birch", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_2_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_2_cherry", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_2_ebony", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_2_oak", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_2_palm", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_2_spruce", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_2_white", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:stool_2_white_alt", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:stool_3_birch", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Stool 3",
    variants: [
        { id: "decocraft:stool_3_birch", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_3_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_3_cherry", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_3_ebony", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_3_oak", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_3_palm", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_3_spruce", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_3_white", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:stool_3_white_alt", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:stool_4_birch", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Stool 4",
    variants: [
        { id: "decocraft:stool_4_birch", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_4_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_4_cherry", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_4_ebony", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_4_oak", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_4_palm", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_4_spruce", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:stool_4_white", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:stool_4_white_alt", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:wrought_iron_chair_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Wrought Iron Chair",
    variants: [
        { id: "decocraft:wrought_iron_chair_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:wrought_iron_chair_green", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:wrought_iron_chair_white", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
],
    // Tab 3 - Bedroom
[

{
    id: "minecraft:white_bed", count: 1, price: 20, nbt: {}, lore: [] ,
    variantLabel: "Vanilla bed",
    variants: [
{ id: "minecraft:white_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:light_gray_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:gray_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:black_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:brown_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:red_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:orange_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:yellow_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:lime_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:green_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:cyan_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:light_blue_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:blue_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:purple_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:magenta_bed", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "minecraft:pink_bed", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},




// ── decocraft beds — collapsed into variant groups ──
{
    id: "decocraft:bunk_bed_birch_green", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Bunk Bed (Birch)",
    variants: [
        { id: "decocraft:bunk_bed_birch_black", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_blue", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_brown", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_cyan", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_gray", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_green", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_light_blue", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_light_gray", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_lime", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_magenta", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_orange", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_pink", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_purple", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_red", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_white", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_birch_yellow", price: 200, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bunk_bed_black_cyan", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Bunk Bed (Black)",
    variants: [
        { id: "decocraft:bunk_bed_black_black", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_blue", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_brown", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_cyan", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_gray", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_green", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_light_blue", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_light_gray", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_lime", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_magenta", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_orange", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_pink", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_purple", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_red", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_white", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_black_yellow", price: 200, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bunk_bed_oak_cyan", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Bunk Bed (Oak)",
    variants: [
        { id: "decocraft:bunk_bed_oak_black", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_blue", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_brown", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_cyan", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_gray", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_green", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_light_blue", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_light_gray", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_lime", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_magenta", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_orange", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_pink", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_purple", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_red", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_white", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_oak_yellow", price: 200, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bunk_bed_palm_cyan", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Bunk Bed (Palm)",
    variants: [
        { id: "decocraft:bunk_bed_palm_black", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_blue", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_brown", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_cyan", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_gray", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_green", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_light_blue", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_light_gray", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_lime", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_magenta", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_orange", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_pink", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_purple", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_red", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_white", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_palm_yellow", price: 200, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bunk_bed_spruce_cyan", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Bunk Bed (Spruce)",
    variants: [
        { id: "decocraft:bunk_bed_spruce_black", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_blue", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_brown", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_cyan", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_gray", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_green", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_light_blue", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_light_gray", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_lime", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_magenta", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_orange", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_pink", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_purple", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_red", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_white", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_spruce_yellow", price: 200, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bunk_bed_white_cyan", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Bunk Bed (White)",
    variants: [
        { id: "decocraft:bunk_bed_white_black", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_blue", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_brown", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_cyan", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_gray", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_green", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_light_blue", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_light_gray", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_lime", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_magenta", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_orange", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_pink", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_purple", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_red", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_white", price: 200, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bunk_bed_white_yellow", price: 200, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:day_bed_black_cyan", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Day Bed (Black)",
    variants: [
        { id: "decocraft:day_bed_black_black", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_cyan", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_green", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_light_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_light_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_lime", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_magenta", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_orange", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_pink", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_purple", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_red", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_white", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_black_yellow", price: 500, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:day_bed_gold_cyan", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Day Bed (Gold)",
    variants: [
        { id: "decocraft:day_bed_gold_black", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_cyan", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_green", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_light_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_light_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_lime", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_magenta", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_orange", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_pink", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_purple", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_red", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_white", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_gold_yellow", price: 500, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:day_bed_silver_cyan", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Day Bed (Silver)",
    variants: [
        { id: "decocraft:day_bed_silver_black", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_cyan", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_green", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_light_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_light_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_lime", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_magenta", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_orange", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_pink", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_purple", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_red", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_white", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:day_bed_silver_yellow", price: 500, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:double_bed_birch_cyan", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Double Bed (Birch)",
    variants: [
        { id: "decocraft:double_bed_birch_black", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_brown", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_cyan", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_green", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_light_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_light_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_lime", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_magenta", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_orange", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_pink", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_purple", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_red", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_white", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_birch_yellow", price: 500, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:double_bed_black_cyan", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Double Bed (Black)",
    variants: [
        { id: "decocraft:double_bed_black_black", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_brown", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_cyan", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_green", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_light_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_light_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_lime", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_magenta", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_orange", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_pink", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_purple", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_red", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_white", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_black_yellow", price: 500, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:double_bed_oak_cyan", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Double Bed (Oak)",
    variants: [
        { id: "decocraft:double_bed_oak_black", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_brown", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_cyan", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_green", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_light_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_light_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_lime", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_magenta", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_orange", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_pink", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_purple", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_red", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_white", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_oak_yellow", price: 500, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:double_bed_palm_cyan", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Double Bed (Palm)",
    variants: [
        { id: "decocraft:double_bed_palm_black", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_brown", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_cyan", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_green", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_light_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_light_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_lime", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_magenta", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_orange", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_pink", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_purple", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_red", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_white", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_palm_yellow", price: 500, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:double_bed_spruce_cyan", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Double Bed (Spruce)",
    variants: [
        { id: "decocraft:double_bed_spruce_black", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_brown", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_cyan", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_green", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_light_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_light_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_lime", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_magenta", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_orange", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_pink", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_purple", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_red", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_white", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_spruce_yellow", price: 500, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:double_bed_white_cyan", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Double Bed (White)",
    variants: [
        { id: "decocraft:double_bed_white_black", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_brown", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_cyan", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_green", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_light_blue", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_light_gray", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_lime", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_magenta", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_orange", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_pink", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_purple", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_red", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_white", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:double_bed_white_yellow", price: 500, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:medieval_high_bed_queen_cyan", price: 600, count: 1, nbt: {}, lore: [],
    variantLabel: "Medieval High Bed (Queen)",
    variants: [
        { id: "decocraft:medieval_high_bed_queen_black", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_blue", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_cyan", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_gray", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_green", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_light_blue", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_lime", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_magenta", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_orange", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_pink", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_purple", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_red", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_silver", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_white", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_bed_queen_yellow", price: 600, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:medieval_high_canopy_bed_king_cyan", price: 600, count: 1, nbt: {}, lore: [],
    variantLabel: "Medieval Canopy Bed (King)",
    variants: [
        { id: "decocraft:medieval_high_canopy_bed_king_black", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_blue", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_cyan", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_gray", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_green", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_light_blue", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_lime", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_magenta", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_orange", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_pink", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_purple", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_red", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_silver", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_white", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_king_yellow", price: 600, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:medieval_high_canopy_bed_queen_cyan", price: 600, count: 1, nbt: {}, lore: [],
    variantLabel: "Medieval Canopy Bed (Queen)",
    variants: [
        { id: "decocraft:medieval_high_canopy_bed_queen_black", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_blue", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_cyan", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_gray", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_green", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_light_blue", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_lime", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_magenta", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_orange", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_pink", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_purple", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_red", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_silver", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_white", price: 600, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:medieval_high_canopy_bed_queen_yellow", price: 600, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:single_bed_birch_cyan", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Single Bed (Birch)",
    variants: [
        { id: "decocraft:single_bed_birch_black", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_blue", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_brown", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_cyan", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_gray", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_green", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_light_blue", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_light_gray", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_lime", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_magenta", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_orange", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_pink", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_purple", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_red", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_white", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_birch_yellow", price: 50, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:single_bed_black_cyan", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Single Bed (Black)",
    variants: [
        { id: "decocraft:single_bed_black_black", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_blue", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_brown", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_cyan", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_gray", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_green", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_light_blue", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_light_gray", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_lime", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_magenta", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_orange", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_pink", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_purple", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_red", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_white", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_black_yellow", price: 50, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:single_bed_oak_cyan", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Single Bed (Oak)",
    variants: [
        { id: "decocraft:single_bed_oak_black", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_blue", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_brown", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_cyan", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_gray", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_green", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_light_blue", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_light_gray", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_lime", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_magenta", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_orange", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_pink", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_purple", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_red", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_white", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_oak_yellow", price: 50, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:single_bed_palm_cyan", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Single Bed (Palm)",
    variants: [
        { id: "decocraft:single_bed_palm_black", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_blue", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_brown", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_cyan", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_gray", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_green", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_light_blue", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_light_gray", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_lime", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_magenta", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_orange", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_pink", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_purple", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_red", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_white", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_palm_yellow", price: 50, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:single_bed_spruce_cyan", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Single Bed (Spruce)",
    variants: [
        { id: "decocraft:single_bed_spruce_black", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_blue", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_brown", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_cyan", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_gray", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_green", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_light_blue", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_light_gray", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_lime", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_magenta", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_orange", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_pink", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_purple", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_red", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_white", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_spruce_yellow", price: 50, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:single_bed_white_cyan", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Single Bed (White)",
    variants: [
        { id: "decocraft:single_bed_white_black", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_blue", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_brown", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_cyan", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_gray", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_green", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_light_blue", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_light_gray", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_lime", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_magenta", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_orange", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_pink", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_purple", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_red", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_white", price: 50, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:single_bed_white_yellow", price: 50, count: 1, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:wrought_iron_bed_green", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Wrought Iron Bed",
    variants: [
        { id: "decocraft:wrought_iron_bed_black", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:wrought_iron_bed_green", price: 500, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:wrought_iron_bed_white", price: 500, count: 1, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:bedside_table_birch", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Bedside Table",
    variants: [
        { id: "decocraft:bedside_table_birch",  price: 60, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bedside_table_black",  price: 60, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bedside_table_cherry", price: 60, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bedside_table_ebony",  price: 60, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bedside_table_oak",    price: 60, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bedside_table_palm",   price: 60, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bedside_table_spruce", price: 60, count: 1, nbt: {}, lore: [] },
        { id: "decocraft:bedside_table_white",  price: 60, count: 1, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:closet_1_birch", count: 1, price: 200, nbt: {}, lore: [],
    variantLabel: "Closet 1",
    variants: [
{ id: "decocraft:closet_1_birch", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_1_black", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_1_cherry", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_1_ebony", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_1_oak", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_1_palm", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_1_spruce", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_1_white", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:closet_2_birch", count: 1, price: 200, nbt: {}, lore: [],
    variantLabel: "Closet 2",
    variants: [
{ id: "decocraft:closet_2_birch", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_2_black", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_2_cherry", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_2_ebony", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_2_oak", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_2_palm", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_2_spruce", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_2_white", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:closet_3_birch", count: 1, price: 200, nbt: {}, lore: [],
    variantLabel: "Closet 3",
    variants: [
{ id: "decocraft:closet_3_birch", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_3_black", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_3_cherry", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_3_ebony", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_3_oak", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_3_palm", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_3_spruce", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_3_white", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:closet_4_birch", count: 1, price: 200, nbt: {}, lore: [],
    variantLabel: "Closet 4",
    variants: [
{ id: "decocraft:closet_4_birch", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_4_black", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_4_cherry", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_4_ebony", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_4_oak", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_4_palm", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_4_spruce", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_4_white", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:closet_5_birch", count: 1, price: 200, nbt: {}, lore: [],
    variantLabel: "Closet 5",
    variants: [
{ id: "decocraft:closet_5_birch", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_5_black", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_5_cherry", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_5_ebony", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_5_oak", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_5_palm", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_5_spruce", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_5_white", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:closet_6_birch", count: 1, price: 200, nbt: {}, lore: [],
    variantLabel: "Closet 6",
    variants: [
{ id: "decocraft:closet_6_birch", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_6_black", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_6_cherry", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_6_ebony", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_6_oak", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_6_palm", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_6_spruce", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_6_white", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:closet_7_birch", count: 1, price: 200, nbt: {}, lore: [],
    variantLabel: "Closet 7",
    variants: [
{ id: "decocraft:closet_7_birch", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_7_black", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_7_cherry", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_7_ebony", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_7_oak", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_7_palm", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_7_spruce", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:closet_7_white", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:clothes_rack_1", count: 1, price: 50, nbt: {}, lore: [],
    variantLabel: "Clothes_rack",
    variants: [
{ id: "decocraft:clothes_rack_1", count: 1, price: 150, nbt: {}, lore: [] },
{ id: "decocraft:clothes_rack_2", count: 1, price: 150, nbt: {}, lore: [] },
{ id: "decocraft:clothes_rack_3", count: 1, price: 150, nbt: {}, lore: [] },
{ id: "decocraft:clothes_rack_3_alt", count: 1, price: 150, nbt: {}, lore: [] },
{ id: "decocraft:clothes_rack_4", count: 1, price: 150, nbt: {}, lore: [] },
{ id: "decocraft:clothes_rack_5", count: 1, price: 150, nbt: {}, lor150e: [] },
    ]
},

{
    id: "decocraft:coat_stand_birch", count: 1, price: 20, nbt: {}, lore: [],
    variantLabel: "Coat Stand",
    variants: [
{ id: "decocraft:coat_stand_birch", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:coat_stand_black", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:coat_stand_oak", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:coat_stand_palm", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:coat_stand_spruce", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:coat_stand_white", count: 1, price: 20, nbt: {}, lore: [] },
]
},
// ── Decocraft Bedroom Furniture ──
{
    id: "decocraft:crib_birch", price: 300, count: 1, nbt: {}, lore: [],
    variantLabel: "Crib",
    variants: [
        { id: "decocraft:crib_birch", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:crib_black", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:crib_oak", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:crib_palm", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:crib_spruce", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:crib_white", count: 1, price: 300, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:locker_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Locker",
    variants: [
        { id: "decocraft:locker_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:locker_blue", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:locker_cyan", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:locker_gray", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:locker_green", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:locker_lime", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:locker_magenta", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:locker_orange", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:locker_pink", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:locker_purple", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:locker_red", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:locker_white", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:locker_yellow", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:locker_light_blue", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Locker Light",
    variants: [
        { id: "decocraft:locker_light_blue", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:locker_light_gray", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:standing_mirror_birch", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Standing Mirror",
    variants: [
        { id: "decocraft:standing_mirror_birch", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:standing_mirror_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:standing_mirror_cherry", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:standing_mirror_ebony", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:standing_mirror_oak", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:standing_mirror_palm", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:standing_mirror_spruce", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:standing_mirror_white", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:vanity_center_birch", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Vanity Center",
    variants: [
        { id: "decocraft:vanity_center_birch", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_center_black", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_center_cherry", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_center_ebony", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_center_oak", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_center_palm", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_center_spruce", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_center_white", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:vanity_left_birch", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Vanity Left",
    variants: [
        { id: "decocraft:vanity_left_birch", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_left_black", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_left_cherry", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_left_ebony", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_left_oak", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_left_palm", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_left_spruce", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_left_white", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:vanity_right_birch", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Vanity Right",
    variants: [
        { id: "decocraft:vanity_right_birch", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_right_black", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_right_cherry", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_right_ebony", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_right_oak", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_right_palm", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_right_spruce", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:vanity_right_white", count: 1, price: 150, nbt: {}, lore: [] },
    ]
}
],
    // Tab 4 - Storage
[


{
    id: "decocraft:blender_black", price: 400, count: 1, nbt: {}, lore: [],
    variantLabel: "Blender",
    variants: [
        { id: "decocraft:blender_black", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:blender_blue", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:blender_cream", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:blender_mint", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:blender_pink", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:blender_red", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:blender_silver", count: 1, price: 400, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:ceiling_fan_birch", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Ceiling Fan",
    variants: [
        { id: "decocraft:ceiling_fan_birch", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:ceiling_fan_black", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:ceiling_fan_cherry", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:ceiling_fan_ebony", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:ceiling_fan_oak", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:ceiling_fan_palm", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:ceiling_fan_spruce", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:ceiling_fan_white", count: 1, price: 500, nbt: {}, lore: [] },
    ]
},

{ id: "decocraft:coffee_grinder", count: 1, price: 300, nbt: {}, lore: [] },
{
    id: "decocraft:desk_fan_black", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Desk Fan",
    variants: [
        { id: "decocraft:desk_fan_black", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:desk_fan_blue", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:desk_fan_cream", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:desk_fan_mint", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:desk_fan_pink", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:desk_fan_red", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:desk_fan_silver", count: 1, price: 500, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:dishwasher", count: 1, price: 800, nbt: {}, lore: [] },
{
    id: "decocraft:dishwasher_open_1", price: 800, count: 1, nbt: {}, lore: [],
    variantLabel: "Dishwasher Open",
    variants: [
        { id: "decocraft:dishwasher_open_1", count: 1, price: 800, nbt: {}, lore: [] },
        { id: "decocraft:dishwasher_open_2", count: 1, price: 800, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:expresso_machine_black", price: 600, count: 1, nbt: {}, lore: [],
    variantLabel: "Expresso Machine",
    variants: [
        { id: "decocraft:expresso_machine_black", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:expresso_machine_blue", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:expresso_machine_cream", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:expresso_machine_mint", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:expresso_machine_pink", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:expresso_machine_red", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:expresso_machine_silver", count: 1, price: 600, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:floor_mixer_black", price: 400, count: 1, nbt: {}, lore: [],
    variantLabel: "Floor Mixer",
    variants: [
        { id: "decocraft:floor_mixer_black", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:floor_mixer_gold", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:floor_mixer_rosegold", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:floor_mixer_silver", count: 1, price: 400, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:fridge_large", count: 1, price: 2000, nbt: {}, lore: [] },
{
    id: "decocraft:fridge_large_open_bottom", price: 2000, count: 1, nbt: {}, lore: [],
    variantLabel: "Fridge Large Open",
    variants: [
        { id: "decocraft:fridge_large_open_bottom", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_large_open_full", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_large_open_top", count: 1, price: 2000, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:fridge_small_black", price: 2000, count: 1, nbt: {}, lore: [],
    variantLabel: "Fridge Small",
    variants: [
        { id: "decocraft:fridge_small_black", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_blue", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_cream", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_mint", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_pink", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_red", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_silver", count: 1, price: 2000, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:fridge_small_open_bottom_black", price: 2000, count: 1, nbt: {}, lore: [],
    variantLabel: "Fridge Small Open Bottom",
    variants: [
        { id: "decocraft:fridge_small_open_bottom_black", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_open_bottom_blue", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_open_bottom_cream", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_open_bottom_mint", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_open_bottom_pink", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_open_bottom_red", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_open_bottom_silver", count: 1, price: 2000, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:fridge_small_open_top_black", price: 2000, count: 1, nbt: {}, lore: [],
    variantLabel: "Fridge Small Open Top",
    variants: [
        { id: "decocraft:fridge_small_open_top_black", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_open_top_blue", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_open_top_cream", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_open_top_mint", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_open_top_pink", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_open_top_red", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:fridge_small_open_top_silver", count: 1, price: 2000, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:microwave", count: 1, price: 500, nbt: {}, lore: [] },
{
    id: "decocraft:mixer_black", price: 400, count: 1, nbt: {}, lore: [],
    variantLabel: "Mixer",
    variants: [
        { id: "decocraft:mixer_black", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:mixer_blue", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:mixer_cream", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:mixer_mint", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:mixer_pink", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:mixer_red", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:mixer_silver", count: 1, price: 400, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:pizza_oven", count: 1, price: 1500, nbt: {}, lore: [] },
{
    id: "decocraft:robo_vacuum_black", price: 800, count: 1, nbt: {}, lore: [],
    variantLabel: "Robo Vacuum",
    variants: [
        { id: "decocraft:robo_vacuum_black", count: 1, price: 800, nbt: {}, lore: [] },
        { id: "decocraft:robo_vacuum_white", count: 1, price: 800, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:stove", count: 1, price: 1000, nbt: {}, lore: [] },
{
    id: "decocraft:toaster_black", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Toaster",
    variants: [
        { id: "decocraft:toaster_black", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:toaster_blue", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:toaster_cream", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:toaster_mint", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:toaster_pink", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:toaster_red", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:toaster_silver", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:wall_mixer_black", price: 300, count: 1, nbt: {}, lore: [],
    variantLabel: "Wall Mixer",
    variants: [
        { id: "decocraft:wall_mixer_black", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:wall_mixer_gold", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:wall_mixer_rosegold", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:wall_mixer_silver", count: 1, price: 300, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:wireless_vacuum", count: 1, price: 800, nbt: {}, lore: [] },
// ── Kitchen Furniture ──
{
    id: "decocraft:dish_rack_birch", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Dish Rack",
    variants: [
        { id: "decocraft:dish_rack_birch", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:dish_rack_black", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:dish_rack_cherry", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:dish_rack_ebony", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:dish_rack_oak", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:dish_rack_palm", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:dish_rack_spruce", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:dish_rack_white", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:kitchen_sink_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Kitchen Sink",
    variants: [
        { id: "decocraft:kitchen_sink_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:kitchen_sink_brass", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:kitchen_sink_gold", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:kitchen_sink_silver", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:kitchen_sink_rose_gold", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:knife_block", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:mason_jar_dispenser_horchata", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Mason Jar Dispenser",
    variants: [
        { id: "decocraft:mason_jar_dispenser_horchata", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:mason_jar_dispenser_jamaica", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:mason_jar_dispenser_lemonade", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:mason_jar_dispenser_limeade", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:mason_jar_dispenser_orangeade", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:mason_jar_dispenser_tamarind", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:mason_jar_dispenser_lemonade_pink", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:round_sink_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Round Sink",
    variants: [
        { id: "decocraft:round_sink_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:round_sink_gold", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:round_sink_silver", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:round_sink_rose_gold", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:spice_drying_rack_birch", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Spice Drying Rack",
    variants: [
        { id: "decocraft:spice_drying_rack_birch", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_drying_rack_cherry", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_drying_rack_ebony", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_drying_rack_oak", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_drying_rack_palm", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_drying_rack_spruce", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_drying_rack_white", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:spice_drying_rack_chains_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Spice Drying Rack Chains",
    variants: [
        { id: "decocraft:spice_drying_rack_chains_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_drying_rack_chains_gold", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_drying_rack_chains_silver", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:spice_rack_birch", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Spice Rack",
    variants: [
        { id: "decocraft:spice_rack_birch", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_rack_cherry", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_rack_ebony", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_rack_oak", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_rack_palm", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_rack_spruce", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:spice_rack_white", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:square_sink_black", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Square Sink",
    variants: [
        { id: "decocraft:square_sink_black", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:square_sink_gold", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:square_sink_silver", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:square_sink_rose_gold", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:wall_hood", count: 1, price: 200, nbt: {}, lore: [] },
{
    id: "decocraft:wall_sink_aqua", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Wall Sink",
    variants: [
        { id: "decocraft:wall_sink_aqua", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:wall_sink_blue", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:wall_sink_lavender", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:wall_sink_lime", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:wall_sink_mint", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:wall_sink_orange", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:wall_sink_pink", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:wall_sink_white", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:wall_sink_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
// ── Food & Drinks ──
{ id: "decocraft:apple_pie", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:apple_pie_slice", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:backpack_black", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Backpack",
    variants: [
        { id: "decocraft:backpack_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:backpack_blue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:backpack_cyan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:backpack_gray", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:backpack_green", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:backpack_lime", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:backpack_magenta", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:backpack_orange", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:backpack_pink", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:backpack_purple", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:backpack_red", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:backpack_white", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:backpack_yellow", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:backpack_light_blue", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Backpack Light",
    variants: [
        { id: "decocraft:backpack_light_blue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:backpack_light_gray", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:baguette_basket", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "decocraft:banana_split", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:blueberry_loaf_cake", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "decocraft:blueberry_pie", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:blueberry_pie_slice", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:boba_tea_matcha", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Boba Tea",
    variants: [
        { id: "decocraft:boba_tea_matcha", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:boba_tea_oolong", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:boba_tea_strawberry", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:bobbing_apples", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:bowl_of_cereal_alphabits", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Bowl Of Cereal",
    variants: [
        { id: "decocraft:bowl_of_cereal_alphabits", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_capncrunch", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_cheerios", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_ciniminis", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_cookiecrisp", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_cornflakes", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_cornpops", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_countchocula", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_frosties", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_fruitypebbles", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_goldencrisp", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_goldengrahams", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_honeycomb", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_honeynutcheerios", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_honeysmacks", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_hoops", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_kix", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_life", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_luckycharms", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_minecraft", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_raisinbran", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_ricekrispies", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_specialk", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_total", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:bowl_of_cereal_trix", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:burger_and_fries", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:burger_cart", price: 1000, count: 1, nbt: {}, lore: [],
    variantLabel: "Burger",
    variants: [
        { id: "decocraft:burger_cart", count: 1, price: 1000, nbt: {}, lore: [] },
        { id: "decocraft:burger_shark", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:cake_birthday_chocolate_flipbook", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:cake_birthday_strawberry_flipbook", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:cake_birthday_vanilla_flipbook", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:cake_candy_corn", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:cake_gingerbread", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Cake",
    variants: [
        { id: "decocraft:cake_gingerbread", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:cake_pumpkin", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:cake_wreath", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:candy_cart", count: 1, price: 1000, nbt: {}, lore: [] },
{ id: "decocraft:candy_corn_bowl", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:caramel_apples", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:caramel_apples_nuts", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Caramel Apples",
    variants: [
        { id: "decocraft:caramel_apples_nuts", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:caramel_apples_sludge", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:caramel_apples_sprinkles", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:cheese_board", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:concha_chocolate", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Concha",
    variants: [
        { id: "decocraft:concha_chocolate", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:concha_strawberry", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:concha_sugar", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:concha_vanilla", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:cookie_plate_chocolate_chip", count: 1, price: 40, nbt: {}, lore: [] },
{
    id: "decocraft:cookie_plate_gingerbread", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Cookie Plate",
    variants: [
        { id: "decocraft:cookie_plate_gingerbread", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:cookie_plate_mmm", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:cookie_plate_raisins", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:cornucopia", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "decocraft:corn_dog", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:cupcake_bone", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Cupcake",
    variants: [
        { id: "decocraft:cupcake_bone", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:cupcake_eye", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:cupcake_gravestone", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:cupcake_witch", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:cupcake_candy_corn", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:diner_condiments", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:disposable_coffee", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "decocraft:dumplings", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:fruit_bowl", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Fruit",
    variants: [
        { id: "decocraft:fruit_bowl", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:fruit_cart", count: 1, price: 1000, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:honey_pot", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "decocraft:hot_dog", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:hot_dog_cart", count: 1, price: 1000, nbt: {}, lore: [] },
{ id: "decocraft:ice_cream_cart", count: 1, price: 1000, nbt: {}, lore: [] },
{
    id: "decocraft:jelly_blueberry", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Jelly",
    variants: [
        { id: "decocraft:jelly_blueberry", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_cherry", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_grape", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_lime", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_orange", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_pineapple", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_rainbow", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_razzleberry", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:jelly_small_blueberry", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Jelly Small",
    variants: [
        { id: "decocraft:jelly_small_blueberry", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_small_cherry", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_small_grape", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_small_lime", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_small_orange", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_small_pineapple", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_small_rainbow", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jelly_small_razzleberry", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:lemon_loaf_cake", count: 1, price: 40, nbt: {}, lore: [] },
{
    id: "decocraft:lunch_box_black", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Lunch Box",
    variants: [
        { id: "decocraft:lunch_box_black", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:lunch_box_blue", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:lunch_box_cyan", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:lunch_box_gray", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:lunch_box_green", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:lunch_box_lime", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:lunch_box_magenta", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:lunch_box_orange", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:lunch_box_pink", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:lunch_box_purple", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:lunch_box_red", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:lunch_box_white", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:lunch_box_yellow", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:lunch_box_light_blue", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Lunch Box Light",
    variants: [
        { id: "decocraft:lunch_box_light_blue", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:lunch_box_light_gray", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:matcha_roll", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "decocraft:nachos", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:nigiri", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:nori_roll", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:pan_de_muerto", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:pizza_box_cheese", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Pizza Box",
    variants: [
        { id: "decocraft:pizza_box_cheese", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pizza_box_hawaiian", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pizza_box_mushroom", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:pizza_box_pepperoni", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:popcorn_cart", price: 1000, count: 1, nbt: {}, lore: [],
    variantLabel: "Popcorn",
    variants: [
        { id: "decocraft:popcorn_cart", count: 1, price: 1000, nbt: {}, lore: [] },
        { id: "decocraft:popcorn_machine", count: 1, price: 800, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:pretzel", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Pretzel",
    variants: [
        { id: "decocraft:pretzel", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:pretzel_cart", count: 1, price: 1000, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:pudding", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Pudding",
    variants: [
        { id: "decocraft:pudding", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:pudding_small", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:pumpkin_pie", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:pumpkin_pie_slice", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:ramen_blue", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Ramen",
    variants: [
        { id: "decocraft:ramen_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:ramen_cart", count: 1, price: 1000, nbt: {}, lore: [] },
        { id: "decocraft:ramen_green", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:ramen_orange", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:ramen_red", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:raspberry_pie", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:raspberry_pie_slice", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:rice_roll", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:salad", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:sipply_cup_berry", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Sipply Cup",
    variants: [
        { id: "decocraft:sipply_cup_berry", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:sipply_cup_black", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:sipply_cup_lavender", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:sipply_cup_lime", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:sipply_cup_mint", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:sipply_cup_ocean", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:sipply_cup_orange", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:sipply_cup_peach", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:sipply_cup_pink", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:sipply_cup_red", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:sipply_cup_yellow", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:spaghetti", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:spit_pig", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:strawberry_loaf_cake", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "decocraft:sushi_mix", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:table_setting_double", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Table Setting",
    variants: [
        { id: "decocraft:table_setting_double", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:table_setting_single", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:tacos_al_pastor", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:taco_cart", count: 1, price: 1000, nbt: {}, lore: [] },
{
    id: "decocraft:tea_set_blue", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Tea Set",
    variants: [
        { id: "decocraft:tea_set_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:tea_set_lavender", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:tea_set_mint", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:tea_set_orange", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:tea_set_pink", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:tea_set_white", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:tea_set_yellow", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:tempura_shrimp", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:tray_cinnamon_rolls", count: 1, price: 40, nbt: {}, lore: [] },
{
    id: "decocraft:tray_conchas", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Tray",
    variants: [
        { id: "decocraft:tray_conchas", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:tray_croissants", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:tray_cupcakes_halloween", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "decocraft:tray_pan_de_muerto", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "decocraft:turkey_platter", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:bathroom_counter_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Bathroom Counter",
    variants: [
        { id: "decocraft:bathroom_counter_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_counter_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_counter_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_counter_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_counter_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bathroom_counter_left_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Bathroom Counter Left",
    variants: [
        { id: "decocraft:bathroom_counter_left_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_counter_left_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_counter_left_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_counter_left_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_counter_left_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bathroom_counter_right_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Bathroom Counter Right",
    variants: [
        { id: "decocraft:bathroom_counter_right_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_counter_right_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_counter_right_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_counter_right_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_counter_right_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bottom_cabinet_1_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Bottom Cabinet 1",
    variants: [
        { id: "decocraft:bottom_cabinet_1_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_1_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_1_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_1_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_1_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_1_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_1_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_1_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bottom_cabinet_2_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Bottom Cabinet 2",
    variants: [
        { id: "decocraft:bottom_cabinet_2_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_2_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_2_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_2_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_2_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_2_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_2_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_2_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bottom_cabinet_corner_inner_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Bottom Cabinet Corner Inner",
    variants: [
        { id: "decocraft:bottom_cabinet_corner_inner_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_inner_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_inner_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_inner_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_inner_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_inner_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_inner_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_inner_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bottom_cabinet_corner_outer_1_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Bottom Cabinet Corner Outer 1",
    variants: [
        { id: "decocraft:bottom_cabinet_corner_outer_1_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_1_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_1_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_1_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_1_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_1_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_1_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_1_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bottom_cabinet_corner_outer_2_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Bottom Cabinet Corner Outer 2",
    variants: [
        { id: "decocraft:bottom_cabinet_corner_outer_2_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_2_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_2_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_2_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_2_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_2_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_2_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_corner_outer_2_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bottom_cabinet_island_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Bottom Cabinet Island",
    variants: [
        { id: "decocraft:bottom_cabinet_island_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_island_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_island_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_island_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_island_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_island_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_island_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bottom_cabinet_island_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:china_cabinet_birch", price: 180, count: 1, nbt: {}, lore: [],
    variantLabel: "China Cabinet",
    variants: [
        { id: "decocraft:china_cabinet_birch", count: 1, price: 180, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_black", count: 1, price: 180, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_cherry", count: 1, price: 180, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_ebony", count: 1, price: 180, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_oak", count: 1, price: 180, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_palm", count: 1, price: 180, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_spruce", count: 1, price: 180, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_white", count: 1, price: 180, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:china_cabinet_open_birch", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "China Cabinet Open",
    variants: [
        { id: "decocraft:china_cabinet_open_birch", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_open_black", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_open_cherry", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_open_ebony", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_open_oak", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_open_palm", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_open_spruce", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:china_cabinet_open_white", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:display_counter_bottom_ebony", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Display Counter Bottom",
    variants: [
        { id: "decocraft:display_counter_bottom_ebony", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:display_counter_bottom_oak", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:display_counter_bottom_palm", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:display_counter_bottom_spruce", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:display_counter_bottom_white", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:display_counter_top_cookies", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Display Counter Top",
    variants: [
        { id: "decocraft:display_counter_top_cookies", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:display_counter_top_doughnuts", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:display_counter_top_pastries", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:display_counter_top_pie", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:display_counter_top_pizza", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:display_counter_top_icecream_1", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Display Counter Top Icecream",
    variants: [
        { id: "decocraft:display_counter_top_icecream_1", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:display_counter_top_icecream_2", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:display_counter_top_icecream_3", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:display_counter_top_pie_slices", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:display_counter_top_popsicles_1", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Display Counter Top Popsicles",
    variants: [
        { id: "decocraft:display_counter_top_popsicles_1", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:display_counter_top_popsicles_2", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:display_counter_top_popsicles_3", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:filing_cabinet_birch", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Filing Cabinet",
    variants: [
        { id: "decocraft:filing_cabinet_birch", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:filing_cabinet_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:filing_cabinet_cherry", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:filing_cabinet_ebony", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:filing_cabinet_oak", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:filing_cabinet_palm", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:filing_cabinet_spruce", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:filing_cabinet_white", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:middle_cabinet_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Middle Cabinet",
    variants: [
        { id: "decocraft:middle_cabinet_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:middle_cabinet_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:middle_cabinet_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:middle_cabinet_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:middle_cabinet_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:middle_cabinet_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:middle_cabinet_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:middle_cabinet_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:modular_desk_drawers_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Modular Desk Drawers",
    variants: [
        { id: "decocraft:modular_desk_drawers_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_drawers_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_drawers_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_drawers_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_drawers_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_drawers_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_drawers_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_drawers_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:modular_desk_storage_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Modular Desk Storage",
    variants: [
        { id: "decocraft:modular_desk_storage_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_storage_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_storage_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_storage_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_storage_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_storage_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_storage_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:modular_desk_storage_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:sink_cabinet_birch", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Sink Cabinet",
    variants: [
        { id: "decocraft:sink_cabinet_birch", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:sink_cabinet_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:sink_cabinet_cherry", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:sink_cabinet_ebony", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:sink_cabinet_oak", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:sink_cabinet_palm", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:sink_cabinet_spruce", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:sink_cabinet_white", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:top_cabinet_1_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Top Cabinet 1",
    variants: [
        { id: "decocraft:top_cabinet_1_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_1_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_1_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_1_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_1_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_1_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_1_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_1_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:top_cabinet_2_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Top Cabinet 2",
    variants: [
        { id: "decocraft:top_cabinet_2_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_2_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_2_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_2_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_2_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_2_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_2_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_2_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:top_cabinet_3_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Top Cabinet 3",
    variants: [
        { id: "decocraft:top_cabinet_3_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_3_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_3_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_3_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_3_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_3_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_3_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_3_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:top_cabinet_4_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Top Cabinet 4",
    variants: [
        { id: "decocraft:top_cabinet_4_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_4_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_4_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_4_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_4_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_4_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_4_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_4_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:top_cabinet_corner_inner_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Top Cabinet Corner Inner",
    variants: [
        { id: "decocraft:top_cabinet_corner_inner_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_inner_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_inner_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_inner_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_inner_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_inner_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_inner_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_inner_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:top_cabinet_corner_outer_birch", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Top Cabinet Corner Outer",
    variants: [
        { id: "decocraft:top_cabinet_corner_outer_birch", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_outer_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_outer_cherry", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_outer_ebony", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_outer_oak", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_outer_palm", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_outer_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:top_cabinet_corner_outer_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:wine_cabinet_1_birch", price: 250, count: 1, nbt: {}, lore: [],
    variantLabel: "Wine Cabinet 1",
    variants: [
        { id: "decocraft:wine_cabinet_1_birch", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_1_black", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_1_cherry", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_1_ebony", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_1_oak", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_1_palm", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_1_spruce", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_1_white", count: 1, price: 250, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:wine_cabinet_2_birch", price: 250, count: 1, nbt: {}, lore: [],
    variantLabel: "Wine Cabinet 2",
    variants: [
        { id: "decocraft:wine_cabinet_2_birch", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_2_black", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_2_cherry", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_2_ebony", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_2_oak", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_2_palm", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_2_spruce", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:wine_cabinet_2_white", count: 1, price: 250, nbt: {}, lore: [] },
    ]
},
],


    // Tab 6 - Bathroom
[
{
    id: "decocraft:bathroom_disabled", price: 10, count: 1, nbt: {}, lore: [],
    variantLabel: "Bathroom",
    variants: [
        { id: "decocraft:bathroom_disabled", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_female", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_male", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_neutral", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:bathroom_unisex", count: 1, price: 10, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bathtub_aqua", price: 400, count: 1, nbt: {}, lore: [],
    variantLabel: "Bathtub",
    variants: [
        { id: "decocraft:bathtub_aqua", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_blue", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_lavender", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_lime", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_mint", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_orange", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_pink", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_white", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_yellow", count: 1, price: 400, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:bathtub_clawfoot_black", price: 800, count: 1, nbt: {}, lore: [],
    variantLabel: "Bathtub Clawfoot",
    variants: [
        { id: "decocraft:bathtub_clawfoot_black", count: 1, price: 800, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_clawfoot_gold", count: 1, price: 800, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_clawfoot_silver", count: 1, price: 800, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:bathtub_clawfoot_black_water", count: 1, price: 800, nbt: {}, lore: [] },
{ id: "decocraft:bathtub_clawfoot_gold_water", count: 1, price: 800, nbt: {}, lore: [] },
{ id: "decocraft:bathtub_clawfoot_rose_gold", count: 1, price: 800, nbt: {}, lore: [] },
{ id: "decocraft:bathtub_clawfoot_rose_gold_water", count: 1, price: 800, nbt: {}, lore: [] },
{ id: "decocraft:bathtub_clawfoot_silver_water", count: 1, price: 800, nbt: {}, lore: [] },
{
    id: "decocraft:bathtub_water_aqua", price: 400, count: 1, nbt: {}, lore: [],
    variantLabel: "Bathtub Water",
    variants: [
        { id: "decocraft:bathtub_water_aqua", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_water_blue", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_water_lavender", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_water_lime", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_water_mint", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_water_orange", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_water_pink", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_water_white", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:bathtub_water_yellow", count: 1, price: 400, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:brush_and_comb", count: 1, price: 10, nbt: {}, lore: [] },
{
    id: "decocraft:hand_towel_bar_black", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Hand Towel Bar",
    variants: [
        { id: "decocraft:hand_towel_bar_black", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:hand_towel_bar_gold", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:hand_towel_bar_silver", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:hand_towel_bar_rose_gold", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:pedal_trash_can", count: 1, price: 25, nbt: {}, lore: [] },
{
    id: "decocraft:plunger_black", price: 15, count: 1, nbt: {}, lore: [],
    variantLabel: "Plunger",
    variants: [
        { id: "decocraft:plunger_black", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:plunger_red", count: 1, price: 15, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:rubber_ducky", count: 1, price: 10, nbt: {}, lore: [] },
{
    id: "decocraft:shower_caddy_black", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Shower Caddy",
    variants: [
        { id: "decocraft:shower_caddy_black", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:shower_caddy_gold", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:shower_caddy_silver", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:shower_caddy_rose_gold", count: 1, price: 40, nbt: {}, lore: [] },
{
    id: "decocraft:shower_system_black", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Shower System",
    variants: [
        { id: "decocraft:shower_system_black", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:shower_system_gold", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:shower_system_silver", count: 1, price: 500, nbt: {}, lore: [] },
    ]
},

{
    id: "decocraft:sink_clutter_black", price: 15, count: 1, nbt: {}, lore: [],
    variantLabel: "Sink Clutter",
    variants: [
        { id: "decocraft:sink_clutter_black", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:sink_clutter_blue", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:sink_clutter_cream", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:sink_clutter_pink", count: 1, price: 15, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:toilet_aqua", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Toilet",
    variants: [
        { id: "decocraft:toilet_aqua", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:toilet_blue", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:toilet_lavender", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:toilet_lime", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:toilet_mint", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:toilet_orange", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:toilet_pink", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:toilet_white", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:toilet_yellow", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:toilet_paper_black", price: 10, count: 1, nbt: {}, lore: [],
    variantLabel: "Toilet Paper",
    variants: [
        { id: "decocraft:toilet_paper_black", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:toilet_paper_gold", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:toilet_paper_rosegold", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:toilet_paper_silver", count: 1, price: 10, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:towel_bar_black", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Towel Bar",
    variants: [
        { id: "decocraft:towel_bar_black", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:towel_bar_gold", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:towel_bar_silver", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:towel_bar_rose_gold", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:towel_heater_black", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Towel Heater",
    variants: [
        { id: "decocraft:towel_heater_black", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:towel_heater_gold", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:towel_heater_silver", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:towel_heater_rose_gold", count: 1, price: 150, nbt: {}, lore: [] },
{ id: "decocraft:trash_can", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:trash_can_clutter", count: 1, price: 20, nbt: {}, lore: [] },
{
    id: "decocraft:waste_basket_black", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Waste Basket",
    variants: [
        { id: "decocraft:waste_basket_black", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:waste_basket_silver", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:wooden_bathtub", count: 1, price: 600, nbt: {}, lore: [] },
],
    // Tab 7 - Decor & Misc
[
// ── Yuushya Misc ──
{ id: "armourers_workshop:mannequin", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "immersive_paintings:painting", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "immersive_paintings:glow_painting", count: 1, price: 150, nbt: {}, lore: [] },
{ id: "yuushya:decoration_bookshelf", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:slippers", count: 1, price: 5, nbt: {}, lore: [] },
{ id: "yuushya:decorative_shelf", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:bucket", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:bench", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:shelf", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:bookshelf", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:uncovered_shelf", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:leaning_ladder", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:foldable_ladder", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:clock", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:round_clock", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:skateboard", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:leaned_skateboard", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:basket", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:backpack", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:phone", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "yuushya:sticky_note", count: 1, price: 5, nbt: {}, lore: [] },
{ id: "yuushya:list", count: 1, price: 5, nbt: {}, lore: [] },
{ id: "yuushya:order_list", count: 1, price: 5, nbt: {}, lore: [] },
{ id: "yuushya:mounted_album", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "yuushya:album", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "yuushya:broken_list", count: 1, price: 5, nbt: {}, lore: [] },
{ id: "yuushya:completely_broken_list", count: 1, price: 5, nbt: {}, lore: [] },
{ id: "yuushya:water_stain_top", count: 1, price: 4, nbt: {}, lore: [] },
{ id: "yuushya:water_stain_bottom", count: 1, price: 4, nbt: {}, lore: [] },
{ id: "yuushya:tissue", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:tissue_", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:ashtray", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:closet_handle_left", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "yuushya:closet_handle_right", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "yuushya:blackboard", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:blackboard_eraser", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:mounted_blackboard_eraser", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:centre_speaker", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:centre_speaker_sym", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:chalk_box", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "yuushya:porcelain_vase", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:gold_vase", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:menu", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:globe", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:books", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:sorted_magazine", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:piled_magazine", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:dumbbell", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:pingpong_paddles", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:pingpong_paddle_with_ball", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:binoculars", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:flower_painting", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:water_dispenser", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "yuushya:large_water_bottle", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:kettle", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:rusty_bucket", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mirror", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_mirror", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:patterned_slippers", count: 1, price: 5, nbt: {}, lore: [] },
{ id: "yuushya:mop", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mop_bucket", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:calendar", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mailbox", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:vertical_mailbox", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:newspaper_box", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:wastepaper_basket", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:glass_showcase", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:pigment_bucket", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:easel", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:easel_with_canvas", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "yuushya:toilet_water_tank", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:sink", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "yuushya:sink_", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "yuushya:package_1", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:big_package", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:unboxed_package", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:uncovered_package", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:glass_rainshed", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:big_oak_plank", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "yuushya:big_acacia_plank", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "yuushya:display_cabinet", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:guitar", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "yuushya:vinyl_record_red", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:vinyl_record_yellow", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:vinyl_record_cyan", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:vinyl_record_white", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "yuushya:umbrella_red", count: 1, price: 60, nbt: {}, lore: [],
    variantLabel: "Umbrella",
    variants: [
{ id: "yuushya:umbrella_red", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "yuushya:umbrella_blue", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "yuushya:umbrella_orange", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "yuushya:mounted_cloth_3", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_cloth_2", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_cloth_0", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_cloth_1", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_16", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_15", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_14", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_13", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_12", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_11", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_10", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_9", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_8", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_7", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_6", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_5", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_4", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_3", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_2", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_1", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mounted_clothes_0", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:ceiling_hanger_rod_anchor", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "yuushya:hanger_rod_anchor", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "yuushya:hanged_things_", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:hanged_things", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:hanging_clothes_staff", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:clothes_showcase", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:hanged_clothes", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "yuushya:hanged_cloth", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "yuushya:hanger_rod_rail", count: 1, price: 5, nbt: {}, lore: [] },
{ id: "yuushya:hanger_rod", count: 1, price: 5, nbt: {}, lore: [] },
{ id: "yuushya:venetian_blinds", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "yuushya:lengthened_rain_shed", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "yuushya:rain_shed", count: 1, price: 50, nbt: {}, lore: [] },
// ── Decocraft Decorations & Misc ──
{
    id: "decocraft:arch_mirror_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Arch Mirror",
    variants: [
        { id: "decocraft:arch_mirror_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:arch_mirror_gold", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:arch_mirror_silver", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:arch_mirror_rose_gold", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:balloons_indie", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Balloons",
    variants: [
        { id: "decocraft:balloons_indie", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloons_pastel", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloons_rainbow", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:balloons_small_1", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Balloons Small",
    variants: [
        { id: "decocraft:balloons_small_1", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloons_small_2", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloons_small_3", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloons_small_halloween", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloons_small_indie", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloons_small_valentines", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:balloons_small_p_1", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Balloons Small P",
    variants: [
        { id: "decocraft:balloons_small_p_1", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloons_small_p_2", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloons_small_p_3", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:balloon_blue", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Balloon",
    variants: [
        { id: "decocraft:balloon_blue", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_cyan", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_green", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_orange", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_pink", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_purple", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_rainbow", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_red", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_white", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_yellow", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:balloon_hearts_berry_green", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:balloon_hearts_cyan_red", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:balloon_hearts_orange_blue", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:balloon_hearts_pink", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:balloon_hearts_pink_white", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:balloon_hearts_purple_yellow", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:balloon_hearts_p_blue_red", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:balloon_hearts_p_cyan_yellow", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:balloon_hearts_p_lime_orange", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:balloon_hearts_p_pink_yellow", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:balloon_hearts_p_purple_green", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:balloon_hearts_yellow_white", count: 1, price: 20, nbt: {}, lore: [] },
{
    id: "decocraft:balloon_heart_berry", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Balloon Heart",
    variants: [
        { id: "decocraft:balloon_heart_berry", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_blue", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_cyan", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_green", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_orange", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_pink", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_purple", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_rainbow", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_red", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_white", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_yellow", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:balloon_heart_p_blue", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Balloon Heart P",
    variants: [
        { id: "decocraft:balloon_heart_p_blue", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_p_cyan", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_p_green", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_p_lime", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_p_orange", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_p_pink", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_p_purple", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_p_red", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_heart_p_yellow", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:balloon_p_blue", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Balloon P",
    variants: [
        { id: "decocraft:balloon_p_blue", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_p_cyan", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_p_green", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_p_lime", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_p_orange", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_p_pink", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_p_purple", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_p_red", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_p_yellow", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:barrel", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Barrel",
    variants: [
        { id: "decocraft:barrel", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:barrel_carrots", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:barrel_horizontal", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:barrel_potatoes", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:barrel_apples_golden", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Barrel Apples",
    variants: [
        { id: "decocraft:barrel_apples_golden", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:barrel_apples_green", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:barrel_apples_mix", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:barrel_apples_red", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:book_stack_1", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Book Stack",
    variants: [
        { id: "decocraft:book_stack_1", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:book_stack_2", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:book_stack_3", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:book_stack_4", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:broom", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:bunny_plush_light_blue", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "decocraft:cafe_sign", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:cherry_blossom_pink", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Cherry Blossom",
    variants: [
        { id: "decocraft:cherry_blossom_pink", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:cherry_blossom_red", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:cherry_blossom_white", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:cherry_blossom_yellow", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:circle_sign_1", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Circle Sign",
    variants: [
        { id: "decocraft:circle_sign_1", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_10", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_11", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_12", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_13", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_14", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_15", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_2", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_3", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_4", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_5", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_6", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_7", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_8", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_9", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:coin_pile_copper", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Coin Pile",
    variants: [
        { id: "decocraft:coin_pile_copper", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:coin_pile_gold", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:coin_pile_silver", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:cooler", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "decocraft:crystal_ball", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "decocraft:cuckoo_clock", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:discount_25_sign", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:discount_50_sign", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:doorbell_pressed_white", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:doorbell_white", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:dream_catcher", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:dryer", count: 1, price: 1000, nbt: {}, lore: [] },
{
    id: "decocraft:drying_rack_black", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Drying Rack",
    variants: [
        { id: "decocraft:drying_rack_black", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:drying_rack_brass", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:drying_rack_gold", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:drying_rack_silver", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:drying_rack_rose_gold", count: 1, price: 40, nbt: {}, lore: [] },
{
    id: "decocraft:engagement_ring_gold", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Engagement Ring",
    variants: [
        { id: "decocraft:engagement_ring_gold", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:engagement_ring_rosegold", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:engagement_ring_silver", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:envelopes", count: 1, price: 10, nbt: {}, lore: [] },
{
    id: "decocraft:globe", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Globe",
    variants: [
        { id: "decocraft:globe", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:globe_antique", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:grandfather_clock", count: 1, price: 500, nbt: {}, lore: [] },
{
    id: "decocraft:hanging_apothecary", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Hanging",
    variants: [
        { id: "decocraft:hanging_apothecary", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_armorer", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_baker", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_bank", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_blacksmith", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_books", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_butcher", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_camping", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_candy", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_carpenter", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_cartographer", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_cobbler", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_farming", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_fishery", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_fletcher", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_florist", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_furniture", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_honey", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_inn", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_jail", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_jeweler", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_lumber", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_magic", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_mines", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_music", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_pastry", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_pet", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_produce", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_pub", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_shield", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_stables", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_swords", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_tailor", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_toys", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:hanging_winery", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:hanging_general_store", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:help_us", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:ingot_pile_copper", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Ingot Pile",
    variants: [
        { id: "decocraft:ingot_pile_copper", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:ingot_pile_gold", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:ingot_pile_iron", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:ingot_pile_netherite", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:ingot_pile_silver", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:ironing_board", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:janitor_mop_bucket", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:jewelry_box_cyan", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Jewelry Box",
    variants: [
        { id: "decocraft:jewelry_box_cyan", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:jewelry_box_pink", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:jewelry_box_purple", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:jewelry_box_yellow", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},

{ id: "decocraft:keep_out", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:laundry_basket_rattan", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:letter", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "decocraft:makeup", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:mop", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:nail_makeup", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:nail_makeup_messy", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:nes", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:newtons_cradle", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:papel_picado_black", price: 15, count: 1, nbt: {}, lore: [],
    variantLabel: "Papel Picado",
    variants: [
        { id: "decocraft:papel_picado_black", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_blue", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_brown", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_cyan", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_gray", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_green", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_lime", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_magenta", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_orange", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_pink", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_purple", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_red", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_white", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_yellow", count: 1, price: 15, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:papel_picado_light_blue", price: 15, count: 1, nbt: {}, lore: [],
    variantLabel: "Papel Picado Light",
    variants: [
        { id: "decocraft:papel_picado_light_blue", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:papel_picado_light_gray", count: 1, price: 15, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:paper_lantern_1_black", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Paper Lantern 1",
    variants: [
        { id: "decocraft:paper_lantern_1_black", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_blue", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_cream", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_cyan", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_gray", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_green", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_lavender", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_lime", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_magenta", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_mint", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_orange", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_pink", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_purple", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_red", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_white", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_yellow", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:paper_lantern_1_light_blue", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Paper Lantern 1 Light",
    variants: [
        { id: "decocraft:paper_lantern_1_light_blue", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_1_light_yellow", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:pinwheel_1", price: 10, count: 1, nbt: {}, lore: [],
    variantLabel: "Pinwheel",
    variants: [
        { id: "decocraft:pinwheel_1", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:pinwheel_2", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:pinwheel_3", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:pinwheel_4", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:pinwheel_5", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:pinwheel_6", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:pinwheel_7", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:pinwheel_rainbow", count: 1, price: 10, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:poinsettia_pink", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Poinsettia",
    variants: [
        { id: "decocraft:poinsettia_pink", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:poinsettia_red", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:poinsettia_white", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:posable_doll", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:pot_of_gold", count: 1, price: 100, nbt: {}, lore: [] },
{
    id: "decocraft:rectangular_mirror_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Rectangular Mirror",
    variants: [
        { id: "decocraft:rectangular_mirror_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:rectangular_mirror_gold", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:rectangular_mirror_silver", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:rectangular_mirror_rose_gold", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:rose_vase_orange", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Rose Vase",
    variants: [
        { id: "decocraft:rose_vase_orange", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:rose_vase_pink", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:rose_vase_purple", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:rose_vase_red", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:rose_vase_white", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:rose_vase_yellow", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:round_mirror_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Round Mirror",
    variants: [
        { id: "decocraft:round_mirror_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:round_mirror_gold", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:round_mirror_silver", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:round_mirror_rose_gold", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:scale_brass", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Scale",
    variants: [
        { id: "decocraft:scale_brass", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:scale_gold", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:scale_silver", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:scale_rose_gold", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:scale_tilted_brass", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Scale Tilted",
    variants: [
        { id: "decocraft:scale_tilted_brass", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:scale_tilted_gold", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:scale_tilted_silver", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:scale_tilted_rose_gold", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "decocraft:sign_live_craft_love", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:spider_plush_heart", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "decocraft:string", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "decocraft:stuffed_creeper", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:sunflower_wreath", count: 1, price: 60, nbt: {}, lore: [] },
{ id: "decocraft:sunglass_display", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:tall_book_stack_1", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Tall Book Stack",
    variants: [
        { id: "decocraft:tall_book_stack_1", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:tall_book_stack_2", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:tall_book_stack_messy_1", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Tall Book Stack Messy",
    variants: [
        { id: "decocraft:tall_book_stack_messy_1", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:tall_book_stack_messy_2", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:teddy_bear_black", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Teddy Bear",
    variants: [
        { id: "decocraft:teddy_bear_black", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:teddy_bear_brown", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:teddy_bear_cream", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:teddy_bear_cyan", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:teddy_bear_gray", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:teddy_bear_lavender", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:teddy_bear_lime", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:teddy_bear_orange", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:teddy_bear_pink", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:teddy_bear_rainbow", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:teddy_bear_red", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:teddy_bear_yellow", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:teddy_bear_light_blue", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:treasure_pile", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "decocraft:washer", count: 1, price: 1000, nbt: {}, lore: [] },
{ id: "decocraft:wind_chime", count: 1, price: 100, nbt: {}, lore: [] },
{
    id: "decocraft:wind_chime_2", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Wind Chime",
    variants: [
        { id: "decocraft:wind_chime_2", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:wind_chime_rainbow", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:wind_chime_2_rainbow", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "decocraft:world_map", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:wreath_1", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Wreath",
    variants: [
        { id: "decocraft:wreath_1", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:wreath_2", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:wreath_3", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:wreath_4", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:wreath_5", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
// ── Outdoor & Garden ──
{ id: "decocraft:bamboo_torch_green_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:bamboo_torch_yellow_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:bamboo_umbrella_green", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Bamboo Umbrella",
    variants: [
        { id: "decocraft:bamboo_umbrella_green", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:bamboo_umbrella_yellow", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:beach_towel_blue", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Beach Towel",
    variants: [
        { id: "decocraft:beach_towel_blue", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:beach_towel_cyan", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:beach_towel_lime", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:beach_towel_magenta", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:beach_towel_orange", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:beach_towel_pink", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:beach_towel_purple", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:beach_towel_rainbow", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:beach_towel_red", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:beach_towel_yellow", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:beach_towel_light_blue", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:beach_umbrella_black", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Beach Umbrella",
    variants: [
        { id: "decocraft:beach_umbrella_black", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_blue", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_cyan", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_gray", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_green", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_lime", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_magenta", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_orange", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_pink", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_purple", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_rainbow", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_red", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_white", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_yellow", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:beach_umbrella_light_blue", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Beach Umbrella Light",
    variants: [
        { id: "decocraft:beach_umbrella_light_blue", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:beach_umbrella_light_gray", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:birdcage_black", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Birdcage",
    variants: [
        { id: "decocraft:birdcage_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:birdcage_gold", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:birdcage_silver", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:bird_bath", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:bucket", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Bucket",
    variants: [
        { id: "decocraft:bucket", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:bucket_milk", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:bucket_rake", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:bucket_spade", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:bucket_water", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:bus_stop_sign", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:cat_tree", count: 1, price: 100, nbt: {}, lore: [] },
{
    id: "decocraft:dirt_corner", price: 5, count: 1, nbt: {}, lore: [],
    variantLabel: "Dirt",
    variants: [
        { id: "decocraft:dirt_corner", count: 1, price: 5, nbt: {}, lore: [] },
        { id: "decocraft:dirt_side", count: 1, price: 5, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:diving_board", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:dog_house", count: 1, price: 150, nbt: {}, lore: [] },
{ id: "decocraft:dumpster", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:dump_truck", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:fishing_net", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:fish_tank", count: 1, price: 200, nbt: {}, lore: [] },
{
    id: "decocraft:grill_black", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Grill",
    variants: [
        { id: "decocraft:grill_black", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:grill_blue", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:grill_red", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:grill_silver", count: 1, price: 500, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:grill_black_closed", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "decocraft:grill_blue_closed", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "decocraft:grill_red_closed", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "decocraft:grill_silver_closed", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "decocraft:halfmoonbars", count: 1, price: 150, nbt: {}, lore: [] },
{
    id: "decocraft:hammock_rainbow", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Hammock",
    variants: [
        { id: "decocraft:hammock_rainbow", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:hammock_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:hibachi_grill", count: 1, price: 400, nbt: {}, lore: [] },
{ id: "decocraft:hopscotch", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:hot_air_balloon_berry", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Hot Air Balloon",
    variants: [
        { id: "decocraft:hot_air_balloon_berry", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_blue", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_cyan", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_green", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_orange", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_pink", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_purple", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_red", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_yellow", count: 1, price: 500, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:hot_air_balloon_p_blue", price: 500, count: 1, nbt: {}, lore: [],
    variantLabel: "Hot Air Balloon P",
    variants: [
        { id: "decocraft:hot_air_balloon_p_blue", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_p_cyan", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_p_green", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_p_lime", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_p_orange", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_p_pink", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_p_purple", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_p_red", count: 1, price: 500, nbt: {}, lore: [] },
        { id: "decocraft:hot_air_balloon_p_yellow", count: 1, price: 500, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:inflatable_pool", count: 1, price: 300, nbt: {}, lore: [] },
{ id: "decocraft:jacuzzi", count: 1, price: 2000, nbt: {}, lore: [] },
{
    id: "decocraft:koinobori_children_1", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Koinobori Children",
    variants: [
        { id: "decocraft:koinobori_children_1", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:koinobori_children_2", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:koinobori_parents", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Koinobori",
    variants: [
        { id: "decocraft:koinobori_parents", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:koinobori_pole", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:koinobori_top", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:mailbox_black", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Mailbox",
    variants: [
        { id: "decocraft:mailbox_black", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:mailbox_blue", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:mailbox_cyan", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:mailbox_green", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:mailbox_lime", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:mailbox_magenta", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:mailbox_orange", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:mailbox_pink", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:mailbox_purple", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:mailbox_red", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:mailbox_white", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:mailbox_yellow", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:mailbox_light_blue", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Mailbox Light",
    variants: [
        { id: "decocraft:mailbox_light_blue", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:mailbox_light_gray", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:monkeybars", count: 1, price: 150, nbt: {}, lore: [] },
{
    id: "decocraft:pet_bed", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Pet",
    variants: [
        { id: "decocraft:pet_bed", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:pet_carrier", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:picnic_basket", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Picnic",
    variants: [
        { id: "decocraft:picnic_basket", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:picnic_blanket", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:picnic_basket_closed", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:pool_float_lounger", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:pool_tube_black", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Pool Tube",
    variants: [
        { id: "decocraft:pool_tube_black", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:pool_tube_blue", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:pool_tube_cyan", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:pool_tube_green", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:pool_tube_lime", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:pool_tube_magenta", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:pool_tube_orange", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:pool_tube_pink", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:pool_tube_purple", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:pool_tube_red", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:pool_tube_yellow", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:pool_tube_light_blue", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:rake_spade", count: 1, price: 20, nbt: {}, lore: [] },
{
    id: "decocraft:rolling_bin_blue", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Rolling Bin",
    variants: [
        { id: "decocraft:rolling_bin_blue", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:rolling_bin_green", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:rolling_bin_red", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:rolling_bin_yellow", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:roundabout", price: 150, count: 1, nbt: {}, lore: [],
    variantLabel: "Roundabout",
    variants: [
        { id: "decocraft:roundabout", count: 1, price: 150, nbt: {}, lore: [] },
        { id: "decocraft:roundabout_rainbow", count: 1, price: 150, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:sandbox", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "decocraft:sand_castle", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "decocraft:scratching_post", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "decocraft:seesaw", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:sled_blue", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Sled",
    variants: [
        { id: "decocraft:sled_blue", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:sled_green", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:sled_red", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:sled_yellow", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:slide", count: 1, price: 200, nbt: {}, lore: [] },
{
    id: "decocraft:soda_machine_black", price: 8000, count: 1, nbt: {}, lore: [],
    variantLabel: "Soda Machine",
    variants: [
        { id: "decocraft:soda_machine_black", count: 1, price: 8000, nbt: {}, lore: [] },
        { id: "decocraft:soda_machine_blue", count: 1, price: 8000, nbt: {}, lore: [] },
        { id: "decocraft:soda_machine_green", count: 1, price: 8000, nbt: {}, lore: [] },
        { id: "decocraft:soda_machine_red", count: 1, price: 8000, nbt: {}, lore: [] },
        { id: "decocraft:soda_machine_yellow", count: 1, price: 8000, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:spring_horse_blue", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Spring Horse",
    variants: [
        { id: "decocraft:spring_horse_blue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:spring_horse_cyan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:spring_horse_green", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:spring_horse_lime", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:spring_horse_orange", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:spring_horse_pink", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:spring_horse_purple", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:spring_horse_red", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:spring_horse_yellow", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:spring_horse_light_blue", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "decocraft:stop_sign", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:swing", price: 80, count: 1, nbt: {}, lore: [],
    variantLabel: "Swing",
    variants: [
        { id: "decocraft:swing", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:swing_leg", count: 1, price: 80, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:tire_fence_blue", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Tire Fence",
    variants: [
        { id: "decocraft:tire_fence_blue", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:tire_fence_cyan", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:tire_fence_gray", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:tire_fence_green", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:tire_fence_orange", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:tire_fence_pink", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:tire_fence_purple", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:tire_fence_red", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:tire_fence_yellow", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:tire_swing", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:trash_bag", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "decocraft:vending_machine_soda", count: 1, price: 100, nbt: {}, lore: [] },
{
    id: "decocraft:watering_can_flowers_1", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Watering Can Flowers",
    variants: [
        { id: "decocraft:watering_can_flowers_1", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:watering_can_flowers_2", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:watering_can_tulips", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:welcome_mat", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:welcome_mat_spring", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:wet_floor_sign", count: 1, price: 20, nbt: {}, lore: [] },
// ── Seasonal & Holidays ──
{ id: "decocraft:adventsljusstake_blue_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:adventsljusstake_green_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:adventsljusstake_red_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:adventsljusstake_white_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:balloons_halloween", count: 1, price: 20, nbt: {}, lore: [] },
{
    id: "decocraft:balloon_arch_a_pastel", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Balloon Arch A",
    variants: [
        { id: "decocraft:balloon_arch_a_pastel", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_arch_a_rainbow", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_arch_a_stpaddy", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_arch_a_valentines", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:balloon_arch_b_halloween", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Balloon Arch B",
    variants: [
        { id: "decocraft:balloon_arch_b_halloween", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_arch_b_indie", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:balloon_arch_b_wedding", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:blood_puddle", count: 1, price: 10, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_1_black_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_1_gold_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_1_silver_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_2_black_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_2_gold_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_2_silver_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_3_black_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_3_gold_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_3_silver_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_4_black_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_4_gold_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_4_silver_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_5_black_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_5_gold_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_5_silver_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_6_black_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_6_gold_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_6_silver_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_7_black_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_7_gold_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_7_silver_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_wall_1_black_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_wall_1_gold_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_wall_1_silver_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_wall_2_black_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_wall_2_gold_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_wall_2_silver_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_wall_3_black_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_wall_3_gold_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:candle_holder_wall_3_silver_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{
    id: "decocraft:candy_bag_ghost", price: 15, count: 1, nbt: {}, lore: [],
    variantLabel: "Candy Bag",
    variants: [
        { id: "decocraft:candy_bag_ghost", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:candy_bag_pumpkin", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:candy_bag_purple", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:candy_bag_spider", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:candy_bag_witch", count: 1, price: 15, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:christmas_lights_1_color_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:christmas_lights_1_rainbow_2_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:christmas_lights_1_rainbow_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:christmas_lights_1_white_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:christmas_lights_2_color_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:christmas_lights_2_rainbow_2_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:christmas_lights_2_rainbow_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:christmas_lights_2_white_flipbook", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:christmas_tree_1_rainbow_flipbook", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "decocraft:christmas_tree_1_white_flipbook", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "decocraft:christmas_tree_antique_flipbook", count: 1, price: 100, nbt: {}, lore: [] },
{
    id: "decocraft:coffin_1", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Coffin",
    variants: [
        { id: "decocraft:coffin_1", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:coffin_2", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:deer_lights_buck_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:deer_lights_doe_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:deer_lights_fawn_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:easter_basket_pink", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Easter Basket",
    variants: [
        { id: "decocraft:easter_basket_pink", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:easter_basket_white", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:easter_basket_yellow", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:fairy_lights_bats", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Fairy Lights",
    variants: [
        { id: "decocraft:fairy_lights_bats", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:fairy_lights_clovers", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:fairy_lights_clownfish", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:fairy_lights_ghosts", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:fairy_lights_ocean", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:fairy_lights_pufferfish", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:fairy_lights_pumpkins", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:fairy_lights_seahorse", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:fairy_lights_hearts_pink", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Fairy Lights Hearts",
    variants: [
        { id: "decocraft:fairy_lights_hearts_pink", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:fairy_lights_hearts_red", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:fairy_lights_hearts_red_pink", count: 1, price: 20, nbt: {}, lore: [] },
{
    id: "decocraft:fairy_lights_hearts_white_pink", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Fairy Lights Hearts White",
    variants: [
        { id: "decocraft:fairy_lights_hearts_white_pink", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:fairy_lights_hearts_white_red", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:gingerbread_house", count: 1, price: 60, nbt: {}, lore: [] },
{
    id: "decocraft:gravestone_1", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Gravestone",
    variants: [
        { id: "decocraft:gravestone_1", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:gravestone_2", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:gravestone_3", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:gravestone_4", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:gravestone_5", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:hanging_bat", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Hanging",
    variants: [
        { id: "decocraft:hanging_bat", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:hanging_bomb", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:happy_birthday", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Happy",
    variants: [
        { id: "decocraft:happy_birthday", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:happy_easter", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:happy_halloween", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:happy_hanukkah", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:happy_spring", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:jack_o_lantern_1", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Jack O Lantern",
    variants: [
        { id: "decocraft:jack_o_lantern_1", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jack_o_lantern_2", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jack_o_lantern_3", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jack_o_lantern_4", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:jack_o_lantern_trio", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},

{ id: "decocraft:mantel_christmas_flipbook", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:merry_christmas", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:mistletoe", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:ofrenda_flipbook", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:old_broom", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:ornament_large_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:ornament_pair_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:ornament_small_flipbook", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:ouija_board", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:paper_lantern_bats", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Paper Lantern",
    variants: [
        { id: "decocraft:paper_lantern_bats", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_ghost", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_pumpkin", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:paper_lantern_skeleton", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:paper_lantern_cherry_blossom", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:paper_lantern_chinese_new_year", count: 1, price: 20, nbt: {}, lore: [] },
{ id: "decocraft:potted_christmas_tree_flipbook", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "decocraft:potted_christmas_tree_white_flipbook", count: 1, price: 80, nbt: {}, lore: [] },
{
    id: "decocraft:present_blue", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Present",
    variants: [
        { id: "decocraft:present_blue", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:present_cyan", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:present_green", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:present_lime", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:present_magenta", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:present_orange", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:present_pink", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:present_purple", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:present_red", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:present_white", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:present_yellow", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:present_light_blue", count: 1, price: 40, nbt: {}, lore: [] },
{
    id: "decocraft:present_long_blue", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Present Long",
    variants: [
        { id: "decocraft:present_long_blue", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_long_cyan", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_long_green", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_long_lime", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_long_magenta", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_long_orange", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_long_pink", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_long_purple", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_long_red", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_long_white", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_long_yellow", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:present_long_light_blue", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:present_round_blue", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Present Round",
    variants: [
        { id: "decocraft:present_round_blue", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_round_cyan", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_round_green", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_round_lime", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_round_magenta", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_round_orange", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_round_pink", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_round_purple", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_round_red", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_round_white", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_round_yellow", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:present_round_light_blue", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:present_small_blue", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Present Small",
    variants: [
        { id: "decocraft:present_small_blue", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_small_cyan", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_small_green", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_small_lime", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_small_magenta", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_small_orange", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_small_pink", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_small_purple", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_small_red", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_small_white", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:present_small_yellow", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:present_small_light_blue", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:present_trio_1", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Present Trio",
    variants: [
        { id: "decocraft:present_trio_1", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:present_trio_10", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:present_trio_11", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:present_trio_2", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:present_trio_3", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:present_trio_4", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:present_trio_5", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:present_trio_6", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:present_trio_7", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:present_trio_8", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:present_trio_9", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:scarecrow_1", price: 40, count: 1, nbt: {}, lore: [],
    variantLabel: "Scarecrow",
    variants: [
        { id: "decocraft:scarecrow_1", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:scarecrow_2", count: 1, price: 40, nbt: {}, lore: [] },
        { id: "decocraft:scarecrow_3", count: 1, price: 40, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:spellbook_flipbook", count: 1, price: 40, nbt: {}, lore: [] },
{
    id: "decocraft:spider_1", price: 15, count: 1, nbt: {}, lore: [],
    variantLabel: "Spider",
    variants: [
        { id: "decocraft:spider_1", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:spider_2", count: 1, price: 15, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:spider_and_eggs_1", price: 15, count: 1, nbt: {}, lore: [],
    variantLabel: "Spider And Eggs",
    variants: [
        { id: "decocraft:spider_and_eggs_1", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:spider_and_eggs_2", count: 1, price: 15, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:star_pinata", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "decocraft:stick_wreath", count: 1, price: 40, nbt: {}, lore: [] },
{
    id: "decocraft:stocking_1_blue", price: 15, count: 1, nbt: {}, lore: [],
    variantLabel: "Stocking 1",
    variants: [
        { id: "decocraft:stocking_1_blue", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:stocking_1_green", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:stocking_1_red", count: 1, price: 15, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:stocking_2_blue", price: 15, count: 1, nbt: {}, lore: [],
    variantLabel: "Stocking 2",
    variants: [
        { id: "decocraft:stocking_2_blue", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:stocking_2_green", count: 1, price: 15, nbt: {}, lore: [] },
        { id: "decocraft:stocking_2_red", count: 1, price: 15, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:tinsel_1_rainbow", price: 10, count: 1, nbt: {}, lore: [],
    variantLabel: "Tinsel 1",
    variants: [
        { id: "decocraft:tinsel_1_rainbow", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:tinsel_1_white", count: 1, price: 10, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:tinsel_2_bg", price: 10, count: 1, nbt: {}, lore: [],
    variantLabel: "Tinsel 2",
    variants: [
        { id: "decocraft:tinsel_2_bg", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:tinsel_2_rb", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:tinsel_2_rg", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:tinsel_2_sg", count: 1, price: 10, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:tinsel_3", price: 10, count: 1, nbt: {}, lore: [],
    variantLabel: "Tinsel",
    variants: [
        { id: "decocraft:tinsel_3", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:tinsel_4", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:tinsel_5", count: 1, price: 10, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:unmarked_grave", count: 1, price: 20, nbt: {}, lore: [] },
{
    id: "decocraft:valentine_card_pink", price: 10, count: 1, nbt: {}, lore: [],
    variantLabel: "Valentine Card",
    variants: [
        { id: "decocraft:valentine_card_pink", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:valentine_card_red", count: 1, price: 10, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:vase_marigolds", count: 1, price: 40, nbt: {}, lore: [] },
{
    id: "decocraft:web_1", price: 10, count: 1, nbt: {}, lore: [],
    variantLabel: "Web",
    variants: [
        { id: "decocraft:web_1", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:web_2", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:web_3", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:web_4", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:web_5", count: 1, price: 10, nbt: {}, lore: [] },
        { id: "decocraft:web_6", count: 1, price: 10, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:witch_broom", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:witch_cauldron_flipbook", count: 1, price: 30, nbt: {}, lore: [] },
{
    id: "decocraft:yule_goat", price: 30, count: 1, nbt: {}, lore: [],
    variantLabel: "Yule",
    variants: [
        { id: "decocraft:yule_goat", count: 1, price: 30, nbt: {}, lore: [] },
        { id: "decocraft:yule_log", count: 1, price: 30, nbt: {}, lore: [] },
    ]
},
// ── Entertainment (Toys, Games, Music, Sports, Art) ──
{
    id: "decocraft:arcade_machine_dk", price: 3000, count: 1, nbt: {}, lore: [],
    variantLabel: "Arcade Machine",
    variants: [
        { id: "decocraft:arcade_machine_dk", count: 1, price: 3000, nbt: {}, lore: [] },
        { id: "decocraft:arcade_machine_pacman", count: 1, price: 3000, nbt: {}, lore: [] },
        { id: "decocraft:arcade_machine_pong", count: 1, price: 3000, nbt: {}, lore: [] },
        { id: "decocraft:arcade_machine_race", count: 1, price: 3000, nbt: {}, lore: [] },
        { id: "decocraft:arcade_machine_snake", count: 1, price: 3000, nbt: {}, lore: [] },
        { id: "decocraft:arcade_machine_tetris", count: 1, price: 3000, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:arcade_machine_space_invaders", count: 1, price: 3000, nbt: {}, lore: [] },
{
    id: "decocraft:card_game", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Card",
    variants: [
        { id: "decocraft:card_game", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:card_stack", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:casino_chips", price: 200, count: 1, nbt: {}, lore: [],
    variantLabel: "Casino",
    variants: [
        { id: "decocraft:casino_chips", count: 1, price: 200, nbt: {}, lore: [] },
        { id: "decocraft:casino_wheel", count: 1, price: 200, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:checkers", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:claw_machine", count: 1, price: 2000, nbt: {}, lore: [] },
{ id: "decocraft:dartboard", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "decocraft:dollhouse", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "decocraft:gumball_machine", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "decocraft:gumball_machine_tall", count: 1, price: 500, nbt: {}, lore: [] },
{ id: "decocraft:jack_in_the_box", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:pool_rack", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "decocraft:rocking_horse", count: 1, price: 200, nbt: {}, lore: [] },
{
    id: "decocraft:slot_machine_blue", price: 2000, count: 1, nbt: {}, lore: [],
    variantLabel: "Slot Machine",
    variants: [
        { id: "decocraft:slot_machine_blue", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:slot_machine_green", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:slot_machine_red", count: 1, price: 2000, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:snowglobe_igloo", price: 60, count: 1, nbt: {}, lore: [],
    variantLabel: "Snowglobe",
    variants: [
        { id: "decocraft:snowglobe_igloo", count: 1, price: 60, nbt: {}, lore: [] },
        { id: "decocraft:snowglobe_tree", count: 1, price: 60, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:toy_boat", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "decocraft:train_set_1", count: 1, price: 300, nbt: {}, lore: [] },
{
    id: "decocraft:wooden_blocks_1", price: 20, count: 1, nbt: {}, lore: [],
    variantLabel: "Wooden Blocks",
    variants: [
        { id: "decocraft:wooden_blocks_1", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:wooden_blocks_2", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:wooden_blocks_3", count: 1, price: 20, nbt: {}, lore: [] },
        { id: "decocraft:wooden_blocks_4", count: 1, price: 20, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:drum_set_black", price: 1000, count: 1, nbt: {}, lore: [],
    variantLabel: "Drum Set",
    variants: [
        { id: "decocraft:drum_set_black", count: 1, price: 1000, nbt: {}, lore: [] },
        { id: "decocraft:drum_set_blue", count: 1, price: 1000, nbt: {}, lore: [] },
        { id: "decocraft:drum_set_cyan", count: 1, price: 1000, nbt: {}, lore: [] },
        { id: "decocraft:drum_set_lime", count: 1, price: 1000, nbt: {}, lore: [] },
        { id: "decocraft:drum_set_magenta", count: 1, price: 1000, nbt: {}, lore: [] },
        { id: "decocraft:drum_set_orange", count: 1, price: 1000, nbt: {}, lore: [] },
        { id: "decocraft:drum_set_pink", count: 1, price: 1000, nbt: {}, lore: [] },
        { id: "decocraft:drum_set_purple", count: 1, price: 1000, nbt: {}, lore: [] },
        { id: "decocraft:drum_set_red", count: 1, price: 1000, nbt: {}, lore: [] },
        { id: "decocraft:drum_set_white", count: 1, price: 1000, nbt: {}, lore: [] },
        { id: "decocraft:drum_set_yellow", count: 1, price: 1000, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:drum_set_light_blue", count: 1, price: 1000, nbt: {}, lore: [] },
{
    id: "decocraft:electric_guitar_black", price: 600, count: 1, nbt: {}, lore: [],
    variantLabel: "Electric Guitar",
    variants: [
        { id: "decocraft:electric_guitar_black", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:electric_guitar_blue", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:electric_guitar_cyan", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:electric_guitar_lime", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:electric_guitar_magenta", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:electric_guitar_orange", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:electric_guitar_pink", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:electric_guitar_purple", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:electric_guitar_red", count: 1, price: 600, nbt: {}, lore: [] },
        { id: "decocraft:electric_guitar_yellow", count: 1, price: 600, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:electric_guitar_light_blue", count: 1, price: 600, nbt: {}, lore: [] },
{ id: "decocraft:jukebox", count: 1, price: 1500, nbt: {}, lore: [] },
{ id: "decocraft:phonograph", count: 1, price: 300, nbt: {}, lore: [] },
{
    id: "decocraft:piano_bench_black", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Piano Bench",
    variants: [
        { id: "decocraft:piano_bench_black", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:piano_bench_spruce", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:piano_bench_white", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:piano_black", price: 2000, count: 1, nbt: {}, lore: [],
    variantLabel: "Piano",
    variants: [
        { id: "decocraft:piano_black", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:piano_spruce", count: 1, price: 2000, nbt: {}, lore: [] },
        { id: "decocraft:piano_white", count: 1, price: 2000, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:piano_upright_black", price: 3000, count: 1, nbt: {}, lore: [],
    variantLabel: "Piano Upright",
    variants: [
        { id: "decocraft:piano_upright_black", count: 1, price: 3000, nbt: {}, lore: [] },
        { id: "decocraft:piano_upright_spruce", count: 1, price: 3000, nbt: {}, lore: [] },
        { id: "decocraft:piano_upright_white", count: 1, price: 3000, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:xylophone", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:basketball", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:dumbell_rack", count: 1, price: 400, nbt: {}, lore: [] },
{ id: "decocraft:gym_bench", count: 1, price: 300, nbt: {}, lore: [] },
{ id: "decocraft:multigym", count: 1, price: 1500, nbt: {}, lore: [] },
{ id: "decocraft:trainingdummy", count: 1, price: 200, nbt: {}, lore: [] },
{ id: "decocraft:treadmill", count: 1, price: 1500, nbt: {}, lore: [] },
{ id: "decocraft:crayon_box", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "decocraft:desk_easel", count: 1, price: 100, nbt: {}, lore: [] },
{
    id: "decocraft:desk_easel_canvas", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Desk Easel",
    variants: [
        { id: "decocraft:desk_easel_canvas", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:desk_easel_painted", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:desk_easel_still_life_1", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Desk Easel Still Life",
    variants: [
        { id: "decocraft:desk_easel_still_life_1", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:desk_easel_still_life_2", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:desk_easel_still_life_3", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:easel", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Easel",
    variants: [
        { id: "decocraft:easel", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:easel_canvas", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:easel_painted_landscape_1", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Easel Painted Landscape",
    variants: [
        { id: "decocraft:easel_painted_landscape_1", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:easel_painted_landscape_2", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:easel_painted_landscape_3", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
{
    id: "decocraft:sewing_machine_blue", price: 400, count: 1, nbt: {}, lore: [],
    variantLabel: "Sewing Machine",
    variants: [
        { id: "decocraft:sewing_machine_blue", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:sewing_machine_coral", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:sewing_machine_lavender", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:sewing_machine_lime", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:sewing_machine_pink", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:sewing_machine_white", count: 1, price: 400, nbt: {}, lore: [] },
        { id: "decocraft:sewing_machine_yellow", count: 1, price: 400, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:sewing_thread_rack", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "decocraft:spinning_wheel", count: 1, price: 150, nbt: {}, lore: [] },
{ id: "decocraft:watercolor_clutter", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "decocraft:yarn_basket", count: 1, price: 30, nbt: {}, lore: [] },
],
    // Tab 8 - Signs
[
// ── Yuushya Signs & Posters ──
{ id: "minecraft:name_tag", count: 1, price: 5, nbt: {}, lore: [] },
{ id: "yuushya:sign_0", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_1", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_2", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_3", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_4", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_5", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "yuushya:sign_6", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_7", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_8", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_9", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_10", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_11", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_12", count: 1, price: 70, nbt: {}, lore: [] },
{ id: "yuushya:sign_13", count: 1, price: 70, nbt: {}, lore: [] },
{ id: "yuushya:sign_14", count: 1, price: 140, nbt: {}, lore: [] },
{ id: "yuushya:sign_15", count: 1, price: 140, nbt: {}, lore: [] },
{ id: "yuushya:sign_16", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:sign_17", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:sign_18", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:sign_19", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_20", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_21", count: 1, price: 90, nbt: {}, lore: [] },
{ id: "yuushya:sign_22", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:sign_23", count: 1, price: 90, nbt: {}, lore: [] },
{ id: "yuushya:sign_24", count: 1, price: 90, nbt: {}, lore: [] },
{ id: "yuushya:sign_25", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_26", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:sign_27", count: 1, price: 76, nbt: {}, lore: [] },
{ id: "yuushya:sign_28", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:shop_sign", count: 1, price: 80, nbt: {}, lore: [] },
{ id: "yuushya:button_sign_like", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:button_sign_star", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:button_sign_coin", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:button_sign_love", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:button_sign_share", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:button_sign_play", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:button_sign_dislike", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:button_sign_question", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:button_sign_true", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:button_sign_false", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:button_sign_notice", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:button_sign_bookmark", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:title_black", count: 1, price: 25, nbt: {}, lore: [] },
{ id: "yuushya:title_blue", count: 1, price: 25, nbt: {}, lore: [] },
{ id: "yuushya:title_brown", count: 1, price: 25, nbt: {}, lore: [] },
{ id: "yuushya:title_gray", count: 1, price: 25, nbt: {}, lore: [] },
{ id: "yuushya:title_lime", count: 1, price: 25, nbt: {}, lore: [] },
{ id: "yuushya:title_orange", count: 1, price: 25, nbt: {}, lore: [] },
{ id: "yuushya:title_pink", count: 1, price: 25, nbt: {}, lore: [] },
{ id: "yuushya:title_red", count: 1, price: 25, nbt: {}, lore: [] },
{ id: "yuushya:title_white", count: 1, price: 25, nbt: {}, lore: [] },
{ id: "yuushya:title_yellow", count: 1, price: 25, nbt: {}, lore: [] },
{ id: "yuushya:dual_small_title_black", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:dual_small_title_blue", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:dual_small_title_brown", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:dual_small_title_gray", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:dual_small_title_lime", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:dual_small_title_orange", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:dual_small_title_pink", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:dual_small_title_red", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:dual_small_title_white", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:dual_small_title_yellow", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:small_title_black", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "yuushya:small_title_blue", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "yuushya:small_title_brown", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "yuushya:small_title_gray", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "yuushya:small_title_lime", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "yuushya:small_title_orange", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "yuushya:small_title_pink", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "yuushya:small_title_red", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "yuushya:small_title_white", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "yuushya:small_title_yellow", count: 1, price: 15, nbt: {}, lore: [] },
{ id: "yuushya:small_poster_0", count: 1, price: 35, nbt: {}, lore: [] },
{ id: "yuushya:small_poster_1", count: 1, price: 35, nbt: {}, lore: [] },
{ id: "yuushya:mini_banner_0", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:mini_banner_1", count: 1, price: 30, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_0", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_1", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_2", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_3", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_4", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_5", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_6", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_7", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_8", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_9", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_10", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_11", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_12", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_13", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_14", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:hanzi_banner_15", count: 1, price: 40, nbt: {}, lore: [] },
{ id: "yuushya:big_poster", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:high_poster", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:long_poster", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:graffiti_0", count: 1, price: 100, nbt: {}, lore: [] },
{ id: "yuushya:graffiti_1", count: 1, price: 100, nbt: {}, lore: [] },
// ── Decocraft Signs & Posters ──
{ id: "decocraft:cafe_sign", count: 1, price: 50, nbt: {}, lore: [] },
{
    id: "decocraft:circle_sign_1", price: 50, count: 1, nbt: {}, lore: [],
    variantLabel: "Circle Sign",
    variants: [
        { id: "decocraft:circle_sign_1", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_10", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_11", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_12", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_13", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_14", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_15", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_2", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_3", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_4", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_5", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_6", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_7", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_8", count: 1, price: 50, nbt: {}, lore: [] },
        { id: "decocraft:circle_sign_9", count: 1, price: 50, nbt: {}, lore: [] },
    ]
},
{ id: "decocraft:discount_25_sign", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:discount_50_sign", count: 1, price: 50, nbt: {}, lore: [] },
{ id: "decocraft:sign_live_craft_love", count: 1, price: 50, nbt: {}, lore: [] },

{
    id: "decocraft:afghanistan", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "World Flag",
    variants: [
        { id: "decocraft:afghanistan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:aland", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:albania", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:algeria", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:american_samoa", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:andorra", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:angola", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:anguilla", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:antigua_and_barbuda", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:argentina", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:armenia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:aruba", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:ascension_island", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:australia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:austria", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:azerbaijan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:azores", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bahamas", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bahrain", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bangladesh", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:barbados", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:belarus", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:belgium", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:belize", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:benin", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bermuda", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bhutan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bolivia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bonaire", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bosnia_and_herzegovina", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:botswana", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:brazil", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:british_virgin_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:brunei", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bulgaria", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:burkina_faso", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:burundi", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:cambodia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:cameroon", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:canada", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:canary_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:cape_verde", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:cayman_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:central_african_republic", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:chad", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:chile", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:china", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:christmas_island", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:cocos_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:colombia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:comoros", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:congo", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:cook_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:costa_rica", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:cote_d_ivoire", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:croatia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:cuba", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:curacao", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:cyprus", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:czechia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:democratic_republic_of_the_congo", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:denmark", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:djibouti", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:dominica", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:dominican_republic", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:easter_island", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:east_timor", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:ecuador", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:egypt", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:england", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:equatorial_guinea", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:eritrea", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:estonia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:eswatini", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:ethiopia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:falkland_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:faroe_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:federated_states_of_micronesia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:fiji", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:finland", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:france", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:french_polynesia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:gabon", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:gambia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:georgia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:germany", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:ghana", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:gibraltar", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:greece", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:greenland", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:grenada", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:guam", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:guatemala", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:guernesey", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:guinea", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:guinea_bissau", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:guyana", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:haiti", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:honduras", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:hong_kong", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:hungary", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:iceland", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:india", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:indonesia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:iran", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:iraq", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:ireland", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:isle_of_man", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:israel", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:italy", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:jamaica", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:japan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:jersey", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:jordan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:kazakhistan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:kenya", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:kiribati", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:kosovo", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:kurdistan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:kuwait", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:kyrgyzstan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:laos", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:latvia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:lebanon", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:lesotho", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:liberia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:libya", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:liechtenstein", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:lithuania", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:luxembourg", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:macau", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:madagascar", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:madeira", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:malawi", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:malaysia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:maldives", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:mali", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:malta", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:marshall_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:mauritania", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:mauritius", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:mexico", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:moldova", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:monaco", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:mongolia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:monserrat", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:montenegro", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:morocco", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:mozambique", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:myanmar", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:namibia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:nepal", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:netherlands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:new_caledonia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:new_zealand_aotearoa", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:nicaragua", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:niger", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:nigeria", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:niue", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:norfolk_island", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:northern_ireland", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:northern_mariana_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:north_korea", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:north_macedonia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:norway", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:oman", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:pakistan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:palau", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:palestine", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:panama", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:papua_new_guinea", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:paraguay", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:peru", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:philippines", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:pitcarin_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:poland", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:portugal", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:puerto_rico", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:qatar", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:romania", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:russia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rwanda", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:saba", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:saint_barthelemy", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:saint_helena_island", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:saint_kitts_and_nevis", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:saint_pierre_et_miquelon", count: 1, price: 80, nbt: {}, lore: [] },
        { id: "decocraft:saint_vincent_and_the_grenadines", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:salvador", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:samoa", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:santa_lucia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:san_marino", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:sao_tome_e_principe", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:saudi_arabia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:scotland", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:senegal", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:serbia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:seychelles", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:sierra_leone", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:singapore", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:sint_eustatius", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:sint_maarten", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:slovakia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:slovenia", count: 1, price: 300, nbt: {}, lore: [] },
        { id: "decocraft:solomon_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:somalia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:somaliland", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:south_africa", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:south_georgia_and_the_south_sandwich_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:south_korea", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:south_sudan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:spain", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:sri_lanka", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:sudan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:suriname", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:sweden", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:switzerland", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:syria", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:taiwan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:tajikistan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:tanzania", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:thailand", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:togo", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:tokelau", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:tonga", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:trinidad_and_tobago", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:tristan_da_cunha_island", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:tunisia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:turkey", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:turkmenistan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:turks_and_caicos_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:tuvalu", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:uae", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:uganda", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:ukraine", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:united_kingdom", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:united_states_virgin_islands", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:uruguay", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:usa", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:uzbekistan", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:vanatu", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:vatican", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:venezuela", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:vietnam", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:wales", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:wallis_and_futuna", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:western_sahara", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:yemen", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:zambia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:zimbabwe", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
// ── Pride Flags ──
{
    id: "decocraft:agender", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Pride Flag",
    variants: [
        { id: "decocraft:agender", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:ally", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:arachnophobia", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:aromantic", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:asexual", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bigender", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:bisexual", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:demiboy", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:demigirl", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:demisexual", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:gay", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:genderfluid", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:intersex", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:lesbian", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:nonbinary", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:pansexual", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:polysexual", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:pride", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:progress", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:progress_intersex", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:transgender", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
// ── Movie Posters ──
{
    id: "decocraft:akira", price: 100, count: 1, nbt: {}, lore: [],
    variantLabel: "Movie Poster",
    variants: [
        { id: "decocraft:akira", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:alien", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:back_to_the_future", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:batman", count: 1, price: 2500, nbt: {}, lore: [] },
        { id: "decocraft:children_of_the_corn", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:close_encounters", count: 1, price: 250, nbt: {}, lore: [] },
        { id: "decocraft:empire_strikes_back", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:et", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:fargo", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:ghostbusters", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:jaws", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:jurassic_park", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:mib", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:planet_of_the_apes", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:return_of_the_jedi", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:rocky_horror_picture_show", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:starwars", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:the_exorcist", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:the_nightmare_before_christmas", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:the_thing", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:tron", count: 1, price: 100, nbt: {}, lore: [] },
        { id: "decocraft:watchmen", count: 1, price: 100, nbt: {}, lore: [] },
    ]
},
],

];


// ============================================================
//  END OF CONFIGURATION
// ============================================================

var guiRef;
var mySlots = [];
var tabSlots = [];
var highlightLineIds = [];
var lastNpc = null;
var storedSlotItems = {};
var currentPage = 0;
var maxPages = CONFIG_MAX_PAGES;
var isSellMode = false;

// Search state
var searchQuery = "";
var searchFieldId = 200;
var searchButtonId = 201;
var searchResultMap = null;

// Viewport (main grid)
var viewportRow = 0;
var viewportRows = 6;
var totalRows = CONFIG_TAB_ROWS[0];
var numCols = 9;

// ============================================================
//  VARIANT PANEL STATE
// ============================================================
// variantPanelCfg  — the parent cfg object whose variants are shown, or null
// variantPanelRow  — current scroll row inside the variant panel
// variantSlots     — array of item slot handles for the panel
// ID ranges
var variantPanelCfg = null;
var variantPanelRow = 0;
var variantPanelCols = 5;
var variantPanelViewRows = 6;    // visible rows in the panel at once
var variantSlots = [];
var ID_VARIANT_SCROLL_UP   = 300;
var ID_VARIANT_SCROLL_DOWN = 301;
var ID_VARIANT_BASE_SLOT   = 0;  // variant slots are tracked in variantSlots[]

// Panel is drawn to the LEFT of the main grid
// Main grid starts at startX = 0, so panel sits at negative X
var variantPanelStartX = -120;   // left edge of the panel (5 cols × 18 = 90 wide)
var variantPanelStartY = -50;    // same top as main grid
var variantPanelSpacing = 18;

// Currency conversion rates
var STONE_TO_COAL = 100;
var COAL_TO_EMERALD = 100;

// Component IDs
var ID_TAB_BASE    = 102;
var ID_SCROLL_UP   = 111;
var ID_SCROLL_DOWN = 112;
var ID_MODE_TOGGLE = 113;

// IDs used by variant panel label / border lines
var ID_VARIANT_LABEL   = 400;
var ID_VARIANT_BORDER_BASE = 401;  // 401–408 reserved for border lines

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

// ========== Variant panel slot positions ==========
var variantSlotPositions = [];
for (var row = 0; row < variantPanelViewRows; row++) {
    var y = variantPanelStartY + row * variantPanelSpacing;
    for (var col = 0; col < variantPanelCols; col++) {
        var x = variantPanelStartX + col * variantPanelSpacing;
        variantSlotPositions.push({x: x, y: y});
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

// ============================================================
//  VARIANT HELPERS
// ============================================================

// Given a parent cfg with variants, return the full item cfg for variant index vi.
// Each variant is already a full item object — return it directly.
function resolveVariantCfg(parentCfg, vi) {
    var variants = parentCfg.variants;
    if (!variants || vi < 0 || vi >= variants.length) return null;
    return variants[vi];
}

// Friendly display name shown on a variant item in the panel.
// Uses the variant's own variantLabel if set, otherwise cleans up its id.
function variantDisplayName(vCfg) {
    if (vCfg.variantLabel) return vCfg.variantLabel;
    return vCfg.id.replace(/^[^:]+:/, "").replace(/_/g, " ");
}

// Total rows needed in the variant panel.
function variantPanelTotalRows() {
    if (!variantPanelCfg || !variantPanelCfg.variants) return 0;
    return Math.ceil(variantPanelCfg.variants.length / variantPanelCols);
}

// Resolve variant index from panel slot index considering scroll.
function variantSlotToIndex(slotIndex) {
    var row = Math.floor(slotIndex / variantPanelCols);
    var col = slotIndex % variantPanelCols;
    return (variantPanelRow + row) * variantPanelCols + col;
}

// ============================================================
//  SEARCH FUNCTIONS
// ============================================================
function buildSearchResultMap(tabIndex, query) {
    if (!query || query.length === 0) return null;
    var lowerQuery = query.toLowerCase();
    var items = CONFIG_SHOP_ITEMS[tabIndex] || [];
    var results = [];
    for (var i = 0; i < items.length; i++) {
        var cfg = items[i];
        if (!cfg) continue;
        var cleanId = cfg.id.replace(/^[^:]+:/, "").replace(/_/g, " ").toLowerCase();
        var rawId   = cfg.id.toLowerCase();
        var label   = (cfg.variantLabel || "").toLowerCase();
        if (rawId.indexOf(lowerQuery) !== -1 || cleanId.indexOf(lowerQuery) !== -1 || label.indexOf(lowerQuery) !== -1) {
            results.push(i);
        }
    }
    return results;
}

function searchResultRows() {
    if (!searchResultMap) return 0;
    return Math.ceil(searchResultMap.length / numCols);
}

function searchViewportToGlobal(slotIndex) {
    if (!searchResultMap) return viewportToGlobal(slotIndex);
    var resultIndex = viewportRow * numCols + slotIndex;
    if (resultIndex >= searchResultMap.length) return -1;
    return searchResultMap[resultIndex];
}

// ========== SNBT helpers ==========
function snbtValue(v) {
    if (v === null || v === undefined) return "0";
    if (typeof v === "string" && v.charAt(0) === "[") return v;
    if (typeof v === "string") return '"' + v.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    if (typeof v === "boolean") return v ? "1b" : "0b";
    if (typeof v === "number") {
        if (v === Math.floor(v)) return String(v);
        return v + "d";
    }
    if (Array.isArray(v)) {
        var parts = [];
        for (var i = 0; i < v.length; i++) parts.push(snbtValue(v[i]));
        return "[" + parts.join(",") + "]";
    }
    if (typeof v === "object") return snbtCompound(v);
    return String(v);
}

function snbtCompound(obj) {
    var parts = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            parts.push(key + ":" + snbtValue(obj[key]));
        }
    }
    return "{" + parts.join(",") + "}";
}

function buildSnbt(cfg, loreArr) {
    var tagObj = cfg.nbt ? cfg.nbt : {};
    var tag = JSON.parse(JSON.stringify(tagObj));

    if (loreArr && loreArr.length > 0) {
        if (!tag.display) tag.display = {};
        tag.display.Lore = loreArr;
    }

    var tagParts = [];
    for (var key in tag) {
        if (!tag.hasOwnProperty(key)) continue;
        if (key === "AttributeModifiers") {
            var modParts = [];
            var mods = tag[key];
            for (var m = 0; m < mods.length; m++) modParts.push(snbtCompound(mods[m]));
            tagParts.push("AttributeModifiers:[" + modParts.join(",") + "]");
        } else if (key === "display") {
            var dispParts = [];
            var disp = tag[key];
            for (var dk in disp) {
                if (!disp.hasOwnProperty(dk)) continue;
                if (dk === "Lore") {
                    var loreParts = [];
                    for (var li = 0; li < disp[dk].length; li++) {
                        loreParts.push('"' + String(disp[dk][li]).replace(/\\/g,"\\\\").replace(/"/g,'\\"') + '"');
                    }
                    dispParts.push("Lore:[" + loreParts.join(",") + "]");
                } else {
                    dispParts.push(dk + ":" + snbtValue(disp[dk]));
                }
            }
            tagParts.push("display:{" + dispParts.join(",") + "}");
        } else {
            tagParts.push(key + ":" + snbtValue(tag[key]));
        }
    }

    var count = cfg.count || 1;
    return '{id:"' + cfg.id + '",Count:' + count + 'b,tag:{' + tagParts.join(",") + '}}';
}

// The representative display item is always the parent cfg.id itself.
function representativeId(cfg) {
    return cfg.id;
}

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
                var displayId = cfg.variants ? representativeId(cfg) : cfg.id;
                var loreArr = cfg.lore ? cfg.lore.slice() : [];
                loreArr.push("");
                if (cfg.variants) {
                    // Label = show variant label + hint
                    var vLabel = cfg.variantLabel || displayId.replace(/^[^:]+:/, "").replace(/_/g, " ");
                    loreArr.push("\u00a7b\u00bb " + cfg.variants.length + " variants — click to browse");
                    loreArr.push("\u00a7aFrom: \u00a7e" + (cfg.price || 0) + "\u00a2");
                } else {
                    loreArr.push("\u00a7aPrice: \u00a7e" + (cfg.price || 0) + "\u00a2");
                }

                var displayCfg = { id: displayId, count: cfg.count || 1, nbt: cfg.nbt || {}, lore: [] };
                var snbt = buildSnbt(displayCfg, loreArr);
                var item = player.world.createItemFromNbt(api.stringToNbt(snbt));
                item.setLore(loreArr);

                // Set custom name for variant parents
                if (cfg.variants && cfg.variantLabel) {
                    try { item.setCustomName("\u00a76" + cfg.variantLabel); } catch(e) {}
                }

                arr[idx] = {
                    displayNbt: item.getItemNbt().toJsonString(),
                    price: cfg.price || 0,
                    hasVariants: !!cfg.variants
                };
            } catch(e) {
                arr[idx] = null;
            }
        }
        shopData[t] = arr;
    }
    return shopData;
}

// ============================================================
//  VARIANT PANEL — Build & draw
// ============================================================

function buildVariantPanelSlots(player, api) {
    if (!variantPanelCfg || !variantPanelCfg.variants) return;
    var variants = variantPanelCfg.variants;
    var totalVisible = variantPanelCols * variantPanelViewRows;

    for (var i = 0; i < variantSlots.length && i < totalVisible; i++) {
        variantSlots[i].setStack(null);
        var vi = variantSlotToIndex(i);
        if (vi >= variants.length) continue;

        var vCfg = resolveVariantCfg(variantPanelCfg, vi);
        if (!vCfg) continue;

        try {
            var displayName = variantDisplayName(vCfg);
            var loreArr = vCfg.lore ? vCfg.lore.slice() : [];
            loreArr.push("");
            if (isSellMode) {
                var sp = Math.max(0, Math.floor(vCfg.price * (1 - SELL_LOSS_PERCENTAGE)));
                loreArr.push("\u00a76Sell Price: \u00a7e" + sp + "\u00a2");
                loreArr.push("\u00a77(based on durability)");
            } else {
                loreArr.push("\u00a7aPrice: \u00a7e" + vCfg.price + "\u00a2");
            }
            var snbt = buildSnbt(vCfg, loreArr);
            var item = player.world.createItemFromNbt(api.stringToNbt(snbt));
            item.setLore(loreArr);
            try { item.setCustomName(displayName); } catch(e) {}
            variantSlots[i].setStack(item);
        } catch(e) {}
    }
}

// Remove all variant panel GUI components.
function clearVariantPanelComponents() {
    if (!guiRef) return;
    // Scroll buttons
    try { guiRef.removeComponent(ID_VARIANT_SCROLL_UP);   } catch(e) {}
    try { guiRef.removeComponent(ID_VARIANT_SCROLL_DOWN); } catch(e) {}
    // Label
    try { guiRef.removeComponent(ID_VARIANT_LABEL); } catch(e) {}
    // Border lines
    for (var b = ID_VARIANT_BORDER_BASE; b < ID_VARIANT_BORDER_BASE + 8; b++) {
        try { guiRef.removeComponent(b); } catch(e) {}
    }
    // Clear slots
    for (var i = 0; i < variantSlots.length; i++) {
        try { variantSlots[i].setStack(null); } catch(e) {}
    }
}

// Draw variant panel scroll buttons, label, border.
function drawVariantPanelChrome() {
    if (!guiRef || !variantPanelCfg) return;

    var panelW = variantPanelCols * variantPanelSpacing;   // 90
    var panelH = variantPanelViewRows * variantPanelSpacing; // 108
    var px = variantPanelStartX;
    var py = variantPanelStartY;

    // Border
    try { guiRef.addColoredLine(ID_VARIANT_BORDER_BASE,     px - 2,       py - 12,     px + panelW + 2, py - 12,     0x00CCFF, 1); } catch(e) {}
    try { guiRef.addColoredLine(ID_VARIANT_BORDER_BASE + 1, px - 2,       py + panelH, px + panelW + 2, py + panelH, 0x00CCFF, 1); } catch(e) {}
    try { guiRef.addColoredLine(ID_VARIANT_BORDER_BASE + 2, px - 2,       py - 12,     px - 2,          py + panelH, 0x00CCFF, 1); } catch(e) {}
    try { guiRef.addColoredLine(ID_VARIANT_BORDER_BASE + 3, px + panelW + 2, py - 12,  px + panelW + 2, py + panelH, 0x00CCFF, 1); } catch(e) {}

    // Label
    var label = variantPanelCfg.variantLabel || variantPanelCfg.id.replace(/^[^:]+:/, "").replace(/_/g, " ");
    try {
        guiRef.removeComponent(ID_VARIANT_LABEL);
        guiRef.addLabel(ID_VARIANT_LABEL, "\u00a7b" + label, px, py - 10, 0.65, 0.65);
    } catch(e) {}

    // Scroll buttons (to the right of the panel)
    var scrollX = px + panelW + 4;
    try { guiRef.removeComponent(ID_VARIANT_SCROLL_UP);   } catch(e) {}
    try { guiRef.removeComponent(ID_VARIANT_SCROLL_DOWN); } catch(e) {}
    try { guiRef.addButton(ID_VARIANT_SCROLL_UP,   "↑", scrollX, py,      18, 18); } catch(e) {}
    try { guiRef.addButton(ID_VARIANT_SCROLL_DOWN, "↓", scrollX, py + 20, 18, 18); } catch(e) {}
}

// Open/refresh the variant panel for a given cfg.
function openVariantPanel(cfg, player, api) {
    variantPanelCfg = cfg;
    variantPanelRow = 0;
    drawVariantPanelChrome();
    buildVariantPanelSlots(player, api);
}

// Close the variant panel.
function closeVariantPanel() {
    clearVariantPanelComponents();
    variantPanelCfg = null;
    variantPanelRow = 0;
}

// ============================================================
//  Open GUI
// ============================================================
function interact(event) {
    var player = event.player;
    var api = event.API;
    lastNpc = event.npc;

maxPages = CONFIG_MAX_PAGES;
currentPage = savedPage;
viewportRow = savedViewportRow;
totalRows = CONFIG_TAB_ROWS[currentPage] || 5;

    storedSlotItems = buildShopDataFromConfig(player, api);

    var totalSlots = totalRows * numCols;
    if (!storedSlotItems[currentPage]) {
        storedSlotItems[currentPage] = makeNullArray(totalSlots);
    }

    if (!guiRef) {
        guiRef = api.createCustomGui(176, 166, 0, true, player);

        // Tabs
        var tabWidth = 25, tabHeight = 28, tabSpacing = 2, tabStartX = 0, tabY = -80;
        tabSlots = [];
        for (var i = 0; i < maxPages; i++) {
            var tabX = tabStartX + i * (tabWidth + tabSpacing);
            var tabSlot = guiRef.addItemSlot(tabX + 4, tabY + 5);
            tabSlots.push(tabSlot);
            guiRef.addButton(ID_TAB_BASE + i, "", tabX, tabY, tabWidth, tabHeight);
        }

        // Main item slots
        mySlots = slotPositions.map(function(pos) {
            return guiRef.addItemSlot(pos.x, pos.y);
        });

        // Variant panel slots (always created; hidden when no variant panel open)
        variantSlots = variantSlotPositions.map(function(pos) {
            return guiRef.addItemSlot(pos.x, pos.y);
        });

        // Main scroll buttons
        var scrollX = startX + (numCols * colSpacing) + 2;
        var scrollY = startY;
        guiRef.addButton(ID_SCROLL_UP,   "↑", scrollX, scrollY,      18, 18);
        guiRef.addButton(ID_SCROLL_DOWN, "↓", scrollX, scrollY + 20, 18, 18);
        guiRef.addLabel(10, "", scrollX + 1, scrollY + 42, 0.7, 0.7);

        // Buy/Sell toggle
        guiRef.addButton(ID_MODE_TOGGLE, "Buying", scrollX, scrollY + 90, 50, 18);

        // Search bar
        var searchY = -100;
        guiRef.addTextField(searchFieldId, startX, searchY, (numCols * colSpacing) - 22, 16).setText(searchQuery);
        guiRef.addButton(searchButtonId, "Go", startX + (numCols * colSpacing) - 18, searchY, 18, 16);

        // Tab icons
        for (var i = 0; i < tabSlots.length; i++) {
            try {
                var iconName = CONFIG_TAB_NAMES[i] || ("Tab " + (i + 1));
                var iconCfg  = CONFIG_TAB_ICONS[i];
                var iconItem;
                if (iconCfg) {
                    var iconSnbt = buildSnbt({ id: iconCfg.id, count: 1, nbt: iconCfg.nbt || {}, lore: [] }, null);
                    iconItem = player.world.createItemFromNbt(api.stringToNbt(iconSnbt));
                } else {
                    iconItem = player.world.createItemFromNbt(api.stringToNbt('{id:"minecraft:barrier",Count:1b,tag:{}}'));
                }
                iconItem.setCustomName(iconName);
                tabSlots[i].setStack(iconItem);
            } catch(e) {}
        }

        player.showCustomGui(guiRef);
    } else {
        // Reload tab icons
        for (var i = 0; i < tabSlots.length; i++) {
            try {
                var iconName = CONFIG_TAB_NAMES[i] || ("Tab " + (i + 1));
                var iconCfg  = CONFIG_TAB_ICONS[i];
                var iconItem;
                if (iconCfg) {
                    var iconSnbt = buildSnbt({ id: iconCfg.id, count: 1, nbt: iconCfg.nbt || {}, lore: [] }, null);
                    iconItem = player.world.createItemFromNbt(api.stringToNbt(iconSnbt));
                } else {
                    iconItem = player.world.createItemFromNbt(api.stringToNbt('{id:"minecraft:barrier",Count:1b,tag:{}}'));
                }
                iconItem.setCustomName(iconName);
                tabSlots[i].setStack(iconItem);
            } catch(e) {}
        }
    }

    highlightCurrentTab();
    updateVisibleSlots(player, api);
    updateScrollIndicator();
    if (guiRef) guiRef.update();
}

function highlightCurrentTab() {
    try { guiRef.removeComponent(20); guiRef.removeComponent(21); guiRef.removeComponent(22); guiRef.removeComponent(23); } catch(e) {}
    try {
        var tabWidth = 25, tabHeight = 28, tabSpacing = 2, tabStartX = 0, tabY = -80;
        var hx = tabStartX + currentPage * (tabWidth + tabSpacing);
        guiRef.addColoredLine(20, hx - 1,           tabY - 1,           hx + tabWidth + 1, tabY - 1,           0xFFFF00, 2);
        guiRef.addColoredLine(21, hx - 1,           tabY + tabHeight + 1, hx + tabWidth + 1, tabY + tabHeight + 1, 0xFFFF00, 2);
        guiRef.addColoredLine(22, hx - 1,           tabY - 1,           hx - 1,            tabY + tabHeight + 1, 0xFFFF00, 2);
        guiRef.addColoredLine(23, hx + tabWidth + 1, tabY - 1,          hx + tabWidth + 1, tabY + tabHeight + 1, 0xFFFF00, 2);
    } catch(e) {}
}

function updateScrollIndicator() {
    if (!guiRef) return;
    var effectiveRows = searchResultMap !== null ? searchResultRows() : totalRows;
    var maxViewportRow = Math.max(0, effectiveRows - viewportRows);
    try {
        guiRef.removeComponent(10);
        var scrollX = startX + (numCols * colSpacing) + 2;
        var scrollY = startY;
        guiRef.addLabel(10, "\u00a77" + (viewportRow + 1) + "/" + (maxViewportRow + 1), scrollX + 1, scrollY + 42, 0.7, 0.7);
    } catch(e) {}
}

function updateVisibleSlots(player, api) {
    for (var i = 0; i < mySlots.length; i++) {
        mySlots[i].setStack(null);

        var globalIndex;
        if (searchResultMap !== null) {
            globalIndex = searchViewportToGlobal(i);
            if (globalIndex === -1) continue;
        } else {
            globalIndex = viewportToGlobal(i);
        }

        var pageData = storedSlotItems[currentPage];
        if (pageData && globalIndex < pageData.length && pageData[globalIndex]) {
            try {
                var entry = pageData[globalIndex];
                var item = player.world.createItemFromNbt(api.stringToNbt(entry.displayNbt));
                var loreArr = cfg_getLore(currentPage, globalIndex, isSellMode);
                if (loreArr) item.setLore(loreArr);
                mySlots[i].setStack(item);
            } catch(e) {}
        }
    }
}

function cfg_getLore(tabIndex, globalIndex, sellMode) {
    var items = CONFIG_SHOP_ITEMS[tabIndex] || [];
    var cfg = items[globalIndex];
    if (!cfg) return null;
    var loreArr = cfg.lore ? cfg.lore.slice() : [];
    loreArr.push("");
    if (cfg.variants) {
        loreArr.push("\u00a7b\u00bb " + cfg.variants.length + " variants \u2014 click to browse");
        loreArr.push("\u00a7aFrom: \u00a7e" + (cfg.price || 0) + "\u00a2");
    } else if (sellMode) {
        var sellPrice = Math.max(0, Math.floor((cfg.price || 0) * (1 - SELL_LOSS_PERCENTAGE)));
        loreArr.push("\u00a76Sell Price: \u00a7e" + sellPrice + "\u00a2");
        loreArr.push("\u00a77(based on durability)");
    } else {
        loreArr.push("\u00a7aPrice: \u00a7e" + (cfg.price || 0) + "\u00a2");
    }
    return loreArr;
}

function calcSellPrice(cfg, playerItem) {
    var buyPrice = cfg.price || 0;
    var durabilityRatio = 1.0;
    try {
        var snbt = playerItem.getItemNbt().toJsonString();
        var damage = 0, maxDurability = 0;
        var dmgMatch = snbt.match(/"Damage":\s*(\d+)/);
        if (dmgMatch) damage = parseInt(dmgMatch[1]);
        try { maxDurability = playerItem.getMaxDamage(); } catch(e) {}
        if (maxDurability > 0 && damage > 0) {
            durabilityRatio = (maxDurability - damage) / maxDurability;
            if (durabilityRatio < 0) durabilityRatio = 0;
        }
    } catch(e) {}
    return Math.max(0, Math.floor(buyPrice * durabilityRatio - buyPrice * SELL_LOSS_PERCENTAGE));
}

// ============================================================
//  Button handler
// ============================================================
function customGuiButton(event) {
    var player = event.player;
    var api    = event.API;

    // ── Search ──
    if (event.buttonId === searchButtonId) {
        var gui = event.gui;
        if (gui) {
            var field = gui.getComponent(searchFieldId);
            if (field) searchQuery = field.getText();
        }
        searchResultMap = buildSearchResultMap(currentPage, searchQuery);
        viewportRow = 0;
        closeVariantPanel();
        if (searchResultMap !== null && searchResultMap.length === 0) {
            player.message("\u00a7cNo items found for: \u00a7e" + searchQuery);
        }
        updateVisibleSlots(player, api);
        updateScrollIndicator();
        if (guiRef) guiRef.update();
        return;
    }

    // ── Variant panel scroll ──
    if (event.buttonId === ID_VARIANT_SCROLL_UP) {
        if (variantPanelRow > 0) {
            variantPanelRow--;
            buildVariantPanelSlots(player, api);
            if (guiRef) guiRef.update();
        }
        return;
    }
    if (event.buttonId === ID_VARIANT_SCROLL_DOWN) {
        var maxVRow = Math.max(0, variantPanelTotalRows() - variantPanelViewRows);
        if (variantPanelRow < maxVRow) {
            variantPanelRow++;
            buildVariantPanelSlots(player, api);
            if (guiRef) guiRef.update();
        }
        return;
    }

    // ── Main scroll ──
    var effectiveRows   = searchResultMap !== null ? searchResultRows() : totalRows;
    var maxViewportRow  = Math.max(0, effectiveRows - viewportRows);

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

    // ── Buy/Sell toggle ──
    if (event.buttonId === ID_MODE_TOGGLE) {
        isSellMode = !isSellMode;
        try { guiRef.removeComponent(ID_MODE_TOGGLE); } catch(e) {}
        var scrollX = startX + (numCols * colSpacing) + 2;
        var scrollY = startY;
        guiRef.addButton(ID_MODE_TOGGLE, isSellMode ? "Selling" : "Buying", scrollX, scrollY + 90, 50, 18);
        updateVisibleSlots(player, api);
        // Refresh variant panel lore too if open
        if (variantPanelCfg) buildVariantPanelSlots(player, api);
        if (guiRef) guiRef.update();
        return;
    }

    // ── Tab switch ──
    if (event.buttonId >= ID_TAB_BASE && event.buttonId < ID_TAB_BASE + maxPages) {
        var tabIndex = event.buttonId - ID_TAB_BASE;
        if (tabIndex !== currentPage) {
            currentPage = tabIndex;
            viewportRow = 0;
            totalRows   = CONFIG_TAB_ROWS[currentPage] || 5;
            searchQuery = "";
            searchResultMap = null;
            closeVariantPanel();
            storedSlotItems = buildShopDataFromConfig(player, api);
            if (!storedSlotItems[currentPage]) {
                storedSlotItems[currentPage] = makeNullArray(totalRows * numCols);
            }
            // Clear search field visually
            try {
                guiRef.removeComponent(searchFieldId);
                var searchY = -100;
                guiRef.addTextField(searchFieldId, startX, searchY, (numCols * colSpacing) - 22, 16).setText("");
            } catch(e) {}
            highlightCurrentTab();
            updateVisibleSlots(player, api);
            updateScrollIndicator();
            if (guiRef) guiRef.update();
        }
        return;
    }
}

// ============================================================
//  Slot click handler
// ============================================================
function customGuiSlotClicked(event) {
    var clickedSlot = event.slot;
    var player      = event.player;
    var api         = event.API;

    // ── Check variant panel slots first ──
    var variantSlotIndex = variantSlots.indexOf(clickedSlot);
    if (variantSlotIndex !== -1 && variantPanelCfg) {
        var vi = variantSlotToIndex(variantSlotIndex);
        if (vi >= variantPanelCfg.variants.length) return;
        var vCfg = resolveVariantCfg(variantPanelCfg, vi);
        if (!vCfg) return;

        // Check the slot isn't empty
        var vSlot = variantSlots[variantSlotIndex];
        if (!vSlot.getStack() || vSlot.getStack().isEmpty()) return;

        executePurchaseOrSell(player, api, vCfg, vSlot.getStack());
        return;
    }

    // ── Main grid slots ──
    var slotIndex = mySlots.indexOf(clickedSlot);
    if (slotIndex === -1) return;

    var globalIndex;
    if (searchResultMap !== null) {
        globalIndex = searchViewportToGlobal(slotIndex);
        if (globalIndex === -1) return;
    } else {
        globalIndex = viewportToGlobal(slotIndex);
    }

    var pageData = storedSlotItems[currentPage];
    if (!pageData || globalIndex >= pageData.length) return;

    var entry = pageData[globalIndex];
    if (!entry) return;

    var item = mySlots[slotIndex].getStack();
    if (!item || item.isEmpty()) return;

    var cfg = (CONFIG_SHOP_ITEMS[currentPage] || [])[globalIndex];
    if (!cfg) return;

    // If this is a variant parent — open the variant panel
    if (cfg.variants) {
        // Toggle: if same item is already open, close it
        if (variantPanelCfg && variantPanelCfg === cfg) {
            closeVariantPanel();
        } else {
            closeVariantPanel();
            openVariantPanel(cfg, player, api);
        }
        if (guiRef) guiRef.update();
        return;
    }

    // Normal item — close variant panel and buy/sell
    closeVariantPanel();
    if (guiRef) guiRef.update();
    executePurchaseOrSell(player, api, cfg, item);
}

// ============================================================
//  Shared buy/sell logic
// ============================================================
function executePurchaseOrSell(player, api, cfg, displayItem) {
    if (isSellMode) {
        var inv = player.getInventory();
        var foundSlot = -1, foundStack = null;
        for (var i = 0; i < inv.getSize(); i++) {
            var stack = inv.getSlot(i);
            if (!stack || stack.isEmpty()) continue;
            if (nbtMatchesIgnoreDamageAndLore(stack, cfg)) {
                foundSlot  = i;
                foundStack = stack;
                break;
            }
        }
        if (foundSlot === -1) {
            player.message("\u00a7cYou don't have this item to sell!");
            return;
        }
        var sellPrice = calcSellPrice(cfg, foundStack);
        if (sellPrice <= 0) {
            player.message("\u00a7cThis item has no sell value!");
            return;
        }
        var stackSize = foundStack.getStackSize();
        if (stackSize <= 1) { inv.setSlot(foundSlot, null); }
        else { foundStack.setStackSize(stackSize - 1); }
        giveCoins(player, sellPrice);
        player.message("\u00a7aSold for \u00a7e" + sellPrice + "\u00a2!");

    } else {
        var price = cfg.price;
        if (price === null || price === undefined) {
            player.message("\u00a7cThis item has no price set!");
            return;
        }
// Block purchase if hotbar is full
        var inv2 = player.getInventory();
        var hotbarFull = true;
        for (var h = 0; h < 8; h++) {
            var hs = inv2.getSlot(h);
            if (!hs || hs.isEmpty()) { hotbarFull = false; break; }
        }
        if (hotbarFull) {
            player.message("§cYour hotbar is full! Make some room before purchasing.");
            return;
        }

        var playerCoins = countPlayerCoins(player);
        if (playerCoins < price) {
            player.message("\u00a7cNot enough coins! Need: \u00a7e" + price + "\u00a2 \u00a7c, Have: \u00a7e" + playerCoins + "\u00a2");
            return;
        }
        removeCoins(player, price);
        try {
            var cleanLore = cfg.lore && cfg.lore.length > 0 ? cfg.lore.slice() : null;
            var snbt = buildSnbt(cfg, cleanLore);
            var purchaseItem = player.world.createItemFromNbt(api.stringToNbt(snbt));
            if (cleanLore) purchaseItem.setLore(cleanLore);
            player.giveItem(purchaseItem);
            player.message("\u00a7aPurchased for \u00a7e" + price + "\u00a2!");
        } catch(e) {
            player.message("\u00a7cError purchasing item: " + e);
        }
    }
}

var VARIANT_KEYS = ["GunId", "AmmoId", "AttachmentId"];

function nbtMatchesIgnoreDamageAndLore(playerStack, cfg) {
    try {
        var snbt = playerStack.getItemNbt().toJsonString();
        var cfgNbt = cfg.nbt || {};

        if (snbt.indexOf('"id": "' + cfg.id + '"') === -1) return false;

        if (cfgNbt.AttributeModifiers && cfgNbt.AttributeModifiers.length > 0) {
            var firstUUID = cfgNbt.AttributeModifiers[0].UUID;
            if (firstUUID && snbt.indexOf(firstUUID) === -1) return false;
            return true;
        }

        for (var k = 0; k < VARIANT_KEYS.length; k++) {
            var key = VARIANT_KEYS[k];
            if (!cfgNbt.hasOwnProperty(key)) continue;
            var val = String(cfgNbt[key]);
            if (snbt.indexOf('"' + key + '": "' + val + '"') === -1) return false;
        }
        return true;
    } catch(e) { return false; }
}

function giveCoins(player, amount) {
    var emeralds = Math.floor(amount / (STONE_TO_COAL * COAL_TO_EMERALD));
    amount -= emeralds * STONE_TO_COAL * COAL_TO_EMERALD;
    var coals  = Math.floor(amount / STONE_TO_COAL);
    var stones = amount % STONE_TO_COAL;
    if (emeralds > 0) player.giveItem(player.world.createItem("coins:emerald_coin", emeralds));
    if (coals    > 0) player.giveItem(player.world.createItem("coins:coal_coin",    coals));
    if (stones   > 0) player.giveItem(player.world.createItem("coins:stone_coin",   stones));
}

function customGuiClosed(event) {
    // Save tab and scroll position before resetting
    savedPage        = currentPage;
    savedViewportRow = viewportRow;

    guiRef = null;
    viewportRow = 0;
    currentPage = 0;
    isSellMode  = false;
    searchQuery = "";
    searchResultMap = null;
    variantPanelCfg = null;
    variantPanelRow = 0;
}

function countPlayerCoins(player) {
    var stoneTotal = 0, coalTotal = 0, emeraldTotal = 0;
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
            var stoneValue  = stackAmount * STONE_TO_COAL;
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
            var stoneValue  = stackAmount * STONE_TO_COAL * COAL_TO_EMERALD;
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
