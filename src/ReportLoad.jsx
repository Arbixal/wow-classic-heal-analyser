import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ReactGA from 'react-ga4';

export function ReportLoad() {
    let location = useLocation();
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: location.pathname });
    }, [location]);

    let navigate = useNavigate();
    let [reportId, setReportId] = useState();

    let handleChange = (event) => {
        const urlPrefix = "https://classic.warcraftlogs.com/reports/"
        const value = event.target.value;
        let reportId = null;
        if (value.match(/^[a-zA-Z0-9]{16}$/)) {
            reportId = value;
        } else if (value.startsWith(urlPrefix)) {
            reportId = value.substr(urlPrefix.length, 16);
        }

        if (reportId !== null) {
            setReportId(reportId);
        }
    }

    let handleSubmit = () => {
        navigate("/" + reportId);
    }

    return (
        <div className="App">
            <form onSubmit={handleSubmit} >
            <p>
                Enter your Classic Warcraft Logs URL or ID
            </p>
            <input style={{width: "400px"}} type="text" onChange={handleChange} /> <input type="submit" value="Go" />
            <p>
            <span style={{color: "#999999"}}>https://classic.warcraftlogs.com/reports/&lt;log id&gt;</span><br />
            or<br />
            <span style={{color: "#999999"}}>&lt;log id&gt;</span><br />
            </p>
            </form>
        </div>
    )
}