import { useContext, useState, useEffect, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { REST_ENDPOINT, STORAGE_KEY, AUTH_HEADER } from '../constants';

import MyContext from './MyContext';

import './MediaList.css';

const propTypes = {
  onMediaSelect: PropTypes.func.isRequired,
};

type MediaListProps = PropTypes.InferProps<typeof propTypes>;

const MediaList: FunctionComponent<MediaListProps> = (onMediaSelect: any) => {
  const { UPLOAD_ROOT } = useContext(MyContext);
  const [media, setMedia] = useState<any[string]>([]);
  const [uploadDirs, setUploadDirs] = useState<any[string]>([]);
  const [currentDir, setCurrentDir] = useState<string>('');

  function loadDir(dir: string = '') {
    (async () => {
      const token = window.localStorage.getItem(STORAGE_KEY) || '';
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set('Content-Type', 'application/json');
      requestHeaders.set(AUTH_HEADER, token);
      const response = await fetch(`${REST_ENDPOINT}/media/${dir}`, {
        method: 'GET',
        headers: requestHeaders,
      });
      console.log('response :', response);
      if (!response.ok) {
        console.log('response.status :', response.status);
        alert(`loading error : ${response.status}`);
      } else {
        const data = await response.json();
        const dirs = Object.values(data.uploadDirs);
        setUploadDirs(dirs);
        const medias = Object.values(data.dirContent);

        setMedia(medias);
        setCurrentDir(data.currentDir);
      }
    })();
  }

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
        loadDir(filePath);
      }
    })();
  }

  useEffect(() => {
    loadDir('');
  }, []);

  return (
    <div>
      <h2>
        Dirs
        {' '}
        {currentDir}
        {' '}
        (
        {uploadDirs.length}
        )
      </h2>
      {uploadDirs.length
        && uploadDirs.map((dir: string) => (
          <button onClick={() => loadDir(dir)} type="button" key={dir}>{dir}</button>
        ))}
      <h2>
        Media (
        {media.length}
        )
      </h2>
      {media.length && (
        <ul className="media-preview">
          { media.map((key: string) => (
            <li key={key}>
              <button onClick={() => onMediaSelect(`${currentDir}`, key)} type="button">
                Load
              </button>
              <button onClick={() => deleteMedia(`${currentDir}`, key)} type="button" className="delete">
                Delete
              </button>
              <img
                src={`${UPLOAD_ROOT}/${currentDir}/${key}`}
                alt="main_img"
                title={key}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MediaList;

MediaList.propTypes = propTypes;
