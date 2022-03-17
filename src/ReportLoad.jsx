import { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import ReactGA from 'react-ga4';

export function ReportLoad() {
    let location = useLocation();
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: location.pathname });
    }, [location]);

    let history = useHistory();
    let [reportId, setReportId] = useState();

    let handleChange = (event) => {
        setReportId(event.target.value);
    }

    let handleSubmit = () => {
        history.push("/" + reportId);
    }

    return (
        <div className="App">
            <form onSubmit={handleSubmit} >
            <p>
                Enter your Classic Warcraft Logs ID
            </p>
            <input type="text" onChange={handleChange} /> <input type="submit" value="Go" />
            <p>
            <span style={{color: "#999999"}}>https://classic.warcraftlogs.com/reports/&lt;log id&gt;</span>
            </p>
            </form>
        </div>
    )
}