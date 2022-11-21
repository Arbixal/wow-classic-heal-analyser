import { SPECS, GROUPS } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    2979: {
        name: "Inscription of Faith",
        itemId: 28878,
        score: {}
    },
    2980: {
        name: "Greater Inscription of Faith",
        itemId: 28887,
        score: {...GROUPS.Healers.OK}
    },
    2715: {
        name: "Resilience of the Scourge",
        itemId: 23547,
        score: {...GROUPS.Healers.OK}
    },

    2992: {
        name: "Inscription of the Oracle",
        itemId: 28904,
        score: {}
    },
    2993: {
        name: "Greater Inscription of the Oracle",
        itemId: 28912,
        score: {...GROUPS.Healers.OK}
    },

    2996: {
        name: "Inscription of the Blade",
        itemId: 28907,
        score: {}
    },
    2997: {
        name: "Greater Inscription of the Blade",
        itemId: 28910,
        score: {}
    },
    2983: {
        name: "Inscription of Vengeance",
        itemId: 28885,
        score: {}
    },
    2986: {
        name: "Greater Inscription of Vengeance",
        itemId: 28888,
        score: {
            [SPECS.DeathKnight.Frost]: 0.5,
            [SPECS.DeathKnight.Lichborne]: 0.5,
            [SPECS.DeathKnight.Unholy]: 0.5,

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

    2977: {
        name: "Inscription of Warding",
        itemId: 28882,
        score: {}
    },
    2978: {
        name: "Greater Inscription of Warding",
        itemId: 28889,
        score: {...GROUPS.Tanks.OK}
    },
    2990: {
        name: "Inscription of the Knight",
        itemId: 28908,
        score: {}
    },
    2991: {
        name: "Greater Inscription of the Knight",
        itemId: 28911,
        score: {...GROUPS.Tanks.OK}
    },

    2981: {
        name: "Inscription of Discipline",
        itemId: 28881,
        score: {}
    },
    2982: {
        name: "Greater Inscription of Discipline",
        itemId: 28886,
        score: {
            [SPECS.Druid.Balance]: 0.5,
            [SPECS.Mage.Arcane]: 0.5,
            [SPECS.Mage.Fire]: 0.5,
            [SPECS.Mage.Frost]: 0.5,
            [SPECS.Paladin.Protection]: 0.5,
            [SPECS.Priest.Shadow]: 0.5,
            [SPECS.Shaman.Elemental]: 0.5,
            [SPECS.Warlock.Destruction]: 0.5,
            [SPECS.Warlock.Affliction]: 0.5,
            [SPECS.Warlock.Demonology]: 0.5,
        }
    },
    2994: {
        name: "Inscription of the Orb",
        itemId: 28903,
        score: {}
    },
    2995: {
        name: "Greater Inscription of the Orb",
        itemId: 28909,
        score: {}
    },

    // ZG
    2605: {
        name: "Zandalar Signet of Mojo",
        itemId: 20076,
        score: {}
    },
    2604: {
        name: "Zandalar Signet of Serenity",
        itemId: 20078,
        score: {}
    },

    // Naxx
    2716: {
        name: "Fortitude of the Scourge",
        itemId: 23549,
        score: {...GROUPS.Tanks.OK}
    },
    2721: {
        name: "Power of the Scourge",
        itemId: 23545,
        score: {
            [SPECS.Shaman.Elemental]: 0.5,
            [SPECS.Warlock.Destruction]: 0.5,
            [SPECS.Warlock.Affliction]: 0.5,
            [SPECS.Warlock.Demonology]: 0.5,
            [SPECS.Mage.Arcane]: 0.5,
            [SPECS.Mage.Fire]: 0.5,
            [SPECS.Mage.Frost]: 0.5,
        }
    },
    2717: {
        name: "Might of the Scourge",
        itemId: 23548,
        score: {}
    },

    // Resistance
    2998: {
        name: "Inscription of Endurance",
        itemId: 29187,
        score: {}
    },
    2487: {
        name: "Shadow Mantle of the Dawn",
        itemId: 18173,
        score: {}
    },
    2488: {
        name: "Chromatic Mantle of the Dawn",
        itemId: 18182,
        score: {}
    },
    2486: {
        name: "Nature Mantle of the Dawn",
        itemId: 18172,
        score: {}
    },
    2484: {
        name: "Frost Mantle of the Dawn",
        itemId: 18170,
        score: {}
    },
    2483: {
        name: "Flame Mantle of the Dawn",
        itemId: 18169,
        score: {}
    },
    2485: {
        name: "Arcane Mantle of the Dawn",
        itemId: 18171,
        score: {}
    },
    3852: {
        name: "Greater Inscription of the Gladiator",
        itemId: 44957,
        score: {...GROUPS.Tanks.BIS}
    },
    3837: {
        name: "Master's Inscription of the Pinnacle",
        spellId: 61119,
        score: { ...GROUPS.Tanks.OK }
    },
    3811: {
        name: "Greater Inscription of the Pinnacle",
        itemId: 50337,
        score: { ...GROUPS.Tanks.OK }
    },
    3876: {
        name: "Lesser Inscription of the Pinnacle",
        itemId: 44132,
        score: { ...GROUPS.Tanks.OK }
    },
    3835: {
        name: "Master's Inscription of the Axe",
        spellId: 61117,
        score: { 
            ...GROUPS.Tanks.OK,
            [SPECS.DeathKnight.Frost]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
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
        }
    },
    3808: {
        name: "Greater Inscription of the Axe",
        itemId: 50335,
        score: { 
            ...GROUPS.Tanks.OK,
            [SPECS.DeathKnight.Frost]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
            [SPECS.DeathKnight.Unholy]: 1,
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
        }
    },
    3875: {
        name: "Lesser Inscription of the Axe",
        itemId: 44131,
        score: {
            [SPECS.DeathKnight.Frost]: 0.5,
            [SPECS.DeathKnight.Lichborne]: 0.5,
            [SPECS.DeathKnight.Unholy]: 0.5,
            [SPECS.Druid.Feral]: 0.5,
            [SPECS.Hunter.BeastMastery]: 0.5,
            [SPECS.Hunter.Marksmanship]: 0.5,
            [SPECS.Hunter.Survival]: 0.5,
            [SPECS.Paladin.Retribution]: 0.5,
            [SPECS.Rogue.Assassination]: 0.5,
            [SPECS.Rogue.Combat]: 0.5,
            [SPECS.Rogue.Subtlety]: 0.5,
            [SPECS.Shaman.Enhancement]: 0.5,
            [SPECS.Warrior.Arms]: 0.5,
            [SPECS.Warrior.Fury]: 0.5,
            [SPECS.Warrior.Champion]: 0.5,
        }
    },
    3836: {
        name: "Master's Inscription of the Crag",
        spellId: 61118,
        score: {...GROUPS.Healers.BIS}
    },
    3809: {
        name: "Greater Inscription of the Crag",
        itemId: 44134,
        score: {...GROUPS.Healers.BIS}
    },
    3807: {
        name: "Lesser Inscription of the Crag",
        itemId: 44130,
        score: {...GROUPS.Healers.OK}
    },
    3838: {
        name: "Master's Inscription of the Storm",
        spellId: 61120,
        score: {
            [SPECS.Druid.Restoration]: 0.5,
            [SPECS.Druid.Balance]: 1,
            [SPECS.Paladin.Holy]: 1,
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Priest.Holy]: 0.5,
            [SPECS.Shaman.Restoration]: 1,
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
    3810: {
        name: "Greater Inscription of the Storm",
        itemId: 50338,
        score: {
            [SPECS.Druid.Restoration]: 0.5,
            [SPECS.Druid.Balance]: 1,
            [SPECS.Paladin.Holy]: 1,
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Priest.Holy]: 0.5,
            [SPECS.Shaman.Restoration]: 1,
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
    3806: {
        name: "Lesser Inscription of the Storm",
        itemId: 44129,
        score: {
            [SPECS.Druid.Restoration]: 0.5,
            [SPECS.Druid.Balance]: 0.5,
            [SPECS.Paladin.Holy]: 0.5,
            [SPECS.Priest.Discipline]: 0.5,
            [SPECS.Priest.Holy]: 0.5,
            [SPECS.Shaman.Restoration]: 0.5,
            [SPECS.Mage.Arcane]: 0.5,
            [SPECS.Mage.Fire]: 0.5,
            [SPECS.Mage.Frost]: 0.5,
            [SPECS.Priest.Shadow]: 0.5,
            [SPECS.Shaman.Elemental]: 0.5,
            [SPECS.Warlock.Affliction]: 0.5,
            [SPECS.Warlock.Demonology]: 0.5,
            [SPECS.Warlock.Destruction]: 0.5,
        }
    },
    3794: {
        name: "Inscription of Dominance",
        itemId: 44068,
        score: {
            [SPECS.Druid.Balance]: 0.5,
            [SPECS.Mage.Arcane]: 0.5,
            [SPECS.Mage.Fire]: 0.5,
            [SPECS.Mage.Frost]: 0.5,
            [SPECS.Priest.Shadow]: 0.5,
            [SPECS.Shaman.Elemental]: 0.5,
            [SPECS.Warlock.Affliction]: 0.5,
            [SPECS.Warlock.Demonology]: 0.5,
            [SPECS.Warlock.Destruction]: 0.5,
        }
    }
}