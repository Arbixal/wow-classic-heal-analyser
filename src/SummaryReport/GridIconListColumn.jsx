import {Component} from "react";

export class GridIconListColumn extends Component {
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

        if (!Array.isArray(value)) {
            return ' ';
        }

        return (
            <>
            { value.map(x => (
                <img className="spell_icon" src={"https://assets.rpglogs.com/img/warcraft/abilities/" + x.icon} alt={x.name} data-tip={x.name} />
            ))}
            </>
        );
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
        const {label, cssClass, icon_name, icon_url} = this.props;

        if (!this.isVisible()) {
            return null;
        }

        let icon = icon_url;
        if (icon == null) {
            icon = "https://assets.rpglogs.com/img/warcraft/abilities/" + icon_name;
        }

        return (
        <th className={cssClass}>
            <img className="spell_icon" src={icon} alt={label} data-tip={label} />
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