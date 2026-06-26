var NpcFOV = 100;
var TeleportDestination = [2380, 43, 955];

// Track which player is being chased (entity)
var chasingTarget = null;

// Track sugar state per player UUID
var playerSugar = {}; // uuid -> true/undefined

// Keep track so we don't scan a player more than once per detection
var scannedPlayers = {}; // uuid -> true

var isPolice = 1;

function init(e) {
    var npc = e.npc;
    var display = npc.getDisplay();

    // --- Citizen faction ---
    npc.setFaction(17);
    npc.getAi().setAvoidsWater(true);

    if (Math.random() < 0.09) {
        display.setSkinTexture("cyberpunkskins:textures/lcpd.png");
        display.setName("LCPD");
        npc.getAi().setRetaliateType(0);
        npc.getStats().setMaxHealth(100);

        var gun = npc.world.createItem("tacz:modern_kinetic_gun", 1);
        gun.getNbt().putString("GunId", "cyber_armorer:ajax");
        npc.setMainhandItem(gun);
        npc.getInventory().setProjectile(npc.world.createItem("minecraft:gold_nugget", 1));

        npc.getStats().getRanged().setStrength(2);
        npc.getStats().getRanged().setAccuracy(80);
        npc.getStats().getRanged().setRange(100);
        npc.getStats().getRanged().setDelay(1, 1);
        npc.getStats().getRanged().setBurstDelay(1);
        npc.getStats().getRanged().setHasGravity(false);
        npc.getStats().getRanged().setSpeed(40);
        npc.getStats().setAggroRange(100);
        npc.getStats().getRanged().setSound(0, "customnpcs:gun.pistol.shot");
        npc.getStats().getRanged().setSound(1, "");
        npc.getStats().getRanged().setSound(2, "tacz:target_block_hit");
        npc.getStats().getRanged().setMeleeRange(4);
        isPolice = 1;
        return;
    }

    // Male or female (50/50)
    var isMale = Math.random() < 0.5;

    if (isMale) {
        var maleSkins = [];
        for (var i = 1; i <= 34; i++) {
            var num = (i < 10 ? "0" + i : i);
            maleSkins.push("cyberpunkskins:textures/b/b" + num + ".png");
        }

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
        npc.getAi().setRetaliateType(1);
        npc.getAi().setDoorInteract(2);
        npc.setMainhandItem(null);
        npc.getStats().setMaxHealth(20);
        display.setSkinTexture(randomFrom(maleSkins));
        display.setName(randomFrom(maleNames));
        isPolice = 0;
    } else {
        var femaleSkins = [];
        for (var i = 1; i <= 34; i++) {
            var num = (i < 10 ? "0" + i : i);
            femaleSkins.push("cyberpunkskins:textures/g/g" + num + ".png");
        }

        var femaleNames = [
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
        npc.getAi().setRetaliateType(1);
        npc.getAi().setDoorInteract(2);
        npc.getStats().setMaxHealth(20);
        display.setModel("customnpcs:customnpcalex");
        display.setSkinTexture(randomFrom(femaleSkins));
        display.setName(randomFrom(femaleNames));
        npc.setMainhandItem(null);
        isPolice = 0;
    }
}

function tick(e) {
    if (isPolice == 1) {
        var npc = e.npc;

        if (chasingTarget == null) {

            npc.getStats().setCombatRegen(0);
            npc.getStats().setMaxHealth(100);
            var ents = npc.world.getNearbyEntities(npc.getPos(), 30, 1); // 1 = players
            for (var i = 0; i < ents.length; i++) {
                var player = ents[i];
                if (CheckFOV(npc, player, NpcFOV) && npc.canSeeEntity(player)) {
                    var uuid = player.getUUID();
                    if (!scannedPlayers[uuid]) {
                        // mark scanned so we don't rescan immediately
                        scannedPlayers[uuid] = true;

                        var sugarItem = npc.world.createItem("minecraft:sugar", 1);
                        var sugarCount = player.getInventory().count(sugarItem, true, true);

                        if (sugarCount > 0) {
                            player.message("§e[Scanner] Police detected sugar on you!");
                            playerSugar[uuid] = true; // per-player sugar flag
                            chasingTarget = player;
                            npc.getAi().setWalkingSpeed(3);
                            npc.getStats().setCombatRegen(300);
                             npc.getStats().setMaxHealth(300);
                        } else {
                            // if no sugar, allow future re-scan by removing the scanned mark
                            delete scannedPlayers[uuid];
                        }
                    }
                }
            }
        } else {
            // Already have a chasing target
            if (!chasingTarget.isAlive()) {
                resetChase(npc, chasingTarget);
                return;
            }

            var pos = chasingTarget.getPos();
            npc.navigateTo(pos.getX(), pos.getY(), pos.getZ(), 10);

            var dist = npc.getPos().distanceTo(pos);

            if (dist > 30) {
                npc.say("Lost sight of " + chasingTarget.getName() + "...");
                npc.getStats().setCombatRegen(0);
                resetChase(npc, chasingTarget);
                return;
            }

            if (dist < 2) {
                // turn aggressive now
                npc.setAttackTarget(chasingTarget);
            }
        }
    }
}

function meleeAttack(e) {
    var target = e.target;
    var npc = e.npc;

    // Only handle players and only if that player had sugar flagged
    if (target.getType() == 1) {
        var uuid = target.getUUID();
        if (playerSugar[uuid]) {
            target.setPosition(TeleportDestination[0], TeleportDestination[1], TeleportDestination[2]);
            npc.executeCommand('kill @e[type=minecraft:item,nbt={Item:{id:"minecraft:sugar"}}]');
            var inv = target.getInventory();
            var size = inv.getSize();
            for (var slot = 0; slot < size; slot++) {
                var item = inv.getSlot(slot);
                if (item != null && item.getName() == "minecraft:sugar") {
                    inv.setSlot(slot, null);
                }
            }
            target.message("§cYou've been locked up");

            // Clear player-specific state and reset NPC chase
            resetChase(npc, target);
        }
    }
}

function resetChase(npc, player) {
    npc.getAi().setWalkingSpeed(5);
    if (player) {
        var uuid = player.getUUID();
        // remove scanned and sugar flags so the player can be detected again next time
        delete scannedPlayers[uuid];
        delete playerSugar[uuid];
    }
    chasingTarget = null;
}

function CheckFOV(seer, seen, FOV) {
    var P = seer.getRotation();
    if (P < 0) P = P + 360;
    var rot = Math.abs(GetPlayerRotation(seer, seen) - P);
    if (rot > 180) rot = Math.abs(rot - 360);
    return (rot < FOV / 2);
}

function GetPlayerRotation(npc, player) {
    var dx = npc.getX() - player.getX();
    var dz = player.getZ() - npc.getZ();
    var angle;
    if (dz >= 0) {
        angle = (Math.atan(dx / dz) * 180 / Math.PI);
        if (angle < 0) angle = 360 + angle;
    } else {
        dz = -dz;
        angle = 180 - (Math.atan(dx / dz) * 180 / Math.PI);
    }
    return angle;
}

function died(e) {
    var npc = e.npc;
    // Only trigger for police NPCs
    if (isPolice != 1) return;

    var killer = e.source; // the entity that killed this npc
    if (killer == null) return;

    // Only react to player kills
    if (killer.getType() != 1) return; // 1 = IPlayer

    var killerName = killer.getName();
    var pos = npc.getPos();

    // Store killer name in world tempdata for MaxtacAV to read
    var tempData = npc.getWorld().getTempdata();
    tempData.put("maxtacav_killer", JSON.stringify(killerName));

    // Spawn MaxtacAV 20 blocks above where the police died
    var spawnX = Math.floor(pos.getX());
    var spawnY = Math.floor(pos.getY()) + 20;
    var spawnZ = Math.floor(pos.getZ());
    npc.getWorld().spawnClone(spawnX, spawnY, spawnZ, 3, "MaxtacAV");
}

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
