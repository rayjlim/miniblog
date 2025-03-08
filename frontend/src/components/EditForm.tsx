import { RefObject } from 'react';
import MarkdownDisplay from './MarkdownDisplay';
import useEditForm from '../hooks/useEditForm';
import LocationForm from './LocationForm';
import { EntryType } from '../Types';
import './EditForm.css';

interface EditFormProps {
  entry: EntryType | null;
  onSuccess: (msg: string, entry: EntryType) => void;
}

const EditForm = ({ entry, onSuccess }: EditFormProps) => {
  const escapedContent = entry?.content?.replace(/<br\s*\/>/g, '\n');

  const {
    formRef,
    markdownContent,
    textChange,
    handleSave,
    handleDelete,
    isLoading
  } = useEditForm(entry, onSuccess);

  return (
    <div className="well">
      <h2>Edit Entry</h2>

      <div className="entry-bar d-flex justify-content-between align-items-start">
        <div className="help-text">
          <p className="small">use `@@fa-tag@@` for quick font-awesome icon</p>
          <p className="small">link: [link text](URL)</p>
          <div className="links">
            <a
              className="small"
              href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cheatsheet
            </a>
            {', '}
            <a
              className="small"
              href="https://fontawesome.com/icons"
              target="_blank"
              rel="noopener noreferrer"
            >
              Font Awesome
            </a>
          </div>
        </div>

        <button
          onClick={handleDelete}
          data-testid="deleteBtn"
          className="btn delete-btn danger"
          type="button"
        >
          <i className="fa fa-trash" /> Delete
        </button>
      </div>

      <form
        ref={formRef as RefObject<HTMLFormElement>}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="add-form"
      >
        <div className="form-group mb-3">
          <textarea
            name="content"
            onChange={textChange}
            className="form-control"
            placeholder="Add ..."
            rows={8}
            defaultValue={escapedContent}
          />
        </div>

        <div className="editBtns col-3 gap-3">
          <button
            className="btn btn-primary spaced-link success"
            data-testid="saveBtn"
            id="saveBtn"
            type="submit"
            title="alt + s"
            disabled={isLoading}
          >
            <i className="fa fa-save" /> Save
          </button>

          <input
            type="date"
            name="dateInput"
            defaultValue={entry?.date || ''}
          />

          <button
            onClick={() => onSuccess('', { id: -1, content: '', date: '' })}
            className="btn btn-warning pull-right spaced-link attention"
            data-testid="cancelBtn"
            id="cancelBtn"
            type="button"
            title="ESC"
          >
            <i className="fa fa-ban" /> Cancel
          </button>
        </div>

        <div className="mt-3">
          <LocationForm content={entry?.locations ? JSON.stringify(entry.locations) : ''} />
        </div>
      </form>

      <div className="markdownDisplay preview dashBorder mt-3">
        <MarkdownDisplay source={markdownContent} />
      </div>
    </div>
  );
};

export default EditForm;
