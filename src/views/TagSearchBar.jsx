import React, { Component } from "react";

//TODO: CHANGE TO  STATELESS FUNCTIONAL COMPONENT
class TagSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "100"
    };
    this.textSearch = this.textSearch.bind(this);
  }
  textSearch() {
    var searchParam = $("#weightCount").val();
    console.log(searchParam);
    this.setState({
      searchText: searchParam
    });
    this.props.handleSearch(searchParam);
  }

  render() {
    return (
      <div className="row">
        <input
          type="text"
          name="searchValue"
          id="weightCount"
          defaultValue={this.state.searchText}
        />
        <button onClick={this.textSearch}>Count</button>
      </div>
    );
  }
}

export default TagSearchBar;
