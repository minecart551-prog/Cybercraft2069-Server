function init(event) {
    var npc = event.npc;
    var world = npc.getWorld();
    var API = event.API;
    // White car model NBT as a single NBT string
    var nbtString = '{' +
    'id:"bbs:model",' +
    'Count:1b,' +
    'tag:{' +
    'display:{Lore:["\\"(+NBT)\\""]},' +
    'BlockStateTag:{light_level:0},' +
    'BlockEntityTag:{' +
    'id:"bbs:model_block_entity",' +
    'unloaded_activity:{last_tick:3338756L},' +
    'Properties:{' +
    'enabled:1b,' +
    'shadow:0b,' +
    'hitbox_pos1:[0.0f,0.0f,0.0f],' +
    'form:{' +
    'hitboxWidth:0.5f,' +
    'track_name:"",' +
    'lighting:1.0f,' +
    'visible:1b,' +
    'color:-1,' +
    'model:"cars/whitecar",' +
    'hitboxHeight:1.8f,' +
    'step_height:0.5f,' +
    'hitbox:0b,' +
    'uiScale:1.0f,' +
    'animatable:1b,' +
    'hp:20.0f,' +
    'shaderShadow:1b,' +
    'movement_speed:0.1f,' +
    'hitboxEyeHeight:0.9f,' +
    'keybind:0,' +
    'name:"",' +
    'id:"bbs:model",' +
    'hitboxSneakMultiplier:0.9f' +
    '},' +
    'transform:{t:[-0.406f,0.532f,-0.344f],r:[0.0f,-1.5390697f,0.0f],p:[0.0f,0.0f,0.0f],r2:[0.0f,0.0f,0.0f],s:[3.0f,3.0f,3.0f]},' +
    'transformInventory:{},' +
    'transformThirdPerson:{},' +
    'transformFirstPerson:{t:[0.0f,0.0f,-0.25f],r:[0.0f,0.0f,0.0f],p:[0.0f,0.0f,0.0f],r2:[0.0f,0.0f,0.0f],s:[1.0f,1.0f,1.0f]},' +
    'light_level:0,' +
    'hardness:0.0f,' +
    'look_at:0b,' +
    'hitbox:0b,' +
    'global:0b,' +
    'hitbox_pos2:[1.0f,1.0f,1.0f]' +
    '}' +
    '}' +
    '}' +
    '}';
    // Convert string to NBT and create an actual item
    var nbt = API.stringToNbt(nbtString);
    var item = world.createItemFromNbt(nbt);
    // Give to NPC
    npc.setMainhandItem(item);
}