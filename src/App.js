import './App.css';
import {Component} from "react";
import {HealerReport} from "./HealerReport";
import {LogLoader} from "./warcraftLogLoader";
import queryString from "query-string";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportInput: null,
      reportId: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  handleSubmit(event) {
    const {reportInput} = this.state;
    this.setState({reportId: reportInput});
    LogLoader.setReport(reportInput);
    event.preventDefault();
  }

  render() {
    const {reportId} = this.state;
    return (
      <>
        <div className="App">
          <form onSubmit={this.handleSubmit} >
          Enter your Classic Warcraft Logs ID: <input type="text" value={reportId} onChange={this.handleChange} /> <input type="submit" value="Go" />
          </form>
        </div>

        {reportId !== '' && <HealerReport reportId={reportId} />}
      </>
    );
  }
}

export default App;
