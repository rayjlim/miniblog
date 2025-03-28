import { REST_ENDPOINT } from '../constants';
import { useSetting } from './SettingContext';
import createHeaders from '../utils/createHeaders';
import { SettingsType } from '../Types';

const MediaItem = ({ media, currentDir, selectMedia, onDelete }: {
  media: string, currentDir: string,
  selectMedia: (filePath: string, fileName: string) => void,
  onDelete: (filePath: string) => void
}) => {
  const { UPLOAD_ROOT } = useSetting() as SettingsType;

  function deleteMedia(filePath: string, fileName: string) {
    const go = window.confirm('You sure?');
    if (!go) {
      return;
    }
    (async () => {
      const requestHeaders = createHeaders();
      const response = await fetch(
        `${REST_ENDPOINT}/media/?fileName=${fileName}&filePath=${filePath}`,
        {
          method: 'DELETE',
          headers: requestHeaders,
        },
      );
      console.log('response :', response);
      if (!response.ok) {
        console.log('response.status :', response.status);
        alert(`loading error : ${response.status}`);
      } else {
        const results = await response.json();
        console.log(results);
        // Do anything with the metadata return after delete?
        // const data = await response.json();
        onDelete(fileName);
      }
    })();
  }

  return (<li key={media}>
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '0.5rem'
    }}>
      <button
        onClick={() => selectMedia(`${currentDir}`, media)}
        type="button"
        className="btn btn-primary"
        style={{ whiteSpace: 'nowrap', width: '40px' }}
        title="Load"
      >
        <i className="fa fa-download" />
      </button>
      <button
        onClick={() => deleteMedia(`${currentDir}`, media)}
        type="button"
        className="btn btn-danger delete"
        style={{ whiteSpace: 'nowrap', width: '40px' }}
        title="Delete"
      >
        <i className="fa fa-trash" />
      </button>
    </div>
    <img
      src={`${UPLOAD_ROOT}/${currentDir}/${media}`}
      alt="main_img"
      title={media}
    />
  </li>);
};
export default MediaItem;
