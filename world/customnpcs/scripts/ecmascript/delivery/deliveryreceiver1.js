// ===== CONFIGURATION =====
var deliveryOfficePos = {x: 2492, z: 839}; // Set the delivery office coordinates here
var coinRate = 8; // Coins per 100 blocks distance
var sugarCoinMultiplier = 0.5; // Percentage of normal coin reward for sugar deliveries (0.5 = 50%, 1.0 = 100%, etc.)
var secretChance= 0.2;
// =========================
var secretMessages = [
    "§ashhhhh:A6",
    "§ashhhhh:B3",
    "§ashhhhh:C8",
    "§ashhhhh:D9",
    "§ashhhhh:E1"
];

var delivMessages = [
    "§aThank you! You're a lifesaver!",
    "§aI really appreciate this!",
    "§aYou're the best!",
    "§aMany thanks for your help!",
    "§aThis means a lot to me!",
    "§aExcellent work! Keep it up!",
    "§aYou're doing great!",
    "§aThanks for being reliable!"
];
// Male names and skins
var maleNames = [
//English (additional)
"John","Michael","David","Chris","Daniel","Alex","Robert","James",
"William","Joseph","Anthony","Mark","Matthew","Andrew","Joshua","Brian",
"Kevin","Jason","Justin","Ryan","Brandon","Jacob","Nicholas","Eric",
"Jonathan","Stephen","Larry","Scott","Frank","Tyler","Dennis","Jerry",
"Aaron","Adam","Patrick","Sean","Zachary","Nathan","Samuel","Kyle",
"Benjamin","Paul","Ethan","Gregory","Jordan","Cameron","Dylan","Hunter",
"Logan","Adrian","Connor","Evan","Tristan","Austin","Shawn","Colton",
"Owen","Landon","Chad","Trevor","Spencer","Marcus","Vincent","Bradley",
"Peter","George","Louis","Arthur","Maxwell","Dean","Curtis","Phillip",
"Craig","Douglas","Raymond","Mitchell","Derek","Edwin","Jonah","Brady",
"Cody","Dustin","Blake","Wesley","Henry","Oscar","Malcolm","Clifford",
"Harold","Howard","Bruce","Victor","Jeffrey","Allen","Caleb","Gordon",
"Neil","Stuart","Elliot","Curt","Terrence","Leonard","Randall","Edgar",
"Marshall","Frederick","Stanley","Norman","Wayne","Glen","Elijah","Hudson",
"Bryce","Troy","Keith","Melvin","Ralph","Jared","Joey","Dominic","Marco",
"Logan","Rhett","Silas","Miles","Gavin","Finn","Asher","Levi","Mason",
"Colin","Ian","Eli","Grayson","Knox","Beau","Sawyer","Bennett","Jace",
"Ryker","Rowan","Kaden","Tanner","Harrison","Emmett","Jasper","Phoenix",
"Zane","Pierce","Orion","Dante","Felix","Rafael","Gage","Reid","Marvin",
"Leon","Elliott","Maple","Trent","Moises","Amos",

//Japanese (expanded)
"Haruto","Ren","Yuto","Souta","Itsuki","Minato","Ryusei","Daiki",
"Kaito","Takumi","Sho","Hikaru","Tsubasa","Kouki","Soutaro","Taiga",
"Riku","Kenta","Shota","Yuya","Naoki","Hayato","Masato","Issei",
"Shun","Keisuke","Ryo","Yuma","Takahiro","Shinji","Haruki","Makoto",
"Akihiko","Daisuke","Shouhei","Toshiro","Ryosuke","Tomoya","Kouhei","Nobu",
"Yoshito","Kazuya","Hiroshi","Kenji","Shin","Junpei","Satoshi","Rikuya",
"Fumito","Manabu","Takahashi","Osamu","Koji","Hiroaki","Shunpei","Tetsuya",
"Yuuto","Naoya","Eiji","Shinya","Hiroki","Masashi","Kouya","Kazuo",
"Yukio","Toru","Renji","Rentarou","Masaki","Ryota","Haruma","Haruya",
"Kazuki","Hitoshi","Kouma","Norio","Taichi","Kenshin","Shohei","Ryoji",
"Kazunari","Yoshiki","Sora","Koki","Yuki","Kazuhiro","Naoto","Hayashi",
"Yuichiro","Kensuke","Hinata","Mitsuo","Seiji","Yoshinori","Kouta","Ryohei",

//Chinese (expanded)
"Wei","Hao","Jun","Tao","Bo","Ming","Jian","Chao",
"Lei","Guang","Shen","Zhi","Hui","Feng","Qiang","Peng",
"Yong","Dong","Kai","Chen","Lin","Yuan","Xiao","Peng",
"Zheng","An","Haochen","Haoran","Weiming","Rui","Jie","Yifan",
"Guo","Junjie","Haoyu","Zhihao","Muchen","Liyuan","Bolin","Ziyu",
"Song","Yuxuan","Zhenghao","Sheng","Rong",

//Polish (new)
"Piotr","Krzysztof","Mateusz","Paweł","Tomasz","Jakub","Jan","Marek",
"Łukasz","Marcin","Grzegorz","Andrzej","Szymon","Kacper","Oskar","Mikołaj",
"Adrian","Damian","Bartek","Rafał","Dominik","Sebastian","Wojciech","Przemysław",
"Filip","Bartosz","Daniel","Ryszard","Henryk","Bronisław","Stanisław","Kazimierz",
"Jędrzej","Ignacy","Hubert","Kamil","Natal","Sylwester","Borys","Miłosz",
"Artur","Zenon","Wiktor","Olaf","Eryk","Kajetan","Juliusz","Cezary",

//Russian (new)
"Alexander","Aleksandr","Dmitry","Dmitri","Ivan","Sergey","Sergei","Andrey",
"Andrei","Nikolai","Nikolay","Vladimir","Vladislav","Mikhail","Mikhayl","Yuri",
"Yuriy","Kirill","Kirill","Maxim","Maksim","Anton","Roman","Pavel",
"Alexey","Aleksey","Igor","Denis","Viktor","Viktor","Artem","Artyom",
"Egor","Yegor","Timofey","Konstantin","Konstantin","Oleg","Stanislav","Vadim",
"Lev","Grigory","Boris","Yakov","Semyon","Semyon","Ilya","Valentin",
"Evgeny","Yevgeny","Ruslan","Anatoly","Fedor","Fyodor","Vsevolod","Gleb",

//Latin / Spanish / Italian / Portuguese (grouped)
"José","Juan","Carlos","Luis","Miguel","Jorge","Diego","Antonio",
"Francisco","Manuel","Rafael","Fernando","Sergio","Ricardo","Alberto","Pablo",
"Emilio","Enrique","Andrés","Álvaro","Marcelo","Eduardo","Ángel","Javier",
"Martín","Lucas","Tomás","Santiago","Mateo","Alejandro","Óscar","Iván",
"Rubén","Héctor","Gonzalo","Gustavo","Hugo","Adrián","Cristóbal","Hernán",
"Valentín","Simón","Rodrigo","Esteban","Leandro","Félix","Nicolás","Guillermo",
"Gian","Luca","Marco","Matteo","Alessandro","Giovanni","Antonio","Francesco",
"Paolo","Salvatore","Enzo","Diego","Luigi","Rocco","Pietro","Andrea",
"Riccardo","Federico","Emanuele","Vincenzo","Domenico","Sergio","Maurizio",
"Thiago","Bruno","César","Renato","Marcos","Joel","Gastón","Milton"
];

var femaleName = [
 //American / European (additional)
"Emily","Sarah","Jessica","Ashley","Amanda","Samantha","Taylor","Rachel",
"Megan","Hannah","Lauren","Brittany","Nicole","Elizabeth","Jennifer","Heather",
"Michelle","Melissa","Rebecca","Amber","Danielle","Christina","Courtney","Katherine",
"Olivia","Sophia","Alyssa","Allison","Madison","Emma","Natalie","Victoria",
"Chloe","Isabella","Grace","Haley","Kayla","Anna","Erin","Brooke",
"Abigail","Savannah","Lily","Jasmine","Julia","Maya","Ava","Claire",
"Sophie","Ella","Gabriella","Mackenzie","Faith","Kylie","Paige","Morgan",
"Alexis","Caroline","Jordan","Madeline","Alexa","Bailey","Maria","Audrey",
"Autumn","Evelyn","Hailey","Leah","Lucy","Stella","Charlotte","Amelia",
"Zoe","Naomi","Aria","Scarlett","Penelope","Lillian","Eva","Molly",
"Catherine","Laura","Ivy","Phoebe","Rose","Diana","Iris","Elena",
"Victoria","Monica","Angela","Holly","Vanessa","Bianca","Nina","Clara",
"Veronica","Josephine","Francesca","Helena","Madeline","Ruth","Theresa","Regina",
"Genevieve","Eleanor","Beatrice","Marilyn","Olga","Camille","Daisy","Mabel",
"Violet","Piper","Sierra","Daphne","Irene","Estelle","Colette","Madeleine",
"Rowan","Mallory","Vivian","Cecilia","Miranda","Sabrina","Tessa","Nora",
"Delilah","Riley","Skye","Remi","Aubrey","Kaia","Adeline","Briar",
"Annabelle","Emilia","Celeste","June","Willa","Eloise","Imogen","Ada",

//Japanese (expanded)
"Ayumi","Yui","Haruka","Aoi","Miyu","Nanami","Yuna","Riko",
"Hikari","Mei","Sakura","Hina","Kana","Mizuki","Emi","Sayaka",
"Rina","Kaori","Nozomi","Aya","Miku","Satomi","Keiko","Tomomi",
"Akane","Nao","Kaho","Ayaka","Chihiro","Hitomi","Yoko","Marina",
"Shizuka","Manami","Momoko","Rumi","Natsumi","Saori","Mayu","Reina",
"Asuka","Airi","Azusa","Haruna","Hinata","Kanon","Mao","Rena",
"Misaki","Kasumi","Yoshino","Noriko","Ayano","Erika","Fumika","Kyoko",
"Takako","Mami","Miho","Sayuri","Sumire","Terumi","Yoshiko","Akemi",
"Naoko","Sachiko","Emiko","Yuriko","Chika","Fuyumi","Kei","Midori",
"Narumi","Shiori","Takara","Yumiko","Megumi","Akiko","Kazumi","Setsuko",
"Sora","Honoka","Momo","Koharu","Kokoro","Konomi","Runa","Minami",
"Yurina","Itsumi","Rikako","Kasumi","Maho","Kazane","Hinako","Manaka",

//Chinese (expanded)
"Li","Mei","Xiu","Lan","Hua","Fang","Ying","Qin",
"Jing","Fen","Na","Lian","Shan","Yan","Bao","Cai",
"Ting","Xiao","Zhen","Ling","Liang","Rou","Xia","Yue",
"Ping","Rong","Hui","Qiao","Yuan","An","Su","Ning",
"Min","Jia","Xinyi","Yalan","Shuang","Limei","Xue","Yingying",

//Polish (new)
"Anna","Katarzyna","Magdalena","Agnieszka","Małgorzata","Ewa","Zuzanna","Julia",
"Karolina","Natalia","Monika","Patrycja","Aleksandra","Joanna","Marta","Izabela",
"Elżbieta","Grażyna","Dorota","Beata","Iwona","Justyna","Renata","Sylwia",
"Weronika","Alicja","Paulina","Aneta","Angelika","Kinga","Blanka","Sabina",
"Kingа","Jadwiga","Marysia","Milena","Marianna","Antonina","Gabriela","Roksana",
"Helena","Lucyna","Urszula","Wanda","Lena","Łucja","Oliwia","Bonita",

//Russian (new)
"Anna","Olga","Elena","Maria","Natalia","Irina","Svetlana","Tatiana",
"Yulia","Ekaterina","Marina","Galina","Alina","Oksana","Lyudmila","Nina",
"Valentina","Polina","Daria","Ksenia","Anastasia","Veronika","Alyona","Vera",
"Elizaveta","Zoya","Inna","Alla","Nadezhda","Larisa","Anfisa","Marfa",
"Ulyana","Viktoria","Olesya","Milana","Yana","Taisia","Snezhana","Rimma",
"Violetta","Aksinya","Kseniya","Arina","Lidiya","Faina","Raisa","Nikol",

//Latin / Spanish / Italian / Portuguese (female)
"María","Carmen","Isabella","Sofía","Lucía","Ana","Elena","Laura",
"Patricia","Cristina","Ana María","Valentina","Camila","Carolina","Julia","Marina",
"Adriana","Catalina","Andrea","Raquel","Gabriela","Natalia","Mariana","Teresa",
"Pilar","Beatriz","Rosa","Blanca","Marta","Sonia","Alicia","Lorena",
"Alba","Noelia","Estela","Dolores","Inés","Bárbara","Clara","Irene",
"Sara","Olga","Silvia","Verónica","Leticia","Paloma","Manuela","Luciana",
"Eleonora","Giulia","Francesca","Chiara","Martina","Alessia","Valeria","Bianca",
"Elisa","Laura","Paola","Giorgia","Lucia","Rosa","Antonella","Serena",
"Isadora","Renata","Marisol","Luz","Sol","María José","Bruna","Beatriz"

];

// Male skins (34 total)
function getMaleSkins() {
    var skins = [];
    for (var i = 1; i <= 34; i++) {
        var num = (i < 10 ? "0" + i : i);
        skins.push("cyberpunkskins:textures/b/b" + num + ".png");
    }
    return skins;
}

// Female skins (34 total)
function getFemaleSkins() {
    var skins = [];
    for (var i = 1; i <= 34; i++) {
        var num = (i < 10 ? "0" + i : i);
        skins.push("cyberpunkskins:textures/g/g" + num + ".png");
    }
    return skins;
}

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ===== INIT =====
function init(e) {
    var npc = e.npc;
    var npcData = npc.getStoreddata();

    // Check if already initialized
    if (npcData.has("initialized")) {
        return;
    }

    // Determine gender (50/50)
    var isMale = Math.random() < 0.5;
    var selectedName, selectedSkin;

    if (isMale) {
        selectedName = randomFrom(maleNames);
        selectedSkin = randomFrom(getMaleSkins());
    } else {
        selectedName = randomFrom(femaleName);
        selectedSkin = randomFrom(getFemaleSkins());
        npc.getDisplay().setModel("customnpcs:customnpcalex");
    }

    // Set name and skin
    npc.getDisplay().setName(selectedName);
    npc.getDisplay().setSkinTexture(selectedSkin);

    // Mark as initialized
    npcData.put("initialized", "1");
    npcData.put("gender", isMale ? "male" : "female");

    // Get NPC position
    var npcPos = npc.getPos();
    var npcX = Math.floor(npcPos.getX());
    var npcY = Math.floor(npcPos.getY());
    var npcZ = Math.floor(npcPos.getZ());

    // Create delivery receiver list entry format: "name (x y z)"
    var deliveryEntry = selectedName + " (" + npcX + " " + npcY + " " + npcZ + ")";

    // Get or create world data for delivery list
    var worldData = npc.world.getStoreddata();
    var deliveryList = [];

    if (worldData.has("deliveryList")) {
        try {
            deliveryList = JSON.parse(worldData.get("deliveryList"));
            if (!deliveryList || !Array.isArray(deliveryList)) {
                deliveryList = [];
            }
        } catch(ex) {
            deliveryList = [];
        }
    }

    // Add this receiver to the list (avoid duplicates by checking if already exists)
    var exists = false;
    for (var i = 0; i < deliveryList.length; i++) {
        if (deliveryList[i] === deliveryEntry) {
            exists = true;
            break;
        }
    }
    if (!exists) {
        deliveryList.push(deliveryEntry);
    }

    // Save delivery list back to world data
    worldData.put("deliveryList", JSON.stringify(deliveryList));
}

// ===== INTERACT =====
function interact(event) {
    var player = event.player;
    var npc = event.npc;
    var handItem = player.getMainhandItem();

    // --- ADMIN MODE: If holding bedrock -> open admin GUI ---
    if (handItem && !handItem.isEmpty() && handItem.getName() === "minecraft:barrier") {
        openAdminGui(player, event.API, npc);
        return;
    }

    if (!handItem || handItem.isEmpty()) {
        npc.say("You need to bring me a package!");
        return;
    }

// --- COIN EXCHANGE: 100 stone_coins -> 1 coal_coin ---
if (handItem && !handItem.isEmpty() && handItem.getName() === "coins:stone_coin") {
    if (handItem.getStackSize() >= 100) {
        player.removeItem(handItem, 100);
        var coalCoin = npc.world.createItem("coins:coal_coin", 1);
        player.giveItem(coalCoin);
        npc.say("§aHere's your exchange! 100 stone coins for 1 coal coin.");
        player.message("§aExchanged 100 stone coins for 1 coal coin!");
    } else {
        npc.say("§cYou need at least 100 stone coins to exchange!");
    }
    return;
}

    // Get NPC info
    var npcData = npc.getStoreddata();
    var npcName = npc.getDisplay().getName();
    
    var npcPos = npc.getPos();
    var npcX = Math.floor(npcPos.getX());
    var npcY = Math.floor(npcPos.getY());
    var npcZ = Math.floor(npcPos.getZ());

    var expectedDisplayName = npcName + " (" + npcX + " " + npcY + " " + npcZ + ")";

    // Check if hand item is package or sugar
    var itemName = handItem.getName();
    var isValidItem = (itemName === "yuushya:package_0" || itemName === "minecraft:sugar");

    if (!isValidItem) {
        npc.say("I don't need that!");
        return;
    }

    // Check for "Delivery" lore to verify it's a legitimate package
    var hasDeliveryLore = false;
    try {
        var lore = handItem.getLore();
        if (lore && lore.length > 0) {
            for (var i = 0; i < lore.length; i++) {
                if (lore[i].indexOf("Delivery") !== -1) {
                    hasDeliveryLore = true;
                    break;
                }
            }
        }
    } catch(e) {}

    if (!hasDeliveryLore) {
        npc.say("This doesn't look like a legitimate delivery package!");
        return;
    }

    // Check if display name matches
    var handDisplayName = handItem.getDisplayName();
    var receiverMatch = false;
    
    if (handDisplayName === expectedDisplayName) {
        receiverMatch = true;
    } else {
        // Fallback: check custom NBT tag if display name doesn't match
        try {
            var nbt = handItem.getItemNbt();
            if (nbt && nbt.contains("ReceiverName")) {
                var receiverName = nbt.getString("ReceiverName");
                if (receiverName === expectedDisplayName) {
                    receiverMatch = true;
                }
            }
        } catch(e) {}
    }
    
    if (!receiverMatch) {
        npc.say("This package isn't for me! It's for " + handDisplayName);
        return;
    }

    // Calculate coins based on delivery distance
    var dx = npcX - deliveryOfficePos.x;
    var dz = npcZ - deliveryOfficePos.z;
    var distance = Math.sqrt(dx * dx + dz * dz);
    var totalCoins = Math.ceil((distance / 100.0) * coinRate);

    // Apply sugar multiplier if item is sugar
    if (itemName === "minecraft:sugar") {
        totalCoins = Math.ceil(totalCoins * sugarCoinMultiplier);
    }

    // Convert to coal and stone coins
    var coalCoins = Math.floor(totalCoins / 100);
    var stoneCoins = totalCoins % 100;

    // Give rewards
    if (coalCoins > 0) {
        var coalCoin = npc.world.createItem("coins:coal_coin", coalCoins);
        player.giveItem(coalCoin);
    }

    if (stoneCoins > 0) {
        var stoneCoin = npc.world.createItem("coins:stone_coin", stoneCoins);
        player.giveItem(stoneCoin);
    }

    // Remove the package from player's hand
    player.removeItem(handItem, 1);

    // Reset player's canGetPackage flag so they can get another package
    var pdata = player.getStoreddata();
    pdata.put("canGetPackage", 1);

    var randomMessage = delivMessages[Math.floor(Math.random() * delivMessages.length)];
    npc.say(randomMessage);

    // Secret: only triggered for yuushya:package_0 deliveries
    if (itemName === "yuushya:package_0" && Math.random() < secretChance && secretMessages.length > 0) {
        var randomSecret = secretMessages[Math.floor(Math.random() * secretMessages.length)];
        npc.say(randomSecret);
    }
    player.message("§aDelivery complete! You received " + totalCoins + " coins!");
}

// ===== ADMIN GUI =====
var guiRef = null;
var lastNpc = null;
var lastPlayer = null;
var lastApi = null;

function openAdminGui(player, api, npc) {
    lastNpc = npc;
    lastPlayer = player;
    lastApi = api;
    
    guiRef = api.createCustomGui(300, 200, 0, false, player);
    
    var npcName = npc.getDisplay().getName();
    
    guiRef.addLabel(0, "§l§nReceiver Settings", 10, -185, 1.0, 1.0);
    guiRef.addLabel(1, "Current Name: §f" + npcName, 10, -165, 0.8, 0.8);
    
    guiRef.addLabel(2, "Rename to:", 10, -145, 0.8, 0.8);
    guiRef.addTextField(10, 80, -145, 120, 18).setText("");
    
    guiRef.addButton(20, "Apply Rename", 10, -120, 80, 20);
    guiRef.addButton(21, "Reset (New Name)", 100, -120, 100, 20);
    guiRef.addButton(22, "§cDespawn", 210, -120, 70, 20);
    
    guiRef.addLabel(3, "§7Rename will change NPC name and registry.", 10, -95, 0.6, 0.6);
    guiRef.addLabel(4, "§7Reset will pick random name/skin and update registry.", 10, -85, 0.6, 0.6);
    guiRef.addLabel(5, "§cDespawn will remove NPC and delete from registry.", 10, -75, 0.6, 0.6);
    
    guiRef.addButton(99, "Close", 235, 75, 50, 20);
    
    player.showCustomGui(guiRef);
}

function customGuiButton(event) {
    var player = event.player;
    var buttonId = event.buttonId;
    var gui = event.gui;
    
    if (buttonId === 99) {
        // Close button
        player.closeGui();
        guiRef = null;
        return;
    }
    
    if (buttonId === 20) {
        // Apply Rename
        if (!lastNpc) return;
        
        var newNameField = gui.getComponent(10);
        if (!newNameField) return;
        
        var newName = newNameField.getText();
        if (!newName || newName.length === 0) {
            player.message("§cPlease enter a name!");
            return;
        }
        
        renameReceiver(lastNpc, player, newName, lastApi);
        openAdminGui(player, lastApi, lastNpc);
        return;
    }
    
    if (buttonId === 21) {
        // Reset (Random Name)
        if (!lastNpc) return;
        resetReceiver(lastNpc, player, lastApi);
        openAdminGui(player, lastApi, lastNpc);
        return;
    }
    
    if (buttonId === 22) {
        // Despawn
        if (!lastNpc) return;
        despawnReceiver(lastNpc, player);
        player.closeGui();
        guiRef = null;
        return;
    }
}

function customGuiClosed(event) {
    guiRef = null;
}

// ===== HELPER FUNCTIONS =====

function removeFromDeliveryList(npc) {
    var npcName = npc.getDisplay().getName();
    var npcPos = npc.getPos();
    var npcX = Math.floor(npcPos.getX());
    var npcY = Math.floor(npcPos.getY());
    var npcZ = Math.floor(npcPos.getZ());
    
    var entryToRemove = npcName + " (" + npcX + " " + npcY + " " + npcZ + ")";
    
    var worldData = npc.world.getStoreddata();
    var deliveryList = [];
    
    if (worldData.has("deliveryList")) {
        try {
            deliveryList = JSON.parse(worldData.get("deliveryList"));
            if (!deliveryList || !Array.isArray(deliveryList)) {
                deliveryList = [];
            }
        } catch(ex) {
            deliveryList = [];
        }
    }
    
    // Remove the entry
    for (var i = 0; i < deliveryList.length; i++) {
        if (deliveryList[i] === entryToRemove) {
            deliveryList.splice(i, 1);
            break;
        }
    }
    
    worldData.put("deliveryList", JSON.stringify(deliveryList));
}

function renameReceiver(npc, player, newName, api) {
    // Remove old entry from delivery list
    removeFromDeliveryList(npc);
    
    // Update NPC name
    npc.getDisplay().setName(newName);
    
    // Add new entry to delivery list with new name
    var npcPos = npc.getPos();
    var npcX = Math.floor(npcPos.getX());
    var npcY = Math.floor(npcPos.getY());
    var npcZ = Math.floor(npcPos.getZ());
    
    var newEntry = newName + " (" + npcX + " " + npcY + " " + npcZ + ")";
    
    var worldData = npc.world.getStoreddata();
    var deliveryList = [];
    
    if (worldData.has("deliveryList")) {
        try {
            deliveryList = JSON.parse(worldData.get("deliveryList"));
            if (!deliveryList || !Array.isArray(deliveryList)) {
                deliveryList = [];
            }
        } catch(ex) {
            deliveryList = [];
        }
    }
    
    deliveryList.push(newEntry);
    worldData.put("deliveryList", JSON.stringify(deliveryList));
    
    player.message("§aRenamed to: §f" + newName);
}

function resetReceiver(npc, player, api) {
    // Remove old entry from delivery list first
    removeFromDeliveryList(npc);
    
    // Pick random gender (50/50)
    var isMale = Math.random() < 0.5;
    var gender = isMale ? "male" : "female";
    
    // Generate new name and skin based on random gender
    var newName, newSkin;
    
    if (isMale) {
        newName = randomFrom(maleNames);
        newSkin = randomFrom(getMaleSkins());
    } else {
        newName = randomFrom(femaleName);
        newSkin = randomFrom(getFemaleSkins());
        npc.getDisplay().setModel("customnpcs:customnpcalex");
    }
    
    // Update NPC appearance
    npc.getDisplay().setName(newName);
    npc.getDisplay().setSkinTexture(newSkin);
    
    // Add new entry to delivery list
    var npcPos = npc.getPos();
    var npcX = Math.floor(npcPos.getX());
    var npcY = Math.floor(npcPos.getY());
    var npcZ = Math.floor(npcPos.getZ());
    
    var newEntry = newName + " (" + npcX + " " + npcY + " " + npcZ + ")";
    
    var worldData = npc.world.getStoreddata();
    var deliveryList = [];
    
    if (worldData.has("deliveryList")) {
        try {
            deliveryList = JSON.parse(worldData.get("deliveryList"));
            if (!deliveryList || !Array.isArray(deliveryList)) {
                deliveryList = [];
            }
        } catch(ex) {
            deliveryList = [];
        }
    }
    
    deliveryList.push(newEntry);
    worldData.put("deliveryList", JSON.stringify(deliveryList));
    
    player.message("§aReset to: §f" + newName);
}

function despawnReceiver(npc, player) {
    // Remove from delivery list
    removeFromDeliveryList(npc);
    
    // Despawn the NPC
    npc.despawn();
    
    player.message("§aNPC despawned and removed from delivery list!");
}