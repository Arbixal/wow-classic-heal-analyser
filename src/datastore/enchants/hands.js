import { SPECS, GROUPS } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    2613: {
        name: "Enchant Gloves - Threat",
        spellId: 25072,
        score: {
            [SPECS.Druid.Warden]: 1,
            [SPECS.Druid.Guardian]: 1,
        }
    },
    2937: {
        name: "Enchant Gloves - Major Spellpower",
        spellId: 33997,
        score: {}
    },
    2614: {
        name: "Enchant Gloves - Shadow Power",
        spellId: 25073,
        score: {}
    },
    2564: {
        name: "Enchant Gloves - Superior Agility",
        spellId: 25080,
        score: {
            [SPECS.Hunter.BeastMastery]: 0.5,
            [SPECS.Hunter.Marksmanship]: 0.5,
            [SPECS.Hunter.Survival]: 0.5,
        }
    },
    2322: {
        name: "Enchant Gloves - Major Healing",
        spellId: 33999,
        score: {}
    },
    1594: {
        name: "Enchant Gloves - Assault",
        spellId: 33996,
        score: {}
    },
    684: {
        name: "Enchant Gloves - Major Strength",
        spellId: 46515,
        score: {}
    },
    3260: {
        name: "Glove Reinforcements",
        itemId: 34207,
        score: {
            [SPECS.DeathKnight.Blood]: 1,
            [SPECS.DeathKnight.Runeblade]: 1,
        }
    },
    3234: {
        name: "Enchant Gloves - Precision",
        spellId: 44488,
        score: {
            [SPECS.DeathKnight.Blood]: 1,
            [SPECS.DeathKnight.Runeblade]: 1,
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Paladin.Justicar]: 1,
            [SPECS.Warrior.Protection]: 1,
            [SPECS.Warrior.Gladiator]: 1,
            [SPECS.Hunter.BeastMastery]: 0.5,
            [SPECS.Hunter.Marksmanship]: 0.5,
            [SPECS.Hunter.Survival]: 0.5,
        }
    },
    2935: {
        name: "Enchant Gloves - Precise Strikes",
        spellId: 33994,
        score: {
            [SPECS.DeathKnight.Blood]: 0.5,
            [SPECS.DeathKnight.Runeblade]: 0.5,
        }
    },
    3231: {
        name: "Enchant Gloves - Expertise",
        spellId: 44484,
        score: {
            [SPECS.DeathKnight.Blood]: 1,
            [SPECS.DeathKnight.Runeblade]: 1,
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Paladin.Justicar]: 1,
            [SPECS.Paladin.Retribution]: 0.5,
        }
    },
    3222: {
        name: "Enchant Gloves - Major Agility",
        spellId: 44529,
        score: {
            [SPECS.DeathKnight.Blood]: 0.5,
            [SPECS.DeathKnight.Runeblade]: 0.5,
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Paladin.Justicar]: 1,
            [SPECS.Warrior.Protection]: 1,
            [SPECS.Warrior.Gladiator]: 1,
            [SPECS.Hunter.BeastMastery]: 1,
            [SPECS.Hunter.Marksmanship]: 1,
            [SPECS.Hunter.Survival]: 1,
        }
    },
    3860: {
        name: "Reticulated Armor Webbing",
        spellId: 63770,
        score: {
            ...GROUPS.Tanks.BIS
        }
    },
    3253: {
        name: "Enchant Gloves - Armsman",
        spellId: 44625,
        score: {
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Paladin.Justicar]: 1,
            [SPECS.Warrior.Protection]: 1,
            [SPECS.Warrior.Gladiator]: 1,
        }
    },
    3604: {
        name: "Hyperspeed Accelerators",
        spellId: 54999,
        score: {
            ...GROUPS.PhysicalDPS.BIS,
            ...GROUPS.SpellDPS.BIS,
            ...GROUPS.Healers.BIS,
        }
    },
    1603: {
        name: "Enchant Gloves - Crusher",
        spellId: 60668,
        score: {
            [SPECS.DeathKnight.Frost]: 1,
            [SPECS.DeathKnight.Lichborne]: 1,
            [SPECS.DeathKnight.Unholy]: 1,
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
    3246: {
        name: "Enchant Gloves - Exceptional Spellpower",
        spellId: 44592,
        score: {
            ...GROUPS.SpellDPS.BIS,
            ...GROUPS.Healers.BIS,
        }
    },
    3603: {
        name: "Hand-Mounted Pyro Rocket",
        spellId: 54998,
        score: {}
    },
}