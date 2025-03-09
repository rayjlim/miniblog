import DateNav from '../components/DateNav';
import AddEditForm from '../components/AddEditForm';
import EntryList from '../components/EntryList';
import MovieList from '../components/MovieList';
import Inspiration from '../components/Inspiration';
import WeightInfo from '../components/WeightInfo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SAMEDAY, ONEDAY } from '../constants';
import './OneDay.css';
import useOneDay from '../hooks/useOneDay';

const OneDay = ({ pageMode }: { pageMode?: number }) => {
  const { editEntry, setEditEntry, pageDate, setPageDate, resetEntryForm, childRef }
    = useOneDay(pageMode || ONEDAY);

  const headerLinks = {
    search: true,
    oneday: pageMode === SAMEDAY,
    sameday: !pageMode || pageMode === ONEDAY,
  };
  const isOneDay = (!pageMode || pageMode === ONEDAY);

  return (
    <>
      <Header links={headerLinks} />

      <h1 className="view-head" title="Alt + o : Open OneDay [search]
Alt + f : Open Search [one day]
Alt + t : Go to Top [one day, search]
Alt + b : Go to Bottom [one day, search]
Alt + s : Save [Edit mode, Add mode]
Escape  : Cancel [Edit mode, Add mode]
Alt + , : Prev Day [one day]
Alt + . : Next Day [one day]
Alt + 1 : Add or Edit first entry [one day]
Alt + [ ' Get new prompt [one day]
Alt + p ' Populate Add form with Prompt [one day] ">
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
      <EntryList date={pageDate} isOneDay={isOneDay} onShowEdit={setEditEntry} ref={childRef as any} />
      {isOneDay && <MovieList date={pageDate} />}
      {isOneDay && <Inspiration />}
      <Footer />
    </>
  );
};

export default OneDay;
