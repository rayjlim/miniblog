import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { format, parse, add } from 'date-fns';

import AddForm from '../components/AddForm';
import EditForm from '../components/EditForm';
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
  AUTH_HEADER
} from '../constants';

import './OneDay.css';

const CLOSED = 0;
const ADD = 1;
const EDIT = 2;

const ONEDAY = 0;
const SAMEDAY = 1;

const OneDay = ({pageMode}: {pageMode: number} = {pageMode: 0}) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    entries: [],
    pageDate: '',
    formEntry: {id: '0', content: '', date: ''},
    autohide: 'true',
    formMode: CLOSED,
    scrollToLast: null,
  });

  const dateInput = useRef<HTMLInputElement>(null);

  function loadDay(loadParams: any) {
    console.log(
      `loadDay : ${loadParams.pageDate} pagemode: ${pageMode}`
    );

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
            auth:
            true,
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

  /**
   * Handle change in day Previous | Next
   * @function
   * @param  {Object} e Event of Button click
   */
  function handleButtonDirection(e: any) {
    let localDate = parse(state.pageDate, FULL_DATE_FORMAT, new Date());
    if (e.target.value === 'today') {
      localDate = new Date();
    } else {
      localDate = parse(state.pageDate, FULL_DATE_FORMAT, new Date());
    }

    const newDate = add(localDate, { days: e.target.value });
    let refInput = dateInput.current || {value: ''};
    refInput.value = format(newDate, FULL_DATE_FORMAT);
    loadDay({
      ...state,
      pageDate: format(newDate, FULL_DATE_FORMAT),
      formMode: CLOSED,
    });
  }

  function resetEntryForm(msg = '') {
    if (msg !== '') {
      toast(msg);
    }
    loadDay({ ...state, formMode: CLOSED });
  }

  function showAddForm() {
    console.log('showAddForm#state.date :', state.pageDate);
    setState({ ...state, formMode: ADD });
  }

  function showEditForm(entry: any) {
    console.log('id :', entry.id);

    setState({
      ...state,
      formMode: EDIT,
      formEntry: entry,
      scrollToLast: entry.id,
    });
  }

  function updateDate(e: any) {
    const dateRegex = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
    if (e.target.value.match(dateRegex)) {
      loadDay({ ...state, pageDate: e.target.value });
    }
  }

  function showAddEditForm(mode: number) {
    // console.log('formmode :', mode);
    let returnValue = null;
    if (!mode || mode === CLOSED) {
      returnValue = (
        <button
          onClick={() => showAddForm()}
          className="btn btn-default"
          id="addFormBtn"
          type="button"
        >
          Show Add Form
        </button>
      );
    } else if (mode === ADD) {
      returnValue = (
        <AddForm date={state.pageDate} onSuccess={msg => resetEntryForm(msg)} content="" />
      );
    } else if (mode === EDIT) {
      returnValue = (
        <EditForm entry={state.formEntry} onSuccess={msg => resetEntryForm(msg)} />
      );
    }
    return returnValue;
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
    async function ueFunc(){
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
    sameday: pageMode === ONEDAY
  };
  return (
    <>
      <ToastContainer />
      <Header links={headerLinks}/>

      {pageMode === ONEDAY && <h1>One Day</h1>}
      {pageMode === SAMEDAY && <h1>Same Day</h1>}

      <div className="grid-3mw container">
        <button
          onClick={e => handleButtonDirection(e)}
          className="btn btn-info btn-lrg"
          value="-1"
          id="prevBtn"
          type="button"
          title="alt + comma"
        >
          <i className="fa fa-chevron-left"/>
          Prev
        </button>
        <div>
          <input
            ref={dateInput}
            type="text"
            className="form-control"
            id="formDpInput"
            defaultValue={state.pageDate}
            onChange={e => updateDate(e)}
          />
        </div>
        <button
          onClick={e => handleButtonDirection(e)}
          className="btn btn-success btn-lrg"
          value="1"
          id="nextBtn"
          type="button"
          title="alt + period"
        >
          Next
          <i className="fa fa-chevron-right" />
        </button>
        <button
          onClick={e => handleButtonDirection(e)}
          className="btn btn-warning btn-lrg"
          value="today"
          type="button"
        >
          Today
        </button>
      </div>

      <section className="container">
        {pageMode === ONEDAY
          && <WeightInfo date={state.pageDate}/>}
        {showAddEditForm(state.formMode)}
      </section>
      <EntryList entries={state.entries} showEditForm={showEditForm} />

      {/* movies */}
      {pageMode === ONEDAY
        && <MovieList date={state.pageDate}/>}
      {pageMode === ONEDAY
        && <Inspiration/>}
      <Footer />
    </>
  );
};

export default OneDay;
