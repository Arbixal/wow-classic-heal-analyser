import { SPECS, GROUPS } from "./common";


// eslint-disable-next-line import/no-anonymous-default-export
export default {
    3001: {
        name: "Glyph of Renewal",
        itemId: 29190,
        score: {...GROUPS.Healers.BIS}
    },
    3003: {
        name: "Glyph of Ferocity",
        itemId: 29192,
        score: {
            [SPECS.Druid.Guardian]: 1,
            [SPECS.Druid.Warden]: 1,
            [SPECS.Druid.Feral]: 1,
            [SPECS.Rogue.Combat]: 1,
            [SPECS.Rogue.Subtlety]: 1,
            [SPECS.Rogue.Assassination]: 1,
            [SPECS.Shaman.Enhancement]: 1,
            [SPECS.Paladin.Retribution]: 1,
            [SPECS.Warrior.Arms]: 1,
            [SPECS.Warrior.Fury]: 1,
            [SPECS.Hunter.BeastMastery]: 1,
            [SPECS.Hunter.Survival]: 1,
            [SPECS.Hunter.Marksmanship]: 1,
        }
    },
    3096: {
        name: "Glyph of the Outcast",
        itemId: 30846,
        score: {
            [SPECS.Paladin.Retribution]: 1,
        }
    },
    3002: {
        name: "Glyph of Power",
        itemId: 29191,
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
    2999: {
        name: "Glyph of the Defender",
        itemId: 29186,
        score: {...GROUPS.Tanks.BIS}
    },
}