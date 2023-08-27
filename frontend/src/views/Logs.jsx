import React, { useState, useEffect } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { REST_ENDPOINT, STORAGE_KEY } from '../constants';
import pkg from '../../package.json';
import './Logs.css';

const Logs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [logFileName, setLogFileName] = useState('');
  const [logFile, setLogFile] = useState('');

  const getLog = async (log = '') => {
    const token = window.localStorage.getItem(STORAGE_KEY);
    const response = await fetch(`${REST_ENDPOINT}/logs/${log}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Token': token,
      },
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

  async function handleDelete(log) {
    const go = window.confirm('You sure?');
    if (!go) {
      return;
    }

    try {
      const token = window.localStorage.getItem(STORAGE_KEY);
      const response = await fetch(
        `${REST_ENDPOINT}/logs/${log}`,
        {
          method: 'DELETE',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Token': token,
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
        },
      );

      console.log(response);
      navigate('/logs');
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  useEffect(() => {
    getLog();
  }, []);

  return (
    <>
      <ToastContainer />
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

      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <div className="col-md-5 text-left">
          <RouterNavLink to="/oneday" className="btn navbar-btn">
            <i className="fa fa-file-home" />
            One Day
          </RouterNavLink>

          <span className="footer-version">
            v
            {pkg.version}
          </span>
        </div>
      </nav>
    </>
  );
};

export default Logs;
