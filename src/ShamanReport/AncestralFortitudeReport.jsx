import "./AncestralFortitudeReport.css";
import { Component } from "react";
import { LogLoader } from "../warcraftLogLoader";
import { msToTime, asPercentage } from "../utils";

export class AncestralFortitudeReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            fights: [],
            tanksPerFight: {},
            tanks: {},
            isLoaded: false,
            reportId: props.reportId
        }
    }

    //getArmorBuffUptime
    _getArmorBuffUptime(fights) {
        let buffCalls = fights.map(fight => LogLoader.getArmorBuffUptime(fight.start_time, fight.end_time, fight.id))
        return Promise.all(buffCalls)
        .then(res => new Promise((resolve, _reject) => {
            let buffsForFight = res.reduce((accum, current) => {
                accum[current.context] = current.data;

                return accum;
            }, {});
            resolve(buffsForFight);
        }))
        .then(allBuffs => {
            this.setState({
                buffUptime: allBuffs
            })
        });
    }

    _getTanksForFights(fights) {
        let tankCalls = fights.map(fight => LogLoader.getTankInfo(fight.start_time, fight.end_time, fight.id));
        return Promise.all(tankCalls)
            .then(res => new Promise((resolve, _reject) => {
                let tanksForFight = res.reduce((accum, current) => {
                    accum[current.context] = current.data;

                    return accum;
                }, {});
                resolve(tanksForFight);
            }))
            .then(allTanks => {
                this.setState({
                    tanksPerFight: allTanks,
                    tanks: Object.entries(allTanks).reduce((accum, [_fightkey, current]) => {
                        Object.entries(current).reduce((innerAccum, [charId, character]) => {
                            if (!innerAccum[charId]) {
                                innerAccum[charId] = { name: character.name, class: character.type };
                            }

                            return innerAccum
                        }, accum)

                        return accum;
                    }, {})
                })
            });
    }

    componentDidMount() {
        const { reportId } = this.state;
        if (!reportId)
            return;

        LogLoader.getFights()
            .then(
                (result) => {
                    let fights = result.fights.filter(x => x.boss !== 0);
                    return Promise.all([
                        this._getTanksForFights(fights),
                        this._getArmorBuffUptime(fights)
                    ])
                    .then(_results => {
                        this.setState({
                            isLoaded: true,
                            fights: fights
                        });
                    },
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error: error
                        })
                    })
                    /* let tankCalls = fights.map(fight => LogLoader.getTankInfo(fight.start_time, fight.end_time, fight.id));
                    return Promise.all(tankCalls)
                        .then(res => new Promise((resolve, _reject) => {
                            let tanksForFight = res.reduce((accum, current) => {
                                accum[current.context] = current.data;

                                return accum;
                            }, {});
                            resolve(tanksForFight);
                        }))
                        .then(allTanks => {
                            this.setState({
                                isLoaded: true,
                                fights: fights,
                                tanksPerFight: allTanks,
                                tanks: Object.entries(allTanks).reduce((accum, [_fightkey, current]) => {
                                    Object.entries(current).reduce((innerAccum, [charId, character]) => {
                                        if (!innerAccum[charId]) {
                                            innerAccum[charId] = { name: character.name, class: character.type };
                                        }

                                        return innerAccum
                                    }, accum)

                                    return accum;
                                }, {})
                            })
                        },
                            (error) => {
                                this.setState({
                                    isLoaded: true,
                                    error: error
                                })
                            }) */
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    })
                });
    }

    render() {
        const { error, isLoaded, tanks, fights, tanksPerFight, buffUptime } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading ...</div>;
        } else {
            return (
                <>
                    <h3>Ancestral Fortitude/Inspiration</h3>
                    <table>
                        <thead>
                            <tr>
                                <td>&nbsp;</td>
                                {Object.entries(tanks).map(([key, value]) => <td key={key} className={"inspiration_heading " + value.class + "Background"} colspan="2">{value.name}</td>)}
                            </tr>
                        </thead>
                        <tbody>
                            {fights.map((fight, idx) => {
                                return (
                                    <tr key={fight.id} className={(idx % 2 === 0 ? "even" : "odd")}>
                                        <td className={!fight.boss ? "trash" : fight.kill ? "success" : "fail"}>{fight.name} {fight.kill ? "- Kill " : "- Wipe "}({msToTime(fight.end_time - fight.start_time)})</td>
                                        {Object.entries(tanks).map(([key, value]) => {
                                            if (tanksPerFight[fight.id][key]) {
                                                let fightLength = fight.end_time - fight.start_time;
                                                let tankBuffInfo = buffUptime[fight.id][key];
                                                let tankBuffUptime = tankBuffInfo ? tankBuffInfo.totalUptime / fightLength : 0;
                                                let preBuff = tankBuffInfo ? tankBuffInfo.bands[0].startTime === fight.start_time ? true : false : false;
                                                return (
                                                    <>
                                                    <td key={fight.id + "_" + key} className={"center " + (preBuff ? "tick" : "cross")}>{preBuff ? "✔" : "✖"}</td>
                                                    <td className="right">{asPercentage(tankBuffUptime)}</td>
                                                    </>
                                                )
                                            }

                                            return <td key={fight.id + "_" + key} colspan="2">&nbsp;</td>
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <div className="note">The tick or cross indicates that they had the buff on fight start (on pull) and the percentage shows how much of the fight it was up for.</div>
                </>
            )
        }
    }
}