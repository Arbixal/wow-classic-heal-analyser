import { itemSlots } from "../../data";
import { SPECS, GROUPS } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    2841: {
        name: "Heavy Knothide Armor Kit",
        itemId: 34330,
        bySlot: {
            [itemSlots.Hands]: {
                itemId: 34330,
                score: {
                    [SPECS.Paladin.Protection]: 1,
                }
            },
            [itemSlots.Feet]: {
                itemId: 34330,
                score: {...GROUPS.Tanks.OK}
            }
        },
        score: {
            [SPECS.Paladin.Protection]: 1
        }
    },
}