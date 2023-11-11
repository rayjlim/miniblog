import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import MyContext from './components/MyContext';
import Search from './views/Search';
import OneDay from './views/OneDay';
import Media from './views/Media';
import Upload from './views/Upload';
import LoginPassword from './views/LoginPassword';
import Logs from './views/Logs';
import { REST_ENDPOINT, ENVIRONMENT, STORAGE_KEY } from './constants';
import './App.css';

const showDevRibbon = ENVIRONMENT === 'development';
const SAMEDAY = 1;

const App = () => {
  const [globalContext, setGlobalContext] = useState < any | null > (null);
  useEffect(() => {
    (async () => {
      const token = window.localStorage.getItem(STORAGE_KEY);
      console.log('check for token: ', token, token !== null);
      if (token !== null && token !== '') {
        console.log('logged in:', token);
      } else {
        console.log('logged out');
      }

      if (!globalContext) {
        try {
          const response = await fetch(`${REST_ENDPOINT}/settings/`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const results = await response.json();
            setGlobalContext(results);
          }
        } catch (error) {
          console.error('Error: ', error);
          throw new Error('Settings not loading correctly');
        }
      }

      // { import GithubCorner from './components/GithubCorner';
      //   "SHOW_GH_CORNER": false
      // }
    })();
  });

  return (
    <>
      {globalContext !== null && (
        <MyContext.Provider value={globalContext}>
          <GoogleOAuthProvider clientId={globalContext.GOOGLE_OAUTH_CLIENTID}>
            <React.StrictMode>
              {/* {showGHCorner && <GithubCorner />} */}
              {showDevRibbon && (
                <a
                  className="github-fork-ribbon"
                  href="#dev"
                  data-ribbon="Development"
                  title="Development"
                >
                  Development
                </a>
              )}

              <div id="app" className="App d-flex flex-column h-100">
                <BrowserRouter>
                  <Routes>
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/media" element={<Media />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/oneday" element={<OneDay />} />
                    <Route
                      path="/sameday"
                      element={<OneDay pageMode={SAMEDAY} />}
                    />
                    <Route path="/logs" element={<Logs />} />
                    <Route path="/login" element={<LoginPassword />} />
                    <Route path="/" element={<OneDay />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </BrowserRouter>
              </div>
            </React.StrictMode>
          </GoogleOAuthProvider>
        </MyContext.Provider>
      )}
      <span>_</span>
    </>
  );
};

export default App;
