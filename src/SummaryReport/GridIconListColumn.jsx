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
            { value.map(x => {
                if (x.count)
                    return <a href={"https://tbc.wowhead.com/" + (x.itemId ? "item=" + x.itemId : (x.spellId ? "spell=" + x.spellId : ""))} target="_blank" rel="noreferrer"><span key={x.name} className="icon_count" data-count={x.count}><img className="spell_icon" src={x.icon_url ? x.icon_url : "https://assets.rpglogs.com/img/warcraft/abilities/" + x.icon} alt={x.name} /></span></a>
                
                if (x.highlight)
                    return <a href={"https://tbc.wowhead.com/" + (x.itemId ? "item=" + x.itemId : (x.spellId ? "spell=" + x.spellId : ""))} target="_blank" rel="noreferrer"><span key={x.name} className={"icon_highlight " + x.highlight}><img className="spell_icon" src={x.icon_url ? x.icon_url : "https://assets.rpglogs.com/img/warcraft/abilities/" + x.icon} alt={x.name} /></span></a>
                
                return <a href={"https://tbc.wowhead.com/" + (x.itemId ? "item=" + x.itemId : (x.spellId ? "spell=" + x.spellId : ""))} target="_blank" rel="noreferrer"><img className="spell_icon" src={x.icon_url ? x.icon_url : "https://assets.rpglogs.com/img/warcraft/abilities/" + x.icon} alt={x.name} /></a>
            })}
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