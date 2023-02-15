import React, { useState, useRef, useEffect } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import DatePicker from 'react-date-picker';
import { format, parse } from 'date-fns';
import EditForm from '../components/EditForm';
import MarkdownDisplay from '../components/MarkdownDisplay';
import constants from '../constants';
import './Search.css';

const DEBOUNCE_TIME = 350;

const HIDE_EDIT_FORM = 0;
const SHOW_EDIT_FORM = 1;

const FILTER_MODE_ALL = 0;

// const FILTER_MODE_TAGGED = 1;
// const FILTER_MODE_UNTAGGED = 2;

let timeout;
function debounce(func, wait, immediate) {
  console.log('debouncing');
  return () => {
    const context = this;
    const args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const TextEntry = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [searchFilter, setSearchFilter] = useState(FILTER_MODE_ALL);
  const [formMode, setFormMode] = useState(HIDE_EDIT_FORM);
  const [entry, setEntry] = useState({});
  const [searchParams, setSearchParams] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const searchText = useRef({ value: '' });

  /**
   * Get blog entries for text search
   * @param  {string} text text to search for
   */
  async function getEntries() {
    console.log('getEntries#searchText:', searchText);
    const searchTextValue = searchText.current.value;
    try {
      const token = window.localStorage.getItem(constants.STORAGE_KEY);
      let endpoint = `${
        constants.REST_ENDPOINT
      }/api/posts/?searchParam=${encodeURIComponent(
        searchTextValue,
      )}&filterType=${searchFilter}`;
      if (startDate) {
        endpoint += `&startDate=${format(startDate, constants.FULL_DATE_FORMAT)}`;
      }
      if (endDate) {
        endpoint += `&endDate=${format(endDate, constants.FULL_DATE_FORMAT)}`;
      }
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Token': token,
        },
        referrerPolicy: 'no-referrer',
      });

      if (!response.ok) {
        console.log('response.status :', response.status);
        alert(`loading error : ${response.status}`);
      } else {
        const responseData = await response.json();

        console.log('result.responseData :>> ', responseData);

        setSearchParams(responseData.params);
        console.log(`setStartDate : ${responseData.params.startDate.length}`);
        setStartDate(
          responseData.params.startDate.length
            ? parse(responseData.params.startDate, constants.FULL_DATE_FORMAT, new Date())
            : null,
        );
        console.log(`setEndDate : ${responseData.params.endDate.length}`);
        setEndDate(
          responseData.params.endDate.length
            ? parse(responseData.params.endDate, constants.FULL_DATE_FORMAT, new Date())
            : null,
        );

        if (searchTextValue.length) {
          const reg = new RegExp(searchTextValue, 'gi');

          const foundHighlights = responseData.entries.map(entryLocal => {
            const highlighted = entryLocal.content.replace(reg, str => `<b>${str}</b>`);
            return { ...entryLocal, highlighted };
          });

          setPosts(foundHighlights);
        } else {
          setPosts(responseData.entries);
        }
      }
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }

  const debouncedSearch = debounce(getEntries, DEBOUNCE_TIME);

  function showEditForm(e, entryLocal) {
    e.preventDefault();
    console.log('id :', entryLocal.id);
    setFormMode(SHOW_EDIT_FORM);
    setEntry(entryLocal);
  }
  function showStartDateEdit() {
    setStartDate(new Date());
  }
  function showEndDateEdit() {
    setEndDate(new Date());
  }

  function resetEntryForm() {
    setFormMode(HIDE_EDIT_FORM);
    getEntries();
  }

  function showSearchSummary() {
    if (searchParams !== null) {
      return (
        <>
          Date:
          {' '}
          {searchParams.startDate !== '' ? searchParams.startDate : 'Beginning'}
          {' '}
          to
          {searchParams.endDate !== '' ? searchParams.endDate : 'Now'}
          ,Limit:
          {searchParams.resultsLimit}
          . Found
          {posts.length}
        </>
      );
    }
    return <>No Search Params</>;
  }

  function editForm() {
    return formMode === SHOW_EDIT_FORM ? (
      <EditForm entry={entry} onSuccess={() => resetEntryForm()} />
    ) : (
      <>a</>
    );
  }

  function showEntries() {
    return formMode !== SHOW_EDIT_FORM ? (
      <ul className="entriesList">
        {posts.length
          && posts.map(localEntry => {
            const content = searchText.current.value.length && localEntry.highlighted
              ? localEntry.highlighted
              : localEntry.content;
            let newText = content.replace(/<br \/>/g, '\n');
            newText = newText.replace(
              /..\/uploads/g,
              `${constants.UPLOAD_ROOT}`,
            );
            const dateFormated = format(
              parse(localEntry.date, constants.FULL_DATE_FORMAT, new Date()),
              'EEE, yyyy-MM-dd',
            );

            const showEntryDate = (
              <button
                type="button"
                onClick={e => showEditForm(e, localEntry)}
                className="plainLink"
              >
                {dateFormated}
              </button>
            );
            return (
              <li key={localEntry.id} className="blogEntry">
                {showEntryDate}
                |
                <MarkdownDisplay source={newText} escapeHtml={false} />
              </li>
            );
          })}
        {!posts.length && (
          <li>
            <h2>No Entries Found</h2>
          </li>
        )}
      </ul>
    ) : (
      ''
    );
  }

  useEffect(() => {
    const token = window.localStorage.getItem(constants.STORAGE_KEY);
    if (!token) {
      navigate('/login');
    }
    console.log('useEffect');

    debouncedSearch(searchText.current.value);
  }, [searchText.current.value, searchFilter]);

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <RouterNavLink to="/oneday">
          <i className="fa fa-home" />
          <span>Home</span>
        </RouterNavLink>
        <RouterNavLink to="/oneday?pageMode=1">
          {' '}
          <i className="fa fa-calendar-check" />
          <span>Same Day</span>
        </RouterNavLink>
        {constants.ENVIRONMENT === 'development' && <span style={{ color: 'red' }}>Development</span>}
      </nav>
      <h1>Text Searchs</h1>

      <section className="container">
        <input
          id="searchText"
          type="text"
          className="form-control"
          ref={searchText}
          placeholder="Search term"
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
          Start Date:
          {' '}
          {startDate ? (
            <DatePicker onChange={setStartDate} value={startDate} />
          ) : (
            <>
              None
              {' '}
              <button
                type="button"
                onClick={e => showStartDateEdit(e, entry)}
                className="plainLink"
              >
                Edit
              </button>
            </>
          )}
        </div>
        <div>
          End Date:
          {' '}
          {endDate ? (
            <DatePicker onChange={setEndDate} value={endDate} />
          ) : (
            <>
              None
              {' '}
              <button
                type="button"
                onClick={e => showEndDateEdit(e, entry)}
                className="plainLink"
              >
                Edit
              </button>
            </>
          )}
        </div>
        <span className="container">{showSearchSummary()}</span>
      </section>

      <section className="container">{editForm()}</section>

      <section className="container">{showEntries()}</section>

      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <RouterNavLink to="/upload" className="btn navbar-btn">
          <i className="fa fa-file-upload" />
          Upload Pix
        </RouterNavLink>
      </nav>
    </>
  );
};

export default TextEntry;

TextEntry.propTypes = {
  // entrys: PropTypes.array.isRequired,
  // editLink: PropTypes.func.isRequired,
};
