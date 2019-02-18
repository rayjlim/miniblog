import React from "react";

class AddForm extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.handleTemplate = this.handleTemplate.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }
  render() {
    var templateStyle = {
      float: 'right'
    };
    return (
      <div className="well">
        <button onClick={this.handleTemplate} className="btn btn-primary" style={templateStyle}>
          Template
        </button>
        <strong>Add Entry</strong>
        <p>link: [link text](URL) <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links">Cheatsheet</a></p>

        <div className="form-group">
          <textarea
            ref="content"
            className="form-control"
            placeholder="Add ..."
            rows="6"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            ref="date"
            className="form-control"
            placeholder="Add date..."
            defaultValue={this.props.date}
          />
        </div>
        <button onClick={this.handleAdd} className="btn btn-primary">
          Submit
        </button>
        <button
          onClick={this.props.clear}
          className="btn btn-warning pull-right"
        >
          Cancel
        </button>
      </div>
    );
  }

  handleAdd(e) {
    const entry = {
      content: this.refs.content.value.trim(),
      date: this.refs.date.value.trim()
    };
    this.props.submit(entry);
  };
  handleTemplate(e) {
    this.refs.content.value += `
### Tomorrow

### Obstacles
    `;
  };
}

export default AddForm;
