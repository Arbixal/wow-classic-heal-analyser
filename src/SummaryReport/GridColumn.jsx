import {Component} from "react";
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
        const {data, field, cssClass} = this.props;

        if (!this.isVisible()) {
            return null;
        }

        return <td className={cssClass}>{this._cleanupValue(data[field])}</td>
    }

    render() {
        return this.props.render(this);
    }
}