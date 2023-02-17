import React, { useState, useEffect, useRef } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import DatePicker from 'react-date-picker';
import { format, parse } from 'date-fns';
import MarkdownDisplay from './MarkdownDisplay';
import constants from '../constants';

const useFetch = () => {
  const [newId, setId] = useState(null);
  const [formEntry, setFormEntry] = useState(null);
  useEffect(() => {
    if (formEntry !== null) {
      (async () => {
        const token = window.localStorage.getItem(constants.STORAGE_KEY);
        try {
          const response = await fetch(`${constants.REST_ENDPOINT}/api/posts/`, {
            method: 'POST',
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
          });
          const { id } = await response.json();
          console.log('new id :>> ', id);
          setId(id);
        } catch (error) {
          console.log(error);
          alert(error);
        }
      })();
    }
  }, [formEntry]);
  return [newId, setFormEntry];
};

const AddForm = ({ content, date, onSuccess }) => {
  const [formContent, setFormContent] = useState(content || '');
  const [formDate, setFormDate] = useState(
    parse(date, constants.FULL_DATE_FORMAT, new Date()),
  );
  const isMounted = useRef(false);
  const [id, setParams] = useFetch();
  let textareaInput = null;

  function checkKeyPressed(e) {
    console.log(`AddForm: handle key presss ${e.key}`);
    // console.log('131:' + markdown + ', hasChanges ' + hasChanges);
    if (e.altKey && e.key === 's') {
      console.log('S keybinding');
      // Note: this is a hack because the content value is taken from the init value
      document.getElementById('saveBtn').click();
    } else if (e.key === 'Escape') {
      document.getElementById('cancelBtn').click();
    }
  }

  useEffect(() => {
    console.log('AddForm: useEffect');
    if (isMounted.current) {
      // This makes it so this is not called on the first render
      // but when the Id is set
      console.log('handleAdd 92:>> ', id);
      // setFormContent('');
      onSuccess('Add Done');
    } else {
      isMounted.current = true;

      setFormContent(content || '');
      document.addEventListener('keydown', checkKeyPressed);
      return () => window.removeEventListener('keydown', checkKeyPressed);
    }
    return true;
  }, [id]);

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" /> ';
    textareaInput.value = textareaInput.value.replace(pattern, replacement);

    setFormContent(textareaInput.value);
  }

  function dateChange(value = new Date()) {
    console.log('value :', value);
    if (value) {
      setFormDate(value);
    }
  }

  function handleAdd() {
    setParams({
      content: formContent.trim(),
      date: format(formDate, constants.FULL_DATE_FORMAT),
    });
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
        <DatePicker onChange={dateParam => dateChange(dateParam)} value={date} />
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
        onClick={() => onSuccess('')}
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
