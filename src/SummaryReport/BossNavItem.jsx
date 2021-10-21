import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
import { bosses } from "../data"
import {msToTime} from "../utils"

function getPercentageBar(fight) {
    if (fight.kill) {
        return <div className={"boss_percentage kill"}></div>
    }
    
    return <div className={"boss_percentage wipe"} style={{ width: (fight.fightPercentage/100).toString() + "%"}}></div>
}

export function BossNavItem (props) {
    let {boss} = props;
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
            <NavLink to={"/" + id + "/" + lastFight.id + filterSuffix} activeClassName="selected">
                <div className="boss_fight">
                    <img src={bossInfo.logo} alt={bossInfo.name} />
                    <div className="boss_name">{bossInfo.name}</div>
                    {lastFightTile}
                </div>
            </NavLink>
            {otherFights.map(fight => (
                <NavLink key={fight.id} to={"/" + id + "/" + fight.id + filterSuffix} activeClassName="selected">
                    <div className="boss_fight">
                        {msToTime(fight.end_time - fight.start_time)}
                        {getPercentageBar(fight)}{/* <div className={"boss_percentage wipe"} style={{ width: (fight.fightPercentage/100).toString() + "%"}}></div> */}
                    </div>
                </NavLink>
            ))}
        </div>
        </>
    )
}