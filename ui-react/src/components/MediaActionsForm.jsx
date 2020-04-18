/* eslint-disable no-unused-vars */
import React, { Component } from 'react';

class MediaActionsForm extends Component {
    render() {
        return (
            <div>
                <div className="well">
                    <label htmlFor="newFileName">Rename Image:</label>
                    <input
                        type="text"
                        ref="newFileName"
                        onChange={(event) => {
                            event.preventDefault();
                            console.log(event);
                        }}
                        size="50"
                        placeholder="Filename..."
                        className="form-control"
                        value={this.props.fileName}
                    />

                    <button onClick={this.save} className="btn btn-info">
                        Change Name
                    </button>
                </div>
                <button onClick={this.props.rotateLeft} className="btn btn-default">
                    Rotate left
                </button>
                <button onClick={this.props.rotateRight} className="btn btn-default">
                    Rotate right
                </button>
                <button onClick={this.props.resize} className="btn btn-default">
                    Resize
                </button>
            </div>
        );
    }

    save(e) {
        this.props.rename(this.refs.newFileName.value.trim());
    }
}

export default MediaActionsForm;
