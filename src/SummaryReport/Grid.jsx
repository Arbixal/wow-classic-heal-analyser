import {Component, Children, isValidElement, cloneElement} from "react";
import {DataPoints, emptyData, GroupKeys} from "./GridContexts";
import {GridRow} from "./GridRow";
import ReactGA from 'react-ga4';

export class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: {
                [GroupKeys.Gems]: true,
                [GroupKeys.Enchants]: true,
                [GroupKeys.ProtPotions]: true,
                [GroupKeys.Consumes]: true,
                [GroupKeys.DispelsInterrupts]: true,
            },
            summaryRow: {...emptyData, [DataPoints.Name]: "Totals"},
        }

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

        if (this.state.summaryRow !== nextState.summaryRow) {
            return true;
        }

        return false;
    }

    handleColGroupToggle(colGroup) {
        ReactGA.event("select_content", { content_type: "column_group", item_id: colGroup});
        this.setState((state) => ({
            collapsed: {...state.collapsed, [colGroup]: (state.collapsed[colGroup] ? !state.collapsed[colGroup] : true)}
        }));
    }

    _numericValue(value) {
        if (value === ' ' || typeof(value) !== 'number')
            return 0;

        return value;
    }

    calculateSummaryRow(data) {
        const {children} = this.props;
        let summaryRow = {...emptyData, [DataPoints.Name]: "Totals"};

        data.forEach(character => {
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
                        summaryRow[field] = this._numericValue(summaryRow[field]) + this._numericValue(character[field]);
                    }
                });
            });
        })

        return summaryRow;
    }

    render() {
        const {data, children, fightId, classFilter, roleFilter, boss} = this.props;
        const {collapsed} = this.state;

        const summaryRow = this.calculateSummaryRow(data);

        let ctx = {collapsed: collapsed, classFilter: classFilter, roleFilter: roleFilter, boss: boss};

        return (
        <table className="grid_table">
            <thead>
                <tr className="grid_header">
                    {Children.map(children, child => {
                        // checking isValidElement is the safe way and avoids a typescript error too
                        if (isValidElement(child)) {
                            return cloneElement(child, { render: (x) => x.renderHeader(), renderType: "header", context: ctx, summary: summaryRow, onColGroupToggle: this.handleColGroupToggle });
                        }
                        return child;
                    })}
                </tr>
                <tr className="grid_subheader">
                {Children.map(children, child => {
                        // checking isValidElement is the safe way and avoids a typescript error too
                        if (isValidElement(child)) {
                            return cloneElement(child, { render: (x) => x.renderSubHeader(), renderType: "sub-header", context: ctx, summary: summaryRow });
                        }
                        return child;
                    })}
                </tr>
            </thead>
            <tbody>
                {data.map((obj, idx) => (
                <GridRow key={obj.Name} character={obj} summary={summaryRow} row={idx} context={ctx} fightId={fightId}>
                    {children}
                </GridRow>
                ))}
    
            </tbody>
            <tfoot>
                <tr className="Summary">
                    {Children.map(children, child => {
                        if (isValidElement(child)) {
                            return cloneElement(child, { render: (x) => x.renderCell(), renderType: "cell", data: summaryRow, summary: summaryRow, context: ctx })
                        }
                    })}
                </tr>
            </tfoot>
        </table>
        );
    }
}