import { SPECS } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    2654: {
        name: "Enchant Shield - Intellect",
        spellId: 27945,
        score: {
            [SPECS.Shaman.Restoration]: 1,
            [SPECS.Paladin.Holy]: 1,
            [SPECS.Shaman.Elemental]: 1,
        }
    },
    1071: {
        name: "Enchant Shield - Major Stamina",
        spellId: 34009,
        score: {
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Warrior.Gladiator]: 1,
            [SPECS.Warrior.Protection]: 1,
        }
    },
    2655: {
        name: "Enchant Shield - Shield Block",
        spellId: 27946,
        score: {
            [SPECS.Paladin.Protection]: 1,
        }
    },
    1888: {
        name: "Enchant Shield - Resistance",
        spellId: 27947,
        score: {
            [SPECS.Paladin.Holy]: 0.5,
            [SPECS.Paladin.Protection]: 0.5,
            [SPECS.Shaman.Elemental]: 0.5,
            [SPECS.Shaman.Restoration]: 0.5,
            [SPECS.Warrior.Protection]: 0.5,
        }
    },
    2653: {
        name: "Enchant Shield - Tough Shield",
        spellId: 27944,
        score: {
            [SPECS.Paladin.Protection]: 1,
        }
    }
}