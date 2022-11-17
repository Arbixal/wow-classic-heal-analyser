import "./SummaryReport.scss";
import {useState} from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import {WarcraftLogLoader} from "../warcraftLogLoader";
import {GroupKeys, DataPoints} from "./GridContexts";
import {Grid} from "./Grid";
import {GridColumnGroup} from "./GridColumnGroup";
import {GridColumn} from "./GridColumn";
import {GridIconColumn} from "./GridIconColumn";
import { GridIconListColumn } from "./GridIconListColumn";
import { BossNavItem } from "./BossNavItem";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";
import { format, intervalToDuration} from "date-fns";
import { FightChart } from "./FightChart";
import { WoWAnalyzerLink } from "./WoWAnalyzerLink";
import { ThreatReportLink } from "./ThreatReportLink";
import { WarcraftLogsLink } from "./WarcraftLogsLink";
import ReactGA from 'react-ga4';
import { CharacterMapper } from "./Mapper";
import { useEffect } from "react";

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
        filter: 'Warrior',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/inv_sword_27.jpg',
    },
    'rogue': {
        slug: 'rogue',
        name: 'Rogue',
        filter: 'Rogue',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/INV_ThrowingKnife_04.jpg',
    },
    'hunter': {
        slug: 'hunter',
        name: 'Hunter',
        filter: 'Hunter',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/class_hunter.jpg',
    },
    'mage': {
        slug: 'mage',
        name: 'Mage',
        filter: 'Mage',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/INV_Staff_13.jpg',
    },
    'warlock': {
        slug: 'warlock',
        name: 'Warlock',
        filter: 'Warlock',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/Spell_Nature_Drowsy.jpg',
    },
    'priest': {
        slug: 'priest',
        name: 'Priest',
        filter: 'Priest',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/INV_Staff_30.jpg',
    },
    'paladin': {
        slug: 'paladin',
        name: 'Paladin',
        filter: 'Paladin',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/class_paladin.jpg',
    },
    'shaman': {
        slug: 'shaman',
        name: 'Shaman',
        filter: 'Shaman',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/inv_jewelry_talisman_04.jpg',
    },
    'druid': {
        slug: 'druid',
        name: 'Druid',
        filter: 'Druid',
        icon: 'https://assets.rpglogs.com/img/warcraft/abilities/Ability_Druid_Maul.jpg',
    },
    'deathknight': {
        slug: 'deathknight',
        name: 'Death Knight',
        filter: 'DeathKnight',
        icon: 'https://wow.zamimg.com/images/wow/icons/medium/class_deathknight.jpg',
    },
}

export function SummaryReport() {
    const { id, fightId, filter } = useParams();
    const { pathname } = useLocation();

    const [isLoaded, setLoaded] = useState(false);
    const [error, setError] = useState();
    const [needsUpgrade, setNeedsUpgrade] = useState(false);
    const [characters, setCharacters] = useState({});
    const [fights, setFights] = useState([]);
    const [reportDetails, setReportDetails] = useState({});
    const [raidStart, setRaidStart] = useState();
    const [raidTime, setRaidTime] = useState();
    const [selectedFight, setSelectedFight] = useState(-1);
    const [hoverFight, setHoverFight] = useState();
    const [fightIds, setFightIds] = useState([]);
    const [boss, setBoss] = useState();
    const [bossList, setBossList] = useState([]);
    const [data, setData] = useState([]);
    const [classFilter, setClassFilter] = useState();
    const [roleFilter, setRoleFilter] = useState();

    // Selected Fight
    useEffect(() => {
        setSelectedFight(fightId == null || isNaN(parseInt(fightId)) ? -1 : parseInt(fightId));
    }, [fightId]);

    // Load data
    useEffect(() => {
        if (!id)
            return;

        let logLoader = WarcraftLogLoader.Load(id);

        //ReactGA.send({ hitType: "pageview", page: this.props.match.path, reportId: id, fightId: fightId, filter: filter });


        //this.setState({reportId: id, selectedFight: selectedFight});

        logLoader.loadReport(selectedFight)
        .then(report => {
            if (report.needsUpgrade) {
                setNeedsUpgrade(true);
                return;
            }

            setCharacters(report.characters);
            setFights(report.fights);

            let startTime = new Date(report.startTimestamp);
            let endTime = new Date(report.endTimestamp);
            setReportDetails({
                title: report.title,
                startTime: startTime,
                endTime: endTime,
                duration: intervalToDuration({start: startTime, end: endTime})
            });
            setRaidStart(report.startTime);
            setRaidTime(report.endTime - report.startTime);
            setLoaded(true);

            //this._getResults(report);
            //this._generateFilteredData(report.characters);
        })
        .catch((error) => {
            setLoaded(true);
            setError(error);
        });
    }, [id, selectedFight]);

    // Get Fight Ids
    useEffect(() => {
        let fightIdsRaw = [];
        if (fightId === -1 && hoverFight == null)
            return [];
            
        if (fightId > 0)
        fightIdsRaw.push(fightId);

        if (hoverFight > 0)
        fightIdsRaw.push(hoverFight);

        if (fightId === 0 || hoverFight === 0) {
            fights.forEach(fight => {
                if (fight.boss !== 0)
                    return;
                    
                    fightIdsRaw.push(fight.id);
            });
        }

        setFightIds(fightIdsRaw);

    }, [selectedFight, hoverFight, fightId, fights])

    // Get Boss
    useEffect(() => {
        setBossList(fights.filter(fight => fight.boss > 0)
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
                setBoss(fight.boss);
            }

            return accum;
        },[]));
    }, [fights, selectedFight])

    // Filter data
    useEffect(() => {
        const characterMapper = new CharacterMapper();
        const classSortOrder = { Warrior: 0, Rogue: 1, Hunter: 2, Mage: 3, Warlock: 4, Priest: 5, Shaman: 6, Paladin: 7, Druid: 8, DeathKnight: 9 };

        let roleFilter = null;
        let classFilter = null;

        if (roles[filter]) {
            classFilter = null;
            roleFilter = filter;
        }

        if (classes[filter]) {
            classFilter = classes[filter].filter;
            roleFilter = null;
        }

        let dataRaw = [...Object.values(characters)
        .filter((character) => character.type !== "NPC" && character.type !== "Pet" && character.type !== "Boss" && character.type !== "Unknown")
        .filter((character) => classFilter == null || character.type === classFilter)
        .filter((character) => roleFilter == null || character.data.roles.includes(roleFilter))
        .sort((aValue, bValue) => {
             let classCompare = classSortOrder[aValue.type] - classSortOrder[bValue.type];

             if (classCompare !== 0)
                 return classCompare;

             return aValue.name.localeCompare(bValue.name);
            })
        .map((character) => characterMapper.Flatten(character))];

        setData(dataRaw);
        setClassFilter(classFilter);
        setRoleFilter(roleFilter);

        //this.setState({data: data, classFilter: classFilter, roleFilter: roleFilter});
    }, [filter, characters])

    // Send Analytics call
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: pathname, reportId: id, fightId: fightId, filter: filter });
    }, [filter, fightId, id, pathname])

    function _handleFightMouseOver(fightId) {

        if (hoverFight !== fightId) {
            console.log("OnMouseOver: " + fightId);
            setHoverFight(fightId);
        }
    }

    function _handleFightMouseOut(fightId) {
        if (hoverFight === fightId) {
            console.log("OnMouseOut: " + fightId);
            setHoverFight(null);
        }
    }

    const filterSuffix = filter ? "/" + filter : "";

    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (needsUpgrade) {
        return <div>The report format has changed since refreshing the page. Please refresh your page for the latest version.</div>
    } else if (!isLoaded) {
        return <div>Loading ...</div>;
    } else {
        return (
            <>
                <h3 className="report_title">{reportDetails.title}</h3>
                <div><strong>Report ID:</strong> {id} (<Link to="/">Load a different report</Link>)</div>
                <div>{format(reportDetails.startTime, "EEE do MMM HH:mm:ss")} - {format(reportDetails.endTime, "HH:mm:ss")} ({reportDetails.duration.hours}:{reportDetails.duration.minutes.toString().padStart(2, "0")}:{reportDetails.duration.seconds.toString().padStart(2, "0")})</div>
                <WoWAnalyzerLink reportId={id} fightId={selectedFight} />
                <ThreatReportLink reportId={id} fightId={selectedFight} />
                <WarcraftLogsLink reportId={id} fightId={selectedFight} />
                <div className="boss_nav">
                <div className="boss_tile">
                    <NavLink to={"/" + id + (filterSuffix ? "/-1" + filterSuffix : "")}>
                        <div className="boss_fight">
                            <img src="https://wow.zamimg.com/images/wow/journal/ui-ej-boss-default.png" alt="Summary" />
                            <div className="boss_name">Summary</div>
                        </div>
                    </NavLink>
                </div>
                <div className="boss_tile">
                    <NavLink to={"/" + id + "/0" + filterSuffix} activeClassName="selected">
                        <div className="boss_fight" onMouseOver={(e) => _handleFightMouseOver(0)} onMouseOut={(e) => _handleFightMouseOut(0)}>
                            <img src="https://wow.zamimg.com/images/wow/journal/ui-ej-boss-timmy-the-cruel.png" alt="Trash" />
                            <div className="boss_name">Trash</div>
                        </div>
                    </NavLink>
                </div>
                    {bossList.map(bossObj => (
                        <BossNavItem key={bossObj.id} boss={bossObj} onMouseOver={_handleFightMouseOver} onMouseOut={_handleFightMouseOut} />
                    ))}
                </div>
                <FightChart fights={fights} raidStart={raidStart} raidTime={raidTime} fightIds={fightIds} />
                <div className="nav_bar">
                    <NavLink to={"/" + id + "/" + selectedFight} className={({ isActive }) => isActive ? "selected" : "" }><div className={"class_nav All"}><img className="spell_icon" src="https://assets.rpglogs.com/img/warcraft/abilities/inv_misc_questionmark.jpg" alt="All" />All</div></NavLink>
                    <div className="separator"></div>
                    {Object.values(roles).map(role => <NavLink key={role.slug} to={"/" + id + "/" + selectedFight + "/" + role.slug} className={({ isActive }) => isActive ? "selected" : "" }><div className={"class_nav " + role.name}><img className="spell_icon" src={role.icon} alt={role.name} />{role.name}</div></NavLink>)}
                    <div className="separator"></div>
                    {Object.values(classes).map(role => <NavLink key={role.slug} to={"/" + id + "/" + selectedFight + "/" + role.slug} className={({ isActive }) => isActive ? "selected" : "" }><div className={"class_nav " + role.slug}><img className="spell_icon" src={role.icon} alt={role.name} />{role.name}</div></NavLink>)}
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
                            <GridColumn field={DataPoints.GemsCommon} label="Tbc"
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
                        <GridColumnGroup id={GroupKeys.Consumes} label="Consumes" cssClass="even-colgroup">
                            <GridIconColumn field={DataPoints.ConsumesPotions} 
                                            label="Potions" 
                                            icon_name="inv_drink_06.jpg" 
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === true}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesManaPots} 
                                            label="Mana Potions" 
                                            icon_name="inv_alchemy_elixir_02.jpg" 
                                            item_id={33448}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesRejuvPots} 
                                            label="Rejuvenation Potions" 
                                            icon_name="inv_alchemy_elixir_06.jpg" 
                                            item_id={40087}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesHealthPots} 
                                            label="Healing Potion" 
                                            icon_name="inv_alchemy_elixir_05.jpg" 
                                            item_id={33447}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesFreeActionPotion} 
                                            label="Free Action Potion" 
                                            icon_name="inv_potion_04.jpg" 
                                            item_id={5634}
                                            cssClass="protection_potion frost"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesLivingActionPotion} 
                                            label="Living Action Potion" 
                                            icon_name="inv_potion_07.jpg" 
                                            item_id={20008}
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
                            <GridIconColumn field={DataPoints.ConsumesSpeed} 
                                            label="Speed Potion" 
                                            icon_name="inv_alchemy_elixir_04.jpg" 
                                            item_id={40211}
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
                            <GridIconColumn field={DataPoints.ConsumesWildMagic} 
                                            label="Potion of Wild Magic" 
                                            icon_name="inv_alchemy_elixir_01.jpg" 
                                            item_id={40212}
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
                            <GridIconColumn field={DataPoints.ConsumesIndestructable} 
                                            label="Indestructable Potion" 
                                            icon_name="inv_alchemy_elixir_empty.jpg" 
                                            item_id={40093}
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
                            <GridIconColumn field={DataPoints.ConsumesGreaterStoneshield} 
                                            label="Greater Stoneshield Potion" 
                                            icon_name="inv_potion_69.jpg" 
                                            item_id={13455}
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
                                            item_id={36892}
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
                                            icon_name="inv_misc_gem_sapphire_02.jpg" 
                                            item_id={33312}
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
                            <GridIconColumn field={DataPoints.ConsumesGlobalThermalSapperCharge} 
                                            label="Global Thermal Sapper Charge" 
                                            icon_name="inv_gizmo_supersappercharge.jpg" 
                                            item_id={42641}
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesSuperSapperCharge} 
                                            label="Super Sapper Charge" 
                                            icon_name="inv_gizmo_supersappercharge.jpg" 
                                            item_id={23827}
                                            cssClass="protection_potion fire"
                                            visibility={(ctx) => ctx.collapsed === false && ctx.hasValue}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.ConsumesSapperCharge} 
                                            label="Sapper Charge" 
                                            icon_name="spell_fire_selfdestruct.jpg" 
                                            item_id={10646}
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

                        <GridColumnGroup id={GroupKeys.DispelsInterrupts} label="Dispels" cssClass="odd-colgroup">
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
                            <GridIconColumn field={DataPoints.DispelShamanCureToxins} 
                                            label="Cure Toxins" 
                                            icon_name="spell_nature_nullifypoison.jpg" 
                                            cssClass="center"
                                            spell_id={526}
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
                            <GridIconColumn field={DataPoints.DispelShamanCleansingTotem} 
                                            label="Cleansing Totem" 
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
                            <GridIconColumn field={DataPoints.DispelShamanCleanseSpirit} 
                                            label="Cleanse Spirit" 
                                            icon_name="ability_shaman_cleansespirit.jpg" 
                                            cssClass="center"
                                            spell_id={66056}
                                            visibility={(ctx) => ctx.classFilter === "Shaman"}
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
                            <GridIconColumn field={DataPoints.DispelPaladinCleanse} 
                                            label="Cleanse" 
                                            icon_name="spell_holy_renew.jpg" 
                                            cssClass="center"
                                            spell_id={4987}
                                            visibility={(ctx) => ctx.classFilter === "Paladin"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.DispelPaladinPurify} 
                                            label="Purify" 
                                            icon_name="spell_holy_purify.jpg" 
                                            cssClass="center"
                                            spell_id={1152}
                                            visibility={(ctx) => ctx.classFilter === "Paladin"}
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
                            <GridIconColumn field={DataPoints.InterruptDruidMaim} 
                                            label="Maim" 
                                            icon_name="ability_druid_mangle-tga.jpg" 
                                            cssClass="center"
                                            spell_id={49802}
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
                                            label="Wind Shear" 
                                            icon_name="spell_nature_cyclone.jpg" 
                                            cssClass="center"
                                            spell_id={57994}
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
                            <GridIconColumn field={DataPoints.InterruptMindFreeze} 
                                            label="Mind Freeze" 
                                            icon_name="spell_deathknight_mindfreeze.jpg" 
                                            cssClass="center"
                                            spell_id={47528}
                                            visibility={(ctx) => ctx.classFilter === "DeathKnight"}
                                            aggregate={true} />
                            <GridIconColumn field={DataPoints.InterruptStrangulate} 
                                            label="Strangulate" 
                                            icon_name="spell_shadow_soulleech_3.jpg" 
                                            cssClass="center"
                                            spell_id={47476}
                                            visibility={(ctx) => ctx.classFilter === "DeathKnight"}
                                            aggregate={true} />
                            
                        </GridColumnGroup>
                        <GridColumnGroup id={GroupKeys.Cooldowns} label="Cooldowns" cssClass="even-colgroup">
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
                        <GridColumnGroup id={GroupKeys.Mage} label="Abilities" cssClass="odd-colgroup">
                            <GridIconColumn field={DataPoints.MageArcaneBarrage}
                                        label="Arcane Barrage"
                                        icon_name="ability_mage_arcanebarrage.jpg"
                                        cssClass="center"
                                        spell_id={44781}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageArcaneBlast}
                                        label="Arcane Blast"
                                        icon_name="spell_arcane_blast.jpg"
                                        cssClass="center"
                                        spell_id={42897}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageArcaneExplosion}
                                        label="Arcane Explosion"
                                        icon_name="spell_nature_wispsplode.jpg"
                                        cssClass="center"
                                        spell_id={42921}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageArcaneMissiles}
                                        label="Arcane Missiles"
                                        icon_name="spell_nature_starfall.jpg"
                                        cssClass="center"
                                        spell_id={42846}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageBlastWave}
                                        label="Blizzard"
                                        icon_name="spell_holy_excorcism_02.jpg"
                                        cssClass="center"
                                        spell_id={42945}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageBlizzard}
                                        label="Blizzard"
                                        icon_name="spell_frost_icestorm.jpg"
                                        cssClass="center"
                                        spell_id={42940}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageDeepFreeze}
                                        label="Deep Freeze"
                                        icon_name="ability_mage_deepfreeze.jpg"
                                        cssClass="center"
                                        spell_id={58534}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageDragonsBreath}
                                        label="Dragon's Breath"
                                        icon_name="inv_misc_head_dragon_01.jpg"
                                        cssClass="center"
                                        spell_id={42950}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageFireBall}
                                        label="Fireball"
                                        icon_name="spell_fire_flamebolt.jpg"
                                        cssClass="center"
                                        spell_id={42833}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageFireBlast}
                                        label="Fire Blast"
                                        icon_name="spell_fire_fireball.jpg"
                                        cssClass="center"
                                        spell_id={42873}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageFireWard}
                                        label="Fire Ward"
                                        icon_name="spell_fire_firearmor.jpg"
                                        cssClass="center"
                                        spell_id={43010}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageFlamestrike}
                                        label="Flamestrike"
                                        icon_name="spell_fire_selfdestruct.jpg"
                                        cssClass="center"
                                        spell_id={42926}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageFrostbolt}
                                        label="Frostbolt"
                                        icon_name="spell_frost_frostbolt02.jpg"
                                        cssClass="center"
                                        spell_id={42842}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageFrostfireBolt}
                                        label="Frostfire Bolt"
                                        icon_name="ability_mage_frostfirebolt.jpg"
                                        cssClass="center"
                                        spell_id={47610}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageFrostWard}
                                        label="Frost Ward"
                                        icon_name="spell_frost_frostward.jpg"
                                        cssClass="center"
                                        spell_id={43012}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageIceArmor}
                                        label="Ice Armor"
                                        icon_name="spell_frost_frostarmor02.jpg"
                                        cssClass="center"
                                        spell_id={43008}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageInvisibility}
                                        label="Invisibility"
                                        icon_name="ability_mage_invisibility.jpg"
                                        cssClass="center"
                                        spell_id={66}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageLivingBomb}
                                        label="Living Bomb"
                                        icon_name="ability_mage_livingbomb.jpg"
                                        cssClass="center"
                                        spell_id={55362}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageMageArmor}
                                        label="Mage Armor"
                                        icon_name="spell_magearmor.jpg"
                                        cssClass="center"
                                        spell_id={43024}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageManaShield}
                                        label="Mana Shield"
                                        icon_name="spell_shadow_detectlesserinvisibility.jpg"
                                        cssClass="center"
                                        spell_id={43020}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MageMoltenArmor}
                                        label="Molten Armor"
                                        icon_name="ability_mage_moltenarmor.jpg"
                                        cssClass="center"
                                        spell_id={43046}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                            <GridIconColumn field={DataPoints.MagePyroblast}
                                        label="Pyroblast"
                                        icon_name="spell_fire_fireball02.jpg"
                                        cssClass="center"
                                        spell_id={42891}
                                        visibility={(ctx) => ctx.classFilter === "Mage" && ctx.hasValue}
                                        aggregate={true} />
                        </GridColumnGroup>
                    </Grid>
                    <ReactTooltip />
            </>
        )
    }
}
