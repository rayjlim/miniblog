import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useImperativeHandle
} from 'react';
import { useQuery } from "react-query";
import { format, parse } from 'date-fns';
import MarkdownDisplay from '../components/MarkdownDisplay';

import { FULL_DATE_FORMAT, REST_ENDPOINT } from '../constants';
import createHeaders from '../utils/createHeaders';
import GoogleMap from './GoogleMap';

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

const EntryList = ({ date, isOneDay, onShowEdit }: {
  date: string,
  isOneDay: boolean,
  onShowEdit: (entry: EntryType) => void
}, ref: any) => {

  const { data, error, isLoading, refetch } = useQuery(["entrylist", date, isOneDay], () => fetchData(date, isOneDay));
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
    console.log(`entrylist: useEffect`);
    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, [entries]);


  if (isLoading) return <div>Load posts...</div>;
  if (error) return <div>An error occurred: {(error as RequestError).message}</div>;
  const markers: { lat: number, lng: number }[] = [];
  // const markers: MarkerType[] = [
  //   { title: 'Random place', lat: 37 + parseFloat(`${Math.random()}`), lng: -121 +  parseFloat(`${Math.random()}`) },
  //   { title: 'Sharks Ice', lat: 37.319246, lng: -121.864025 },
  //   { title: 'Saint Anne\'s Church', lat: 37.537338,lng: -121.952241}];
  return (
    <section className={isEditing ? 'noshow' : 'container'}>
      <ul className="entriesList">
        {entries && entries.map((entry: EntryType) => (
          <li key={entry.id} id={`li${entry.id}`}>
            <button
              id={`edit${entry.id}`}
              onClick={() => showEdit(entry)}
              className="plainLink"
              type="button"
            >
              {format(
                parse(entry.date, FULL_DATE_FORMAT, new Date()),
                'EEE MM, dd yyyy'
              )}
            </button>
            <div className="markdownDisplay">
              <MarkdownDisplay source={entry.content} />
            </div>
          </li>
        ))}
      </ul>
      {markers.length > 0 && <GoogleMap markers={markers}/>}
    </section>
  );
};

export default forwardRef(EntryList);
