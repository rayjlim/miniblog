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

  const { editEntry, setEditEntry, pageDate, setPageDate, resetEntryForm, childRef}
    = useOneDay();

  const headerLinks = {
    search: true,
    oneday: pageMode === SAMEDAY,
    sameday: !pageMode || pageMode === ONEDAY,
  };
  const isOneDay = (!pageMode || pageMode === ONEDAY);

  return (
    <>
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
      <EntryList date={pageDate} isOneDay={isOneDay} onShowEdit={setEditEntry} ref={childRef}/>
      {isOneDay && <MovieList date={pageDate} />}
      {isOneDay && <Inspiration />}
      <Footer />
    </>
  );
};

export default OneDay;
