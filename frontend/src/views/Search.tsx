import { useState, useEffect } from 'react';
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
  const [searchParams, setSearchParams] = useState<{
    startDate: string,
    endDate: string,
    resultsLimit?: number
    searchParam: string,
    postsCount: number
  }>({
    startDate: '',
    endDate: '',
    searchParam: '',
    postsCount: 0
  });

  function resetEntryForm(msg: string) {
    if (msg) {
      toast('Edit Done');
    }
    setEditEntry(null);
    // TODO: call reload Entries in Search Form to show changes
  }

  useEffect(() => {
    const token = window.localStorage.getItem(STORAGE_KEY);
    if (!token) {
      navigate('/login');
    }
  });

  return (
    <>
      <ToastContainer />
      <Header links={{
        search: false,
        oneday: true,
        sameday: true
      }} />

      <h1>Text Searchs</h1>

      <section className="container">
        {/*
        SearchForm will be in charge of getting entries
        the new prop getPosts will trigger a reload

        */}
        <SearchForm setPosts={setPosts} setSearchParams={setSearchParams as any} />
        <SearchAggregate searchParams={searchParams} />
        {editEntry !== null && (
          <section className="container">
            <EditForm entry={editEntry as any} onSuccess={msg => resetEntryForm(msg)} />
          </section>
        )}

        {editEntry === null && (
          posts.length
            ? (
              <ul className="entriesList">
                {posts.map((entry: EntryType) => (
                  <SearchRow entry={entry} searchText={searchParams.searchParam}
                    showEditForm={setEditEntry} key={entry.id} />
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
