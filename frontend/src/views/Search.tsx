import { RefObject } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import EditForm from '../components/EditForm';
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';
import useSearch from '../hooks/useSearch';

const Search = () => {
  const {
    searchParams,
    editEntry,
    setEditEntry,
    setSearchParams,
    resetEntryForm,
    childRef
  } = useSearch();

  const defaultParams = { resultsLimit: 50 };

  return (
    <div className="search-view">
      <Header
        links={{
          search: false,
          oneday: true,
          sameday: true
        }}
      />

      <main className="container py-4">
        <h1 className="mb-4">Find Entries</h1>

        <SearchForm
          params={searchParams ?? defaultParams}
          setSearchParams={setSearchParams}
        />

        {editEntry && (
          <EditForm
            entry={editEntry}
            onSuccess={resetEntryForm}
          />
        )}

        <SearchResults
          params={searchParams || defaultParams}
          setEditEntry={setEditEntry}
          ref={childRef as unknown as RefObject<HTMLElement>}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Search;
