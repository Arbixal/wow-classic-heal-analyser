import './App.css';
import {Component} from "react";
import {HealerReport} from "./HealerReport/HealerReport";
import {ShamanReport} from "./ShamanReport/ShamanReport";
import {SummaryReport} from "./SummaryReport/SummaryReport";
import {LogLoader} from "./warcraftLogLoader";
import queryString from "query-string";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportInput: null,
      reportId: '',
      showTrash: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleTrashToggle = this.handleTrashToggle.bind(this);
  }

  componentDidMount() {
    const queryParsed = queryString.parse(window.location.search);
    if (queryParsed && queryParsed.id) {
      this.setState({
        reportId: queryParsed.id
      });
      LogLoader.setReport(queryParsed.id);
    }
  }

  handleChange(event) {
    this.setState({reportInput: event.target.value });
  }

  handleTrashToggle(event) {
    this.setState({showTrash: !this.state.showTrash});
  }

  handleSubmit(event) {
    const {reportInput} = this.state;
    this.setState({reportId: reportInput});
    LogLoader.setReport(reportInput);
    event.preventDefault();
  }

  render() {
    const {reportId, showTrash} = this.state;
    return (
      <Router>
        <nav>
          <ul>
            <li>
              <Link to={location => ("/" + location.search)}>Healer Report</Link>
            </li>
            <li>
              <Link to={location => ("/shaman" + location.search)}>Shaman Report</Link>
            </li>
            <li>
              <Link to={location => ("/summary" + location.search)}>Summary Report</Link>
            </li>
          </ul>
        </nav>

        <div className="App">
          <form onSubmit={this.handleSubmit} >
          Enter your Classic Warcraft Logs ID: <input type="text" value={reportId} onChange={this.handleChange} /> <input type="submit" value="Go" />
          </form>
        </div>

        {reportId !== '' &&
          <Switch>
            <Route path="/shaman">
              <ShamanReport reportId={reportId} />
            </Route>
            <Route path="/summary">
              <SummaryReport reportId={reportId} />
            </Route>
            <Route path="/" >
              <HealerReport reportId={reportId} showTrash={showTrash} />
            </Route>
          </Switch>
        }
      </Router>
    );
  }
}

export default App;
