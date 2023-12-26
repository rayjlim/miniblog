import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      <ToastContainer />
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

        {searchParams && (<SearchResults params={searchParams} setEditEntry={setEditEntry} ref={childRef} />)}
      </section>
      <Footer />
    </>
  );
};

export default Search;
