import {Component} from "react";
import {LogLoader} from "../warcraftLogLoader";
import {cooldownList} from "../datastore";
import ReactTooltip from "react-tooltip";
import "./CooldownReport.css";

export class CooldownReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            reportId: props.reportId,
            startTime: props.startTime,
            endTime: props.endTime,
            characters: props.characters,
            cooldownRows: [],
            cooldowns: {},
            //events: [],
            isLoaded: false
        }
    }

    componentDidMount() {
        const { reportId, startTime, endTime, characters } = this.state;
        if (!reportId)
            return;

        LogLoader.getBuffUptime(startTime, endTime, 24659)   // Zandalarian Hero Charm
        .then(zhcResult => {

            let zhcCounts = zhcResult.reduce((accum, current) => {
                if (current.type === "Shaman") {
                    accum[current.id] = current.bands.length;
                }

                return accum;
            }, {})

            return Promise.all(characters.map(character => LogLoader.getCharacterCastTable(startTime, endTime, character.id, character.name)))
            .then(res => new Promise((resolve, _reject) => resolve(res.reduce((accum,current) => {
                let cooldownRow = { id: current.id, name: current.name, total: 0 }
                for (const entry of current.entries) {
                    if (!cooldownList[entry.guid])
                        continue;

                    cooldownRow[entry.guid] = entry.total;
                    cooldownRow.total += entry.total;
                }
                if (zhcCounts[current.id]) {
                    cooldownRow["24659"] = zhcCounts[current.id];
                    cooldownRow.total += zhcCounts[current.id];
                }

                accum = [...accum, cooldownRow];

                return accum;
            }, []))))
            .then(
                (result) => {
                    this.setState({
                        //events: result,
                        cooldownRows: result.sort((x,y) => y.total - x.total),
                        cooldowns: Object.entries(cooldownList).sort(([xKey,xValue],[yKey,yValue]) => {
                            let typeCompare = xValue.type.localeCompare(yValue.type);

                            if (typeCompare !== 0)
                                return typeCompare;

                            return xValue.name.localeCompare(yValue.name);
                        }).reduce((accum, [key,_value]) => {
                            let cooldownFound = result.reduce((found, resultRow) => {
                                if (resultRow[key]) {
                                    return true;
                                }

                                return found;
                            }, false);
                            if (cooldownFound) {
                                accum = [...accum, key];
                            }

                            return accum;
                        }, []),
                        isLoaded: true
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    })
                }
            )
        })
        
    }

    render() {
        const { error, isLoaded, cooldownRows, cooldowns} = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading ...</div>;
        } else {
            return (
                <>
                    <h3>Cooldown Usage</h3>
                    <table>
                        <thead>
                            <tr>
                                <td>&nbsp;</td>
                                {cooldowns.map(cooldown => 
                                    <td key={cooldown}><img className="spell_icon" src={"https://assets.rpglogs.com/img/warcraft/abilities/" + cooldownList[cooldown].icon} alt={cooldownList[cooldown].name} data-tip={cooldownList[cooldown].name} /></td>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {cooldownRows.map((cooldownRow,row) =>
                                <tr key={cooldownRow.id} className={"Shaman " + (row % 2 === 0 ? "even" : "odd")}>
                                    <td className="shaman_name">{cooldownRow.name}</td>
                                    {cooldowns.map(cooldown => 
                                    <td className="shaman_cooldown" key={cooldownRow.id + "_" + cooldown}>{cooldownRow[cooldown]}</td>
                                    )}
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <ReactTooltip />
                </>
            )
        }
    }
}