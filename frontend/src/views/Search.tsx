import { RefObject } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import EditForm from '../components/EditForm';
import SearchForm from '../components/SearchForm';
import SearchResults from '../components/SearchResults';
import useSearch from '../hooks/useSearch';

import './Search.css';

const Search = () => {
  const { searchParams, editEntry, setEditEntry, setSearchParams, resetEntryForm, childRef } = useSearch();
  return (
    <>
      <Header links={{
        search: false,
        oneday: true,
        sameday: true
      }} />
      <section className="container">
        <h1>Find Entries</h1>
        <SearchForm params={searchParams ?? {}} setSearchParams={setSearchParams} />
        {editEntry !== null && (
          <EditForm entry={editEntry} onSuccess={resetEntryForm} />
        )}

        <SearchResults
          params={searchParams || { resultsLimit: 10 }}
          setEditEntry={setEditEntry}
          ref={childRef as unknown as RefObject<HTMLElement>}
        />

      </section>
      <Footer />
    </>
  );
};

export default Search;
