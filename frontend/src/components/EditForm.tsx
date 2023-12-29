import MarkdownDisplay from './MarkdownDisplay';
import useEditForm from '../hooks/useEditForm';

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
    content,
    dateInput,
    locationsInput,
    textChange,
    locationChange,
    handleSave,
    handleDelete,
    locationPrepTitle,
    locationPrep,
    populateLocations,
    locations,
    parseLocationPrep,
    populateLocationsInput,
    getCoordinatesByBrowser
  } = useEditForm(entry, onSuccess);

  console.log(locations);
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
          ref={textareaInput}
          onChange={() => textChange()}
          className="form-control"
          placeholder="Add ..."
          rows={8}
          defaultValue={escapedContent}
        />
      </div>
      <div className="editBtns">
        <button
          onClick={() => handleSave()}
          className="btn btn-primary spaced-link"
          data-testid="saveBtn"
          id="saveBtn"
          type="button"
          title="alt + s"
        >
          <i className="fa fa-save" />
          <span>Save</span>
        </button>
        <input
          type="date"
          defaultValue={entry?.date || ''}
          ref={dateInput}

        />
        <button
          onClick={() => onSuccess('', { id: -1, content: '', date: '' })}
          className="btn btn-warning pull-right spaced-link"
          data-testid="cancelBtn"
          id="cancelBtn"
          type="button"
          title="ESC"
        >
          <i className="fa fa-ban" />
          <span>Cancel</span>
        </button>
      </div>
      <div>
        <textarea

          ref={locationsInput as any}
          onChange={() => locationChange()}
          className="form-control"
          placeholder="locations"
          rows={3}
          defaultValue={entry?.locations !== '' ? JSON.stringify(entry?.locations) : ''}
        />
        <button type="button"
          onClick={() => populateLocations()}>input to locations</button>
        <button type="button"
          onClick={() => populateLocationsInput()}>locations to input</button>

        {locations.map((location => (
          <div key={`${location.lat},${location.lng}`}>{location.title}, {location.lat}, {location.lng}</div>
        )))}
        <input type="text" ref={locationPrepTitle as any} />
        <input type="text" ref={locationPrep as any} />
        <button type="button"
          onClick={() => parseLocationPrep()}>parse</button>
        <button type="button" title="get current location"
          onClick={() => getCoordinatesByBrowser()}>Here</button>

      </div>
      <div className="markdownDisplay preview dashBorder">
        <MarkdownDisplay source={content} />
      </div>
    </div>
  );
};

export default EditForm;
