import {Component} from "react";

export class ProgressBar extends Component {

    render() {
        const {summary, maxHeals} = this.props;

        return (
            <div className="bar" style={{width: (summary.getTotalHeals() / maxHeals * 100).toFixed(2) + "%"}}>
                <div className="bar_effective" style={{width: summary.getEffectivePercent()+'%'}}></div>
                <div className="bar_overheal" style={{width: (summary.getOverhealPercent() - summary.getWastedPercent())+'%'}}>&nbsp;</div>
                <div className="bar_wasted" style={{width: summary.getWastedPercent()+'%'}}>&nbsp;</div>
            </div>
        )
    }
}