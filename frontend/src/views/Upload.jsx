import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import UploadForm from '../components/UploadForm';

const Upload = () => (
  <>
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
