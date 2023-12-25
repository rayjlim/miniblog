import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../Types';

import EditForm from '../components/EditForm';
// import SearchForm from '../components/SearchForm';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchResults from '../components/SearchResults';
import useSearch from '../hooks/useSearch';

import './Search.css';

const Search = () => {
  const { editEntry, setEditEntry, setSearchParams, resetEntryForm, childRef } = useSearch();

  const searchParams = {
    text: '',
    resultsLimit: 50,
    startDate: '',
    endDate: '',
  };

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
        {/* <SearchForm setSearchParams={setSearchParams as any} /> */}
        {editEntry !== null && (
          <EditForm entry={editEntry as any} onSuccess={resetEntryForm} />
        )}

        <SearchResults params={searchParams} setEditEntry={setEditEntry} ref={childRef} />
      </section>
      <Footer />
    </>
  );
};

export default Search;


