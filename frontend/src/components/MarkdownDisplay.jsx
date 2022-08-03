/* eslint-disable react/no-danger */
import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import { marked } from 'marked';

const renderer = {
  code(code, infostring, escaped = true) {
    const lang = (infostring || '').match(/\S*/)[0];
    // console.log(code);
    // console.log(this.options);
    // console.log(lang);
    // console.log(infostring);
    let escapeCheck = escaped;
    let outputCode = code;
    if (this.options.highlight) {
      const out = this.options.highlight(outputCode, lang);
      if (out != null && out !== outputCode) {
        escapeCheck = true;
        outputCode = out;
      }
    }

    const output = escapeCheck ? outputCode : escape(outputCode, true);
    if (!lang) {
      return `<pre><code>${output}</code></pre>\n`;
    }

    const escapedLang = escape(lang, true);
    return `<pre><code class="
      ${this.options.langPrefix}${escapedLang}">${output}</code></pre>\n`;
  },
};

marked.use({ renderer });

const MarkdownDisplay = ({ source }) => {
  let output = '';
  try {
    output = marked(source);
  } catch (err) {
    console.log(err);
  }
  return <div dangerouslySetInnerHTML={{ __html: output }} />;
};

export default MarkdownDisplay;

MarkdownDisplay.propTypes = {
  source: PropTypes.string.isRequired,
};
