import { format, parse } from 'date-fns';
import MarkdownDisplay from '../components/MarkdownDisplay';
import { FULL_DATE_FORMAT } from '../constants';
import '../Types';

const EntryList = ({
  entries,
  onShowEdit,
  refs
}: {
  entries: EntryType[],
  onShowEdit: (entry: EntryType) => void,
  refs: any
}) => {
  return (
    <section className="container">
      <ul className="entriesList">
        {entries.map((entry: EntryType) => (
          <li key={entry.id} ref={refs[entry.id]}>
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
