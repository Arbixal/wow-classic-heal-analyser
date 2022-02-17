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
            Enter your Classic Warcraft Logs ID: <input type="text" onChange={handleChange} /> <input type="submit" value="Go" />
            </form>
        </div>
    )
}