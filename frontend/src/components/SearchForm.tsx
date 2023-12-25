import { format, subMonths } from 'date-fns';
import { FULL_DATE_FORMAT } from '../constants';
import YearMonthSelector from './YearMonthSelector';
import useSearchForm from '../hooks/useSearchForm';
import '../Types';

const SearchForm = ({ params, setSearchParams }:
  { params: SearchParamsType, setSearchParams: (params: SearchParamsType) => void }) => {
  const { searchText, changeText, startDate, endDate, changeDate, searchFilter, setSearchFilter }
    = useSearchForm(params, setSearchParams);

  return (
    <>
      <div className="flex-row">
        <input
          id="searchText"
          type="text"
          className="form-control"
          ref={searchText}
          placeholder="Search term"
        />
        <input type="button" onClick={() => {
          changeText();
        }} value="send" />
        <input type="button" onClick={() => {
          const target = searchText?.current || { value: '' };
          target.value = '';
          changeText();
        }} value="Clear" />

        <select name="filterType" onChange={e => setSearchFilter(parseInt(e.target.value))}
          value={searchFilter}>
          <option value="0">All</option>
          <option value="1">Tagged</option>
          <option value="2">Untagged</option>
        </select>
      </div>
      <div className="search-date-container">
        <div className="search-date-field">
          {'Start Date: '}
          {startDate.current !== '' ? (
            <input type="date" value={startDate.current || ''} onChange={e => changeDate(e.target.value, 'start')} />
          ) : (
            <>
              {'None '}
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
          {'End Date: '}
          {endDate.current !== '' ? (
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
        <YearMonthSelector changeDate={changeDate}/>
      </div>

    </>
  );
};
export default SearchForm;

