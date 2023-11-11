
import { useContext } from 'react';
import MyContext from '../components/MyContext';
import useInspiration from '../hooks/useInspiration';

const Inspiration = () => {
  const {inspiration, getInspiration, getPrompt} = useInspiration();
  const {
    INSPIRATION_API,
    QUESTION_API,
  } = useContext(MyContext);

  function copyToClipboard(content: string) {
    console.log(`clipboard: ${content}`);
    navigator.clipboard.writeText(content);
  }

  return (
    <section>
      <div>{inspiration}</div>
      {inspiration !== '' && (
        <button onClick={() => copyToClipboard(inspiration)} type="button" className="copy-btn">
          /clip
        </button>
      )}
      {QUESTION_API !== '' && (
        <button onClick={() => getPrompt()} className="plainLink" type="button">
          [Get Prompt]
        </button>
      )}
      {INSPIRATION_API !== '' && (
        <button onClick={() => getInspiration()} className="plainLink" type="button">
          [Get Inspiration]
        </button>
      )}
    </section>
  )
};

export default Inspiration;
