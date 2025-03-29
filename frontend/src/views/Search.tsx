import { RefObject, memo, useMemo } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import EditForm from '../components/EditForm';
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';
import useSearch from '../hooks/useSearch';
import './search.css';

interface SearchParams {
  resultsLimit: number;
  [key: string]: any;
}

const DEFAULT_PARAMS: SearchParams = {
  resultsLimit: 50
};

const Search = memo(() => {
  const {
    searchParams,
    editEntry,
    setEditEntry,
    setSearchParams,
    resetEntryForm,
    childRef
  } = useSearch();

  const headerLinks = useMemo(() => ({
    search: false,
    oneday: true,
    sameday: true
  }), []);

  const currentParams = searchParams ?? DEFAULT_PARAMS;

  return (
    <div className="search-view min-h-screen">
      <Header links={headerLinks} />
      <main className="container py-4 flex-grow" role="main">
        <h1 className="mb-1 text-2xl font-bold" id="search-title">
          Search
        </h1>

        <div className="space-y-6">
          <section aria-labelledby="search-form" >
            <SearchForm
              params={currentParams}
              setSearchParams={setSearchParams}
            />
          </section>

          {editEntry && (
            <section aria-label="Edit Entry Form">
              <EditForm
                entry={editEntry}
                onSuccess={resetEntryForm}
              />
            </section>
          )}

          <section aria-label="Search Results">
            <SearchResults
              params={currentParams}
              setEditEntry={setEditEntry}
              ref={childRef as unknown as RefObject<HTMLElement>}
            />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
});

export default Search;
