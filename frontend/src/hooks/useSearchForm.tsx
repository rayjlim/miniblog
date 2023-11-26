import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { format, subMonths } from 'date-fns';

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
  const startDate = useRef<string | null>(format(subMonths(new Date(), DEFAULT_SEARCH_MONTHS_BACK), FULL_DATE_FORMAT));
  const endDate = useRef<string | null>(null);

  async function getYearMonths() {
    console.log('getYearMonths');

    try {
      const token = window.localStorage.getItem(STORAGE_KEY) || '';
      const endpoint = `${REST_ENDPOINT}/api/yearMonth`;

      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set(AUTH_HEADER, token);
      const response = await fetch(endpoint, {
        headers: requestHeaders,
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
        const formattedDate = startDate.current;
        endpoint += `&startDate=${formattedDate}`;
      }
      if (endDate.current) {
        const formattedEndDate = endDate.current;
        endpoint += `&endDate=${formattedEndDate}`;
      }
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set(AUTH_HEADER, token);

      const response = await fetch(endpoint, {
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
          startDate.current = responseData.params.startDate;
        } else {
          startDate.current = null;
        }

        if (responseData.params.endDate !== '') {
          endDate.current = responseData.params.endDate;
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

  function changeDate(date: string, type: string) {
    console.log('change date called', date, type);
    if (type === 'start') {
      startDate.current = date === '' ? '2000-01-01' : date;
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
    searchText.current?.focus();
  }, [searchFilter]);

  return { searchText, yearMonths, startDateValue, startDate, endDateValue,
    endDate, searchFilter, setSearchFilter, changeDate, debouncedSearch };

}

export default useSearchForm;
