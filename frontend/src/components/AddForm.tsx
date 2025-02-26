import MarkdownDisplay from './MarkdownDisplay';
import useAddForm from '../hooks/useAddForm';
import LocationForm from './LocationForm';

interface EntryType {
  id: number;
  content: string;
  date: string;
}

interface AddFormProps {
  content: string;
  date: string;
  onSuccess: (msg: string, entry: EntryType) => void;
}

const AddForm = ({ content, date, onSuccess }: AddFormProps) => {
  const {
    handleAdd,
    textChange,
    formContent,
    dateInput,
    textareaInput,
    locationsRef,
    isLoading
  } = useAddForm(onSuccess);

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

      <div className="form-group">
        <textarea
          id="addFormTextarea"
          ref={textareaInput as any}
          rows={6}
          onChange={textChange}
          className="form-control"
          placeholder="Add ..."
          defaultValue={content}
        />
      </div>

      <div className="editBtns d-flex justify-content-between align-items-center">
        <button
          onClick={handleAdd}
          className="btn btn-primary success"
          id="saveBtn"
          type="button"
          disabled={isLoading}
        >
          <i className="fa fa-save" /> Submit
        </button>

        <input
          type="date"
          ref={dateInput}
          defaultValue={date}
          className="form-control mx-2"
          style={{ width: '150px'}}
        />

        <button
          type="button"
          onClick={() => onSuccess('', { id: -1, content: '', date: '' })}
          className="btn btn-warning attention"
          id="cancelBtn"
        >
          <i className="fa fa-ban" /> Cancel
        </button>
      </div>

      <LocationForm ref={locationsRef} />

      <div className="markdownDisplay preview dashBorder">
        <MarkdownDisplay source={formContent || ''} />
      </div>
    </div>
  );
};

export default AddForm;
