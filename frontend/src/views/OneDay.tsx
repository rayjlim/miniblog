import { memo, useMemo } from 'react';
import DateNav from '../components/DateNav';
import AddEditForm from '../components/AddEditForm';
import EntryList from '../components/EntryList';
import MovieList from '../components/MovieList';
import Inspiration from '../components/Inspiration';
import WeightInfo from '../components/WeightInfo';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SAMEDAY, ONEDAY } from '../constants';
import useOneDay from '../hooks/useOneDay';
import './OneDay.css';

interface OneDayProps {
  pageMode?: number;
}

const KEYBOARD_SHORTCUTS = {
  'Alt + o': 'Open OneDay [search]',
  'Alt + f': 'Open Search [one day]',
  'Alt + t': 'Go to Top [one day, search]',
  'Alt + b': 'Go to Bottom [one day, search]',
  'Alt + s': 'Save [Edit mode, Add mode]',
  'Escape': 'Cancel [Edit mode, Add mode]',
  'Alt + ,': 'Prev Day [one day]',
  'Alt + .': 'Next Day [one day]',
  'Alt + 1': 'Add or Edit first entry [one day]',
  'Alt + [': 'Get new prompt [one day]',
  'Alt + p': 'Populate Add form with Prompt [one day]',
};

const OneDay = memo(({ pageMode = ONEDAY }: OneDayProps) => {
  const {
    editEntry,
    setEditEntry,
    pageDate,
    setPageDate,
    resetEntryForm,
    childRef
  } = useOneDay(pageMode);

  const headerLinks = useMemo(() => ({
    search: true,
    oneday: pageMode === SAMEDAY,
    sameday: pageMode === ONEDAY,
  }), [pageMode]);

  const isOneDay = pageMode === ONEDAY;
  const shortcutsTitle = Object.entries(KEYBOARD_SHORTCUTS)
    .map(([key, value]) => `${key} : ${value}`)
    .join('\n');

  return (
    <div className="oneday-container">
      <Header links={headerLinks} />

      <main>
        <h1
          className="view-head"
          title={shortcutsTitle}
          aria-label={pageMode === SAMEDAY ? 'Same Day View' : 'One Day View'}
        >
          {pageMode === SAMEDAY ? 'Same Day' : 'One Day'}
        </h1>

        <DateNav
          updateDate={setPageDate}
          date={pageDate}
        />

        <section className="container" aria-label="Daily Content">
          {isOneDay && <WeightInfo date={pageDate} />}
          <AddEditForm
            date={pageDate}
            entry={editEntry}
            onSuccess={resetEntryForm}
          />
        </section>

        <EntryList
          date={pageDate}
          isOneDay={isOneDay}
          onShowEdit={setEditEntry}
          ref={childRef as unknown as any}
        />

        {isOneDay && (
          <>
            <MovieList date={pageDate} />
            <Inspiration />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
});

OneDay.displayName = 'OneDay';

export default OneDay;
