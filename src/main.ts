import { equip, outfit, useFamiliar } from "kolmafia";
import { $familiar, $item, $slot, have } from "libram";
import { buffUp } from "./buffing";
import { runBlocks } from "./trickin and treatin";

function prepBlocks() {
    useFamiliar($familiar`reagnimated gnome`);
    if (!have($item`gnomish housemaid's kgnee`)) throw "Gotta get that knee";
    equip($slot`familiar`, $item`gnomish housemadi's kgnee`);
    outfit("legendary regalia of the saucemaestro");
}

export function main(args: string) {
    if (args.includes("block")) {
        const blocks = parseInt(args.split(" ")[1]);
        runBlocks(blocks);
    } else if (args.includes("buff")) {
        const turnZero = args.includes("0") || args.includes("zero");
        buffUp(turnZero);
    } else if (args.includes("day") || args.includes("full")) {
        const buffs = buffUp(true);
        freeFights();
        prepBlocks();
        runBlocks(-1, buffs);
    }
}
