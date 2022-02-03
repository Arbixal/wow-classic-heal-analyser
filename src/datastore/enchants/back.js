import { GROUPS, SPECS } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    368: {
        name: "Enchant Cloak - Greater Agility",
        spellId: 46505,
        score: {
            [SPECS.Druid.Feral]: 1,
            [SPECS.Druid.Guardian]: 1,
            [SPECS.Druid.Warden]: 1,
            [SPECS.Hunter.BeastMastery]: 1,
            [SPECS.Hunter.Marksmanship]: 1,
            [SPECS.Hunter.Survival]: 1,
            [SPECS.Paladin.Retribution]: 1,
            [SPECS.Rogue.Assassination]: 1,
            [SPECS.Rogue.Combat]: 1,
            [SPECS.Rogue.Subtlety]: 1,
            [SPECS.Shaman.Enhancement]: 1,
            [SPECS.Warrior.Arms]: 1,
            [SPECS.Warrior.Fury]: 1,
            [SPECS.Warrior.Gladiator]: 1,
            [SPECS.Warrior.Protection]: 1,
        }
    },
    2622: {
        name: "Enchant Cloak - Dodge",
        spellId: 25086,
        score: {
            [SPECS.Paladin.Protection]: 1,
        }
    },
    1441: {
        name: "Enchant Cloak - Greater Shadow Resistance",
        spellId: 34006,
        score: {...GROUPS.All.BIS}
    },
    804: {
        name: "Enchant Cloak - Lesser Shadow Resistance",
        spellId: 13522,
        score: {...GROUPS.All.OK}
    },
    2619: {
        name: "Enchant Cloak - Greater Fire Resistance",
        spellId: 25081,
        score: {
            ...GROUPS.Tanks.BIS,
            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
            [SPECS.Warlock.Destruction]: 1,
        }
    },
    2620: {
        name: "Enchant Cloak - Greater Nature Resistance",
        spellId: 25082,
        score: {...GROUPS.Tanks.OK}
    },
    2621: {
        name: "Enchant Cloak - Subtlety",
        spellId: 25084,
        score: {
            [SPECS.Druid.Balance]: 1,
            [SPECS.Druid.Dreamstate]: 1,
            [SPECS.Druid.Restoration]: 1,
            [SPECS.Mage.Arcane]: 1,
            [SPECS.Mage.Fire]: 1,
            [SPECS.Mage.Frost]: 1,
            [SPECS.Paladin.Retribution]: 1,
            [SPECS.Priest.Holy]: 1,
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Priest.Shadow]: 1,
            [SPECS.Shaman.Elemental]: 1,
            [SPECS.Shaman.Restoration]: 1,
            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
            [SPECS.Warlock.Destruction]: 1,
        }
    },
    2664: {
        name: "Enchant Cloak - Major Resistance",
        spellId: 27962,
        score: {
            [SPECS.Paladin.Holy]: 1,
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Priest.Holy]: 1,
        }
    },
    2662: {
        name: "Enchant Cloak - Major Armor",
        spellId: 27961,
        score: {
            [SPECS.Paladin.Holy]: 1,
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Priest.Holy]: 1,
            [SPECS.Priest.Shadow]: 1,
        }
    },
    1889: {
        name: "Enchant Cloak - Superior Defense",
        spellId: 20015,
        score: {
            [SPECS.Paladin.Holy]: 0.5,
            [SPECS.Priest.Discipline]: 0.5,
            [SPECS.Priest.Holy]: 0.5,
        }
    },
    2938: {
        name: "Enchant Cloak - Spell Penetration",
        spellId: 34003,
        score: {
            [SPECS.Druid.Balance]: 1,
            [SPECS.Druid.Dreamstate]: 1,
        }
    },
}