import { createRef, useCallback, useState, useEffect, useRef } from 'react';
import { useQuery } from "react-query";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { format } from 'date-fns';
import {
  FULL_DATE_FORMAT,
  REST_ENDPOINT,
  STORAGE_KEY,
  AUTH_HEADER,
} from '../constants';

const SAMEDAY = 1;

const fetchData = async (date: string, pageMode: number) => {
  let endPointURL = '';
  switch (pageMode) {
    case SAMEDAY: {
      endPointURL = `${REST_ENDPOINT}/api/sameDayEntries/?day=${date}`;
      break;
    }
    default: {
      endPointURL = `${REST_ENDPOINT}/api/posts/?date=${date}`;
      break;
    }
  }

  if (endPointURL !== '') {
    const token = window.localStorage.getItem(STORAGE_KEY) || '';
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set(AUTH_HEADER, token);

    const response = await fetch(endPointURL, {
      mode: 'cors',
      cache: 'no-cache',
      headers: requestHeaders,
    });

    const data = await response.json();
    return data;
  }
};

const useOneDay = (pageMode?: number) => {
  const navigate = useNavigate();
  const routeParams = useParams();

  const [editEntry, setEditEntry] = useState<EntryType | null>(null);
  const [pageDate, setPageDate] = useState<string>(format(new Date(), FULL_DATE_FORMAT));
  const isMounted = useRef<boolean>(false);

  const { data, error, isLoading } = useQuery(["oneday", pageDate, pageMode], () => fetchData(pageDate, pageMode || 0));
  // const movies = data?.movies;
  console.log(data);
  const entries = data?.entries;
  const refs = entries?.reduce((acc: any, value: any) => {
    // @ts-ignore
    acc[value.id] = createRef();
    return acc;
  }, {});

  const handleClick = (id: number) => {
    console.log(refs);
    // @ts-ignore
    refs[id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

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

  function resetEntryForm(msg: string, newEntry: EntryType) {
    if (msg) {
      toast(msg);
    }
    let targetId = editEntry?.id || 0;

    setEditEntry(null);

    // if (newEntry.content === 'DELETE') {
    //   const revised = entries.filter(curr => curr.id !== newEntry.id);
    //   setEntries(revised);
    // }
    // else {
    //   const revised = entries.map(curr => (curr.id === newEntry.id) ? newEntry : curr);
    //   setEntries(revised);
    // }
    console.log(newEntry);

    setTimeout(() => {
      // handleClick(targetId); // Not scrolling to location
      const btn = document.getElementById(`btn${targetId}`);
      btn?.click();
    }, 100);
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
        console.log(`routeParams: ${JSON.stringify(routeParams)}`);
        const pageDateParam = urlParams.get('date') || routeParams?.date || format(new Date(), FULL_DATE_FORMAT);

        setPageDate(pageDateParam);
        isMounted.current = true;
      }
    }
    ueFunc();
    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, [pageMode, pageDate]);

  return { entries, refs, editEntry, setEditEntry, pageDate, setPageDate, handleClick, resetEntryForm, isLoading, error }
}

export default useOneDay;
