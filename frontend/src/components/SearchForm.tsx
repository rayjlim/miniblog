import { format, subYears, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import Select from 'react-select';

import { FULL_DATE_FORMAT } from '../constants';
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
      <input type="button" onClick={() => {
        const target = searchText?.current || { value: '' };
        target.value = '';
        debouncedSearch();
      }} value="Clear"/>
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
            <input type="date" value={startDate.current || ''} onChange={e => changeDate(e.target.value, 'start')} />
          ) : (
            <>
              None
              {' '}
              <button
                type="button"
                onClick={() => changeDate('', 'start')}
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
            <input type="date" onChange={e => changeDate(e.target.value, 'end')} value={endDate.current || ''} />
          ) : (
            <>
              {`None `}
              <button
                type="button"
                onClick={() => changeDate(format(new Date(), FULL_DATE_FORMAT), 'end')}
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
            changeDate(format(subMonths(new Date(), 3), FULL_DATE_FORMAT), 'start');
            changeDate(format(new Date(), FULL_DATE_FORMAT), 'end');
          }}
          className="plainLink rangeBtn"
        >
          3 mths
        </button>
        <button
          type="button"
          onClick={() => {
            changeDate(format(subMonths(new Date(), 6), FULL_DATE_FORMAT), 'start');
            changeDate(format(new Date(), FULL_DATE_FORMAT), 'end');
          }}
          className="plainLink rangeBtn"
        >
          6 mths
        </button>
        <button
          type="button"
          onClick={() => {
            changeDate(format(subMonths(new Date(), 12), FULL_DATE_FORMAT), 'start');
            changeDate(format(new Date(), FULL_DATE_FORMAT), 'end');
          }}
          className="plainLink rangeBtn"
        >
          12 mths
        </button>
        <button
          type="button"
          onClick={() => {
            changeDate(format(new Date('1998-01-01'), FULL_DATE_FORMAT), 'start');
            changeDate(format(new Date(), FULL_DATE_FORMAT), 'end');
          }}
          className="plainLink rangeBtn"
        >
          All
        </button>
        <Select
          options={yearMonths}
          onChange={(chosen: any) => {
            const parts = chosen?.value.split('-');
            changeDate(format(startOfMonth(new Date(parts[0], parts[1] - 1)), FULL_DATE_FORMAT), 'start');
            changeDate(format(endOfMonth(new Date(parts[0], parts[1] - 1)), FULL_DATE_FORMAT), 'end');
          }}
        />
      </div>

    </>
  );
};
export default SearchForm;

