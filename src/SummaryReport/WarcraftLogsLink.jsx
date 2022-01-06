export function WarcraftLogsLink(props) {
    const { reportId, fightId } = props;

    let link = `https://classic.warcraftlogs.com/reports/${reportId}`;
    if (fightId > 0) {
        link += `#fight=${fightId}`;
    }
    return (
        <div><a href={link} className="external" target="_blank" rel="noreferrer"><img src="https://assets.rpglogs.com/img/warcraft/favicon.png" alt="Threat Graph icon" />Open in Warcraft Logs</a></div>
    );
}