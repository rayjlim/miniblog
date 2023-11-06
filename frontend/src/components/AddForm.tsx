import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-date-picker';
import { format, parse } from 'date-fns';
import MarkdownDisplay from './MarkdownDisplay';
import { FULL_DATE_FORMAT, REST_ENDPOINT, STORAGE_KEY } from '../constants';
import 'react-date-picker/dist/DatePicker.css';

const useFetch = () => {
  const [newId, setId] = useState(null);
  const [formEntry, setFormEntry] = useState(null);
  useEffect(() => {
    if (formEntry !== null) {
      (async () => {
        const token = window.localStorage.getItem(STORAGE_KEY);
        try {
          const response = await fetch(`${REST_ENDPOINT}/api/posts/`, {
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
    parse(date, FULL_DATE_FORMAT, new Date()),
  );
  const isMounted = useRef(false);
  const [id, setParams] = useFetch();
  const textareaInput = useRef();

  function checkKeyPressed(e) {
    console.log(`AddForm: handle key presss ${e.key}`);
    if (e.altKey && e.key === 's') {
      console.log('S keybinding');
      // Note: this is a hack because the content value was taken from the init value
      document.getElementById('saveBtn').click();
    } else if (e.key === 'Escape') {
      document.getElementById('cancelBtn').click();
    }
  }

  useEffect(() => {
    console.log(`AddForm: useEffect ${isMounted.current}`);
    if (isMounted.current && id !== null) {
      // This makes it so this is not called on the first render
      // but when the Id is set
      onSuccess(`Add Done : New Id: ${id}`);
    } else {
      isMounted.current = true;

      setFormContent(content || '');
      document.addEventListener('keydown', checkKeyPressed);
      return () => document.removeEventListener('keydown', checkKeyPressed);
    }
  }, [id, date, content, onSuccess]);

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" /> ';
    textareaInput.current.value = textareaInput.current.value.replace(pattern, replacement);

    setFormContent(textareaInput.current.value);
  }

  function dateChange(value = new Date()) {
    console.log('value :', value);
    if (value) {
      setFormDate(value);
    }
  }

  function handleAdd() {
    console.log('handleAdd');
    setParams({
      content: formContent.trim(),
      date: format(formDate, FULL_DATE_FORMAT),
    });


  }

  return (
    <div className="well">
      {/* <button onClick={this.handleTemplate} className="btn btn-primary" style={templateStyle}>
                    Template
                </button>
                <button onClick={this.addFAtag} className="btn btn-info" style={templateStyle}>
                    fa-template
                </button> */}
      <h2>Add Entry</h2>
      <div className="entry-bar">
        <div>
          <p className="small">use `@@fa-tag@@` for quick font-awesome icon</p>
          <p className="small">link: [link text](URL)</p>
          <a className="small" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links" target="_new">
            Cheatsheet
          </a>
          {', '}
          <a className="small" href="https://fontawesome.com/icons" target="_new">
            Font Awesome
          </a>
        </div>
      </div>

      <div className="form-group">
        <textarea
          ref={textareaInput}
          rows={6}
          onChange={() => textChange()}
          className="form-control"
          placeholder="Add ..."
          defaultValue={content}
        />
      </div>

      <div className="form-group">
        <DatePicker onChange={newDate => dateChange(newDate)} value={formDate} />
      </div>

      <button
        onClick={() => handleAdd()}
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
      <div className="markdownDisplay preview dashBorder">
        <MarkdownDisplay source={formContent} />
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
