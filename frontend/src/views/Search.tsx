import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../Types';

import EditForm from '../components/EditForm';
import SearchForm from '../components/SearchForm';
import SearchRow from '../components/SearchRow';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchAggregate from '../components/SearchAggregate';
import useSearch from '../hooks/useSearch';

import './Search.css';

const Search = () => {
  const { setPosts, setEditEntry, setSearchParams, resetEntryForm, handleClick,
    searchParams, posts, editEntry, refs } = useSearch();

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
        <SearchForm setPosts={setPosts} setSearchParams={setSearchParams as any} />
        <SearchAggregate searchParams={searchParams} />

        {editEntry !== null && (
          <section className="container">
            <EditForm entry={editEntry as any} onSuccess={resetEntryForm} />
          </section>
        )}
        <ul className="noshow">
          {/* Need buttons */}
          {posts.map((item: EntryType) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleClick(item.id)}
                id={`btn${item.id}`}
              >
                Scroll Item {item.id} Into View
              </button>
            </li>
          ))}
        </ul>
        {(
          posts.length
            ? (
              <ul className={editEntry === null ? 'entriesList' : 'noshow'}>
                {posts.map((entry: EntryType) => (
                  <SearchRow entry={entry} searchText={searchParams.searchParam}
                    showEditForm={setEditEntry} key={entry.id}
                    refs={refs} />
                ))}
              </ul>
            )
            : (
              <h2>No Entries Found</h2>
            ))}
      </section>

      <Footer />
    </>
  );
};

export default Search;
