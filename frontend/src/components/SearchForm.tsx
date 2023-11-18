import { subMonths, startOfMonth, endOfMonth } from 'date-fns';
import DatePicker from 'react-date-picker';
import Select from 'react-select';

import useSearchForm from '../hooks/useSearchForm';

const SearchForm = ({ setPosts, setSearchParams }: {
  setPosts: (entries: EntryType[]) => void,
  setSearchParams: (params: any) => void
}) => {
  const { searchText, yearMonths, startDateValue, startDate, endDateValue,
    endDate, searchFilter, setSearchFilter, changeDate, debouncedSearch }
    = useSearchForm(setPosts, setSearchParams);

  return (
    <>
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
          {startDateValue !== '' ? (
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
          {endDateValue !== '' ? (
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
            const parts = chosen?.value.split('-');
            changeDate(startOfMonth(new Date(parts[0], parts[1] - 1)), 'start');
            changeDate(endOfMonth(new Date(parts[0], parts[1] - 1)), 'end');
          }}
        />
      </div>

    </>
  );
};
export default SearchForm;

