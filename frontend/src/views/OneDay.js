import React, { useState, useEffect, Fragment } from 'react';
import pkg from '../../package.json';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import {format, parse, add} from 'date-fns';
import AddForm from '../components/AddForm.jsx'; //eslint-disable no-unused-vars
import EditForm from '../components/EditForm.jsx'; //eslint-disable no-unused-vars
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
const SEARCH = 2;
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
    pageDate: format(new Date(), 'yyyy-MM-dd'),
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
      case SEARCH: {
        const text = loadParams.searchParam;
        endPointURL = `${constants.REST_ENDPOINT}/api/posts/?searchParam=${text}`;
        break;
      }
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
      } catch (err) {
        console.log(err);
        alert(`loading error : ${err}`);
      }
    })();
  }

  /**
   * Handle change in day Previous | Next
   * @function
   * @param  {Object} e Event of Button click
   */
  function handleButtonDirection(e) {
    console.log('e :>> ', e);
    let _date = parse(state.pageDate, 'yyyy-MM-dd', new Date());
    if (e.target.value == 0) {
      _date = new Date();
    } else {
      _date = parse(state.pageDate, 'yyyy-MM-dd', new Date());
    }

    let newDate = add(_date, { days: e.target.value });
    dateInput.value = format(newDate, 'yyyy-MM-dd');

    loadDay({
      ...state,
      pageDate: format(newDate, 'yyyy-MM-dd'),
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
        <button onClick={e => showAddForm(e)} className="btn btn-default">
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

  async function sendBackendAuth(e) {
    const response = await fetch(
      `${constants.REST_ENDPOINT}/security?debug=off`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          sub: user.sub,
        }),
      }
    );
    console.log('response :', response);
    if (!response.ok) {
      console.log('status :', response.status);
      alert(`loading error : ${response.status}`);
      return;
    } else {
      // const data = await response.json();
      console.log('sendBacendAuth#loadday', state.pageDate);
      loadDay();
    }
  }

  async function logoutWithRedirect() {
    const response = await fetch(
      `${constants.REST_ENDPOINT}/security?logout=true&debug=off`
    );
    console.log('response :', response);
    if (!response.ok) {
      console.log('response.status :', response.status);
      alert(`logout error : ${response.status}`);
      return;
    } else {
      // const data = await response.json();
      alert('Logged Out');
      logout({
        returnTo: window.location.origin,
      });
    }
  }

  const doLogout = () => {
    window.localStorage.removeItem('appToken');
    history.push(`/`);
  };

  const login = { color: 'red' };

  useEffect(() => {
    console.log('OndeDay: useEffect');
    let loc = window.location + '';
    let param = loc.substring(loc.indexOf('?'));
    console.log('param :', param);
    let urlParams = new URLSearchParams(param);

    const pageDate = urlParams.has('date')
      ? urlParams.get('date')
      : format(new Date(), 'yyyy-MM-dd');

    const pageMode = urlParams.has('pageMode')
      ? parseInt(urlParams.get('pageMode'))
      : ONEDAY;

    console.log('urlParams.has(pageMode) :', urlParams.has('pageMode'));
    // console.log('urlParams.has(fileName) :', urlParams.has('fileName'));
    // console.log('urlParams.has(filePath) :', urlParams.has('filePath'));
    const _date = format(new Date(), 'yyyy-MM-dd');

    console.log('setting pageDate :>> ', _date);
    loadDay({ pageDate, pageMode });
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
        {/* {isAuthenticated ? (
          <button
            onClick={e => doLogout(e)}
            className="btn-margin plainLink"
          >
            <i className="fa fa-sign-out" />
            <span className="nav-text">Log Out</span>
          </button>
        ) : (
          <button
            id="qsLoginBtn"
            className="btn-margin plainLink"
            onClick={() => loginWithRedirect({})}
          >
            <i className="fa fa-sign-in" style={login} />{' '}
            <span className="nav-text" style={login}>
              Log In
            </span>
          </button>
        )}
        {isAuthenticated && !state.auth ? (
          <button onClick={e => sendBackendAuth(e)} className="plainLink">
            <i className="fa fa-shield" />{' '}
            <span className="nav-text">Auth</span>
          </button>
        ) : (
          ''
        )} */}
      </nav>
      <Snackbar
        id="example-snackbar"
        toasts={state.toasts}
        autohide={state.autohide}
      />

      {state.pageMode === ONEDAY && <h1>One Day</h1>}
      {state.pageMode === SAMEDAY && <h1>Same Day</h1>}

      <Fragment>
        <div className="grid-3mw container">
          <button
            onClick={e => handleButtonDirection(e)}
            className="btn btn-info btn-lrg"
            value="-1"
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
                parse(entry.date, 'yyyy-MM-dd', new Date()),
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
      </Fragment>

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
