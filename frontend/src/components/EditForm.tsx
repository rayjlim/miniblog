import { useState, useRef, useEffect, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-date-picker';
import { format, parse } from 'date-fns';
import MarkdownDisplay from './MarkdownDisplay';
import { FULL_DATE_FORMAT, REST_ENDPOINT, STORAGE_KEY, AUTH_HEADER } from '../constants';
import 'react-date-picker/dist/DatePicker.css';

import './EditForm.css';

const propTypes = {
  entry: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
  onSuccess: PropTypes.func.isRequired,
};

type EditFormProps = PropTypes.InferProps<typeof propTypes>;

const EditForm: FunctionComponent<EditFormProps> = ({ entry, onSuccess }) => {
  const escapedContent = entry.content.replace(
    /<br\s*\/>/g,
    `
`,
  );
  const [content, setContent] = useState<string>(escapedContent);
  const [date, setDate] = useState<Date>(
    parse(entry.date, FULL_DATE_FORMAT, new Date()),
  );
  const textareaInput = useRef<HTMLTextAreaElement>(null);

  function textChange() {
    const pattern = /@@([\w-]*)@@/g;
    const replacement = '<i class="fa fa-$1" ></i> ';
    const refTextarea = textareaInput.current || {value: ''};
    console.log('textarea.value :>> ', refTextarea.value);
    refTextarea.value = refTextarea.value.replace(pattern, replacement);

    setContent(refTextarea.value);
  }

  /**
   * The function `handleSave` is an asynchronous function that sends a PUT request
   * to update a post with the provided content and date, and logs the response or
   * displays an error message.
   */
  async function handleSave() {
    console.log('handleSave entry :', content, date);

    try {
      const token = window.localStorage.getItem(STORAGE_KEY)|| '';
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set('Content-Type', 'application/json');
      requestHeaders.set(AUTH_HEADER, token);
      const response = await fetch(
        `${REST_ENDPOINT}/api/posts/${entry.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            content,
            date: format(date, FULL_DATE_FORMAT),
          }),
          mode: 'cors',
          cache: 'no-cache',
          headers: requestHeaders,
          redirect: 'follow',
        },
      );

      console.log(response);

      onSuccess('Edit Done');
    } catch (error) {
      console.log(error);
      alert(error);
      onSuccess('Edit fail' + error);
    }

  }

  /**
   * The above function handles the deletion of a post by sending a DELETE request to
   * the server and displaying a success message or an error message.
   * @returns The function `handleDelete` returns nothing (`undefined`).
   */
  async function handleDelete() {
    const go = window.confirm('You sure?');
    if (!go) {
      return;
    }
    const { id } = entry;
    console.log(`handleDelete ${id}`);
    try {
      const token = window.localStorage.getItem(STORAGE_KEY) || '';
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set('Content-Type', 'application/json');
      requestHeaders.set(AUTH_HEADER, token);
      const response = await fetch(
        `${REST_ENDPOINT}/api/posts/${id}`,
        {
          method: 'DELETE',
          mode: 'cors',
          headers: requestHeaders
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

  function checkKeyPressed(e: any) {
    console.log(`EditForm: handle key presss ${e.key}`);
    if (e.altKey && e.key === 's') {
      console.log('S keybinding');
      // Note: this is a hack because the content value is taken from the init value
      document.getElementById('saveBtn')?.click();
    } else if (e.key === 'Escape') {
      document.getElementById('cancelBtn')?.click();
    }
  }

  useEffect(() => {
    console.log('EditForm: useEffect');

    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, [entry]);

  return (
    <div className="well">
      <h2>Edit Entry</h2>
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
        <button
          onClick={handleDelete}
          className="btn btn-danger pull-right delete-btn"
          type="button"
        >
          <i className="fa fa-trash" />
          {' '}
          Delete
        </button>
      </div>
      <div className="form-group">
        <textarea
          ref={textareaInput}
          onChange={() => textChange()}
          className="form-control"
          placeholder="Add ..."
          rows={8}
          defaultValue={content}
        />
      </div>
      <div className="editBtns">
        <button
          onClick={() => handleSave()}
          className="btn btn-primary"
          data-testid="saveBtn"
          type="button"
        >
          <i className="fa fa-save" />
          {' '}
          Save
        </button>
        <DatePicker onChange={dateParam => dateChange(dateParam as Date)} value={date} />
        <button
          onClick={() => onSuccess('cancel')}
          className="btn btn-warning pull-right"
          data-testid="cancelBtn"
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

EditForm.propTypes = propTypes;
