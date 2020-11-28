import {healingSpells, cooldownList} from "./data";

export class HealSummary {
    constructor() {
        this.manaPots = 0;
        this.runes = 0;
        this.manaGained = 0;
        this.castsStarted = 0;
        this.castsCompleted = 0;
        this.effectiveHeals = 0;
        this.overHeal = 0;
        this.wastedHeals = 0;
        this.wastedMana = 0;
        this.cooldowns = [];
    }

    getCastsPercent() { return (this.castsStarted > 0 ? this.castsCompleted / this.castsStarted * 100 : 0).toFixed(2); }
    getTotalHeals() { return this.effectiveHeals + this.overHeal; }
    getEffectivePercent() { return (this.getTotalHeals() > 0 ? this.effectiveHeals / this.getTotalHeals() * 100 : 0).toFixed(2); }
    getOverhealPercent() { return (this.getTotalHeals() > 0 ? this.overHeal / this.getTotalHeals() * 100 : 0).toFixed(2); }
    getWastedPercent() { return (this.getTotalHeals() > 0 ? this.wastedHeals / this.getTotalHeals() * 100 : 0).toFixed(2); }
}

export function getHealSummary(collection, event, getOrCreate) {
    
    let aggregate = getOrCreate(collection, event);

    if (!aggregate) {
        return;
    }

    if (event.ability.guid === 27869 || event.ability.guid === 16666) {
        aggregate.runes++;
        aggregate.manaGained += 1500;
    }

    if (event.ability.guid === 17531) {
        aggregate.manaPots++;
        aggregate.manaGained += 2250;
    }

    let spellInfo = healingSpells[event.ability.guid];

    if (spellInfo)
    {
        if (event.type === "begincast") {
            aggregate.castsStarted++;
        } else if (event.type === "cast") {
            if (spellInfo.castTime === 0) {
                aggregate.castsStarted++;
            }
            aggregate.castsCompleted++;
        }
    } else {
        console.log("Not healing spell: " + event.ability.name + " (" + event.ability.guid + ")");
    }

    if (event.type === "heal" || event.type === "absorbed") {
        if (event.amount) {
            aggregate.effectiveHeals += event.amount;
        }
        if (event.overheal) {
            aggregate.overHeal += event.overheal;
            if (event.amount === 0) {
                aggregate.wastedHeals += event.overheal;
                if (event.tick && spellInfo && spellInfo.ticks) {
                    aggregate.wastedMana += Math.round(spellInfo.mana * spellInfo.tickPortion / spellInfo.ticks);
                } else {
                    aggregate.wastedMana += spellInfo ? spellInfo.mana : 0;
                }
            }
        }
    }

    if (event.type === "cast" && cooldownList[event.ability.guid]) {
        aggregate.cooldowns.push(cooldownList[event.ability.guid]);
    }

}