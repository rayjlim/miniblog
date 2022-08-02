import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import DatePicker from 'react-date-picker';
import { format, parse } from 'date-fns';
import MarkdownDisplay from './MarkdownDisplay';
import constants from '../constants';

const FULL_DATE_FORMAT = 'yyyy-MM-dd';

const AddForm = ({ content, date, onSuccess }) => {
  const [formContent, setContent] = useState(content || '');
  const [formDate, setDate] = useState(
    parse(date, FULL_DATE_FORMAT, new Date()),
  );
  let textareaInput = null;

  useEffect(() => {
    console.log('AddForm: useEffect');
    setContent(content || '');

    document.addEventListener('keydown', e => {
      console.log(`AddForm: handle key presss ${e.key}`);
      // console.log('131:' + markdown + ', hasChanges ' + hasChanges);
      if (e.altKey && e.key === 's') {
        console.log('S keybinding');
        // Note: this is a hack because the content value is taken from the init value
        document.getElementById('saveBtn').click();
      } else if (e.key === 'Escape') {
        document.getElementById('cancelBtn').click();
      }
    });
  }, []);

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" /> ';
    textareaInput.value = textareaInput.value.replace(pattern, replacement);

    setContent(textareaInput.value);
  }

  function dateChange(value = new Date()) {
    console.log('value :', value);
    setDate(value);
  }

  function handleAdd() {
    (async () => {
      console.log('this :', this);
      const entry = {
        content: formContent.trim(),
        date: format(formDate, FULL_DATE_FORMAT),
      };
      try {
        const token = window.localStorage.getItem(constants.STORAGE_KEY);
        const response = await fetch(`${constants.REST_ENDPOINT}/api/posts/`, {
          method: 'POST',
          body: JSON.stringify(entry),
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Token': token,
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
        });

        setContent('');
        const data = await response.json();
        console.log('new id :>> ', data.id);
        onSuccess();
      } catch (error) {
        console.log(error);
        alert(error);
      }
    })();
  }

  function clear() {
    // console.log('clear form');
    onSuccess();
  }

  function setRef(elem) {
    textareaInput = elem;
  }

  return (
    <div className="well">
      {/* <button onClick={this.handleTemplate} className="btn btn-primary" style={templateStyle}>
                    Template
                </button>
                <button onClick={this.addFAtag} className="btn btn-info" style={templateStyle}>
                    fa-template
                </button> */}
      <strong>Add Entry</strong>
      <p>
        link: [link text](URL)
        <span>_</span>
        <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links">
          Cheatsheet
        </a>
      </p>

      <div className="form-group">
        <textarea
          ref={elem => setRef(elem)}
          rows="6"
          onChange={event => textChange(event.target.value)}
          className="form-control"
          placeholder="Add ..."
          defaultValue={content}
        />
      </div>

      <div className="form-group">
        <DatePicker onChange={() => dateChange()} value={date} />
      </div>

      <button
        onClick={handleAdd}
        className="btn btn-primary"
        id="saveBtn"
        type="button"
      >
        <i className="fa fa-save" />
        Submit
      </button>
      <button
        type="button"
        onClick={clear}
        className="btn btn-warning pull-right"
        id="cancelBtn"
      >
        <i className="fa fa-ban" />
        Cancel
      </button>
      <div className="markdownDisplay">
        <MarkdownDisplay source={content} />
      </div>
    </div>
  );
};

export default AddForm;

AddForm.propTypes = {
  content: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
