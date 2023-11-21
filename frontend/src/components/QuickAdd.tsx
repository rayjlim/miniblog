import { useState } from 'react';
import format from 'date-fns/format';
import { FULL_DATE_FORMAT } from '../constants';

const QuickAdd = ({ onSuccess }: { onSuccess: (msg: string) => void }) => {
  const [quickDate, setQuickDate] = useState(format(new Date(), FULL_DATE_FORMAT));

  const dateChange = (value: string) => setQuickDate(value || format(new Date(), FULL_DATE_FORMAT));

  // TODO: impl api backend
  const quickCreate = () => {
    console.log(`quick: ${quickDate}`);
    onSuccess('Quick Appended');
  };

  return (
    <>
      <input type="date" onChange={e => dateChange(e.target.value)}
        value={quickDate} />
      <button type="button" onClick={() => quickCreate()}>Quick Append</button>
    </>
  );
};
export default QuickAdd;
