import React, { useState, useEffect, Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import { format, parse } from 'date-fns';
import EditForm from '../components/EditForm.jsx';
import MarkdownDisplay from '../components/MarkdownDisplay';
import DatePicker from 'react-date-picker';
import './Search.css';

const DEBOUNCE_TIME = 350;

const HIDE_EDIT_FORM = 0;
const SHOW_EDIT_FORM = 1;

const FILTER_MODE_ALL = 0;
const FULL_DATE_FORMAT = 'yyyy-MM-dd';

// const FILTER_MODE_TAGGED = 1;
// const FILTER_MODE_UNTAGGED = 2;

const TextEntry = () => {
  // class ContactForm extends React.Component {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchFilter, setSearchFilter] = useState(FILTER_MODE_ALL);
  const [formMode, setFormMode] = useState(HIDE_EDIT_FORM);
  const [entry, setEntry] = useState({});
  const [searchParams, setSearchParams] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  let debouncedSearch = debounce(getEntries, DEBOUNCE_TIME);

  useEffect(() => {
    console.log('useEffect');

    debouncedSearch(searchText);
  }, [searchText, searchFilter]);

  /**
   * Get blog entries for text search
   * @param  {string} text text to search for
   */
  async function getEntries() {
    console.log('getEntries#searchText:', searchText);
    try {
      const token = window.localStorage.getItem('appToken');
      let endpoint = `${
        constants.REST_ENDPOINT
      }/api/posts/?searchParam=${encodeURIComponent(
        searchText
      )}&filterType=${searchFilter}`;
      if (startDate) {
        endpoint += `&startDate=${format(startDate, FULL_DATE_FORMAT)}`;
      }
      if (endDate) {
        endpoint += `&endDate=${format(endDate, FULL_DATE_FORMAT)}`;
      }
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-app-token': token,
        },
        referrerPolicy: 'no-referrer',
      });

      if (!response.ok) {
        console.log('response.status :', response.status);
        alert(`loading error : ${response.status}`);
      } else {
        const responseData = await response.json();

        console.log('result.responseData :>> ', responseData);
        if (responseData.unauth) {
          // TODO: should remove as it is unnecessary
          alert('no auth');
        } else {
          console.log('setSearchParams')
          setSearchParams(responseData.params);
          console.log('setStartDate: '+ (responseData.params.startDate.length))
          setStartDate(
            responseData.params.startDate.length
              ? parse(
                  responseData.params.startDate,
                  FULL_DATE_FORMAT,
                  new Date()
                )
              : null
          );
          console.log('setEndDate' + responseData.params.endDate.length)
          setEndDate(
            responseData.params.endDate.length
              ? parse(
                  responseData.params.endDate,
                  FULL_DATE_FORMAT,
                  new Date()
                )
              : null
          );

          if (searchText.length) {
            const reg = new RegExp(searchText, 'gi');

            const foundHighlights = responseData.entries.map(entry => {
              const highlighted = entry.content.replace(reg, str => {
                return `<b>${str}</b>`;
              });
              return { ...entry, highlighted };
            });

            setPosts(foundHighlights);
          } else {
            setPosts(responseData.entries);
          }
        }
      }
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }

  function showEditForm(e, entry) {
    e.preventDefault();
    console.log('id :', entry.id);
    setFormMode(SHOW_EDIT_FORM);
    setEntry(entry);
  }
  function showStartDateEdit(e) {
    setStartDate(new Date());
  }
  function showEndDateEdit(e) {
    setEndDate(new Date());
  }

  function resetEntryForm() {
    setFormMode(HIDE_EDIT_FORM);
    getEntries();
  }

  function showSearchSummary() {
    if (searchParams !== null) {
      return (
        <Fragment>
          Date:{' '}
          {searchParams.startDate !== '' ? searchParams.startDate : 'Beginning'}{' '}
          to {searchParams.endDate !== '' ? searchParams.endDate : 'Now'},
          Limit: {searchParams.resultsLimit}. Found {posts.length}
        </Fragment>
      );
    } else {
      return <Fragment>No Search Params</Fragment>;
    }
  }

  function editForm() {
    return formMode === SHOW_EDIT_FORM ? (
      <EditForm entry={entry} onSuccess={() => resetEntryForm()} />
    ) : (
      <Fragment />
    );
  }

  function showEntries() {
    return formMode !== SHOW_EDIT_FORM ? (
      <Fragment>
        <ul className="entriesList">
          {posts.map(entry => {
            let content =
              searchText.length && entry.highlighted
                ? entry.highlighted
                : entry.content;
            let newText = content.replace(/<br \/>/g, '\n');
            newText = newText.replace(
              /..\/uploads/g,
              `${constants.UPLOAD_ROOT}`
            );
            const dateFormated = format(
              parse(entry.date, FULL_DATE_FORMAT, new Date()),
              'EEE, yyyy-MM-dd'
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
              <li key={entry.id} className="blogEntry">
                {showEntryDate}|
                <MarkdownDisplay source={newText} escapeHtml={false} />
              </li>
            );
          })}
        </ul>
      </Fragment>
    ) : (
      ''
    );
  }

  return (
    <Fragment>
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <RouterNavLink to="/oneday">
          <i className="fa fa-home" /> <span>Home</span>
        </RouterNavLink>
        <RouterNavLink to="/oneday?pageMode=1">
          {' '}
          <i className="fa fa-calendar-check" /> <span>Same Day</span>
        </RouterNavLink>
      </nav>
      <h1>Text Search</h1>

      <section className="container">
        <input
          id="searchText"
          type="text"
          className="form-control"
          value={searchText}
          placeholder="Search term"
          onChange={e => setSearchText(e.target.value)}
        />
        Filter:
        <input
          id="filterId"
          type="text"
          className="form-control filterType"
          value={searchFilter}
          placeholder="Search term"
          onChange={e => setSearchFilter(e.target.value)}
        />
        <span>ALL, 0; TAGGED, 1;UNTAGGED, 2</span>
        <div>
          Start Date:{' '}
          {startDate ? (
            <DatePicker onChange={setStartDate} value={startDate} />
          ) : (
            <Fragment>
              None{' '}
              <button
                onClick={e => showStartDateEdit(e, entry)}
                className="plainLink"
              >
                Edit
              </button>
            </Fragment>
          )}
        </div>
        <div>
          End Date:{' '}
          {endDate ? (
            <DatePicker onChange={setEndDate} value={endDate} />
          ) : (
            <Fragment>
              None{' '}
              <button
                onClick={e => showEndDateEdit(e, entry)}
                className="plainLink"
              >
                Edit
              </button>
            </Fragment>
          )}
        </div>
        <span className="container">{showSearchSummary()}</span>
      </section>

      <section className="container">{editForm()}</section>

      <section className="container">{showEntries()}</section>

      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <RouterNavLink to={'/upload'} className="btn navbar-btn">
          <i className="fa fa-file-upload" /> Upload Pix
        </RouterNavLink>
      </nav>
    </Fragment>
  );
};
let timeout;
function debounce(func, wait, immediate) {
  console.log('debouncing');
  return function () {
    let context = this,
      args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
export default TextEntry;
