import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { REST_ENDPOINT, STORAGE_KEY } from '../constants';

import MyContext from './MyContext';

import './MediaList.css';

const MediaList = ({ onMediaSelect }) => {
  const { UPLOAD_ROOT } = useContext(MyContext);
  const [media, setMedia] = useState([]);
  const [uploadDirs, setUploadDirs] = useState([]);
  const [currentDir, setCurrentDir] = useState('');

  function loadDir(dir = '') {
    (async () => {
      const token = window.localStorage.getItem(STORAGE_KEY);
      const response = await fetch(`${REST_ENDPOINT}/media/${dir}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Token': token,
        },
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
  function deleteMedia(filePath, fileName) {
    const go = window.confirm('You sure?');
    if (!go) {
      return;
    }
    (async () => {
      const token = window.localStorage.getItem(STORAGE_KEY);
      const response = await fetch(
        `${REST_ENDPOINT}/media/?fileName=${fileName}&filePath=${filePath}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Token': token,
          },
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
        && uploadDirs.map(dir => (
          <button onClick={() => loadDir(dir)} type="button" key={dir}>{dir}</button>
        ))}
      <h2>
        Media (
        {media.length}
        )
      </h2>
      {media.length && (
        <ul className="media-preview">
          { media.map(key => (
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

MediaList.propTypes = {
  onMediaSelect: PropTypes.func.isRequired,
};
