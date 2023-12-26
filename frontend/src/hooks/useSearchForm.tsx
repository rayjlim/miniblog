import { useState, useRef, useEffect } from 'react';
import { format, subMonths } from 'date-fns';

import {
  DEFAULT_SEARCH_MONTHS_BACK,
  FULL_DATE_FORMAT,
} from '../constants';

// import debounce from '../utils/debounce';

const FILTER_MODE_ALL = 0;
// const FILTER_MODE_TAGGED = 1;
// const FILTER_MODE_UNTAGGED = 2;
// const DEBOUNCE_TIME = 350;

const useSearchForm = (params: SearchParamsType, setSearchParams: (params: SearchParamsType) => void) => {

  const [searchFilter, setSearchFilter] = useState(FILTER_MODE_ALL);

  const startDate = useRef<string | null>(format(subMonths(new Date(), DEFAULT_SEARCH_MONTHS_BACK), FULL_DATE_FORMAT));
  const endDate = useRef<string | null>(null);
  const searchText = useRef<HTMLInputElement>(null);

  function changeDate(date: string, type: string) {
    console.log('change date called', date, type);
    if (type === 'start') {
      startDate.current = date === '' ? '2000-01-01' : date;
    } else {
      endDate.current = date;
    }
    setSearchParams({ ...params, startDate: startDate.current || '', endDate: endDate.current || '' });
  }

  // const debouncedSearch = debounce(setParams, DEBOUNCE_TIME);
  const changeText = () => {
    const textInput = searchText?.current || { value: '' };
    setSearchParams({ ...params, text: textInput.value });
  }

  useEffect(() => {
    searchText.current?.focus();
    const textInput = searchText?.current || { value: '' };
    const params = {
      text: textInput.value,
      startDate: startDate.current || '',
      endDate: endDate.current || '',
    };
    setSearchParams(params);
  }, []);

  // const searchParams = {text: searchTextValue, startDate: startDateValue, endDate: endDateValue, filter: searchFilter};
  // setSearchParams(searchParams);

  return { searchText, changeText, startDate, endDate, changeDate, searchFilter, setSearchFilter };

}

export default useSearchForm;
