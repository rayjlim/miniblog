import { useCallback, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { REST_ENDPOINT, STORAGE_KEY, AUTH_HEADER } from '../constants';

const useLogs = () => {

  const [logs, setLogs] = useState<string[]>([]);
  const [logFileName, setLogFileName] = useState<string>('');
  const [logFile, setLogFile] = useState<string>('');

  const getLog = useCallback(async (log = '') => {
    const token = window.localStorage.getItem(STORAGE_KEY) || '';
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set(AUTH_HEADER, token);

    const response = await fetch(`${REST_ENDPOINT}/logs/${log}`, {
      headers: requestHeaders,
    });
    console.log('response :', response);
    if (response.ok) {
      const responseData = await response.json();
      console.log('responseData :', responseData);
      setLogs(responseData.logs);
      setLogFileName(responseData.logFileName);
      setLogFile(responseData.logFile);
      return;
    }
    console.error('response.status :', response.status);
    toast.error(`loading error : ${response.status}`);
  }, [logs, logFileName, logFile]);

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
      getLog();

    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  useEffect(() => {
    getLog();
  }, []);

  return { logs, logFileName, logFile, handleDelete, getLog };
};

export default useLogs;
