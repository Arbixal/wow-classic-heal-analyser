import {Component, Children, isValidElement, cloneElement} from "react";
import {DataPoints, emptyData, GroupKeys} from "./GridContexts";
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
            summaryRow: {...emptyData, [DataPoints.Name]: "Totals"},
        }

        this._logLoader = props.logLoader;

        this.handleColGroupToggle = this.handleColGroupToggle.bind(this);
        this.handleDataUpdate = this.handleDataUpdate.bind(this);
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

        if (this.state.summaryRow !== nextState.summaryRow) {
            return true;
        }

        return false;
    }

    handleColGroupToggle(colGroup) {
        this.setState((state) => ({
            collapsed: {...state.collapsed, [colGroup]: (state.collapsed[colGroup] ? !state.collapsed[colGroup] : true)}
        }));
    }

    handleDataUpdate(character) {
        const {children} = this.props;
        let {summaryRow} = this.state;

        Children.forEach(children, colGroup => {
            if (!isValidElement(colGroup)) {
                return;
            }

            Children.forEach(colGroup.props.children, column => {
                if (!isValidElement(column)) {
                    return;
                }

                if (column.props.aggregate === true && column.props.field) {
                    const field = column.props.field;
                    summaryRow[field] = (summaryRow[field] === ' ' ? 0 : summaryRow[field]) + character[field];
                }
            });
        });

        this.setState({summaryRow: {...summaryRow}});
    }

    render() {
        const {data, children, fightId, classFilter, roleFilter} = this.props;
        const {collapsed, summaryRow} = this.state;

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
                <GridRow key={obj.id} character={obj} row={idx} logLoader={this._logLoader} context={ctx} fightId={fightId} onDataUpdate={this.handleDataUpdate}>
                    {children}
                </GridRow>
                ))}
    
            </tbody>
            <tfoot>
                <tr className="Summary">
                    {Children.map(children, child => {
                        if (isValidElement(child)) {
                            return cloneElement(child, { render: (x) => x.renderCell(), renderType: "cell", data: summaryRow, context: ctx })
                        }
                    })}
                </tr>
            </tfoot>
        </table>
        );
    }
}