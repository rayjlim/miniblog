import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns';

import DateNav from '../components/DateNav';
import AddEditForm from '../components/AddEditForm';
import EntryList from '../components/EntryList';
import MovieList from '../components/MovieList';
import Inspiration from '../components/Inspiration';
import WeightInfo from '../components/WeightInfo';

import Header from '../components/Header';
import Footer from '../components/Footer';

import {
  FULL_DATE_FORMAT,
  REST_ENDPOINT,
  STORAGE_KEY,
  AUTH_HEADER,
} from '../constants';

import './OneDay.css';

const ONEDAY = 0;
const SAMEDAY = 1;

const OneDay = ({ pageMode }: { pageMode: number } = { pageMode: 0 }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    entries: [],
    pageDate: '',
    scrollToLast: 0,
  });
  const [editEntry, setEditEntry] = useState < EntryType | null > (null);

  function loadDay(loadParams: any) {
    console.log(`loadDay : ${loadParams.pageDate} pagemode: ${pageMode}`);

    if (!loadParams.pageDate) {
      return;
    }
    let endPointURL = '';
    switch (pageMode) {
      case SAMEDAY: {
        endPointURL = `${REST_ENDPOINT}/api/sameDayEntries/?day=${loadParams.pageDate}`;
        break;
      }
      default: {
        endPointURL = `${REST_ENDPOINT}/api/posts/?date=${loadParams.pageDate}`;
        break;
      }
    }
    setEditEntry(null);
    (async () => {
      const token = window.localStorage.getItem(STORAGE_KEY) || '';
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set('Content-Type', 'application/json');
      requestHeaders.set(AUTH_HEADER, token);
      try {
        const response = await fetch(endPointURL, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: requestHeaders,
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
        });
        if (response.ok) {
          const { entries } = await response.json();
          console.log('response.data :>> ', entries);
          console.log('entries :>> ', entries);
          console.log('state :>> ', state);
          setState({
            ...state,
            ...loadParams,
            entries,
            auth: true,
          });
          console.log('state.scrollToLast :>> ', loadParams.scrollToLast);
        } else {
          console.error('response.status :', response.status);
          toast.error(`loading error : ${response.status}`);
        }
      } catch (err) {
        console.error(err);
        toast.error(`loading error : ${err}`);
      }
    })();
  }

  function updateDate(date: string) {
    loadDay({ ...state, pageDate: date });
  }

  function resetAddEdit(msg: string) {
    console.log('resetAddEdit');
    if (msg !== '') {
      toast(msg);
    }
    loadDay({ ...state });
  }

  function checkKeyPressed(e: any) {
    console.log(`OneDay: handle key presss ${e.key}`);

    // Note: getting element by id is a hack because
    // the content value is taken from the init value
    if (e.altKey && e.key === ',') {
      console.log('alt comma keybinding');
      document.getElementById('prevBtn')?.click();
    } else if (e.altKey && e.key === '.') {
      console.log('alt period keybinding');
      document.getElementById('nextBtn')?.click();
    } else if (e.altKey && e.key === 'a') {
      console.log('alt period keybinding');
      document.getElementById('addFormBtn')?.click();
    }
  }

  useEffect(() => {
    async function ueFunc() {
      const token = window.localStorage.getItem(STORAGE_KEY);
      if (!token) {
        navigate('/login');
      }

      console.log('OndeDay: useEffect');
      const loc = `${window.location}`;
      const param = loc.substring(loc.indexOf('?'));
      console.log('param :', param);
      const urlParams = new URLSearchParams(param);

      const pageDate = urlParams.has('date')
        ? urlParams.get('date')
        : format(new Date(), FULL_DATE_FORMAT);

      setState({ ...state, pageDate: pageDate || '' });

      const localDate = format(new Date(), FULL_DATE_FORMAT);

      console.log('setting pageDate :>> ', localDate);
      loadDay({ pageDate });
    }
    ueFunc();
    document.addEventListener('keydown', checkKeyPressed);

    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, [pageMode]);

  const headerLinks = {
    search: true,
    oneday: pageMode !== ONEDAY,
    sameday: pageMode === ONEDAY,
  };
  return (
    <>
      <ToastContainer />
      <Header links={headerLinks} />

      {pageMode === ONEDAY && <h1>One Day</h1>}
      {pageMode === SAMEDAY && <h1>Same Day</h1>}

      <DateNav updateDate={updateDate} date={state.pageDate} />

      <section className="container">
        {pageMode === ONEDAY && <WeightInfo date={state.pageDate} />}
        <AddEditForm
          date={state.pageDate}
          entry={editEntry}
          onSuccess={resetAddEdit}
        />
      </section>

      <EntryList entries={state.entries} showEditForm={setEditEntry} />

      {pageMode === ONEDAY && <MovieList date={state.pageDate} />}
      {pageMode === ONEDAY && <Inspiration />}
      <Footer />
    </>
  );
};

export default OneDay;
