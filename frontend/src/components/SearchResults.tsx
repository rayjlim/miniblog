import { forwardRef, useImperativeHandle, useRef, useState, MutableRefObject } from 'react';
import { useQueryClient } from 'react-query';
import useSearchResults from '../hooks/useSearchResults';
import SearchRow from '../components/SearchRow';

const SearchResults = ({ params, setEditEntry }: { params: any, setEditEntry: (entry: EntryType) => void }, ref: MutableRefObject<void>) => {
  const { data, posts, startDate, endDate, isLoading, error } = useSearchResults(params);
  const [isEditing, setIsEditing] = useState(false);
  const internalState = useRef();
  const editEntryId = useRef(0);
  const queryClient = useQueryClient();

  const showEditForm = (entry: EntryType) => {
    console.log('showEditForm', entry.id);
    setIsEditing(true);
    editEntryId.current = entry.id;
    setEditEntry(entry);
  }

  // Expose a custom API to the parent component
  useImperativeHandle(ref, () => ({
    resetView: (entry: EntryType) => {

      if (entry.content === 'DELETE') {
        const revised = posts.filter((curr: EntryType) => curr.id !== entry.id);
        queryClient.setQueryData(["search", params], {...data, entries: revised});
      }
      else {
        const revised = posts.map((curr: EntryType) => (curr.id === entry.id) ? entry : curr);
        queryClient.setQueryData(["search", params], {...data, entries: revised});
      }

      console.log('resetView:', internalState.current, entry);
      setIsEditing(false);

      setTimeout(() => {
        console.log(editEntryId.current);
        const target = document.getElementById(`li${editEntryId.current}`);
        target?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 0);
    }
  }), [internalState]);

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

export default forwardRef(SearchResults);
