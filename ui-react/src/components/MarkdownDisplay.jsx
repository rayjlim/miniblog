import React from 'react'; // eslint-disable-line no-unused-vars
import marked from 'marked';
import { mermaidAPI } from 'mermaid';

// Override function
const renderer = {
  code(code, infostring, escaped = true) {
    const lang = (infostring || '').match(/\S*/)[0];
    // console.log(code);
    // console.log(this.options);
    // console.log(lang);
    // console.log(infostring);

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
        (escaped ? code : escape(code, true)) +
        '</code></pre>\n'
      );
    }
    if (lang === 'mermaid') {
      const id = 'mermaid' + Date.now(); //needs a unique element id
      return mermaidAPI.render(id, code);
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

const MarkdownDisplay = props => {
  let output = '';
  try {
    output = marked(props.source);
  } catch (err) {
    console.log(err);
  }
  return <div dangerouslySetInnerHTML={{ __html: output }} />;
};

export default MarkdownDisplay;
