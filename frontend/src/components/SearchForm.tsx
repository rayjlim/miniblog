import { format, subMonths } from 'date-fns';
import { FULL_DATE_FORMAT } from '../constants';
import YearMonthSelector from './YearMonthSelector';
import useSearchForm from '../hooks/useSearchForm';
import { SearchParamsType } from '../Types';
import { useCallback, useRef } from 'react';
import './SearchForm.css';

interface SearchFormProps {
  params: SearchParamsType;
  setSearchParams: (params: SearchParamsType) => void;
}

const SearchForm = ({ params, setSearchParams }: SearchFormProps) => {
  const {
    searchText,
    changeText,
    startDate,
    endDate,
    changeDate,
    searchFilter,
    setSearchFilter
  } = useSearchForm(params, setSearchParams);
  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (searchText.current) {
      searchText.current.value = '';
      changeText(new Event('submit') as any);
    }
  };

  const setDateRange = (months: number) => {
    const end = format(new Date(), FULL_DATE_FORMAT);
    const start = format(
      months === 0 ? new Date('1998-01-01') : subMonths(new Date(), months),
      FULL_DATE_FORMAT
    );
    changeDate(start, 'start');
    changeDate(end, 'end');
  };

  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedSearch = useCallback((event: Event) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      return changeText(event as any);
    }, 300);
  }, [changeText]);

  return (
    <form className="search-form" onSubmit={changeText}>
        <div className="search-container">
          <input
            id="searchText"
            type="text"
            className="search-input"
            ref={searchText}
            placeholder="Search term"
            onChange={(e) => debouncedSearch(e.nativeEvent)}
          />
          <div className="button-group">
            <button type="submit" className="btn success">
              Search
            </button>
            <button type="button" className="btn attention" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        <div className="filter-container">
          <select
            className="filter-select"
            value={searchFilter}
            onChange={e => setSearchFilter(parseInt(e.target.value))}
          >
            <option value="0">All</option>
            <option value="1">Tagged</option>
            <option value="2">Untagged</option>
          </select>
          <input
            type="text"
            className="limit-input"
            name="limit"
            value={params.resultsLimit?.toString() || '50'}
            onChange={e => {
              const value = e.target.value.trim();
              const limit = value ? parseInt(value) : undefined;
              setSearchParams({ ...params, resultsLimit: limit });
            }}
          />
        </div>

        <div className="date-container">
          <div className="date-field">
            <label className="date-label" style={{ whiteSpace: 'nowrap' }}>Start Date:</label>
            {startDate.current ? (
              <input
                type="date"
                value={startDate.current}
                onChange={e => changeDate(e.target.value, 'start')}
              />
            ) : (
              <button
                type="button"
                onClick={() => changeDate('', 'start')}
                className="btn link"
              >
                Set Start Date
              </button>
            )}
          </div>

          <div className="date-field">
            <label className="date-label" style={{ whiteSpace: 'nowrap' }}>End Date:</label>
            {endDate.current ? (
              <input
                type="date"
                value={endDate.current}
                onChange={e => changeDate(e.target.value, 'end')}
              />
            ) : (
              <button
                type="button"
                onClick={() => changeDate(format(new Date(), FULL_DATE_FORMAT), 'end')}
                className="btn link"
              >
                Set End Date
              </button>
            )}
          </div>
        </div>

        <div className="month-buttons">
          {[3, 6, 12, 0].map(months => (
            <button
              key={months}
              type="button"
              onClick={() => setDateRange(months)}
              className="btn outline"
              style={{ whiteSpace: 'nowrap' }}
            >
              {months === 0 ? 'All' : `${months} mths`}
            </button>
          ))}
          <YearMonthSelector changeDate={changeDate} />
        </div>
    </form>
  );
};

export default SearchForm;

