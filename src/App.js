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
            <Route path="/:id">
              <SummaryReport />
            </Route>
          </Switch>
      </Router>
    );
  }
}

export default App;
