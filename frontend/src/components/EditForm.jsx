import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import DatePicker from 'react-date-picker';
import { format, parse } from 'date-fns';
import MarkdownDisplay from './MarkdownDisplay';
import constants from '../constants';

const EditForm = ({ entry, onSuccess }) => {
  const FULL_DATE_FORMAT = 'yyyy-MM-dd';

  const [date, setDate] = useState(
    parse(entry.date, FULL_DATE_FORMAT, new Date()),
  );
  const escapedContent = entry.content.replace(
    /<br\s*\/>/g,
    `
`,
  );
  const [content, setContent] = useState(escapedContent);
  let textareaInput = null;

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" /> ';
    console.log('textarea.value :>> ', textareaInput.value);
    textareaInput.value = textareaInput.value.replace(pattern, replacement);

    setContent(textareaInput.value);
  }

  /**
  * It takes the content and date from the form, and sends a PUT
  * request to the server with the updated
  * entry
  */
  async function handleSave() {
    const formEntry = {
      content,
      date: format(date, FULL_DATE_FORMAT),
    };
    console.log('handleSave entry :', formEntry);
    try {
      const token = window.localStorage.getItem('appToken');
      const response = await fetch(
        `${constants.REST_ENDPOINT}/api/posts/${entry.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(formEntry),
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Token': token,
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
        },
      );

      console.log(response);
      onSuccess();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  function handleClear() {
    onSuccess();
  }

  async function handleDelete() {
    const go = window.confirm('You sure?');
    if (!go) {
      return;
    }
    console.log(`handleDelete ${entry.id}`);
    try {
      const token = window.localStorage.getItem('appToken');
      const response = await fetch(
        `${constants.REST_ENDPOINT}/api/posts/${entry.id}`,
        {
          method: 'DELETE',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Token': token,
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
        },
      );

      console.log(response);
      onSuccess();
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  function dateChange(value = new Date()) {
    console.log('value :', value);
    setDate(value);
  }

  function setRef(elem) {
    textareaInput = elem;
  }

  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    console.log('EditForm: useEffect');

    document.addEventListener('keydown', e => {
      console.log(`EditForm: handle key presss ${e.key}`);
      // console.log('131:' + markdown + ', hasChanges ' + hasChanges);
      if (e.altKey && e.key === 's') {
        console.log('S keybinding');
        // Note: this is a hack because the content value is taken from the init value
        document.getElementById('saveBtn').click();
      } else if (e.key === 'Escape') {
        document.getElementById('cancelBtn').click();
      }
    });
  }, [entry]);

  return (
    <div className="well">
      {/* <button onClick={this.addFAtag} className="btn btn-info" style={templateStyle}>
                    fa-template
                </button> */}
      <h2>Edit Entry</h2>
      <span>use `@@fa-tag@@` for quick font-awesome icon</span>
      <p>
        link: [link text](URL)
        <span> </span>
        <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links">
          Cheatsheet
        </a>
      </p>

      <div className="form-group">
        <textarea
          ref={elem => setRef(elem)}
          onChange={event => textChange(event.target.value)}
          className="form-control"
          placeholder="Add ..."
          rows="8"
          defaultValue={content}
        />
      </div>
      <div className="form-group">
        <DatePicker onChange={() => dateChange()} value={date} />
      </div>

      <div className="editBtns">
        <button
          onClick={handleSave}
          className="btn btn-primary"
          id="saveBtn"
          type="button"
        >
          <i className="fa fa-save" />
          {' '}
          Save
        </button>
        <button
          onClick={handleClear}
          className="btn btn-warning pull-right"
          id="cancelBtn"
          type="button"
        >
          <i className="fa fa-ban" />
          {' '}
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-danger pull-right"
          type="button"
        >
          <i className="fa fa-trash" />
          {' '}
          Delete
        </button>
      </div>
      <div className="markdownDisplay">
        <MarkdownDisplay source={content} />
      </div>
    </div>
  );
};

export default EditForm;

EditForm.propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
};
