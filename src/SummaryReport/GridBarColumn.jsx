import {Component, Children, isValidElement, cloneElement} from "react";
import ReactTooltip from "react-tooltip";

export class GridBarColumn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isVisible: true
        }
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
        const {children, data, width} = this.props;

        if (!this.isVisible()) {
            return null;
        }

        let childObjects = Children.map(children, child => {
            // checking isValidElement is the safe way and avoids a typescript error too
            if (isValidElement(child)) {
                return cloneElement(child, { data: data, context: this.state });
            }
            return child;
        })

        return (
            <td width={width}>
                <div className="grid-bar-column">
                { childObjects }
                </div>
                <ReactTooltip />
            </td>
        )
    }

    render() {
        return this.props.render(this);
    }
}

export class GridBarColumnSection extends Component {
    render() {
        const {data, field, cssClass, label} = this.props;

        if (data[field] === " ")
            return null;

        return <div style={{width: (data[field] * 100) + "%"}} className={cssClass} data-tip={label}>&nbsp;</div>
    }
}