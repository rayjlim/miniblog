import { createRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import { STORAGE_KEY } from '../constants';

const useSearch = () => {
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
      toast(msg);
    }
    let targetId = editEntry?.id || 0;

    setEditEntry(null);

    if (newEntry.content === 'DELETE') {
      const revisedPosts = posts.filter(curr => curr.id !== newEntry.id);
      setPosts(revisedPosts);
    }
    else {
      const revisedPosts = posts.map(curr => (curr.id === newEntry.id) ? newEntry : curr);
      setPosts(revisedPosts);
    }

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

  return { setPosts, setEditEntry, setSearchParams, resetEntryForm, handleClick, searchParams, posts, editEntry, refs };
};
export default useSearch;
