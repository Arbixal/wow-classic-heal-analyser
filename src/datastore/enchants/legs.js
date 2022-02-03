import { SPECS, GROUPS } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    2746: {
        name: "Golden Spellthread",
        itemId: 24276,
        score: {...GROUPS.Healers.BIS}
    },
    2745: {
        name: "Silver Spellthread",
        itemId: 24275,
        score: {...GROUPS.Healers.OK}
    },
    2747: {
        name: "Mystic Spellthread",
        itemId: 24273,
        score: {
            [SPECS.Paladin.Protection]: 0.5,
            [SPECS.Druid.Balance]: 0.5,
            [SPECS.Mage.Arcane]: 0.5,
            [SPECS.Mage.Fire]: 0.5,
            [SPECS.Mage.Frost]: 0.5,
            [SPECS.Shaman.Elemental]: 0.5,
            [SPECS.Priest.Shadow]: 0.5,
            [SPECS.Warlock.Destruction]: 0.5,
            [SPECS.Warlock.Affliction]: 0.5,
            [SPECS.Warlock.Demonology]: 0.5,
        }
    },
    2748: {
        name: "Runic Spellthread",
        itemId: 24274,
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
    3011: {
        name: "Clefthide Leg Armor",
        itemId: 29534,
        score: {...GROUPS.Tanks.OK}
    },
    3013: {
        name: "Nethercleft Leg Armor",
        itemId: 29536,
        score: {...GROUPS.Tanks.BIS}
    },
    3010: {
        name: "Cobrahide Leg Armor",
        itemId: 29533,
        score: {
            [SPECS.Druid.Feral]: 0.5,
            [SPECS.Druid.Warden]: 0.5,

            [SPECS.Hunter.BeastMastery]: 0.5,
            [SPECS.Hunter.Marksmanship]: 0.5,
            [SPECS.Hunter.Survival]: 0.5,

            [SPECS.Rogue.Assassination]: 0.5,
            [SPECS.Rogue.Combat]: 0.5,
            [SPECS.Rogue.Subtlety]: 0.5,
            
            [SPECS.Paladin.Retribution]: 0.5,

            [SPECS.Shaman.Enhancement]: 0.5,

            [SPECS.Warrior.Arms]: 0.5,
            [SPECS.Warrior.Fury]: 0.5,
        }
    },
    3012: {
        name: "Nethercobra Leg Armor",
        itemId: 29535,
        score: {
            [SPECS.Druid.Feral]: 1,
            [SPECS.Druid.Warden]: 1,

            [SPECS.Hunter.BeastMastery]: 1,
            [SPECS.Hunter.Marksmanship]: 1,
            [SPECS.Hunter.Survival]: 1,

            [SPECS.Rogue.Assassination]: 1,
            [SPECS.Rogue.Combat]: 1,
            [SPECS.Rogue.Subtlety]: 1,

            [SPECS.Paladin.Retribution]: 1,

            [SPECS.Shaman.Enhancement]: 1,

            [SPECS.Warrior.Arms]: 1,
            [SPECS.Warrior.Fury]: 1,
        }
    },
}