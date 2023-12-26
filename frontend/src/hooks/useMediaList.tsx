import { useState } from 'react';
import { useQuery } from "react-query";
import { REST_ENDPOINT } from '../constants';
import createHeaders from '../utils/createHeaders';

const fetchData = async (dir: string) => {
  const requestHeaders = createHeaders();
  const response = await fetch(`${REST_ENDPOINT}/media/${dir}`, {
    headers: requestHeaders,
  });
  const data = await response.json();
  return data;
};

const useMediaList = () => {

  const [currentDir, setCurrentDir] = useState<string>('');

  const { data, error, isLoading } = useQuery(["mediaDir", currentDir], () => fetchData(currentDir));

  function mediaDelete(dir: string){
    // loadDir(dir);
    console.log('media delete', dir);
  }

  const uploadDirs = data && Object.values(data?.uploadDirs);
  const medias = data && Object.values(data?.dirContent);

  return { medias, uploadDirs, currentDir, setCurrentDir, mediaDelete, error, isLoading };
};
export default useMediaList;
