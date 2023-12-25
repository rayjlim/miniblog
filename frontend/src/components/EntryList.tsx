import {
  forwardRef,
  useRef,
  useState,
  MutableRefObject,
  useImperativeHandle
} from 'react';
import { useQueryClient, useQuery } from "react-query";
import { format, parse } from 'date-fns';
import MarkdownDisplay from '../components/MarkdownDisplay';

import {
  FULL_DATE_FORMAT,
  REST_ENDPOINT,
  STORAGE_KEY,
  AUTH_HEADER,
} from '../constants';
import '../Types';

const fetchData = async (date: string, isOneDay: boolean) => {
  // console.log('fetchData', date, isOneDay);
  let endPointURL = isOneDay ? `${REST_ENDPOINT}/api/posts/?date=${date}`
    : `${REST_ENDPOINT}/api/sameDayEntries/?day=${date}`;

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

const EntryList = ({
  date,
  isOneDay,
  onShowEdit
}: {
  date: string,
  isOneDay: boolean,
  onShowEdit: (entry: EntryType) => void
}, ref: MutableRefObject<void>) => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(["entrylist", date, isOneDay], () => fetchData(date, isOneDay));
  const [isEditing, setIsEditing] = useState(false);
  const internalState = useRef();
  const editEntryId = useRef(0);

  const showEdit = (entry: EntryType) => {
    setIsEditing(true);
    editEntryId.current = entry.id;
    onShowEdit(entry);
  }
  const entries: EntryType[] = data?.entries;
  // Expose a custom API to the parent component
  useImperativeHandle(ref, () => ({
    resetView: (entry: EntryType) => {

      // console.log('resetView', entry);
      console.log(entries, entry);
      if (entry?.id !== 0 && entries) {
        if (entry.content === 'DELETE') {
          const revised = entries.filter((curr: EntryType) => curr.id !== entry.id);
          queryClient.setQueryData(["entrylist", date, isOneDay], { ...data, entries: revised });
        }
        else {
          console.log(data, date, isOneDay);
          const revised = entries.map((curr: EntryType) => (curr.id === entry.id) ? entry : curr);
          queryClient.setQueryData(["entrylist", date, isOneDay], { ...data, entries: revised });
        }
      }else if(entry.id !== 0){
        console.log('make new entry list', entry);
        queryClient.setQueryData(["entrylist", date, isOneDay], { ...data, entries: [entry] });
      }

      setIsEditing(false);

      setTimeout(() => {
        const target = document.getElementById(`li${editEntryId.current}`);
        target?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 0);
    }
  }), [internalState]);




  if (isLoading) return <div>Load posts...</div>;
  if (error) return <div>An error occurred: {error?.message}</div>;

  return (
    <section className={isEditing ? 'noshow' : 'container'}>
      <ul className="entriesList">
        {entries && entries.map((entry: EntryType) => (
          <li key={entry.id} id={`li${entry.id}`}>
            <button
              onClick={() => showEdit(entry)}
              className="plainLink"
              type="button"
            >
              {format(
                parse(entry.date, FULL_DATE_FORMAT, new Date()),
                'EEE MM, dd yyyy'
              )}
              {entry.id}
            </button>
            <div className="markdownDisplay">
              <MarkdownDisplay source={entry.content} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default forwardRef(EntryList);
