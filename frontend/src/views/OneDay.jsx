import React, { useState, useRef, useEffect } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { format, parse, add } from 'date-fns';
import AddForm from '../components/AddForm';
import EditForm from '../components/EditForm';
import MovieWindow from '../components/MovieWindow';
import MarkdownDisplay from '../components/MarkdownDisplay';
import {
  FULL_DATE_FORMAT,
  INSPIRATION_API,
  MOVIES_API,
  REST_ENDPOINT,
  STORAGE_KEY,
  TRACKS_API,
  QUESTION_API,
} from '../constants';

import pkg from '../../package.json';

import './OneDay.css';

const CLOSED = 0;
const ADD = 1;
const EDIT = 2;

const ONEDAY = 0;
const SAMEDAY = 1;

async function xhrCall(url, apiDescription) {
  console.log(`xhrCall ${url}`);
  try {
    const apiResponse = await fetch(url, {});
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      return data;
    }
    throw new Error(apiResponse.status);
  } catch (err) {
    console.error(err);
    toast(`get ${apiDescription} error : ${err}`);
  }
  return false;
}

/**
 * Component to Display of One Day style
 *
 * @component
 * @example
 * <Route path="/oneday" component={OneDay} />
 */
const OneDay = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    entries: [],
    pageDate: null,
    searchParam: '',
    formEntry: {},
    autohide: 'true',
    pageMode: ONEDAY,
    formMode: CLOSED,
    scrollToLast: null,
    refForm: React.createRef(),
    refs: [],
  });
  const [inspiration, setInspiration] = useState(null);
  const [weight, setWeight] = useState(null);
  const [movies, setMovies] = useState([]);

  const dateInput = useRef();

  async function getInspiration() {
    const quoteApi = INSPIRATION_API;
    const data = await xhrCall(quoteApi, 'inspiration');
    console.log('data.header :>> ', data.header);
    setInspiration(`Inspire: ${data.message} : ${data.author}`);
  }

  async function getWeight(date) {
    const weightApi = `${TRACKS_API}?start=${date}&end=${date}`;
    const data = await xhrCall(weightApi, 'weight');
    if (data && data.data && data.data[0] && data.data[0].count) {
      setWeight(data.data[0]);
    } else {
      setWeight('?');
    }
  }

  async function getMovies(date) {
    const weightApi = `${MOVIES_API}&advanced_search=true&dt_viewed=${date}`;
    const data = await xhrCall(weightApi, 'movie');
    if (data && data.movies) {
      setMovies(data.movies);
    } else {
      setMovies([]);
    }
  }

  async function getPrompt() {
    const data = await xhrCall(QUESTION_API, 'prompt');
    setInspiration(`Question: ${data.prompt} : ${data.category}`);
  }

  function loadDay(loadParams) {
    console.log(
      'loadDay :',
      loadParams.pageDate,
      'pagemode',
      loadParams.pageMode,
    );

    if (!loadParams.pageDate) {
      return;
    }
    let endPointURL = '';
    switch (loadParams.pageMode) {
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
      const token = window.localStorage.getItem(STORAGE_KEY);
      try {
        const response = await fetch(endPointURL, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Token': token,
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
        });
        if (response.ok) {
          const { entries } = await response.json();
          console.log('response.data :>> ', entries);
          const refs = entries.reduce((acc, value) => {
            acc[value.id] = React.createRef();
            return acc;
          }, {});
          console.log('entries :>> ', entries);
          console.log('state :>> ', state);
          setState({
            ...state,
            ...loadParams,
            entries,
            auth:
            true,
            refs,
          });
          console.log('state.scrollToLast :>> ', loadParams.scrollToLast);
        } else {
          console.error('response.status :', response.status);
          toast.error(`loading error : ${response.status}`);
        }

        // ---- Call external APIS
        if (inspiration === null) {
          await getInspiration();
        }
        if (state.pageMode === ONEDAY) {
          await getWeight(loadParams.pageDate);
          await getMovies(loadParams.pageDate);
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
  function handleButtonDirection(e) {
    let localDate = parse(state.pageDate, FULL_DATE_FORMAT, new Date());
    if (e.target.value === 'today') {
      localDate = new Date();
    } else {
      localDate = parse(state.pageDate, FULL_DATE_FORMAT, new Date());
    }

    const newDate = add(localDate, { days: e.target.value });
    dateInput.current.value = format(newDate, FULL_DATE_FORMAT);
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

  function showEditForm(entry) {
    console.log('id :', entry.id);

    setState({
      ...state,
      formMode: EDIT,
      formEntry: entry,
      scrollToLast: entry.id,
    });
    state.refForm.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function updateDate(e) {
    const dateRegex = /^\d{4}[./-]\d{2}[./-]\d{2}$/;
    if (e.target.value.match(dateRegex)) {
      loadDay({ ...state, pageDate: e.target.value });
    }
  }

  function changePageMode(pageMode) {
    console.log('new pageMode :>> ', pageMode);
    loadDay({ ...state, pageMode });
  }

  function showAddEditForm(mode) {
    // console.log('formmode :', mode);
    let returnValue = null;
    if (!mode || mode === CLOSED) {
      returnValue = (
        <button
          onClick={e => showAddForm(e)}
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

  const doLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    navigate('/login');
  };

  function checkKeyPressed(e) {
    console.log(`OneDay: handle key presss ${e.key}`);

    // Note: getting element by id is a hack because
    // the content value is taken from the init value
    if (e.altKey && e.key === ',') {
      console.log('alt comma keybinding');
      document.getElementById('prevBtn').click();
    } else if (e.altKey && e.key === '.') {
      console.log('alt period keybinding');
      document.getElementById('nextBtn').click();
    } else if (e.altKey && e.key === 'a') {
      console.log('alt period keybinding');
      document.getElementById('addFormBtn').click();
    }
  }

  useEffect(() => {
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

    setState({ ...state, pageDate });

    const pageMode = urlParams.has('pageMode')
      ? parseInt(urlParams.get('pageMode'), 10)
      : ONEDAY;

    console.log('urlParams.has(pageMode) :', urlParams.has('pageMode'));
    const localDate = format(new Date(), FULL_DATE_FORMAT);

    console.log('setting pageDate :>> ', localDate);
    loadDay({ pageDate, pageMode });

    document.addEventListener('keydown', checkKeyPressed);
    return () => document.removeEventListener('keydown', checkKeyPressed);
  }, []);

  function copyToClipboard(content) {
    console.log(`clipboard: ${content}`);
    navigator.clipboard.writeText(content);
  }

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <RouterNavLink to="/search">
          <i className="fa fa-search" />
          {' '}
          <span className="nav-text">Search</span>
        </RouterNavLink>
        {state.pageMode === ONEDAY ? (
          <button onClick={() => changePageMode(SAMEDAY)} type="button">
            <i className="fa fa-calendar-check" />
            {' '}
            <span className="nav-text">Same Day</span>
          </button>
        ) : (
          <button onClick={() => changePageMode(ONEDAY)} type="button">
            <i className="fa fa-home" />
            <span>Home</span>
          </button>
        )}
        <RouterNavLink to="/search">
          <i className="fa fa-search" />
          {' '}
          <span className="nav-text">Search</span>
        </RouterNavLink>
      </nav>
      {state.pageMode === ONEDAY && <h1>One Day</h1>}
      {state.pageMode === SAMEDAY && <h1>Same Day</h1>}

      <div className="grid-3mw container">
        <button
          onClick={e => handleButtonDirection(e)}
          className="btn btn-info btn-lrg"
          value="-1"
          id="prevBtn"
          type="button"
        >
          <i className="fa fa-chevron-left" />
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

      <section className="container" ref={state.refForm}>
        {state.pageMode === ONEDAY
          && weight
          && (
          <span className="weight">
            Weight :
            {weight.count}
            {weight.comment && weight.comment !== '' && <span title={weight.comment}>...</span>}
          </span>
          )}
        {showAddEditForm(state.formMode)}
      </section>

      <section className="container">
        <ul className="entriesList">
          {state.entries.map(entry => (
            <li
              key={entry.id}
              ref={state.refs[entry.id]}
            >
              <button
                onClick={() => showEditForm(entry)}
                className="plainLink"
                type="button"
              >
                { format(
                  parse(entry.date, FULL_DATE_FORMAT, new Date()),
                  'EEE MM, dd yyyy',
                )}
              </button>
              <div className="markdownDisplay">
                <MarkdownDisplay source={entry.content} />
              </div>
            </li>
          ))}
        </ul>
      </section>
      {state.pageMode === ONEDAY
        && movies.length > 0
        && (
          <section className="movieList">
            {movies.map(movie => (
              <MovieWindow movie={movie} key={movie.id} />
            ))}
          </section>
        )}
      {inspiration && (
        <section>
          <div>{inspiration}</div>
          {inspiration !== '' && (
            <button onClick={() => copyToClipboard(inspiration)} type="button" style={{ margin: '0 1em', lineHeight: '1em' }}>
              /clip
            </button>
          )}
          {QUESTION_API !== '' && (
            <button onClick={e => getPrompt(e)} className="plainLink" type="button">
              [Get Prompt]
            </button>
          )}
          {INSPIRATION_API !== '' && (
            <button onClick={e => getInspiration(e)} className="plainLink" type="button">
              [Get Inspiration]
            </button>
          )}
        </section>
      )}
      <nav className="navbar navbar-expand-sm navbar-light bg-light text-left">
        <RouterNavLink to="/upload">
          <i className="fa fa-file-upload" />
          {' '}
          <span className="nav-text">Upload Pix</span>
        </RouterNavLink>
        <RouterNavLink to="/media">
          <i className="fa fa-portrait" />
          {' '}
          <span className="nav-text">Media</span>
          {' '}
        </RouterNavLink>
        <RouterNavLink to="/logs">
          <i className="fa fa-clipboard-list" />
          {' '}
          <span className="nav-text">Logs</span>
          {' '}
        </RouterNavLink>
        <button onClick={() => doLogout()} className="btn-margin plainLink" type="button">
          <i className="fa fa-sign-out" />
          <span className="nav-text">Log Out</span>
        </button>
        <span className="footer-version">
          v
          {pkg.version}
        </span>
      </nav>
    </>
  );
};

export default OneDay;
