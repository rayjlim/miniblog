import React, { useState, useEffect, Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import constants from '../constants';
import pkg from '../../package.json';
import './Logs.css';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [logFileName, setLogFileName] = useState('');
  const [logFile, setLogFile] = useState('');

  const getLog = async (log = '') => {
    const token = window.localStorage.getItem('appToken');
    const response = await fetch(`${constants.REST_ENDPOINT}/logs/${log}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-app-token': token,
      },
    });
    console.log('response :', response);
    if (!response.ok) {
      console.log('response.status :', response.status);
      alert(`loading error : ${response.status}`);
    } else {
      const responseData = await response.json();
      console.log('responseData :', responseData);
      setLogs(responseData.logs);
      setLogFileName(responseData.logFileName);
      setLogFile(responseData.logFile);
    }
  };

  useEffect(() => {
    getLog();
  }, []);

  return (
    <>
      <h1>Logs</h1>
      <ul>
        {logs.length
          && logs.map(log => (
            <li key={log}>
              <button type="button" onClick={() => getLog(log)}>
                {log}
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
