import {Component} from "react";
import { withRouter } from "react-router-dom";
//import {FightReport} from "./FightReport";
import {LogLoader} from "../warcraftLogLoader";
import { AncestralFortitudeReport } from "./AncestralFortitudeReport";
import { CooldownReport } from "./CooldownReport";
import { TotemReport } from "./TotemReport";

class ShamanReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            fights: [],
            characters: {},
            pets: {},
            isLoaded: false,
            //reportId: props.reportId,
            startTime: null,
            endTime: null
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        //const { reportId } = this.state;
        if (!id)
            return;

        this.setState({reportId: id});

        LogLoader.setReport(id);
        LogLoader.getFights()
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    fights: result.fights,
                    shamans: result.friendlies.reduce((acc, obj) => {
                        if (obj.type === "Shaman") {
                            acc.push({name: obj.name, id: obj.id});
                        }

                        return acc;
                    }, []),
                    startTime: result.fights[0].start_time,
                    endTime: result.fights[result.fights.length-1].end_time
                })
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                })
            }

        );
    }

    render() {
        const { error, isLoaded, reportId, startTime, endTime, shamans} = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading ...</div>;
        } else {
            return (
                <>
                    <h2>Shaman Report</h2>
                    <TotemReport reportId={reportId} />
                    <AncestralFortitudeReport reportId={reportId}/>
                    <CooldownReport reportId={reportId} startTime={startTime} endTime={endTime} characters={shamans} />
                </>
            )
        }
    }
}

export const ShamanReportWithRouter = withRouter(ShamanReport);