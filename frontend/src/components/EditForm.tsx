import { RefObject } from 'react';
import MarkdownDisplay from './MarkdownDisplay';
import useEditForm from '../hooks/useEditForm';
import LocationForm from './LocationForm';
import { EntryType } from '../Types';
import { useSetting } from './SettingContext';
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
  const settings = useSetting();
  const { PREVIEW } = settings || {};

  const changePreview = async () => {
    if (settings?.updateSetting) {
      if (PREVIEW === 'down') {
        await settings.updateSetting('PREVIEW', 'right');
      } else {
        await settings.updateSetting('PREVIEW', 'down');
      }
    }
  };

  return (
    <>
      <h2>Edit Entry</h2>

      <div className={PREVIEW === 'down' ? 'well-vertical' : 'well'}>
        <form
          ref={formRef as RefObject<HTMLFormElement>}
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="add-form"
        >
          <div className="form-group mb-1">
            <textarea
              name="content"
              onChange={textChange}
              className="form-control"
              placeholder="Add ..."
              rows={8}
              defaultValue={escapedContent}
            />
          </div>
{/* common used tags:
Fitness
Tv
Gaming
song
data
devwork
golfround
computer
finance
bought
FI
Dream */}
          <div className="form-actions d-flex justify-content-between align-items-center gap-3 mb-3">
            <button
              className="btn btn-primary spaced-link success"
              data-testid="saveBtn"
              id="saveBtn"
              type="submit"
              title="alt + s"
              disabled={isLoading}
            >
              {isLoading ? (
                <><i className="fa fa-spinner fa-spin" /> Saving...</>
              ) : (
                <><i className="fa fa-save" /> Save</>
              )}
            </button>

            <input
              type="date"
              name="dateInput"
              defaultValue={entry?.date || ''}
              className="form-control"
              style={{ width: 'auto' }}
            />

            <button
              type="button"
              onClick={() => onSuccess('', { id: -1, content: '', date: '' })}
              data-testid="cancelBtn"
              className="btn btn-warning pull-right spaced-link attention"
              id="cancelBtn"
              title="ESC"
            >
              <i className="fa fa-ban" /> Cancel
            </button>
          </div>

          <div className="mt-3">
            <LocationForm content={entry?.locations ? JSON.stringify(entry.locations) : ''} />
          </div>
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
        </form>

        <div className="markdown-content preview dashBorder mt-3">
          <MarkdownDisplay source={markdownContent} />
        </div>
      </div>
      <div className="entry-bar d-flex justify-content-between align-items-start">
        <button onClick={changePreview}>toggle preview</button>
        <button
          onClick={handleDelete}
          data-testid="deleteBtn"
          className="btn delete-btn danger"
          type="button"
        >
          <i className="fa fa-trash" /> Delete
        </button>
      </div>
    </>
  );
};

export default EditForm;
