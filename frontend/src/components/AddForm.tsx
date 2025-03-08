import { useRef } from 'react';
import MarkdownDisplay from './MarkdownDisplay';
import useAddForm from '../hooks/useAddForm';
import LocationForm from './LocationForm';
import { EntryType } from '../Types';
interface AddFormProps {
  content: string;
  date: string;
  onSuccess: (msg: string, entry: EntryType) => void;
}

const AddForm = ({ content, date, onSuccess }: AddFormProps) => {

  const {
    formRef,
    handleAdd,
    textChange,
    markdownContent,
    isLoading
  } = useAddForm({ onSuccess });

  return (
    <div className="well">
      <h2>Add Entry</h2>
      <div className="entry-bar">
        <div>
          <p className="small">use `@@fa-tag@@` for quick font-awesome icon</p>
          <p className="small">link: [link text](URL)</p>
          <div className="help-links">
            <a className="small" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links" target="_blank" rel="noopener noreferrer">
              Cheatsheet
            </a>
            {', '}
            <a className="small" href="https://fontawesome.com/icons" target="_blank" rel="noopener noreferrer">
              Font Awesome
            </a>
          </div>
        </div>
      </div>
      <form ref={formRef} onSubmit={handleAdd} className="add-form">=
        <div className="form-group">
          <textarea
            id="addFormTextarea"
            name="content"
            rows={6}
            onChange={textChange}
            className="form-control"
            placeholder="Add ..."
            defaultValue={content}
          />
        </div>

        <div className="editBtns d-flex justify-content-between align-items-center">
          <button
            className="btn btn-primary success"
            id="saveBtn"
            type="submit"
            disabled={isLoading}
          >
            <i className="fa fa-save" /> Submit
          </button>

          <input
            type="date"
            name="dateInput"
            defaultValue={date}
            className="form-control mx-2"
            style={{ width: '150px' }}
          />

          <button
            type="submit"
            onClick={() => onSuccess('', { id: -1, content: '', date: '' })}
            className="btn btn-warning attention"
            id="cancelBtn"
          >
            <i className="fa fa-ban" /> Cancel
          </button>
        </div>

        <LocationForm />
      </form>
      <div className="markdownDisplay preview dashBorder">
        <MarkdownDisplay source={markdownContent} />
      </div>
    </div >
  );
};

export default AddForm;
