import { SPECS, GROUPS } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    2613: {
        name: "Enchant Gloves - Threat",
        spellId: 25072,
        score: {
            [SPECS.Druid.Guardian]: 1,
            [SPECS.Druid.Warden]: 1,
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Warrior.Protection]: 1,
        }
    },
    2937: {
        name: "Enchant Gloves - Major Spellpower",
        spellId: 33997,
        score: {
            [SPECS.Druid.Balance]: 1,

            [SPECS.Mage.Arcane]: 1,
            [SPECS.Mage.Fire]: 1,
            [SPECS.Mage.Frost]: 1,

            [SPECS.Paladin.Protection]: 1,
            
            [SPECS.Priest.Shadow]: 1,
            
            [SPECS.Shaman.Elemental]: 1,
            
            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
            [SPECS.Warlock.Destruction]: 1,
        }
    },
    2614: {
        name: "Enchant Gloves - Shadow Power",
        spellId: 25073,
        score: {
            [SPECS.Priest.Shadow]: 1,
        }
    },
    2564: {
        name: "Enchant Gloves - Superior Agility",
        spellId: 25080,
        score: {
            [SPECS.Druid.Feral]: 1,
            [SPECS.Druid.Warden]: 1,

            [SPECS.Hunter.Marksmanship]: 1,
            [SPECS.Hunter.BeastMastery]: 1,
            [SPECS.Hunter.Survival]: 1,

            [SPECS.Paladin.Protection]: 1,
            
            [SPECS.Rogue.Assassination]: 1,
            [SPECS.Rogue.Combat]: 1,
            [SPECS.Rogue.Subtlety]: 1,
        }
    },
    2322: {
        name: "Enchant Gloves - Major Healing",
        spellId: 33999,
        score: {...GROUPS.Healers.BIS}
    },
    2935: {
        name: "Enchant Gloves - Spell Strike",
        spellId: 33994,
        score: {
            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
            [SPECS.Warlock.Destruction]: 1,
        }
    },
    1594: {
        name: "Enchant Gloves - Assault",
        spellId: 33996,
        score: {

        }
    },
    684: {
        name: "Enchant Gloves - Major Strength",
        spellId: 46515,
        score: {
            [SPECS.Paladin.Retribution]: 1,
            [SPECS.Shaman.Enhancement]: 1,
            [SPECS.Warrior.Arms]: 1,
            [SPECS.Warrior.Fury]: 1,
        }
    },
}