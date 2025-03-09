import { forwardRef, ForwardedRef } from 'react';
import { format, parse } from 'date-fns';
import MarkdownDisplay from '../components/MarkdownDisplay';
import { FULL_DATE_FORMAT } from '../constants';
import { EntryType, RequestError } from '../Types';
import MapDisplay from './MapDisplay';
import useEntryList from '../hooks/useEntryList';

interface EntryListProps {
  date: string;
  isOneDay: boolean;
  onShowEdit: (entry: EntryType) => void;
}

const EntryList = ({ date, isOneDay, onShowEdit }: EntryListProps, ref: ForwardedRef<HTMLElement>) => {
  const { isLoading, error, isEditing, entries, showEdit } = useEntryList(date, isOneDay, onShowEdit, ref);

  if (isLoading) return <div className="alert alert-info">Loading posts...</div>;
  if (error) return <div className="alert alert-danger">An error occurred: {(error as RequestError).message}</div>;

  return (
    <section className={`entriesList ${isEditing ? 'noshow' : 'container'}`}>
      {entries?.map((entry: EntryType) => (
        <article key={entry.id} id={`li${entry.id}`} className="entry-item">
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

          <div className="markdownDisplay mb-3">
            <MarkdownDisplay source={entry.content} />
          </div>

          {isOneDay && entry.locations && entry.locations.length > 0 && (
            <MapDisplay locations={entry?.locations as any} />
          )}
        </article>
      ))}
    </section>
  );
};

export default forwardRef(EntryList);
