import { ToastContainer } from 'react-toastify';

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

  const { editEntry, setEditEntry, pageDate, setPageDate, entries, loadDay }
    = useOneDay(pageMode || ONEDAY);

  const headerLinks = {
    search: true,
    oneday: pageMode === SAMEDAY,
    sameday: !pageMode || pageMode === ONEDAY,
  };
  return (
    <>
      <ToastContainer />
      <Header links={headerLinks} />

      {pageMode === ONEDAY && <h1>One Day</h1>}
      {pageMode === SAMEDAY && <h1>Same Day</h1>}

      <DateNav updateDate={setPageDate} date={pageDate} />

      <section className="container">
        {pageMode === ONEDAY && <WeightInfo date={pageDate} />}
        <AddEditForm
          date={pageDate}
          entry={editEntry}
          onSuccess={loadDay}
        />
      </section>

      <EntryList entries={entries} showEditForm={setEditEntry} />

      {pageMode === ONEDAY && <MovieList date={pageDate} />}
      {pageMode === ONEDAY && <Inspiration />}
      <Footer />
    </>
  );
};

export default OneDay;
