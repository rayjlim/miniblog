import React, { Component } from "react";
import moment from "moment";

class OneDayView extends Component {
  componentDidUpdate(prevProps, prevState) {
    console.log("did update");
    let that = this;
    $("#formDpInput").val(moment(that.props.date).format("MM/DD/YYYY"));

    setTimeout(
      ()=>{
    $(".datetimepickerOneDay")
      .datetimepicker({
        format: "MM/DD/YYYY",
        defaultDate: moment(that.props.date),
        showTodayButton: true
      })
      .on("dp.change", e => {
        console.log("dp change");
        console.log(e);
        that.props.handleDatePicker(e.date);
      });
    }, 2000);

  }

  render() {
    return (
      <div className="text-center">
        <button
          onClick={this.props.handleButtonDirection }
          className="btn btn-info btn-lrg"
          value="-1"
        >&lt;&lt;-Prev</button>
        <button
          onClick={this.props.handleButtonDirection }
          className="btn btn-success btn-lrg"
          value="1"
        >Next-&gt;&gt;</button>
        <div className="input-group date datetimepickerOneDay">
          <input type="text" className="form-control" id="formDpInput" />
          <span className="input-group-addon">
            <span className="glyphicon glyphicon-calendar" />
          </span>
        </div>
      </div>
    );
  }
}

export default OneDayView;
