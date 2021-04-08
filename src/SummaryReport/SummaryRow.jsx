import {Component} from "react";
import {dispelSpells, interruptSpells, protectionPotionEnum, worldBuffs} from "../data";
import { asPercentage } from "../utils";

export const DataPoints = {
    Name: "Name",
    Enchants: "Enchants",
    WorldBuffCount: "WorldBuffCount",
    WorldBuffUptime: "WorldBuffUptime",
    WorldBuffNef: "WorldBuffNef",
    WorldBuffRend: "WorldBuffRend",
    WorldBuffHoH: "WorldBuffHoH",
    WorldBuffSF: "WorldBuffSF",
    WorldBuffMM: "WorldBuffMM",
    WorldBuffFF: "WorldBuffFF",
    WorldBuffSS: "WorldBuffSS",
    WorldBuffDMF: "WorldBuffDMF",
    Deaths: "Deaths",
    ProtectionPotionsTotal: "ProtectionPotionsTotal",
    ProtectionPotionsTotalAbsorbed: "ProtectionPotionsTotalAbsorbed",
    ProtectionPotionsNature: "ProtectionPotionsNature",
    ProtectionPotionsGreaterNature: "ProtectionPotionsGreaterNature",
    ProtectionPotionsNatureAbsorbed: "ProtectionPotionsNatureAbsorbed",
    ProtectionPotionsFire: "ProtectionPotionsFire",
    ProtectionPotionsGreaterFire: "ProtectionPotionsGreaterFire",
    ProtectionPotionsFireAbsorbed: "ProtectionPotionsFireAbsorbed",
    ProtectionPotionsFrost: "ProtectionPotionsFrost",
    ProtectionPotionsGreaterFrost: "ProtectionPotionsGreaterFrost",
    ProtectionPotionsFrostAbsorbed: "ProtectionPotionsFrostAbsorbed",
    ProtectionPotionsShadow: "ProtectionPotionsShadow",
    ProtectionPotionsGreaterShadow: "ProtectionPotionsGreaterShadow",
    ProtectionPotionsShadowAbsorbed: "ProtectionPotionsShadowAbsorbed",
    ProtectionPotionsGreaterArcane: "ProtectionPotionsGreaterArcane",
    ProtectionPotionsArcaneAbsorbed: "ProtectionPotionsArcaneAbsorbed",
};

const emptyData = {
    [DataPoints.Name]: " ",
    [DataPoints.Enchants]: " ",
    [DataPoints.WorldBuffCount]: " ",
    [DataPoints.WorldBuffUptime]: " ",
    [DataPoints.WorldBuffNef]: " ",
    [DataPoints.WorldBuffRend]: " ",
    [DataPoints.WorldBuffHoH]: " ",
    [DataPoints.WorldBuffSF]: " ",
    [DataPoints.WorldBuffMM]: " ",
    [DataPoints.WorldBuffFF]: " ",
    [DataPoints.WorldBuffSS]: " ",
    [DataPoints.WorldBuffDMF]: " ",
    [DataPoints.Deaths]: " ",
    [DataPoints.ProtectionPotionsTotal]: " ",
    [DataPoints.ProtectionPotionsTotalAbsorbed]: " ",
    [DataPoints.ProtectionPotionsNature]: " ",
    [DataPoints.ProtectionPotionsGreaterNature]: " ",
    [DataPoints.ProtectionPotionsNatureAbsorbed]: " ",
    [DataPoints.ProtectionPotionsFire]: " ",
    [DataPoints.ProtectionPotionsGreaterFire]: " ",
    [DataPoints.ProtectionPotionsFireAbsorbed]: " ",
    [DataPoints.ProtectionPotionsFrost]: " ",
    [DataPoints.ProtectionPotionsGreaterFrost]: " ",
    [DataPoints.ProtectionPotionsFrostAbsorbed]: " ",
    [DataPoints.ProtectionPotionsShadow]: " ",
    [DataPoints.ProtectionPotionsGreaterShadow]: " ",
    [DataPoints.ProtectionPotionsShadowAbsorbed]: " ",
    [DataPoints.ProtectionPotionsGreaterArcane]: " ",
    [DataPoints.ProtectionPotionsArcaneAbsorbed]: " ",
}

export class SummaryRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.character.name,
            //enchants: props.healer.enchants,
            id: props.character.id,
            classType: props.character.type,
            isExpanded: false,
            isLoaded: false,
            error: null,
            Data: this._flattenCharacterData(null),
        }

        this._logLoader = props.logLoader;
        this.gridDefinition = props.gridDefinition;
    }

    componentDidMount() {
        
        this._logLoader.loadCharacterDetails(this.state.id)
        .then((data) => {
            let report = data.getResults();
            let character = data.getCharacter(this.state.id);

            /* const protPotions = Object.values(protectionPotions).sort((a, b) => {
                let typeCompare = a.type.localeCompare(b.type);
    
                if (typeCompare !== 0)
                    return typeCompare;
    
                return a.rank - b.rank;
            }); */

            this.setState({
                isLoaded: true,
                Data: this._flattenCharacterData(character),
                buffs: character.buffs,
                deaths: character.deaths,
                casts: character.casts,
                fights: character.fights,
                protectionPotions: character.protectionPotions,
                raidStartTime: character.raidStartTime,
                raidTime: report.endTime - report.startTime,
            });
        })
        .catch((error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        });
    }

    _flattenCharacterData(character) {
        let characterData = {...emptyData};

        if (!character) {
            return characterData;
        }

        characterData[DataPoints.Name] = character.name;
        characterData[DataPoints.Deaths] = this._getDeathCount(character);

        characterData[DataPoints.ProtectionPotionsArcaneAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GAPP);
        characterData[DataPoints.ProtectionPotionsFireAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GFPP, protectionPotionEnum.FPP);
        characterData[DataPoints.ProtectionPotionsFrostAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GFrPP, protectionPotionEnum.FrPP);
        characterData[DataPoints.ProtectionPotionsNatureAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GNPP, protectionPotionEnum.NPP);
        characterData[DataPoints.ProtectionPotionsShadowAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GSPP, protectionPotionEnum.SPP);
        
        return characterData;
    }

    _getWorldBuffUptime(buffId) {
        const {buffs, raidStartTime, raidTime} = this.state;
        let characterBuff = buffs[buffId];
        if (!characterBuff) {
            return " "
        }

        let buffEnd = characterBuff.bands[characterBuff.bands.length-1].endTime;
        let buffStart = raidStartTime;
        let uptime = (buffEnd - buffStart)/raidTime;

        return asPercentage(uptime, 0);
    }

    _getCastCount(spellId) {
        const {casts} = this.state;

        let count = 0;
        for (let i = 0; i < casts.length; ++i) {
            let cast = casts[i];
            if (cast.ability.guid.toString() === spellId) {
                count++;
            }
        }
        
        if (count === 0) {
            return " ";
        }

        return count;
    }

    _getProtectionPotionCount(spellId) {
        const {casts, protectionPotions, fights} = this.state;

        let count = 0;
        let countByFight = {};
        for (let i = 0; i < casts.length; ++i) {
            let cast = casts[i];
            if (cast.ability.guid === spellId) {
                if (!countByFight[cast.fight]) {
                    countByFight[cast.fight] = {
                        count: 1,
                        firstCast: cast.timestamp,
                    };
                }
                else {
                    countByFight[cast.fight].count++;
                }
            }
        }

        for (let i = 0; i < fights.length; ++i) {
            let fight = fights[i];
            let protectionPotion = protectionPotions[spellId] || null;

            if (countByFight[fight.id]) {
                count += countByFight[fight.id].count;

                if (protectionPotion !== null && protectionPotion.firstAbsorb[fight.id]) {
                    if (protectionPotion.firstAbsorb[fight.id] < countByFight[fight.id].firstCast) {
                        count++;
                    }
                }
            }
            else {
                if (protectionPotion !== null && protectionPotion.firstAbsorb[fight.id]) {
                    count++;
                }
            }
        }

        return count > 0 ? count : " ";
    }

    _getProtectionPotionAbsorb(character, spellId1, spellId2) {
        const {protectionPotions} = character;

        let absorbed = 0;

        absorbed += (protectionPotions[spellId1]?.amount || 0);
        absorbed += (protectionPotions[spellId2]?.amount || 0);

        return absorbed > 0 ? absorbed : " ";
    }

    _getDeathCount(character) {
        const {deaths} = character;

        return deaths?.length || " ";
    }

    render() {
        const {id, name, classType,  isLoaded, error, Data} = this.state;
        const {row, context} = this.props;

        const dataContext = {...context, Data: Data};

        /* let maxSpellHeals = spells.reduce((agg,obj) => {
            if (obj.summary.getTotalHeals() > agg) {
                agg = obj.summary.getTotalHeals();
            }
            return agg;
        }, 0);

        let enchantScore = enchants.reduce((acc, obj) => {
            acc.score += obj.score;
            acc.count++;

            if (acc.score !== acc.count) {
                acc.colour = "yellow";
            }

            if (acc.score === 0) {
                acc.colour = "red";
            }

            acc.tooltip += obj.slot + ": " 
                + (obj.name ? obj.name : "(none)") 
                + (obj.score === 1 ? " <span class='tick'>✔</span>" : obj.score === 0 ? " <span class='cross'>✖</span>" : " <span class='alternative'>✔</span>")
                + "<br />";

            return acc;
        }, { score: 0, count: 0, colour: "green", tooltip: ""}) */

        let template;

        if (!isLoaded) {
            template = (
                <>
                <tr key={id} className={classType + " character " + (row % 2 === 0 ? "even" : "odd") + " loading"}>
                    {this.gridDefinition.map((colGroup) => colGroup.GetColumns(dataContext))}
                </tr>
                </>
            );
        }
        else if (error) {
            template = (
                <>
                <tr key={id} className={"error character " + (row % 2 === 0 ? "even" : "odd")}>
                    <td className="name">{name}</td>
                    <td className="enchants">&nbsp;</td>

                    <td className="world_buff">&nbsp;</td>
                    <td className="world_buff">&nbsp;</td>
                    <td className="world_buff">&nbsp;</td>
                    <td className="world_buff">&nbsp;</td>
                    <td className="world_buff">&nbsp;</td>
                    <td className="world_buff">&nbsp;</td>
                    <td className="world_buff">&nbsp;</td>
                    <td className="world_buff">&nbsp;</td>

                    <td className="deaths">&nbsp;</td>

                    <td className="nature protection_potion">&nbsp;</td>
                    <td className="nature protection_potion">&nbsp;</td>
                    <td className="nature protection_potion amount">&nbsp;</td>
                    <td className="fire protection_potion">&nbsp;</td>
                    <td className="fire protection_potion">&nbsp;</td>
                    <td className="fire protection_potion amount">&nbsp;</td>
                    <td className="frost protection_potion">&nbsp;</td>
                    <td className="frost protection_potion">&nbsp;</td>
                    <td className="frost protection_potion amount">&nbsp;</td>
                    <td className="shadow protection_potion">&nbsp;</td>
                    <td className="shadow protection_potion">&nbsp;</td>
                    <td className="shadow protection_potion amount">&nbsp;</td>
                    <td className="arcane protection_potion">&nbsp;</td>
                    <td className="arcane protection_potion amount">&nbsp;</td>

{/*                     <td className="dispels">&nbsp;</td>
                    <td className="dispels">&nbsp;</td>
                    <td className="dispels">&nbsp;</td>
                    <td className="dispels">&nbsp;</td>
                    <td className="dispels">&nbsp;</td>

                    <td className="interrupts">&nbsp;</td>
                    <td className="interrupts">&nbsp;</td> */}
                </tr>
                </>
            );
        }
        else {
            /* let dispelPairs = Object.entries(dispelSpells[classType])
            let dispels = [];
            for (let i = 0; i < 5; ++i) {
                if (i >= dispelPairs.length) {
                    dispels[i] = null;
                    continue;
                }

                let [id, dispel] = dispelPairs[i]

                let count = this._getCastCount(id);

                dispels[i] = {
                    name: dispel.name,
                    icon: dispel.icon,
                    value: count,
                }
            }

            let interruptPairs = Object.entries(interruptSpells[classType])
            let interrupts = [];
            for (let i = 0; i < 2; ++i) {
                if (i >= interruptPairs.length) {
                    interrupts[i] = null;
                    continue;
                }

                let [id, interrupt] = interruptPairs[i]

                let count = this._getCastCount(id);

                interrupts[i] = {
                    name: interrupt.name,
                    icon: interrupt.icon,
                    value: count,
                }
            } */

            template = (
                <>
                    <tr className={classType + (row % 2 === 0 ? " even" : " odd")} key={id}>
                        {this.gridDefinition.map((colGroup) => colGroup.GetColumns(dataContext))}
                        {/* <td className="name">{name}</td>

                        <td className="enchants">&nbsp;</td>

                        <td className="world_buff">{this._getWorldBuffUptime(worldBuffs.DragonHead)}</td>
                        <td className="world_buff">{this._getWorldBuffUptime(worldBuffs.Rend)}</td>
                        <td className="world_buff">{this._getWorldBuffUptime(worldBuffs.HoH)}</td>
                        <td className="world_buff">{this._getWorldBuffUptime(worldBuffs.Songflower)}</td>
                        <td className="world_buff">{this._getWorldBuffUptime(worldBuffs.Moldar)}</td>
                        <td className="world_buff">{this._getWorldBuffUptime(worldBuffs.Fengus)}</td>
                        <td className="world_buff">{this._getWorldBuffUptime(worldBuffs.Slipkik)}</td>
                        <td className="world_buff">{this._getWorldBuffUptime(worldBuffs.DMF)}</td>

                        <td className="deaths">{this._getDeathCount(character)}</td>

                        <td className="nature protection_potion">{this._getProtectionPotionCount(protectionPotionEnum.NPP)}</td>
                        <td className="nature protection_potion">{this._getProtectionPotionCount(protectionPotionEnum.GNPP)}</td>
                        <td className="nature protection_potion amount">{this._getProtectionPotionAbsorb(character, protectionPotionEnum.GNPP, protectionPotionEnum.NPP)}</td>
                        <td className="fire protection_potion">{this._getProtectionPotionCount(protectionPotionEnum.FPP)}</td>
                        <td className="fire protection_potion">{this._getProtectionPotionCount(protectionPotionEnum.GFPP)}</td>
                        <td className="fire protection_potion amount">{this._getProtectionPotionAbsorb(character, protectionPotionEnum.GFPP, protectionPotionEnum.FPP)}</td>
                        <td className="frost protection_potion">{this._getProtectionPotionCount(protectionPotionEnum.FrPP)}</td>
                        <td className="frost protection_potion">{this._getProtectionPotionCount(protectionPotionEnum.GFrPP)}</td>
                        <td className="frost protection_potion amount">{this._getProtectionPotionAbsorb(character, protectionPotionEnum.GFrPP, protectionPotionEnum.FrPP)}</td>
                        <td className="shadow protection_potion">{this._getProtectionPotionCount(protectionPotionEnum.SPP)}</td>
                        <td className="shadow protection_potion">{this._getProtectionPotionCount(protectionPotionEnum.GSPP)}</td>
                        <td className="shadow protection_potion amount">{this._getProtectionPotionAbsorb(character, protectionPotionEnum.GSPP, protectionPotionEnum.SPP)}</td>
                        <td className="arcane protection_potion">{this._getProtectionPotionCount(protectionPotionEnum.GAPP)}</td>
                        <td className="arcane protection_potion amount">{this._getProtectionPotionAbsorb(character, protectionPotionEnum.GAPP)}</td>

                        {dispels.map((obj,idx) => {
                            if (!obj) {
                                return <td key={idx} className="dispels">&nbsp;</td>
                            }
                            else {
                                return <td key={idx} className="dispels">{obj.value}</td>
                            }
                        })}

                        {interrupts.map((obj,idx) => {
                            if (!obj) {
                                return <td key={idx} className="interrupts">&nbsp;</td>
                            }
                            else {
                                return <td key={idx} className="interrupts">{obj.value}</td>
                            }
                        })} */}
                    </tr>
                </>
            )
        }

        return template;
    }
}