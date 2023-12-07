import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateNav from '../components/DateNav';
import AddEditForm from '../components/AddEditForm';
import EntryList from '../components/EntryList';
import MovieList from '../components/MovieList';
import Inspiration from '../components/Inspiration';
import WeightInfo from '../components/WeightInfo';
import Header from '../components/Header';
import Footer from '../components/Footer';

import './OneDay.css';
import useOneDay from '../hooks/useOneDay';

const ONEDAY = 0;
const SAMEDAY = 1;

const OneDay = ({ pageMode }: { pageMode?: number }) => {

  const { editEntry, setEditEntry, pageDate, setPageDate, entries, handleClick, refs, resetEntryForm }
    = useOneDay(pageMode || ONEDAY);

  const headerLinks = {
    search: true,
    oneday: pageMode === SAMEDAY,
    sameday: !pageMode || pageMode === ONEDAY,
  };
  const isOneDay = (!pageMode || pageMode === ONEDAY);

  return (
    <>
      <ToastContainer />
      <Header links={headerLinks} />

      <h1 className="view-head">
        {pageMode === SAMEDAY ? 'Same Day' : 'One Day'}
      </h1>

      <DateNav updateDate={setPageDate} date={pageDate} />
      <ul className="noshow">
        {entries.map((item: EntryType) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => handleClick(item.id)}
              id={`btn${item.id}`}
            >
              Scroll Item {item.id} Into View
            </button>
          </li>
        ))}
      </ul>
      <section className="container">
        {isOneDay && <WeightInfo date={pageDate} />}
        <AddEditForm
          date={pageDate}
          entry={editEntry}
          onSuccess={resetEntryForm}
        />
      </section>
      {!editEntry &&
        <EntryList entries={entries} onShowEdit={setEditEntry} refs={refs} />
      }
      {isOneDay && <MovieList date={pageDate} />}
      {isOneDay && <Inspiration />}
      <Footer />
    </>
  );
};

export default OneDay;
