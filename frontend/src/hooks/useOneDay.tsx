import { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns';
import {
  FULL_DATE_FORMAT,
  REST_ENDPOINT,
  STORAGE_KEY,
  AUTH_HEADER,
} from '../constants';

const SAMEDAY = 1;

const useOneDay = (pageMode?: number) => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<EntryType[]>([]);
  const [editEntry, setEditEntry] = useState<EntryType | null>(null);
  const [pageDate, setPageDate] = useState<string>(format(new Date(), FULL_DATE_FORMAT));
  const isMounted = useRef<boolean>(false);
  // scrollToLast: 0,

  const loadDay = useCallback((targetDate?: string) => {
    console.log(`loadDay : ${pageDate} pagemode: ${pageMode}`);

    if (!pageDate) {
      return;
    }
    let endPointDate = targetDate || pageDate;
    let endPointURL = '';
    switch (pageMode) {
      case SAMEDAY: {
        endPointURL = `${REST_ENDPOINT}/api/sameDayEntries/?day=${endPointDate}`;
        break;
      }
      default: {
        endPointURL = `${REST_ENDPOINT}/api/posts/?date=${endPointDate}`;
        break;
      }
    }
    setEditEntry(null);
    (async () => {
      const token = window.localStorage.getItem(STORAGE_KEY) || '';
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set(AUTH_HEADER, token);
      try {
        const response = await fetch(endPointURL, {
          mode: 'cors',
          cache: 'no-cache',
          headers: requestHeaders,
        });
        if (response.ok) {
          const data = await response.json();
          console.log('response.data :>> ', data.entries);

          setEntries(data.entries);

          // console.log('state.scrollToLast :>> ', loadParams.scrollToLast);
        } else {
          console.error('response.status :', response.status);
          // toast.error(`loading error : ${response.status}`);
        }
      } catch (err) {
        console.error(err);
        // toast.error(`loading error : ${err}`);
      }
    })();
  }, [editEntry, pageDate]);

  function checkKeyPressed(e: KeyboardEvent) {
    console.log(`OneDay: handle key presss ${e.key}`);

    // Note: getting element by id is a hack; IDKW
    // the content value is being taken from the init value
    if (e.altKey && e.key === ',') {
      console.log('alt comma keybinding');
      document.getElementById('prevBtn')?.click();
    } else if (e.altKey && e.key === '.') {
      console.log('alt period keybinding');
      document.getElementById('nextBtn')?.click();

      // NOT working?? gets cached entry from somewhere else
      // } else if (e.altKey && e.key === 'e' && entries) {
      //   console.table(entries);
      //   setEditEntry(entries[0]);
      //   e.preventDefault();
    } else if (e.altKey && e.key === 'f') {
      navigate('/search');
      e.preventDefault();
    }
  }

  useEffect(() => {
    async function ueFunc() {
      const token = window.localStorage.getItem(STORAGE_KEY);
      if (!token) {
        navigate('/login');
      }

      console.log('OndeDay: useEffect' + pageDate);
      if (!isMounted.current) {
        const loc = `${window.location}`;
        const param = loc.substring(loc.indexOf('?'));
        console.log('param :', param);
        const urlParams = new URLSearchParams(param);

        const pageDateParam = urlParams.get('date') || format(new Date(), FULL_DATE_FORMAT);
        setPageDate(pageDateParam);
        loadDay(pageDateParam || '');
        isMounted.current = true;
      } else {
        loadDay('');
      }


    }
    ueFunc();
    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, [pageMode, pageDate]);
  return { editEntry, setEditEntry, pageDate, setPageDate, entries, loadDay }
}

export default useOneDay;
