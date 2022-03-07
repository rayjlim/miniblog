import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import constants from '../constants';
import MarkdownDisplay from './MarkdownDisplay';
import DatePicker from 'react-date-picker';
import { format, parse } from 'date-fns';
const EditForm = props => {
  let escapedContent = props.entry.content.replace(
    /<br\s*\/>/g,
    `
`
  );
  const FULL_DATE_FORMAT = 'yyyy-MM-dd';

  const [date, setDate] = useState(
    parse(props.entry.date, FULL_DATE_FORMAT, new Date())
  );
  const [content, setContent] = useState(escapedContent);

  let textareaInput = null;

  // useEffect(() => {

  // }, []);

  function textChange(text) {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" /> ';
    console.log('textarea.value :>> ', textareaInput.value);
    textareaInput.value = textareaInput.value.replace(pattern, replacement);

    setContent(textareaInput.value);
  }

  async function handleSave() {
    const entry = {
      content,
      date: format(date, FULL_DATE_FORMAT), // TODO: check date format
    };
    console.log('handleSave entry :', entry);
    try {
      const token = window.localStorage.getItem('appToken');
      const response = await fetch(
        `${constants.REST_ENDPOINT}/api/posts/${props.entry.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(entry),
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'x-app-token': token,
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
        }
      );

      console.log(response);
      props.onSuccess();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }
  function handleClear() {
    props.onSuccess();
  }

  async function handleDelete() {
    let go = window.confirm('You sure?');
    if (!go) {
      return;
    }
    console.log('handleDelete ' + props.entry.id);
    try {
      const token = window.localStorage.getItem('appToken');
      const response = await fetch(
        `${constants.REST_ENDPOINT}/api/posts/${props.entry.id}`,
        {
          method: 'DELETE',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'x-app-token': token,
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
        }
      );

      console.log(response);
      props.onSuccess();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  function dateChange(value) {
    console.log('value :', value);
    if (value === null) {
      value = new Date();
    }
    setDate(value);
  }
  console.log(date);

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
        <DatePicker onChange={dateChange} value={date} />
      </div>

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
