import React, { useState, useEffect } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import Search from './views/Search';
import OneDay from './views/OneDay';
import Media from './views/Media';
import Login from './views/Login';
import Upload from './views/Upload';

import './App.css';

import history from './utils/history';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    (async () => {
      // window.localStorage.setItem('appToken', '/A==');
      // check for token
      const token = window.localStorage.getItem('appToken');
      console.log('check token', token);
      if (token && token !== '') {
        console.log('logged in:', token);
        setLoggedIn(true);
      }
    })();
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <div id="app" className="App d-flex flex-column h-100">
          <Router history={history}>
            <Switch>
              <Route path="/upload" component={Upload} />
              <Route path="/media" component={Media} />
              <Route path="/search" exact component={Search} />
              <Route path="/oneday" component={OneDay} />
              <Route path="/" component={OneDay} />
            </Switch>
          </Router>
        </div>
      ) : (
        <div id="app" className="App d-flex flex-column h-100">
          <Router history={history}>
            <Switch>
              <Route path="/login" component={Login} />
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}

export default App;
