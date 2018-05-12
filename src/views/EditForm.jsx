import React from "react";
import moment from "moment";

class EditForm extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element

    this.save = this.save.bind(this);
    this.subToDate = this.subToDate.bind(this);
    this.addToDate = this.addToDate.bind(this);
  }
  render() {
    return (
      <div className="well">
        <h3>Edit Entry</h3>
        <div className="form-group">
          <textarea
            ref="content"
            onChange={event => event.preventDefault()}
            className="form-control"
            placeholder="Add ..."
            rows="8"
          >
            {this.props.entry.content}
          </textarea>
        </div>
        <div className="form-group">
          <input
            type="text"
            ref="date"
            onChange={event => event.preventDefault()}
            className="form-control"
            placeholder="Edit Date..."
            value={this.props.entry.date}
          />
        </div>
        <button onClick={this.subToDate} className="btn btn-info">
          subToDate
        </button>        
        <button onClick={this.addToDate} className="btn btn-success">
          addToDate
        </button>

        <button onClick={this.save} className="btn btn-primary">
          Save
        </button>

        <button
          onClick={this.props.clear}
          className="btn btn-warning pull-right"
        >
          Cancel
        </button>
        <button
          onClick={this.props.delete}
          className="btn btn-danger pull-right"
          id={this.props.entry.id}
        >
          Delete
        </button>
      </div>
    );
  }

  save ( e ) {
    const entry = {
      id: this.props.entry.id,
      content: this.refs.content.value.trim(),
      date: this.refs.date.value.trim()
    };
    this.props.submit(entry);
  }

  subToDate ( e ) {
    this.refs.date.value = moment(this.refs.date.value.trim()).subtract(1,'days').format('YYYY-MM-DD');
  }
  
  addToDate ( e ) {
    this.refs.date.value = moment(this.refs.date.value.trim()).add(1,'days').format('YYYY-MM-DD');
  }
}

export default EditForm;

