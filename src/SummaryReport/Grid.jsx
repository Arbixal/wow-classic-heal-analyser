import {Component, Children, isValidElement, cloneElement} from "react";
import {GroupKeys} from "./GridContexts";
import {GridRow} from "./GridRow";

export class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: {
                [GroupKeys.Gems]: true,
                [GroupKeys.ProtPotions]: true,
                [GroupKeys.Consumes]: true,
                [GroupKeys.DispelsInterrupts]: true,
            },
            hiddenColumns: {},
            classFilter: props.classFilter,
            roleFilter: props.roleFilter,
        }

        this._logLoader = props.logLoader;

        this.handleColGroupToggle = this.handleColGroupToggle.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.classFilter !== prevProps.classFilter
            || this.props.roleFilter !== prevProps.roleFilter) {
            this.setState({
                classFilter: this.props.classFilter,
                roleFilter: this.props.roleFilter
            });
        }
    }

    handleColGroupToggle(colGroup) {
        this.setState((state) => ({
            collapsed: {...state.collapsed, [colGroup]: (state.collapsed[colGroup] ? !state.collapsed[colGroup] : true)}
        }));
    }

    render() {
        const {data, children} = this.props;

        return (
        <table>
            <thead>
                <tr className="grid_header">
                    {Children.map(children, child => {
                        // checking isValidElement is the safe way and avoids a typescript error too
                        if (isValidElement(child)) {
                            return cloneElement(child, { render: (x) => x.renderHeader(), context: this.state, onColGroupToggle: this.handleColGroupToggle });
                        }
                        return child;
                    })}
                </tr>
                <tr className="grid_subheader">
                {Children.map(children, child => {
                        // checking isValidElement is the safe way and avoids a typescript error too
                        if (isValidElement(child)) {
                            return cloneElement(child, { render: (x) => x.renderSubHeader(), context: this.state });
                        }
                        return child;
                    })}
                </tr>
            </thead>
            <tbody>
                {data.map((obj, idx) => (
                <GridRow key={obj.id} character={obj} row={idx} logLoader={this._logLoader} context={this.state} >
                    {children}
                </GridRow>
                ))}
    
            </tbody>
        </table>
        );
    }
}