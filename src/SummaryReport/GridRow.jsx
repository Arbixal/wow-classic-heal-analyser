import {Component, Children, isValidElement, cloneElement} from "react";
import {protectionPotionEnum, worldBuffs} from "../data";
import {DataPoints, emptyData} from "./GridContexts";
import {countNonNull, sumNonNull} from "../utils";

export class GridRow extends Component {
    constructor(props) {
        super(props);

        this._logLoader = props.logLoader;
        let report = this._logLoader.getResults();

        this.state = {
            id: props.character.id,
            classType: props.character.type,
            raidTime: report.endTime - report.startTime,
            isLoaded: false,
            error: null,
            Data: this._flattenCharacterData(null),
        }
    }

    componentDidMount() {
        
        this._logLoader.loadCharacterDetails(this.state.id)
        .then((data) => {
            let character = data.getCharacter(this.state.id);

            this.setState({
                isLoaded: true,
                Data: this._flattenCharacterData(character),
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
        let characterData = {...emptyData, name: this.props.character.name};

        if (!character) {
            return characterData;
        }

        characterData[DataPoints.Name] = character.name;
        characterData[DataPoints.Deaths] = this._getDeathCount(character);

        characterData[DataPoints.WorldBuffNef] = this._getWorldBuffUptime(character, worldBuffs.DragonHead);
        characterData[DataPoints.WorldBuffRend] = this._getWorldBuffUptime(character, worldBuffs.Rend);
        characterData[DataPoints.WorldBuffHoH] = this._getWorldBuffUptime(character, worldBuffs.HoH);
        characterData[DataPoints.WorldBuffSF] = this._getWorldBuffUptime(character, worldBuffs.Songflower);
        characterData[DataPoints.WorldBuffMM] = this._getWorldBuffUptime(character, worldBuffs.Moldar);
        characterData[DataPoints.WorldBuffFF] = this._getWorldBuffUptime(character, worldBuffs.Fengus);
        characterData[DataPoints.WorldBuffSS] = this._getWorldBuffUptime(character, worldBuffs.Slipkik);
        characterData[DataPoints.WorldBuffDMF] = this._getWorldBuffUptime(character, worldBuffs.DMF);

        let buffCount = countNonNull(characterData[DataPoints.WorldBuffNef], 
            characterData[DataPoints.WorldBuffRend], 
            characterData[DataPoints.WorldBuffHoH],
            characterData[DataPoints.WorldBuffSF],
            characterData[DataPoints.WorldBuffMM],
            characterData[DataPoints.WorldBuffFF],
            characterData[DataPoints.WorldBuffSS],
            characterData[DataPoints.WorldBuffDMF]);

        characterData[DataPoints.WorldBuffCount] = buffCount + "/8";

        let buffUptime = sumNonNull(characterData[DataPoints.WorldBuffNef], 
            characterData[DataPoints.WorldBuffRend], 
            characterData[DataPoints.WorldBuffHoH],
            characterData[DataPoints.WorldBuffSF],
            characterData[DataPoints.WorldBuffMM],
            characterData[DataPoints.WorldBuffFF],
            characterData[DataPoints.WorldBuffSS],
            characterData[DataPoints.WorldBuffDMF]);

        characterData[DataPoints.WorldBuffUptime] = buffUptime / buffCount;

        characterData[DataPoints.ProtectionPotionsGreaterArcane] = this._getProtectionPotionCount(character, protectionPotionEnum.GAPP);
        characterData[DataPoints.ProtectionPotionsArcaneAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GAPP);
        characterData[DataPoints.ProtectionPotionsFire] = this._getProtectionPotionCount(character, protectionPotionEnum.FPP);
        characterData[DataPoints.ProtectionPotionsGreaterFire] = this._getProtectionPotionCount(character, protectionPotionEnum.GFPP);
        characterData[DataPoints.ProtectionPotionsFireAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GFPP, protectionPotionEnum.FPP);
        characterData[DataPoints.ProtectionPotionsFrost] = this._getProtectionPotionCount(character, protectionPotionEnum.FrPP);
        characterData[DataPoints.ProtectionPotionsGreaterFrost] = this._getProtectionPotionCount(character, protectionPotionEnum.GFrPP);
        characterData[DataPoints.ProtectionPotionsFrostAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GFrPP, protectionPotionEnum.FrPP);
        characterData[DataPoints.ProtectionPotionsNature] = this._getProtectionPotionCount(character, protectionPotionEnum.NPP);
        characterData[DataPoints.ProtectionPotionsGreaterNature] = this._getProtectionPotionCount(character, protectionPotionEnum.GNPP);
        characterData[DataPoints.ProtectionPotionsNatureAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GNPP, protectionPotionEnum.NPP);
        characterData[DataPoints.ProtectionPotionsShadow] = this._getProtectionPotionCount(character, protectionPotionEnum.SPP);
        characterData[DataPoints.ProtectionPotionsGreaterShadow] = this._getProtectionPotionCount(character, protectionPotionEnum.GSPP);
        characterData[DataPoints.ProtectionPotionsShadowAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GSPP, protectionPotionEnum.SPP);

        characterData[DataPoints.ProtectionPotionsTotal] = sumNonNull(characterData[DataPoints.ProtectionPotionsGreaterArcane],
            characterData[DataPoints.ProtectionPotionsFire],
            characterData[DataPoints.ProtectionPotionsGreaterFire],
            characterData[DataPoints.ProtectionPotionsFrost],
            characterData[DataPoints.ProtectionPotionsGreaterFrost],
            characterData[DataPoints.ProtectionPotionsNature],
            characterData[DataPoints.ProtectionPotionsGreaterNature],
            characterData[DataPoints.ProtectionPotionsShadow],
            characterData[DataPoints.ProtectionPotionsGreaterShadow]);

        characterData[DataPoints.ProtectionPotionsTotalAbsorbed] = sumNonNull(characterData[DataPoints.ProtectionPotionsArcaneAbsorbed],
            characterData[DataPoints.ProtectionPotionsFireAbsorbed],
            characterData[DataPoints.ProtectionPotionsFrostAbsorbed],
            characterData[DataPoints.ProtectionPotionsNatureAbsorbed],
            characterData[DataPoints.ProtectionPotionsShadowAbsorbed]);

        characterData[DataPoints.ConsumesManaPots] = this._getCastCount(character, 17531);
        characterData[DataPoints.ConsumesRejuvPots] = this._getCastCount(character, 22729);
        characterData[DataPoints.ConsumesHealthPots] = this._getCastCount(character, 17534);
        characterData[DataPoints.ConsumesLIPs] = this._getCastCount(character, 3169);
        characterData[DataPoints.ConsumesFreeActionPotion] = this._getCastCount(character, 6615, 24364);
        characterData[DataPoints.ConsumesRestorationPots] = this._getCastCount(character, 11359, 17550);
        characterData[DataPoints.ConsumesRagePotions] = this._getCastCount(character, 6613, 17528);
        characterData[DataPoints.ConsumesStoneshield] = this._getCastCount(character, 17540);

        characterData[DataPoints.ConsumesRunes] = this._getCastCount(character, 16666, 27869);
        characterData[DataPoints.ConsumesHealthStones] = this._getCastCount(character, 23476, 11732, 23477);
        characterData[DataPoints.ConsumesWhipperRootTuber] = this._getCastCount(character, 15700);
        characterData[DataPoints.ConsumesThistleTea] = this._getCastCount(character, 9512);
        characterData[DataPoints.ConsumesManaRuby] = this._getCastCount(character, 10058);
        characterData[DataPoints.ConsumesManaCitrine] = this._getCastCount(character, 10057);
        characterData[DataPoints.ConsumesManaJade] = this._getCastCount(character, 10052);
        characterData[DataPoints.ConsumesManaAgate] = this._getCastCount(character, 5405);

        characterData[DataPoints.ConsumesPetris] = this._getCastCount(character, 17624);
        characterData[DataPoints.ConsumesElixirOfPoisonResistance] = this._getCastCount(character, 26677);
        characterData[DataPoints.ConsumesOilOfImmolation] = this._getCastCount(character, 11350);

        characterData[DataPoints.ConsumesHolyWater] = this._getCastCount(character, 17291);
        characterData[DataPoints.ConsumesSapperCharge] = this._getCastCount(character, 13241);
        characterData[DataPoints.ConsumesDenseDynamite] = this._getCastCount(character, 23063);
        characterData[DataPoints.ConsumesEzThro] = this._getCastCount(character, 23000);

        characterData[DataPoints.ConsumesHeavyRuneclothBandage] = this._getCastCount(character, 18610);
        characterData[DataPoints.ConsumesAntiVenom] = this._getCastCount(character, 23786);

        characterData[DataPoints.ConsumesPotions] = sumNonNull(characterData[DataPoints.ConsumesManaPots],
            characterData[DataPoints.ConsumesRejuvPots],
            characterData[DataPoints.ConsumesHealthPots],
            characterData[DataPoints.ConsumesLIPs],
            characterData[DataPoints.ConsumesFreeActionPotion],
            characterData[DataPoints.ConsumesRestorationPots],
            characterData[DataPoints.ConsumesRagePotions],
            characterData[DataPoints.ConsumesStoneshield]);

        characterData[DataPoints.ConsumesGems] = sumNonNull(characterData[DataPoints.ConsumesRunes],
            characterData[DataPoints.ConsumesHealthStones],
            characterData[DataPoints.ConsumesWhipperRootTuber],
            characterData[DataPoints.ConsumesThistleTea],
            characterData[DataPoints.ConsumesManaRuby],
            characterData[DataPoints.ConsumesManaCitrine],
            characterData[DataPoints.ConsumesManaJade],
            characterData[DataPoints.ConsumesManaAgate]);

        characterData[DataPoints.ConsumesElixirs] = sumNonNull(characterData[DataPoints.ConsumesPetris],
            characterData[DataPoints.ConsumesElixirOfPoisonResistance],
            characterData[DataPoints.ConsumesOilOfImmolation]);

        characterData[DataPoints.ConsumesExplosives] = sumNonNull(characterData[DataPoints.ConsumesHolyWater],
            characterData[DataPoints.ConsumesSapperCharge],
            characterData[DataPoints.ConsumesDenseDynamite],
            characterData[DataPoints.ConsumesEzThro]);

        characterData[DataPoints.ConsumesBandages] = sumNonNull(characterData[DataPoints.ConsumesHeavyRuneclothBandage],
            characterData[DataPoints.ConsumesAntiVenom]);

        characterData[DataPoints.DispelDruidCurePoison] = this._getCastCount(character, 8946);
        characterData[DataPoints.DispelDruidAbolishPoison] = this._getCastCount(character, 2893);
        characterData[DataPoints.DispelDruidRemoveCurse] = this._getCastCount(character, 2782);
        characterData[DataPoints.DispelHunterTranqShot] = this._getCastCount(character, 19801);
        characterData[DataPoints.DispelMageRemoveLesserCurse] = this._getCastCount(character, 475);
        characterData[DataPoints.DispelPaladinPurify] = this._getCastCount(character, 1152);
        characterData[DataPoints.DispelPaladinCleanse] = this._getCastCount(character, 4987);
        characterData[DataPoints.DispelPriestDispelMagic] = this._getCastCount(character, 988, 527);
        characterData[DataPoints.DispelPriestCureDisease] = this._getCastCount(character, 528);
        characterData[DataPoints.DispelPriestAbolishDisease] = this._getCastCount(character, 552);
        characterData[DataPoints.DispelShamanPurge] = this._getCastCount(character, 8012, 370);
        characterData[DataPoints.DispelShamanCurePoison] = this._getCastCount(character, 526);
        characterData[DataPoints.DispelShamanCureDisease] = this._getCastCount(character, 2870);
        characterData[DataPoints.DispelShamanPoisonCleansingTotem] = this._getCastCount(character, 8166);
        characterData[DataPoints.DispelShamanDiseaseCleansingTotem] = this._getCastCount(character, 8170);

        characterData[DataPoints.DispelPoison] = sumNonNull(characterData[DataPoints.DispelDruidCurePoison],
            characterData[DataPoints.DispelDruidAbolishPoison],
            characterData[DataPoints.DispelShamanCurePoison],
            characterData[DataPoints.DispelShamanPoisonCleansingTotem]);

        characterData[DataPoints.DispelDisease] = sumNonNull(characterData[DataPoints.DispelPriestCureDisease],
            characterData[DataPoints.DispelPriestAbolishDisease],
            characterData[DataPoints.DispelShamanCureDisease],
            characterData[DataPoints.DispelShamanDiseaseCleansingTotem]);

        characterData[DataPoints.DispelCurse] = sumNonNull(characterData[DataPoints.DispelDruidRemoveCurse],
            characterData[DataPoints.DispelMageRemoveLesserCurse]);

        characterData[DataPoints.DispelMagic] = sumNonNull(characterData[DataPoints.DispelPriestDispelMagic],
            characterData[DataPoints.DispelShamanPurge],
            characterData[DataPoints.DispelPaladinCleanse]);

        characterData[DataPoints.DispelFrenzy] = sumNonNull(characterData[DataPoints.DispelHunterTranqShot]);

        characterData[DataPoints.DispelBoss] = this._getBossCastCount(character, 8946, 2893, 2782, 19801, 475, 1152, 4987, 988, 527, 528, 552, 8012, 370, 526, 2870, 8166, 8170);
        characterData[DataPoints.DispelTrash] = this._getTrashCastCount(character, 8946, 2893, 2782, 19801, 475, 1152, 4987, 988, 527, 528, 552, 8012, 370, 526, 2870, 8166, 8170);

        characterData[DataPoints.DispelTotal] = sumNonNull(characterData[DataPoints.DispelPoison],
            characterData[DataPoints.DispelDisease],
            characterData[DataPoints.DispelCurse],
            characterData[DataPoints.DispelMagic],
            characterData[DataPoints.DispelFrenzy]);

        characterData[DataPoints.InterruptDruidBash] = this._getCastCount(character, 8983);
        characterData[DataPoints.InterruptDruidFeralCharge] = this._getCastCount(character, 16979);
        characterData[DataPoints.InterruptMageCounterspell] = this._getCastCount(character, 2139);
        characterData[DataPoints.InterruptPaladinHammerOfJustice] = this._getCastCount(character, 10308);
        characterData[DataPoints.InterruptPriestSilence] = this._getCastCount(character, 15487);
        characterData[DataPoints.InterruptRogueKick] = this._getCastCount(character, 1769, 1768, 1767, 1766);
        characterData[DataPoints.InterruptShamanEarthShock] = this._getCastCount(character, 10414, 8042, 8044, 8045, 8046, 10412, 10413);
        characterData[DataPoints.InterruptWarriorPummel] = this._getCastCount(character, 6552, 6554);

        characterData[DataPoints.InterruptTotal] = sumNonNull(characterData[DataPoints.InterruptDruidBash],
            characterData[DataPoints.InterruptDruidFeralCharge],
            characterData[DataPoints.InterruptMageCounterspell],
            characterData[DataPoints.InterruptPaladinHammerOfJustice],
            characterData[DataPoints.InterruptPriestSilence],
            characterData[DataPoints.InterruptRogueKick],
            characterData[DataPoints.InterruptShamanEarthShock],
            characterData[DataPoints.InterruptWarriorPummel]);
        
        return characterData;
    }

    _getWorldBuffUptime(character, buffId) {
        const {raidTime} = this.state;
        const {buffs, raidStartTime} = character;

        let characterBuff = buffs[buffId];
        if (!characterBuff) {
            return null;
        }

        let buffEnd = characterBuff.bands[characterBuff.bands.length-1].endTime;
        let buffStart = raidStartTime;
        let uptime = (buffEnd - buffStart)/raidTime;

        return uptime;
    }

    /*_getCastCount(spellId) {
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
    }*/

    _getProtectionPotionCount(character, spellId) {
        const {casts, protectionPotions, fights} = character;

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

        return count;
    }

    _getProtectionPotionAbsorb(character, spellId1, spellId2) {
        const {protectionPotions} = character;

        let absorbed = 0;

        absorbed += (protectionPotions[spellId1]?.amount || 0);
        absorbed += (protectionPotions[spellId2]?.amount || 0);

        return absorbed;
    }

    _getDeathCount(character) {
        const {deaths} = character;

        return deaths?.length;
    }

    _getBossCastCount(character, ...spellIds) {
        return this._getRestrictedCastCount(character, "boss", spellIds);
    }

    _getTrashCastCount(character, ...spellIds) {
        return this._getRestrictedCastCount(character, "trash", spellIds);
    }

    _getRestrictedCastCount(character, fightType, spellIds) {
        const {casts} = character;

        let castCount = 0;
        for (let i = 0; i < casts.length; ++i) {
            let cast = casts[i];
            if ((fightType == null || cast.fightType === fightType) && spellIds.includes(cast.ability.guid)) {
                castCount++;
            }
        }

        return castCount;
    }

    _getCastCount(character, ...spellIds) {
        return this._getRestrictedCastCount(character, null, spellIds);
        /* const {casts} = character;

        let castCount = 0;
        for (let i = 0; i < casts.length; ++i) {
            let cast = casts[i];
            if (spellIds.includes(cast.ability.guid)) {
                castCount++;
            }
        }

        return castCount; */
    }

    render() {
        const {Data, isLoaded, error, classType} = this.state;
        const {children, row, context} = this.props;

        return (
            <tr className={classType + " character " + (row % 2 === 0 ? "even" : "odd") + (!isLoaded ? " loading": "") + (error ? " error" : "")}>
                {Children.map(children, child => {
                    // checking isValidElement is the safe way and avoids a typescript error too
                    if (isValidElement(child)) {
                        return cloneElement(child, { data: Data, context: context, render: (x) => x.renderCell() });
                    }
                    return child;
                })}
            </tr>
        );
    }
}