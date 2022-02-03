// Spec list
// Druid
// Druid-Restoration
// Druid-Balance
// Druid-Guardian
// Druid-Feral
// Hunter
// Hunter-BeastMastery
// Hunter-Survival
// Hunter-Marksmanship
// Mage
// Mage-Fire
// Mage-Arcane
// Mage-Frost
// Paladin
// Paladin-Retribution
// Paladin-Holy
// Paladin-Protection
// Priest
// Priest-Holy
// Priest-Discipline
// Priest-Shadow
// Rogue
// Rogue-Combat
// Rogue-Subtlety
// Rogue-Assassination
// Shaman
// Shaman-Restoration
// Shaman-Enhancement
// Shaman-Elemental
// Warlock
// Warlock-Destruction
// Warlock-Affliction
// Warlock-Demonology
// Warrior
// Warrior-Arms
// Warrior-Fury
// Warrior-Protection

export const SPECS = {
    Druid: {
        Balance: "Druid-Balance",
        Dreamstate: "Druid-Dreamstate",
        Feral: "Druid-Feral",
        Guardian: "Druid-Guardian",
        Restoration: "Druid-Restoration",
        Warden: "Druid-Warden",
    },
    Hunter: {
        BeastMastery: "Hunter-BeastMastery",
        Marksmanship: "Hunter-Marksmanship",
        Survival: "Hunter-Survival",
    },
    Mage: {
        Arcane: "Mage-Arcane",
        Fire: "Mage-Fire",
        Frost: "Mage-Frost",
    },
    Rogue: {
        Assassination: "Rogue-Assassination",
        Combat: "Rogue-Combat",
        Subtlety: "Rogue-Subtlety",
    },
    Shaman: {
        Elemental: "Shaman-Elemental",
        Enhancement: "Shaman-Enhancement",
        Restoration: "Shaman-Restoration",
    },
    Paladin: {
        Holy: "Paladin-Holy",
        Protection: "Paladin-Protection",
        Retribution: "Paladin-Retribution",
    },
    Priest: {
        Discipline: "Priest-Discipline",
        Holy: "Priest-Holy",
        Shadow: "Priest-Shadow",
    },
    Warlock: {
        Affliction: "Warlock-Affliction",
        Demonology: "Warlock-Demonology",
        Destruction: "Warlock-Destruction",
    },
    Warrior: {
        Arms: "Warrior-Arms",
        Fury: "Warrior-Fury",
        Protection: "Warrior-Protection",
    }
}

export const GROUPS = {
    Healers: {
        BIS: {
            [SPECS.Druid.Restoration]: 1,
            [SPECS.Druid.Dreamstate]: 1,
            [SPECS.Shaman.Restoration]: 1,
            [SPECS.Priest.Holy]: 1,
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Paladin.Holy]: 1
        },
        OK: {
            [SPECS.Druid.Restoration]: 0.5,
            [SPECS.Druid.Dreamstate]: 0.5,
            [SPECS.Shaman.Restoration]: 0.5,
            [SPECS.Priest.Holy]: 0.5,
            [SPECS.Priest.Discipline]: 0.5,
            [SPECS.Paladin.Holy]: 0.5
        },
    },
    Tanks: {
        BIS: {
            [SPECS.Warrior.Protection]: 1,
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Druid.Guardian]: 1,
            [SPECS.Druid.Warden]: 1,
        },
        OK: {
            [SPECS.Warrior.Protection]: 0.5,
            [SPECS.Paladin.Protection]: 0.5,
            [SPECS.Druid.Guardian]: 0.5,
            [SPECS.Druid.Warden]: 0.5,
        }
    }
}