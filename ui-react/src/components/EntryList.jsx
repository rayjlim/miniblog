import React from 'react'; // eslint-disable-line no-unused-vars
import format from 'date-fns/format';
import parse from 'date-fns/parse';
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
        const dateFormated =
        format(parse(entry.date, 'yyyy-MM-dd', new Date()), 'EEE MMM, dd yyyy');
        const calLinkDate = `posts/?gotoYearMonth=${
          format(parse(entry.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM') }`;
        const oneDayLink = `main#/oneDay?date=${
          format(parse(entry.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd') }`;
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
              { format(parse(entry.date, 'yyyy-MM-dd', new Date()), 'EEE MMM, dd yyyy')  }
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
