import { useState, useEffect } from 'react';
import { REST_ENDPOINT, STORAGE_KEY, AUTH_HEADER } from '../constants';

const useMediaList = () => {

  const [medias, setMedias] = useState<any[string]>([]);
  const [uploadDirs, setUploadDirs] = useState<string[]>([]);
  const [currentDir, setCurrentDir] = useState<string>('');

  function mediaDelete(dir: string){
    loadDir(dir);
  }
  function loadDir(dir: string) {
    console.log(dir);
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
        setUploadDirs(dirs as string[]);
        if(currentDir === ''){
          setCurrentDir(dirs[dirs.length-1] as string);
        }

        const media = Object.values(data.dirContent);
        setMedias(media);
      }
    })();
  }

  useEffect(() => {
    loadDir(currentDir);
  }, [currentDir]);

  return { medias, uploadDirs, currentDir, setCurrentDir, mediaDelete };
};
export default useMediaList;
