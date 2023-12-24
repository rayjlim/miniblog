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

  const { entries, refs, editEntry, setEditEntry, pageDate, setPageDate, handleClick, resetEntryForm, isLoading, error }
    = useOneDay(pageMode || ONEDAY);

  const headerLinks = {
    search: true,
    oneday: pageMode === SAMEDAY,
    sameday: !pageMode || pageMode === ONEDAY,
  };
  const isOneDay = (!pageMode || pageMode === ONEDAY);

  if (isLoading) return <div>Load posts...</div>;
  if (error) return <div>An error occurred: {error?.message}</div>;

  return (
    <>
      <ToastContainer />
      <Header links={headerLinks} />

      <h1 className="view-head">
        {pageMode === SAMEDAY ? 'Same Day' : 'One Day'}
      </h1>

      <DateNav updateDate={setPageDate} date={pageDate} />
      <section className="container">
        {isOneDay && <WeightInfo date={pageDate} />}
        <AddEditForm
          date={pageDate}
          entry={editEntry}
          onSuccess={resetEntryForm}
        />
      </section>
      {/* page date to entry list and then do the query */}
      {entries && !editEntry &&
        <EntryList entries={entries} onShowEdit={setEditEntry} refs={refs} handleClick={handleClick}/>
      }
      {isOneDay && <MovieList date={pageDate} />}
      {isOneDay && <Inspiration />}
      <Footer />
    </>
  );
};

export default OneDay;
