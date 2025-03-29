import MarkdownDisplay from './MarkdownDisplay';
import useAddForm from '../hooks/useAddForm';
import LocationForm from './LocationForm';
import { EntryType } from '../Types';

interface AddFormProps {
  content: string;
  date: string;
  location?: {
    title: string;
    coord: string;
  };
  onSuccess: (msg: string, entry: EntryType) => void;
}

const AddForm = ({ content, date, location, onSuccess }: AddFormProps) => {
  const {
    formRef,
    handleAdd,
    textChange,
    markdownContent,
    isLoading
  } = useAddForm({ onSuccess });

  const handleCancel = () => {
    onSuccess('', { id: -1, content: '', date: '' });
  };

  return (
    <div className="well">
      <h2>Add Entry</h2>

      <div className="entry-bar mb-3">
        <div className="help-section">
          <p className="small mb-1">use `@@fa-tag@@` for quick font-awesome icon</p>
          <p className="small mb-1">link: [link text](URL)</p>
          <div className="help-links">
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
      </div>

      <form ref={formRef} onSubmit={handleAdd} className="add-form">
        <div className="form-group mb-1">
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

        <div className="form-actions d-flex justify-content-between align-items-center gap-3 mb-3">
          <button
            className="btn btn-primary spaced-link success"
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
            defaultValue={date}
            className="form-control"
            style={{ width: 'auto' }}
          />

          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-warning pull-right spaced-link attention"
            id="cancelBtn"
          >
            <i className="fa fa-ban" /> Cancel
          </button>
        </div>

        <LocationForm initialLocation={location} />
      </form>

      <div className="markdown-preview mt-3 p-3 border rounded">
        <MarkdownDisplay source={markdownContent} />
      </div>
    </div>
  );
};

export default AddForm;
