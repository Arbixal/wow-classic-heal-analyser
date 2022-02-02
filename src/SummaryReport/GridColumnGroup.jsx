import {Component, Children, cloneElement, isValidElement} from "react";
import ReactTooltip from "react-tooltip";
import { ExpandCollapseButton } from "./ExpandCollapseButton";

export class GridColumnGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: props.context?.collapsed[props.id] || false,
/*             classFilter: props.context?.classFilter,
            roleFilter: props.context?.roleFilter, */
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // If data changed and we render cells
        if (this.props.renderType === "cell" && nextProps.data !== this.props.data) {
            return true;
        }

        // If class filter or role filter changed
        if (this.props.context?.classFilter !== nextProps.context?.classFilter ||
            this.props.context?.roleFilter !== nextProps.context?.roleFilter) {
                return true;
            }

        // If collapsed changed for us
        if (this.props.context?.collapsed[this.props.id] !== nextProps.context?.collapsed[this.props.id]) {
            return true;
        }

        return false;
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.context?.collapsed[this.props.id] !== prevProps.context?.collapsed[this.props.id]
            /* || this.props.context?.classFilter !== prevProps.context?.classFilter
            || this.props.context?.roleFilter !== prevProps.context?.roleFilter*/)  {
          this.setState({
              collapsed: this.props.context?.collapsed[this.props.id] || false,
              /* classFilter: this.props.context?.classFilter,
              roleFilter: this.props.context?.roleFilter, */
          })
        }

        ReactTooltip.rebuild();
    }

    componentDidMount() {
        ReactTooltip.rebuild();
    }

    _getVisibleChildCount() {
        const {children} = this.props;
        let ctx =  this._getContext();

        let visibleCount = 0;
        Children.forEach(children, (child) => {
            if (isValidElement(child)) {
                if (child.props.visibility) {
                    let isVisible = child.props.visibility(ctx);
                    if (isVisible) {
                        visibleCount++;
                    }
                }
                else {
                    visibleCount++;
                }
            }
        })

        return visibleCount;
    }

    _getChildCount() {
        const {children} = this.props;

        let visibleCount = 0;
        Children.forEach(children, (child) => {
            if (isValidElement(child)) {
                visibleCount++;
            }
        })

        return visibleCount;
    }

    _canExpand() {
        return this._getChildCount() > 1;
    }

    _getContext() {
        const {id, context} = this.props;

        return {
            collapsed: context?.collapsed[id] || false,
            classFilter: context?.classFilter,
            roleFilter: context?.roleFilter,
            boss: context?.boss,
        };
    }

    renderHeader() {
        const {id, label, onColGroupToggle, cssClass} = this.props;
        const {collapsed} = this.state;

        let visibleChildren = this._getVisibleChildCount();

        if (visibleChildren === 0) {
            return null;
        }

        return <th className={cssClass + ' ' + id} colSpan={visibleChildren}>{label}{this._canExpand() && <ExpandCollapseButton expanded={!collapsed} onToggle={() => onColGroupToggle(id)} />}</th>;
    }

    renderSubHeader() {
        const {children, cssClass} = this.props;
        let ctx =  this._getContext();

        return Children.map(children, child => {
            // checking isValidElement is the safe way and avoids a typescript error too
            if (isValidElement(child)) {
                if (child.props.visibility) {
                    let isVisible = child.props.visibility(ctx);
                    if (!isVisible) {
                        return null;
                    }
                }
                return cloneElement(child, { context: ctx, render: (x) => x.renderSubHeader(), renderType: "sub-header", cssClass: child.props.cssClass + ' ' + cssClass});
            }
            return child;
        })
    }

    renderCell() {
        const {children, data} = this.props;
        let ctx =  this._getContext();

        return Children.map(children, child => {
            // checking isValidElement is the safe way and avoids a typescript error too
            if (isValidElement(child)) {
                if (child.props.visibility) {
                    let isVisible = child.props.visibility(ctx);
                    if (!isVisible) {
                        return null;
                    }
                }
                return cloneElement(child, { data: data, context: ctx, render: (x) => x.renderCell(), renderType: "cell" });
            }
            return child;
        })
    }

    render() {

        return this.props.render(this);
    }
}