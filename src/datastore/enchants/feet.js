import { SPECS, GROUPS } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    2940: {
        name: "Enchant Boots - Boar's Speed",
        spellId: 34008,
        score: {
            [SPECS.Druid.Balance]: 0.5,
            [SPECS.Druid.Dreamstate]: 0.5,
            [SPECS.Druid.Guardian]: 0.5,
            [SPECS.Druid.Restoration]: 0.5,
            [SPECS.Druid.Warden]: 0.5,

            [SPECS.Mage.Arcane]: 0.5,
            [SPECS.Mage.Fire]: 0.5,
            [SPECS.Mage.Frost]: 0.5,

            [SPECS.Paladin.Holy]: 0.5,
            [SPECS.Paladin.Protection]: 0.5,

            [SPECS.Priest.Discipline]: 0.5,
            [SPECS.Priest.Holy]: 0.5,
            [SPECS.Priest.Shadow]: 0.5,

            [SPECS.Shaman.Elemental]: 0.5,
            [SPECS.Shaman.Restoration]: 0.5,
            
            [SPECS.Warlock.Affliction]: 0.5,
            [SPECS.Warlock.Demonology]: 0.5,
            [SPECS.Warlock.Destruction]: 0.5,
            
            [SPECS.Warrior.Gladiator]: 0.5,
            [SPECS.Warrior.Protection]: 0.5,
        }
    },
    911: {
        name: "Enchant Boots - Minor Speed",
        spellId: 13890,
        score: {}
    },
    2657: {
        name: "Enchant Boots - Dexterity",
        spellId: 27951,
        score: {}
    },
    2658: {
        name: "Enchant Boots - Surefooted",
        spellId: 27954,
        score: {}
    },
    2939: {
        name: "Enchant Boots - Cat's Swiftness",
        spellId: 34007,
        score: {
            [SPECS.DeathKnight.Frost]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
            [SPECS.DeathKnight.Unholy]: 1,
            [SPECS.Warrior.Arms]: 1,
            [SPECS.Warrior.Fury]: 1,
            [SPECS.Warrior.Champion]: 1,
        }
    },
    2656: {
        name: "Enchant Boots - Vitality",
        spellId: 27948,
        score: {}
    },

    3606: {
        name: "Nitro Boots",
        spellId: 55016,
        score: {
            ...GROUPS.All.BIS,
        }
    },
    3232: {
        name: "Tuskarr's Vitality",
        spellId: 47901,
        score: {
            ...GROUPS.Tanks.BIS,
            [SPECS.Shaman.Enhancement]: 0.5,
            [SPECS.Druid.Balance]: 1,
            [SPECS.Druid.Restoration]: 1,
            [SPECS.Mage.Arcane]: 1,
            [SPECS.Mage.Fire]: 1,
            [SPECS.Mage.Frost]: 1,
            [SPECS.Paladin.Holy]: 1,
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Priest.Holy]: 1,
            [SPECS.Priest.Shadow]: 1,
            [SPECS.Shaman.Elemental]: 1,
            [SPECS.Shaman.Restoration]: 1,
            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
            [SPECS.Warlock.Destruction]: 1,
        }
    },
    1075: {
        name: "Enchant Boots - Greater Fortitude",
        spellId: 44528,
        score: {
            ...GROUPS.Tanks.BIS
        }
    },
    983: {
        name: "Enchant Boots - Superior Agility",
        spellId: 44589,
        score: {
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Paladin.Justicar]: 1,
            [SPECS.Hunter.BeastMastery]: 1,
            [SPECS.Hunter.Marksmanship]: 1,
            [SPECS.Hunter.Survival]: 1,
        }
    },
    1597: {
        name: "Enchant Boots - Greater Assault",
        spellId: 60763,
        score: {
            [SPECS.DeathKnight.Frost]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
            [SPECS.DeathKnight.Unholy]: 1,
            [SPECS.Paladin.Retribution]: 1,
            [SPECS.Warrior.Arms]: 1,
            [SPECS.Warrior.Fury]: 1,
            [SPECS.Warrior.Champion]: 1,
        }
    },
    3824: {
        name: "Enchant Boots - Assault",
        spellId: 60606,
        score: {
            [SPECS.DeathKnight.Frost]: 0.5,
            [SPECS.DeathKnight.Lichborne]: 0.5,
            [SPECS.DeathKnight.Unholy]: 0.5,
            [SPECS.Paladin.Retribution]: 0.5,
            [SPECS.Warrior.Arms]: 0.5,
            [SPECS.Warrior.Fury]: 0.5,
            [SPECS.Warrior.Champion]: 0.5,
        }
    },
    3826: {
        name: "Enchant Boots - Icewalker",
        spellId: 60623,
        score: {
            [SPECS.Druid.Feral]: 1,
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
            [SPECS.Warrior.Champion]: 1,
            [SPECS.Druid.Balance]: 1,
            [SPECS.Mage.Arcane]: 1,
            [SPECS.Mage.Fire]: 1,
            [SPECS.Mage.Frost]: 1,
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Priest.Shadow]: 1,
            [SPECS.Shaman.Elemental]: 1,
            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
            [SPECS.Warlock.Destruction]: 1,
        }
    },
    1147: {
        name: "Enchant Boots - Greater Spirit",
        spellId: 44508,
        score: {
            [SPECS.Druid.Restoration]: 1,
            [SPECS.Priest.Holy]: 1,
        }
    },
    3244: {
        name: "Enchant Boots - Greater Vitality",
        spellId: 44584,
        score: {
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Shaman.Restoration]: 1,
        }
    },
}