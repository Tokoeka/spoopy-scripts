import { equip, myClass, outfit, useFamiliar } from "kolmafia";
import { $class, $familiar, $item, $slot, have, set } from "libram";
import { buffUp } from "./buffing";
import { freeFights } from "./freefights";
import { runBlocks } from "./trickin and treatin";

function prepBlocks() {
    useFamiliar($familiar`reagnimated gnome`);
    if (!have($item`gnomish housemaid's kgnee`)) throw "Gotta get that knee";
    equip($slot`familiar`, $item`gnomish housemaid's kgnee`);
    if (
        !have($item`Sledgehammer of the Vælkyr`) &&
        !have($item`Flail of the Seven Aspects`) &&
        !have($item`Wrath of the Capsaician Pastalords`) &&
        !have($item`Windsor Pan of the Source`) &&
        !have($item`Seeger's Unstoppable Banjo`) &&
        !have($item`The Trickster's Trikitixa`)
    ) {
        set("spoopTreatOutfit", "Hodgeman's Regal Frippery");
    } else {
        switch (myClass()) {
            case $class`seal clubber`:
                set("spoopTreatOutfit", "Legendary Regalia of the Seal Crusher");
                break;

            case $class`turtle tamer`:
                set("spoopTreatOutfit", "Legendary Regalia of the Chelonian Overlord");
                break;

            case $class`sauceror`:
                set("spoopTreatOutfit", "Legendary Regalia of the Saucemaestro");
                break;

            case $class`pastamancer`:
                set("spoopTreatOutfit", "Legendary Regalia of the Pasta Master");
                break;

            case $class`disco bandit`:
                set("spoopTreatOutfit", "Legendary Regalia of the Groovelord");
                break;

            case $class`accordion thief`:
                set("spoopTreatOutfit", "Legendary Regalia of the Master Squeezeboxer");
                break;
        }
    }
    outfit("freefight stasis");
    equip($slot`hat`, $item`beholed bedsheet`);
}

export function main(args: string) {
    if (args.includes("block")) {
        const blocks = parseInt(args.split(" ")[1]);
        runBlocks(blocks);
    } else if (args.includes("buff")) {
        const turnZero = args.includes("0") || args.includes("zero");
        buffUp(turnZero);
    } else if (args.includes("day") || args.includes("full")) {
        freeFights();
        prepBlocks();
        runBlocks();
    }
}
