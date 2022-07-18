import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import constants from '../constants';

const MediaList = ({ content, onMediaSelect }) => {
  console.log(' MediaList props :', content);
  const [media, setMedia] = useState([]);
  const [uploadDirs, setUploadDirs] = useState([]);
  const [currentDir, setCurrentDir] = useState('');

  function loadDir(dir = '') {
    (async () => {
      const token = window.localStorage.getItem('appToken');
      const response = await fetch(`${constants.REST_ENDPOINT}/media/${dir}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-app-token': token,
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
      const token = window.localStorage.getItem('appToken');
      const response = await fetch(
        `${constants.REST_ENDPOINT}/media/?fileName=${fileName}&filePath=${filePath}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-app-token': token,
          },
        },
      );
      console.log('response :', response);
      if (!response.ok) {
        console.log('response.status :', response.status);
        alert(`loading error : ${response.status}`);
      } else {
        // const data = await response.json();
        loadDir(filePath);
      }
    })();
  }

  useEffect(() => {
    loadDir('');
  }, [content]);

  return (
    <div>
      <h2>
        Dirs
        {currentDir}
      </h2>
      {uploadDirs.length}
      {uploadDirs.length
        && uploadDirs.map(dir => (
          <button onClick={() => loadDir(dir)} type="button">{dir}</button>
        ))}
      <h2>Media</h2>
      {media.length}
      <ul />
      {media.length
        && media.map(key => (
          <li>
            <p>{key}</p>
            <button onClick={() => onMediaSelect(`${currentDir}/`, key)} type="button">
              Load
            </button>
            <img
              src={`${constants.UPLOAD_ROOT}/${currentDir}/${key}`}
              alt="main_img"
            />
            <button onClick={() => deleteMedia(`${currentDir}/`, key)} type="button">
              Delete
            </button>
          </li>
        ))}
    </div>
  );
};

export default MediaList;

MediaList.propTypes = {
  content: PropTypes.string.isRequired,
  onMediaSelect: PropTypes.func.isRequired,
};
