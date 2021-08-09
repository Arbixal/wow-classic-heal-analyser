import { useState } from "react";
import { useHistory } from "react-router-dom";

export function ReportLoad() {
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