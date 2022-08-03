/* eslint-disable react/no-danger */
import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { format, parse } from 'date-fns';
import marked from 'marked';
import constants from '../constants';

// Override function
const renderer = {
  code(code, infostring, escaped) {
    const lang = (infostring || '').match(/\S*/)[0];
    let escapedCode = escaped;
    let codeOutput = code;
    console.log(code);
    console.log(this.options);
    console.log(lang);
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escapedCode = true;
        codeOutput = out;
      }
    }
    const output = escapedCode ? codeOutput : escape(codeOutput, true);
    if (!lang) {
      return (
        `<pre><code>no lang${output}</code></pre>\n`
      );
    }

    return (
      `<pre><code class="${this.options.langPrefix}">${escape(lang, true)}${output}</code></pre>\n`
    );
  },
};

marked.use({ renderer });

const EntryList = ({ entrys, editLink }) => {
  console.log(entrys);
  return (
    <ul className="col-sm-12 list-group ">
      {entrys.map(entry => {
        const newText = entry.displayContent.replace(/<br \/>/g, '\n');
        const dateFormated = format(parse(entry.date, constants.FULL_DATE_FORMAT, new Date()), 'EEE, yyyy-MM-dd');
        const calLinkDate = `posts/?gotoYearMonth=${
          format(parse(entry.date, constants.FULL_DATE_FORMAT, new Date()), 'yyyy-MM')}`;
        const oneDayLink = `main#/oneDay?date=${
          format(parse(entry.date, constants.FULL_DATE_FORMAT, new Date()), constants.FULL_DATE_FORMAT)}`;
        let showEntryDate = <a href={oneDayLink}>{dateFormated}</a>;
        // <a onclick={e=> {location.href=`main#/oneDay?date=${dateFormated}`}}>{dateFormated}</a>);
        if (editLink) {
          showEntryDate = (
            <button
              onClick={e => {
                e.preventDefault();
                editLink(entry);
              }}
              type="button"
            >
              { format(parse(entry.date, constants.FULL_DATE_FORMAT, new Date()), 'EEE MMM, dd yyyy')}
            </button>
          );
        }

        return (
          <li key={entry.id} className="blogEntry">
            {showEntryDate}
            |
            <a href={calLinkDate}>Cal</a>
            |
            <div dangerouslySetInnerHTML={newText} />
          </li>
        );
      })}
    </ul>
  );
};

export default EntryList;

EntryList.propTypes = {
  entrys: PropTypes.array.isRequired,
  editLink: PropTypes.func.isRequired,
};
