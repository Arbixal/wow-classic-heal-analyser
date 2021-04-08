export function ExpandCollapseButton(props) {
    function handleToggle() {
        props.onToggle();
    }

    return (
        <span className="expand_toggle" onClick={handleToggle}>{props.expanded ? " ‹‹" : " ››"}</span>
    )
}