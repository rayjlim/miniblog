import React, { Component } from "react";

const SameDayInput = props => {
  return (
    <div>
      <div className="col-xs-3">
        <button
          onClick={props.handleSameDay}
          className="btn btn-success btn-lrg"
        >
          Same Day
        </button>
      </div>
      <div className="col-xs-9">
        <input
          type="text"
          name="sameDayValue"
          id="sameDayValue"
          className="form-control"
          value={props.sameDayInput}
          onChange={props.handleSameDayChange}
        />
      </div>
    </div>
  );
};

export default SameDayInput;
