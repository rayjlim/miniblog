import React, { Component } from "react";
import { connect } from "react-redux";
import store from "../reducers/store";
import * as types from "../actions/action-types";
import EntryApi from "../api/EntryApi";

import WeightEntryForm from "../views/WeightEntryForm.jsx";
import PushupsForm from "../views/PushupsForm.jsx";

const STORAGE_WEIGHT = "SMSBLOG_weight";
const STORAGE_PUSHUPS = "SMSBLOG_pushups";
const DEFAULT_WEIGHT = 140;
class QuickAddController extends Component {
  componentDidMount() {
    console.log("mwb: componentDidMount");
    var weight =
      localStorage.getItem(STORAGE_WEIGHT) === null
        ? DEFAULT_WEIGHT
        : window.localStorage.getItem(STORAGE_WEIGHT);
    store.dispatch({
      type: types.CHANGE_WEIGHT,
      weight
    });
    var pushups =
      localStorage.getItem(STORAGE_PUSHUPS) === null
        ? 40
        : window.localStorage.getItem(STORAGE_PUSHUPS);
    store.dispatch({
      type: types.CHANGE_PUSHUPS,
      pushups
    });
  }

  changeWeight ( value ) {
    console.log("weight:" + value);
    store.dispatch({
      type: types.CHANGE_WEIGHT,
      weight: value
    });
  }

  btnChangeWeight (e ) {
    console.log(e);
    this.changeWeight(
      (parseFloat(this.props.weight) + parseFloat(e.target.value)).toFixed(1)
    );
  }

  manualChangeWeight ( e ) {
    console.log(e);
    this.changeWeight(e.target.value);
  }

  changeComment ( e ) {
    console.log("value:" + e.target.value);
    store.dispatch({
      type: types.CHANGE_COMMENT,
      comment: e.target.value
    });
  }

  saveWeight (e) {
    e.preventDefault();
    console.log("saveWeight");
    window.localStorage.setItem(STORAGE_WEIGHT, this.props.weight);
    EntryApi.createEntry(this.props.weight + "%20%23w%20" + this.props.comment);
  }

  saveComment ( e ) {
    e.preventDefault();
    console.log("saveComment");
    EntryApi.createEntry(this.props.comment);
  }

  btnChangePushups ( e ) {
    console.log(e);
    store.dispatch({
      type: types.CHANGE_PUSHUPS,
      pushups: parseInt(this.props.pushups) + parseInt(e.target.value)
    });
  }

  manualChangePushups ( e ) {
    console.log(e);
    store.dispatch({
      type: types.CHANGE_PUSHUPS,
      pushups: e.target.value
    });
  }
  savePushups ( e ) {
    e.preventDefault();
    console.log("savePushups");
    window.localStorage.setItem(STORAGE_PUSHUPS, this.props.pushups);
    EntryApi.createEntry("@pups " + this.props.pushups);
  };

  // separate and decompose below into a view component
  render() {
    return (
      <div>
        <WeightEntryForm
          weight={this.props.weight}
          comment={this.props.comment}
          btnChange={this.btnChangeWeight}
          manualChange={this.manualChangeWeight}
          changeComment={this.changeComment}
          save={this.saveWeight}
          saveComment={this.saveComment}
        />
        <PushupsForm
          count={this.props.pushups}
          btnChange={this.btnChangePushups}
          manualChange={this.manualChangePushups}
          save={this.savePushups}
        />
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  let state = store.quickAddState;
  return {
    weight: state.weight,
    comment: state.comment,
    pushups: state.pushups
  };
};
export default connect(mapStateToProps)(QuickAddController);
