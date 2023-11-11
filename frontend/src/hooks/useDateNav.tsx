import { ChangeEvent, useEffect, MouseEvent, useRef } from 'react';
import { format, parse, add } from 'date-fns';
import {
  FULL_DATE_FORMAT
} from '../constants';

const useDateNav = (updateDate: (date: string)=>void, date: string) => {
  const inputDate = useRef<HTMLInputElement>(null);
  /**
   * Handle change in day Previous | Next
   * @function
   * @param  {Object} e Event of Button click
   */
  function handleButtonDirection(e: MouseEvent<HTMLElement>) {
    let localDate = parse(date||'', FULL_DATE_FORMAT, new Date());
    const button = e.target as HTMLButtonElement;
    if (button.value === 'today') {
      localDate = new Date();
    } else {
      localDate = parse(date||'', FULL_DATE_FORMAT, new Date());
    }

    const newDate = add(localDate, { days: parseInt(button.value) });
    const ref = inputDate.current || {value: ''};
    ref.value = format(newDate, FULL_DATE_FORMAT);
    updateDate(format(newDate, FULL_DATE_FORMAT));
  }

  function updateDateInput(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const dateRegex = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
    if (e.target.value.match(dateRegex)) {
      updateDate(e.target.value);
    }
  }

  useEffect(()=>{
    console.log('DateNave useEffect');
    const ref = inputDate.current || {value: ''};
    ref.value = date;
  });

  return {inputDate, handleButtonDirection, updateDateInput};
};

export default useDateNav;
