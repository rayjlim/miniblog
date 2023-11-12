import { useState, useRef, useEffect } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import DatePicker from 'react-date-picker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import {
  format, parse, subMonths, startOfMonth, endOfMonth,
} from 'date-fns';

import EditForm from '../components/EditForm';
import MarkdownDisplay from '../components/MarkdownDisplay';
import {
  DEFAULT_SEARCH_MONTHS_BACK,
  DISPLAY_DATE_FORMAT,
  FULL_DATE_FORMAT,
  REST_ENDPOINT,
  STORAGE_KEY,
  AUTH_HEADER
} from '../constants';
import Header from '../components/Header';
import Footer from '../components/Footer';
import debounce from '../utils/debounce';
import './Search.css';

const DEBOUNCE_TIME = 350;

const HIDE_EDIT_FORM = 0;
const SHOW_EDIT_FORM = 1;

const FILTER_MODE_ALL = 0;

// const FILTER_MODE_TAGGED = 1;
// const FILTER_MODE_UNTAGGED = 2;

const TextEntry = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [yearMonths, setYearMonths] = useState([]);
  const [searchFilter, setSearchFilter] = useState(FILTER_MODE_ALL);
  const [formMode, setFormMode] = useState(HIDE_EDIT_FORM);
  const [entry, setEntry] = useState({id: '0', content: '', date: ''});
  const [searchParams, setSearchParams] = useState<{startDate: string,
    endDate: string, resultsLimit?: number}>({startDate: '', endDate: ''});
  const [viewState, setViewState] = useState({ showStartDate: false,
    showEndDate: false });
  const searchText = useRef<HTMLInputElement>(null);
  const startDate = useRef<Date | null>(subMonths(new Date(), DEFAULT_SEARCH_MONTHS_BACK));
  const endDate = useRef<Date | null>(null);
  /**
   * The function `getEntries` is an asynchronous function that retrieves entries
   * from an API based on search parameters and updates the state with the results.
  * Get blog entries for text search
  */
  async function getEntries() {
    console.log('getEntries#searchText: ', searchText.current?.value);
    const searchTextValue = searchText.current?.value || '';
    try {
      const token = window.localStorage.getItem(STORAGE_KEY) || '';
      const encodedSearchText = encodeURIComponent(searchTextValue);
      let endpoint = `${
        REST_ENDPOINT
      }/api/posts/?searchParam=${encodedSearchText}&filterType=${searchFilter}`;
      if (startDate.current) {
        const formattedDate = format(startDate.current, FULL_DATE_FORMAT);
        endpoint += `&startDate=${formattedDate}`;
      }
      if (endDate.current) {
        const formattedEndDate = format(endDate.current, FULL_DATE_FORMAT);
        endpoint += `&endDate=${formattedEndDate}`;
      }
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set('Content-Type', 'application/json');
      requestHeaders.set(AUTH_HEADER, token);
      const response = await fetch(endpoint, {
        method: 'GET',
        cache: 'no-cache',
        headers: requestHeaders,
        referrerPolicy: 'no-referrer',
      });

      if (!response.ok) {
        console.log('response.status : ', response.status);
        throw new Error(`loading error : ${response.status}`);
      } else {
        const responseData = await response.json();
        console.log('result.responseData :>> ', responseData);

        setSearchParams(responseData.params);

        if (responseData.params.startDate !== '') {
          startDate.current = parse(
            responseData.params.startDate,
            FULL_DATE_FORMAT,
            new Date(),
          );
        } else {
          startDate.current = null;
        }

        if (responseData.params.endDate !== '') {
          endDate.current = parse(
            responseData.params.endDate,
            FULL_DATE_FORMAT,
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

          const foundHighlights = responseData.entries.map((entryLocal: any) => {
            const highlighted = entryLocal.content.replace(
              reg,
              (str: any) => `<b>${str}</b>`,
            );
            return { ...entryLocal, highlighted };
          });

          setPosts(foundHighlights);
        } else {
          setPosts(responseData.entries);
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err);
    }
  }

  async function getYearMonths() {
    console.log('getYearMonths');

    try {
      const token = window.localStorage.getItem(STORAGE_KEY) || '';
      const endpoint = `${REST_ENDPOINT}/api/yearMonth`;

      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set('Content-Type', 'application/json');
      requestHeaders.set(AUTH_HEADER, token);
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: requestHeaders,
        referrerPolicy: 'no-referrer',
      });

      if (!response.ok) {
        console.log('response.status :', response.status);
        throw new Error(`loading error : ${response.status}`);
      } else {
        const responseData = await response.json();

        setYearMonths(responseData.map((row: string) => ({ label: row, value: row })));
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err);
    }
  }

  const debouncedSearch = debounce(getEntries, DEBOUNCE_TIME);

  function showEditForm(e: any, entryLocal: any) {
    e.preventDefault();
    console.log('id :', entryLocal.id);
    setFormMode(SHOW_EDIT_FORM);
    setEntry(entryLocal);
  }

  function resetEntryForm(showToast: boolean) {
    if (showToast) {
      toast('Edit Done');
    }
    setFormMode(HIDE_EDIT_FORM);
    getEntries();
  }

  function changeDate(date: Date, type: string) {
    console.log('change date called', date, type);
    if (type === 'start') {
      const showStartDate = date !== null;
      setViewState({ ...viewState, showStartDate });
      startDate.current = date === null ? new Date('2000-01-01') : date;
    } else {
      const showEndDate = date !== null;
      setViewState({ ...viewState, showEndDate });
      endDate.current = date;
    }
    debouncedSearch();
  }

  useEffect(() => {
    const token = window.localStorage.getItem(STORAGE_KEY);
    if (!token) {
      navigate('/login');
    }
    console.log('useEffect');

    debouncedSearch();

    getYearMonths();
  }, [searchText.current?.value, searchFilter]);
  const headerLinks = {
    search: false,
    oneday: true,
    sameday: true
  };
  return (
    <>
      <ToastContainer />
      <Header links={headerLinks}/>

      <h1>Text Searchs</h1>

      <section className="container">
        <input
          id="searchText"
          type="text"
          className="form-control"
          ref={searchText}
          placeholder="Search term"
          onChange={() => debouncedSearch()}
        />
        Filter:
        <span>ALL: 0; TAGGED: 1; UNTAGGED: 2</span>
        <input
          type="text"
          className="form-control filterType"
          value={searchFilter}
          placeholder="Search term"
          onChange={e => setSearchFilter(parseInt(e.target.value))}
        />
        <div className="search-date-container">
          <div className="search-date-field">
            Start Date:
            {' '}
            {viewState.showStartDate ? (
              <DatePicker onChange={x => changeDate(x as Date, 'start')} value={startDate.current} />
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
          <div className="search-date-field">
            End Date:
            {' '}
            {viewState.showEndDate ? (
              <DatePicker onChange={x => changeDate(x as Date, 'end')} value={endDate.current} />
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
            onChange={(chosen: any) => {
              console.log(chosen);
              const parts = chosen?.value.split('-');
              changeDate(startOfMonth(new Date(parts[0], parts[1] - 1)), 'start');
              changeDate(endOfMonth(new Date(parts[0], parts[1] - 1)), 'end');
            }}
            // onInputChange={value => {
            //   console.log(value);
            // }}
          />
        </div>
        <div className="search-param-description">
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
                {posts.map((localEntry: any) => {
                  const content = searchText.current?.value.length

                    && localEntry.highlighted
                    ? localEntry.highlighted
                    : localEntry.content;

                  const dateFormated = format(
                    parse(
                      localEntry.date,
                      FULL_DATE_FORMAT,
                      new Date(),
                    ),
                    DISPLAY_DATE_FORMAT,
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
                      <RouterNavLink to={`/oneday?pageMode=0&date=${localEntry.date}`}>
                        {' '}
                        <i className="fa fa-calendar-check" title="Same Day" />
                      </RouterNavLink>
                      <div className="markdownDisplay">
                        <MarkdownDisplay source={content} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )
            : (
              <h2>No Entries Found</h2>
            ))}
      </section>

      <Footer />
    </>
  );
};

export default TextEntry;

TextEntry.propTypes = {
  // entrys: PropTypes.array.isRequired,
  // editLink: PropTypes.func.isRequired,
};
