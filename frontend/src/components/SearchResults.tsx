import { useState } from 'react';
import useSearchResults from '../hooks/useSearchResults';
import SearchRow from '../components/SearchRow';

const SearchResults = ({ params, setEditEntry }: { params: any, setEditEntry: (entry: EntryType) => void }) => {
  const { posts, isLoading, error, startDate, endDate  } = useSearchResults(params);
  const [isEditing, setIsEditing] = useState(false);

  const showEditForm = (entry: EntryType) => {
    setIsEditing(true);
    setEditEntry(entry);
  }

  if (isLoading) return <div>Load ..</div>;
  if (error) return <div>An error occurred: {error?.message}</div>;

  return (
    <>
      <div className="search-param-description">
        {params !== null
          ? (
            <>
              {` Date: ${startDate || 'Beginning'}  to ${endDate || 'Now'}, Limit: ${params.resultsLimit}. Found ${posts.length}`}
            </>
          ) : (
            <>No Search Params</>
          )}
      </div>

      {posts?.length ? (
        <ul className={!isEditing ? 'entriesList' : 'noshow'}>
          {posts.map((entry: EntryType) => (
            <SearchRow entry={entry} searchText={params.text}
              showEditForm={showEditForm} key={entry.id}
            />
          ))}
        </ul>
      ) : (
        <h2>No Entries Found</h2>
      )}
    </>
  );
};

export default SearchResults;
