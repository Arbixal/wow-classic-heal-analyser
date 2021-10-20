import "./SummaryReport.scss";
import {Component} from "react";
import { NavLink } from "react-router-dom";
import {WarcraftLogLoader} from "../warcraftLogLoader";
import {GroupKeys, DataPoints} from "./GridContexts";
import {Grid} from "./Grid";
import {GridColumnGroup} from "./GridColumnGroup";
import {GridColumn} from "./GridColumn";
import {GridIconColumn} from "./GridIconColumn";
import { GridIconListColumn } from "./GridIconListColumn";
import { BossNavItem } from "./BossNavItem";
import ReactTooltip from "react-tooltip";
import { withRouter, Link } from "react-router-dom";
import { format, intervalToDuration} from "date-fns";

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
            error: null,
            fights: [],
            characters: {},
            isLoaded: false,
            reportDetails: {},
            context: {},
            selectedFight: -1,
        }
        this._logLoader = null;

    }

    componentDidMount() {
        const { id, fight } = this.props.match.params;
        if (!id)
            return;

        this.setState({reportId: id, selectedFight: fight ?? -1});

        this._logLoader = WarcraftLogLoader.Load(id);
        this._logLoader.loadFights()
            .then(x => x.loadCharacterSummary())
            .then(x => x.loadDeaths())
            .then(x => {
                let report = x.getResults();
                this.setState({
                    isLoaded: true,
                    characters: report.Characters,
                    fights: report.Fights,
                    raidTime: report.endTime - report.startTime,
                    reportDetails: {
                        title: report.title,
                        startTime: new Date(report.startTimestamp),
                        endTime: new Date(report.endTimestamp)
                    }
                })
            })
            .catch((error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                })
            });
    }

    render() {
        const { error, isLoaded, characters, reportId, selectedFight, reportDetails, fights} = this.state;
        let roleFilter = null;
        let classFilter = null;
        const { filter } = this.props.match.params;

        if (roles[filter]) {
            classFilter = null;
            roleFilter = filter;
        }

        if (classes[filter]) {
            classFilter = classes[filter].name;
            roleFilter = null;
        }
        
        const classSortOrder = { Warrior: 0, Rogue: 1, Hunter: 2, Mage: 3, Warlock: 4, Priest: 5, Shaman: 6, Paladin: 7, Druid: 8 };
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading ...</div>;
        } else {
            let data = Object.values(characters)
                .filter((character) => character.type !== "NPC" && character.type !== "Pet" && character.type !== "Boss")
                .filter((character) => classFilter == null || character.type === classFilter)
                .filter((character) => roleFilter == null || character.roles.includes(roleFilter))
                .sort((aValue, bValue) => {
                     let classCompare = classSortOrder[aValue.type] - classSortOrder[bValue.type];

                     if (classCompare !== 0)
                         return classCompare;

                     return aValue.name.localeCompare(bValue.name);
                    });
            
            let duration = intervalToDuration({start: reportDetails.startTime, end: reportDetails.endTime});
            return (
                <>
                    <h3 class="report_title">{reportDetails.title}</h3>
                    <div><strong>Report ID:</strong> {reportId} (<Link to="/">Load a different report</Link>)</div>
                    <div>{format(reportDetails.startTime, "EEE do MMM HH:mm:ss")} - {format(reportDetails.endTime, "HH:mm:ss")} ({duration.hours}:{duration.minutes.toString().padStart(2, "0")}:{duration.seconds.toString().padStart(2, "0")})</div>
                    <div className="boss_nav">
                    <div className="boss_tile">
                        <NavLink to={"/" + reportId}>
                            <div className="boss_fight">
                                <img src="https://wow.zamimg.com/images/wow/journal/ui-ej-boss-default.png" alt="Summary" />
                                <div className="boss_name">Summary</div>
                            </div>
                        </NavLink>
                    </div>
                    <div className="boss_tile">
                        <NavLink to={"/" + reportId + "/0"} activeClassName="selected">
                            <div className="boss_fight">
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

                                    return accum;
                               },[])
                               .map(boss => (
                            <BossNavItem key={boss.id} boss={boss} />
                        ))}
                    </div>
                    <div className="nav_bar">
                        <NavLink to={"/" + reportId + "/" + selectedFight} activeClassName="selected"><div className={"class_nav All"}><img className="spell_icon" src="https://assets.rpglogs.com/img/warcraft/abilities/inv_misc_questionmark.jpg" alt="All" />All</div></NavLink>
                        <div className="separator"></div>
                        {Object.values(roles).map(role => <NavLink to={"/" + reportId + "/" + selectedFight + "/" + role.slug} activeClassName="selected"><div className={"class_nav " + role.name}><img className="spell_icon" src={role.icon} alt={role.name} />{role.name}</div></NavLink>)}
                        <div className="separator"></div>
                        {Object.values(classes).map(role => <NavLink to={"/" + reportId + "/" + selectedFight + "/" + role.slug} activeClassName="selected"><div className={"class_nav " + role.name}><img className="spell_icon" src={role.icon} alt={role.name} />{role.name}</div></NavLink>)}
                    </div>

                    <Grid data={data} logLoader={this._logLoader} classFilter={classFilter} roleFilter={roleFilter}>
                        <GridColumnGroup id={GroupKeys.Name} label="Name" cssClass="odd-colgroup">
                            <GridColumn field={DataPoints.Name} 
                                        cssClass="name" />
                        </GridColumnGroup>
                        <GridColumnGroup id={GroupKeys.Enchants} label="Enchants" cssClass="even-colgroup">
                            <GridColumn field={DataPoints.Enchants} 
                                        cssClass="enchants" />
                        </GridColumnGroup>
                        <GridColumnGroup id={GroupKeys.Gems} label="Gems" cssClass="odd-colgroup">
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
                                        cssClass="deaths" />
                        </GridColumnGroup>
                        <GridColumnGroup id={GroupKeys.ProtPotions} label="Prot Potions" cssClass="even-colgroup">
                            <GridColumn field={DataPoints.ProtectionPotionsTotal} 
                                        label="Uses" 
                                        cssClass="center" 
                                        visibility={(ctx) => ctx.collapsed === true} />
                            <GridColumn field={DataPoints.ProtectionPotionsTotalAbsorbed} 
                                        label="Absorb" 
                                        cssClass="center" 
                                        visibility={(ctx) => ctx.collapsed === true} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsNature} 
                                        label="Nature Protection Potion" 
                                        icon_name="inv_potion_06.jpg" 
                                        cssClass="protection_potion nature" 
                                        visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsGreaterNature} 
                                        label="Greater Nature Protection Potion" 
                                        icon_name="inv_potion_22.jpg" 
                                        cssClass="protection_potion nature" 
                                        visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsMajorNature} 
                                        label="Major Nature Protection Potion" 
                                        icon_name="inv_potion_127.jpg" 
                                        cssClass="protection_potion nature" 
                                        visibility={(ctx) => ctx.collapsed === false} />
                            <GridColumn field={DataPoints.ProtectionPotionsNatureAbsorbed} 
                                        label="Absorb" 
                                        cssClass="protection_potion nature" 
                                        visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsFire} 
                                        label="Fire Protection Potion" 
                                        icon_name="inv_potion_16.jpg" 
                                        cssClass="protection_potion fire" 
                                        visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsGreaterFire} 
                                        label="Greater Fire Protection Potion" 
                                        icon_name="inv_potion_24.jpg" 
                                        cssClass="protection_potion fire" 
                                        visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsMajorFire} 
                                        label="Major Fire Protection Potion" 
                                        icon_name="inv_potion_124.jpg" 
                                        cssClass="protection_potion fire" 
                                        visibility={(ctx) => ctx.collapsed === false} />
                            <GridColumn field={DataPoints.ProtectionPotionsFireAbsorbed} 
                                        label="Absorb" 
                                        cssClass="protection_potion fire" 
                                        visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsFrost} 
                                            label="Frost Protection Potion" 
                                            icon_name="inv_potion_13.jpg" 
                                            cssClass="protection_potion frost" 
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsGreaterFrost} 
                                            label="Greater Frost Protection Potion" 
                                            icon_name="inv_potion_20.jpg" 
                                            cssClass="protection_potion frost" 
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsMajorFrost} 
                                            label="Major Frost Protection Potion" 
                                            icon_name="inv_potion_126.jpg" 
                                            cssClass="protection_potion frost" 
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridColumn field={DataPoints.ProtectionPotionsFrostAbsorbed} 
                                        label="Absorb" 
                                        cssClass="protection_potion frost" 
                                        visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsShadow} 
                                            label="Shadow Protection Potion" 
                                            icon_name="inv_potion_44.jpg" 
                                            cssClass="protection_potion shadow" 
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsGreaterShadow} 
                                            label="Greater Shadow Protection Potion" 
                                            icon_name="inv_potion_23.jpg" 
                                            cssClass="protection_potion shadow" 
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsMajorShadow} 
                                            label="Major Shadow Protection Potion" 
                                            icon_name="inv_potion_123.jpg" 
                                            cssClass="protection_potion shadow" 
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridColumn field={DataPoints.ProtectionPotionsShadowAbsorbed} 
                                        label="Absorb" 
                                        cssClass="protection_potion shadow" 
                                        visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsGreaterArcane} 
                                            label="Greater Arcane Protection Potion" 
                                            icon_name="inv_potion_83.jpg" 
                                            cssClass="protection_potion arcane" 
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ProtectionPotionsMajorArcane} 
                                            label="Major Arcane Protection Potion" 
                                            icon_name="inv_potion_128.jpg" 
                                            cssClass="protection_potion arcane" 
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridColumn field={DataPoints.ProtectionPotionsArcaneAbsorbed} 
                                        label="Absorb" 
                                        cssClass="protection_potion arcane" 
                                        visibility={(ctx) => ctx.collapsed === false} />
                        </GridColumnGroup>
                        <GridColumnGroup id={GroupKeys.Consumes} label="Consumes" cssClass="odd-colgroup">
                            <GridIconColumn field={DataPoints.ConsumesPotions} 
                                            label="Potions" 
                                            icon_name="inv_drink_06.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === true} />
                            <GridIconColumn field={DataPoints.ConsumesManaPots} 
                                            label="Mana Potions" 
                                            icon_name="inv_potion_137.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.classFilter !== "Warrior" && ctx.classFilter !== "Rogue" && ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesRejuvPots} 
                                            label="Rejuvenation Potions" 
                                            icon_name="inv_potion_134.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesHealthPots} 
                                            label="Healing Potion" 
                                            icon_name="inv_potion_131.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesFreeActionPotion} 
                                            label="Free/Living Action Potion" 
                                            icon_name="inv_potion_04.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesRestorationPots} 
                                            label="Restorative Potion" 
                                            icon_name="inv_potion_01.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesRagePotions} 
                                            label="Rage Potions" 
                                            icon_name="inv_potion_41.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => (ctx.classFilter == null && ctx.collapsed === false && ctx.roleFilter !== "healer") || (ctx.classFilter === "Warrior")} />
                            <GridIconColumn field={DataPoints.ConsumesIronshield} 
                                            label="Ironshield Potions" 
                                            icon_name="inv_potion_133.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => (ctx.classFilter == null && ctx.collapsed === false && ctx.roleFilter !== "healer") || (ctx.roleFilter === "tank")} />
                            <GridIconColumn field={DataPoints.ConsumesInsaneStrength} 
                                            label="Insane Strength Potion" 
                                            icon_name="inv_potion_109.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesShrouding} 
                                            label="Shrouding Potion" 
                                            icon_name="inv_potion_144.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesFelRegeneration} 
                                            label="Fel Regeneration Potion" 
                                            icon_name="inv_potion_140.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesHeroic} 
                                            label="Heroic Potion" 
                                            icon_name="inv_potion_106.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesDestruction} 
                                            label="Destruction Potion" 
                                            icon_name="inv_potion_107.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesHaste} 
                                            label="Haste Potion" 
                                            icon_name="inv_potion_108.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesFelMana} 
                                            label="Fel Mana Potion" 
                                            icon_name="inv_potion_138.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false} />

                            <GridIconColumn field={DataPoints.ConsumesGems} 
                                            label="Gems/Runes/Stones" 
                                            icon_name="inv_misc_gem_variety_01.jpg" 
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => ctx.collapsed === true} />
                            <GridIconColumn field={DataPoints.ConsumesRunes} 
                                            label="Dark/Demonic Runes" 
                                            icon_name="inv_misc_rune_04.jpg" 
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => ctx.classFilter !== "Warrior" && ctx.classFilter !== "Rogue" && ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesHealthStones} 
                                            label="Major Health Stone" 
                                            icon_name="inv_stone_04.jpg" 
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesNightmareSeed} 
                                            label="Nightmare Seed" 
                                            icon_name="inv_misc_herb_nightmareseed.jpg" 
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesWhipperRootTuber} 
                                            label="Whipper Root Tuber" 
                                            icon_name="inv_misc_food_55.jpg" 
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesThistleTea} 
                                            label="Thistle Tea" 
                                            icon_name="inv_drink_milk_05.jpg" 
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => (ctx.classFilter == null && ctx.collapsed === false && ctx.roleFilter !== "healer" && ctx.roleFilter !== "tank") || (ctx.classFilter === "Rogue")} />
                            <GridIconColumn field={DataPoints.ConsumesManaGem} 
                                            label="Mana Gem" 
                                            icon_name="inv_misc_gem_stone_01.jpg" 
                                            cssClass="protection_potion nature"
                                            visibility={(ctx) => (ctx.classFilter == null && ctx.collapsed === false && ctx.roleFilter !== "healer" && ctx.roleFilter !== "tank") || (ctx.classFilter === "Mage")} />

                            <GridIconColumn field={DataPoints.ConsumesDrums} 
                                            label="Drums" 
                                            icon_name="inv_misc_drum_02.jpg" 
                                            cssClass="protection_potion holy"
                                            visibility={(ctx) => ctx.collapsed === true} />
                            <GridIconColumn field={DataPoints.ConsumesDrumsBattle} 
                                            label="Drums of Battle" 
                                            icon_name="inv_misc_drum_02.jpg" 
                                            cssClass="protection_potion holy"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesDrumsWar} 
                                            label="Drums of War" 
                                            icon_name="inv_misc_drum_03.jpg" 
                                            cssClass="protection_potion holy"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesDrumsRestoration} 
                                            label="Drums of Restoration" 
                                            icon_name="inv_misc_drum_07.jpg" 
                                            cssClass="protection_potion holy"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesDrumsPanic} 
                                            label="Drums of Panic" 
                                            icon_name="inv_misc_drum_06.jpg" 
                                            cssClass="protection_potion holy"
                                            visibility={(ctx) => ctx.collapsed === false} />

                            <GridIconColumn field={DataPoints.ConsumesExplosives} 
                                            label="Bombs and Explosives" 
                                            icon_name="inv_misc_bomb_06.jpg" 
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === true} />
                            <GridIconColumn field={DataPoints.ConsumesHolyWater} 
                                            label="Stratholme Holy Water" 
                                            icon_name="inv_potion_75.jpg" 
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesSapperCharge} 
                                            label="Sapper Charge" 
                                            icon_name="inv_gizmo_supersappercharge.jpg" 
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesEzThro} 
                                            label="Ez-Thro Dynamite II" 
                                            icon_name="inv_misc_bomb_03.jpg" 
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesDenseDynamite} 
                                            label="Dense Dynamite" 
                                            icon_name="inv_misc_bomb_06.jpg" 
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === false} />

                            <GridIconColumn field={DataPoints.ConsumesBandages} 
                                            label="First Aid" 
                                            icon_name="spell_holy_sealofsacrifice.jpg" 
                                            cssClass="protection_potion priest"
                                            visibility={(ctx) => ctx.collapsed === true} />
                            <GridIconColumn field={DataPoints.ConsumesHeavyRuneclothBandage} 
                                            label="Bandages" 
                                            icon_name="inv_misc_bandage_netherweave_heavy.jpg" 
                                            cssClass="protection_potion priest"
                                            visibility={(ctx) => ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.ConsumesAntiVenom} 
                                            label="Powerful Anti-Venom" 
                                            icon_name="inv_drink_14.jpg" 
                                            cssClass="protection_potion priest"
                                            visibility={(ctx) => ctx.collapsed === false} />
                        </GridColumnGroup>

                        <GridColumnGroup id={GroupKeys.DispelsInterrupts} label="Dispels" cssClass="even-colgroup">
                            <GridIconColumn field={DataPoints.DispelBoss}
                                        label="Boss" 
                                        cssClass="center"
                                        icon_url="https://image.flaticon.com/icons/png/128/3325/3325105.png"
                                        visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === true} />
                            <GridIconColumn field={DataPoints.DispelTrash}
                                        label="Trash" 
                                        cssClass="center"
                                        icon_url="https://image.flaticon.com/icons/png/128/3022/3022156.png"
                                        visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === true} />

                            <GridIconColumn field={DataPoints.DispelPoison} 
                                            label="Poison" 
                                            icon_name="spell_nature_nullifypoison.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.DispelDruidCurePoison} 
                                            label="Cure Poison" 
                                            icon_name="spell_nature_nullifypoison.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Druid"} />
                            <GridIconColumn field={DataPoints.DispelDruidAbolishPoison} 
                                            label="Abolish Poison" 
                                            icon_name="spell_nature_nullifypoison_02.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Druid"} />
                            <GridIconColumn field={DataPoints.DispelShamanCurePoison} 
                                            label="Cure Poison" 
                                            icon_name="spell_nature_nullifypoison.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Shaman"} />
                            <GridIconColumn field={DataPoints.DispelShamanPoisonCleansingTotem} 
                                            label="Poison Cleansing Totem" 
                                            icon_name="spell_nature_poisoncleansingtotem.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Shaman"} />

                            <GridIconColumn field={DataPoints.DispelDisease} 
                                            label="Disease" 
                                            icon_name="spell_holy_nullifydisease.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.DispelPriestCureDisease} 
                                            label="Cure Disease" 
                                            icon_name="spell_holy_nullifydisease.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Priest"} />
                            <GridIconColumn field={DataPoints.DispelPriestAbolishDisease} 
                                            label="Abolish Disease" 
                                            icon_name="spell_nature_nullifydisease.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Priest"} />
                            <GridIconColumn field={DataPoints.DispelShamanCureDisease} 
                                            label="Cure Disease" 
                                            icon_name="spell_nature_removedisease.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Shaman"} />
                            <GridIconColumn field={DataPoints.DispelShamanDiseaseCleansingTotem} 
                                            label="Disease Cleansing Totem" 
                                            icon_name="spell_nature_diseasecleansingtotem.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Shaman"} />

                            <GridIconColumn field={DataPoints.DispelCurse} 
                                            label="Curse" 
                                            icon_name="spell_nature_removecurse.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.DispelDruidRemoveCurse} 
                                            label="Remove Curse" 
                                            icon_name="spell_holy_removecurse.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Druid"} />
                            <GridIconColumn field={DataPoints.DispelMageRemoveLesserCurse} 
                                            label="Remove Lesser Curse" 
                                            icon_name="spell_nature_removecurse.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Mage"} />

                            <GridIconColumn field={DataPoints.DispelMagic} 
                                            label="Magic" 
                                            icon_name="spell_holy_dispelmagic.jpg" 
                                            cssClass="center "
                                            visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.DispelPriestDispelMagic} 
                                            label="Dispel Magic" 
                                            icon_name="spell_holy_dispelmagic.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Priest"} />
                            <GridIconColumn field={DataPoints.DispelShamanPurge} 
                                            label="Purge" 
                                            icon_name="spell_nature_purge.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Shaman"} />

                            <GridIconColumn field={DataPoints.DispelFrenzy} 
                                            label="Frenzy" 
                                            icon_name="ability_druid_challangingroar.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter == null && ctx.collapsed === false} />
                            <GridIconColumn field={DataPoints.DispelHunterTranqShot} 
                                            label="Tranquilizing Shot" 
                                            icon_name="spell_nature_drowsy.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Hunter"} />
                            
                            <GridColumn field={DataPoints.InterruptTotal}
                                        label="Interrupts" 
                                        cssClass="center"
                                        visibility={(ctx) => ctx.classFilter == null} />
                            <GridIconColumn field={DataPoints.InterruptDruidBash} 
                                            label="Bash" 
                                            icon_name="ability_druid_bash.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Druid"} />
                            <GridIconColumn field={DataPoints.InterruptDruidFeralCharge} 
                                            label="Feral Charge" 
                                            icon_name="ability_hunter_pet_bear.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Druid"} />
                            <GridIconColumn field={DataPoints.InterruptMageCounterspell} 
                                            label="Counterspell" 
                                            icon_name="spell_frost_iceshock.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Mage"} />
                            <GridIconColumn field={DataPoints.InterruptPriestSilence} 
                                            label="Silence" 
                                            icon_name="spell_shadow_impphaseshift.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Priest"} />
                            <GridIconColumn field={DataPoints.InterruptShamanEarthShock} 
                                            label="Earth Shock" 
                                            icon_name="spell_nature_earthshock.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Shaman"} />
                            <GridIconColumn field={DataPoints.InterruptRogueKick} 
                                            label="Kick" 
                                            icon_name="ability_kick.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Rogue"} />
                            <GridIconColumn field={DataPoints.InterruptWarriorPummel} 
                                            label="Pummel" 
                                            icon_name="inv_gauntlets_04.jpg" 
                                            cssClass="center"
                                            visibility={(ctx) => ctx.classFilter === "Warrior"} />
                            
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
                    </Grid>
                    <ReactTooltip />
                </>
            )
        }
    }
}

export const SummaryReportWithRouter = withRouter(SummaryReport);