import React, { Component } from "react";

class WeightEntryForm extends React.Component {
  render() {
    console.log("weightentryform");
    return (
      <div>
        <div className="form-group row well">
          <div className="col-xs-3 text-center">
            <button
              id="decreasePointTwo"
              className="btn btn-info btn-lg"
              onClick={this.props.btnChange}
              value="-.2"
            >
              .2
            </button>
          </div>
          <div className="col-xs-3 text-center">
            <button
              id="decreaseOne"
              className="btn btn-primary btn-lg"
              onClick={this.props.btnChange}
              value="-1"
            >
              1-
            </button>
          </div>
          <div className="col-xs-3 text-center">
            <button
              id="increaseOne"
              className="btn btn-primary btn-lg"
              onClick={this.props.btnChange}
              value="1"
            >
              +1
            </button>
          </div>
          <div className="col-xs-3 text-center">
            <button
              id="increasePointTwo"
              className="btn btn-info btn-lg"
              onClick={this.props.btnChange}
              value=".2"
            >
              .2
            </button>
          </div>
          <div className="col-xs-12 ">&nbsp;</div>

          <label htmlFor="weightInput" className="col-xs-3 col-form-label">
            Weight
          </label>
          <div className="col-xs-9">
            <input
              type="text"
              className="form-control"
              id="weightInput"
              placeholder="Enter weight"
              value={this.props.weight}
              onChange={this.props.manualChange}
            />
          </div>
          <label htmlFor="comment" className="col-xs-3 col-form-label">
            Comment
          </label>
          <div className="col-xs-9">
            <input
              type="text"
              className="form-control"
              id="comment"
              placeholder="comment"
              value={this.props.comment}
              onChange={this.props.changeComment}
            />
          </div>
        </div>
        <div className="row">
          <input
            type="submit"
            className="btn btn-success col-xs-5"
            value="Weight"
            name="submit"
            onClick={this.props.save}
          />
          <div className="col-xs-2" />
          <input
            type="submit"
            className="btn btn-danger col-xs-5"
            value="Comment Only"
            name="submit"
            onClick={this.props.saveComment}
          />
        </div>
      </div>
    );
  }
}

export default WeightEntryForm;
