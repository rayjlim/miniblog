import React, { Component } from "react";
import axios from "axios";

class YearMonthList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        entrys: []
      };
  }

  componentDidMount() {
    console.log("GC: componentDidMount");
    this.dataFetch();
  }

  dataFetch(param = "") {
    var _this = this;
    console.log("dataFetch");
    axios
      .get(`${BASE_URL}/api/yearMonth`)
      .then(function(response) {
        console.table(response.data);
        
        _this.setState({
          entrys: response.data.data
        });
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  render() {
    console.log("GC: render");
    
    const listItems =this.state.entrys.map(entry => {
                let oneDayLink = `main#/text?yearmonth=` + entry;
		return (
			<li key={entry}>
            <a href={ oneDayLink } onClick={e => this.props.choose(entry)}>{entry}</a>
			</li>
		);
	});

    return (
      <div>
        <h2>Year Months</h2>
        {listItems}
      </div>
    );
  }
}

export default YearMonthList;
