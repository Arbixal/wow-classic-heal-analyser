export function ThreatReportLink(props) {
    const { reportId, fightId } = props;

    let link = `https://voomlz.github.io/threat/?id=${reportId}&fight=${fightId}&enemy=&target=`;
    return (
        <div><a href={link} className="external" target="_blank" rel="noreferrer"><img src="/line-chart-5754.png" alt="Threat Graph icon" />Open threat graph</a></div>
    );
}