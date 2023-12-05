import { createRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { STORAGE_KEY } from '../constants';
import '../Types';

import EditForm from '../components/EditForm';
import SearchForm from '../components/SearchForm';
import SearchRow from '../components/SearchRow';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchAggregate from '../components/SearchAggregate';

import './Search.css';

const Search = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<EntryType[]>([]);
  const [editEntry, setEditEntry] = useState<EntryType | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParamsType>({
    startDate: '',
    endDate: '',
    searchParam: '',
    postsCount: 0
  });

  const handleClick = (id: number) => {
    console.log(refs);
    // @ts-ignore
    refs[id].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  };

  function resetEntryForm(msg: string, newEntry: EntryType) {
    if (msg) {
      toast('Edit Done');
    }
    let targetId = editEntry?.id || 0;

    setEditEntry(null);

    // TODO: if delete action, remove entry from posts
    const revisedPosts = posts.map(curr => {
      return (curr.id === newEntry.id) ? newEntry : curr;
    });
    setPosts(revisedPosts);

    setTimeout(() => {
      // handleClick(targetId); // Not scrolling to location
      const btn = document.getElementById(`btn${targetId}`);
      btn?.click();
    }, 100);
  }

  function checkKeyPressed(e: KeyboardEvent) {
    if (e.altKey && e.key === 'o') {
      navigate('/oneday');
      e.preventDefault();
    }
  }

  useEffect(() => {
    const token = window.localStorage.getItem(STORAGE_KEY);
    if (!token) {
      navigate('/login');
    }
    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, []);

  const refs = posts.reduce((acc, value) => {
    // @ts-ignore
    acc[value.id] = createRef();
    return acc;
  }, {});

  return (
    <>
      <ToastContainer />
      <Header links={{
        search: false,
        oneday: true,
        sameday: true
      }} />

      <h1>Find Entries</h1>
      <section className="container">
        <SearchForm setPosts={setPosts} setSearchParams={setSearchParams as any} />
        <SearchAggregate searchParams={searchParams} />

        {editEntry !== null && (
          <section className="container">
            <EditForm entry={editEntry as any} onSuccess={resetEntryForm} />
          </section>
        )}
        <ul className="noshow">
          {/* Need buttons */}
          {posts.map(item => (
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
