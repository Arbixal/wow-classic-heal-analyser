import { GROUPS, SPECS } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    3150: {
        name: "Enchant Chest - Restore Mana Prime",
        spellId: 33991,
        score: {
            [SPECS.Paladin.Holy]: 1,
            [SPECS.Shaman.Restoration]: 1,
        }
    },
    2661: {
        name: "Enchant Chest - Exceptional Stats",
        spellId: 27960,
        score: {
            [SPECS.Druid.Balance]: 1,
            [SPECS.Druid.Feral]: 1,
            [SPECS.Druid.Guardian]: 1,
            [SPECS.Druid.Warden]: 1,

            [SPECS.Hunter.BeastMastery]: 1,
            [SPECS.Hunter.Marksmanship]: 1,
            [SPECS.Hunter.Survival]: 1,

            [SPECS.Mage.Arcane]: 1,
            [SPECS.Mage.Fire]: 1,
            [SPECS.Mage.Frost]: 1,

            [SPECS.Paladin.Holy]: 1,
            [SPECS.Paladin.Retribution]: 1,

            [SPECS.Priest.Discipline]: 1,
            [SPECS.Priest.Holy]: 1,
            [SPECS.Priest.Shadow]: 1,
            
            [SPECS.Rogue.Assassination]: 1,
            [SPECS.Rogue.Combat]: 1,
            [SPECS.Rogue.Subtlety]: 1,

            [SPECS.Shaman.Elemental]: 1,
            [SPECS.Shaman.Restoration]: 1,
            [SPECS.Shaman.Enhancement]: 1,

            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
            [SPECS.Warlock.Destruction]: 1,

            [SPECS.Warrior.Arms]: 1,
            [SPECS.Warrior.Fury]: 1,
            [SPECS.Warrior.Gladiator]: 1,
            [SPECS.Warrior.Protection]: 1,
        }
    },
    1144: {
        name: "Enchant Chest - Major Spirit",
        spellId: 33990,
        score: {
            [SPECS.Druid.Restoration]: 1,
            [SPECS.Druid.Dreamstate]: 1,
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Priest.Holy]: 1,
            [SPECS.Priest.Shadow]: 1,
        }
    },
    2933: {
        name: "Enchant Chest - Resilience Rating",
        spellId: 33992,
        score: {...GROUPS.Tanks.BIS}
    },
    2659: {
        name: "Enchant Chest - Exceptional Health",
        spellId: 27957,
        score: {
            [SPECS.Paladin.Protection]: 1,
        }
    },
    1950: {
        name: "Enchant Chest - Defense",
        spellId: 46594,
        score: {
            [SPECS.Paladin.Protection]: 1,
        }
    },
}