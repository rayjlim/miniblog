import React, { Component } from "react";
import { connect } from "react-redux";
import Immutable from "immutable";
import moment from "moment";
import EntryList from "../views/EntryList.jsx";
import EntrySearchBar from "../views/EntrySearchBar.jsx";

import EntryApi from "../api/EntryApi";
import sameDayEntrys from "../api/EntryApi";

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
    console.log("TEC: componentDidMount");
    this.searchCall(this.state.searchText);
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

  searchCall ( searchParam ) {
    EntryApi.getEntrys("searchParam", searchParam);
  }

  handleSameDayChange ( event) {
    this.setState({ sameDayInput: event.target.value });
  }

  searchSameDay  ()  {
    EntryApi.sameDayEntrys(this.state.sameDayInput);
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
        <hr />
        <EntryList entrys={this.props.entrys} handleDelete={this.deleteEntry} />
      </div>
    );
  }
}
const mapStateToProps = function(store) {
  return {
    entrys: store.postState.posts
  };
};
export default connect(mapStateToProps)(TextEntryContainer);

// addEntry() {
//   var map1 = Immutable.List(this.state.entrys);
//   console.log('addEntry was clicked' + map1.size);
//   var newEntry = {
//     id: map1.size + 1,
//     content: "next blog entry",
//     date: "2016-05-16 00:00:00"
//   };

//   map1 = map1.push(newEntry);
//   console.log(map1.toJS());
//   this.setState({
//     entrys: map1.toJS()
//   })
// }

// deleteEntry(entryId) {
//   var map1 = Immutable.List(this.state.entrys);
//   map1 = map1.filter(function(x) {
//     return x.id !== entryId;
//   });
//   this.setState({
//       entrys: map1.toJS()
//     })
//     // userApi.deleteUser(userId).then(() => {
//     //   const newUsers = _.filter(this.state.users, user => user.id != userId);
//     //   this.setState({users: newUsers})
//     // });
// }
