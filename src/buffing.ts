import {
    buy,
    cliExecute,
    effectModifier,
    equip,
    familiarWeight,
    haveEffect,
    mallPrice,
    maximize,
    myAdventures,
    myEffects,
    myFamiliar,
    numericModifier,
    outfit,
    print,
    use,
    useFamiliar,
    weightAdjustment,
} from "kolmafia";
import { $familiar, $slot, $item, have, $effect, get } from "libram";
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
            return (
                numericModifier(effectModifier(item, "Effect"), "Familiar Weight") > 0 &&
                item.fullness + item.spleen + item.inebriety === 0 &&
                item.tradeable
            );
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
        .sort((a, b) => b.efficiency - a.efficiency);

    const mpa =
        (1 / 25) * mallPrice($item`huge bowl of candy`) +
        0.4 * mallPrice($item`chocolate saucepan`);

    useFamiliar($familiar`reagnimated gnome`);
    equip($slot`familiar`, $item`Gnomish housemaid's kgnee`);
    outfit("Trick");
    const baseWeight =
        familiarWeight(myFamiliar()) +
        weightAdjustment() -
        Object.keys(myEffects())
            .filter((effectName) => {
                const effect = $effect`${effectName}`;
                const duration = myEffects()[effectName];
                return duration / 0.85 < myAdventures() || effect.default.startsWith("use 1");
            })
            .map((effectName) => numericModifier($effect`${effectName}`, "Familiar Weight"))
            .reduce((a, b) => a + b); //removing buffs that don't last very long or buffs that come from items, the latter because it'll some up when we iterate later
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

    weightBuffs.forEach((weightBuff) => {
        if (haveEffect(weightBuff.effect) < myAdventures()) {
            if (testPermanentBuff(weightBuff)) {
                const toBuy = Math.ceil(
                    (myAdventures() - haveEffect(weightBuff.effect)) /
                        numericModifier(weightBuff.item, "Effect Duration")
                );
                const equilibriumPrice =
                    -1 *
                    (((mpa -
                        permanentWeightBuffs.map((buff) => buff.price).reduce((a, b) => a + b, 0)) *
                        (1 - (weight() + weightBuff.value) / 1000)) /
                        (1 - weight() / 1000) +
                        permanentWeightBuffs.map((buff) => buff.price).reduce((a, b) => a + b, 0) -
                        mpa);
                print(`Trying to buy ${weightBuff.item.name} at ${equilibriumPrice}.`);
                const bought = buy(toBuy, weightBuff.item, equilibriumPrice);
                use(bought, weightBuff.item);
                if (bought === toBuy) {
                    permanentWeightBuffs.push(weightBuff);
                }
            }
        } else {
            const equilibriumPrice =
                -1 *
                (((mpa -
                    permanentWeightBuffs.map((buff) => buff.price).reduce((a, b) => a + b, 0)) *
                    (1 - (weight() + weightBuff.value) / 1000)) /
                    (1 - weight() / 1000) +
                    permanentWeightBuffs.map((buff) => buff.price).reduce((a, b) => a + b, 0) -
                    mpa);
            if (mallPrice(weightBuff.item) < equilibriumPrice) {
                permanentWeightBuffs.push(weightBuff);
            }
        }
    });
    if (turnZero) {
        const trueMpa =
            (mpa - permanentWeightBuffs.map((buff) => buff.price).reduce((a, b) => a + b, 0)) /
            (1 - weight() / 1000);

        const turnZeroFreeFights =
            10 +
            2 +
            (10 + 10 + 25 + 5 + 1 + 1 + 3 + 5 + 3 + 3 + 3 + 1 + 1) *
                (have($effect`eldritch attunement`) ? 2 : 1);
        /* snojo + tentacles + NEP + bricko + drunks + witchess + fax + chateau + lynyrd + glark +
      shatteringpunch + xray + batoomerang + mob hit + jokester
      kramco intentionally omitted for thesis*/

        weightBuffs.forEach((weightBuff) => {
            if (!have(weightBuff.effect)) {
                const equilibriumPrice = (trueMpa * weightBuff.value * turnZeroFreeFights) / 1000;
                print(`Trying to buy ${weightBuff.item.name} at ${equilibriumPrice}.`);
                if (buy(1, weightBuff.item, equilibriumPrice)) {
                    use(1, weightBuff.item);
                }
            }
        });
    }
    if (!get("expressCardUsed") || !get("_licenseToChillUsed")) {
        useFamiliar($familiar`left-hand man`);
        maximize("mp", false);
        cliExecute("/cast * love song");
        if (!get("expressCardUsed")) {
            withStash([$item`platinum yendorian express card`], () =>
                use(1, $item`platinum yendorian express card`)
            );
            cliExecute("/cast * love song");
        }
        if (!get("_licenseToChillUsed")) {
            use(1, $item`license to chill`);
            cliExecute("/cast * love song");
        }
    }
    withStash([$item`defective game grid token`], () => use(1, $item`defective game grid token`));
    return { permanentWeightBuffs, baseWeight };
}
