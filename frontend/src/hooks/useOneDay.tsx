import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FULL_DATE_FORMAT, STORAGE_KEY } from '../constants';

const useOneDay = () => {
  const navigate = useNavigate();
  const routeParams = useParams();

  const [editEntry, setEditEntry] = useState<EntryType | null>(null);
  const [pageDate, setPageDate] = useState<string>(format(new Date(), FULL_DATE_FORMAT));
  const isMounted = useRef<boolean>(false);
  const childRef = useRef();

  function checkKeyPressed(e: KeyboardEvent) {
    if (e.altKey && e.key === 'f') {
      navigate('/search');
      e.preventDefault();
    }
  }

  function resetEntryForm(msg: string, entry: EntryType) {
    msg && toast(msg);

    setEditEntry(null);
    const subComp = childRef.current as any;
    subComp?.resetView(entry);
  }

  useEffect(() => {
    async function ueFunc() {
      const token = window.localStorage.getItem(STORAGE_KEY);
      if (!token) {
        navigate('/login');
      }

      console.log('OndeDay: useEffect' + pageDate);
      if (!isMounted.current) {
        const loc = `${window.location}`;
        const param = loc.substring(loc.indexOf('?'));
        console.log('param :', param);
        const urlParams = new URLSearchParams(param);
        console.log(`routeParams: ${JSON.stringify(routeParams)}`);
        const pageDateParam = urlParams.get('date') || routeParams?.date || format(new Date(), FULL_DATE_FORMAT);

        setPageDate(pageDateParam);
        isMounted.current = true;
      }
    }
    ueFunc();
    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, []);

  return { editEntry, setEditEntry, pageDate, setPageDate, resetEntryForm, childRef }
}

export default useOneDay;
