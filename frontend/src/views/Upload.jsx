import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import UploadForm from '../components/UploadForm';
import constants from '../constants';

import './ribbon.css';

const Upload = () => (
  <>
    {constants.ENVIRONMENT === 'development' && <a className="github-fork-ribbon" href="https://url.to-your.repo" data-ribbon="Development" title="Development">Development</a>}
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <RouterNavLink to="/oneday">
        <i className="fa fa-home" />
        <span>Home</span>
      </RouterNavLink>
      <RouterNavLink to="/oneday?pageMode=1">
        {' '}
        <i className="fa fa-calendar-check" />
        <span>Same Day</span>
      </RouterNavLink>
    </nav>
    <UploadForm />
  </>
);

export default Upload;
