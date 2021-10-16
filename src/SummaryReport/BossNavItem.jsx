import { bosses } from "../data"

function getPercentageBar(fight) {
    if (fight.kill) {
        return <div className={"boss_percentage kill"}></div>
    }
    
    return <div className={"boss_percentage wipe"} style={{ width: (fight.fightPercentage/100).toString() + "%"}}></div>
}

export function BossNavItem (props) {
    let {boss} = props;
    let bossInfo = bosses[boss.id];
    if (!bossInfo) {
        bossInfo = {
            name: boss.fights[boss.fights.length -1]?.name ?? "Unknown",
            logo: "https://assets.rpglogs.com/img/warcraft/icons/Boss.jpg",
        }
    }

    let lastFight = boss.fights[boss.fights.length - 1];

    let lastFightTile = getPercentageBar(lastFight);
/*     if (lastFight.kill) {
        lastFightTile = <div className={"boss_percentage kill"}></div>
    }
    else {
        lastFightTile = <div className={"boss_percentage wipe"} style={{ width: (lastFight.fightPercentage/100).toString() + "%"}}></div>
    } */

    let otherFights = [];
    for (let i = boss.fights.length - 2; i >= 0; --i) {
        otherFights.push(boss.fights[i]);
    }

    

    return (
        <>
        <div className="boss_tile">
            <div className="boss_fight">
                <img src={bossInfo.logo} alt={bossInfo.name} />
                <div className="boss_name">{bossInfo.name}</div>
                {lastFightTile}
            </div>
            {otherFights.map(fight => (
                <div className="boss_fight">
                    {getPercentageBar(fight)}{/* <div className={"boss_percentage wipe"} style={{ width: (fight.fightPercentage/100).toString() + "%"}}></div> */}
                </div>
            ))}
        </div>
        </>
    )
}