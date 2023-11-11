import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { REST_ENDPOINT, STORAGE_KEY, AUTH_HEADER } from '../constants';
import Header from '../components/Header';
import Footer from '../components/Footer';

import './Logs.css';

const Logs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [logFileName, setLogFileName] = useState('');
  const [logFile, setLogFile] = useState('');

  const getLog = async (log = '') => {
    const token = window.localStorage.getItem(STORAGE_KEY) || '';
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set(AUTH_HEADER, token);
    const response = await fetch(`${REST_ENDPOINT}/logs/${log}`, {
      method: 'GET',
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
  };

  async function handleDelete(log: any) {
    const go = window.confirm('You sure?');
    if (!go) {
      return;
    }

    try {
      const token = window.localStorage.getItem(STORAGE_KEY) || '';
      const requestHeaders: HeadersInit = new Headers();
      requestHeaders.set('Content-Type', 'application/json');
      requestHeaders.set(AUTH_HEADER, token);
      const response = await fetch(
        `${REST_ENDPOINT}/logs/${log}`,
        {
          method: 'DELETE',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: requestHeaders,
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
        },
      );

      console.log(response);
      navigate('/logs');  // code smell, should update state only
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  useEffect(() => {
    getLog();
  }, []);

  const footerLinks = {upload: false, media: false, logs: false, oneday: true};
  return (
    <>
      <ToastContainer />
      <Header />
      <h1>Logs</h1>
      <ul>
        {logs.length
          && logs.map(log => (
            <li key={log}>
              <button type="button" onClick={() => getLog(log)}>
                {log}
              </button>
              <button
                onClick={() => handleDelete(log)}
                className="btn btn-danger pull-right"
                type="button"
              >
                <i className="fa fa-trash" />
              </button>
            </li>
          ))}
      </ul>
      <h2>
        Log File -
        {logFileName}
      </h2>
      <pre>{logFile}</pre>
      <Footer links={footerLinks}/>
    </>
  );
};

export default Logs;
