/* eslint-disable react/no-danger */
//@ts-ignore
import { marked } from 'marked';
import { useSetting } from './SettingContext';
import { SettingsType } from '../Types';
import './MarkdownDisplay.css';
const renderer = {

  code(code: string, escaped = true): string {
    // const lang = (infostring || '').match(/\S*/)[0];
    // TODO: document the meaning of the each variable
    // console.log(code);
    // console.table(`options: ${this.options.highlight}`);
    // console.log(lang);
    // console.log(infostring);
    let escapeCheck = escaped;
    let outputCode = code;
    // if (this.options.highlight) {
    //   const out = this.options.highlight(outputCode, lang);
    //   if (out != null && out !== outputCode) {
    //     escapeCheck = true;
    //     outputCode = out;
    //   }
    // }

    const output = escapeCheck ? outputCode : escape(outputCode);
    return `<pre><code>${output}</code></pre>\n`;
    // if (!lang) {
    //   return `<pre><code>${output}</code></pre>\n`;
    // }

    // const escapedLang = escape(lang);
    // return `<pre><code class="
    //   ${this.options.langPrefix}${escapedLang}">${output}</code></pre>\n`;
  },
};

marked.use({ renderer });

const MarkdownDisplay = ({ source }: { source: string }) => {
  const { UPLOAD_ROOT } = useSetting() as SettingsType;
  let output = '';
  try {
    // console.log(source);
    let newText = source.replace(/<br \/>/g, '\n');
    newText = newText.replace(
      /..\/uploads/g,
      `${UPLOAD_ROOT}`,
    );

    output = marked(newText);
  } catch (err) {
    console.log(err);
  }
  return <div dangerouslySetInnerHTML={{ __html: output }} />;
};

export default MarkdownDisplay;
