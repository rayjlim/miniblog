import React, { Component } from "react";
import FullCalendarConfig from "../FullCalendarConfig";
import EntryDialog from "./EntryDialog.jsx";

class FullCalendar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log("FC: componentDidMount");
    const { calendar } = this.refs;
    $(calendar).fullCalendar(FullCalendarConfig());
  }
  componentWillUnmount() {
    console.log("fc: destroy");
    $("#calendar").fullCalendar("destroy");
  }

  render() {
    console.log("FC: render");
    return (
      <div>
        <div ref="calendar" id="calendar" />
        <EntryDialog />
      </div>
    );
  }
}

export default FullCalendar;
