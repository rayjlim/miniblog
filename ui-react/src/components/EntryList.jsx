import React from 'react'; // eslint-disable-line no-unused-vars

import moment from 'moment';
import marked from 'marked';

// Override function
const renderer = {
  code(code, infostring, escaped) {
    const lang = (infostring || '').match(/\S*/)[0];
    console.log(code);
    console.log(this.options);
    console.log(lang);
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    if (!lang) {
      return (
        '<pre><code>' +
        'no lang' +
        (escaped ? code : escape(code, true)) +
        '</code></pre>\n'
      );
    }

    return (
      '<pre><code class="' +
      this.options.langPrefix +
      escape(lang, true) +
      '">' +
      (escaped ? code : escape(code, true)) +
      '</code></pre>\n'
    );
  },
};

marked.use({ renderer });

const EntryList = props => {
  console.log(props.entrys);
  return (
    <ul className="col-sm-12 list-group ">
      {props.entrys.map(entry => {
        let newText = entry.displayContent.replace(/<br \/>/g, '\n');
        const dateFormated = moment(entry.date).format('ddd MMM, DD YYYY');
        const calLinkDate = `posts/?gotoYearMonth=${moment(entry.date).format(
          'YYYY-MM'
        )}`;
        const oneDayLink = `main#/oneDay?date=${moment(entry.date).format(
          'YYYY-MM-DD'
        )}`;
        let showEntryDate = <a href={oneDayLink}>{dateFormated}</a>;
        // <a onclick={e=> {location.href=`main#/oneDay?date=${dateFormated}`}}>{dateFormated}</a>);
        if (props.editLink) {
          showEntryDate = (
            <button
              onClick={e => {
                e.preventDefault();
                props.editLink(entry);
              }}
            >
              {moment(entry.date).format('ddd MMM, DD YYYY')}
            </button>
          );
        }

        return (
          <li key={entry.id} className="blogEntry">
            {showEntryDate}|<a href={calLinkDate}>Cal</a>|
            <div dangerouslySetInnerHTML={newText} />
          </li>
        );
      })}
    </ul>
  );
};

export default EntryList;
