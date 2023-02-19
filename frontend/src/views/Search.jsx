import React, { useState, useRef, useEffect } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import DatePicker from 'react-date-picker';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import {
  format, parse, subMonths, startOfMonth, endOfMonth,
} from 'date-fns';
import EditForm from '../components/EditForm';
import MarkdownDisplay from '../components/MarkdownDisplay';
import constants from '../constants';

import './ribbon.css';
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
  const [yearMonths, setYearMonths] = useState([]);
  const [searchFilter, setSearchFilter] = useState(FILTER_MODE_ALL);
  const [formMode, setFormMode] = useState(HIDE_EDIT_FORM);
  const [entry, setEntry] = useState({});
  const [searchParams, setSearchParams] = useState(null);
  const [viewState, setViewState] = useState({ showStartDate: false, showEndDate: false });
  const searchText = useRef({ value: '' });
  const startDate = useRef(subMonths(new Date(), 3));
  const endDate = useRef();

  /**
   * Get blog entries for text search
   * @param  {string} text text to search for
   */
  async function getEntries() {
    console.log('getEntries#searchText: ', searchText.current.value);
    const searchTextValue = searchText.current.value;
    try {
      const token = window.localStorage.getItem(constants.STORAGE_KEY);
      let endpoint = `${
        constants.REST_ENDPOINT
      }/api/posts/?searchParam=${encodeURIComponent(
        searchTextValue,
      )}&filterType=${searchFilter}`;
      if (startDate.current) {
        endpoint += `&startDate=${format(
          startDate.current,
          constants.FULL_DATE_FORMAT,
        )}`;
      }
      if (endDate.current) {
        endpoint += `&endDate=${format(endDate.current, constants.FULL_DATE_FORMAT)}`;
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
        throw new Error(`loading error : ${response.status}`);
      } else {
        const responseData = await response.json();

        console.log('result.responseData :>> ', responseData);

        setSearchParams(responseData.params);

        if (responseData.params.startDate !== '') {
          startDate.current = parse(
            responseData.params.startDate,
            constants.FULL_DATE_FORMAT,
            new Date(),
          );
        } else {
          startDate.current = null;
        }

        if (responseData.params.endDate !== '') {
          endDate.current = parse(
            responseData.params.endDate,
            constants.FULL_DATE_FORMAT,
            new Date(),
          );
        } else {
          endDate.current = null;
        }

        setViewState({
          ...viewState,
          showStartDate: responseData.params.startDate !== '',
          showEndDate: responseData.params.endDate !== '',
        });
        if (searchTextValue.length) {
          const reg = new RegExp(searchTextValue, 'gi');

          const foundHighlights = responseData.entries.map(entryLocal => {
            const highlighted = entryLocal.content.replace(
              reg,
              str => `<b>${str}</b>`,
            );
            return { ...entryLocal, highlighted };
          });

          setPosts(foundHighlights);
        } else {
          setPosts(responseData.entries);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  }

  async function getYearMonths() {
    console.log('getYearMonths');

    try {
      const token = window.localStorage.getItem(constants.STORAGE_KEY);
      const endpoint = `${constants.REST_ENDPOINT}/api/yearMonth`;

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
        throw new Error(`loading error : ${response.status}`);
      } else {
        const responseData = await response.json();

        setYearMonths(responseData.map(row => ({ label: row, value: row })));
      }
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  }

  const debouncedSearch = debounce(getEntries, DEBOUNCE_TIME);

  function showEditForm(e, entryLocal) {
    e.preventDefault();
    console.log('id :', entryLocal.id);
    setFormMode(SHOW_EDIT_FORM);
    setEntry(entryLocal);
  }

  function resetEntryForm(showToast) {
    if (showToast) {
      toast('Edit Done');
    }
    setFormMode(HIDE_EDIT_FORM);
    getEntries();
  }

  function changeDate(date, type) {
    console.log('change date called', date, type);
    if (type === 'start') {
      const showStartDate = date !== null;
      setViewState({ ...viewState, showStartDate });
      startDate.current = date === null ? new Date('2000-01-01') : date; // TODO: fix search override 3 month default in the backend
    } else {
      const showEndDate = date !== null;
      setViewState({ ...viewState, showEndDate });
      endDate.current = date;
    }
    debouncedSearch();
  }

  useEffect(() => {
    const token = window.localStorage.getItem(constants.STORAGE_KEY);
    if (!token) {
      navigate('/login');
    }
    console.log('useEffect');

    debouncedSearch();

    getYearMonths();
  }, [searchText.current.value, searchFilter]);

  return (
    <>
      {constants.ENVIRONMENT === 'development' && (
        <a
          className="github-fork-ribbon"
          href="https://url.to-your.repo"
          data-ribbon="Development"
          title="Development"
        >
          Development
        </a>
      )}
      <ToastContainer />
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
      </nav>
      <h1>Text Searchs</h1>

      <section className="container">
        <input
          id="searchText"
          type="text"
          className="form-control"
          ref={searchText}
          placeholder="Search term"
          onChange={() => debouncedSearch(searchText.current.value)}
        />
        Filter:
        <span>ALL: 0; TAGGED: 1; UNTAGGED: 2</span>
        <input
          id="filterId"
          type="text"
          className="form-control filterType"
          value={searchFilter}
          placeholder="Search term"
          onChange={e => setSearchFilter(e.target.value)}
          style={{ display: 'inline', margin: '0 1em' }}
        />
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ padding: '0 0.5em' }}>
            Start Date:
            {' '}
            {viewState.showStartDate ? (
              <DatePicker onChange={x => changeDate(x, 'start')} value={startDate.current} />
            ) : (
              <>
                None
                {' '}
                <button
                  type="button"
                  onClick={() => changeDate(new Date(), 'start')}
                  className="plainLink"
                >
                  Edit
                </button>
              </>
            )}
          </div>
          <div style={{ padding: '0 0.5em' }}>
            End Date:
            {' '}
            {viewState.showEndDate ? (
              <DatePicker onChange={x => changeDate(x, 'end')} value={endDate.current} />
            ) : (
              <>
                None
                {' '}
                <button
                  type="button"
                  onClick={() => changeDate(new Date(), 'end')}
                  className="plainLink"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={() => {
              changeDate(subMonths(new Date(), 3), 'start');
              changeDate(new Date(), 'end');
            }}
            className="plainLink rangeBtn"
          >
            3 mths
          </button>
          <button
            type="button"
            onClick={() => {
              changeDate(subMonths(new Date(), 6), 'start');
              changeDate(new Date(), 'end');
            }}
            className="plainLink rangeBtn"
          >
            6 mths
          </button>
          <button
            type="button"
            onClick={() => {
              changeDate(subMonths(new Date(), 12), 'start');
              changeDate(new Date(), 'end');
            }}
            className="plainLink rangeBtn"
          >
            12 mths
          </button>
          <Select
            options={yearMonths}
            onChange={chosen => {
              console.log(chosen);
              const parts = chosen.value.split('-');
              changeDate(startOfMonth(new Date(parts[0], parts[1] - 1)), 'start');
              changeDate(endOfMonth(new Date(parts[0], parts[1] - 1)), 'end');
            }}
            // onInputChange={value => {
            //   console.log(value);
            // }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          { searchParams !== null
            ? (
              <>
                Date:
                {' '}
                {searchParams.startDate !== '' ? searchParams.startDate : 'Beginning'}
                {' '}
                to
                {' '}
                {searchParams.endDate !== '' ? searchParams.endDate : 'Now'}
                , Limit:
                {' '}
                {searchParams.resultsLimit}
                . Found
                {' '}
                {posts.length}
              </>
            )
            : (<>No Search Params</>)}
        </div>
      </section>

      {formMode === SHOW_EDIT_FORM && (
        <section className="container">
          <EditForm entry={entry} onSuccess={msg => resetEntryForm(msg)} />
        </section>
      )}
      <section className="container">
        {formMode !== SHOW_EDIT_FORM && (
          posts.length
            ? (
              <ul className="entriesList">
                {posts.map(localEntry => {
                  const content = searchText.current.value.length
                    && localEntry.highlighted
                    ? localEntry.highlighted
                    : localEntry.content;

                  const dateFormated = format(
                    parse(
                      localEntry.date,
                      constants.FULL_DATE_FORMAT,
                      new Date(),
                    ),
                    constants.DISPLAY_DATE_FORMAT,
                  );

                  return (
                    <li key={localEntry.id}>
                      <button
                        type="button"
                        onClick={e => showEditForm(e, localEntry)}
                        className="plainLink margin-rt-1"
                      >
                        {dateFormated}
                      </button>
                      <RouterNavLink to={`/oneday?pageMode=1&date=${localEntry.date}`}>
                        {' '}
                        <i className="fa fa-calendar-check" title="Same Day" />
                      </RouterNavLink>
                      <MarkdownDisplay source={content} escapeHtml={false} />
                    </li>
                  );
                })}
              </ul>
            )
            : (
              <h2>No Entries Found</h2>
            ))}
      </section>

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
