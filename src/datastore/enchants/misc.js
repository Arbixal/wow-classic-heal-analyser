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
    2984: {
        name: "Shadow Armor Kit",
        itemId: 29483,
        score: {...GROUPS.All.BIS}
    },
    2985: {
        name: "Flame Armor Kit",
        itemId: 29485,
        score: {...GROUPS.Tanks.BIS}
    },
    2988: {
        name: "Nature Armor Kit",
        itemId: 29487,
        score: {...GROUPS.Tanks.BIS}
    },
    2987: {
        name: "Frost Armor Kit",
        itemId: 29486,
        score: {...GROUPS.Tanks.BIS}
    },
    1505: {
        name: "Lesser Arcanum of Resilience",
        itemId: 11644,
        score: {
            ...GROUPS.Tanks.BIS,
            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
            [SPECS.Warlock.Destruction]: 1,
        }
    },
}