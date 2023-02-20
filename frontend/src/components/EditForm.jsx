import React, { useState, useRef, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import DatePicker from 'react-date-picker';
import { format, parse } from 'date-fns';
import MarkdownDisplay from './MarkdownDisplay';
import constants from '../constants';

const EditForm = ({ entry, onSuccess }) => {
  const [date, setDate] = useState(
    parse(entry.date, constants.FULL_DATE_FORMAT, new Date()),
  );
  const escapedContent = entry.content.replace(
    /<br\s*\/>/g,
    `
`,
  );
  const [content, setContent] = useState(escapedContent);
  const textareaInput = useRef();

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" ></i> ';
    console.log('textarea.value :>> ', textareaInput.current.value);
    textareaInput.current.value = textareaInput.current.value.replace(pattern, replacement);

    setContent(textareaInput.current.value);
  }

  /**
  * It takes the content and date from the form, and sends a PUT
  * request to the server with the updated
  * entry
  */
  // TODO: convert to customHook
  async function handleSave() {
    console.log('handleSave entry :', content, date);
    try {
      const token = window.localStorage.getItem(constants.STORAGE_KEY);
      const response = await fetch(
        `${constants.REST_ENDPOINT}/api/posts/${entry.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            content,
            date: format(date, constants.FULL_DATE_FORMAT),
          }),
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
      onSuccess('Edit Done');
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  // TODO: convert to customHook
  async function handleDelete() {
    const go = window.confirm('You sure?');
    if (!go) {
      return;
    }
    const { id } = entry;
    console.log(`handleDelete ${id}`);
    try {
      const token = window.localStorage.getItem(constants.STORAGE_KEY);
      const response = await fetch(
        `${constants.REST_ENDPOINT}/api/posts/${id}`,
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
      onSuccess('Delete Done');
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  function dateChange(value = new Date()) {
    console.log('value :', value);
    if (value) {
      setDate(value);
    }
  }

  function checkKeyPressed(e) {
    console.log(`EditForm: handle key presss ${e.key}`);
    // console.log('131:' + markdown + ', hasChanges ' + hasChanges);
    if (e.altKey && e.key === 's') {
      console.log('S keybinding');
      // Note: this is a hack because the content value is taken from the init value
      document.getElementById('saveBtn').click();
    } else if (e.key === 'Escape') {
      document.getElementById('cancelBtn').click();
    }
  }
  /* A hook that is called when the component is mounted. */
  useEffect(() => {
    console.log('EditForm: useEffect');

    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, [entry]);

  return (
    <div className="well">
      {/* <button onClick={this.addFAtag} className="btn btn-info" style={templateStyle}>
                    fa-template
                </button> */}
      <h2>Edit Entry</h2>

      <div style={{ display: 'flex', flexDirection: 'row', padding: '0 1rem' }}>
        <div>
          <p style={{ lineHeight: '1em', fontSize: '.8rem', margin: '0' }}>use `@@fa-tag@@` for quick font-awesome icon</p>
          <p style={{ lineHeight: '1em', fontSize: '.8rem', margin: '0' }}>link: [link text](URL)</p>
          <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links" target="_new">
            Cheatsheet
          </a>
          {', '}
          <a href="https://fontawesome.com/icons" target="_new">
            Font Awesome
          </a>
        </div>
        <div style={{ marginLeft: 'auto' }}>
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
      </div>
      <div className="form-group">
        <textarea
          ref={textareaInput}
          onChange={() => textChange()}
          className="form-control"
          placeholder="Add ..."
          rows="8"
          defaultValue={content}
        />
      </div>
      <div className="editBtns">
        <button
          onClick={() => handleSave()}
          className="btn btn-primary"
          id="saveBtn"
          type="button"
        >
          <i className="fa fa-save" />
          {' '}
          Save
        </button>
        <DatePicker onChange={dateParam => dateChange(dateParam)} value={date} />
        <button
          onClick={() => onSuccess('')}
          className="btn btn-warning pull-right"
          id="cancelBtn"
          type="button"
        >
          <i className="fa fa-ban" />
          {' '}
          Cancel
        </button>
      </div>
      <div className="markdownDisplay preview dashBorder">
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
