import useDateNav from '../hooks/useDateNav';

const DateNav = ({ updateDate, date }: { updateDate: (date: string) => void, date: string }) => {
  const { inputDate, handleButtonDirection, updateDateInput } = useDateNav(updateDate, date);

  return (
    <div className="grid-3mw container">
      <button
        onClick={e => handleButtonDirection(e)}
        className="btn btn-info btn-lrg"
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
          type="text"
          className="form-control"
          id="formDpInput"
          onChange={e => updateDateInput(e)}
          ref={inputDate}
        />
      </div>

      <button
        onClick={e => handleButtonDirection(e)}
        className="btn btn-success btn-lrg"
        value="1"
        id="nextBtn"
        type="button"
        title="alt + period"
      >
        Next
        <i className="fa fa-chevron-right" />
      </button>
      <button
        onClick={e => handleButtonDirection(e)}
        className="btn btn-warning btn-lrg"
        value="today"
        type="button"
      >
        Today
      </button>
    </div>);
};

export default DateNav;
