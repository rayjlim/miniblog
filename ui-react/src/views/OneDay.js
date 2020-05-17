import React, { useState, useEffect, Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // eslint-disable-line no-unused-vars
import moment from 'moment';
import AddForm from '../components/AddForm.jsx'; //eslint-disable no-unused-vars
import EditForm from '../components/EditForm.jsx'; //eslint-disable no-unused-vars
import { useAuth0 } from '../utils/react-auth0-spa';
import { Snackbar } from 'react-md';

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

    const [ state, setState ] = useState({
        entries: [],
        auth: false,
        pageDate: '',
        searchParam: '',
        formEntry: {},
        toasts: [],
        autohide: true,
        pageMode: ONEDAY,
        formMode: CLOSED
    });

    let dateInput = null;

    // console.log('state.date :', state.date);

    useEffect(() => {
        console.log('OndeDay: useEffect');
        let loc = window.location + '';
        let param = loc.substring(loc.indexOf('?'));
        console.log('param :', param);
        let urlParams = new URLSearchParams(param);

        // const _date = moment().format('YYYY-MM-DD');
        const pageDate = urlParams.has('date') ? urlParams.get('date') : moment().format('YYYY-MM-DD');
        const pageMode = urlParams.has('pageMode') ? parseInt(urlParams.get('pageMode')) : ONEDAY;
        console.log('urlParams.has(pageMode) :', urlParams.has('pageMode'));
        // console.log('urlParams.has(fileName) :', urlParams.has('fileName'));
        // console.log('urlParams.has(filePath) :', urlParams.has('filePath'));
        const _date = moment().format('YYYY-MM-DD');

        console.log('setting pageDate :>> ', _date);
        loadDay({pageDate, pageMode});
    }, []);

    function loadDay(loadParams) {
        console.log('loadDay :', loadParams.pageDate, 'pagemode', loadParams.pageMode);

        if (!loadParams.pageDate) {
            return;
        }
        let endPointURL = ``;
        switch (loadParams.pageMode) {
            case ONEDAY: {
                endPointURL = `${constants.REST_ENDPOINT}api/posts/?date=${loadParams.pageDate}`;
                break;
            }
            case SAMEDAY: {
                endPointURL = `${constants.REST_ENDPOINT}api/sameDayEntries/?day=${loadParams.pageDate}`;
                break;
            }
            case SEARCH: {
                const text = loadParams.searchParam;
                endPointURL = `${constants.REST_ENDPOINT}api/posts/?searchParam=${text}`;
                break;
            }
        }

        (async () => {
            const result = await axios(endPointURL);

            console.log('result :', result);
            if (result.status !== 200) {
                console.log('result.status :', result.status);
                alert(`loading error : ${result.status}`);
                return;
            } else if (typeof result.data === 'string') {
                console.log('invalid json');
            } else {
                console.log('result.data :>> ', result.data.unauth);
                if (result.data.unauth) {
                    setState({ ...state, auth: false });
                } else {
                    const entries = result.data.entries;
                    console.log('state :>> ', state);
                    setState({ ...state, ...loadParams, entries, auth: true });
                }
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
        const direction = e.target.value;
        console.log('direction :>> ', direction);
        let _date = moment(state.pageDate, 'YYYY-MM-DD');
        let updateDate = _date.add(direction, 'days').format('YYYY-MM-DD');

        console.log('oneday:hbd.' + e.target.value, state.pageDate, updateDate);

        console.log('hbd. :>> ', updateDate);
        console.log('state :>> ', state.pageDate);
        loadDay({...state, pageDate: updateDate, formMode: CLOSED});
    }

    function resetEntryForm() {
        const toasts = state.toasts.slice();
        toasts.push({ text: 'Add/Edit Done' });
        loadDay({...state, toasts, formMode: CLOSED});
    }

    function showAddForm(e) {
        console.log('showAddForm#state.date :', state.pageDate);
        setState({ ...state, formMode: ADD });
    }

    function showEditForm(e, entry) {
        console.log('id :', entry.id);
        setState({ ...state, formMode: EDIT, formEntry: entry });
    }

    function updateDate(e) {
        console.log('UPDATING DATE  :', e.target.value);
        let myval = e.target.value;
        loadDay({...state, pageDate: myval});
    }

    function changePageMode(pageMode) {
        console.log('new pageMode :>> ', pageMode);
        loadDay({...state, pageMode});
    }

    function showAddEditForm(mode) {
        // console.log('formmode :', mode);
        if (!mode || mode === CLOSED) {
            return (
                <button onClick={(e) => showAddForm(e)} className="btn btn-default">
                    Show Add Form
                </button>
            );
        } else if (mode === ADD) {
            return <AddForm date={state.pageDate} onSuccess={() => resetEntryForm()} />;
        } else if (mode === EDIT) {
            return <EditForm entry={state.formEntry} onSuccess={() => resetEntryForm()} />;
        }
    }

    async function sendBackendAuth(e) {
        const result = await axios.post(`${constants.REST_ENDPOINT}security?debug=off`, {
            email: user.email,
            sub: user.sub
        });
        console.log('result :', result);
        if (result.status !== 200) {
            console.log('result.status :', result.status);
            alert(`loading error : ${result.status}`);
            return;
        } else if (typeof result.data === 'string') {
            console.log('invalid json');
        } else {
            console.log('sendBacendAuth#loadday', state.pageDate);
            loadDay();
        }
    }

    async function logoutWithRedirect() {
        const result = await axios(`${constants.REST_ENDPOINT}security?logout=true&debug=off`);
        console.log('result :', result);
        if (result.status !== 200) {
            console.log('result.status :', result.status);
            alert(`loading error : ${result.status}`);
            return;
        } else if (typeof result.data === 'string') {
            console.log('invalid json');
        } else {
            alert('Logged Out');
            logout({
                returnTo: window.location.origin
            });
        }
    }

    function dismissToast() {
        const [ , ..._toasts ] = state.toasts;
        setState({ ...state, toasts: _toasts });
    }

    return (
        <Fragment>
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
                <RouterNavLink to="/search">
                    <i className="fa fa-search" /> <span className="nav-text">Search</span>
                </RouterNavLink>
                {state.pageMode === ONEDAY && (
                    <button onClick={(e) => changePageMode(SAMEDAY)}>
                        <i className="fa fa-calendar-check" /> <span className="nav-text">Same Day</span>
                    </button>
                )}
                {state.pageMode === SAMEDAY && (
                    <button onClick={(e) => changePageMode(ONEDAY)}>
                        <i className="fa fa-home" /> <span>Home</span>
                    </button>
                )}
                <RouterNavLink to="/calendar">
                    <i className="fa fa-calendar" /> <span className="nav-text">Calendar</span>
                </RouterNavLink>

                {isAuthenticated ? (
                    <button onClick={(e) => logoutWithRedirect(e)} className="btn-margin plainLink">
                        <i className="fa fa-sign-out" />
                        <span className="nav-text">Log Out</span>
                    </button>
                ) : (
                    <button id="qsLoginBtn" className="btn-margin plainLink" onClick={() => loginWithRedirect({})}>
                        <i className="fa fa-sign-in" /> <span className="nav-text">Log In</span>
                    </button>
                )}
                {isAuthenticated && !state.auth ? (
                    <button onClick={(e) => sendBackendAuth(e)} className="plainLink">
                        <i className="fa fa-shield" /> <span className="nav-text">Auth</span>
                    </button>
                ) : (
                    ''
                )}
            </nav>
            <Snackbar id="example-snackbar" toasts={state.toasts} autohide={state.autohide} onDismiss={dismissToast} />
            

            {state.pageMode === ONEDAY && (
                    <h1>One Day</h1>
                )}
                {state.pageMode === SAMEDAY && (
                   <h1>Same Day</h1>
                )}

            <div className="grid-3mw container">
                <button onClick={(e) => handleButtonDirection(e)} className="btn btn-info btn-lrg" value="-1">
                    <i className="fa fa-chevron-left" /> Prev
                </button>
                <div>
                    <span>{moment(state.date).format('dd')}</span>
                    <input
                        ref={(elem) => (dateInput = elem)}
                        type="text"
                        className="form-control"
                        id="formDpInput"
                        defaultValue={state.pageDate}
                        onChange={(e) => updateDate(e)}
                    />
                </div>
                <button onClick={(e) => handleButtonDirection(e)} className="btn btn-success btn-lrg" value="1">
                    Next <i className="fa fa-chevron-right" />
                </button>
            </div>

            <section className="container">{showAddEditForm(state.formMode)}</section>

            <section className="container">
                <ul className="entriesList">
                    {state.entries.map((entry) => {
                        let newText = entry.content.replace(/<br \/>/g, '\n');
                        newText = newText.replace(/..\/uploads/g, `${constants.PROJECT_ROOT}uploads`);
                        const dateFormated = moment(entry.date).format('ddd MMM, DD YYYY');
                        let showEntryDate = (
                            <button onClick={(e) => showEditForm(e, entry)} className="plainLink">
                                {dateFormated}
                            </button>
                        );

                        return (
                            <li key={entry.id} className="blogEntry">
                                {showEntryDate} |
                                <ReactMarkdown source={newText} escapeHtml={false} />
                            </li>
                        );
                    })}
                </ul>
            </section>
            <br />
            <nav className="navbar navbar-expand-sm navbar-light bg-light row">
                <div className="col-md-5 text-left">
                    <RouterNavLink to={`/upload`} className="btn navbar-btn">
                        <i className="fa fa-file-upload" /> Upload Pix
                    </RouterNavLink>
                    <RouterNavLink to="/media">
                        <i className="fa fa-portrait" /> <span className="nav-text">Media</span>
                    </RouterNavLink>
                </div>

                <div className="col-md-5 text-right">
                    <span>{user && `${user.email}`}</span>
                </div>
            </nav>
        </Fragment>
    );
};

export default OneDay;
