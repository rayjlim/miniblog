import React, { Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import UploadForm from '../components/UploadForm.jsx';

const Upload = () => {
  return (
    <Fragment>
        <Fragment>
          <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <RouterNavLink to="/">
              <i className="fa fa-home" /> <span>Home</span>
            </RouterNavLink>
            <RouterNavLink to="/?pageMode=1">
              {' '}
              <i className="fa fa-calendar-check" /> <span>Same Day</span>
            </RouterNavLink>
          </nav>
          <UploadForm />
        </Fragment>

    </Fragment>
  );
};

export default Upload;
