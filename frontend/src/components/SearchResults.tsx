import { forwardRef, useRef, useState, ForwardedRef } from 'react';
import { EntryType, SearchParamsType, RequestError } from '../Types';
import useSearchResults from '../hooks/useSearchResults';
import SearchRow from '../components/SearchRow';

interface SearchResultsProps {
  params: SearchParamsType;
  setEditEntry: (entry: EntryType) => void;
}

const SearchResults = forwardRef(({ params, setEditEntry }: SearchResultsProps, ref: ForwardedRef<HTMLElement>) => {
  const [isEditing, setIsEditing] = useState(false);
  const editEntryId = useRef<number>(0);

  const { entries, startDate, endDate, isLoading, error } = useSearchResults({
    params,
    editEntryId,
    setIsEditing,
    ref
  });

  const showEditForm = (entry: EntryType) => {
    setIsEditing(true);
    editEntryId.current = entry.id;
    setEditEntry(entry);
  };

  if (isLoading) return <div className="alert alert-info">Loading...</div>;
  if (error) return <div className="alert alert-danger">An error occurred: {(error as RequestError).message}</div>;

  const renderSearchParams = () => (
    <div className="search-param-description mb-`">
      {params ? (
        <span>
          Date: {startDate || 'Beginning'} to {endDate || 'Now'},
          Limit: {params.resultsLimit}.
          Found: {entries?.length || 0}
        </span>
      ) : (
        <span>No Search Parameters</span>
      )}
    </div>
  );

  const renderResults = () => {
    if (!entries?.length) {
      return <h2 className="text-center mt-4">No Entries Found</h2>;
    }

    return (
      <section className={`entriesList ${isEditing ? 'noshow' : 'container'}`}>
        {entries.map((entry: EntryType) => (
          <SearchRow
            key={entry.id}
            entry={entry}
            searchText={params.text || ''}
            showEditForm={showEditForm}
          />
        ))}
      </section>
    );
  };

  return (
    <div className="search-results">
      {renderSearchParams()}
      {renderResults()}
    </div>
  );
});

SearchResults.displayName = 'SearchResults';

export default SearchResults;
