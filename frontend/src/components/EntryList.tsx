import { forwardRef } from 'react';

import { format, parse } from 'date-fns';
import MarkdownDisplay from '../components/MarkdownDisplay';

import { FULL_DATE_FORMAT } from '../constants';

import MapDisplay from './MapDisplay';
import useEntryList from '../hooks/useEntryList';

const EntryList = ({ date, isOneDay, onShowEdit }: {
  date: string,
  isOneDay: boolean,
  onShowEdit: (entry: EntryType) => void
}, ref: any) => {

  const { isLoading, error, isEditing, entries, showEdit } = useEntryList(date, isOneDay, onShowEdit, ref);

  if (isLoading) return <div>Load posts...</div>;
  if (error) return <div>An error occurred: {(error as RequestError).message}</div>;

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
            {isOneDay && (entry as any)?.locations?.length > 0
              && (<>
                <MapDisplay locations={ (entry as any)?.locations} />
              </>)}
          </li>
        ))}
      </ul>

    </section>
  );
};

export default forwardRef(EntryList);
