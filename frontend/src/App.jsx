import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Search from './views/Search';
import OneDay from './views/OneDay';
import Media from './views/Media';
import Upload from './views/Upload';
import LoginPassword from './views/LoginPassword';
import Logs from './views/Logs';
import './App.css';

const App = () => {
  useEffect(() => {
    (async () => {
      // check for token
      const token = window.localStorage.getItem('appToken');
      console.log('check token', token, token !== null);
      if (token !== null && token !== '') {
        console.log('logged in:', token);
      } else {
        console.log('logged out');
      }
    })();
  }, []);

  return (
    <div>
      <div id="app" className="App d-flex flex-column h-100">
        <BrowserRouter>
          <Routes>
            <Route path="/upload" element={<Upload />} />
            <Route path="/media" element={<Media />} />
            <Route path="/search" exact element={<Search />} />
            <Route path="/oneday" element={<OneDay />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/" element={<LoginPassword />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
