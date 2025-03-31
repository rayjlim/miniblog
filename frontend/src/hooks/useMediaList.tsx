import { useState } from 'react';
import { useQuery } from "react-query";
import { toast } from 'react-toastify';
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

  function onDeleteItem(fileName: string) {
    console.log('media delete', fileName);
    toast(`Removed ${fileName}`);
    refetch();
  }

  const uploadDirs = data && Object.values(data?.uploadDirs);
  const medias = data && Object.values(data?.dirContent);
  if (currentDir=== ''&& uploadDirs) setCurrentDir(uploadDirs[uploadDirs.length - 1]);
  return { medias, uploadDirs, currentDir, setCurrentDir, onDeleteItem, error, isLoading };
};
export default useMediaList;
