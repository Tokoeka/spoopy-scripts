import { buffUp } from "./buffing";
import { runBlocks } from "./trickin and treatin";

export function main(args: string) {
    if (args.includes("block")) {
        const blocks = parseInt(args.split(" ")[1]);
        runBlocks(blocks);
    } else if (args.includes("buff")) {
        const turnZero = args.includes("0") || args.includes("zero");
        buffUp(turnZero);
    } else if (args.includes("day") || args.includes("full")) {
        buffUp(true);
        freeFights();
        prepBlocks();
        runBlocks();
    }
}
