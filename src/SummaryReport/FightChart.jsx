import "./FightChart.scss";
import React, { createRef } from 'react';
import { Tooltip } from 'react-svg-tooltip';
import { asPercentage, getTextWidth, msToTime } from "../utils";
import { useState } from "react";
import { useEffect } from "react";

const maxWidth = 1000;

let timeToPixel = (time, raidTime) => {
    return (time / raidTime) * maxWidth;
}

let getClassName = (fight) => {
    if (fight.boss === 0) {
        return "trash";
    }

    if (fight.kill) {
        return "boss-kill";
    }

    return "boss-wipe";
};

export function FightChart(props) {
    const {fights, raidStart,  raidTime, fightIds} = props;
    const [fightBands, setFightBands] = useState([]);
    const [fightSummary, setFightSummary] = useState({ trash: 0, bossKill: 0, bossWipe: 0});

    useEffect(() => {
        let fightBandsTemp = [];

        fights.forEach((fight, index, array) => {
            if (index !== 0) {
                let label = msToTime(fight.start_time - array[index-1].end_time) + " (" + msToTime(array[index-1].end_time) + "-" + msToTime(fight.start_time) + ")";
                fightBandsTemp.push({ 
                    start: timeToPixel(array[index-1].end_time - raidStart, raidTime), 
                    end: timeToPixel(fight.start_time - raidStart, raidTime), 
                    cssClass: "idle", 
                    id: 10000 + index, 
                    duration: msToTime(fight.start_time - array[index-1].end_time),
                    tt_label: label,
                    width: getTextWidth(label) + 20,
                    name: null
                });
            }
    
            let label = msToTime(fight.end_time - fight.start_time) + " (" + msToTime(fight.start_time) + "-" + msToTime(fight.end_time) + ")";
            fightBandsTemp.push({
                start: timeToPixel(fight.start_time - raidStart, raidTime),
                end: timeToPixel(fight.end_time - raidStart, raidTime), 
                cssClass: getClassName(fight), id: fight.id, 
                duration: msToTime(fight.end_time - fight.start_time),
                tt_label: label,
                width: getTextWidth(label) + 20,
                name: fight.name,
            });

            setFightBands(fightBandsTemp);
        })

    }, [fights, raidStart, raidTime]);

    useEffect(() => {
        let fightSummaryTemp = fights.reduce((agg, fight) => {
            if (fight.boss === 0) {
                agg.trash += (fight.end_time - fight.start_time);
                return agg;
            }
    
            if (fight.kill) {
                agg.bossKill += (fight.end_time - fight.start_time);
                return agg;
            }
    
            agg.bossWipe += (fight.end_time - fight.start_time);
    
            return agg;
    
        }, { trash: 0, bossKill: 0, bossWipe: 0});
        fightSummaryTemp.idle = raidTime - fightSummaryTemp.trash - fightSummaryTemp.bossKill - fightSummaryTemp.bossWipe;

        setFightSummary(fightSummaryTemp);
    }, [fights, raidTime]);

    return (
        <div className="fightChart">
            <div className="fightSummary">
                <table>
                    <tbody>
                        <tr className="boss-kill">
                            <th className="name">Boss Kills</th>
                            <td className="time">{msToTime(fightSummary.bossKill)}</td>
                            <td className="percentage">{asPercentage(fightSummary.bossKill / raidTime, 1)}</td>
                        </tr>
                        <tr className="boss-wipe">
                            <th className="name">Boss Wipes</th>
                            <td className="time">{msToTime(fightSummary.bossWipe)}</td>
                            <td className="percentage">{asPercentage(fightSummary.bossWipe / raidTime, 1)}</td>
                        </tr>
                        <tr className="trash">
                            <th className="name">Trash</th>
                            <td className="time">{msToTime(fightSummary.trash)}</td>
                            <td className="percentage">{asPercentage(fightSummary.trash / raidTime, 1)}</td>
                        </tr>
                        <tr className="idle">
                            <th className="name">Idle</th>
                            <td className="time">{msToTime(fightSummary.idle)}</td>
                            <td className="percentage">{asPercentage(fightSummary.idle / raidTime, 1)}</td>
                        </tr>
                        <tr className="total">
                            <th>&nbsp;</th>
                            <td className="time">{msToTime(raidTime)}</td>
                            <td className="percentage">100.0%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <svg width={maxWidth * 1.2} height="110" preserveAspectRatio="xMaxYMin meet">
                <g>
                    {fightBands.map(band => {
                        const bandRef = createRef();
                        return (<React.Fragment key={band.id}>
                                <rect ref={bandRef} x={band.start} y={fightIds.includes(band.id) ? "0" : "10"} height="65" width={band.end - band.start} className={band.cssClass} />
                                <Tooltip triggerRef={bandRef}>
                                    <rect x={5} y={15} width={band.width} height={25} rx={5} ry={5} fill={'black'} fillOpacity={0.7} />
                                    <text x={10} y={32} fontSize={14} textAnchor="start" className={band.cssClass}>{band.tt_label}</text>
                                </Tooltip>
                            </React.Fragment>)
                    })}
                </g>
                <g>
                    { fightSummary.bossKill > 0 && (
                        <>
                        <rect x="0" y="85" height="25" width={timeToPixel(fightSummary.bossKill, raidTime)} className="boss-kill" />
                        </>
                    )}
                    { fightSummary.bossWipe > 0 && (
                        <>
                        <rect x={timeToPixel(fightSummary.bossKill, raidTime)} y="85" height="25" width={timeToPixel(fightSummary.bossWipe, raidTime)} className="boss-wipe" />
                        </>
                    )}
                    { fightSummary.trash > 0 && (
                        <>
                        <rect x={timeToPixel(fightSummary.bossKill + fightSummary.bossWipe, raidTime)} y="85" height="25" width={timeToPixel(fightSummary.trash, raidTime)} className="trash" />
                        </>
                    )}
                    { fightSummary.idle > 0 && (
                        <>
                        <rect x={timeToPixel(fightSummary.bossKill + fightSummary.bossWipe + fightSummary.trash, raidTime)} y="85" height="25" width={timeToPixel(fightSummary.idle, raidTime)} className="idle" />
                        </>
                    )}
                    
                </g>
            </svg>
        </div>
    )
}