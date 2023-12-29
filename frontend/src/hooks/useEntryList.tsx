import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle
} from 'react';
import { useQuery } from "react-query";

import { REST_ENDPOINT } from '../constants';
import createHeaders from '../utils/createHeaders';

const fetchData = async (date: string, isOneDay: boolean) => {
  // console.log('fetchData', date, isOneDay);
  let endPointURL = isOneDay ? `${REST_ENDPOINT}/api/posts/?date=${date}`
    : `${REST_ENDPOINT}/api/sameDayEntries/?day=${date}`;
  const requestHeaders = createHeaders();
  const response = await fetch(endPointURL, {
    mode: 'cors',
    cache: 'no-cache',
    headers: requestHeaders,
  });

  const data = await response.json();
  return data;
};

const useEntryList = (date: string, isOneDay: boolean, onShowEdit:
  (entry: EntryType) => void, ref: any) => {

  const { data, error, isLoading, refetch }
    = useQuery(["entrylist", date, isOneDay], () => fetchData(date, isOneDay));
  const [isEditing, setIsEditing] = useState(false);
  const internalState = useRef();
  const scrollBackEntryId = useRef(0);

  const entries: EntryType[] = data?.entries;


  const showEdit = (entry: EntryType) => {
    setIsEditing(true);
    scrollBackEntryId.current = entry.id;
    onShowEdit(entry);
  }

  // Expose a custom API to the parent component
  useImperativeHandle(ref, () => ({
    resetView: (entry: EntryType) => {

      // console.log('resetView', entry);
      console.log(entries, entry);
      if (entry?.id !== -1) {
        refetch();
      }

      setIsEditing(false);

      setTimeout(() => {
        const target = document.getElementById(`li${scrollBackEntryId.current}`);
        target?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 0);
    }
  }), [internalState]);

  function checkKeyPressed(e: any) {
    // console.log(`Entrylist: handle key presss ${e.key}`);
    if (e.altKey && e.key === '1') {
      console.log('e keybinding', entries);
      const targetId = entries.length ?
        `edit${entries[0]?.id}` : 'addFormBtn';
      document.getElementById(targetId)?.click();
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, [entries]);


  return { isLoading, error, isEditing, entries, showEdit };
};
export default useEntryList;
