import {gemList, offhandFrills} from "./data";
import {removeDuplicates} from "./utils";

export class WarcraftLogLoader {
    constructor(reportId = null) {
        this.key = "e422378c419a25cc1accb41845b259ab";
        this.domain = "https://classic.warcraftlogs.com/v1/";
        this.reportId = reportId;
        this.Results = {};
        this._loadedStatus = {
            fights: false,
            characterSummaries: false,
            deaths: false,
            character: {
                details: {},
                casts: {},
                buffs: {},
                damageTaken: {},
                protectionPots: {},
            }
        }
    }

    static Load(reportId) {
        return new WarcraftLogLoader(reportId);
    }

    setReport(reportId) {
        this.reportId = reportId;
    }

    loadFights() {
        if (this._loadedStatus.fights) {
            return new Promise(resolve => resolve(this));
        }

        return fetch(this.domain + "report/fights/" + this.reportId + "?api_key=" + this.key)
            .then(res => res.json())
            .then(res => {
                this.Results.Fights = res.fights;
                this.Results.FightType = res.fights.reduce((acc,obj) => {
                    acc[obj.id] = (obj.boss > 0 ? "boss" : "trash");

                    return acc;
                }, {})
                this.Results.Characters = res.friendlies.reduce((acc,obj) => {
                    acc[obj.id] = obj;

                    acc[obj.id].raidStartTime = res.fights[obj.fights[0].id-1].start_time;

                    return acc;
                }, {});
                // Add pet information to their owner
                res.friendlyPets.forEach((pet) => {
                    if (!this.Results.Characters[pet.petOwner])
                        return;

                    this.Results.Characters[pet.petOwner].pets = [...(this.Results.Characters[pet.petOwner].pets || []),pet];
                })
                this.Results.startTime = res.fights[0].start_time;
                this.Results.endTime = res.fights[res.fights.length-1].end_time;

                this._loadedStatus.fights = true;

                return this;
            });
    }

    loadCharacterSummary() {
        if (!this._loadedStatus.fights) {
            return new Promise((_resolve, reject) => reject("Fights have not yet been loaded."));
        }

        if (this._loadedStatus.characterSummaries) {
            return new Promise(resolve => resolve(this));
        }

        return new Promise((resolve, reject) => fetch(this.domain + "report/tables/summary/" + this.reportId
        + "?api_key=" + this.key 
        + "&start=" + this.Results.startTime
        + "&end=" + this.Results.endTime)
        .then(response => response.json())
        .then(data => {
            let playerData = [];

            if (data.playerDetails?.tanks) {
                playerData = data.playerDetails.tanks.reduce(this._reducePlayerDetails("tank"), {});
            }

            if (data.playerDetails?.healers) {
                playerData = data.playerDetails.healers.reduce(this._reducePlayerDetails("healer"), playerData);
            }

            if (data.playerDetails?.dps) {
                playerData = data.playerDetails.dps.reduce(this._reducePlayerDetails("dps"), playerData);
            }

            for (const [key,value] of Object.entries(playerData)) {
                let playerInfo = this.Results.Characters[key];

                playerInfo.roles = value.roles;
                playerInfo.intellect = value.intellect;
                playerInfo.armor = value.armor;
                playerInfo.stamina = value.stamina;
                playerInfo.strength = value.strength;
                playerInfo.agility = value.agility;
                playerInfo.weaponEnchant = value.weaponEnchant;
                playerInfo.enchants = value.enchants;
                playerInfo.gems = value.gems;
            }

            this._loadedStatus.characterSummaries = true;

            resolve(this);
        }).catch(reject));
    }

    loadDeaths() {
        if (!this._loadedStatus.fights) {
            return new Promise((_resolve, reject) => reject("Fights have not yet been loaded."));
        }

        if (this._loadedStatus.deaths) {
            return new Promise(resolve => resolve(this));
        }

        return new Promise((resolve, reject) => fetch(this.domain + "report/tables/deaths/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + this.Results.startTime
        + "&end=" + this.Results.endTime)
        .then(response => response.json())
        .then(data => {
            data.entries.forEach((obj) => {
                let character = this.Results.Characters[obj.id];

                if (!character) {
                    return;
                }

                character.deaths = [...(character.deaths || []),obj];
            })

            this._loadedStatus.deaths = true;

            resolve(this);
        }).catch(reject));
    }

    loadCharacterDetails(playerid) {
        if (!this._loadedStatus.fights) {
            return new Promise((_resolve, reject) => reject("Fights have not yet been loaded."));
        }

        if (this._loadedStatus.character.details[playerid]) {
            return new Promise(resolve => resolve(this));
        }

        return Promise.all([
            this._loadCharacterCasts(playerid),
            this._loadCharacterBuffs(playerid),
            this._loadProtectionPots(playerid),
            this._loadCharacterDamageTaken(playerid),
        ])
        .then((_data) => {
            this._loadedStatus.character.details[playerid] = true;

            return new Promise((resolve, _reject) => resolve(this))
        })
    }

    _loadCharacterCasts(playerid) {
        if (!this._loadedStatus.fights) {
            return new Promise((_resolve, reject) => reject("Fights have not yet been loaded."));
        }

        if (this._loadedStatus.character.casts[playerid]) {
            return new Promise(resolve => resolve(this));
        }

        return new Promise((resolve, reject) => fetch(this.domain + "report/events/casts/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + this.Results.startTime
        + "&end=" + this.Results.endTime
        + "&sourceid=" + playerid)
        .then(response => response.json())
        .then(data => {
            data.events.forEach((obj) => {
                let character = this.Results.Characters[playerid];

                if (!character) {
                    return;
                }

                obj.fightType = this.Results.FightType[obj.fight];

                character.casts = [...(character.casts || []),obj];
            })

            this._loadedStatus.character.casts[playerid] = true;

            resolve(this);
        }).catch(reject));
    }

    _loadCharacterBuffs(playerid) {
        if (!this._loadedStatus.fights) {
            return new Promise((_resolve, reject) => reject("Fights have not yet been loaded."));
        }

        if (this._loadedStatus.character.buffs[playerid]) {
            return new Promise(resolve => resolve(this));
        }

        return new Promise((resolve, reject) => fetch(this.domain + "report/tables/buffs/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + this.Results.startTime
        + "&end=" + this.Results.endTime
        + "&sourceid=" + playerid)
        .then(response => response.json())
        .then(data => {
            data.auras.forEach((obj) => {
                let character = this.Results.Characters[playerid];

                if (!character) {
                    return;
                }

                character.buffs = {...character.buffs, [obj.guid]: obj};
            })

            this._loadedStatus.character.buffs[playerid] = true;

            resolve(this);
        }).catch(reject));
    }

    _loadCharacterDamageTaken(playerid) {
        if (!this._loadedStatus.fights) {
            return new Promise((_resolve, reject) => reject("Fights have not yet been loaded."));
        }

        if (this._loadedStatus.character.damageTaken[playerid]) {
            return new Promise(resolve => resolve(this));
        }

        return new Promise((resolve, reject) => fetch(this.domain + "report/tables/damage-taken/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + this.Results.startTime
        + "&end=" + this.Results.endTime
        + "&sourceid=" + playerid)
        .then(response => response.json())
        .then(data => {
            data.entries.forEach((obj) => {
                let character = this.Results.Characters[playerid];

                if (!character) {
                    return;
                }

                character.damageTaken = {...character.damageTaken, [obj.guid]: obj};
            })

            this._loadedStatus.character.damageTaken[playerid] = true;

            resolve(this);
        }).catch(reject));
    }

    _loadProtectionPots(playerid) {
        if (!this._loadedStatus.fights) {
            return new Promise((_resolve, reject) => reject("Fights have not yet been loaded."));
        }

        if (this._loadedStatus.character.protectionPots[playerid]) {
            return new Promise(resolve => resolve(this));
        }

        return new Promise((resolve, reject) => fetch(this.domain + "report/events/healing/" + this.reportId 
        + "?api_key=" + this.key 
        + "&start=" + this.Results.startTime
        + "&end=" + this.Results.endTime
        + "&sourceid=" + playerid
        + "&filter=ability.id=17546 OR ability.id=7254 OR ability.id=17548 OR ability.id=7242 OR ability.id=17544 OR ability.id=7240 OR ability.id=17543 OR ability.id=7230 OR ability.id=17549")
        .then(response => response.json())
        .then(data => {
            let character = this.Results.Characters[playerid];

            if (!character) {
                return;
            }

            if (!character.protectionPotions) {
                character.protectionPotions = {};
            }

            data.events.forEach((obj) => {
                let protPot = character.protectionPotions[obj.ability.guid];
                if (!protPot) {
                    character.protectionPotions[obj.ability.guid] = {
                        amount: 0,
                        firstAbsorb: {},
                    };
                    protPot = character.protectionPotions[obj.ability.guid]
                }

                protPot.amount += obj.amount;
                if (!protPot.firstAbsorb[obj.fight]) {
                    protPot.firstAbsorb[obj.fight] = obj.timestamp;
                }
            });

            this._loadedStatus.character.protectionPots[playerid] = true;

            resolve(this);
        }).catch(reject));
    }

    getResults() {
        return this.Results;
    }

    getCharacter(characterid) {
        return this.Results.Characters[characterid];
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

    _reducePlayerDetails(role) {
        return (acc, obj) => {
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

                let enchants = obj.combatantInfo?.gear?.reduce((enchant, gear) => {
                    
                    if (slots[gear.slot].enchantable && gear.id !== 0 && !offhandFrills[gear.id])
                    {
                        enchant.permanentEnchants.push({
                            slot: gear.slot, 
                            slotname: slots[gear.slot].name, 
                            id: gear.permanentEnchant, 
                            name: gear.permanentEnchantName, 
                            key: gear.id + "_" + gear.permanentEnchant,
                            gearId: gear.id,
                            gearName: gear.name,
                        })
                    }

                    if (gear.slot === 15) {
                        enchant.weaponEnchant.id = gear.temporaryEnchant;
                        enchant.weaponEnchant.name = gear.temporaryEnchantName;
                    }

                    return enchant;
                }, { permanentEnchants: [], weaponEnchant: {}});

                let gems = obj.combatantInfo?.gear?.reduce((gems, gear) => {
                    
                    gear?.gems?.reduce((gems, gem) => {
                        if (gems[gem.id]) {
                            gems[gem.id].count++;
                        }
                        else {
                            let gemDetails = gemList[gem.id];
                            gems[gem.id] = {
                                id: gem.id,
                                itemLevel: gem.itemLevel,
                                icon: gemDetails?.icon || gem.icon,
                                rarity: gemDetails?.rarity,
                                colour: gemDetails?.colour,
                                label: gemDetails?.label,
                                description: gemDetails?.description,
                                count: 1
                            };
                        }

                        return gems;
                    }, gems);

                    return gems;
                }, {});

                if (!acc[playerId]) {
                    acc[playerId] = {
                        id: playerId,
                        name: obj.name,
                        type: obj.type,
                        roles: [role],
                        intellect: obj.combatantInfo?.stats?.Intellect?.max,
                        armor: obj.combatantInfo?.stats?.Armor?.max,
                        stamina: obj.combatantInfo?.stats?.Stamina?.max,
                        strength: obj.combatantInfo?.stats?.Strength?.max,
                        agility: obj.combatantInfo?.stats?.Agility?.max,
                        weaponEnchant: enchants?.weaponEnchant,
                        enchants: enchants?.permanentEnchants,
                        gems: gems
                    };
                }
                else {
                    acc[playerId].roles.push(role);
                    if (!acc[playerId].weaponEnchant) {
                        acc[playerId].weaponEnchant = enchants?.weaponEnchant;
                    }
                    acc[playerId].enchants = removeDuplicates([...(acc[playerId].enchants || []), ...(enchants?.permanentEnchants || [])], x => x.key);

                }

                return acc;
        }
    }

    getCharacterInfo(start_time, end_time) {
        return new Promise((resolve, reject) => fetch(this.domain + "report/tables/summary/" + this.reportId
        + "?api_key=" + this.key 
        + "&start=" + start_time
        + "&end=" + end_time)
        .then(response => response.json())
        .then(data => {
            let playerData = [];
            if (!data.playerDetails) {
                resolve(playerData);
                return;
            }

            if (data.playerDetails.tanks) {
                playerData = data.playerDetails.tanks.reduce(this._reducePlayerDetails("tank"), {});
            }

            if (data.playerDetails.healers) {
                playerData = data.playerDetails.healers.reduce(this._reducePlayerDetails("healer"), playerData);
            }

            if (data.playerDetails.dps) {
                playerData = data.playerDetails.dps.reduce(this._reducePlayerDetails("dps"), playerData);
            }

            resolve(playerData);
        }).catch(reject));
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

            healerData = data.playerDetails.healers.reduce(this._reducePlayerDetails("healer"), {});

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