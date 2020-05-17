import React, { useState, useEffect } from 'react'; // eslint-disable-line no-unused-vars
import constants from '../constants';
import axios from 'axios';

const MediaList = (props) => {
    console.log('props :', props.content);
    const [ media, setMedia ] = useState([]);
    const [ uploadDirs, setUploadDirs ] = useState([]);
    const [ currentDir, setCurrentDir ] = useState('');

    useEffect(
        () => {
            loadDir('');
        },
        [ props ]
    );

    function loadDir(dir) {
        (async () => {
            const result = await axios(`${constants.REST_ENDPOINT}media/${dir}`);
            console.log('result :', result);
            if (result.status !== 200) {
                console.log('result.status :', result.status);
                alert(`loading error : ${result.status}`);
                return;
            } else if (typeof result.data === 'string') {
                console.log('invalid json');
            } else {
                const _dirs = [];
                const _media = [];
                for (var _dir in result.data.uploadDirs) {
                    console.log(_dir);
                    _dirs.push(result.data.uploadDirs[_dir]);
                }
                setUploadDirs(_dirs);
                for (var _dir in result.data.dirContent) {
                    console.log(_dir);
                    _media.push(result.data.dirContent[_dir]);
                }

                setMedia(_media);

                setCurrentDir(result.data.currentDir);
            }
        })();
    }

    function deleteMedia(filePath, fileName) {
        (async () => {
              {/* <a href="{{baseurl}}media/?debug=on&fileName={{file}}&filePath={{currentDir}}/" class="delete">X</a>*/}

            const result = await axios(`${constants.REST_ENDPOINT}media/?fileName=${fileName}&filePath=${filePath}`, {method: 'DELETE'});
            console.log('result :', result);
            if (result.status !== 200) {
                console.log('result.status :', result.status);
                alert(`loading error : ${result.status}`);
                return;
            } else if (typeof result.data === 'string') {
                console.log('invalid json');
            } else {
                const _dirs = [];
                const _media = [];
                for (var _dir in result.data.uploadDirs) {
                    console.log(_dir);
                    _dirs.push(result.data.uploadDirs[_dir]);
                }
                setUploadDirs(_dirs);
                for (var _dir in result.data.dirContent) {
                    console.log(_dir);
                    _media.push(result.data.dirContent[_dir]);
                }

                setMedia(_media);

                setCurrentDir(result.data.currentDir);
            }
        })();
    }

    return (
        <div>
            <h2>Dirs {currentDir}</h2>
            {uploadDirs.length}
            {uploadDirs.length && uploadDirs.map((dir) => <button onClick={(e) => loadDir(dir)}>{dir}</button>)}
            <h2>Media</h2>
            {media.length}
            <ul />
            {media.length &&
                media.map((key) => (
                    <li>
                        <p>{key}</p>
                        <button onClick={(e) => props.onMediaSelect(currentDir + '/', key)}>Load</button>
                        <img src={`${constants.PROJECT_ROOT}uploads/${currentDir}/${key}`} />
                        <button onClick={(e) => deleteMedia(currentDir + '/', key)}>Delete</button>
                        

                    </li>
                ))}
        </div>
    );
};

export default MediaList;


