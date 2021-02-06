import {offhandFrills} from "./data";

class WarcraftLogLoader {
    constructor() {
        this.key = "e422378c419a25cc1accb41845b259ab";
        this.domain = "https://classic.warcraftlogs.com/v1/";
        this.reportId = null;
    }

    setReport(reportId) {
        this.reportId = reportId;
    }

    getFights() {
        return fetch(this.domain + "report/fights/" + this.reportId + "?api_key=" + this.key)
                .then(res => res.json());
    }

    getHealEvents(start_time, end_time) {
        return Promise.all([
            this.getClassHealEvents(start_time, end_time, "priest"),
            this.getClassHealEvents(start_time, end_time, "druid"),
            this.getClassHealEvents(start_time, end_time, "shaman"),
            this.getClassHealEvents(start_time, end_time, "paladin"),

            this.getClassCastEvents(start_time, end_time, "priest"),
            this.getClassCastEvents(start_time, end_time, "druid"),
            this.getClassCastEvents(start_time, end_time, "shaman"),
            this.getClassCastEvents(start_time, end_time, "paladin"),

            //this.getManaRegeneration(start_time, end_time),

            this.getProtectionPotionHealingEvents(start_time, end_time),
            this.getProtectionPotionCastEvents(start_time, end_time),
        ])
        //.then(res => Promise.all(res.map(response => response.json())))
        .then(res => new Promise((resolve, _reject) => resolve(res.reduce((accum,current) => {
            accum = [...accum, ...current];

            return accum;
        }, []))));
    }

    getHealerInfo(start_time, end_time) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/tables/summary/" + this.reportId
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time)
        .then(response => response.json())
        .then(data => {
            let healerData = [];
            if (!data.playerDetails.healers) {
                resolve(healerData);
                return;
            }

            healerData = data.playerDetails.healers.reduce((acc, obj) => {
                let playerId = obj["id"];

                const slots = {
                    0: { enchantable: true, name: "Head" },
                    1: { enchantable: false, name: "Neck" },
                    2: { enchantable: true, name: "Shoulders" },
                    3: { enchantable: false, name: "Shirt" },
                    4: { enchantable: true, name: "Chest" },
                    5: { enchantable: false, name: "Waist" },
                    6: { enchantable: true, name: "Legs" },
                    7: { enchantable: true, name: "Feet" },
                    8: { enchantable: true, name: "Arms" },
                    9: { enchantable: true, name: "Hands" },
                    10: { enchantable: false, name: "Ring 1" },
                    11: { enchantable: false, name: "Ring 2" },
                    12: { enchantable: false, name: "Trinket 1" },
                    13: { enchantable: false, name: "Trinket 2" },
                    14: { enchantable: true, name: "Back" },
                    15: { enchantable: true, name: "Main Hand" },
                    16: { enchantable: true, name: "Off Hand" },
                    17: { enchantable: false, name: "Ranged" },
                    18: { enchantable: false, name: "Tabard" }
                };

                let enchants = obj.combatantInfo.gear.reduce((enchant, gear) => {
                    
                    if (slots[gear.slot].enchantable && gear.id !== 0 && !offhandFrills[gear.id])
                    {
                        enchant.permanentEnchants.push({slot: gear.slot, slotname: slots[gear.slot].name, id: gear.permanentEnchant, name: gear.permanentEnchantName})
                    }

                    if (gear.slot === 15) {
                        enchant.weaponEnchant.id = gear.temporaryEnchant;
                        enchant.weaponEnchant.name = gear.temporaryEnchantName;
                    }

                    return enchant;
                }, { permanentEnchants: [], weaponEnchant: {}});
                
                acc[playerId] = {
                    id: playerId,
                    name: obj.name,
                    type: obj.type,
                    intellect: obj.combatantInfo.stats.Intellect.max,
                    stamina: obj.combatantInfo.stats.Stamina.max,
                    weaponEnchant: enchants.weaponEnchant,
                    enchants: enchants.permanentEnchants
                };

                return acc;
            }, {});

            resolve(healerData);
        }).catch(reject));
    }

    getTankInfo(start_time, end_time, context = null) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/tables/summary/" + this.reportId
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time)
        .then(response => response.json())
        .then(data => {
            let tankData = [];
            if (data.playerDetails.tanks) {

                tankData = data.playerDetails.tanks.reduce((acc, obj) => {
                    let playerId = obj["id"];
                    
                    acc[playerId] = {
                        id: playerId,
                        name: obj.name,
                        type: obj.type,
                        armor: obj.combatantInfo?.stats?.Armor?.max,
                        stamina: obj.combatantInfo?.stats?.Stamina?.max,
                        strength: obj.combatantInfo?.stats?.Strength?.max,
                        agility: obj.combatantInfo?.stats?.Agility?.max
                    };

                    return acc;
                }, {});
            }

            resolve({context: context, data: tankData});
        }).catch(reject));
    }

    /* getManaRegeneration(start_time, end_time, events = []) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/events/resources/" + this.reportId
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time
        + "&abilityid=100")
        .then(response =>  {
            if (response.status !== 200) {
                throw new Error(`${response.stats}: ${response.statusText}`);
            }
            response.json().then(data => {
                events = events.concat(data.events.filter(obj => obj.ability.guid === 18194));

                if (data.nextPageTimestamp) {
                    this.getManaRegeneration(data.nextPageTimestamp, end_time, events)
                    .then(resolve).catch(reject);
                } else {
                    resolve(events);
                }
            }).catch(reject);
        }).catch(reject));
    } */

    getProtectionPotionHealingEvents(start_time, end_time, events = []) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/events/healing/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time
        + "&filter=ability.id=17546 OR ability.id=7254 OR ability.id=17548 OR ability.id=7242 OR ability.id=17544 OR ability.id=7240 OR ability.id=17543 OR ability.id=7230 OR ability.id=17549")
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`${response.stats}: ${response.statusText}`);
            }
            response.json().then(data => {
                events = events.concat(data.events);

                if (data.nextPageTimestamp) {
                    this.getProtectionPotionHealingEvents(data.nextPageTimestamp, end_time, events)
                    .then(resolve).catch(reject);
                } else {
                    resolve(events);
                }
            }).catch(reject);
        }).catch(reject));
    }

    getProtectionPotionCastEvents(start_time, end_time, events = []) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/events/casts/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time
        + "&filter=ability.id=17546 OR ability.id=7254 OR ability.id=17548 OR ability.id=7242 OR ability.id=17544 OR ability.id=7240 OR ability.id=17543 OR ability.id=7230 OR ability.id=17549")
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`${response.stats}: ${response.statusText}`);
            }
            response.json().then(data => {
                events = events.concat(data.events);

                if (data.nextPageTimestamp) {
                    this.getProtectionPotionCastEvents(data.nextPageTimestamp, end_time, events)
                    .then(resolve).catch(reject);
                } else {
                    resolve(events);
                }
            }).catch(reject);
        }).catch(reject));
    }

    getClassHealEvents(start_time, end_time, sourceClass, events = []) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/events/healing/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time
        + "&sourceclass=" + sourceClass)
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`${response.stats}: ${response.statusText}`);
            }
            response.json().then(data => {
                events = events.concat(data.events);

                if (data.nextPageTimestamp) {
                    this.getClassHealEvents(data.nextPageTimestamp, end_time, sourceClass, events)
                    .then(resolve).catch(reject);
                } else {
                    resolve(events);
                }
            }).catch(reject);
        }).catch(reject));
    }

    getClassCastEvents(start_time, end_time, sourceClass, events = []) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/events/casts/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time
        + "&sourceclass=" + sourceClass)
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`${response.stats}: ${response.statusText}`);
            }
            response.json().then(data => {
                events = events.concat(data.events);

                if (data.nextPageTimestamp) {
                    this.getClassCastEvents(data.nextPageTimestamp, end_time, sourceClass, events)
                    .then(resolve).catch(reject);
                } else {
                    resolve(events);
                }
            }).catch(reject);
        }).catch(reject));
    }

    getCharacterCastTable(start_time, end_time, sourceid, sourcename) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/tables/casts/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time
        + "&sourceid=" + sourceid)
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`${response.stats}: ${response.statusText}`);
            }
            response.json().then(data => {
                resolve({ id: sourceid, name: sourcename, entries: data.entries })
            }).catch(reject);
        }).catch(reject));
    }

    getArmorBuffUptime(start_time, end_time, context = null) {
        return Promise.all([
            this.getBuffUptime(start_time, end_time, 15359), // Inspiration (Rank 3)
            this.getBuffUptime(start_time, end_time, 16237), // Ancestral Fortitude (Rank 3)
        ])
        .then(res => new Promise((resolve, _reject) => resolve(res.reduce((accum,current) => {
            current.reduce((innerAccum, character) => {
                if (!innerAccum[character.id]) {
                    innerAccum[character.id] = character;
                }
                else {
                    // Join together
                    let existingCharacter = innerAccum[character.id];
                    existingCharacter.totalUptime += character.totalUptime;
                    existingCharacter.totalUses += character.totalUses;
                    existingCharacter.bands = [...existingCharacter.bands, ...character.bands];
                    existingCharacter.bands = existingCharacter.bands.sort((x, y) => x.startTime - y.startTime);
                }

                return innerAccum;
            }, accum)

            return accum;
        }, {}))))
        .then(results => new Promise((resolve,_reject) => resolve({context: context, data: results})));
    }

    getBuffUptime(start_time, end_time, abilityid) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/tables/buffs/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time
        + "&abilityid=" + abilityid)
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`${response.stats}: ${response.statusText}`);
            }
            response.json().then(data => {
                resolve(data.auras)
            }).catch(reject);
        }).catch(reject));
    }
}

export let LogLoader = new WarcraftLogLoader();