import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format, parse, subMonths } from 'date-fns';

import {
  DEFAULT_SEARCH_MONTHS_BACK,
  FULL_DATE_FORMAT,
  REST_ENDPOINT,
  STORAGE_KEY,
  AUTH_HEADER
} from '../constants';

import debounce from '../utils/debounce';

const FILTER_MODE_ALL = 0;
// const FILTER_MODE_TAGGED = 1;
// const FILTER_MODE_UNTAGGED = 2;
const DEBOUNCE_TIME = 350;

const useSearchForm = (setPosts: (entries: EntryType[]) => void,
  setSearchParams: (params: any) => void
) => {
  const isMounted = useRef<boolean>();
  const [yearMonths, setYearMonths] = useState([]);
  const [searchFilter, setSearchFilter] = useState(FILTER_MODE_ALL);

  const searchText = useRef<HTMLInputElement>(null);
  const [startDateValue, setStartDateValue] = useState<string>('');
  const [endDateValue, setEndDateValue] = useState<string>('');
  const startDate = useRef<Date | null>(subMonths(new Date(), DEFAULT_SEARCH_MONTHS_BACK));
  const endDate = useRef<Date | null>(null);

  async function getYearMonths() {
    console.log('getYearMonths');

    try {
      const token = window.localStorage.getItem(STORAGE_KEY) || '';
      const endpoint = `${REST_ENDPOINT}/api/yearMonth`;

      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set('Content-Type', 'application/json');
      requestHeaders.set(AUTH_HEADER, token);
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: requestHeaders,
        referrerPolicy: 'no-referrer',
      });

      if (!response.ok) {
        console.log('response.status :', response.status);
        throw new Error(`loading error : ${response.status}`);
      } else {
        const responseData = await response.json();

        setYearMonths(responseData.map((row: string) => ({ label: row, value: row })));
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err);
    }
  }

  /**
    * The function `getEntries` is an asynchronous function that retrieves entries
    * from an API based on search parameters and updates the state with the results.
   * Get blog entries for text search
   */
  async function getEntries() {
    console.log('getEntries#searchText: ', searchText.current?.value);
    const searchTextValue = searchText.current?.value || '';
    try {
      const token = window.localStorage.getItem(STORAGE_KEY) || '';
      const encodedSearchText = encodeURIComponent(searchTextValue);
      let endpoint = `${REST_ENDPOINT
        }/api/posts/?searchParam=${encodedSearchText}&filterType=${searchFilter}`;
      if (startDate.current) {
        const formattedDate = format(startDate.current, FULL_DATE_FORMAT);
        endpoint += `&startDate=${formattedDate}`;
      }
      if (endDate.current) {
        const formattedEndDate = format(endDate.current, FULL_DATE_FORMAT);
        endpoint += `&endDate=${formattedEndDate}`;
      }
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set('Content-Type', 'application/json');
      requestHeaders.set(AUTH_HEADER, token);
      const response = await fetch(endpoint, {
        method: 'GET',
        cache: 'no-cache',
        headers: requestHeaders,
        referrerPolicy: 'no-referrer',
      });

      if (!response.ok) {
        console.log('response.status : ', response.status);
        throw new Error(`loading error : ${response.status}`);
      } else {
        const responseData = await response.json();
        console.log('result.responseData :>> ', responseData);

        setSearchParams({ ...responseData.params, postsCount: responseData.entries.length });

        if (responseData.params.startDate !== '') {
          startDate.current = parse(
            responseData.params.startDate,
            FULL_DATE_FORMAT,
            new Date(),
          );
        } else {
          startDate.current = null;
        }

        if (responseData.params.endDate !== '') {
          endDate.current = parse(
            responseData.params.endDate,
            FULL_DATE_FORMAT,
            new Date(),
          );
        } else {
          endDate.current = null;
        }

        setStartDateValue(responseData.params.startDate);
        setEndDateValue(responseData.params.endDate);
        setPosts(responseData.entries);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err);
    }
  }

  function changeDate(date: Date, type: string) {
    console.log('change date called', date, type);
    if (type === 'start') {
      startDate.current = date === null ? new Date('2000-01-01') : date;
    } else {
      endDate.current = date;
    }
    debouncedSearch();
  }

  const debouncedSearch = debounce(getEntries, DEBOUNCE_TIME);

  useEffect(() => {
    debouncedSearch();
    if (!isMounted.current) {
      isMounted.current = true;
      getYearMonths();
    }
  }, [searchFilter]);

  return { searchText, yearMonths, startDateValue, startDate, endDateValue,
    endDate, searchFilter, setSearchFilter, changeDate, debouncedSearch };

}

export default useSearchForm;
