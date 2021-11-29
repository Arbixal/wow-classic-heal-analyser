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
        }

        this._logLoader = props.logLoader;

        this.handleColGroupToggle = this.handleColGroupToggle.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.data !== nextProps.data) {
            return true;
        }

        if (this.props.classFilter !== nextProps.classFilter) {
            return true;
        }

        if (this.props.roleFilter !== nextProps.roleFilter) {
            return true;
        }

        if (this.props.fightId !== nextProps.fightId) {
            return true;
        }

        if (this.state.collapsed !== nextState.collapsed) {
            return true;
        }

        return false;
    }

    handleColGroupToggle(colGroup) {
        this.setState((state) => ({
            collapsed: {...state.collapsed, [colGroup]: (state.collapsed[colGroup] ? !state.collapsed[colGroup] : true)}
        }));
    }

    render() {
        const {data, children, fightId, classFilter, roleFilter} = this.props;
        const {collapsed} = this.state;

        let ctx = {collapsed: collapsed, classFilter: classFilter, roleFilter: roleFilter};

        return (
        <table className="grid_table">
            <thead>
                <tr className="grid_header">
                    {Children.map(children, child => {
                        // checking isValidElement is the safe way and avoids a typescript error too
                        if (isValidElement(child)) {
                            return cloneElement(child, { render: (x) => x.renderHeader(), renderType: "header", context: ctx, onColGroupToggle: this.handleColGroupToggle });
                        }
                        return child;
                    })}
                </tr>
                <tr className="grid_subheader">
                {Children.map(children, child => {
                        // checking isValidElement is the safe way and avoids a typescript error too
                        if (isValidElement(child)) {
                            return cloneElement(child, { render: (x) => x.renderSubHeader(), renderType: "sub-header", context: ctx });
                        }
                        return child;
                    })}
                </tr>
            </thead>
            <tbody>
                {data.map((obj, idx) => (
                <GridRow key={obj.id} character={obj} row={idx} logLoader={this._logLoader} context={ctx} fightId={fightId} >
                    {children}
                </GridRow>
                ))}
    
            </tbody>
        </table>
        );
    }
}