import React, { useState, useEffect, Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import {format, parse } from 'date-fns';
import EditForm from '../components/EditForm.jsx';
import MarkdownDisplay from '../components/MarkdownDisplay';

const DEBOUNCE_TIME = 350;

const FORM_MODE_NONE = 0;
const FORM_MODE_EDIT = 1;

const FILTER_MODE_ALL = 0;
// const FILTER_MODE_TAGGED = 1;
// const FILTER_MODE_UNTAGGED = 2;


const TextEntry = () => {
  // class ContactForm extends React.Component {
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchFilter, setSearchFilter] = useState(FILTER_MODE_ALL);
  const [formMode, setFormMode] = useState(FORM_MODE_NONE);
  const [entry, setEntry] = useState({});

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
    console.log('getEntries#text:', searchText);
    try {
      const token = window.localStorage.getItem('appToken');

      const response = await fetch(
        `${constants.REST_ENDPOINT}/api/posts/?searchParam=${encodeURIComponent(
          searchText
        )}&filterType=${searchFilter}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-app-token': token,
          },
          referrerPolicy: 'no-referrer',
        }
      );
      console.log('response :', response);
      if (!response.ok) {
        console.log('response.status :', response.status);
        alert(`loading error : ${response.status}`);
        return;
      } else {
        const responseData = await response.json();

        console.log('result.responseData :>> ', responseData.unauth);
        if (responseData.unauth) {  // TODO: should remove as it is unnecessary
          // setAuth(false);
          alert('no auth');
        } else {
          const searchVal = searchText;
          if (searchVal.length) {
            const reg = new RegExp(searchVal, 'gi');

            const foundHighlights = responseData.entries.map(entry => {
              const highlighted = entry.content.replace(reg, str => {
                return `<b>${str}</b>`;
              });
              return { ...entry, content: highlighted };
            });
            console.log('foundHighlights :>> ', foundHighlights);

            setPosts(foundHighlights);
          } else {
            setPosts(responseData.entries);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }



  function showEditForm(e, entry) {
    e.preventDefault();
    console.log('id :', entry.id);
    setFormMode(FORM_MODE_EDIT);
    setEntry(entry);
  }

  function resetEntryForm() {
    setFormMode(FORM_MODE_NONE);
    getEntries();
  }

  function showAddEditForm() {
    console.log('mode :', formMode);
    if (formMode === FORM_MODE_NONE) {
      return <Fragment />;
    } else if (formMode === FORM_MODE_EDIT) {
      return <EditForm entry={entry} onSuccess={() => resetEntryForm()} />;
    }
  }

  function showEntries() {
    return formMode !== 1 && formMode !== 2 ? (
      <Fragment>
        <ul className="entriesList">
          {posts.map(entry => {
            let newText = entry.content.replace(/<br \/>/g, '\n');
            newText = newText.replace(
              /..\/uploads/g,
              `${constants.UPLOAD_ROOT}`
            );
            const dateFormated = format(
              parse(entry.date, 'yyyy-MM-dd', new Date()),
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

        <input
        id="filterId"
        type="text"
        className="form-control"
        value={searchFilter}
        placeholder="Search term"
        onChange={e => setSearchFilter(e.target.value)}
        size="2"
      />
      <span >ALL, 0; TAGGED, 1;UNTAGGED, 2</span>

      </section>

      <section className="container">{showAddEditForm()}</section>

      <section className="container">{showEntries()}</section>

      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <RouterNavLink to={'/upload'} className="btn navbar-btn">
          <i className="fa fa-file-upload" /> Upload Pix
        </RouterNavLink>
      </nav>
    </Fragment>
  );
};
var timeout;
function debounce(func, wait, immediate) {

  console.log('debouncing');
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
export default TextEntry;
