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
        score: {}
    },
    2985: {
        name: "Flame Armor Kit",
        itemId: 29485,
        score: {}
    },
    2988: {
        name: "Nature Armor Kit",
        itemId: 29487,
        score: {}
    },
    2987: {
        name: "Frost Armor Kit",
        itemId: 29486,
        score: {}
    },
    1505: {
        name: "Lesser Arcanum of Resilience",
        itemId: 11644,
        score: {}
    },
    3330: {
        name: "Heavy Borean Armor Kit",
        itemId: 38376,
        bySlot: {
            [itemSlots.Chest]: {
                itemId: 38376,
                score: {
                    [SPECS.DeathKnight.Blood]: 1,
                    [SPECS.DeathKnight.Runeblade]: 1,
                    [SPECS.Druid.Warden]: 1,
                    [SPECS.Druid.Guardian]: 1,
                    [SPECS.Paladin.Protection]: 1,
                    [SPECS.Paladin.Justicar]: 1,
                }
            },
            [itemSlots.Legs]: {
                itemId: 38376,
                score: {}
            },
            [itemSlots.Hands]: {
                itemId: 38376,
                score: {
                    [SPECS.DeathKnight.Blood]: 1,
                    [SPECS.DeathKnight.Runeblade]: 1,
                    [SPECS.Warrior.Protection]: 1,
                    [SPECS.Warrior.Gladiator]: 1,
                }
            },
            [itemSlots.Feet]: {
                itemId: 38376,
                score: {
                    [SPECS.Paladin.Protection]: 1,
                    [SPECS.Paladin.Justicar]: 1,
                }
            }
        },
        score: {}
    },
    3601: {
        name: "Frag Belt",
        spellId: 54793,
        score: {
            ...GROUPS.All.BIS
        }
    }
}