import { useContext } from 'react';
import { REST_ENDPOINT, STORAGE_KEY, AUTH_HEADER } from '../constants';
import MyContext from './MyContext';

const MediaItem = ({media, currentDir, selectMedia}: {media: string, currentDir: string,
  selectMedia: (filePath: string, fileName: string)=>void}) => {
  const { UPLOAD_ROOT } = useContext(MyContext);

  function deleteMedia(filePath: string, fileName: string) {
    const go = window.confirm('You sure?');
    if (!go) {
      return;
    }
    (async () => {
      const token = window.localStorage.getItem(STORAGE_KEY) || '';
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set('Content-Type', 'application/json');
      requestHeaders.set(AUTH_HEADER, token);
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
        // Do anything with the metadata return after delete?
        // const data = await response.json();

        // TODO: send reload to parent
        // loadDir(filePath);
      }
    })();
  }

  return (<li key={media}>
    <button onClick={() => selectMedia(`${currentDir}`, media)} type="button">
      Load
    </button>
    <button onClick={() => deleteMedia(`${currentDir}`, media)} type="button" className="delete">
      Delete
    </button>
    <img
      src={`${UPLOAD_ROOT}/${currentDir}/${media}`}
      alt="main_img"
      title={media}
    />
  </li>);
};
export default MediaItem;
