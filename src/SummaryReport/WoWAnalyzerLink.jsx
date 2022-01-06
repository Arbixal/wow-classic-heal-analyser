export function WoWAnalyzerLink(props) {
    const {reportId, fightId} = props;

    let link = `https://wowanalyzer.com/report/${reportId}`;
    if (fightId > 0) {
        link += `/${fightId}`;
    }
    return (
        <div><a href={link} className="external" target="_blank" rel="noreferrer"><img src="https://www.wowanalyzer.com/favicon-16x16.png" alt="WoWAnalyzer"></img>Open in WoWAnalyzer</a></div>
    );
}