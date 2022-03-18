import "./SummaryReport.scss";
import {Component} from "react";
import { NavLink } from "react-router-dom";
import {WarcraftLogLoader} from "../warcraftLogLoader";
import {GroupKeys, DataPoints} from "./GridContexts";
import {Grid} from "./Grid";
import {GridColumnGroup} from "./GridColumnGroup";
import {GridColumn} from "./GridColumn";
import {GridIconColumn} from "./GridIconColumn";
//import { GridBarColumn, GridBarColumnSection } from "./GridBarColumn";
import { GridIconListColumn } from "./GridIconListColumn";
import { BossNavItem } from "./BossNavItem";
import ReactTooltip from "react-tooltip";
import { withRouter, Link } from "react-router-dom";
import { format, intervalToDuration} from "date-fns";
import { FightChart } from "./FightChart";
import { WoWAnalyzerLink } from "./WoWAnalyzerLink";
import { ThreatReportLink } from "./ThreatReportLink";
import { WarcraftLogsLink } from "./WarcraftLogsLink";
import ReactGA from 'react-ga4';
import { CharacterMapper } from "./Mapper";

const roles = {
    'tank': {
        slug: 'tank',
        name: 'Tank',
        icon: 'https://wow.zamimg.com/images/wow/icons/tiny/role_tank.gif',
    },
    'dps': {
        slug: 'dps',
        name: 'DPS',
        icon: 'https://wow.zamimg.com/images/wow/icons/tiny/role_dps.gif',
    },
    'healer': {
        slug: 'healer',
        name: 'Healer',
        icon: 'https://wow.zamimg.com/images/wow/icons/tiny/role_healer.gif',
    }
};

const classes = {
    'warrior': {
        slug: 'warrior',
        name: 'Warrior',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/inv_sword_27.jpg',
    },
    'rogue': {
        slug: 'rogue',
        name: 'Rogue',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/INV_ThrowingKnife_04.jpg',
    },
    'hunter': {
        slug: 'hunter',
        name: 'Hunter',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/INV_Weapon_Bow_07.jpg',
    },
    'mage': {
        slug: 'mage',
        name: 'Mage',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/INV_Staff_13.jpg',
    },
    'warlock': {
        slug: 'warlock',
        name: 'Warlock',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/Spell_Nature_Drowsy.jpg',
    },
    'priest': {
        slug: 'priest',
        name: 'Priest',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/INV_Staff_30.jpg',
    },
    'paladin': {
        slug: 'paladin',
        name: 'Paladin',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/class_paladin.jpg',
    },
    'shaman': {
        slug: 'shaman',
        name: 'Shaman',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/inv_jewelry_talisman_04.jpg',
    },
    'druid': {
        slug: 'druid',
        name: 'Druid',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/Ability_Druid_Maul.jpg',
    },
}

class SummaryReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            needsUpgrade: false,
            error: null,
            fights: [],
            characters: {},
            isLoaded: false,
            reportDetails: {},
            context: {},
            selectedFight: -1,
            data: [],
            classFilter: null,
            roleFilter: null,
        }
        this._logLoader = null;
        this._characterMapper = new CharacterMapper();

        this.handleFightMouseOut = this.handleFightMouseOut.bind(this);
        this.handleFightMouseOver = this.handleFightMouseOver.bind(this);
    }

    _getResults(report) {
        //let report = this._logLoader.getResults(selectedFight);
        this.setState({
            isLoaded: true,
            characters: report.characters,
            fights: report.fights,
            raidStart: report.startTime,
            raidTime: report.endTime - report.startTime,
            reportDetails: {
                title: report.title,
                startTime: new Date(report.startTimestamp),
                endTime: new Date(report.endTimestamp)
            }
        });

        return report;
    }

    componentDidMount() {
        const { id, fightId, filter } = this.props.match.params;
        if (!id)
            return;

        let selectedFight = fightId == null || isNaN(parseInt(fightId)) ? -1 : parseInt(fightId);

        ReactGA.send({ hitType: "pageview", page: this.props.match.path, reportId: id, fightId: fightId, filter: filter });

        this.setState({reportId: id, selectedFight: selectedFight});

        this._logLoader = WarcraftLogLoader.Load(id);
        this.loadReport(selectedFight);
    }

    loadReport(fightId) {
        this._logLoader.loadReport(fightId)
        .then(report => {
            if (report.needsUpgrade) {
                this.setState({needsUpgrade: true})
                return;
            }

            this._getResults(report);
            this._generateFilteredData(report.characters);
        })
        .catch((error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.match !== prevProps.match) {
            const { id, fightId, filter } = this.props.match.params;
            let selectedFight = fightId == null || isNaN(parseInt(fightId)) ? -1 : parseInt(fightId);
    
            ReactGA.send({ hitType: "pageview", page: this.props.match.path, reportId: id, fightId: fightId, filter: filter });
            this.loadReport(selectedFight);
        }
    }

    _getFightIds(fightId) {
        const { fights, hoverFight} = this.state;
        let fightIds = [];
        if (fightId === -1 && hoverFight == null)
            return [];
            
        if (fightId > 0)
            fightIds.push(fightId);

        if (hoverFight > 0)
            fightIds.push(hoverFight);

        if (fightId === 0 || hoverFight === 0) {
            fights.forEach(fight => {
                if (fight.boss !== 0)
                    return;
                    
                fightIds.push(fight.id);
            });
        }

        return fightIds;
    }

    handleFightMouseOver(fightId) {
        const {hoverFight} = this.state;

        if (hoverFight !== fightId) {
            console.log("OnMouseOver: " + fightId);
            this.setState({hoverFight: fightId});
        }
    }

    handleFightMouseOut(fightId) {
        const {hoverFight} = this.state;

        if (hoverFight === fightId) {
            console.log("OnMouseOut: " + fightId);
            this.setState({hoverFight: null});
        }
    }

    _generateFilteredData(characters) {
        const {filter} = this.props.match.params;

        const classSortOrder = { Warrior: 0, Rogue: 1, Hunter: 2, Mage: 3, Warlock: 4, Priest: 5, Shaman: 6, Paladin: 7, Druid: 8 };

        let roleFilter = null;
        let classFilter = null;

        if (roles[filter]) {
            classFilter = null;
            roleFilter = filter;
        }

        if (classes[filter]) {
            classFilter = classes[filter].name;
            roleFilter = null;
        }

        let data = [...Object.values(characters)
        .filter((character) => character.type !== "NPC" && character.type !== "Pet" && character.type !== "Boss")
        .filter((character) => classFilter == null || character.type === classFilter)
        .filter((character) => roleFilter == null || character.data.roles.includes(roleFilter))
        .sort((aValue, bValue) => {
             let classCompare = classSortOrder[aValue.type] - classSortOrder[bValue.type];

             if (classCompare !== 0)
                 return classCompare;

             return aValue.name.localeCompare(bValue.name);
            })
        .map((character) => this._characterMapper.Flatten(character))];

        this.setState({data: data, classFilter: classFilter, roleFilter: roleFilter});
    }

    render() {
        const { error, needsUpgrade, isLoaded, data, reportId, reportDetails, fights, raidStart, raidTime, classFilter, roleFilter} = this.state;
        const { fightId, filter } = this.props.match.params;

        let selectedFight = fightId == null || isNaN(parseInt(fightId)) ? -1 : parseInt(fightId);
        let boss = null;

        const filterSuffix = filter ? "/" + filter : "";
        
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (needsUpgrade) {
            return <div>The report format has changed since refreshing the page. Please refresh your page for the latest version.</div>
        } else if (!isLoaded) {
            return <div>Loading ...</div>;
        } else {
            let fightIds = this._getFightIds(selectedFight);
            let duration = intervalToDuration({start: reportDetails.startTime, end: reportDetails.endTime});
            return (
                <>
                    <h3 className="report_title">{reportDetails.title}</h3>
                    <div><strong>Report ID:</strong> {reportId} (<Link to="/">Load a different report</Link>)</div>
                    <div>{format(reportDetails.startTime, "EEE do MMM HH:mm:ss")} - {format(reportDetails.endTime, "HH:mm:ss")} ({duration.hours}:{duration.minutes.toString().padStart(2, "0")}:{duration.seconds.toString().padStart(2, "0")})</div>
                    <WoWAnalyzerLink reportId={reportId} fightId={selectedFight} />
                    <ThreatReportLink reportId={reportId} fightId={selectedFight} />
                    <WarcraftLogsLink reportId={reportId} fightId={selectedFight} />
                    <div className="boss_nav">
                    <div className="boss_tile">
                        <NavLink to={"/" + reportId + (filterSuffix ? "/-1" + filterSuffix : "")}>
                            <div className="boss_fight">
                                <img src="https://wow.zamimg.com/images/wow/journal/ui-ej-boss-default.png" alt="Summary" />
                                <div className="boss_name">Summary</div>
                            </div>
                        </NavLink>
                    </div>
                    <div className="boss_tile">
                        <NavLink to={"/" + reportId + "/0" + filterSuffix} activeClassName="selected">
                            <div className="boss_fight" onMouseOver={(e) => this.handleFightMouseOver(0)} onMouseOut={(e) => this.handleFightMouseOut(0)}>
                                <img src="https://wow.zamimg.com/images/wow/journal/ui-ej-boss-timmy-the-cruel.png" alt="Trash" />
                                <div className="boss_name">Trash</div>
                            </div>
                        </NavLink>
                    </div>
                        {fights.filter(fight => fight.boss > 0)
                               .reduce((accum, fight) => {
                                    let found = false;
                                    for (let i = 0; i < accum.length; ++i) {
                                        if (accum[i].id === fight.boss) {
                                            accum[i].fights.push(fight);
                                            found = true;
                                        }
                                    }

                                    if (!found) {
                                        accum.push({ id: fight.boss, fights: [fight] });
                                    }

                                    if (fight.id === selectedFight) {
                                        boss = fight.boss;
                                    }

                                    return accum;
                               },[])
                               .map(boss => (
                            <BossNavItem key={boss.id} boss={boss} onMouseOver={this.handleFightMouseOver} onMouseOut={this.handleFightMouseOut} />
                        ))}
                    </div>
                    <FightChart fights={fights} raidStart={raidStart} raidTime={raidTime} fightIds={fightIds} />
                    <div className="nav_bar">
                        <NavLink to={"/" + reportId + "/" + selectedFight} activeClassName="selected"><div className={"class_nav All"}><img className="spell_icon" src="https://assets.rpglogs.com/img/warcraft/abilities/inv_misc_questionmark.jpg" alt="All" />All</div></NavLink>
                        <div className="separator"></div>
                        {Object.values(roles).map(role => <NavLink key={role.slug} to={"/" + reportId + "/" + selectedFight + "/" + role.slug} activeClassName="selected"><div className={"class_nav " + role.name}><img className="spell_icon" src={role.icon} alt={role.name} />{role.name}</div></NavLink>)}
                        <div className="separator"></div>
                        {Object.values(classes).map(role => <NavLink key={role.slug} to={"/" + reportId + "/" + selectedFight + "/" + role.slug} activeClassName="selected"><div className={"class_nav " + role.name}><img className="spell_icon" src={role.icon} alt={role.name} />{role.name}</div></NavLink>)}
                    </div>

                    <Grid data={data} classFilter={classFilter} roleFilter={roleFilter} fightId={selectedFight} boss={boss}>
                        <GridColumnGroup id={GroupKeys.Name} label="Name" cssClass="odd-colgroup">
                            <GridColumn field={DataPoints.Name} 
                                        cssClass="name" />
                        </GridColumnGroup>
                        <GridColumnGroup id={GroupKeys.Enchants} label="Enchants" cssClass="even-colgroup">
                            <GridColumn field={DataPoints.EnchantMissing}
                                        label="&#9033;"
                                        cssClass="enchants missing"
                                        visibility={(ctx) => ctx.collapsed === true} />
                            <GridColumn field={DataPoints.EnchantBad}
                                        label="&#128078;"
                                        cssClass="enchants bad"
                                        visibility={(ctx) => ctx.collapsed === true} />
                            <GridColumn field={DataPoints.EnchantAverage}
                                        label="&#128074;"
                                        cssClass="enchants average"
                                        visibility={(ctx) => ctx.collapsed === true} />
                            <GridColumn field={DataPoints.EnchantGood}
                                        label="&#128077;"
                                        cssClass="enchants good"
                                        visibility={(ctx) => ctx.collapsed === true} />
                            <GridIconListColumn field={DataPoints.EnchantList}
                                        label=" "
                                        visibility={(ctx) => ctx.collapsed === false} />
                        </GridColumnGroup>
                        <GridColumnGroup id={GroupKeys.Gems} label="Gems" cssClass="odd-colgroup">
                            <GridColumn field={DataPoints.GemsMissing} label="Nil"
                                        cssClass="gems empty"
                                        visibility={(ctx) => ctx.collapsed === true} />
                            <GridColumn field={DataPoints.GemsCommon} label="Co"
                                        cssClass="gems common"
                                        visibility={(ctx) => ctx.collapsed === true} />
                            <GridColumn field={DataPoints.GemsUncommon} label="Un"
                                        cssClass="gems uncommon"
                                        visibility={(ctx) => ctx.collapsed === true} />
                            <GridColumn field={DataPoints.GemsRare} label="Ra"
                                        cssClass="gems rare"
                                        visibility={(ctx) => ctx.collapsed === true} />
                            <GridColumn field={DataPoints.GemsEpic} label="Ep"
                                        cssClass="gems epic"
                                        visibility={(ctx) => ctx.collapsed === true} />
                            <GridIconListColumn field={DataPoints.GemsList}
                                        icon_name="inv_misc_gem_diamond_01.jpg"
                                        cssClass="gems"
                                        visibility={(ctx) => ctx.collapsed === false} />
                        </GridColumnGroup>
                        <GridColumnGroup id={GroupKeys.Elixirs} label="Self Buffs" cssClass="even-colgroup">
                            <GridIconListColumn field={DataPoints.ElixirsFlasks}
                                        label="Flask"
                                        icon_name="inv_potion_90.jpg"
                                        cssClass="center" />
                            <GridIconListColumn field={DataPoints.ElixirsGuardian}
                                        label="Guardian Elixirs"
                                        icon_name="ability_shaman_watershield.jpg"
                                        cssClass="center" />
                            <GridIconListColumn field={DataPoints.ElixirsBattle}
                                        label="Battle Elixirs"
                                        icon_name="ability_dualwield.jpg"
                                        cssClass="center" />
                            <GridIconListColumn field={DataPoints.ElixirsFood}
                                        label="Food Buffs"
                                        icon_name="spell_misc_food.jpg"
                                        cssClass="center" />
                            <GridIconListColumn field={DataPoints.ElixirsScrolls}
                                        label="Scrolls"
                                        icon_name="inv_scroll_07.jpg"
                                        cssClass="center" />
                            <GridIconListColumn field={DataPoints.ElixirsWeaponEnchants}
                                        label="Weapon Imbues"
                                        icon_name="ability_meleedamage.jpg"
                                        cssClass="center" />
                            <GridIconListColumn field={DataPoints.ElixirsSeasonal}
                                        label="Seasonal Buffs"
                                        icon_name="inv_misc_branch_01.jpg"
                                        cssClass="center" />
                        </GridColumnGroup>
                        <GridColumnGroup id={GroupKeys.Deaths} label="Deaths" cssClass="odd-colgroup">
                            <GridColumn field={DataPoints.Deaths} 
                                        cssClass="deaths" aggregate={true} />
                        </GridColumnGroup>
                        <GridColumnGroup id={GroupKeys.ProtPotions} label="Prot Potions" cssClass="even-colgroup">
                            <GridColumn field={DataPoints.ProtectionPotionsTotal} 
                                        label="Uses" 
                                        cssClass="center" 
                                        visibility={(ctx) => ctx.collapsed === true}
                                        aggregate={true} />
                            <GridColumn field={DataPoints.ProtectionPotionsTotalAbsorbed} 
                                        label="Absorb" 
                                        cssClass="center" 
                                        visibility={(ctx) => ctx.collapsed === true}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsNature} 
                                        label="Nature Protection Potion" 
                                        icon_name="inv_potion_06.jpg" 
                                        item_id={6052}
                                        cssClass="protection_potion nature" 
                                        visibility={(ctx) => ctx.collapsed === false}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsGreaterNature} 
                                        label="Greater Nature Protection Potion" 
                                        icon_name="inv_potion_22.jpg" 
                                        item_id={13458}
                                        cssClass="protection_potion nature" 
                                        visibility={(ctx) => ctx.collapsed === false}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsMajorNature} 
                                        label="Major Nature Protection Potion" 
                                        icon_name="inv_potion_127.jpg" 
                                        item_id={22844}
                                        cssClass="protection_potion nature" 
                                        visibility={(ctx) => ctx.collapsed === false}
                                        aggregate={true} />
                            <GridColumn field={DataPoints.ProtectionPotionsNatureAbsorbed} 
                                        label="Absorb" 
                                        cssClass="protection_potion nature" 
                                        visibility={(ctx) => ctx.collapsed === false}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsFire} 
                                        label="Fire Protection Potion" 
                                        icon_name="inv_potion_16.jpg" 
                                        item_id={6049}
                                        cssClass="protection_potion fire" 
                                        visibility={(ctx) => ctx.collapsed === false}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsGreaterFire} 
                                        label="Greater Fire Protection Potion" 
                                        icon_name="inv_potion_24.jpg" 
                                        item_id={13457}
                                        cssClass="protection_potion fire" 
                                        visibility={(ctx) => ctx.collapsed === false}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsMajorFire} 
                                        label="Major Fire Protection Potion" 
                                        icon_name="inv_potion_124.jpg" 
                                        item_id={22841}
                                        cssClass="protection_potion fire" 
                                        visibility={(ctx) => ctx.collapsed === false}
                                        aggregate={true} />
                            <GridColumn field={DataPoints.ProtectionPotionsFireAbsorbed} 
                                        label="Absorb" 
                                        cssClass="protection_potion fire" 
                                        visibility={(ctx) => ctx.collapsed === false}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsFrost} 
                                            label="Frost Protection Potion" 
                                            icon_name="inv_potion_13.jpg" 
                                            item_id={6050}
                                            cssClass="protection_potion frost" 
                                            visibility={(ctx) => ctx.collapsed === false}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsGreaterFrost} 
                                            label="Greater Frost Protection Potion" 
                                            icon_name="inv_potion_20.jpg" 
                                            item_id={13456}
                                            cssClass="protection_potion frost" 
                                            visibility={(ctx) => ctx.collapsed === false}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsMajorFrost} 
                                            label="Major Frost Protection Potion" 
                                            icon_name="inv_potion_126.jpg" 
                                            item_id={22842}
                                            cssClass="protection_potion frost" 
                                            visibility={(ctx) => ctx.collapsed === false}
                                            aggregate={true} />
                            <GridColumn field={DataPoints.ProtectionPotionsFrostAbsorbed} 
                                        label="Absorb" 
                                        cssClass="protection_potion frost" 
                                        visibility={(ctx) => ctx.collapsed === false}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsShadow} 
                                            label="Shadow Protection Potion" 
                                            icon_name="inv_potion_44.jpg" 
                                            item_id={6048}
                                            cssClass="protection_potion shadow" 
                                            visibility={(ctx) => ctx.collapsed === false}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsGreaterShadow} 
                                            label="Greater Shadow Protection Potion" 
                                            icon_name="inv_potion_23.jpg" 
                                            item_id={13459}
                                            cssClass="protection_potion shadow" 
                                            visibility={(ctx) => ctx.collapsed === false}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsMajorShadow} 
                                            label="Major Shadow Protection Potion" 
                                            icon_name="inv_potion_123.jpg" 
                                            item_id={22846}
                                            cssClass="protection_potion shadow" 
                                            visibility={(ctx) => ctx.collapsed === false}
                                            aggregate={true} />
                            <GridColumn field={DataPoints.ProtectionPotionsShadowAbsorbed} 
                                        label="Absorb" 
                                        cssClass="protection_potion shadow" 
                                        visibility={(ctx) => ctx.collapsed === false}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsGreaterArcane} 
                                            label="Greater Arcane Protection Potion" 
                                            icon_name="inv_potion_83.jpg" 
                                            item_id={13461}
                                            cssClass="protection_potion arcane" 
                                            visibility={(ctx) => ctx.collapsed === false}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsMajorArcane} 
                                            label="Major Arcane Protection Potion" 
                                            icon_name="inv_potion_128.jpg" 
                                            item_id={22845}
                                            cssClass="protection_potion arcane" 
                                            visibility={(ctx) => ctx.collapsed === false}
                                            aggregate={true} />
                            <GridColumn field={DataPoints.ProtectionPotionsArcaneAbsorbed} 
                                        label="Absorb" 
                                        cssClass="protection_potion arcane" 
                                        visibility={(ctx) => ctx.collapsed === false}
                                        aggregate={true} />
                        </GridColumnGroup>
                        <GridColumnGroup id={GroupKeys.Consumes} label="Consumes" cssClass="odd-colgroup">
                            <GridIconColumn field={DataPoints.ConsumesPotions} 
                                            label="Potions" 
                                            icon_name="inv_drink_06.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === true}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesManaPots} 
                                            label="Mana Potions" 
                                            icon_name="inv_potion_137.jpg" 
                                            item_id={22832}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesRejuvPots} 
                                            label="Rejuvenation Potions" 
                                            icon_name="inv_potion_134.jpg" 
                                            item_id={22850}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesHealthPots} 
                                            label="Healing Potion" 
                                            icon_name="inv_potion_131.jpg" 
                                            item_id={22829}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesFreeActionPotion} 
                                            label="Free/Living Action Potion" 
                                            icon_name="inv_potion_04.jpg" 
                                            item_id={5634}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesRestorationPots} 
                                            label="Restorative Potion" 
                                            icon_name="inv_potion_01.jpg" 
                                            item_id={9030}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesRagePotions} 
                                            label="Rage Potions" 
                                            icon_name="inv_potion_41.jpg" 
                                            item_id={13442}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesIronshield} 
                                            label="Ironshield Potions" 
                                            icon_name="inv_potion_133.jpg" 
                                            item_id={22849}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesInsaneStrength} 
                                            label="Insane Strength Potion" 
                                            icon_name="inv_potion_109.jpg" 
                                            item_id={22828}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesShrouding} 
                                            label="Shrouding Potion" 
                                            icon_name="inv_potion_144.jpg" 
                                            item_id={22871}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesFelRegeneration} 
                                            label="Fel Regeneration Potion" 
                                            icon_name="inv_potion_140.jpg" 
                                            item_id={31676}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesHeroic} 
                                            label="Heroic Potion" 
                                            icon_name="inv_potion_106.jpg" 
                                            item_id={22837}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesDestruction} 
                                            label="Destruction Potion" 
                                            icon_name="inv_potion_107.jpg" 
                                            item_id={22839}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesHaste} 
                                            label="Haste Potion" 
                                            icon_name="inv_potion_108.jpg" 
                                            item_id={22838}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesFelMana} 
                                            label="Fel Mana Potion" 
                                            icon_name="inv_potion_138.jpg" 
                                            item_id={31677}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />

                            <GridIconColumn field={DataPoints.ConsumesGems} 
                                            label="Gems/Runes/Stones" 
                                            icon_name="inv_misc_gem_variety_01.jpg" 
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => ctx.collapsed === true}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesRunes} 
                                            label="Dark/Demonic Runes" 
                                            icon_name="inv_misc_rune_04.jpg" 
                                            item_id={12662}
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesHealthStones} 
                                            label="Major Health Stone" 
                                            icon_name="inv_stone_04.jpg" 
                                            item_id={22105}
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesNightmareSeed} 
                                            label="Nightmare Seed" 
                                            item_id={22797}
                                            icon_name="inv_misc_herb_nightmareseed.jpg" 
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesWhipperRootTuber} 
                                            label="Whipper Root Tuber" 
                                            icon_name="inv_misc_food_55.jpg" 
                                            item_id={11951}
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesThistleTea} 
                                            label="Thistle Tea" 
                                            icon_name="inv_drink_milk_05.jpg" 
                                            item_id={7676}
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesManaGem} 
                                            label="Mana Gem" 
                                            icon_name="inv_misc_gem_stone_01.jpg" 
                                            item_id={22044}
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />

                            <GridIconColumn field={DataPoints.ConsumesDrums} 
                                            label="Drums" 
                                            icon_name="inv_misc_drum_02.jpg" 
                                            cssClass="protection_potion holy"
                                            visibility={(ctx) => ctx.collapsed === true}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesDrumsBattle} 
                                            label="Drums of Battle" 
                                            icon_name="inv_misc_drum_02.jpg" 
                                            item_id={29529}
                                            cssClass="protection_potion holy"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesDrumsWar} 
                                            label="Drums of War" 
                                            icon_name="inv_misc_drum_03.jpg" 
                                            item_id={29528}
                                            cssClass="protection_potion holy"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesDrumsRestoration} 
                                            label="Drums of Restoration" 
                                            icon_name="inv_misc_drum_07.jpg" 
                                            item_id={29531}
                                            cssClass="protection_potion holy"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesDrumsPanic} 
                                            label="Drums of Panic" 
                                            icon_name="inv_misc_drum_06.jpg" 
                                            item_id={29532}
                                            cssClass="protection_potion holy"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />

                            <GridIconColumn field={DataPoints.ConsumesExplosives} 
                                            label="Bombs and Explosives" 
                                            icon_name="inv_misc_bomb_06.jpg" 
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === true}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesHolyWater} 
                                            label="Stratholme Holy Water" 
                                            icon_name="inv_potion_75.jpg" 
                                            item_id={13180}
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesSapperCharge} 
                                            label="Sapper Charge" 
                                            icon_name="inv_gizmo_supersappercharge.jpg" 
                                            item_id={23827}
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesEzThro} 
                                            label="Ez-Thro Dynamite II" 
                                            icon_name="inv_misc_bomb_03.jpg" 
                                            item_id={18588}
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesDenseDynamite} 
                                            label="Dense Dynamite" 
                                            icon_name="inv_misc_bomb_06.jpg" 
                                            item_id={18641}
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesFelIronBombs} 
                                            label="Fel Iron Bomb" 
                                            icon_name="spell_shadow_mindbomb.jpg" 
                                            item_id={23736}
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesArcaneBombs} 
                                            label="Arcane Bomb" 
                                            icon_name="spell_fire_selfdestruct.jpg" 
                                            item_id={16040}
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />

                            <GridIconColumn field={DataPoints.ConsumesBandages} 
                                            label="First Aid" 
                                            icon_name="spell_holy_sealofsacrifice.jpg" 
                                            cssClass="protection_potion priest"
                                            visibility={(ctx) => ctx.collapsed === true}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesHeavyRuneclothBandage} 
                                            label="Bandages" 
                                            icon_name="inv_misc_bandage_netherweave_heavy.jpg" 
                                            item_id={21991}
                                            cssClass="protection_potion priest"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesAntiVenom} 
                                            label="Powerful Anti-Venom" 
                                            icon_name="inv_drink_14.jpg" 
                                            item_id={19440}
                                            cssClass="protection_potion priest"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                        </GridColumnGroup>

                        <GridColumnGroup id={GroupKeys.DispelsInterrupts} label="Dispels" cssClass="even-colgroup">
                            <GridIconColumn field={DataPoints.DispelBoss}
                                        label="Boss" 
                                        cssClass="center"
                                        icon_name="inv_misc_bone_elfskull_01.jpg"
                                        visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === true}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelTrash}
                                        label="Trash" 
                                        cssClass="center"
                                        icon_name="inv_gizmo_03.jpg"
                                        visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === true}
                                        aggregate={true} />

                            <GridIconColumn field={DataPoints.DispelPoison} 
                                            label="Poison" 
                                            icon_name="spell_nature_nullifypoison.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === false}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelDruidCurePoison} 
                                            label="Cure Poison" 
                                            icon_name="spell_nature_nullifypoison.jpg" 
                                            cssClass="center"
                                            spell_id={8946}
                                            visibility={(ctx) => ctx.classFilter === "Druid"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelDruidAbolishPoison} 
                                            label="Abolish Poison" 
                                            icon_name="spell_nature_nullifypoison_02.jpg" 
                                            cssClass="center"
                                            spell_id={2893}
                                            visibility={(ctx) => ctx.classFilter === "Druid"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelShamanCurePoison} 
                                            label="Cure Poison" 
                                            icon_name="spell_nature_nullifypoison.jpg" 
                                            cssClass="center"
                                            spell_id={526}
                                            visibility={(ctx) => ctx.classFilter === "Shaman"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelShamanPoisonCleansingTotem} 
                                            label="Poison Cleansing Totem" 
                                            icon_name="spell_nature_poisoncleansingtotem.jpg" 
                                            cssClass="center"
                                            spell_id={8166}
                                            visibility={(ctx) => ctx.classFilter === "Shaman"}
                                            aggregate={true} />

                            <GridIconColumn field={DataPoints.DispelDisease} 
                                            label="Disease" 
                                            icon_name="spell_holy_nullifydisease.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === false}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelPriestCureDisease} 
                                            label="Cure Disease" 
                                            icon_name="spell_holy_nullifydisease.jpg" 
                                            cssClass="center"
                                            spell_id={528}
                                            visibility={(ctx) => ctx.classFilter === "Priest"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelPriestAbolishDisease} 
                                            label="Abolish Disease" 
                                            icon_name="spell_nature_nullifydisease.jpg" 
                                            cssClass="center"
                                            spell_id={552}
                                            visibility={(ctx) => ctx.classFilter === "Priest"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelShamanCureDisease} 
                                            label="Cure Disease" 
                                            icon_name="spell_nature_removedisease.jpg" 
                                            cssClass="center"
                                            spell_id={2870}
                                            visibility={(ctx) => ctx.classFilter === "Shaman"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelShamanDiseaseCleansingTotem} 
                                            label="Disease Cleansing Totem" 
                                            icon_name="spell_nature_diseasecleansingtotem.jpg" 
                                            cssClass="center"
                                            spell_id={8170}
                                            visibility={(ctx) => ctx.classFilter === "Shaman"}
                                            aggregate={true} />

                            <GridIconColumn field={DataPoints.DispelCurse} 
                                            label="Curse" 
                                            icon_name="spell_nature_removecurse.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === false}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelDruidRemoveCurse} 
                                            label="Remove Curse" 
                                            icon_name="spell_holy_removecurse.jpg" 
                                            cssClass="center"
                                            spell_id={2782}
                                            visibility={(ctx) => ctx.classFilter === "Druid"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelMageRemoveLesserCurse} 
                                            label="Remove Lesser Curse" 
                                            icon_name="spell_nature_removecurse.jpg" 
                                            cssClass="center"
                                            spell_id={475}
                                            visibility={(ctx) => ctx.classFilter === "Mage"}
                                            aggregate={true} />

                            <GridIconColumn field={DataPoints.DispelMagic} 
                                            label="Magic" 
                                            icon_name="spell_holy_dispelmagic.jpg" 
                                            cssClass="center "
                                            visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === false}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelPriestDispelMagic} 
                                            label="Dispel Magic" 
                                            icon_name="spell_holy_dispelmagic.jpg" 
                                            cssClass="center"
                                            spell_id={988}
                                            visibility={(ctx) => ctx.classFilter === "Priest"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelShamanPurge} 
                                            label="Purge" 
                                            icon_name="spell_nature_purge.jpg" 
                                            cssClass="center"
                                            spell_id={8012}
                                            visibility={(ctx) => ctx.classFilter === "Shaman"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelWarlockDevourMagic} 
                                            label="Devour Magic" 
                                            icon_name="spell_nature_purge.jpg" 
                                            cssClass="center"
                                            spell_id={27277}
                                            visibility={(ctx) => ctx.classFilter === "Warlock"}
                                            aggregate={true} />

                            <GridIconColumn field={DataPoints.DispelFrenzy} 
                                            label="Frenzy" 
                                            icon_name="ability_druid_challangingroar.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === false}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelHunterTranqShot} 
                                            label="Tranquilizing Shot" 
                                            icon_name="spell_nature_drowsy.jpg" 
                                            cssClass="center"
                                            spell_id={19801}
                                            visibility={(ctx) => ctx.classFilter === "Hunter"}
                                            aggregate={true} />
                            
                            <GridColumn field={DataPoints.InterruptTotal}
                                        label="Interrupts" 
                                        cssClass="center"
                                        visibility={(ctx) => ctx.classFilter == null}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.InterruptDruidBash} 
                                            label="Bash" 
                                            icon_name="ability_druid_bash.jpg" 
                                            cssClass="center"
                                            spell_id={8983}
                                            visibility={(ctx) => ctx.classFilter === "Druid"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.InterruptDruidFeralCharge} 
                                            label="Feral Charge" 
                                            icon_name="ability_hunter_pet_bear.jpg" 
                                            cssClass="center"
                                            spell_id={16979}
                                            visibility={(ctx) => ctx.classFilter === "Druid"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.InterruptMageCounterspell} 
                                            label="Counterspell" 
                                            icon_name="spell_frost_iceshock.jpg" 
                                            cssClass="center"
                                            spell_id={2139}
                                            visibility={(ctx) => ctx.classFilter === "Mage"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.InterruptPriestSilence} 
                                            label="Silence" 
                                            icon_name="spell_shadow_impphaseshift.jpg" 
                                            cssClass="center"
                                            spell_id={15487}
                                            visibility={(ctx) => ctx.classFilter === "Priest"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.InterruptShamanEarthShock} 
                                            label="Earth Shock" 
                                            icon_name="spell_nature_earthshock.jpg" 
                                            cssClass="center"
                                            spell_id={25454}
                                            visibility={(ctx) => ctx.classFilter === "Shaman"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.InterruptRogueKick} 
                                            label="Kick" 
                                            icon_name="ability_kick.jpg" 
                                            cssClass="center"
                                            spell_id={38768}
                                            visibility={(ctx) => ctx.classFilter === "Rogue"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.InterruptCheapShot} 
                                            label="Cheap Shot" 
                                            icon_name="ability_cheapshot.jpg" 
                                            cssClass="center"
                                            spell_id={1833}
                                            visibility={(ctx) => ctx.classFilter === "Rogue"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.InterruptWarlockSpellLock} 
                                            label="Spell Lock" 
                                            icon_name="spell_shadow_mindrot.jpg" 
                                            cssClass="center"
                                            spell_id={19647}
                                            visibility={(ctx) => ctx.classFilter === "Warlock"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.InterruptHunterIntimidate} 
                                            label="Intimidation" 
                                            icon_name="ability_devour.jpg" 
                                            cssClass="center"
                                            spell_id={19577}
                                            visibility={(ctx) => ctx.classFilter === "Hunter"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.InterruptWarstomp} 
                                            label="War Stomp" 
                                            icon_name="ability_warstomp.jpg" 
                                            cssClass="center"
                                            spell_id={20549}
                                            visibility={(ctx) => ctx.classFilter === "Hunter" || ctx.classFilter === "Druid" || ctx.classFilter === "Shaman" || ctx.classFilter === "Warrior"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.InterruptWarriorPummel} 
                                            label="Pummel" 
                                            icon_name="inv_gauntlets_04.jpg" 
                                            cssClass="center"
                                            spell_id={6554}
                                            visibility={(ctx) => ctx.classFilter === "Warrior"}
                                            aggregate={true} />
                            
                        </GridColumnGroup>
                        <GridColumnGroup id={GroupKeys.Cooldowns} label="Cooldowns" cssClass="odd-colgroup">
{/*                             <GridIconListColumn field={DataPoints.Cooldowns}
                                        label=" "
                                        cssClass="center" /> */}
                            <GridIconListColumn field={DataPoints.CooldownsRacial}
                                        label=" "
                                        cssClass="cooldowns center" />
                            <GridIconListColumn field={DataPoints.CooldownsAbility}
                                        label=" "
                                        cssClass="cooldowns center" />
                            <GridIconListColumn field={DataPoints.CooldownsItems}
                                        label=" "
                                        cssClass="cooldowns center" />
                        </GridColumnGroup>
                        <GridColumnGroup id={GroupKeys.Resistance} label="Resistance" cssClass="even-colgroup">
                            <GridColumn field={DataPoints.ResistanceArcane} label="A"
                                        cssClass="protection_potion arcane" />
                            <GridColumn field={DataPoints.ResistanceFire} label="F"
                                        cssClass="protection_potion fire" />
                            <GridColumn field={DataPoints.ResistanceFrost} label="Fr"
                                        cssClass="protection_potion frost" />
                            <GridColumn field={DataPoints.ResistanceNature} label="N"
                                        cssClass="protection_potion nature" />
                            <GridColumn field={DataPoints.ResistanceShadow} label="S"
                                        cssClass="protection_potion shadow" />
                        </GridColumnGroup>
{/*                         <GridColumnGroup id={GroupKeys.Tank} label="Tank Stats" cssClass="even-colgroup">
                            <GridBarColumn label="Damage Taken" width="270" visibility={(ctx) => ctx.roleFilter === "tank"}>
                                <GridBarColumnSection field={DataPoints.DamageTakenHit} label="Hit" cssClass="class-colour1" />
                                <GridBarColumnSection field={DataPoints.DamageTakenCrushed} label="Crushing Blow" cssClass="bad2" />
                                <GridBarColumnSection field={DataPoints.DamageTakenCrit} label="Crit" cssClass="bad1" />
                                <GridBarColumnSection field={DataPoints.DamageTakenBlocked} label="Blocked" cssClass="class-colour3" />
                                <GridBarColumnSection field={DataPoints.DamageTakenParry} label="Parry" cssClass="good2" />
                                <GridBarColumnSection field={DataPoints.DamageTakenDodge} label="Dodge" cssClass="good1" />
                                <GridBarColumnSection field={DataPoints.DamageTakenMiss} label="Miss" cssClass="class-colour4" />
                            </GridBarColumn>
                            <GridColumn label="Hit" field={DataPoints.DamageTakenHit} format="%" cssClass="right class-colour4 percentage" visibility={(ctx) => ctx.roleFilter === "tank"} />
                            <GridColumn label="Crush" field={DataPoints.DamageTakenCrushed} format="%" cssClass="right class-colour4 percentage" visibility={(ctx) => ctx.roleFilter === "tank"}  />
                            <GridColumn label="Crit" field={DataPoints.DamageTakenCrit} format="%" cssClass="right class-colour4 percentage" visibility={(ctx) => ctx.roleFilter === "tank"}  />
                            <GridColumn label="Block" field={DataPoints.DamageTakenBlocked} format="%" cssClass="right class-colour4 percentage" visibility={(ctx) => ctx.roleFilter === "tank"}  />
                            <GridColumn label="Parry" field={DataPoints.DamageTakenParry} format="%" cssClass="right percentage" visibility={(ctx) => ctx.roleFilter === "tank"}  />
                            <GridColumn label="Dodge" field={DataPoints.DamageTakenDodge} format="%" cssClass="right percentage" visibility={(ctx) => ctx.roleFilter === "tank"}  />
                            <GridColumn label="Miss" field={DataPoints.DamageTakenMiss} format="%" cssClass="right percentage" visibility={(ctx) => ctx.roleFilter === "tank"}  />
                        </GridColumnGroup> */}
                    </Grid>
                    <ReactTooltip />
                    <p>* Resistance calculations include "random enchantment" items that may or may not be "of [School] Protection"</p>
                </>
            )
        }
    }
}

export const SummaryReportWithRouter = withRouter(SummaryReport);