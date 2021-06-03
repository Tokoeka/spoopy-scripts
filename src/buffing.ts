import {
    buy,
    cliExecute,
    effectModifier,
    equip,
    familiarWeight,
    mallPrice,
    maximize,
    myFamiliar,
    numericModifier,
    outfit,
    use,
    useFamiliar,
    weightAdjustment,
} from "kolmafia";
import { $familiar, $slot, $item, have } from "libram";
import { withStash } from "./lib";
export interface weightBuff {
    item: Item;
    effect: Effect;
    value: number;
    price: number;
    efficiency: number;
}
export function buffUp(turnZero: boolean = false) {
    const weightBuffs = Item.all()
        .filter((item) => {
            return numericModifier(effectModifier(item, "Effect"), "Familiar Weight") > 0;
        })
        .map((buffItem) => {
            return {
                item: buffItem,
                effect: effectModifier(buffItem, "Effect"),
                value: numericModifier(effectModifier(buffItem, "Effect"), "Familiar Weight"),
                price: mallPrice(buffItem) / numericModifier(buffItem, "Effect Duration"),
                efficiency:
                    (numericModifier(effectModifier(buffItem, "Effect"), "Familiar Weight") *
                        numericModifier(buffItem, "Effect Duration")) /
                    mallPrice(buffItem),
            };
        })
        .sort((a, b) => a.efficiency - b.efficiency);

    const mpa =
        (1 / 25) * mallPrice($item`huge bowl of candy`) +
        0.4 * mallPrice($item`chocolate saucepan`);

    useFamiliar($familiar`reagnimated gnome`);
    equip($slot`familiar`, $item`Gnomish housemaid's kgnee`);
    outfit("Trick");

    const baseWeight = familiarWeight(myFamiliar()) + weightAdjustment();
    const permanentWeightBuffs: weightBuff[] = [];
    const weight = () =>
        baseWeight + permanentWeightBuffs.map((buff) => buff.value).reduce((a, b) => a + b, 0);

    function testPermanentBuff(buff: weightBuff) {
        const mpaCalc = (plusWeight: number, weightPrice: number) =>
            (mpa -
                weightPrice -
                permanentWeightBuffs.map((buff) => buff.price).reduce((a, b) => a + b, 0)) /
            (1 - (weight() + plusWeight) / 1000);
        return mpaCalc(buff.value, buff.price) - mpaCalc(0, 0) > 0;
    }

    const prices: Map<weightBuff, number> = new Map<weightBuff, number>();

    weightBuffs.forEach((weightBuff) => {
        if (!have(weightBuff.effect)) {
            if (testPermanentBuff(weightBuff)) {
                const toBuy = Math.ceil(1000 / numericModifier(weightBuff.item, "Effect Duration"));
                const equilibriumPrice =
                    -1 *
                    (((mpa -
                        permanentWeightBuffs.map((buff) => buff.price).reduce((a, b) => a + b, 0)) *
                        (1 - (weight() + weightBuff.value) / 1000)) /
                        (1 - weight() / 1000) +
                        permanentWeightBuffs.map((buff) => buff.price).reduce((a, b) => a + b, 0) -
                        mpa);
                const bought = buy(weightBuff.item, toBuy, equilibriumPrice);
                use(bought, weightBuff.item);
                if (bought === toBuy) {
                    permanentWeightBuffs.push(weightBuff);
                    prices.set(weightBuff, equilibriumPrice);
                }
            }
        }
    });
    if (turnZero) {
        const trueMpa =
            (mpa - permanentWeightBuffs.map((buff) => buff.price).reduce((a, b) => a + b, 0)) /
            (1 - weight() / 1000);

        const turnZeroFreeFights = 10 + 20 + 20 + 50 + 10 + 2 + 2 + 6 + 10 + 6 + 6 + 6 + 2 + 2 + 2;
        /* snojo + NEP + bricko + drunks + witchess + fax + chateau + lynyrd + glark +
      shatteringpunch + xray + batoomerang + mob hit + jokester + tentacles
      kramco intentionally omitted for thesis*/

        weightBuffs.forEach((weightBuff) => {
            if (!have(weightBuff.effect)) {
                if (
                    buy(
                        weightBuff.item,
                        1,
                        (trueMpa * weightBuff.value * turnZeroFreeFights) / 1000
                    )
                ) {
                    use(1, weightBuff.item);
                }
            }
        });
    }
    useFamiliar($familiar`left-hand man`);
    maximize("mp", false);
    cliExecute("/cast * love song");
    use(1, $item`license to chill`);
    cliExecute("/cast * love song");
    withStash([$item`platinum yendorian express card`], () =>
        use(1, $item`platinum yendorian express card`)
    );
    cliExecute("/cast * love song");
    withStash([$item`defective game grid token`], () => use(1, $item`defective game grid token`));
    return prices;
}
