import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import constants from '../constants';

const MediaList = props => {
  console.log('props :', props.content);
  const [media, setMedia] = useState([]);
  const [uploadDirs, setUploadDirs] = useState([]);
  const [currentDir, setCurrentDir] = useState('');

  useEffect(() => {
    loadDir('');
  }, [props]);

  function loadDir(dir) {
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
        return;
      } else {
        const data = await response.json();
        const _dirs = [];
        const _media = [];
        for (let _dir in data.uploadDirs) {
          console.log(_dir);
          _dirs.push(data.uploadDirs[_dir]);
        }
        setUploadDirs(_dirs);
        for (let file in data.dirContent) {
          console.log(file);
          _media.push(data.dirContent[file]);
        }

        setMedia(_media);

        setCurrentDir(data.currentDir);
      }
    })();
  }

  function deleteMedia(filePath, fileName) {
    let go = window.confirm('You sure?');
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
        }
      );
      console.log('response :', response);
      if (!response.ok) {
        console.log('response.status :', response.status);
        alert(`loading error : ${response.status}`);
        return;
      } else {
        const data = await response.json();
        const _dirs = [];
        const _media = [];
        for (var _dir in data.uploadDirs) {
          console.log(_dir);
          _dirs.push(data.uploadDirs[_dir]);
        }
        setUploadDirs(_dirs);
        for (var file in data.dirContent) {
          console.log(file);
          _media.push(data.dirContent[file]);
        }

        setMedia(_media);

        setCurrentDir(response.data.currentDir);
      }
    })();
  }

  return (
    <div>
      <h2>Dirs {currentDir}</h2>
      {uploadDirs.length}
      {uploadDirs.length &&
        uploadDirs.map(dir => (
          <button onClick={e => loadDir(dir)}>{dir}</button>
        ))}
      <h2>Media</h2>
      {media.length}
      <ul />
      {media.length &&
        media.map(key => (
          <li>
            <p>{key}</p>
            <button onClick={e => props.onMediaSelect(currentDir + '/', key)}>
              Load
            </button>
            <img
              src={`${constants.UPLOAD_ROOT}${currentDir}/${key}`}
              alt="main_img"
            />
            <button onClick={e => deleteMedia(currentDir + '/', key)}>
              Delete
            </button>
          </li>
        ))}
    </div>
  );
};

export default MediaList;
