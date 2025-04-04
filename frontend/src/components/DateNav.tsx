import useDateNav from '../hooks/useDateNav';

const DateNav = ({ updateDate, date }: { updateDate: (date: string) => void, date: string }) => {
  const { inputDate, handleButtonDirection, updateDateInput } = useDateNav(updateDate, date);

  return (
    <>
      <div className="grid-3mw container col-3">
        <button
          onClick={e => handleButtonDirection(e)}
          className="btn btn-info btn-lrg success"
          value="-1"
          id="prevBtn"
          type="button"
          title="alt + comma"
        >
          <i className="fa fa-chevron-left" />
          Prev
        </button>
        <div>
          <input
            type="date"
            className="form-control"
            onChange={e => updateDateInput(e)}
            aria-label="date-input"
            ref={inputDate}
          />

        </div>

        <button
          onClick={e => handleButtonDirection(e)}
          className="btn btn-success btn-lrg attention"
          value="1"
          id="nextBtn"
          type="button"
          title="alt + period"
        >
          Next

          <i className="fa fa-chevron-right" />
        </button>
      </div>
      <button
        onClick={e => handleButtonDirection(e)}
        className="btn btn-warning btn-lrg"
        value="today"
        type="button"
      >
        Today
      </button>
    </>
  );
};

export default DateNav;
