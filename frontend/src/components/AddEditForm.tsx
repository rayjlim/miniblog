import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AddForm from '../components/AddForm';
import EditForm from '../components/EditForm';
import '../Types';

const CLOSED = 0;
const ADD = 1;
const EDIT = 2;
import '../Types';

const AddEditForm = ({
  date,
  entry,
  onSuccess,
}: {
  date: string,
  entry: EntryType|null,
  onSuccess: () => void,
}) => {
  const [componentMode, setComponentMode] = useState(CLOSED);

  function showAddForm() {
    console.log('showAddForm#state.date :', date);
    setComponentMode(ADD);
  }

  function editDone(msg: string) {
    setComponentMode(CLOSED);
    msg !== '' && toast(msg);
    onSuccess();
  }

  function checkKeyPressed(e: any) {
    console.debug(`AddForm: handle key presss ${e.key}`);
    if (e.altKey && e.key === 'a') {
      showAddForm();
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
          onClick={() => showAddForm()}
        >
          Show Add Form
        </button>
      )}
      {componentMode === ADD && (
        <AddForm date={date} onSuccess={msg => editDone(msg)} content="" />
      )}

      {componentMode === EDIT && entry && (
        <EditForm entry={entry} onSuccess={(msg: string) => editDone(msg)} />
      )}
    </>
  );
};

export default AddEditForm;
