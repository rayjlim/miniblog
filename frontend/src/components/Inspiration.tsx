import { useSetting } from './SettingContext';
import { SettingsType, RequestError } from '../Types';
import useInspiration from '../hooks/useInspiration';

const Inspiration = () => {
  const { output, isLoading, error, getByType, openWithPrompt } = useInspiration();
  const { INSPIRATION_API, QUESTION_API } = useSetting() as SettingsType;

  if (isLoading) return <div>Load ...</div>;
  if (error) return <div>An error occurred: {(error as RequestError).message}</div>;

  return (
    <>
      {(QUESTION_API !== '' || INSPIRATION_API !== '') &&
        <section>
          <div>{output}</div>
          {output !== '' && (
            <button onClick={() => openWithPrompt(output)} type="button" className="copy-btn" id="populateBtn">
              /clip
            </button>
          )}
          {QUESTION_API !== '' && (
            <button onClick={() => getByType(false)} className="plainLink" type="button" id="promptBtn">
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
