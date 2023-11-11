import { useRef, ChangeEvent } from 'react';
import { format, parse, add } from 'date-fns';
import {
  FULL_DATE_FORMAT
} from '../constants';

const DateNav = ({updateDate, date}: {updateDate: (date: string)=>void, date: string})=>{
  const dateInput = useRef(null);
  /**
   * Handle change in day Previous | Next
   * @function
   * @param  {Object} e Event of Button click
   */
  function handleButtonDirection(e: React.MouseEvent<HTMLElement>) {
    let localDate = parse(date, FULL_DATE_FORMAT, new Date());
    const button = e.target as HTMLButtonElement;
    if (button.value === 'today') {
      localDate = new Date();
    } else {
      localDate = parse(date, FULL_DATE_FORMAT, new Date());
    }

    const newDate = add(localDate, { days: parseInt(button.value) });
    let refInput = dateInput.current || {value: ''};
    refInput.value = format(newDate, FULL_DATE_FORMAT);
    updateDate(format(newDate, FULL_DATE_FORMAT));
  }

  function updateDateInput(e: ChangeEvent<HTMLInputElement>) {
    const dateRegex = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
    if (e.target.value.match(dateRegex)) {
      updateDate(e.target.value);
    }
  }

  return (
  <div className="grid-3mw container">
    <button
      onClick={e => handleButtonDirection(e)}
      className="btn btn-info btn-lrg"
      value="-1"
      id="prevBtn"
      type="button"
      title="alt + comma"
    >
      <i className="fa fa-chevron-left"/>
      Prev
    </button>
    <div>
      <input
        ref={dateInput}
        type="text"
        className="form-control"
        id="formDpInput"
        defaultValue={date}
        onChange={e => updateDateInput(e)}
      />
    </div>
    <button
      onClick={e => handleButtonDirection(e)}
      className="btn btn-success btn-lrg"
      value="1"
      id="nextBtn"
      type="button"
      title="alt + period"
    >
      Next
      <i className="fa fa-chevron-right" />
    </button>
    <button
      onClick={e => handleButtonDirection(e)}
      className="btn btn-warning btn-lrg"
      value="today"
      type="button"
    >
      Today
    </button>
  </div>);
};

export default DateNav;
