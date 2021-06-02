import {
    equip,
    getCounters,
    handlingChoice,
    haveFamiliar,
    inMultiFight,
    myAdventures,
    myFamiliar,
    outfit,
    print,
    runChoice,
    runCombat,
    totalTurnsPlayed,
    useFamiliar,
    useSkill,
    visitUrl,
} from "kolmafia";
import {
    $familiar,
    $familiars,
    $item,
    $location,
    $monster,
    $skill,
    $slot,
    get,
    have,
    Macro,
    set,
    SourceTerminal,
} from "libram";
import { advMacro, advMacroAA, pickBjorn, prepWandererZone } from "./lib";

const stasisFamiliars = $familiars`stocking mimic, ninja pirate zombie robot, comma chameleon, feather boa constrictor`;

const prepareToTrick = (trickFamiliar: Familiar, trickMacro: Macro) => {
    trickMacro.setAutoAttack();
    useFamiliar(trickFamiliar);
    outfit("trick");
};

const treatOutfit = get<string>("spoopTreatOutfit") || "Eldritch Equippage";
const tot = $familiar`trick-or-treating tot`;
const prepareToTreat = () => {
    if (haveFamiliar(tot)) useFamiliar(tot);
    outfit(treatOutfit);
};

const block = () => visitUrl("place.php?whichplace=town&action=town_trickortreat");

function treat() {
    set("choiceAdventure806", "1");
    prepareToTreat();
    if (!block().includes("whichhouse=")) {
        if (myAdventures() < 5) {
            throw "Need a new block and I'm all out of turns, baby!";
        } else {
            visitUrl("choice.php?whichchoice=804&pwd&option=1");
        }
        if (!block().includes("whichhouse=")) throw "Something went awry when finding a new block!";
    } else {
        for (let i = 1; i <= 11; i++) {
            if (block().match(RegExp(`whichhouse=${i}>[^>]*?house_l`))) {
                visitUrl(`choice.php?whichchoice=804&option=3&whichhouse=${i}&pwd`);
                if (handlingChoice()) runChoice(-1);
            }
        }
        if (block().match(RegExp(`whichhouse=\d+>[^>]*?house_l`)))
            throw "I thought I was out of light houses, but I wasn't. Alas!";
    }
}

function trick(trickFamiliar: Familiar, trickMacro: Macro) {
    prepareToTrick(trickFamiliar, trickMacro);
    if (!block().includes("whichhouse=")) {
        if (myAdventures() < 5) {
            throw "Need a new block and I'm all out of turns, baby!";
        } else {
            visitUrl("choice.php?whichchoice=804&pwd&option=1");
        }
        if (!block().includes("whichhouse=")) throw "Something went awry when finding a new block!";
    } else {
        for (let i = 1; i <= 11; i++) {
            if (block().match(RegExp(`whichhouse=${i}>[^>]*?house_d`))) {
                visitUrl(`choice.php?whichchoice=804&option=3&whichhouse=${i}&pwd`);
                runCombat(trickMacro.toString());
                while (inMultiFight()) runCombat(trickMacro.toString());
            }
        }
        if (block().match(RegExp(`whichhouse=\d+>[^>]*?house_d`)))
            throw "I thought I was out of dark houses, but I wasn't. Alas!";
    }
}

function trickTreat(trickFamiliar: Familiar, trickMacro: Macro) {
    treat();
    trick(trickFamiliar, trickMacro);
}

const proton = $item`protonic accelerator pack`;
function ghostCheck() {
    if (
        get("questPAGhost") === "unstarted" &&
        get("nextParanormalActivity") <= totalTurnsPlayed()
    ) {
        equip($slot`back`, proton);
    }
}

const bjorn = $item`buddy bjorn`;

function freeFight(macro: Macro, condition?: () => boolean, prep?: () => void) {
    outfit("freefight stasis");
    if (have(bjorn)) pickBjorn();
    if (have(proton)) ghostCheck();
    if (prep) prep();
    advMacroAA(prepWandererZone(), macro, condition);
}

export function runBlocks(blocks?: number) {
    const terminal = SourceTerminal.have();

    const kramco = $item`Kramco Sausage-o-Matic™`;
    const sausage = have(kramco);

    const ghost = have(proton);

    const voteBadge = $item`"I Voted!" sticker`;
    const voting = have(voteBadge) && get("_voteToday");

    const trickFamiliar = myFamiliar();

    const trickMacro = stasisFamiliars.includes(trickFamiliar)
        ? Macro.skill("curse of weaksauce")
              .skill("micrometeor")
              .skill("shadow noodles")
              .skill("sing along")
              .skill("extract")
              .skill("summon love gnats")
              .skill("shell up")
              .item("time-spinner", "HOA citation pad")
              .item("little red book")
              .item("nasty-smelling moss")
              .item("great wolf's lice")
              .item("mayor ghost's scissors")
              .skill("silent treatment")
              .trySkillRepeat("shieldbutt")
              .trySkillRepeat("kneebutt")
              .attack()
              .repeat()
        : Macro.skill("curse of weaksauce")
              .trySkill("sing along")
              .trySkill("extract")
              .attack()
              .repeat();

    let n = 0;
    const condition = () => (blocks ? n < blocks : myAdventures() >= 5);

    while (condition()) {
        useFamiliar(trickFamiliar);
        const digitizes = get("_sourceTerminalDigitizeUses");
        const sausages = get("_sausageFights");
        const votes = get("_voteFreeFights");

        if (terminal) {
            if (getCounters("Digitize", -11, 0) !== "") {
                const digitizeMacro = Macro.externalIf(
                    myAdventures() * 1.1 <
                        (3 - digitizes) *
                            (5 *
                                (get("_sourceTerminalDigitizeMonsterCount") *
                                    (1 + get("_sourceTerminalDigitizeMonsterCount"))) -
                                3),
                    Macro.trySkill("digitize")
                ).step(trickMacro);
                freeFight(digitizeMacro, () => {
                    return getCounters("Digitize", -11, 0) !== "";
                });
            }
        }

        if (sausage) {
            const kramcoNumber =
                5 + 3 * get("_sausageFights") + Math.pow(Math.max(0, get("_sausageFights") - 5), 3);
            if (totalTurnsPlayed() - get("_lastSausageMonsterTurn") + 1 >= kramcoNumber) {
                freeFight(
                    trickMacro,
                    () => totalTurnsPlayed() - get("_lastSausageMonsterTurn") + 1 >= kramcoNumber,
                    () => equip($slot`off-hand`, kramco)
                );
            }
        }

        if (voting) {
            if (getCounters("Vote", 0, 0) !== "" && get("_voteFreeFights") < 3) {
                const voteMacro = Macro.externalIf(
                    get("_voteMonster") === $monster`angry ghost`,
                    Macro.skill("silent treatment")
                ).step(trickMacro);
                freeFight(
                    voteMacro,
                    () => getCounters("Vote", 0, 0) !== "" && get("_voteFreeFights") < 3,
                    () => equip($slot`acc3`, voteBadge)
                );
            }
        }
        const ghosting = get("questPAGhost") !== "unstarted";
        if (ghost && ghosting) {
            const ghostLocation = get("ghostLocation") || $location`none`;
            if (ghostLocation === $location`none`) {
                throw `Something went wrong with my ghosts. Dammit, Walter Peck!`;
            }
            print(`Lonely rivers flow to the sea, to the sea. Time to wrastle a ghost.`, "blue");
            advMacro(
                ghostLocation,
                Macro.skill("shoot ghost").skill("shoot ghost").skill("trap ghost"),
                () => get("questPAGhost") !== "unstarted",
                () => equip($slot`back`, proton)
            );
        }

        if (
            digitizes !== get("_sourceTerminalDigitizeUses") &&
            !(
                votes !== get("_voteFreeFights") ||
                sausages !== get("_sausageFights") ||
                ghosting !== (get("questPAGhost") !== "unstarted")
            )
        ) {
            useFamiliar($familiar`frumious bandersnatch`);
            useSkill(1, $skill`ode to booze`);
            advMacroAA($location`the dire warren`, Macro.step("runaway"));
        }
        trickTreat(trickFamiliar, trickMacro);
    }
}
