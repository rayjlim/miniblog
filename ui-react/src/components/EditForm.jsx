import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import constants from '../constants';
import axios from 'axios';
import MarkdownDisplay from './MarkdownDisplay';

const EditForm = props => {
  let escapedContent = props.entry.content.replace(
    /<br\s*\/>/g,
    `
`
  );

  const [date, setDate] = useState(props.entry.date);
  const [content, setContent] = useState(escapedContent);

  let textareaInput = null;

  function textChange(text) {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" /> ';
    console.log('textarea.value :>> ', textareaInput.value);
    textareaInput.value = textareaInput.value.replace(pattern, replacement);

    setContent(textareaInput.value);
  }

  function handleSave() {
    const entry = {
      content,
      date, // TODO: check date format
    };
    console.log('axios entry :', entry);

    axios
      .put(`${constants.REST_ENDPOINT}api/posts/${props.entry.id}`, entry)
      .then(response => {
        console.log(response);
        props.onSuccess();
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });
  }
  function handleClear() {
    props.onSuccess();
  }

  function handleDelete() {
    console.log('handleDelete ' + props.entry.id);
    axios
      .delete(`${constants.REST_ENDPOINT}api/posts/${props.entry.id}`)
      .then(response => {
        console.log(response);
        props.onSuccess();
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });
  }

  return (
    <div className="well">
      {/* <button onClick={this.addFAtag} className="btn btn-info" style={templateStyle}>
                    fa-template
                </button> */}
      <h2>Edit Entry</h2>
      <span>use `@@fa-tag@@` for quick font-awesome icon</span>
      <p>
        link: [link text](URL){' '}
        <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links">
          Cheatsheet
        </a>
      </p>

      <div className="form-group">
        <textarea
          ref={elem => (textareaInput = elem)}
          onChange={event => textChange(event.target.value)}
          className="form-control"
          placeholder="Add ..."
          rows="8"
          defaultValue={escapedContent}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          onChange={event => setDate(event.target.value)}
          className="form-control"
          placeholder="Edit Date..."
          defaultValue={props.entry.date}
        />
      </div>

      {/* <button onClick={this.subToDate} className="btn btn-info">
                    subToDate
                </button>
                <button onClick={this.addToDate} className="btn btn-success">
                    addToDate
                </button> */}
      <div className="editBtns">
        <button onClick={handleSave} className="btn btn-primary">
          <i className="fa fa-save" /> Save
        </button>
        <button onClick={handleClear} className="btn btn-warning pull-right">
          <i className="fa fa-ban" /> Cancel
        </button>
        <button onClick={handleDelete} className="btn btn-danger pull-right">
          <i className="fa fa-trash" /> Delete
        </button>
      </div>
      <div className="markdownDisplay">
        <MarkdownDisplay source={content} />
      </div>
    </div>
  );
};

export default EditForm;
