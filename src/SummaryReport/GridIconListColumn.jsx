import {Component} from "react";

export class GridIconListColumn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: true
        };
    }

    _cleanupValue(value) {
        if (!value) {
            return ' ';
        }

        if (!Array.isArray(value)) {
            return ' ';
        }

        return (
            <>
            { value.map(x => (
                <span class="icon_count" data-tip={x.name} data-count={x.count}><img className="spell_icon" src={"https://assets.rpglogs.com/img/warcraft/abilities/" + x.icon} alt={x.name} /></span>
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
        if (icon == null && icon_name) {
            icon = "https://assets.rpglogs.com/img/warcraft/abilities/" + icon_name;
        }

        let header = label;

        if (icon) {
            header = (<img className="spell_icon" src={icon} alt={label} data-tip={label} />);
        }

        return (
        <th className={cssClass}>{header}</th>);
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