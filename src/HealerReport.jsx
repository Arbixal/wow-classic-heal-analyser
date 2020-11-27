import {Component} from "react";
import {FightReport} from "./FightReport";
import {LogLoader} from "./warcraftLogLoader";

export class HealerReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            fights: [],
            characters: [],
            isLoaded: false,
            reportId: props.reportId
        }
    }

    componentDidMount() {
        const { reportId } = this.state;
        if (!reportId)
            return;

        LogLoader.getFights()
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    fights: result.fights.filter(x => x.boss !== 0),
                    characters: result.friendlies.reduce((acc, obj) => {
                        let id = obj["id"];
                        if (!acc[id]) {
                            acc[id] = obj;
                        }

                        return acc;
                    }, {})
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
        const { error, isLoaded, fights, reportId, characters} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading ...</div>;
        } else {
            return (
                <>
                {fights.map(item => (
                    <FightReport key={item.id} fight={item} characters={characters} reportId={reportId} />
                ))}
                </>
            )
        }
    }
}