import React, { useState, useEffect, Fragment } from 'react';
import pkg from '../../package.json';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import { format, parse, add } from 'date-fns';
import AddForm from '../components/AddForm.jsx'; //eslint-disable no-unused-vars
import EditForm from '../components/EditForm.jsx'; //eslint-disable no-unused-vars
import MovieWindow from '../components/MovieWindow.jsx'; //eslint-disable no-unused-vars
import { useAuth0 } from '../utils/react-auth0-spa';
import { Snackbar } from 'react-md';
import MarkdownDisplay from '../components/MarkdownDisplay';
import history from '../utils/history';
import './OneDay.css';

const CLOSED = 0;
const ADD = 1;
const EDIT = 2;

const ONEDAY = 0;
const SAMEDAY = 1;

const FULL_DATE_FORMAT = 'yyyy-MM-dd';
/**
 * Component to Display of One Day style
 *
 * @component
 * @example
 * <Route path="/oneday" component={OneDay} />
 */
const OneDay = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const [state, setState] = useState({
    entries: [],
    pageDate: format(new Date(), FULL_DATE_FORMAT),
    searchParam: '',
    formEntry: {},
    toasts: [],
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

  let dateInput = null;

  // console.log('state.date :', state.date);

  function loadDay(loadParams) {
    console.log(
      'loadDay :',
      loadParams.pageDate,
      'pagemode',
      loadParams.pageMode
    );

    if (!loadParams.pageDate) {
      return;
    }
    let endPointURL = '';
    switch (loadParams.pageMode) {
      case SAMEDAY: {
        endPointURL = `${constants.REST_ENDPOINT}/api/sameDayEntries/?day=${loadParams.pageDate}`;
        break;
      }
      // case SEARCH: {
      //   const text = loadParams.searchParam;
      //   endPointURL = `${constants.REST_ENDPOINT}/api/posts/?searchParam=${text}`;
      //   break;
      // }
      default: {
        endPointURL = `${constants.REST_ENDPOINT}/api/posts/?date=${loadParams.pageDate}`;
        break;
      }
    }

    (async () => {
      const token = window.localStorage.getItem('appToken');
      try {
        const response = await fetch(endPointURL, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'x-app-token': token,
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
        });
        if (!response.ok) {
          console.log('response.status :', response.status);
          alert(`loading error : ${response.status}`);
          return;
        } else {
          const data = await response.json();

          console.log('response.data :>> ', data);

          const refs = data.entries.reduce((acc, value) => {
            acc[value.id] = React.createRef();
            return acc;
          }, {});

          let entries = data.entries;
          console.log('entries :>> ', entries);
          console.log('state :>> ', state);
          setState({ ...state, ...loadParams, entries, auth: true, refs });
          console.log('state.scrollToLast :>> ', loadParams.scrollToLast);
          // if (loadParams.scrollToLast) {
          //   refs[loadParams.scrollToLast].current.scrollIntoView({
          //     behavior: 'smooth',
          //     block: 'start',
          //   });
          // }
        }

        // ----
        if (inspiration === null) {
          await getInspiration();
        }
        await getWeight(loadParams.pageDate);
        await getMovies(loadParams.pageDate);
      } catch (err) {
        console.log(err);
        alert(`loading error : ${err}`);
      }
    })();
  }

  async function getInspiration() {
    try {
      console.log(constants);
      const quoteApi = constants.INSPIRATION_ENDPOINT;
      const quoteResponse = await fetch(quoteApi, {});
      if (!quoteResponse.ok) {
        console.log('quoteResponse.status :', quoteResponse.status);
        alert(`loading error : ${quoteResponse.status}`);
        return;
      } else {
        const data = await quoteResponse.json();

        console.log('vercel data.header :>> ', data.header);
        console.log('vercel data.message :>> ', data.message);
        setInspiration(`Inspire: ${data.message} : ${data.author}`);
      }
    } catch (err) {
      console.log(err);
      alert(`loading error : ${err}`);
    }
  }

  async function getPrompt() {
    try {
      // console.log(constants);
      const api_endpoint = constants.QUESTION_ENDPIONT;
      const response = await fetch(api_endpoint, {});
      if (!response.ok) {
        console.log('response.status :', response.status);
        alert(`loading error : ${response.status}`);
        return;
      } else {
        const data = await response.json();

        console.log('vercel data.header :>> ', data.header);
        console.log('vercel data.message :>> ', data.message);
        setInspiration(`Question: ${data.prompt} : ${data.category}`);
      }
    } catch (err) {
      console.log(err);
      alert(`loading error : ${err}`);
    }
  }

  async function getWeight(date) {
    try {
      console.log(constants);
      const api = constants.TRACKS_ENDPIONT;
      const quoteResponse = await fetch(`${api}?start=${date}&end=${date}`, {});
      if (!quoteResponse.ok) {
        console.log('quoteResponse.status :', quoteResponse.status);
        alert(`loading error : ${quoteResponse.status}`);
        return;
      } else {
        const data = await quoteResponse.json();
        if (data && data.data && data.data[0] && data.data[0].count) {
          setWeight(data.data[0].count);
        } else {
          setWeight('?');
        }
      }
    } catch (err) {
      console.log(err);
      alert(`loading error : ${err}`);
    }
  }
  async function getMovies(date) {
    try {
      console.log(constants);
      const api = constants.MOVIES_ENDPIONT;
      const quoteResponse = await fetch(
        `${api}&advanced_search=true&dt_viewed=${date}`,
        {}
      );
      if (!quoteResponse.ok) {
        console.log('quoteResponse.status :', quoteResponse.status);
        alert(`loading error : ${quoteResponse.status}`);
        return;
      } else {
        const data = await quoteResponse.json();
        if (data && data.movies) {
          setMovies(data.movies);
        } else {
          setMovies([]);
        }
      }
    } catch (err) {
      console.log(err);
      alert(`loading error : ${err}`);
    }
  }

  /**
   * Handle change in day Previous | Next
   * @function
   * @param  {Object} e Event of Button click
   */
  function handleButtonDirection(e) {
    console.log('e :>> ', e);
    let _date = parse(state.pageDate, FULL_DATE_FORMAT, new Date());
    if (e.target.value == 0) {
      _date = new Date();
    } else {
      _date = parse(state.pageDate, FULL_DATE_FORMAT, new Date());
    }

    let newDate = add(_date, { days: e.target.value });
    dateInput.value = format(newDate, FULL_DATE_FORMAT);
    loadDay({
      ...state,
      pageDate: format(newDate, FULL_DATE_FORMAT),
      formMode: CLOSED,
    });
  }

  function resetEntryForm() {
    const toasts = state.toasts.slice();
    toasts.push({ text: 'Add/Edit Done' });
    loadDay({ ...state, toasts, formMode: CLOSED });
  }

  function showAddForm(e) {
    console.log('showAddForm#state.date :', state.pageDate);
    setState({ ...state, formMode: ADD });
  }

  function showEditForm(e, entry) {
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
    console.log('UPDATING DATE  :', e.target.value);
    let myval = e.target.value;
    loadDay({ ...state, pageDate: myval });
  }

  function changePageMode(pageMode) {
    console.log('new pageMode :>> ', pageMode);
    loadDay({ ...state, pageMode });
  }

  function showAddEditForm(mode) {
    // console.log('formmode :', mode);
    if (!mode || mode === CLOSED) {
      return (
        <button
          onClick={e => showAddForm(e)}
          className="btn btn-default"
          id="addFormBtn"
        >
          Show Add Form
        </button>
      );
    } else if (mode === ADD) {
      return (
        <AddForm date={state.pageDate} onSuccess={() => resetEntryForm()} />
      );
    } else if (mode === EDIT) {
      return (
        <EditForm entry={state.formEntry} onSuccess={() => resetEntryForm()} />
      );
    }
  }

  const doLogout = () => {
    window.localStorage.removeItem('appToken');
    history.push(`/`);
  };

  useEffect(() => {
    console.log('OndeDay: useEffect');
    let loc = window.location + '';
    let param = loc.substring(loc.indexOf('?'));
    console.log('param :', param);
    let urlParams = new URLSearchParams(param);

    const pageDate = urlParams.has('date')
      ? urlParams.get('date')
      : format(new Date(), FULL_DATE_FORMAT);

    const pageMode = urlParams.has('pageMode')
      ? parseInt(urlParams.get('pageMode'))
      : ONEDAY;

    console.log('urlParams.has(pageMode) :', urlParams.has('pageMode'));
    // console.log('urlParams.has(fileName) :', urlParams.has('fileName'));
    // console.log('urlParams.has(filePath) :', urlParams.has('filePath'));
    const _date = format(new Date(), FULL_DATE_FORMAT);

    console.log('setting pageDate :>> ', _date);
    loadDay({ pageDate, pageMode });
    document.addEventListener('keydown', e => {
      console.log('OneDay: handle key presss ' + e.key);
      // console.log('131:' + markdown + ', hasChanges ' + hasChanges);
      if (e.altKey && e.key === 'a') {
        console.log('S keybinding');
        // Note: this is a hack because the content value is taken from the init value
        document.getElementById('addFormBtn').click();
      } else if (e.altKey && e.key === ',') {
        console.log('alt comma keybinding');
        // Note: this is a hack because the content value is taken from the init value
        document.getElementById('prevBtn').click();
      } else if (e.altKey && e.key === '.') {
        console.log('alt period keybinding');
        // Note: this is a hack because the content value is taken from the init value
        document.getElementById('nextBtn').click();
      }
    });
  }, []);

  return (
    <Fragment>
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <RouterNavLink to="/search">
          <i className="fa fa-search" />{' '}
          <span className="nav-text">Search</span>
        </RouterNavLink>
        {state.pageMode === ONEDAY && (
          <button onClick={e => changePageMode(SAMEDAY)}>
            <i className="fa fa-calendar-check" />{' '}
            <span className="nav-text">Same Day</span>
          </button>
        )}
        {state.pageMode === SAMEDAY && (
          <button onClick={e => changePageMode(ONEDAY)}>
            <i className="fa fa-home" /> <span>Home</span>
          </button>
        )}
        <button onClick={e => doLogout(e)} className="btn-margin plainLink">
          <i className="fa fa-sign-out" />
          <span className="nav-text">Log Out</span>
        </button>
      </nav>
      <Snackbar
        id="example-snackbar"
        toasts={state.toasts}
        autohide={state.autohide}
      />
      {state.pageMode === ONEDAY && <h1>One Day</h1>}
      {state.pageMode === SAMEDAY && <h1>Same Day</h1>}

      <div className="grid-3mw container">
        <button
          onClick={e => handleButtonDirection(e)}
          className="btn btn-info btn-lrg"
          value="-1"
          id="prevBtn"
        >
          <i className="fa fa-chevron-left" /> Prev
        </button>
        <div>
          {/* <span>{state.pageDate}</span> */}
          <input
            ref={elem => (dateInput = elem)}
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
        >
          Next <i className="fa fa-chevron-right" />
        </button>
        <button
          onClick={e => handleButtonDirection(e)}
          className="btn btn-warning btn-lrg"
          value="0"
        >
          Today
        </button>
      </div>

      <section className="container" ref={state.refForm}>
        {weight && <span>Weight : {weight}</span>}
        {showAddEditForm(state.formMode)}
      </section>

      <section className="container">
        <ul className="entriesList">
          {state.entries.map(entry => {
            let newText = entry.content.replace(/<br \/>/g, '\n');
            newText = newText.replace(
              /..\/uploads/g,
              `${constants.UPLOAD_ROOT}`
            );
            const dateFormated = format(
              parse(entry.date, FULL_DATE_FORMAT, new Date()),
              'EEE MM, dd yyyy'
            );
            let showEntryDate = (
              <button
                onClick={e => showEditForm(e, entry)}
                className="plainLink"
              >
                {dateFormated}
              </button>
            );

            return (
              <li
                key={entry.id}
                className="blogEntry"
                ref={state.refs[entry.id]}
              >
                {showEntryDate} |
                <MarkdownDisplay source={newText} />
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <ul>
          {movies.length > 0 &&
            movies.map(movie => (
              <li key={movie.id}>
                <MovieWindow movie={movie} />
              </li>
            ))}
        </ul>
      </section>
      {inspiration && (
        <section>
          <div>{inspiration}</div>
          {/* {inspiration !== '' && (
            <button onClick={e => appendToForm(e)} className="plainLink">
              Append to Entry
            </button>
          )} */}
          {constants.QUESTION_ENDPIONT !== '' && (
            <button onClick={e => getPrompt(e)} className="plainLink">
              [Get Prompt]
            </button>
          )}
          {constants.INSPIRATION_ENDPOINT !== '' && (
            <button onClick={e => getInspiration(e)} className="plainLink">
              [Get Inspiration]
            </button>
          )}
        </section>
      )}
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <div className="col-md-5 text-left">
          <RouterNavLink to={'/upload'} className="btn navbar-btn">
            <i className="fa fa-file-upload" /> Upload Pix
          </RouterNavLink>
          <RouterNavLink to="/media">
            <i className="fa fa-portrait" />{' '}
            <span className="nav-text">Media</span>
          </RouterNavLink>
          <span className="footer-version">v{pkg.version}</span>
        </div>

        <div className="col-md-5 text-right">
          <span>{user && `${user.email}`}</span>
        </div>
      </nav>
    </Fragment>
  );
};

export default OneDay;
