import { SPECS, GROUPS } from "./common";


// eslint-disable-next-line import/no-anonymous-default-export
export default {
    3001: {
        name: "Arcanum of Renewal",
        itemId: 29190,
        score: {...GROUPS.Healers.OK}
    },
    3003: {
        name: "Arcanum of Ferocity",
        itemId: 29192,
        score: {
            [SPECS.DeathKnight.Frost]: 0.5,
            [SPECS.DeathKnight.Unholy]: 0.5,
            [SPECS.Druid.Guardian]: 0.5,
            [SPECS.Druid.Warden]: 0.5,
            [SPECS.Druid.Feral]: 0.5,
            [SPECS.Rogue.Combat]: 0.5,
            [SPECS.Rogue.Subtlety]: 0.5,
            [SPECS.Rogue.Assassination]: 0.5,
            [SPECS.Shaman.Enhancement]: 0.5,
            [SPECS.Paladin.Retribution]: 0.5,
            [SPECS.Warrior.Arms]: 0.5,
            [SPECS.Warrior.Fury]: 0.5,
            [SPECS.Warrior.Gladiator]: 0.5,
            [SPECS.Hunter.BeastMastery]: 0.5,
            [SPECS.Hunter.Survival]: 0.5,
            [SPECS.Hunter.Marksmanship]: 0.5,
        }
    },
    3096: {
        name: "Arcanum of the Outcast",
        itemId: 30846,
        score: {}
    },
    3002: {
        name: "Arcanum of Power",
        itemId: 29191,
        score: {
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
    2999: {
        name: "Arcanum of the Defender",
        itemId: 29186,
        score: {...GROUPS.Tanks.OK}
    },

    2583: {
        name: "Presence of Might",
        itemId: 19782,
        score: {}
    },

    // Resistance
    3007: {
        name: "Glyph of Fire Warding",
        itemId: 29197,
        score: {}
    },
    3008: {
        name: "Glyph of Frost Warding",
        itemId: 29198,
        score: {}
    },
    3005: {
        name: "Glyph of Nature Warding",
        itemId: 29194,
        score: {}
    },
    3009: {
        name: "Glyph of Shadow Warding",
        itemId: 29199,
        score: {}
    },
    3817: {
        name: "Arcanum of Torment",
        itemId: 44149,
        score: {
            [SPECS.DeathKnight.Frost]: 1,
            [SPECS.DeathKnight.Unholy]: 1,
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
        }
    },
    3818: {
        name: "Arcanum of the Stalwart Protector",
        itemId: 44878,
        score: {
            [SPECS.DeathKnight.Blood]: 1,
            [SPECS.DeathKnight.Runeblade]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
            [SPECS.Druid.Guardian]: 1,
            [SPECS.Druid.Warden]: 1,
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Paladin.Justicar]: 1,
            [SPECS.Warrior.Protection]: 1,
            [SPECS.Warrior.Champion]: 1,
        }
    },
    3842: {
        name: "Arcanum of the Savage Gladiator",
        itemId: 44875,
        score: {
            [SPECS.DeathKnight.Blood]: 1,
            [SPECS.DeathKnight.Runeblade]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
        }
    },
    3795: {
        name: "Arcanum of Triumph",
        itemId: 44069,
        score: {
            [SPECS.DeathKnight.Frost]: 0.5,
            [SPECS.DeathKnight.Unholy]: 0.5,
        }
    },
    3820: {
        name: "Arcanum of Burning Mysteries",
        itemId: 50368,
        score: {
            [SPECS.Druid.Balance]: 1,
            [SPECS.Druid.Restoration]: 0.5,
            [SPECS.Mage.Arcane]: 1,
            [SPECS.Mage.Fire]: 1,
            [SPECS.Mage.Frost]: 1,
            [SPECS.Paladin.Holy]: 1,
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Priest.Holy]: 0.5,
            [SPECS.Priest.Shadow]: 1,
            [SPECS.Shaman.Elemental]: 1,
            [SPECS.Shaman.Restoration]: 1,
            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
            [SPECS.Warlock.Destruction]: 1,
        }
    },
    3797: {
        name: "Arcanum of Dominance",
        itemId: 44075,
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
    },
    3878: {
        name: "Mind Amplification Dish",
        spellId: 67839,
        score: {
            [SPECS.DeathKnight.Blood]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
            [SPECS.DeathKnight.Runeblade]: 1,
            [SPECS.Druid.Guardian]: 1,
            [SPECS.Druid.Warden]: 1,
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Paladin.Justicar]: 1,
            [SPECS.Warrior.Protection]: 1,
            [SPECS.Warrior.Champion]: 1,
        }
    },
    3819: {
        name: "Arcanum of Blissful Mending",
        itemId: 50370,
        score: {...GROUPS.Healers.BIS}
    }
}