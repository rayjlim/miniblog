import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';
import { STORAGE_KEY } from '../constants';

const useSearch = () => {
  const navigate = useNavigate();

  const [editEntry, setEditEntry] = useState<EntryType | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParamsType | null>(null);
  const childRef = useRef();

  function resetEntryForm(msg: string, entry: EntryType) {
    msg && toast(msg);

    setEditEntry(null);
    const subComp = childRef.current as any;
    subComp?.resetView(entry);
  }

  function checkKeyPressed(e: KeyboardEvent) {
    if (e.altKey && e.key === 'o') {
      navigate('/oneday');
      e.preventDefault();
    } else if (e.altKey && e.key === 't') {
      e.preventDefault();
      const target = document.getElementById('top');
      target?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else if (e.altKey && e.key === 'b') {
      e.preventDefault();
      const target = document.getElementById('bottom');
      target?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
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

  return { searchParams, editEntry, setEditEntry, setSearchParams, resetEntryForm, childRef };
};
export default useSearch;
