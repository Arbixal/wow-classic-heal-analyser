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
        Gladiator: "Warrior-Gladiator",
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
            [SPECS.Warrior.Gladiator]: 1,
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Druid.Guardian]: 1,
            [SPECS.Druid.Warden]: 1,
        },
        OK: {
            [SPECS.Warrior.Protection]: 0.5,
            [SPECS.Warrior.Gladiator]: 0.5,
            [SPECS.Paladin.Protection]: 0.5,
            [SPECS.Druid.Guardian]: 0.5,
            [SPECS.Druid.Warden]: 0.5,
        }
    },
    All: {
        BIS: {
            [SPECS.Druid.Balance]: 1,
            [SPECS.Druid.Dreamstate]: 1,
            [SPECS.Druid.Feral]: 1,
            [SPECS.Druid.Guardian]: 1,
            [SPECS.Druid.Restoration]: 1,
            [SPECS.Druid.Warden]: 1,
            [SPECS.Hunter.BeastMastery]: 1,
            [SPECS.Hunter.Marksmanship]: 1,
            [SPECS.Hunter.Survival]: 1,
            [SPECS.Mage.Arcane]: 1,
            [SPECS.Mage.Fire]: 1,
            [SPECS.Mage.Frost]: 1,
            [SPECS.Paladin.Holy]: 1,
            [SPECS.Paladin.Protection]: 1,
            [SPECS.Paladin.Retribution]: 1,
            [SPECS.Priest.Discipline]: 1,
            [SPECS.Priest.Holy]: 1,
            [SPECS.Priest.Shadow]: 1,
            [SPECS.Rogue.Assassination]: 1,
            [SPECS.Rogue.Combat]: 1,
            [SPECS.Rogue.Subtlety]: 1,
            [SPECS.Shaman.Elemental]: 1,
            [SPECS.Shaman.Enhancement]: 1,
            [SPECS.Shaman.Restoration]: 1,
            [SPECS.Warlock.Affliction]: 1,
            [SPECS.Warlock.Demonology]: 1,
            [SPECS.Warlock.Destruction]: 1,
            [SPECS.Warrior.Arms]: 1,
            [SPECS.Warrior.Fury]: 1,
            [SPECS.Warrior.Gladiator]: 1,
            [SPECS.Warrior.Protection]: 1,
        },
        OK: {
            [SPECS.Druid.Balance]: 0.5,
            [SPECS.Druid.Dreamstate]: 0.5,
            [SPECS.Druid.Feral]: 0.5,
            [SPECS.Druid.Guardian]: 0.5,
            [SPECS.Druid.Restoration]: 0.5,
            [SPECS.Druid.Warden]: 0.5,
            [SPECS.Hunter.BeastMastery]: 0.5,
            [SPECS.Hunter.Marksmanship]: 0.5,
            [SPECS.Hunter.Survival]: 0.5,
            [SPECS.Mage.Arcane]: 0.5,
            [SPECS.Mage.Fire]: 0.5,
            [SPECS.Mage.Frost]: 0.5,
            [SPECS.Paladin.Holy]: 0.5,
            [SPECS.Paladin.Protection]: 0.5,
            [SPECS.Paladin.Retribution]: 0.5,
            [SPECS.Priest.Discipline]: 0.5,
            [SPECS.Priest.Holy]: 0.5,
            [SPECS.Priest.Shadow]: 0.5,
            [SPECS.Rogue.Assassination]: 0.5,
            [SPECS.Rogue.Combat]: 0.5,
            [SPECS.Rogue.Subtlety]: 0.5,
            [SPECS.Shaman.Elemental]: 0.5,
            [SPECS.Shaman.Enhancement]: 0.5,
            [SPECS.Shaman.Restoration]: 0.5,
            [SPECS.Warlock.Affliction]: 0.5,
            [SPECS.Warlock.Demonology]: 0.5,
            [SPECS.Warlock.Destruction]: 0.5,
            [SPECS.Warrior.Arms]: 0.5,
            [SPECS.Warrior.Fury]: 0.5,
            [SPECS.Warrior.Gladiator]: 0.5,
            [SPECS.Warrior.Protection]: 0.5,
        }
    },
}