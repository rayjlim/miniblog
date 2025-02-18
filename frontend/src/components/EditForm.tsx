import MarkdownDisplay from './MarkdownDisplay';
import useEditForm from '../hooks/useEditForm';
import LocationForm from './LocationForm';
import './EditForm.css';

const EditForm = ({ entry, onSuccess, }: {
  entry: EntryType | null,
  onSuccess: (msg: string, entry: EntryType) => void
}) => {
  const escapedContent = entry?.content.replace(
    /<br\s*\/>/g,
    `
`,
  );

  const {
    textareaInput,
    markdownContent,
    dateInput,
    textChange,
    handleSave,
    handleDelete,
    locationsRef,
    isLoading
  } = useEditForm(entry, onSuccess);

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
          className="btn btn-danger pull-right delete-btn spaced-link"
          type="button"
        >
          <i className="fa fa-trash" />
          <span>Delete</span>
        </button>
      </div>
      <div className="form-group">
        <textarea
          ref={textareaInput as any}
          onChange={() => textChange()}
          className="form-control"
          placeholder="Add ..."
          rows={8}
          defaultValue={escapedContent}
        />
      </div>
      <div className="editBtns col-3">
        <button
          onClick={() => handleSave()}
          className="btn btn-primary spaced-link success"
          data-testid="saveBtn"
          id="saveBtn"
          type="button"
          title="alt + s"
          disabled={isLoading}
        >
          <i className="fa fa-save" />
          <span>Save</span>
        </button>
        <div>
        <input
            type="date"
            defaultValue={entry?.date || ''}
            ref={dateInput as any}
            aria-label="date-input"
          />

        </div>
        <button
          onClick={() => onSuccess('', { id: -1, content: '', date: '' })}
          className="btn btn-warning pull-right spaced-link attention"
          data-testid="cancelBtn"
          id="cancelBtn"
          type="button"
          title="ESC"
        >
          <i className="fa fa-ban" />
          <span>Cancel</span>
        </button>
      </div>
      <LocationForm ref={locationsRef}/>
      <div className="markdownDisplay preview dashBorder">
        <MarkdownDisplay source={markdownContent} />
      </div>
    </div>
  );
};

export default EditForm;
