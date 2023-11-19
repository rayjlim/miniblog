import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AddForm from '../components/AddForm';
import EditForm from '../components/EditForm';
import '../Types';

const CLOSED = 0;
const ADD = 1;
const EDIT = 2;

const AddEditForm = ({
  date,
  entry,
  onSuccess,
}: {
  date: string,
  entry: any,
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

  useEffect(() => {
    // console.log(entry?.id, entry?.date, entry);
    setComponentMode(entry ? EDIT : CLOSED);
  }, [entry]);

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
        <EditForm entry={entry} onSuccess={msg => editDone(msg)} />
      )}
    </>
  );
};

export default AddEditForm;
