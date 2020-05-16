import React, { useState, useEffect, Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import axios from 'axios';
import moment from 'moment';
import ReactMarkdown from 'react-markdown'; // eslint-disable-line no-unused-vars
import AddForm from '../components/AddForm.jsx'; //eslint-disable no-unused-vars
import EditForm from '../components/EditForm.jsx'; //eslint-disable no-unused-vars
import { Snackbar } from 'react-md';
const DEBOUNCE_TIME = 300;

const SameDay = () => {
    // class ContactForm extends React.Component {
    const [ data, setData ] = useState({ entries: [] });
    const [ oDate, setDate ] = useState('');
    const [ formMode, setFormMode ] = useState(0);
    const [ entry, setEntry ] = useState({});
    const [ mainState, setMainState ] = useState({ toasts: [], autohide: true });

    useEffect(() => {
        console.log('useEffect');
        console.log('ODB: componentDidMount');

        let loc = window.location + '';

        let param = loc.substring(loc.indexOf('?'));
        console.log('param :', param);
        let urlParams = new URLSearchParams(param);

        console.log('urlParams.has date : ' + urlParams.has('date'));
        const date = urlParams.has('date') ? urlParams.get('date') : moment().format('YYYY-MM-DD');
        console.log('passed date: ' + date);
        setDate(date);
        loadDay(date);
    }, []);

    function loadDay(_date) {
        (async () => {
            // You can await here
            const result = await axios(`${constants.REST_ENDPOINT}api/sameDayEntries/?day=${_date}`);
            console.log('result :', result);
            console.log('typeof result.data :', typeof result.data);
            if (result.status !== 200) {
                console.log('result.status :', result.status);
                alert(`loading error : ${result.status}`);
                return;
            } else if (typeof result.data === 'string') {
                console.log('invalid json');
            } else {
                console.log('result.data :>> ', result.data.unauth);
                if (result.data.unauth) {
                    // setAuth(false);
                    alert('no auth');
                } else {
                    setData(result.data);
                }
            }
            // ...
        })();
    }

    function handleButtonDirection(e) {
        console.log('hbd.' + e.target.value);

        let date = moment(oDate, 'YYYY-MM-DD');
        let updateDate = date.add(e.target.value, 'days').format('YYYY-MM-DD');
        setDate(updateDate);
        loadDay(updateDate);
    }

    let debouncedTextEdit = debounce(handleDateTextEdit, DEBOUNCE_TIME);

    function handleDateTextEdit(text) {
        setDate(text);
        loadDay(text);
    }
    function showAddForm(e) {
        setFormMode(1);
    }
    function showEditForm(e, entry) {
        e.preventDefault();
        console.log('id :', entry.id);
        setFormMode(2);
        setEntry(entry);
    }
    function resetEntryForm() {

        const toasts = mainState.toasts.slice();
        toasts.push({ text: 'Add/Edit Done' });
        setMainState({ ...mainState, toasts });

        setFormMode(0);
        loadDay(oDate);
    }
    function showAddEditForm(mode) {
        console.log('mode :', mode);
        if (!mode || mode === 0) {
            return (
                <button onClick={(e) => showAddForm(e)} className="btn btn-default">
                    Show Add Form
                </button>
            );
        } else if (mode === 1) {
            return <AddForm date={''} onSuccess={() => resetEntryForm()} />;
        } else if (mode === 2) {
            return <EditForm entry={entry} onSuccess={() => resetEntryForm()} />;
        }
    }


    function showEntries() {
        return formMode !== 1 && formMode !== 2 ? (
            <Fragment>
                <h2>{oDate}</h2>
                <ul className="entriesList">
                    {data.entries.map((entry) => {
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
                                {showEntryDate}|
                                <ReactMarkdown source={newText} escapeHtml={false} />
                            </li>
                        );
                    })}
                </ul>
            </Fragment>
        ) : (
            ''
        );
    }
    
    function dismissToast() {
        const [ , ..._toasts ] = mainState.toasts;
        setMainState({ ...mainState, toasts: _toasts });
    }

    return (
        <Fragment>
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
                <RouterNavLink to="/">
                    <i className="fa fa-home" /> <span>Home</span>
                </RouterNavLink>
                <RouterNavLink to="/search">
                    <i className="fa fa-search" /> <span>Search</span>
                </RouterNavLink>
                <RouterNavLink to="/calendar">
                    <i className="fa fa-calendar" /> <span>Calendar</span>
                </RouterNavLink>
            </nav>
            <Snackbar
                id="example-snackbar"
                toasts={mainState.toasts}
                autohide={mainState.autohide}
                onDismiss={dismissToast}
            />
            <h1>Same Day</h1>
            <div className="grid-3mw container">
                <button onClick={(e) => handleButtonDirection(e)} className="btn btn-info btn-lrg" value="-1">
                    <i className="fa fa-chevron-left" /> Prev
                </button>
                <input
                    type="text"
                    className="form-control"
                    id="formDpInput"
                    value={oDate}
                    defaultValue={oDate}
                    onChange={(e) => debouncedTextEdit(e.target.value)}
                />
                <button onClick={(e) => handleButtonDirection(e)} className="btn btn-success btn-lrg" value="1">
                    Next <i className="fa fa-chevron-right" />
                </button>
            </div>
            <section className="container">{showAddEditForm(formMode)}</section>

            <section className="container">{showEntries()}</section>
            <nav className="navbar navbar-expand-sm navbar-light bg-light">
                <RouterNavLink to={`/upload`} className="btn navbar-btn">
                    <i className="fa fa-file-upload" /> Upload Pix
                </RouterNavLink>
            </nav>
        </Fragment>
    );
};

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export default SameDay;







