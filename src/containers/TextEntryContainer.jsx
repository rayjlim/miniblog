import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import EntryList from "../views/EntryList.jsx";
import EntrySearchBar from "../views/EntrySearchBar.jsx";
import YearMonthList from "./YearMonthList.jsx";

import EntryApi from "../api/EntryApi";

const leftStyle = {
  width: '200px'
};
const rightStyle = {
  flex: '1'
};
const flexStyle = {
  display: 'flex'
};

class TextEntryContainer extends Component {

  constructor(props) {
    console.log('TextEntryContainer');
    super(props);
    var current = moment();

    this.state = {
      searchText: "",
      sameDayInput: current.format("YYYY-MM-DD")
    };
    this.search = this.search.bind(this);
    this.handleSameDayChange = this.handleSameDayChange.bind(this);
    this.searchSameDay = this.searchSameDay.bind(this);
  }

  componentDidMount() {

    let loc = window.location + ``;

    let param = loc.substring(loc.indexOf('?'));
    console.log(param);
    let urlParams = new URLSearchParams(param);

    console.log('urlParams.has: ' + urlParams.has('yearmonth'));
    let yearmonth = urlParams.get('yearmonth');
    console.log('passed yearmonth: ' + yearmonth);

    // this.loadDay(date);

    console.log("TEC: componentDidMount");
    this.searchCall(this.state.searchText);
  }

  componentWillUpdate() {

    let loc = window.location + ``;

    let param = loc.substring(loc.indexOf('?'));
    console.log(param);
    let urlParams = new URLSearchParams(param);

    console.log('62.urlParams.has: ' + urlParams.has('yearmonth'));
    let yearmonth = urlParams.get('yearmonth');
    console.log('62.passed yearmonth: ' + yearmonth);

    // this.loadDay(date);

    console.log("TEC: componentWillUpdate");

  }

  search(event) {

    let text = event.target.value;
    console.log("TEC: search" + text);
    this.setState({ searchText: text });
    // debounce the search
    var timer;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      // console.log("timeout");

      this.searchCall(text);
    }, 300);
  }

  searchCall(searchParam) {
    EntryApi.getEntrys("searchParam", searchParam);
  }

  handleSameDayChange(event) {
    this.setState({ sameDayInput: event.target.value });
  }

  searchSameDay() {
    EntryApi.sameDayEntrys(this.state.sameDayInput);
  }

  searchYearMonth(text) {
    console.log("YM: yearmonth" + text);
    EntryApi.getEntrys("month", text);
  }

  render() {
    console.log("TEC: render.1");
    return (
      <div>
        <EntrySearchBar
          handleSearch={this.search}
          searchInput={this.state.searchText}
          handleSameDay={this.searchSameDay}
          handleSameDayChange={this.handleSameDayChange}
          sameDayInput={this.state.sameDayInput}
        />
        <div style={flexStyle}>
          <div style={leftStyle}>
            <YearMonthList 
              choose={this.searchYearMonth}
            />
          </div>
          <div style={rightStyle}>
            <EntryList entrys={this.props.entrys} handleDelete={this.deleteEntry} />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = function (store) {
  return {
    entrys: store.postState.posts
  };
};
export default connect(mapStateToProps)(TextEntryContainer);
