import {Component, Children, isValidElement, cloneElement} from "react";

export class GridRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.character.id,
            classType: props.character.Type,
            isLoaded: true,
            error: null,
        }
    }

    render() {
        const {isLoaded, error, classType} = this.state;
        const {children, row, context, character} = this.props;

        return (
            <tr className={classType + " character " + (row % 2 === 0 ? "even" : "odd") + (!isLoaded ? " loading": "") + (error ? " error" : "")}>
                {Children.map(children, child => {
                    // checking isValidElement is the safe way and avoids a typescript error too
                    if (isValidElement(child)) {
                        return cloneElement(child, { data: character, context: context, render: (x) => x.renderCell(), renderType: "cell" });
                    }
                    return child;
                })}
            </tr>
        );
    }
}