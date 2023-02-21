import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import './views/ribbon.css';
import App from './App';
import constants from './constants';
import * as serviceWorker from './serviceWorker';

import GithubCorner from './components/GithubCorner';

const showGHCorner = constants.ENVIRONMENT !== 'development';
const showDevRibbon = constants.ENVIRONMENT === 'development';
// const showDevRibbon = false;
ReactDOM.render(
  <GoogleOAuthProvider clientId={constants.GOOGLE_CLIENTID}>
    <React.StrictMode>
      {showGHCorner && <GithubCorner />}
      {showDevRibbon && <a className="github-fork-ribbon" href="https://url.to-your.repo" data-ribbon="Development" title="Development">Development</a>}
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
