import { itemSlots } from "../../data";
import { SPECS, GROUPS } from "./common";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    2617: {
        name: "Enchant Bracer - Superior Healing",
        spellId: 27911,
        score: {}
    },
    2566: {
        name: "Enchant Bracer - Healing Power",
        spellId: 23802,
        score: {}
    },
    2649: {
        name: "Enchant Bracer - Fortitude",
        bySlot: {
            [itemSlots.Wrists]: {
                spellId: 27914,
                score: {
                    ...GROUPS.Tanks.OK,
                }
            },
        }
    },
    2648: {
        name: "Enchant Bracer - Major Defense",
        spellId: 27906,
        score: {...GROUPS.Tanks.OK}
    },
    2650: {
        name: "Enchant Bracer - Spellpower",
        spellId: 27917,
        score: {}
    },
    2647: {
        name: "Enchant Bracer - Brawn",
        spellId: 27899,
        score: {}
    },
    1593: {
        name: "Enchant Bracer - Assault",
        spellId: 34002,
        score: {}
    },
    1891: {
        name: "Enchant Bracer - Stats",
        spellId: 27905,
        score: {}
    },
    369: {
        name: "Enchant Bracer - Major Intellect",
        spellId: 34001,
        score: {}
    },
    3850: {
        name: "Enchant Bracer - Major Stamina",
        spellId: 62256,
        score: {
            ...GROUPS.Tanks.BIS
        }
    },
    3757: {
        name: "Fur Lining - Stamina",
        spellId: 57690,
        score: {
            ...GROUPS.Tanks.BIS
        }
    },
    3756: {
        name: "Fur Lining - Attack Power",
        spellId: 57683,
        score: {
            ...GROUPS.PhysicalDPS.BIS
        }
    },
    3845: {
        name: "Enchant Bracers - Greater Assault",
        spellId: 44575,
        score: {
            ...GROUPS.PhysicalDPS.BIS
        }
    },
    1600: {
        name: "Enchant Bracers - Striking",
        spellId: 60616,
        score: {
            ...GROUPS.PhysicalDPS.OK
        }
    },
    3231: {
        name: "Enchant Bracers - Expertise",
        spellId: 44598,
        score: {
            ...GROUPS.PhysicalDPS.OK
        }
    },
    3758: {
        name: "Fur Lining - Spell Power",
        spellId: 57691,
        score: {
            ...GROUPS.SpellDPS.BIS,
            [SPECS.Druid.Restoration]: 1,
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Priest.Holy]: 1,
            [SPECS.Shaman.Restoration]: 1,
            [SPECS.Paladin.Holy]: 0.5,
        }
    },
    2332: {
        name: "Enchant Bracers - Superior Spellpower",
        spellId: 60767,
        score: {
            ...GROUPS.SpellDPS.BIS,
            [SPECS.Druid.Restoration]: 1,
            [SPECS.Paladin.Holy]: 0.5,
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Priest.Holy]: 1,
            [SPECS.Shaman.Restoration]: 1,
        }
    },
    2326: {
        name: "Enchant Bracers - Greater Spellpower",
        spellId: 44635,
        score: {
            ...GROUPS.SpellDPS.OK,
            [SPECS.Druid.Restoration]: 0.5,
            [SPECS.Paladin.Holy]: 0.5,
            [SPECS.Priest.Discipline]: 0.5,
            [SPECS.Priest.Holy]: 0.5,
            [SPECS.Shaman.Restoration]: 0.5,
        }
    },
    1119: {
        name: "Enchant Bracers - Exceptional Intellect",
        spellId: 44555,
        score: {
            [SPECS.Paladin.Holy]: 1,
            [SPECS.Priest.Holy]: 1,
        }
    },
}