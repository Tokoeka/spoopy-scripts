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
    haveSkill,
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
import {
    advMacroAA,
    funBuddyNames,
    getRandFromArray,
    pickBjorn,
    prepWandererZone,
    withStash,
} from "./lib";

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

export function freeFights() {
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
    }

    if (haveEffect($effect`Coated in Slime`) > 0 && haveEffect($effect`Coated In Slime`) < 10) {
        print("abluting", "green");
        cliExecute("hottub");
        if (haveEffect($effect`Coated in Slime`) > 0) {
            throw `I'm too slimy and can't do anything about it!`;
        }
    }

    if (get("_questPartyFair") === "unstarted") {
        print(`Rejecting NEP quest`, `blue`);
        visitUrl("adventure.php?snarfblat=528");
        runChoice(2);
    }

    set(`choiceAdventure1324`, 5);

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
                    )}, you're going to do the volcano quest with a ${
                        volcanoItem.name
                    } or whatever`,
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

    if (!get("_clanFortuneBuffUsed")) {
        cliExecute("fortune buff susie");
    }

    if (!get("concertVisited")) {
        cliExecute("concert winklered");
    }

    cliExecute("beachcomber.ash free");
    cliExecute("detective solver.ash");
    putCloset(itemAmount($item`sand dollar`), $item`sand dollar`);

    if (!get("_madTeaParty")) {
        cliExecute("hatter reinforced beaded headband");
    }
    if (!get("_ballpit")) {
        cliExecute("ballpit");
    }
    if (!get("_aprilShower")) {
        cliExecute("shower warm");
    }
    if (!get("telescopeLookedHigh")) {
        cliExecute("telescope high");
    }
    if (!get("friarsBlessingReceived")) {
        cliExecute("friars familiar");
    }
    cliExecute("/aa off");

    use(1, $item`Bird-a-Day Calendar`);
    while (get("_birdsSoughtToday") < 6) {
        useSkill(1, $skill`Seek out a Bird`);
    }

    if (!getString("_mummeryMods").includes("Meat Drop")) {
        useFamiliar($familiar`Reagnimated Gnome`);
        cliExecute("mummery meat");
    }

    if ($familiar`pocket professor`.experience < 300) {
        if (itemAmount($item`pulled blue taffy`) < 5) {
            buy(5 - itemAmount($item`pulled blue taffy`), $item`pulled blue taffy`);
        }
        use(5, $item`pulled blue taffy`);
    }

    const famEquip = $item`gnomish housemaid's kgnee`;

    useFamiliar($familiar`Reagnimated Gnome`);
    if (!get("_photocopyUsed")) {
        faxbot($monster`witchess bishop`);
        defaultMacro.setAutoAttack();
        outfit("freefight stasis");
        restoreHp(myMaxhp());
        use(1, $item`photocopied monster`);
        runCombat(defaultMacro.toString());
        multiFightAutoAttack();
    }

    if (get("_godLobsterFights") === 0) {
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

    outfit("freefight stasis");
    useFamiliar($familiar`reagnimated gnome`);

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
        TunnelOfLove.fightAll(
            "LOV Eardigan",
            "Open Heart Surgery",
            "LOV Extraterrestrial Chocolate"
        );
        use(1, $item`LOV Extraterrestrial Chocolate`);
        cliExecute("/cast * love song");
    }

    outfit("freefight stasis");
    equip($slot`familiar`, famEquip);
    print("Brrrr, Snojo time", "blue");
    pickBjorn();
    advMacroAA(
        $location`The X-32-F Combat Training Snowman`,
        defaultMacro,
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
        useFamiliar($familiar`pocket professor`);
        use($item`moveable feast`);
        useFamiliar($familiar`reagnimated gnome`);
    });

    advMacroAA(
        $location`the neverending party`,
        defaultMacro,
        () => {
            return get("_neverendingPartyFreeTurns") < 10;
        },
        () => {
            multiFightAutoAttack();
            restoreHp(myMaxhp());
            pickBjorn();
        }
    );

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
    if (!get("_eldritchHorrorEvoked")) {
        pickBjorn();
        useSkill($skill`Evoke Eldritch Horror`);
        useSkill($skill`Tongue of the Walrus`);
        restoreHp(myMaxhp());
    }
    if (!get("_eldritchTentacleFought")) {
        pickBjorn();
        visitUrl("place.php?whichplace=forestvillage&action=fv_scientist");
        runChoice(1);
        restoreHp(myMaxhp());
    }

    if (get("_backUpUses") < 11) {
        equip($slot`acc2`, $item`backup camera`);
        if (have($effect`eldritch attunement`)) {
            Macro.if_(
                "(monsterid 1974) && (hasskill back-up to your last enemy)",
                Macro.skill($skill`back-up to your last enemy`)
            )
                .step(defaultMacro)
                .setAutoAttack();
            visitUrl("campground.php?action=witchess");
            runChoice(1);
            visitUrl(
                "choice.php?option=1&whichchoice=1182&piece=" +
                    $monster`witchess bishop`.id.toString() +
                    "&pwd=" +
                    myHash(),
                false
            );
            multiFightAutoAttack();
        } else {
        }
        restoreHp(myMaxhp());
        defaultMacro.setAutoAttack();
        outfit("freefight stasis");
        visitUrl("campground.php?action=witchess");
        runChoice(1);
        visitUrl(
            "choice.php?option=1&whichchoice=1182&piece=" +
                $monster`witchess bishop`.id.toString() +
                "&pwd=" +
                myHash(),
            false
        );
        const backUpZone =
            prepWandererZone().combatPercent === 100 ? prepWandererZone() : $location`noob cave`;
        advMacroAA(
            backUpZone,
            Macro.skill($skill`Back-Up to your Last Enemy`).step(defaultMacro),
            () => get("_backUpUses") < 11,
            pickBjorn
        );
    }
    while (get("_witchessFights") < 4) {
        pickBjorn();
        visitUrl("campground.php?action=witchess");
        runChoice(1);
        visitUrl(
            "choice.php?option=1&whichchoice=1182&piece=" +
                $monster`witchess bishop`.id.toString() +
                "&pwd=" +
                myHash(),
            false
        );
        multiFightAutoAttack();
        restoreHp(myMaxhp());
    }

    while (get("_lynyrdSnareUses") < 3) {
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
        equip($slot`off-hand`, $item`Kramco Sausage-o-Matic™`);
        restoreHp(myMaxhp());
        const profMacro = Macro.skill($skill`curse of weaksauce`)
            .externalIf(
                !haveSkill($skill`Lecture on Relativity`) && get("_meteorShowerUses") === 0,
                Macro.skill($skill`meteor shower`)
            )
            .skill($skill`extract`)
            .skill($skill`sing along`)
            .if_("(!hasskill 7319) && (hasskill 7316)", Macro.skill($skill`Deliver Your Thesis`))
            .if_("hasskill 7319", Macro.skill($skill`Lecture on Relativity`))
            .attack()
            .repeat();
        adv1(prepWandererZone(), -1, () => {
            return profMacro.toString();
        });
        while (inMultiFight()) runCombat(profMacro.toString());

        useFamiliar($familiar`reagnimated gnome`);
        outfit("freefight stasis");
        pickBjorn();
    }

    if (!get("_chateauMonsterFought") && get("chateauMonster")?.attributes.includes("FREE")) {
        defaultMacro.setAutoAttack();
        visitUrl("place.php?whichplace=chateau&action=chateau_painting");
        runCombat(defaultMacro.toString());
    }

    outfit("freefight stasis");
    useFamiliar($familiar`reagnimated gnome`);
    equip($slot`familiar`, famEquip);

    if (itemAmount($item`Bowl of Scorpions`) < 30) {
        buy(30 - itemAmount($item`Bowl of Scorpion`), $item`Bowl of Scorpion`);
    }
    set("choiceAdventure1387", 2);

    Macro.if_("monstername drunk pygmy", Macro.skill($skill`extract`))
        .if_("monstername pygmy orderlies", Macro.skill($skill`snokebomb`))
        .if_("(monstername eldritch tentacle) || (monsterid 1965)", defaultMacro)
        .setAutoAttack();

    advMacroAA(
        $location`hidden bowling alley`,
        Macro.if_("monstername drunk pygmy", Macro.skill($skill`extract`))
            .if_("monstername pygmy orderlies", Macro.skill($skill`snokebomb`))
            .if_("(monstername eldritch tentacle) || (monsterid 1965)", defaultMacro),
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
            .if_("(monstername eldritch tentacle) || (monsterid 1965)", defaultMacro)
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
            Macro.if_("(monstername eldritch tentacle) || (monsterid 1965)", defaultMacro)
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
        .step(defaultMacro)
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

    const digitizeMonster = $monster`witchess bishop`;

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

    useFamiliar($familiar`reagnimated gnome`);
    outfit("freefight stasis");
    advMacroAA(
        $location`the red zeppelin`,
        Macro.if_(
            `!monsterid ${$monster`time-spinner prank`.id}`,
            Macro.item($item`glark cable`)
        ).step(defaultMacro),
        () => {
            return get("_glarkCableUses") < 5;
        },
        pickBjorn
    );
}
