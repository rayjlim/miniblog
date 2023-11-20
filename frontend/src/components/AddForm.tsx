import { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import MarkdownDisplay from './MarkdownDisplay';
import useAddForm from '../hooks/useAddForm';

const propTypes = {
  content: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

type AddFormProps = PropTypes.InferProps<typeof propTypes>;

const AddForm: FunctionComponent<AddFormProps> = ({ content, date, onSuccess }: { content: string, date: string, onSuccess: any }) => {

  const { handleAdd, textChange, dateChange, formContent, formDate, textareaInput } =
    useAddForm(content, date, onSuccess);

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
          ref={textareaInput}
          rows={6}
          onChange={() => textChange()}
          className="form-control"
          placeholder="Add ..."
          defaultValue={content}
        />
      </div>

      <div className="form-group">
        <input type="date" onChange={e => dateChange(e.target.value)} value={formDate} />
      </div>

      <button
        onClick={() => handleAdd()}
        className="btn btn-primary"
        id="saveBtn"
        type="button"
      >
        <i className="fa fa-save" />
        Submit
      </button>
      <button
        type="button"
        onClick={() => onSuccess('')}
        className="btn btn-warning pull-right"
        id="cancelBtn"
      >
        <i className="fa fa-ban" />
        Cancel
      </button>
      <div className="markdownDisplay preview dashBorder">
        <MarkdownDisplay source={formContent} />
      </div>
    </div>
  );
};

export default AddForm;

AddForm.propTypes = propTypes;
