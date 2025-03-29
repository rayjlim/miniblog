import { format, subMonths } from 'date-fns';
import { FULL_DATE_FORMAT } from '../constants';
import YearMonthSelector from './YearMonthSelector';
import useSearchForm from '../hooks/useSearchForm';
import { SearchParamsType } from '../Types';
import { useCallback, useRef } from 'react';

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
    <form className="search-form mb-1" onSubmit={changeText} style={{ overflow: 'visible' }}>
      <input
        id="searchText"
        type="text"
        className="form-control"
        ref={searchText}
        placeholder="Search term"
        onChange={(e) => debouncedSearch(e.nativeEvent)}
      />
      <div className="d-flex gap-3">
        <button
          type="submit"
          style={{ height: '2.5rem' }}
          className="btn btn-primary success"
        >
          Search
        </button>
        <button
          type="button"
          style={{ height: '2.5rem' }}
          className="btn btn-secondary attention"
          onClick={handleClear}
        >
          Clear
        </button>
        <select
          className="form-select w-auto"
          style={{ width: '8rem', display: 'inline' }}
          value={searchFilter}
          onChange={e => setSearchFilter(parseInt(e.target.value))}
        >
          <option value="0">All</option>
          <option value="1">Tagged</option>
          <option value="2">Untagged</option>
        </select>
        <input type="text"
          style={{ width: '4rem', display: 'inline' }}
          className="form-control"
          name="limit"
          value={params.resultsLimit?.toString() || '50'}
          onChange={e => {
            const value = e.target.value.trim();
            const limit = value ? parseInt(value) : undefined;
            setSearchParams({ ...params, resultsLimit: limit });
          }}
        />
      </div>
      <div className="search-date-container d-flex gap-4">
        <div className="search-date-field">
          <span className="me-2">Start Date:</span>
          {startDate.current ? (
            <input
              type="date"
              className="form-control"
              value={startDate.current}
              onChange={e => changeDate(e.target.value, 'start')}
            />
          ) : (
            <button
              type="button"
              onClick={() => changeDate('', 'start')}
              className="btn btn-link p-0"
            >
              Set Start Date
            </button>
          )}
        </div>

        <div className="search-date-field">
          <span className="me-2">End Date:</span>
          {endDate.current ? (
            <input
              type="date"
              className="form-control"
              value={endDate.current}
              onChange={e => changeDate(e.target.value, 'end')}
            />
          ) : (
            <button
              type="button"
              onClick={() => changeDate(format(new Date(), FULL_DATE_FORMAT), 'end')}
              className="btn btn-link p-0"
            >
              Set End Date
            </button>
          )}
        </div>
      </div>

      <div className="d-flex gap-2">
        {[3, 6, 12, 0].map(months => (
          <button
            key={months}
            type="button"
            onClick={() => setDateRange(months)}
            className="btn btn-outline-secondary"
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

