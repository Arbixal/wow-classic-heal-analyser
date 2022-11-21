import { SPECS, GROUPS } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    2343: {
        name: "Enchant Weapon - Major Healing",
        spellId: 34010,
        score: {...GROUPS.Healers.OK}
    },
    2670: {
        name: "Enchant 2H Weapon - Major Agility",
        spellId: 27977,
        score: {}
    },
    3222: {
        name: "Enchant Weapon - Greater Agility",
        spellId: 42620,
        score: {}
    },
    2669: {
        name: "Enchant Weapon - Major Spellpower",
        spellId: 27975,
        score: {
            ...GROUPS.Healers.OK,
            [SPECS.Paladin.Protection]: 0.5,
            [SPECS.Mage.Arcane]: 0.5,
            [SPECS.Mage.Fire]: 0.5,
            [SPECS.Mage.Frost]: 0.5,
            [SPECS.Shaman.Elemental]: 0.5,
            [SPECS.Priest.Shadow]: 0.5,
            [SPECS.Warlock.Destruction]: 0.5,
            [SPECS.Warlock.Affliction]: 0.5,
            [SPECS.Warlock.Demonology]: 0.5,
            [SPECS.Druid.Balance]: 0.5,
        }
    },
    2673: {
        name: "Enchant Weapon - Mongoose",
        spellId: 27984,
        score: {
            [SPECS.Warrior.Gladiator]: 1,
            [SPECS.Warrior.Protection]: 1,
            [SPECS.Druid.Guardian]: 1,
            [SPECS.Druid.Warden]: 1,
            [SPECS.Rogue.Combat]: 0.5,
            [SPECS.Rogue.Subtlety]: 0.5,
            [SPECS.Rogue.Assassination]: 0.5,
            [SPECS.Shaman.Enhancement]: 0.5,
            [SPECS.Paladin.Retribution]: 0.5,
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Paladin.Justicar]: 1,
            [SPECS.Warrior.Arms]: 0.5,
            [SPECS.Warrior.Fury]: 0.5,
            [SPECS.Warrior.Champion]: 0.5,
        }
    },
    3225: {
        name: "Enchant Weapon - Executioner",
        spellId: 42974,
        score: {
            [SPECS.Warrior.Gladiator]: 0.5,
            [SPECS.Warrior.Protection]: 0.5,
            [SPECS.Druid.Guardian]: 0.5,
            [SPECS.Druid.Warden]: 0.5,
            [SPECS.Rogue.Combat]: 0.5,
            [SPECS.Rogue.Subtlety]: 0.5,
            [SPECS.Rogue.Assassination]: 0.5,
            [SPECS.Shaman.Enhancement]: 0.5,
            [SPECS.Paladin.Retribution]: 0.5,
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Paladin.Justicar]: 1,
            [SPECS.Warrior.Arms]: 0.5,
            [SPECS.Warrior.Fury]: 0.5,
            [SPECS.Warrior.Champion]: 0.5,
        }
    },
    2671: {
        name: "Enchant Weapon - Sunfire",
        spellId: 27981,
        score: {
            [SPECS.Druid.Balance]: 0.5,
            [SPECS.Mage.Arcane]: 0.5,
            [SPECS.Warlock.Destruction]: 0.5,
        }
    },
    2672: {
        name: "Enchant Weapon - Soulfrost",
        spellId: 27982,
        score: {
            [SPECS.Mage.Frost]: 0.5,
            [SPECS.Priest.Shadow]: 0.5,
            [SPECS.Warlock.Destruction]: 0.5,
            [SPECS.Warlock.Affliction]: 0.5,
            [SPECS.Warlock.Demonology]: 0.5,
        }
    },
    2666: {
        name: "Enchant Weapon - Major Intellect",
        spellId: 27968,
        score: {
            [SPECS.Paladin.Holy]: 1,
            [SPECS.Priest.Holy]: 0.5,
        }
    },
    // WotLK Enchants
    3789: {
        name: "Enchant Weapon - Berserking",
        spellId: 59621,
        score: {
            [SPECS.Warrior.Arms]: 1,
            [SPECS.Warrior.Fury]: 1,
            [SPECS.Warrior.Champion]: 1,
            [SPECS.Druid.Feral]: 1,
            [SPECS.Paladin.Retribution]: 1,
            [SPECS.Rogue.Assassination]: 1,
            [SPECS.Rogue.Combat]: 1,
            [SPECS.Rogue.Subtlety]: 1,
            [SPECS.Shaman.Enhancement]: 1,
            [SPECS.Paladin.Retribution]: 1,
        }
    },
    3827: {
        name: "Enchant 2H Weapon - Massacre",
        spellId: 60691,
        score: {
            [SPECS.Druid.Feral]: 1,
            [SPECS.Druid.Guardian]: 1,
            [SPECS.Druid.Warden]: 1,
            [SPECS.Hunter.BeastMastery]: 1,
            [SPECS.Hunter.Marksmanship]: 1,
            [SPECS.Hunter.Survival]: 1,
            [SPECS.Paladin.Retribution]: 1,
        }
    },
    3828: {
        name: "Enchant 2H Weapon - Greater Savagery",
        spellId: 44630,
        score: {
            [SPECS.Paladin.Retribution]: 0.5
        }
    },
    3833: {
        name: "Enchant Weapon - Superior Potency",
        spellId: 60707,
        score: {
            [SPECS.Hunter.BeastMastery]: 1,
            [SPECS.Hunter.Marksmanship]: 1,
            [SPECS.Hunter.Survival]: 1,
        }
    },
    3788: {
        name: "Enchant Weapon - Accuracy",
        spellId: 59619,
        score: {
            [SPECS.Hunter.BeastMastery]: 0.5,
            [SPECS.Hunter.Marksmanship]: 0.5,
            [SPECS.Hunter.Survival]: 0.5,
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Paladin.Justicar]: 1,
            [SPECS.Warrior.Protection]: 1,
            [SPECS.Warrior.Champion]: 1,
            [SPECS.Warrior.Gladiator]: 1,
        }
    },
    3870: {
        name: "Enchant Weapon - Blood Draining",
        spellId: 64579,
        score: {
            [SPECS.Warrior.Protection]: 1,
            [SPECS.Warrior.Gladiator]: 1,
            [SPECS.Warrior.Champion]: 1,
        }
    },
    3247: {
        name: "Enchant 2H Weapon - Scourgebane",
        spellId: 44595,
        score: {}
    },
    3241: {
        name: "Enchant Weapon - Lifeward",
        spellId: 44576,
        score: {}
    },
    3239: {
        name: "Enchant Weapon - Icebreaker",
        spellId: 44524,
        score: {}
    },
    1606: {
        name: "Enchant Weapon - Greater Potency",
        spellId: 60621,
        score: {}
    },
    1103: {
        name: "Enchant Weapon - Exceptional Agility",
        spellId: 44633,
        score: {
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Paladin.Justicar]: 1,
        }
    },
    3368: {
        name: "Rune of the Fallen Crusader",
        spellId: 53344,
        score: {
            [SPECS.DeathKnight.Blood]: 1,
            [SPECS.DeathKnight.Runeblade]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
            [SPECS.DeathKnight.Frost]: 1,
            [SPECS.DeathKnight.Unholy]: 1,
        }
    },
    3847: {
        name: "Rune of the Stoneskin Gargoyle",
        spellId: 62158,
        score: {
            [SPECS.DeathKnight.Blood]: 1,
            [SPECS.DeathKnight.Runeblade]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
        }
    },
    3365: {
        name: "Rune of Swordshattering",
        spellId: 53323,
        score: {
            [SPECS.DeathKnight.Blood]: 1,
            [SPECS.DeathKnight.Runeblade]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
        }
    },
    3883: {
        name: "Rune of the Nerubian Carapace",
        spellId: 70164,
        score: {
            [SPECS.DeathKnight.Blood]: 1,
            [SPECS.DeathKnight.Runeblade]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
        }
    },
    3594: {
        name: "Rune of Swordbreaking",
        spellId: 54446,
        score: {
            [SPECS.DeathKnight.Blood]: 1,
            [SPECS.DeathKnight.Runeblade]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
        }
    },
    3370: {
        name: "Rune of Razorice",
        spellId: 53343,
        score: {
            [SPECS.DeathKnight.Blood]: 1,
            [SPECS.DeathKnight.Runeblade]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
            [SPECS.DeathKnight.Frost]: 1,
        }
    },
    3790: {
        name: "Enchant Weapon - Black Magic",
        spellId: 59625,
        score: {
            [SPECS.DeathKnight.Unholy]: 1,
            [SPECS.DeathKnight.Runeblade]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
            [SPECS.Druid.Balance]: 0.5,
            [SPECS.Mage.Arcane]: 1,
            [SPECS.Mage.Fire]: 1,
            [SPECS.Mage.Frost]: 1,
            [SPECS.Priest.Shadow]: 1,
            [SPECS.Shaman.Elemental]: 1,
            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
            [SPECS.Warlock.Destruction]: 1,
        }
    },
    3834: {
        name: "Enchant Weapon - Mighty Spellpower",
        spellId: 60714,
        score: {
            [SPECS.Druid.Balance]: 1,
            [SPECS.Druid.Restoration]: 1,
            [SPECS.Mage.Arcane]: 1,
            [SPECS.Mage.Fire]: 1,
            [SPECS.Mage.Frost]: 1,
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
    3854: {
        name: "Enchant Staff - Greater Spellpower",
        spellId: 62948,
        score: {
            [SPECS.Druid.Balance]: 1,
            [SPECS.Druid.Restoration]: 1,
            [SPECS.Mage.Arcane]: 1,
            [SPECS.Mage.Fire]: 1,
            [SPECS.Mage.Frost]: 1,
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
    3830: {
        name: "Enchant Weapon - Exceptional Spellpower",
        spellId: 44629,
        score: {
            [SPECS.Druid.Balance]: 0.5,
            [SPECS.Druid.Restoration]: 0.5,
            [SPECS.Mage.Arcane]: 0.5,
            [SPECS.Mage.Fire]: 0.5,
            [SPECS.Mage.Frost]: 0.5,
            [SPECS.Priest.Discipline]: 0.5,
            [SPECS.Priest.Holy]: 0.5,
            [SPECS.Priest.Shadow]: 0.5,
            [SPECS.Shaman.Elemental]: 0.5,
            [SPECS.Shaman.Restoration]: 0.5,
            [SPECS.Warlock.Affliction]: 0.5,
            [SPECS.Warlock.Demonology]: 0.5,
            [SPECS.Warlock.Destruction]: 0.5,
        }
    },
    3855: {
        name: "Enchant Staff - Spellpower",
        spellId: 62959,
        score: {
            [SPECS.Druid.Balance]: 0.5,
            [SPECS.Druid.Restoration]: 0.5,
            [SPECS.Mage.Arcane]: 0.5,
            [SPECS.Mage.Fire]: 0.5,
            [SPECS.Mage.Frost]: 0.5,
            [SPECS.Priest.Discipline]: 0.5,
            [SPECS.Priest.Holy]: 0.5,
            [SPECS.Priest.Shadow]: 0.5,
            [SPECS.Shaman.Elemental]: 0.5,
            [SPECS.Shaman.Restoration]: 0.5,
            [SPECS.Warlock.Affliction]: 0.5,
            [SPECS.Warlock.Demonology]: 0.5,
            [SPECS.Warlock.Destruction]: 0.5,
        }
    },
    3731: {
        name: "Titanium Weapon Chain",
        itemId: 41976,
        score: {
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Paladin.Justicar]: 1,
        }
    }
}