import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import UploadActionsForm from "../views/UploadActionsForm.jsx";
import AddForm from "../views/AddForm.jsx";

import store from "../reducers/store";
import * as types from "../actions/action-types";
import EntryApi from "../api/EntryApi";

class UploadViewerController extends Component {
  componentDidMount() {
    console.log("UVC: componentDidMount" + this.props.location.search);
    let urlParams = new URLSearchParams(window.location.search);
    let fileName = urlParams.get('fileName');
    let filePath = urlParams.get('filePath');
    console.log(urlParams);

    store.dispatch({
      type: types.UPDATE_FILEVIEW,
      fileName: query.fileName,
      filePath: query.filePath
    });
    this.handleAdd = this.handleAdd.bind(this);
    this.rotateLeft = this.rotateLeft.bind(this);
    this.rotateRight = this.rotateRight.bind(this);
    this.resize = this.resize.bind(this);
    this.rename = this.rename.bind(this);
  }

  handleAdd ( entry ) {
    let fileReference = this.props.filePath + this.props.fileName;
    let prepend = `![](../uploads/${fileReference})`;
    EntryApi.createEntry(prepend + entry.content, entry.date);
  }

  rotateLeft ( e) {
    console.log("left");
    EntryApi.rotateImgLeft(this.props.fileName, this.props.filePath);
  }
  rotateRight  (e ) {
    console.log("right");
    EntryApi.rotateImgRight(this.props.fileName, this.props.filePath);
  }
  resize  (e ) {
    console.log("resize");
    EntryApi.resizeImg(this.props.fileName, this.props.filePath);
  }
  rename  (newName ) {
    console.log("rename");
    console.log(newName);

    let oldName = this.props.fileName;
    console.log(oldName);
    let splitVal = oldName.split(".");

    newName = splitVal[0] + ".jpg";
    console.log(newName);
    EntryApi.renameImg(this.props.fileName, this.props.filePath, newName);
  }

  render() {
    console.log("UVC: render.4"+this.props.fileName);

    let imgUrl =
      `../uploads/${this.props.filePath}${this.props.fileName}?` +
      this.props.random;
    return (
      <div>
        <p className="lead">Prepare the image for use</p>
        <UploadActionsForm
          fileName={this.props.fileName}
          rotateLeft={this.rotateLeft}
          rotateRight={this.rotateRight}
          resize={this.resize}
          rename={this.rename}
        />
        <hr />
        <img src={imgUrl} />
        <hr />
        <h5>Image is automatically prepended on submit</h5>
        <AddForm
          date={this.props.date}
          submit={this.handleAdd}
          clear={this.clearForm}
        />
        <br />
        <br />
        <nav className="navbar navbar-default navbar-fixed-bottom">
          <div className="container">
            <Link to="/text" className="btn btn-default navbar-btn">
              Blog Page
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}
const mapStateToProps = function(store) {
  let state = store.postState;
  return {
    date: state.date,
    fileName: state.fileName,
    filePath: state.filePath,
    random: state.random
  };
};
export default connect(mapStateToProps)(UploadViewerController);
