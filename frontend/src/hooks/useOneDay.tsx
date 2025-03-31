import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { SAMEDAY, FULL_DATE_FORMAT, STORAGE_KEY } from '../constants';
import { EntryType } from '../Types';

interface KeyboardShortcuts {
  [key: string]: () => void;
}

interface UseOneDayReturn {
  editEntry: EntryType | null;
  setEditEntry: (entry: EntryType | null) => void;
  pageDate: string;
  setPageDate: (date: string) => void;
  resetEntryForm: (msg: string, entry: EntryType) => void;
  childRef: React.MutableRefObject<any>;
}

const useOneDay = (pageMode: number): UseOneDayReturn => {
  const navigate = useNavigate();
  const routeParams = useParams();
  const [editEntry, setEditEntry] = useState<EntryType | null>(null);
  const [pageDate, setPageDate] = useState<string>(format(new Date(), FULL_DATE_FORMAT));
  const isMounted = useRef<boolean>(false);
  const childRef = useRef<any>();

  const scrollToElement = useCallback((elementId: string) => {
    const target = document.getElementById(elementId);
    target?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const keyboardShortcuts: KeyboardShortcuts = {
    'f': () => navigate('/search'),
    't': () => scrollToElement('top'),
    'b': () => scrollToElement('bottom'),
    'o': () => navigate(pageMode === SAMEDAY ? '/oneday' : '/sameday'),
  };

  const checkKeyPressed = useCallback((e: KeyboardEvent) => {
    if (e.altKey && keyboardShortcuts[e.key]) {
      e.preventDefault();
      keyboardShortcuts[e.key]();
    }
  }, [navigate, pageMode]);

  const resetEntryForm = useCallback((msg: string, entry: EntryType) => {
    if (msg) toast(msg);
    setEditEntry(null);
    const subComp = childRef.current;
    subComp?.resetView(entry);
  }, []);

  const initializePageDate = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('date') || 
           routeParams?.date || 
           format(new Date(), FULL_DATE_FORMAT);
  }, [routeParams]);

  useEffect(() => {
    const token = window.localStorage.getItem(STORAGE_KEY);
    if (!token) {
      navigate('/login');
      return;
    }

    if (!isMounted.current) {
      setPageDate(initializePageDate());
      isMounted.current = true;
    }

    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, [pageMode, navigate, checkKeyPressed, initializePageDate]);

  return {
    editEntry,
    setEditEntry,
    pageDate,
    setPageDate,
    resetEntryForm,
    childRef
  };
};

export default useOneDay;
