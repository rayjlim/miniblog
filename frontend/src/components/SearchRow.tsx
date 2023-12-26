import { NavLink as RouterNavLink } from 'react-router-dom';
import { format, parse } from 'date-fns';
import MarkdownDisplay from '../components/MarkdownDisplay';
import { DISPLAY_DATE_FORMAT, FULL_DATE_FORMAT } from '../constants';

const SearchRow = ({ searchText, entry, showEditForm }:
  {
    searchText: string, entry: EntryType, showEditForm: (entry: EntryType) => void
  }) => {

  const dateFormated = format(parse(entry.date, FULL_DATE_FORMAT, new Date()),
    DISPLAY_DATE_FORMAT);

  const highlightSearchText = (searchTextValue: string, entryLocal: EntryType) => {
    const reg = new RegExp(searchTextValue, 'gi');
    return entryLocal.content.replace(reg, (str: any) => `<b>${str}</b>`);
  }
  const content = searchText.length
    ? highlightSearchText(searchText, entry)
    : entry.content;

  return (
    <li key={entry.id} id={`li${entry.id}`}>
      <button
        type="button"
        onClick={() => showEditForm(entry)}
        className="plainLink margin-rt-1"
      >
        {dateFormated}
      </button>
      <RouterNavLink to={`/oneday/${entry.date}`}>
        <i className="fa fa-calendar-check icon-one-day" title="One Day" />
      </RouterNavLink>
      <div className="markdownDisplay">
        <MarkdownDisplay source={content} />
      </div>
    </li>
  );
}

export default SearchRow;
