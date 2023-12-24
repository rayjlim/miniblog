import { format, parse } from 'date-fns';
import MarkdownDisplay from '../components/MarkdownDisplay';
import { FULL_DATE_FORMAT } from '../constants';
import '../Types';

const EntryList = ({
  entries,
  onShowEdit,
  refs,
  handleClick
}: {
  entries: EntryType[],
  onShowEdit: (entry: EntryType) => void,
  refs: any,
  handleClick: (id: number) => void
}) => {
  return (
    <section className="container">
      <ul className="entriesList">
        {entries.map((entry: EntryType) => (
          <li key={entry.id} ref={refs[entry.id]}>
            <button
            className="noshow"
              type="button"
              onClick={() => handleClick(entry.id)}
              id={`btn${entry.id}`}
            >
              Scroll entry {entry.id} Into View
            </button>
            <button
              onClick={() => onShowEdit(entry)}
              className="plainLink"
              type="button"
            >
              {format(
                parse(entry.date, FULL_DATE_FORMAT, new Date()),
                'EEE MM, dd yyyy'
              )}
            </button>
            <div className="markdownDisplay">
              <MarkdownDisplay source={entry.content} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default EntryList;
