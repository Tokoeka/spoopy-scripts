import {
    cliExecute,
    print,
    visitUrl,
    runChoice,
    handlingChoice,
    getCampground,
    myFullness,
    fullnessLimit,
    use,
    buy,
    itemAmount,
    haveEffect,
    getProperty,
    maximize,
    putCloset,
    outfit,
    useFamiliar,
    equip,
    myMaxhp,
    restoreHp,
    useSkill,
    runCombat,
    availableAmount,
    adv1,
    faxbot,
    myHash,
    choiceFollowsFight,
    inMultiFight,
    numericModifier,
    mallPrice,
    effectModifier,
    bjornifyFamiliar,
    getClanName,
    putStash,
    retrieveItem,
    takeStash,
    setAutoAttack,
} from "kolmafia";
import {
    Macro,
    TunnelOfLove,
    have,
    property,
    $effect,
    $familiar,
    $item,
    $items,
    $location,
    $monster,
    $skill,
    $slot,
} from "libram";
import { get, getString, set } from "libram/dist/property";
import { advMacroAA, funBuddyNames, getRandFromArray, pickBjorn, prepWandererZone } from "./lib";

const defaultMacro = Macro.skill("curse of weaksauce")
    .skill("micrometeor")
    .skill("sing along")
    .skill("extract")
    .attack()
    .repeat();

function multiFightAutoAttack() {
    while (choiceFollowsFight() || inMultiFight()) {
        visitUrl("choice.php");
    }
}

print(
    "Initializing: clan-hopping, ccs-setting, bastille-doing, deck-cheating, terminal-enhancing, briefcase-buffing"
);
visitUrl(`showclan.php?whichclan=84165&action=joinclan&confirm=on&pwd`);
cliExecute("ccs turn0");
if (get("_bastilleGames") === 0) {
    cliExecute("bastille babar brutalist lava catapult");
}
if (get("_deckCardsDrawn") === 0) {
    cliExecute("cheat island; cheat ancestral; cheat 1952");
}
while (get("_sourceTerminalEnhanceUses") < 3) {
    cliExecute("terminal enhance meat");
}
while (get("_kgbClicksUsed") >= 3) {
    cliExecute("briefcase buff meat");
}

if (availableAmount($item`packet of tall grass seeds`) > 0) {
    use(1, $item`packet of tall grass seeds`);
}

if (get("_daycareGymScavenges") === 0) {
    visitUrl("place.php?whichplace=town_wrong&action=townwrong_boxingdaycare");
    runChoice(3);
    runChoice(2);
    runChoice(5);
    runChoice(4);
}

if (get("_daycareRecruits") === 0) {
    visitUrl("place.php?whichplace=town_wrong&action=townwrong_boxingdaycare");
    runChoice(3);
    runChoice(1);
    runChoice(1);
    runChoice(5);
    runChoice(4);
}
if (!get("_daycareSpa")) {
    visitUrl("place.php?whichplace=town_wrong&action=townwrong_boxingdaycare");
    runChoice(2);
    runChoice(1);
    runChoice(4);
}

print(`Set phasers to tubsy`, `blue`);
visitUrl("main.php?action=may4");
if (handlingChoice()) {
    runChoice(4);
}

if (get("_horsery") !== "dark horse") {
    cliExecute("horsery dark");
}

if (Object.getOwnPropertyNames(getCampground()).includes("portable Mayo Clinic")) {
    if (!get("_mayoDeviceRented")) {
        buy(1, $item`Sphygmayomanometer`);
    }
    if (!get("_mayoTankSoaked")) {
        cliExecute("mayosoak");
    }
    if (myFullness() === fullnessLimit()) {
        use(1, $item`Asdon Martin keyfob`);
    }
}

const hasAsdon = Object.getOwnPropertyNames(getCampground()).includes("Asdon Martin keyfob");

const freeFightZone = prepWandererZone();

const endText = [`You should put your free fights in ` + freeFightZone.toString()];

if (haveEffect($effect`Coated in Slime`) > 0 && haveEffect($effect`Coated In Slime`) < 10) {
    print("abluting", "green");
    cliExecute("hottub");
    if (haveEffect($effect`Coated in Slime`) > 0) {
        throw `I'm too slimy and can't do anything about it!`;
    }
}

if (get("_questPartyFair") === "unstarted") {
    print(`Checking NEP quest`, `blue`);
    const questText = visitUrl("adventure.php?snarfblat=528");
    if (handlingChoice()) {
        const geraldQuest = /Gerald/;
        if (geraldQuest.test(questText)) {
            runChoice(1);
        } else {
            runChoice(2);
        }
    }
}
if (getProperty("_questPartyFairQuest") == "food") {
    print(`Gotta find Geraldine!`, "blue");
    set(`choiceAdventure1324`, 2);
    set(`choiceAdventure1326`, 3);
} else if (getProperty("_questPartyFairQuest") == "booze") {
    print(`Gotta find Gerald!`, "blue");
    set(`choiceAdventure1324`, 3);
    set(`choiceAdventure1327`, 3);
} else {
    set(`choiceAdventure1324`, 5);
}

print("Getting my free volcoino!", "blue");
if (!get<boolean>("_infernoDiscoVisited")) {
    maximize("disco style", false);
    visitUrl("place.php?whichplace=airport_hot&action=airport4_zone1");
    runChoice(7);
}

print("Checking volcano quest", "blue");
visitUrl("place.php?whichplace=airport_hot&action=airport4_questhub");
const volcanoItems = [
    property.getItem("_volcanoItem1") || $item`none`,
    property.getItem("_volcanoItem2") || $item`none`,
    property.getItem("_volcanoItem3") || $item`none`,
];
const volcanoWhatToDo: Map<Item, () => boolean> = new Map<Item, () => boolean>([
    [
        $item`new age healing crystal`,
        () => {
            if (availableAmount($item`new age healing crystal`) >= 5) return true;
            else {
                return (
                    buy(
                        5 - availableAmount($item`new age healing crystal`),
                        $item`new age healing crystal`,
                        1000
                    ) ===
                    5 - availableAmount($item`new age healing crystal`)
                );
            }
        },
    ],
    [
        $item`smooch bottlecap`,
        () => {
            if (availableAmount($item`smooch bottlecap`) > 0) return true;
            else return buy(1, $item`smooch bottlecap`, 5000) === 1;
        },
    ],
    [
        $item`gooey lava globs`,
        () => {
            if (availableAmount($item`gooey lava globs`) >= 5) {
                return true;
            } else {
                return (
                    buy(
                        5 - availableAmount($item`gooey lava globs`),
                        $item`gooey lava globs`,
                        5000
                    ) ===
                    5 - availableAmount($item`gooey lava globs`)
                );
            }
        },
    ],
    [
        $item`fused fuse`,
        () => {
            endText.push(`Use clara's bell to get a fused fuse at end of day, my dude`);
            return true;
        },
    ],
    [
        $item`smooth velvet bra`,
        () => {
            if (availableAmount($item`smooth velvet bra`) < 3) {
                cliExecute(
                    `acquire ${(
                        3 - availableAmount($item`smooth velvet bra`)
                    ).toString()} smooth velvet bra`
                );
            }
            return availableAmount($item`smooth velvet bra`) >= 3;
        },
    ],
    [
        $item`smooch bracers`,
        () => {
            if (availableAmount($item`smooch bracers`) < 3) {
                cliExecute(
                    `acquire ${(
                        3 - availableAmount($item`smooch bracers`)
                    ).toString()} smooch bracers`
                );
            }
            return availableAmount($item`smooch bracers`) >= 3;
        },
    ],
]);
for (const [volcanoItem, tryToGetIt] of volcanoWhatToDo.entries()) {
    if (volcanoItems.includes(volcanoItem)) {
        if (tryToGetIt()) {
            print(
                `Alright ${getRandFromArray(
                    funBuddyNames
                )}, you're going to do the volcano quest with a ${volcanoItem.name} or whatever`,
                "blue"
            );
            break;
        }
    }
}

visitUrl("clan_viplounge.php?action=lookingglass&whichfloor=2");

while (get("_poolGames") < 3) {
    cliExecute("pool 1");
}

if (!get("_olympicSwimmingPool")) {
    cliExecute("swim laps");
}
if (!get("_olympicSwimmingPool")) {
    cliExecute("swim item");
}

visitUrl("place.php?whichplace=campaway&action=campaway_sky");
visitUrl("place.php?whichplace=campaway&action=campaway_sky");
visitUrl("place.php?whichplace=campaway&action=campaway_sky");
visitUrl("place.php?whichplace=campaway&action=campaway_sky");

if (!get("_witchessBuff")) {
    cliExecute("witchess");
}

if (!getString("_beachHeadsUsed").includes("10")) {
    cliExecute("beach head familiar");
}

if (!get<boolean>("_clanFortuneBuffUsed")) {
    cliExecute("fortune buff susie");
}

if (!get<boolean>("concertVisited")) {
    cliExecute("concert winklered");
}

cliExecute("beachcomber.ash free");
cliExecute("detective solver.ash");
putCloset(itemAmount($item`sand dollar`), $item`sand dollar`);

if (!get<boolean>("_madTeaParty")) {
    cliExecute("hatter reinforced beaded headband");
}
if (!get<boolean>("_ballpit")) {
    cliExecute("ballpit");
}
if (!get<boolean>("_aprilShower")) {
    cliExecute("shower warm");
}
if (!get<boolean>("telescopeLookedHigh")) {
    cliExecute("telescope high");
}
if (!get<boolean>("friarsBlessingReceived")) {
    cliExecute("friars familiar");
}
cliExecute("/aa off");

use(1, $item`Bird-a-Day Calendar`);
while (get<number>("_birdsSoughtToday") < 6) {
    useSkill(1, $skill`Seek out a Bird`);
}

if (!getString("_mummeryMods").includes("Meat Drop")) {
    useFamiliar($familiar`Stocking Mimic`);
    cliExecute("mummery meat");
}

if ($familiar`pocket professor`.experience < 300) {
    if (itemAmount($item`pulled blue taffy`) < 5) {
        buy(5 - itemAmount($item`pulled blue taffy`), $item`pulled blue taffy`);
    }
    use(5, $item`pulled blue taffy`);
}

const famEquip = $item`gnomish housemaid's kgnee`;

if (itemAmount($item`handful of smithereens`) > 0) {
    cliExecute(
        "make " + itemAmount($item`handful of smithereens`).toString() + " louder than bomb"
    );
}

if (get<number>("_godLobsterFights") === 0) {
    set("choiceAdventure1310", 2);
    outfit("drops");
    useFamiliar($familiar`God Lobster`);
    equip($slot`familiar`, $item`God Lobster's Crown`);
    equip($slot`back`, $item`vampyric cloake`);
    restoreHp(myMaxhp());
    Macro.skill($skill`curse of weaksauce`)
        .skill($skill`Become a Wolf`)
        .skill($skill`extract`)
        .skill($skill`sing along`)
        .skill($skill`micrometeor`)
        .attack()
        .repeat()
        .setAutoAttack();
    visitUrl("main.php?fightgodlobster=1");
    runCombat(
        Macro.skill($skill`curse of weaksauce`)
            .skill($skill`Become a Wolf`)
            .skill($skill`extract`)
            .skill($skill`sing along`)
            .skill($skill`micrometeor`)
            .attack()
            .repeat()
            .toString()
    );
    visitUrl("choice.php");
    runChoice(-1);
}

if (!get("_photocopyUsed")) {
    faxbot($monster`witchess bishop`);
    defaultMacro.setAutoAttack();
    outfit("drops");
    restoreHp(myMaxhp());
    use(1, $item`photocopied monster`);
    runCombat(defaultMacro.toString());
    multiFightAutoAttack();
}

if (get<number>("_godLobsterFights") === 1) {
    set("choiceAdventure1310", 2);
    outfit("drops");
    useFamiliar($familiar`God Lobster`);
    equip($slot`familiar`, $item`God Lobster's Crown`);
    equip($slot`back`, $item`vampyric cloake`);
    restoreHp(myMaxhp());
    Macro.skill($skill`curse of weaksauce`)
        .skill($skill`Become a Bat`)
        .skill($skill`Feel Nostalgic`)
        .skill($skill`Feel Envy`)
        .skill($skill`extract`)
        .skill($skill`sing along`)
        .skill($skill`micrometeor`)
        .attack()
        .repeat()
        .setAutoAttack();
    visitUrl("main.php?fightgodlobster=1");
    runCombat(
        Macro.skill($skill`curse of weaksauce`)
            .skill($skill`Become a Bat`)
            .skill($skill`Feel Nostalgic`)
            .skill($skill`Feel Envy`)
            .skill($skill`extract`)
            .skill($skill`sing along`)
            .skill($skill`micrometeor`)
            .attack()
            .repeat()
            .toString()
    );
    visitUrl("choice.php");
    runChoice(-1);
}

if (get<number>("_godLobsterFights") === 2) {
    set("choiceAdventure1310", 2);
    outfit("drops");
    useFamiliar($familiar`God Lobster`);
    equip($slot`familiar`, $item`God Lobster's Crown`);
    equip($slot`back`, $item`vampyric cloake`);
    restoreHp(myMaxhp());
    Macro.skill($skill`curse of weaksauce`)
        .skill($skill`Become a Cloud of Mist`)
        .skill($skill`Feel Nostalgic`)
        .skill($skill`Feel Envy`)
        .skill($skill`extract`)
        .skill($skill`sing along`)
        .skill($skill`micrometeor`)
        .attack()
        .repeat()
        .setAutoAttack();
    visitUrl("main.php?fightgodlobster=1");
    runCombat();
    visitUrl("choice.php");
    runChoice(-1);
}
if (get<number>("_sourceTerminalDuplicateUses") === 0) {
    if (hasAsdon) {
        print(`Vroom vroom! Let's get some maps for pills!`, "blue");
        cliExecute("terminal educate duplicate");
        useFamiliar($familiar`obtuse angel`);
        outfit("drops");
        Macro.if_(
            "(monstername eldritch tentacle) || (monsterid 1965)",
            Macro.skill($skill`extract`)
                .skill($skill`sing along`)
                .attack()
                .repeat()
        )
            .if_(
                "!monstername eldritch tentacle",
                Macro.skill(`Feel Nostalgic`)
                    .skill($skill`extract`)
                    .skill($skill`sing along`)
                    .skill($skill`duplicate`)
                    .skill($skill`Asdon Martin: Missile Launcher`)
            )
            .setAutoAttack();
        useSkill(1, $skill`Map the Monsters`);
        while (get("mappingMonsters")) {
            visitUrl("adventure.php?snarfblat=266");
            if (handlingChoice()) {
                runChoice(1, "heyscriptswhatsupwinkwink=1085");
            }
            multiFightAutoAttack();
        }
        cliExecute("terminal educate digitize; terminal educate extract");
    } else {
        print(`Vroom vroom! Let's get some maps for pills!`, "blue");
        cliExecute("terminal educate duplicate");
        if (availableAmount($item`broken champagne bottle`) === 0) {
            cliExecute("fold broken champagne bottle");
        }
        maximize("item", false);
        useFamiliar($familiar`obtuse angel`);
        Macro.if_(
            "(monstername eldritch tentacle) || (monsterid 1965)",
            Macro.skill($skill`extract`)
                .skill($skill`sing along`)
                .attack()
                .repeat()
        )
            .if_(
                "!monstername eldritch tentacle",
                Macro.skill(`Feel Nostalgic`)
                    .skill($skill`extract`)
                    .skill($skill`sing along`)
                    .skill($skill`duplicate`)
                    .skill($skill`shattering punch`)
            )
            .setAutoAttack();
        useSkill(1, $skill`Map the Monsters`);
        while (get("mappingMonsters")) {
            visitUrl("adventure.php?snarfblat=266");
            if (handlingChoice()) {
                runChoice(1, "heyscriptswhatsupwinkwink=1085");
            }
            multiFightAutoAttack();
        }
        cliExecute("terminal educate digitize; terminal educate extract");
    }
}

outfit("drops");
useFamiliar($familiar`obtuse angel`);

Macro.if_("monstername LOV Enforcer", Macro.attack().repeat())
    .if_(
        "monstername LOV Engineer",
        Macro.skill($skill`stringozzi serpent`)
            .skill($skill`weapon of the pastalord`)
            .repeat()
    )
    .if_(
        "monstername LOV Equivocator",
        Macro.skill($skill`extract`)
            .skill($skill`sing along`)
            .skill($skill`Feel Pride`)
            .skill($skill`Army of Toddlers`)
            .attack()
            .repeat()
    )
    .setAutoAttack();

if (getProperty("_loveTunnelUsed") == "false") {
    TunnelOfLove.fightAll("LOV Eardigan", "Open Heart Surgery", "LOV Extraterrestrial Chocolate");
    use(1, $item`LOV Extraterrestrial Chocolate`);
    cliExecute("/cast * love song");
}

outfit("freefight stasis");
cliExecute("buttfart ragged claws");
useFamiliar($familiar`Stocking Mimic`);
equip($slot`familiar`, famEquip);
print("Brrrr, Snojo time", "blue");
pickBjorn();
advMacroAA(
    $location`The X-32-F Combat Training Snowman`,
    stasisKill,
    () => {
        return get("_snojoFreeFights") < 10;
    },
    () => {
        restoreHp(myMaxhp());
        pickBjorn();
    }
);

print("NEP time", "blue");

withStash([$item`moveable feast`], () => {
    use($item`moveable feast`);
    useFamiliar($familiar`frumious bandersnatch`);
    use($item`moveable feast`);
    useFamiliar($familiar`stocking mimic`);
});

equip($slot`familiar`, famEquip);
advMacroAA(
    $location`the neverending party`,
    stasisKill,
    () => {
        return get("_neverendingPartyFreeTurns") < 10;
    },
    () => {
        multiFightAutoAttack();
        restoreHp(myMaxhp());
        pickBjorn();
        if (get("choiceAdventure1324") !== 5 && get("_questPartyFair") !== "started") {
            set("choiceAdventure1324", 5);
            print("I found Gerald and/or Geraldine!", "blue");
            const partyFairInfo = get("_questPartyFairProgress").split(" ");
            const partyFairItem = $item`${partyFairInfo[1]}`;
            endText.push(`Gerald/ine wants ${partyFairInfo[0]} ${partyFairItem.plural} please.`);
        }
    }
);

equip($slot`shirt`, $item`Stephen's Lab Coat`);

if (get("_brickoFights") < 10) {
    if (availableAmount($item`BRICKO Ooze`) < 10 - get("_brickoFights")) {
        cliExecute(
            "acquire " +
                (10 - get("_brickoFights") - availableAmount($item`BRICKO Ooze`)).toString() +
                " bricko Ooze"
        );
    }
    while (get("_brickoFights") < 10) {
        pickBjorn();
        use(1, $item`BRICKO ooze`);
        multiFightAutoAttack();
    }
}

print("Tentacle", "blue");
if (!get<boolean>("_eldritchHorrorEvoked")) {
    pickBjorn();
    useSkill($skill`Evoke Eldritch Horror`);
    useSkill($skill`Tongue of the Walrus`);
    restoreHp(myMaxhp());
}
if (!get<boolean>("_eldritchTentacleFought")) {
    pickBjorn();
    visitUrl("place.php?whichplace=forestvillage&action=fv_scientist");
    runChoice(1);
    restoreHp(myMaxhp());
}

bjornifyFamiliar($familiar`pair of ragged claws`);
if (get("_backUpUses") < 11) {
    equip($slot`acc2`, $item`backup camera`);
    Macro.if_(
        "(monsterid 1974) && (hasskill back-up to your last enemy)",
        Macro.skill($skill`back-up to your last enemy`)
    )
        .skill($skill`curse of weaksauce`)
        .skill($skill`micrometeor`)
        .skill($skill`sing along`)
        .skill($skill`extract`)
        .skill($skill`shell up`)
        .skill($skill`shadow noodles`)
        .skill($skill`summon love gnats`)
        .item($item`hoa citation pad`, $item`time-spinner`)
        .item($item`nasty-smelling moss`, $item`mayor ghost's scissors`)
        .item($item`little red book`, $item`great wolf's lice`)
        .skill($skill`silent treatment`)
        .attack()
        .repeat()
        .setAutoAttack();
    visitUrl("campground.php?action=witchess");
    runChoice(1);
    visitUrl(
        "choice.php?option=1&whichchoice=1182&piece=" +
            $monster`witchess rook`.id.toString() +
            "&pwd=" +
            myHash(),
        false
    );
    multiFightAutoAttack();
    restoreHp(myMaxhp());
    stasisKill.setAutoAttack();
    outfit("freefight stasis");
}

while (get("_witchessFights") < 4) {
    pickBjorn();
    visitUrl("campground.php?action=witchess");
    runChoice(1);
    visitUrl(
        "choice.php?option=1&whichchoice=1182&piece=" +
            $monster`witchess rook`.id.toString() +
            "&pwd=" +
            myHash(),
        false
    );
    multiFightAutoAttack();
    restoreHp(myMaxhp());
}

while (get<number>("_lynyrdSnareUses") < 3) {
    pickBjorn();
    use(1, $item`Lynyrd Snare`);
    multiFightAutoAttack();
    restoreHp(myMaxhp());
}

useFamiliar($familiar`machine elf`);
outfit("drops");
pickBjorn();
advMacroAA(
    $location`the deep machine tunnels`,
    Macro.skill($skill`curse of weaksauce`)
        .skill($skill`extract`)
        .skill($skill`sing along`)
        .attack()
        .repeat(),
    () => {
        return get<number>("_machineTunnelsAdv") < 5 && get("encountersUntilDMTChoice") > 0;
    },
    () => {
        multiFightAutoAttack();
        restoreHp(myMaxhp());
        pickBjorn();
    }
);

outfit("freefight stasis");

if (get<number>("_pocketProfessorLectures") === 0) {
    useFamiliar($familiar`Pocket Professor`);
    equip($slot`acc3`, $item`Brutal Brogues`);
    equip($slot`acc2`, $item`Belt of Loathing`);
    bjornifyFamiliar($familiar`pair of ragged claws`);
    setAutoAttack(0);
    if (itemAmount($item`magical sausage casing`) < 30) {
        equip($slot`off-hand`, $item`Kramco Sausage-o-Matic™`);
        restoreHp(myMaxhp());
        adv1(freeFightZone, -1, () => {
            return "";
        });
        useFamiliar($familiar`stocking mimic`);
        outfit("freefight stasis");
        pickBjorn();
        stasisKill.setAutoAttack();
        visitUrl("place.php?whichplace=chateau&action=chateau_painting");
        runCombat();
    } else {
        visitUrl("place.php?whichplace=chateau&action=chateau_painting");
        runCombat();
        outfit("freefight stasis");
        pickBjorn();
        useFamiliar($familiar`stocking mimic`);
        equip($slot`off-hand`, $item`Kramco Sausage-o-Matic™`);
        stasisKill.setAutoAttack();
        restoreHp(myMaxhp());
        adv1(freeFightZone, -1, () => {
            return "";
        });
    }
}

outfit("freefight stasis");
useFamiliar($familiar`stocking mimic`);
equip($slot`familiar`, famEquip);

if (itemAmount($item`Bowl of Scorpions`) < 30) {
    buy(30 - itemAmount($item`Bowl of Scorpion`), $item`Bowl of Scorpion`);
}
set("choiceAdventure1387", 2);

Macro.if_("monstername drunk pygmy", Macro.skill($skill`extract`))
    .if_("monstername pygmy orderlies", Macro.skill($skill`snokebomb`))
    .if_(
        "(monstername eldritch tentacle) || (monsterid 1965)",
        Macro.skill($skill`curse of weaksauce`)
            .skill($skill`micrometeor`)
            .skill($skill`sing along`)
            .skill($skill`extract`)
            .skill($skill`love gnats`)
            .skill($skill`shell up`)
            .item([$item`time-spinner`, $item`hoa citation pad`])
            .item([$item`great wolf's lice`, $item`little red book`])
            .item([$item`mayor ghost's scissors`, $item`nasty-smelling moss`])
            .skill($skill`silent treatment`)
            .attack()
            .repeat()
    )
    .setAutoAttack();

advMacroAA(
    $location`hidden bowling alley`,
    Macro.if_("monstername drunk pygmy", Macro.skill($skill`extract`))
        .if_("monstername pygmy orderlies", Macro.skill($skill`snokebomb`))
        .if_(
            "(monstername eldritch tentacle) || (monsterid 1965)",
            Macro.skill($skill`curse of weaksauce`)
                .skill($skill`micrometeor`)
                .skill($skill`sing along`)
                .skill($skill`extract`)
                .skill($skill`love gnats`)
                .skill($skill`shell up`)
                .item([$item`time-spinner`, $item`hoa citation pad`])
                .item([$item`great wolf's lice`, $item`little red book`])
                .item([$item`mayor ghost's scissors`, $item`nasty-smelling moss`])
                .skill($skill`silent treatment`)
                .attack()
                .repeat()
        ),
    () => {
        return get("_drunkPygmyBanishes") < 10;
    },
    () => {
        multiFightAutoAttack();
        restoreHp(myMaxhp());
        pickBjorn();
    }
);
if (get("_drunkPygmyBanishes") === 10) {
    equip($slot`familiar`, $item`miniature crystal ball`);
    restoreHp(myMaxhp());
    pickBjorn();
    adv1($location`Hidden Bowling Alley`, -1, () => {
        return "";
    });
    multiFightAutoAttack();

    set("choiceAdventure1387", 2);
    Macro.if_("monstername drunk pygmy", Macro.skill($skill`use the force`))
        .if_(
            "(monstername eldritch tentacle) || (monsterid 1965)",
            Macro.skill($skill`curse of weaksauce`)
                .skill($skill`micrometeor`)
                .skill($skill`sing along`)
                .skill($skill`extract`)
                .skill($skill`love gnats`)
                .skill($skill`shell up`)
                .item([$item`time-spinner`, $item`hoa citation pad`])
                .item([$item`great wolf's lice`, $item`little red book`])
                .item([$item`mayor ghost's scissors`, $item`nasty-smelling moss`])
                .skill($skill`silent treatment`)
                .attack()
                .repeat()
        )
        .setAutoAttack();
    do {
        pickBjorn();
        restoreHp(myMaxhp());
        adv1($location`Hidden Bowling Alley`, -1, () => {
            return "";
        });
        multiFightAutoAttack();
    } while (
        get("lastEncounter") === "Armchair Quarterback" ||
        get("lastEncounter") === "Close, but Yes Cigar"
    );

    equip($slot`familiar`, famEquip);
}

set("choiceAdventure1387", 2);

restoreHp(myMaxhp());
pickBjorn();
while (get(`_saberForceUses`) < 5 || get(`_saberForceMonsterCount`) > 0) {
    advMacroAA(
        $location`hidden bowling alley`,
        Macro.if_(
            "(monstername eldritch tentacle) || (monsterid 1965)",
            Macro.skill($skill`curse of weaksauce`)
                .skill($skill`micrometeor`)
                .skill($skill`sing along`)
                .skill($skill`extract`)
                .skill($skill`love gnats`)
                .skill($skill`shell up`)
                .item([$item`time-spinner`, $item`hoa citation pad`])
                .item([$item`great wolf's lice`, $item`little red book`])
                .item([$item`mayor ghost's scissors`, $item`nasty-smelling moss`])
                .skill($skill`silent treatment`)
                .attack()
                .repeat()
        )
            .if_("monstername pygmy orderlies", Macro.skill($skill`snokebomb`))
            .externalIf(
                get(`_saberForceMonsterCount`) === 1 && get(`_saberForceUses`) < 5,
                Macro.if_("monstername drunk pygmy", Macro.skill($skill`use the force`))
            )
            .if_("monstername drunk pygmy", Macro.skill($skill`extract`)),
        1,
        () => {
            multiFightAutoAttack();
            restoreHp(myMaxhp());
            pickBjorn();
        }
    );
}

Macro.if_("monstername drunk pygmy", Macro.skill($skill`extract`))
    .step(stasisKill)
    .setAutoAttack();

while (get("_timeSpinnerMinutesUsed") <= 7) {
    pickBjorn();
    visitUrl("inv_use.php?whichitem=9104");
    runChoice(1);
    visitUrl("choice.php?whichchoice=1196&monid=1431&option=1");
    multiFightAutoAttack();
}

Macro.if_(
    "!monstername eldritch tentacle",
    Macro.skill($skill`curse of weaksauce`)
        .skill($skill`digitize`)
        .skill($skill`fire a badly romantic arrow`)
)
    .skill($skill`sing along`)
    .skill($skill`extract`)
    .attack()
    .repeat()
    .setAutoAttack();

const digitizeMonster =
    itemAmount($item`greek fire`) < 69 ? $monster`witchess rook` : $monster`witchess bishop`;

useFamiliar($familiar`obtuse angel`);
outfit("drops");
equip($slot`familiar`, $item`quake of arrows`);
if (get("_witchessFights") < 5) {
    restoreHp(myMaxhp());
    pickBjorn();
    visitUrl("campground.php?action=witchess");
    runChoice(1);
    visitUrl(
        "choice.php?option=1&whichchoice=1182&piece=" +
            digitizeMonster.id.toString() +
            "&pwd=" +
            myHash(),
        false
    );
    multiFightAutoAttack();
}
cliExecute("/aa off");
endText.forEach((element) => {
    print(element, "blue");
});
