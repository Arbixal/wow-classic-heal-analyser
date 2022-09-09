import {Component} from "react";
import {asPercentage} from "../utils";

export class GridIconColumn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: true
        };
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
        const {label, cssClass, icon_name, icon_url, item_id, spell_id} = this.props;

        if (!this.isVisible()) {
            return null;
        }

        let icon = icon_url;
        if (icon == null) {
            icon = "https://assets.rpglogs.com/img/warcraft/abilities/" + icon_name;
        }

        let cellContent = <img className="spell_icon" src={icon} alt={label} data-tip={item_id || spell_id ? null : label} />
        if (item_id) {
            cellContent = <a href={"https://wowhead.com/wotlk/item=" + item_id} target="_blank" rel="noreferrer">{cellContent}</a>
        }

        if (spell_id) {
            cellContent = <a href={"https://wowhead.com/wotlk/spell=" + spell_id} target="_blank" rel="noreferrer">{cellContent}</a>
        }

        return (
        <th className={cssClass}>
            {cellContent}
        </th>);
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