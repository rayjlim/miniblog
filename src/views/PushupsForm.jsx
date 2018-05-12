import React, { Component } from "react";

class PushupsForm extends React.Component {
  render() {
    console.log("PushupsForm");
    return (
      <div>
        <div className="row">&nbsp;</div>
        <div className="form-group row well">
          <div className="col-xs-6 text-center">
            <button
              id="decreaseFive"
              className="btn btn-primary btn-lg"
              onClick={this.props.btnChange}
              value="-5"
            >
              -5
            </button>
          </div>
          <div className="col-xs-6 text-center">
            <button
              id="increaseFive"
              className="btn btn-primary btn-lg"
              onClick={this.props.btnChange}
              value="5"
            >
              +5
            </button>
          </div>
          <div className="col-xs-12">&nbsp;</div>

          <label htmlFor="pushupsInput" className="col-xs-3 col-form-label">
            Pullups
          </label>
          <div className="col-xs-9">
            <input
              type="text"
              className="form-control"
              id="pushupsInput"
              placeholder="Enter count"
              value={this.props.count}
              onChange={this.props.manualChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-1">&nbsp;</div>
          <input
            type="submit"
            className="btn btn-success col-xs-10"
            value="Pushups"
            name="submit"
            onClick={this.props.save}
          />
        </div>
      </div>
    );
  }
}

export default PushupsForm;
