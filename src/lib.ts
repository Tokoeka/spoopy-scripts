import { canAdv } from "canadv.ash";
import {
    use,
    haveEffect,
    availableAmount,
    buy,
    cliExecute,
    itemAmount,
    print,
    visitUrl,
    runChoice,
    mallPrice,
    myFamiliar,
    equip,
    bjornifyFamiliar,
    setAutoAttack,
    adv1,
} from "kolmafia";
import { get, set, $item, $location, $items, have, $effect, $familiar, $slot, Macro } from "libram";

interface zonePotion {
    zone: String;
    effect: Effect;
    potion: Item;
}

const zonePotions = [
    {
        zone: "Spaaace",
        effect: $effect`Transpondent`,
        potion: $item`transporter transponder`,
    },
    {
        zone: "Wormwood",
        effect: $effect`absinthe-minded`,
        potion: $item`tiny bottle of absinthe`,
    },
];

export function prepWandererZone() {
    if (get("questGuzzlr") === "unstarted") {
        if (
            get("_guzzlrPlatinumDeliveries") === 0 &&
            get("guzzlrGoldDeliveries") >= 5 &&
            (get("guzzlrPlatinumDeliveries") < 30 ||
                (get("guzzlrGoldDeliveries") >= 150 && get("guzzlrBronzeDeliveries") >= 196))
        ) {
            set("choiceAdventure1412", 4);
            use(1, $item`guzzlr tablet`);
        } else if (
            get("_guzzlrGoldDeliveries") < 3 &&
            get("guzzlrBronzeDeliveries") >= 5 &&
            (get("guzzlrGoldDeliveries") < 150 || get("guzzlrBronzeDeliveries") >= 196)
        ) {
            set("choiceAdventure1412", 3);
            use(1, $item`guzzlr tablet`);
        } else {
            set("choiceAdventure1412", 2);
            use(1, $item`guzzlr tablet`);
        }
    }

    if (get("questGuzzlr") !== "unstarted") {
        if (!guzzlrCheck() && !get("_guzzlrQuestAbandoned")) {
            dropGuzzlrQuest();
        }
    }

    if (get("questGuzzlr") === "unstarted") {
        if (
            get("_guzzlrPlatinumDeliveries") === 0 &&
            get("guzzlrGoldDeliveries") >= 5 &&
            (get("guzzlrPlatinumDeliveries") < 30 ||
                (get("guzzlrGoldDeliveries") >= 150 && get("guzzlrBronzeDeliveries") >= 196))
        ) {
            set("choiceAdventure1412", 4);
            use(1, $item`guzzlr tablet`);
        } else if (
            get("_guzzlrGoldDeliveries") < 3 &&
            get("guzzlrBronzeDeliveries") >= 5 &&
            (get("guzzlrGoldDeliveries") < 150 || get("guzzlrBronzeDeliveries") >= 196)
        ) {
            set("choiceAdventure1412", 3);
            use(1, $item`guzzlr tablet`);
        } else {
            set("choiceAdventure1412", 2);
            use(1, $item`guzzlr tablet`);
        }
    }

    let freeFightZone = $location`the deep dark jungle`;
    if (guzzlrCheck()) {
        freeFightZone = get("guzzlrQuestLocation") || $location`the deep dark jungle`;
        if (get("guzzlrQuestTier") === "platinum") {
            zonePotions.forEach((place) => {
                if (freeFightZone.zone === place.zone && haveEffect(place.effect) === 0) {
                    if (availableAmount(place.potion) === 0) {
                        buy(1, place.potion, 10000);
                    }
                    use(1, place.potion);
                }
            });
        }
    }
    if (freeFightZone === get("guzzlrQuestLocation")) {
        if (get<string>("guzzlrQuestBooze") === "Guzzlr cocktail set") {
            if (
                !$items`buttery boy, steamboat, ghiaccio colada, nog-on-the-cob, sourfinger`.some(
                    (drink) => have(drink)
                )
            ) {
                cliExecute("make buttery boy");
            }
        } else {
            let guzzlrBooze = get<Item>("guzzlrQuestBooze");
            if (!guzzlrBooze) {
                freeFightZone = $location`The Deep Dark Jungle`;
            } else if (itemAmount(guzzlrBooze) === 0) {
                print(`just picking up some booze before we roll`, "blue");
                cliExecute("acquire " + get("guzzlrQuestBooze"));
            }
        }
    }
    return freeFightZone;
}

function guzzlrCheck() {
    const guzzlZone = get("guzzlrQuestLocation") || $location`the deep dark jungle`;
    const forbiddenZones = ["Dinseylandfill", "The Rabbit Hole", "Spring Break Beach"];
    zonePotions.forEach((place) => {
        if (guzzlZone.zone === place.zone && haveEffect(place.effect) === 0) {
            if (availableAmount(place.potion) === 0) {
                buy(1, place.potion, 10000);
            }
            use(1, place.potion);
        }
    });
    if (
        forbiddenZones.includes(guzzlZone.zone) ||
        !guzzlZone.wanderers ||
        guzzlZone === $location`The Oasis` ||
        guzzlZone === $location`The Bubblin' Caldera` ||
        guzzlZone.environment === "underwater" ||
        (guzzlZone === $location`Barrrney's Barrr` && !have($item`pirate fledges`)) ||
        guzzlZone.zone === "BatHole" ||
        !canAdv(guzzlZone, false)
    ) {
        return false;
    } else {
        return true;
    }
}

function dropGuzzlrQuest() {
    print("We hate this guzzlr quest!", "blue");
    set("choiceAdventure1412", "");
    visitUrl("inventory.php?tap=guzzlr", false);
    runChoice(1);
    runChoice(5);
}

interface famPick {
    familiar: Familiar;
    meatVal: number;
    probability: () => number;
}

const bjornFams = [
    {
        familiar: $familiar`puck man`,
        meatVal: mallPrice($item`yellow pixel`),
        probability: () => (get("_yellowPixelDropsCrown") < 25 ? 0.25 : 0),
    },
    {
        familiar: $familiar`grimstone golem`,
        meatVal: mallPrice($item`grimstone mask`),
        probability: () => (get("_grimstoneMaskDropsCrown") === 0 ? 0.5 : 0),
    },
    { familiar: $familiar`Knob Goblin Organ Grinder`, meatVal: 30, probability: () => 1 },
    {
        familiar: $familiar`garbage fire`,
        meatVal: mallPrice($item`burning newspaper`),
        probability: () => (get("_garbageFireDropsCrown") < 3 ? 0.5 : 0),
    },
    {
        familiar: $familiar`machine elf`,
        meatVal:
            (1 / 6) *
            (mallPrice($item`abstraction: sensation`) +
                mallPrice($item`abstraction: thought`) +
                mallPrice($item`abstraction: action`) +
                mallPrice($item`abstraction: category`) +
                mallPrice($item`abstraction: perception`) +
                mallPrice($item`abstraction: purpose`)),
        probability: () => (get("_abstractionDropsCrown") < 25 ? 0.2 : 0),
    },
    {
        familiar: $familiar`trick-or-treating tot`,
        meatVal: mallPrice($item`hoarded candy wad`),
        probability: () => (get("_hoardedCandyDropsCrown") < 3 ? 0.5 : 0),
    },
    {
        familiar: $familiar`warbear drone`,
        meatVal: mallPrice($item`warbear whosit`),
        probability: () => 1 / 4.5,
    },
    {
        familiar: $familiar`li'l xenomorph`,
        meatVal: mallPrice($item`lunar isotope`),
        probability: () => 0.05,
    },
    {
        familiar: $familiar`pottery barn owl`,
        meatVal: mallPrice($item`volcanic ash`),
        probability: () => 0.1,
    },
];

function testBjornFamiliar(fam: famPick) {
    return myFamiliar() === fam.familiar ? 0 : fam.meatVal * fam.probability();
}

export function pickBjorn() {
    let familiarChoice = $familiar`pair of ragged claws`;
    let meatExpected =
        haveEffect($effect`shortly stacked`) +
            haveEffect($effect`shortly buttered`) +
            haveEffect($effect`shortly hydrated`) ===
        0
            ? 11.67 * 5
            : 13.2 * 5;
    bjornFams.forEach((fam) => {
        if (testBjornFamiliar(fam) > meatExpected) {
            familiarChoice = fam.familiar;
            meatExpected = testBjornFamiliar(fam);
        }
    });
    equip($slot`back`, $item`buddy bjorn`);
    bjornifyFamiliar(familiarChoice);
}

export function advMacroAA(
    location: Location,
    macro: Macro,
    parameter: number | (() => boolean) = 1,
    afterCombatAction?: () => void
) {
    let n = 0;
    const condition = () => {
        return typeof parameter === "number" ? n < parameter : parameter();
    };
    while (condition()) {
        macro.setAutoAttack();
        const macroText = macro.toString();
        adv1(location, -1, (round: number, foe: Monster, text: string) => {
            return macroText;
        });
        if (afterCombatAction) afterCombatAction();
        n++;
    }
}

export function advMacro(
    location: Location,
    macro: Macro,
    parameter: number | (() => boolean) = 1,
    afterCombatAction?: () => void
) {
    setAutoAttack(0);
    let n = 0;
    const condition = () => {
        return typeof parameter === "number" ? n < parameter : parameter();
    };
    while (condition()) {
        const macroText = macro.toString();
        adv1(location, -1, () => {
            return macroText;
        });
        if (afterCombatAction) afterCombatAction();
        n++;
    }
}