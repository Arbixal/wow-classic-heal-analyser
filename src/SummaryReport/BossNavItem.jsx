import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import { bosses } from "../datastore"
import {msToTime} from "../utils"

function getPercentageBar(fight) {
    if (fight.kill) {
        return <div className={"boss_percentage kill"}></div>
    }
    
    return <div className={"boss_percentage wipe"} style={{ width: (100 - (fight.fight_percentage/100)).toString() + "%"}}></div>
}

function convertHardModeLevel(hardModes, hardModeLevel) {
    if (!hardModeLevel || hardModeLevel === 0)
        return 0;

    if (hardModes === 1)
        return 1;

    if (hardModes === 2) {
        if (hardModeLevel === 4)
            return 2;

        return 1;
    }

    // After this everything matches value provided by hardModeLevel
    return hardModeLevel;
}

function getHardMode(fight, bossInfo) {
    if (!bossInfo.hardModes) {
        return null;
    }

    let hardMode = convertHardModeLevel(bossInfo.hardModes, fight.hardModeLevel);

    let hardModeString = '';
    for (let i = 1; i <= bossInfo.hardModes; ++i) {
        if (hardMode >= i)
            hardModeString += '★';
        else
            hardModeString += '☆';
    } 

    return <div className="boss_hardmode">{hardModeString}</div>
}

export function BossNavItem (props) {
    let {boss, onMouseOver, onMouseOut} = props;
    let {id, filter} = useParams();
    let bossInfo = bosses[boss.id];
    if (!bossInfo) {
        bossInfo = {
            name: boss.fights[boss.fights.length -1]?.name ?? "Unknown",
            logo: "https://assets.rpglogs.com/img/warcraft/icons/Boss.jpg",
        }
    }

    let lastFight = boss.fights[boss.fights.length - 1];

    let lastFightTile = getPercentageBar(lastFight);
    const filterSuffix = filter ? "/" + filter : "";

    let otherFights = [];
    for (let i = boss.fights.length - 2; i >= 0; --i) {
        otherFights.push(boss.fights[i]);
    }

    return (
        <>
        <div className="boss_tile">
            <NavLink to={"/" + id + "/" + lastFight.id + filterSuffix} className={({ isActive }) => isActive ? "selected" : "" }>
                <div className="boss_fight" onMouseOver={(e) => onMouseOver(lastFight.id)} onMouseOut={(e) => onMouseOut(lastFight.id)}>
                    {getHardMode(lastFight, bossInfo)}
                    <img src={bossInfo.logo} alt={bossInfo.name} />
                    <div className="boss_name">{bossInfo.name}</div>
                    {lastFightTile}
                </div>
            </NavLink>
            {otherFights.map(fight => (
                <NavLink key={fight.id} to={"/" + id + "/" + fight.id + filterSuffix} className={({ isActive }) => isActive ? "selected" : "" }>
                    <div className="boss_fight" onMouseOver={(e) => onMouseOver(fight.id)} onMouseOut={(e) => onMouseOut(fight.id)}>
                        {getHardMode(lastFight, bossInfo)}
                        {msToTime(fight.end_time - fight.start_time)}
                        {getPercentageBar(fight)}
                    </div>
                </NavLink>
            ))}
        </div>
        </>
    )
}