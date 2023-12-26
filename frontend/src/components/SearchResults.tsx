import { forwardRef, useRef, useState } from 'react';

import useSearchResults from '../hooks/useSearchResults';
import SearchRow from '../components/SearchRow';

const SearchResults = forwardRef(({ params, setEditEntry }: { params: SearchParamsType, setEditEntry: (entry: EntryType) => void }, ref: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const editEntryId = useRef(0);
  const { entries, startDate, endDate, isLoading, error } = useSearchResults(params, editEntryId, setIsEditing, ref);

  const showEditForm = (entry: EntryType) => {
    console.log('showEditForm', entry.id);
    setIsEditing(true);
    editEntryId.current = entry.id;
    setEditEntry(entry);
  }

  if (isLoading) return <div>Load ..</div>;
  if (error)  return <div>An error occurred: {(error as RequestError).message}</div>;

  return (
    <>
      <div className="search-param-description">
        {params !== null
          ? (
            <>
              {` Date: ${startDate || 'Beginning'}  to ${endDate || 'Now'}, Limit: ${params.resultsLimit}. Found ${entries.length}`}
            </>
          ) : (
            <>No Search Params</>
          )}
      </div>

      {entries?.length ? (
        <ul className={!isEditing ? 'entriesList' : 'noshow'}>
          {entries.map((entry: EntryType) => (
            <SearchRow entry={entry} searchText={params.text || ''}
              showEditForm={showEditForm} key={entry.id}
            />
          ))}
        </ul>
      ) : (
        <h2>No Entries Found</h2>
      )}
    </>
  );
});

export default SearchResults;
