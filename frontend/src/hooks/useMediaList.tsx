import { useState, useRef } from 'react';
import { useQuery } from "react-query";
import { REST_ENDPOINT } from '../constants';
import createHeaders from '../utils/createHeaders';

const fetchData = async (dir: string) => {

  const requestHeaders = createHeaders();
  const response = await fetch(`${REST_ENDPOINT}/media/${dir}`, {
    headers: requestHeaders,
  });
  const data = await response.json();
  console.log('fetch data', dir, data);
  return data;
};

const useMediaList = () => {
  const [currentDir, setCurrentDir] = useState<string>('');
  const { data, error, isLoading, refetch } = useQuery(["mediaDir", currentDir], () => fetchData(currentDir));
  const _data = useRef(data);

  function onDeleteItem(fileName: string) {
    console.log('media delete', fileName, _data.current);
    refetch();
  }

  _data.current = data;
  console.log(_data.current);

  const uploadDirs = data && Object.values(data?.uploadDirs);
  const medias = data && Object.values(data?.dirContent);
  return { medias, uploadDirs, currentDir, setCurrentDir, onDeleteItem, error, isLoading };
};
export default useMediaList;
