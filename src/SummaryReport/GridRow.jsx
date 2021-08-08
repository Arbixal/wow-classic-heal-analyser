import {Component, Children, isValidElement, cloneElement} from "react";
import {battleElixirBuffs, flaskBuffs, foodBuffs, guardianElixirBuffs, protectionPotionEnum, rarity, scrollBuffs, seasonBuffs, tempWeaponEnchants, worldBuffs} from "../data";
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

        characterData[DataPoints.GemsCommon] = this._getGemCount(character, rarity.Common);
        characterData[DataPoints.GemsUncommon] = this._getGemCount(character, rarity.Uncommon);
        characterData[DataPoints.GemsRare] = this._getGemCount(character, rarity.Rare);
        characterData[DataPoints.GemsEpic] = this._getGemCount(character, rarity.Epic);
        characterData[DataPoints.GemsList] = this._getGemList(character);

        /* characterData[DataPoints.WorldBuffNef] = this._getWorldBuffUptime(character, worldBuffs.DragonHead);
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

        characterData[DataPoints.WorldBuffUptime] = buffUptime / buffCount; */

        characterData[DataPoints.ElixirsFood] = this._getBuffs(character, foodBuffs);
        characterData[DataPoints.ElixirsFlasks] = this._getBuffs(character, flaskBuffs);
        characterData[DataPoints.ElixirsBattle] = this._getBuffs(character, battleElixirBuffs);
        characterData[DataPoints.ElixirsGuardian] = this._getBuffs(character, guardianElixirBuffs);
        characterData[DataPoints.ElixirsSeasonal] = this._getBuffs(character, seasonBuffs);
        characterData[DataPoints.ElixirsScrolls] = this._getBuffs(character, scrollBuffs);
        characterData[DataPoints.ElixirsWeaponEnchants] = this._getWeaponImbue(character, tempWeaponEnchants);

        characterData[DataPoints.ProtectionPotionsGreaterArcane] = this._getProtectionPotionCount(character, protectionPotionEnum.GAPP);
        characterData[DataPoints.ProtectionPotionsMajorArcane] = this._getProtectionPotionCount(character, protectionPotionEnum.MAPP);
        characterData[DataPoints.ProtectionPotionsArcaneAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GAPP, protectionPotionEnum.MAPP);
        characterData[DataPoints.ProtectionPotionsFire] = this._getProtectionPotionCount(character, protectionPotionEnum.FPP);
        characterData[DataPoints.ProtectionPotionsGreaterFire] = this._getProtectionPotionCount(character, protectionPotionEnum.GFPP);
        characterData[DataPoints.ProtectionPotionsMajorFire] = this._getProtectionPotionCount(character, protectionPotionEnum.MFPP);
        characterData[DataPoints.ProtectionPotionsFireAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GFPP, protectionPotionEnum.FPP, protectionPotionEnum.MFPP);
        characterData[DataPoints.ProtectionPotionsFrost] = this._getProtectionPotionCount(character, protectionPotionEnum.FrPP);
        characterData[DataPoints.ProtectionPotionsGreaterFrost] = this._getProtectionPotionCount(character, protectionPotionEnum.GFrPP);
        characterData[DataPoints.ProtectionPotionsMajorFrost] = this._getProtectionPotionCount(character, protectionPotionEnum.MFrPP);
        characterData[DataPoints.ProtectionPotionsFrostAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GFrPP, protectionPotionEnum.FrPP, protectionPotionEnum.MFrPP);
        characterData[DataPoints.ProtectionPotionsNature] = this._getProtectionPotionCount(character, protectionPotionEnum.NPP);
        characterData[DataPoints.ProtectionPotionsGreaterNature] = this._getProtectionPotionCount(character, protectionPotionEnum.GNPP);
        characterData[DataPoints.ProtectionPotionsMajorNature] = this._getProtectionPotionCount(character, protectionPotionEnum.MNPP);
        characterData[DataPoints.ProtectionPotionsNatureAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GNPP, protectionPotionEnum.NPP, protectionPotionEnum.MNPP);
        characterData[DataPoints.ProtectionPotionsShadow] = this._getProtectionPotionCount(character, protectionPotionEnum.SPP);
        characterData[DataPoints.ProtectionPotionsGreaterShadow] = this._getProtectionPotionCount(character, protectionPotionEnum.GSPP);
        characterData[DataPoints.ProtectionPotionsMajorShadow] = this._getProtectionPotionCount(character, protectionPotionEnum.MSPP);
        characterData[DataPoints.ProtectionPotionsShadowAbsorbed] = this._getProtectionPotionAbsorb(character, protectionPotionEnum.GSPP, protectionPotionEnum.SPP, protectionPotionEnum.MSPP);

        characterData[DataPoints.ProtectionPotionsTotal] = sumNonNull(characterData[DataPoints.ProtectionPotionsGreaterArcane],
            characterData[DataPoints.ProtectionPotionsMajorArcane],
            characterData[DataPoints.ProtectionPotionsFire],
            characterData[DataPoints.ProtectionPotionsGreaterFire],
            characterData[DataPoints.ProtectionPotionsMajorFire],
            characterData[DataPoints.ProtectionPotionsFrost],
            characterData[DataPoints.ProtectionPotionsGreaterFrost],
            characterData[DataPoints.ProtectionPotionsMajorFrost],
            characterData[DataPoints.ProtectionPotionsNature],
            characterData[DataPoints.ProtectionPotionsGreaterNature],
            characterData[DataPoints.ProtectionPotionsMajorNature],
            characterData[DataPoints.ProtectionPotionsShadow],
            characterData[DataPoints.ProtectionPotionsGreaterShadow],
            characterData[DataPoints.ProtectionPotionsMajorShadow]);

        characterData[DataPoints.ProtectionPotionsTotalAbsorbed] = sumNonNull(characterData[DataPoints.ProtectionPotionsArcaneAbsorbed],
            characterData[DataPoints.ProtectionPotionsFireAbsorbed],
            characterData[DataPoints.ProtectionPotionsFrostAbsorbed],
            characterData[DataPoints.ProtectionPotionsNatureAbsorbed],
            characterData[DataPoints.ProtectionPotionsShadowAbsorbed]);

        characterData[DataPoints.ConsumesManaPots] = this._getCastCount(character, 17531, 28499, 41618);
        characterData[DataPoints.ConsumesRejuvPots] = this._getCastCount(character, 22729, 28517, 45051);
        characterData[DataPoints.ConsumesHealthPots] = this._getCastCount(character, 17534, 28495, 41620);
        characterData[DataPoints.ConsumesFreeActionPotion] = this._getCastCount(character, 6615, 24364);
        characterData[DataPoints.ConsumesRestorationPots] = this._getCastCount(character, 11359, 17550);
        characterData[DataPoints.ConsumesRagePotions] = this._getCastCount(character, 6613, 17528);
        characterData[DataPoints.ConsumesStoneshield] = this._getCastCount(character, 17540);
        characterData[DataPoints.ConsumesInsaneStrength] = this._getCastCount(character, 28494);
        characterData[DataPoints.ConsumesShrouding] = this._getCastCount(character, 28548);
        characterData[DataPoints.ConsumesFelRegeneration] = this._getCastCount(character, 38908);
        characterData[DataPoints.ConsumesHeroic] = this._getCastCount(character, 28506);
        characterData[DataPoints.ConsumesDestruction] = this._getCastCount(character, 28508);
        characterData[DataPoints.ConsumesHaste] = this._getCastCount(character, 28507);
        characterData[DataPoints.ConsumesFelMana] = this._getCastCount(character, 38929);
        characterData[DataPoints.ConsumesIronshield] = this._getCastCount(character, 17540, 28515);

        characterData[DataPoints.ConsumesRunes] = this._getCastCount(character, 16666, 27869);
        characterData[DataPoints.ConsumesHealthStones] = this._getCastCount(character, 27235, 27236, 27237);
        characterData[DataPoints.ConsumesWhipperRootTuber] = this._getCastCount(character, 15700);
        characterData[DataPoints.ConsumesThistleTea] = this._getCastCount(character, 9512);
        characterData[DataPoints.ConsumesManaGem] = this._getCastCount(character, 10058, 10057, 10052, 5405, 27103);
        characterData[DataPoints.ConsumesNightmareSeed] = this._getCastCount(character, 28726);

        /* characterData[DataPoints.ConsumesPetris] = this._getCastCount(character, 17624);
        characterData[DataPoints.ConsumesElixirOfPoisonResistance] = this._getCastCount(character, 26677);
        characterData[DataPoints.ConsumesOilOfImmolation] = this._getCastCount(character, 11350); */
        characterData[DataPoints.ConsumesDrumsBattle] = this._getCastCount(character, 35476, 351355);
        characterData[DataPoints.ConsumesDrumsWar] = this._getCastCount(character, 35475, 351360);
        characterData[DataPoints.ConsumesDrumsRestoration] = this._getCastCount(character, 35478, 351358);
        characterData[DataPoints.ConsumesDrumsPanic] = this._getCastCount(character, 35474, 351357);

        characterData[DataPoints.ConsumesHolyWater] = this._getCastCount(character, 17291);
        characterData[DataPoints.ConsumesSapperCharge] = this._getCastCount(character, 13241, 30486);
        characterData[DataPoints.ConsumesDenseDynamite] = this._getCastCount(character, 23063);
        characterData[DataPoints.ConsumesEzThro] = this._getCastCount(character, 23000);

        characterData[DataPoints.ConsumesHeavyRuneclothBandage] = this._getCastCount(character, 18610, 27030, 27031);
        characterData[DataPoints.ConsumesAntiVenom] = this._getCastCount(character, 23786);

        characterData[DataPoints.ConsumesPotions] = sumNonNull(characterData[DataPoints.ConsumesManaPots],
            characterData[DataPoints.ConsumesRejuvPots],
            characterData[DataPoints.ConsumesHealthPots],
            characterData[DataPoints.ConsumesFreeActionPotion],
            characterData[DataPoints.ConsumesRestorationPots],
            characterData[DataPoints.ConsumesRagePotions],
            characterData[DataPoints.ConsumesInsaneStrength],
            characterData[DataPoints.ConsumesShrouding],
            characterData[DataPoints.ConsumesFelRegeneration],
            characterData[DataPoints.ConsumesHeroic],
            characterData[DataPoints.ConsumesDestruction],
            characterData[DataPoints.ConsumesHaste],
            characterData[DataPoints.ConsumesFelMana],
            characterData[DataPoints.ConsumesIronshield]);

        characterData[DataPoints.ConsumesGems] = sumNonNull(characterData[DataPoints.ConsumesRunes],
            characterData[DataPoints.ConsumesHealthStones],
            characterData[DataPoints.ConsumesWhipperRootTuber],
            characterData[DataPoints.ConsumesThistleTea],
            characterData[DataPoints.ConsumesManaGem],
            characterData[DataPoints.ConsumesNightmareSeed]);

        characterData[DataPoints.ConsumesDrums] = sumNonNull(characterData[DataPoints.ConsumesDrumsBattle],
            characterData[DataPoints.ConsumesDrumsWar],
            characterData[DataPoints.ConsumesDrumsRestoration],
            characterData[DataPoints.ConsumesDrumsPanic]);

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

        /* characterData[DataPoints.DamageWhirlwind] = this._getDamageDone(character, 1680,15589,26686,26084);
        characterData[DataPoints.DamageRainOfFire] = this._getDamageDone(character, 5740,11678,11677,6219,28794);
        characterData[DataPoints.DamageFireShield] = this._getDamageDone(character, 8317,8316,2947,11770,11771);
        characterData[DataPoints.DamageFlames] = this._getDamageDone(character, 7897,12796,19628,29115,15643);
        characterData[DataPoints.DamageCleave] = this._getDamageDone(character, 797,3433,3434,3435,5532,11427,15284,15496,15579,15584,15613,15622,15623,15663,16044,17685,19632,19642,20571,20605,20666,20677,20684,20691,22540,26350,27794,19983);
        characterData[DataPoints.DamageBlizzard] = this._getDamageDone(character, 26607);
        characterData[DataPoints.DamageExplode] = this._getDamageDone(character, 26059,25699);
        characterData[DataPoints.DamageImpale] = this._getDamageDone(character, 26025);
        characterData[DataPoints.DamageBomb] = this._getDamageDone(character, 8858,9143,22334);
        characterData[DataPoints.DamageThunderclap] = this._getDamageDone(character, 26554,8732);
        characterData[DataPoints.DamageShadowStorm] = this._getDamageDone(character, 26546,26555);
        characterData[DataPoints.DamageDarkGlare] = this._getDamageDone(character, 41936,41937,26029);
        characterData[DataPoints.DamageFalling] = this._getDamageDone(character, 3);
        characterData[DataPoints.DamageVoidZone] = this._getDamageDone(character, 28863,28865);
        characterData[DataPoints.DamagePoisonCloud] = this._getDamageDone(character, 28240,28241);
        characterData[DataPoints.DamageFrostBreath] = this._getDamageDone(character, 3129,28524);
        characterData[DataPoints.DamageEruption] = this._getDamageDone(character, 29371);
        characterData[DataPoints.DamageBroodPowerBronze] = this._getDamageDone(character, 22311);
        characterData[DataPoints.DamageVoidBlast] = this._getDamageDone(character, 27812);
        characterData[DataPoints.DamageTailSweep] = this._getDamageDone(character, 15847,25653);
        characterData[DataPoints.DamagePositiveCharge] = this._getDamageDone(character, 28062);
        characterData[DataPoints.DamageNegativeCharge] = this._getDamageDone(character, 28085);
        characterData[DataPoints.DamageDisruptingShout] = this._getDamageDone(character, 29107);
        characterData[DataPoints.DamageChill] = this._getDamageDone(character, 28547);
        characterData[DataPoints.DamageDarkBlast] = this._getDamageDone(character, 28457);
        characterData[DataPoints.DamageWailOfSouls] = this._getDamageDone(character, 28459);

        characterData[DataPoints.DamageTooltip] = this._getDamageTakenTable(character);

        characterData[DataPoints.DamageTotal] = sumNonNull(characterData[DataPoints.DamageWhirlwind],
            characterData[DataPoints.DamageRainOfFire],
            characterData[DataPoints.DamageFireShield],
            characterData[DataPoints.DamageFlames],
            characterData[DataPoints.DamageCleave],
            characterData[DataPoints.DamageBlizzard],
            characterData[DataPoints.DamageExplode],
            characterData[DataPoints.DamageImpale],
            characterData[DataPoints.DamageBomb],
            characterData[DataPoints.DamageThunderclap],
            characterData[DataPoints.DamageShadowStorm],
            characterData[DataPoints.DamageDarkGlare],
            characterData[DataPoints.DamageFalling],
            characterData[DataPoints.DamageVoidZone],
            characterData[DataPoints.DamagePoisonCloud],
            characterData[DataPoints.DamageFrostBreath],
            characterData[DataPoints.DamageEruption],
            characterData[DataPoints.DamageBroodPowerBronze],
            characterData[DataPoints.DamageVoidBlast],
            characterData[DataPoints.DamageTailSweep],
            characterData[DataPoints.DamagePositiveCharge],
            characterData[DataPoints.DamageNegativeCharge],
            characterData[DataPoints.DamageDisruptingShout],
            characterData[DataPoints.DamageChill],
            characterData[DataPoints.DamageDarkBlast],
            characterData[DataPoints.DamageWailOfSouls]); */
        
        return characterData;
    }

    _getWorldBuffUptime(character, buffId) {
        const {raidTime} = this.state;
        const {buffs, raidStartTime} = character;

        if (!buffs) {
            return null;
        }

        let characterBuff = buffs[buffId];
        if (!characterBuff) {
            return null;
        }

        let buffEnd = characterBuff.bands[characterBuff.bands.length-1].endTime;
        let buffStart = raidStartTime;
        let uptime = (buffEnd - buffStart)/raidTime;

        return uptime;
    }

    _getBuffs(character, options) {
        const {buffs} = character;

        if (!buffs) {
            return [];
        }

        let activeBuffs = [];
        for (let i = 0; i < options.length; ++i) {
            if (buffs[options[i].id]) {
                activeBuffs.push(options[i]);
            }
        }

        return activeBuffs;
    }

    _getWeaponImbue(character, options) {
        const {weaponEnchant} = character;

        if (!weaponEnchant) {
            return [];
        }

        let activeBuffs = [];
        for (let i = 0; i < options.length; ++i) {
            if (weaponEnchant.id == options[i].id) {
                activeBuffs.push(options[i]);
            }
        }

        return activeBuffs;
    }

    _getGemCount(character, rarity) {
        const {gems} = character;

        if (!gems) {
            return null;
        }

        let gemList = Object.values(gems);

        return gemList.reduce((gemCount, gem) => {

            if (gem.rarity === rarity) {
                gemCount += gem.count;
            }

            return gemCount;
        }, 0)

    }

    _getGemList(character) {
        const {gems} = character;

        if (!gems) {
            return [];
        }

        let gemList = Object.values(gems);

        return gemList.reduce((gemIcons, gem) => {

            gemIcons.push({
                id: gem.id,
                name: gem.count + " x " + gem.label + " (" + gem.description + ")",
                icon: gem.icon
            })

            return gemIcons;
        }, []);
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

        if (casts) {
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
        }

        if (fights) {
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

        if (!casts) {
            return 0;
        }

        let castCount = 0;
        for (let i = 0; i < casts.length; ++i) {
            let cast = casts[i];
            if ((fightType == null || cast.fightType === fightType) && cast.type === "cast" && spellIds.includes(cast.ability.guid)) {
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

    _getDamageDone(character, ...spellIds) {
        const {damageTaken} = character;

        let damageTakenArray = Object.values(damageTaken);

        let damageAmount = 0;
        for (let i = 0; i < damageTakenArray.length; ++i) {
            let damage = damageTakenArray[i];
            if (spellIds.includes(damage.guid)) {
                damageAmount += damage.total;
            }
        }

        return damageAmount;
    }

    _addIfNotNull(characterData, properyName, propertyLabel, table) {
        if (characterData[properyName]) {
            table.push({name: propertyLabel, value: characterData[properyName]});
        }
    }
    _getDamageTakenTable(characterData) {
        let damageTakenTable = [];

        this._addIfNotNull(characterData, DataPoints.DamageWhirlwind, "Whirlwind", damageTakenTable);

        this._addIfNotNull(characterData, DataPoints.DamageRainOfFire, "Rain of Fire", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageFireShield, "Fire Shield", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageFlames, "Flames", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageCleave, "Cleave", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageBlizzard, "Blizzard", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageExplode, "Explode", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageImpale, "Impale", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageBomb, "Bomb", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageThunderclap, "Thunderclap", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageShadowStorm, "Shadow Storm", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageDarkGlare, "Dark Glare", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageFalling, "Falling", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageVoidZone, "Void Zone", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamagePoisonCloud, "Poison Cloud", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageFrostBreath, "Frost Breath", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageEruption, "Eruption", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageBroodPowerBronze, "Brood Power Bronze", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageVoidBlast, "Void Blast", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageTailSweep, "Tail Sweep", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamagePositiveCharge, "Positive Charge", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageNegativeCharge, "Negative Charge", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageDisruptingShout, "Disrupting Shout", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageChill, "Chill", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageDarkBlast, "Dark Blast", damageTakenTable);
        this._addIfNotNull(characterData,DataPoints.DamageWailOfSouls, "wail of Souls", damageTakenTable);

        return damageTakenTable;
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