import { useSetting } from './SettingContext';
import useInspiration from '../hooks/useInspiration';

const Inspiration = () => {
  const { output, isLoading, error, getByType } = useInspiration();
  const { INSPIRATION_API, QUESTION_API } = useSetting() as SettingsType;

  function copyToClipboard(content: string) {
    console.log(`clipboard: ${content}`);
    navigator.clipboard.writeText(content);
  }

  if (isLoading) return <div>Load ...</div>;
  if (error) return <div>An error occurred: {(error as RequestError).message}</div>;

  return (
    <>
      {(QUESTION_API !== '' || INSPIRATION_API !== '') &&
        <section>
          <div>{output}</div>
          {output !== '' && (
            <button onClick={() => copyToClipboard(output)} type="button" className="copy-btn">
              /clip
            </button>
          )}
          {QUESTION_API !== '' && (
            <button onClick={() => getByType(false)} className="plainLink" type="button">
              [Get Prompt]
            </button>
          )}
          {INSPIRATION_API !== '' && (
            <button onClick={() => getByType(true)} className="plainLink" type="button">
              [Get Inspiration]
            </button>
          )}
        </section>
      }
    </>
  )
};

export default Inspiration;
