import './App.css';
import {Component} from "react";
import {SummaryReport} from "./SummaryReport/SummaryReport";
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ReportLoad } from './ReportLoad';

class App extends Component {
  render() {
    return (
      <>
      <div className="nav-bar">
        <div className="bug-report">
          <a href="https://github.com/arbixal/wow-classic-heal-analyser/issues/new" target="_blank" rel="noreferrer"><img alt="Github Logo" src="GitHub-Mark-Light-32px.png"></img> Report a Bug</a>
        </div>
        <h1>WoW Classic Log Analyser</h1>
      </div>
      <Router>
          <Routes>
            <Route path="" element={<ReportLoad />} />
            <Route path=":id" element={<SummaryReport />}>
              <Route path=":fightId" element={<SummaryReport />}>
                <Route path=":filter" element={<SummaryReport />} />
              </Route>
            </Route>
          </Routes>
      </Router>
      </>
    );
  }
}

export default App;
