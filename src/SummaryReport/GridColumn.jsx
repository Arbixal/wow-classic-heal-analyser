import {Component} from "react";
import ReactTooltip from "react-tooltip";
import { asPercentage } from "../utils";

export class GridColumn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: true
        }
    }

    _cleanupValue(value) {
        const {format} = this.props;

        if (!value) {
            return ' ';
        }

        if (isNaN(value)) {
            return value;
        }

        if (value === 0) {
            return ' ';
        }

        if (format === "%") {
            return asPercentage(value, 0);
        }

        return value;
    }

    isVisible() {
        const {visibility} = this.props;

        if (!visibility) {
            return true;
        }

        return visibility(this.props.context);
    }

    renderHeader() {
        return null;
    }

    renderSubHeader() {
        const {label, cssClass} = this.props;

        if (!this.isVisible()) {
            return null;
        }

        return <th className={cssClass}>{label}</th>;
    }

    renderCell() {
        const {data, field, tooltipField, cssClass} = this.props;

        if (!this.isVisible()) {
            return null;
        }

        if (tooltipField == null) {
            return <td className={cssClass}>{this._cleanupValue(data[field])}</td>;
        }

        //let tooltip = data[tooltipField];

        return (
        <td className={cssClass}>
            <div data-tip>{this._cleanupValue(data[field])}</div>
            {tooltipField && <ReactTooltip>
                    <table>
                    </table>
                </ReactTooltip>}
        </td>)
    }

    render() {
        return this.props.render(this);
    }
}