import { ChangeEvent, useEffect, MouseEvent, useRef } from 'react';
import { format, parse, add } from 'date-fns';
import {
  FULL_DATE_FORMAT
} from '../constants';

const useDateNav = (updateDate: (date: string) => void, date: string) => {
  const inputDate = useRef<HTMLInputElement>(null);
  /**
   * Handle change in day Previous | Next
   * @function
   * @param  {Object} e Event of Button click
   */
  function handleButtonDirection(e: MouseEvent<HTMLElement>) {

    const button = e.target as HTMLButtonElement;
    console.log(button.value);

    let newDate;
    if (button.value === 'today') {
      newDate = new Date();
    } else {
      let localDate = parse(date || '', FULL_DATE_FORMAT, new Date());
      newDate = add(localDate, { days: parseInt(button.value) });
    }

    const ref = inputDate.current || { value: '' };
    ref.value = format(newDate, FULL_DATE_FORMAT);
    updateDate(format(newDate, FULL_DATE_FORMAT));
  }

  function updateDateInput(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value !== '' ? e.target.value : format(new Date, FULL_DATE_FORMAT);
    updateDate(newValue);
  }

  useEffect(() => {
    console.log('DateNave useEffect');
    const ref = inputDate.current || { value: '' };
    ref.value = date;
  });

  return { inputDate, handleButtonDirection, updateDateInput };
};

export default useDateNav;

