import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";

import OneDayView from "../views/OneDayView.jsx";
import EntryList from "../views/EntryList.jsx";
import AddForm from "../views/AddForm.jsx";
import EditForm from "../views/EditForm.jsx";

import store from "../reducers/store";
import * as types from "../actions/action-types";
import EntryApi from "../api/EntryApi";

class OneDayBox extends Component {
  componentDidMount() {
    console.log("ODB: componentDidMount");

    let loc = window.location + ``;

    let param = loc.substring(loc.indexOf('?'));
    console.log(param);
    let urlParams = new URLSearchParams(param);

    console.log('urlParams.has: ' + urlParams.has('date'));
    const date = urlParams.has('date') ? urlParams.get('date') : moment().format('YYYY-MM-DD');
    console.log('passed date: ' + date);

    this.loadDay(date);
    this.handleButtonDirection = this.handleButtonDirection.bind(this);
    this.handleDatePicker = this.handleDatePicker.bind(this);
    store.dispatch({
      type: types.CHANGE_DATE,
      date: date
    });
  }

  loadDay(targetDate = this.props.date) {
    console.log("odb: loadDay " + targetDate);
    EntryApi.getEntrys("date", targetDate);
  };

  // TODO: convert to redux reducer
  handleButtonDirection(e) {
    console.log("event" + e.target);

    console.log("hbd." + e.target.value);

    let date = moment(this.props.date, "YYYY-MM-DD");
    let updateDate = date.add(e.target.value, "days").format("YYYY-MM-DD");
    store.dispatch({
      type: types.CHANGE_DATE,
      date: updateDate
    });
    this.loadDay(updateDate);
  };

  handleDatePicker(date) {
    console.log("handleDatePicker." + date);

    let updateDate = date.format("YYYY-MM-DD");
    store.dispatch({
      type: types.CHANGE_DATE,
      date: updateDate
    });
    this.loadDay(updateDate);
  }

  editEntry(entry) {
    console.log(entry);
    store.dispatch({
      type: types.GET_EDIT_POST,
      entry
    });
  }

  handleAdd(entry) {
    EntryApi.createEntry(entry.content, entry.date);
  }

  handleUpdate(entry) {
    EntryApi.updateEntry(entry);
  }

  clearForm(e) {
    EntryApi.clearForm();
  }

  delete(e) {
    EntryApi.deleteEntry(e.target.id);
  }

  render() {
    console.log("ODB: render props" + this.props.date);
    let entryForm = (
      <div className="text-center">
        <button onClick={e => EntryApi.showForm()} className="btn btn-default">
          Show Add Form
        </button>
      </div>
    );
    if (this.props.showAddEditForm) {
      entryForm = (
        <AddForm
          date={this.props.date}
          submit={this.handleAdd}
          clear={this.clearForm}
        />
      );
      if (this.props.currentEntry != null) {
        entryForm = (
          <EditForm
            entry={this.props.currentEntry}
            submit={this.handleUpdate}
            clear={this.clearForm}
            delete={this.delete}
          />
        );
      }
    }
    return (
      <div>
        <OneDayView
          date={this.props.date}
          handleButtonDirection={this.handleButtonDirection}
          handleDatePicker={this.handleDatePicker}
        />
        {entryForm}
        <hr />
        <EntryList entrys={this.props.entrys} editLink={this.editEntry} />
      </div>
    );
  }
}

const mapStateToProps = function (store) {
  let state = store.postState;
  return {
    entrys: state.posts,
    currentEntry: state.currentEntry,
    date: state.date,
    showAddEditForm: state.showAddEditForm
  };
};

export default connect(mapStateToProps)(OneDayBox);
