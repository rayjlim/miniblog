import { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-date-picker';
import MarkdownDisplay from './MarkdownDisplay';

import useEditForm from '../hooks/useEditForm';
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

  const { handleDelete,
    textareaInput,
    textChange,
    content,
    handleSave,
    setDate,
    date } = useEditForm(entry, onSuccess);
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
          data-testid="deleteBtn"
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
          id="saveBtn"
          type="button"
          title="alt + s"
        >
          <i className="fa fa-save" />
          {' '}
          Save
        </button>
        <DatePicker onChange={dateParam => setDate(dateParam as Date)} value={date} />
        <button
          onClick={() => onSuccess('')}
          className="btn btn-warning pull-right"
          data-testid="cancelBtn"
          id="cancelBtn"
          type="button"
          title="ESC"
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
