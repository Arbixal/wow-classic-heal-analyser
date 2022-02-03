import { itemSlots } from "../../data";
import { SPECS, GROUPS } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    2617: {
        name: "Enchant Bracer - Superior Healing",
        spellId: 27911,
        score: {...GROUPS.Healers.BIS}
    },
    2566: {
        name: "Enchant Bracer - Healing Power",
        spellId: 23802,
        score: {...GROUPS.Healers.OK}
    },
    2649: {
        name: "Enchant Bracer - Fortitude",
        bySlot: {
            [itemSlots.Wrists]: {
                spellId: 27914,
                score: {
                    [SPECS.Druid.Guardian]: 1,
                    [SPECS.Druid.Warden]: 1,
                    [SPECS.Paladin.Protection]: 1,
                    [SPECS.Warrior.Protection]: 1,
                    [SPECS.Priest.Shadow]: 1,
                }
            },
            [itemSlots.Feet]: {
                spellId: 27950,
                score: {
                    [SPECS.Paladin.Protection]: 1,
                    [SPECS.Priest.Shadow]: 1,
                    [SPECS.Warlock.Affliction]: 1,
                    [SPECS.Warlock.Demonology]: 1,
                    [SPECS.Warlock.Destruction]: 1,
                }
            }
        }
    },
    2648: {
        name: "Enchant Bracer - Major Defense",
        spellId: 27906,
        score: {
            [SPECS.Druid.Guardian]: 1,
            [SPECS.Druid.Warden]: 1,
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Warrior.Protection]: 1,
        }
    },
    2650: {
        name: "Enchant Bracer - Spellpower",
        spellId: 27917,
        score: {
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Druid.Balance]: 1,
            [SPECS.Mage.Arcane]: 1,
            [SPECS.Mage.Fire]: 1,
            [SPECS.Mage.Frost]: 1,
            [SPECS.Shaman.Elemental]: 1,
            [SPECS.Priest.Shadow]: 1,
            [SPECS.Warlock.Destruction]: 1,
            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
        }
    },
    2647: {
        name: "Enchant Bracer - Brawn",
        spellId: 27899,
        score: {
            [SPECS.Druid.Feral]: 1,
            [SPECS.Druid.Warden]: 1,
            [SPECS.Shaman.Enhancement]: 1,
            [SPECS.Paladin.Retribution]: 1,
            [SPECS.Warrior.Arms]: 1,
            [SPECS.Warrior.Fury]: 1,
        }
    },
    1593: {
        name: "Enchant Bracer - Assault",
        spellId: 34002,
        score: {
            [SPECS.Rogue.Combat]: 1,
            [SPECS.Rogue.Subtlety]: 1,
            [SPECS.Rogue.Assassination]: 1,
            [SPECS.Hunter.BeastMastery]: 1,
            [SPECS.Hunter.Survival]: 1,
            [SPECS.Hunter.Marksmanship]: 1,
        }
    },
}