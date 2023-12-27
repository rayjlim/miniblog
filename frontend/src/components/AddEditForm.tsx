import { useEffect, useState } from 'react';
import AddForm from '../components/AddForm';
import EditForm from '../components/EditForm';

const CLOSED = 0;
const ADD = 1;
const EDIT = 2;

const AddEditForm = ({ date, entry, onSuccess }: {
  date: string,
  entry: EntryType | null,
  onSuccess: (msg: string, newEntry: EntryType) => void,
}) => {

  const [componentMode, setComponentMode] = useState(CLOSED);

  function editDone(msg: string, newEntry: EntryType) {
    setComponentMode(CLOSED);
    onSuccess(msg, newEntry);
  }

  function checkKeyPressed(e: any) {
    console.debug(`AddForm: handle key presss ${e.key}`);
    if (e.altKey && e.key === 'a') {
      setComponentMode(ADD);
    }
  }

  useEffect(() => {
    setComponentMode(entry ? EDIT : CLOSED);

    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, [entry?.content]);

  return (
    <>
      {componentMode === CLOSED && (
        <button
          type="button"
          className="btn btn-default"
          id="addFormBtn"
          onClick={() => setComponentMode(ADD)}
        >
          Show Add Form
        </button>
      )}
      {componentMode === ADD && (
        <AddForm date={date} onSuccess={editDone} content="" />
      )}

      {componentMode === EDIT && entry && (
        <EditForm entry={entry} onSuccess={(msg: string, newEntry: EntryType) => editDone(msg, newEntry)} />
      )}
    </>
  );
};

export default AddEditForm;
