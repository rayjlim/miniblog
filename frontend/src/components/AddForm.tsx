import MarkdownDisplay from './MarkdownDisplay';
import useAddForm from '../hooks/useAddForm';
import LocationForm from './LocationForm';

const AddForm = ({ content, date, onSuccess }: { content: string, date: string, onSuccess: (msg: string, entry: EntryType) => void }) => {

  const { handleAdd, textChange, formContent, dateInput, textareaInput, locationsRef, isLoading } =
    useAddForm(onSuccess);

  return (
    <div className="well">
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
          id="addFormTextarea"
          ref={textareaInput as any}
          rows={6}
          onChange={() => textChange()}
          className="form-control"
          placeholder="Add ..."
          defaultValue={content}
        />
      </div>

      <div className="editBtns col-3">
        <button
          onClick={() => handleAdd()}
          className="btn btn-primary success"
          id="saveBtn"
          type="button"
          disabled={isLoading}
        >
          <i className="fa fa-save" />
          Submit
        </button>

        <div className="form-group">
          <input type="date"
            ref={dateInput as any}
            defaultValue={date} />
        </div>


        <button
          type="button"
          onClick={() => onSuccess('', { id: -1, content: '', date: '' })}
          className="btn btn-warning pull-right attention"
          id="cancelBtn"
        >
          <i className="fa fa-ban" />
          Cancel
        </button>
      </div>
      <LocationForm ref={locationsRef} />
      <div className="markdownDisplay preview dashBorder">
        <MarkdownDisplay source={formContent as any || ''} />
      </div>
    </div>
  );
};

export default AddForm;
