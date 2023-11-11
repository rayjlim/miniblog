import { useState, useEffect } from 'react';
import { REST_ENDPOINT, STORAGE_KEY, AUTH_HEADER } from '../constants';

const useMediaList = () => {

  const [medias, setMedias] = useState<any[string]>([]);
  const [uploadDirs, setUploadDirs] = useState<string[]>([]);
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
        setUploadDirs(dirs as string[]);

        const media = Object.values(data.dirContent);
        setMedias(media);
        setCurrentDir(data.currentDir);
      }
    })();
  }

  useEffect(() => {
    loadDir('');
  }, []);

  return { medias, uploadDirs, currentDir, loadDir };
};
export default useMediaList;
