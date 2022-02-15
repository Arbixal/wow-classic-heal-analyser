import { SPECS, GROUPS } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    2343: {
        name: "Enchant Weapon - Major Healing",
        spellId: 34010,
        score: {...GROUPS.Healers.BIS}
    },
    2670: {
        name: "Enchant 2H Weapon - Major Agility",
        spellId: 27977,
        score: {
            [SPECS.Druid.Feral]: 1,
            [SPECS.Druid.Guardian]: 1,
            [SPECS.Druid.Warden]: 1,
            [SPECS.Hunter.BeastMastery]: 1,
            [SPECS.Hunter.Survival]: 1,
            [SPECS.Hunter.Marksmanship]: 1,
        }
    },
    3222: {
        name: "Enchant Weapon - Greater Agility",
        spellId: 42620,
        score: {
            [SPECS.Hunter.BeastMastery]: 1,
            [SPECS.Hunter.Survival]: 1,
            [SPECS.Hunter.Marksmanship]: 1,
        }
    },
    2669: {
        name: "Enchant Weapon - Major Spellpower",
        spellId: 27975,
        score: {
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Mage.Arcane]: 1,
            [SPECS.Mage.Fire]: 1,
            [SPECS.Mage.Frost]: 1,
            [SPECS.Shaman.Elemental]: 1,
            [SPECS.Priest.Shadow]: 1,
            [SPECS.Warlock.Destruction]: 1,
            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
            [SPECS.Druid.Balance]: 1,
        }
    },
    2673: {
        name: "Enchant Weapon - Mongoose",
        spellId: 27984,
        score: {
            [SPECS.Warrior.Gladiator]: 1,
            [SPECS.Warrior.Protection]: 1,
            [SPECS.Rogue.Combat]: 1,
            [SPECS.Rogue.Subtlety]: 1,
            [SPECS.Rogue.Assassination]: 1,
            [SPECS.Shaman.Enhancement]: 1,
            [SPECS.Paladin.Retribution]: 1,
            [SPECS.Warrior.Arms]: 1,
            [SPECS.Warrior.Fury]: 1,
        }
    },
    2671: {
        name: "Enchant Weapon - Sunfire",
        spellId: 27981,
        score: {
            [SPECS.Druid.Balance]: 1,
            [SPECS.Mage.Arcane]: 1,
            [SPECS.Warlock.Destruction]: 1,
        }
    },
    2672: {
        name: "Enchant Weapon - Soulfrost",
        spellId: 27982,
        score: {
            [SPECS.Mage.Frost]: 1,
            [SPECS.Priest.Shadow]: 1,
            [SPECS.Warlock.Destruction]: 1,
            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
        }
    },
    2666: {
        name: "Enchant Weapon - Major Intellect",
        spellId: 27968,
        score: {
        }
    },
}