import './App.css';
import {Component} from "react";
import {HealerReportWithRouter as HealerReport} from "./HealerReport/HealerReport";
import {ShamanReportWithRouter as ShamanReport} from "./ShamanReport/ShamanReport";
import {SummaryReportWithRouter as SummaryReport} from "./SummaryReport/SummaryReport";
import {
  HashRouter as Router,
  Switch,
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
          <Switch>
            <Route exact path="/">
              <ReportLoad />
            </Route>
            <Route path="/:id/archived/shaman">
              <ShamanReport />
            </Route>
            <Route path="/:id/archived/healer" >
              <HealerReport />
            </Route>
            <Route path="/:id/:fightId?/:filter?">
              <SummaryReport />
            </Route>
          </Switch>
      </Router>
      </>
    );
  }
}

export default App;
