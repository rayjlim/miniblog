import { useState } from 'react';
import { useQuery } from "react-query";
import { REST_ENDPOINT, STORAGE_KEY, AUTH_HEADER } from '../constants';

const fetchData = async (log: string) => {
  const token = window.localStorage.getItem(STORAGE_KEY) || '';
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set(AUTH_HEADER, token);
  const api = `${REST_ENDPOINT}/logs/${log}`;
  const response = await fetch(api, {
    headers: requestHeaders,
  });
  const data = await response.json();
  return data;
};

const useLogs = () => {
  const [logFileName, setLogFileName] = useState('');
  const { data, error, isLoading } = useQuery(["logs", logFileName], () => fetchData(logFileName));

  const handleDelete = async (log: string) => {
    if (!window.confirm('You sure?')) {
      return;
    }

    try {
      const token = window.localStorage.getItem(STORAGE_KEY) || '';
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set(AUTH_HEADER, token);

      const response = await fetch(
        `${REST_ENDPOINT}/logs/${log}`,
        {
          method: 'DELETE',
          mode: 'cors',
          headers: requestHeaders,
        },
      );

      console.log(response);
      setLogFileName('');
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  const logs = data?.logs;
  const logFile = data?.logFile;

  return { logs, logFileName, logFile, handleDelete, setLogFileName, error, isLoading };

};

export default useLogs;
