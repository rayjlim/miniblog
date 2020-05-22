import React, { Fragment } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';

import UploadForm from '../components/UploadForm.jsx';
import { useAuth0 } from '../utils/react-auth0-spa';

const Upload = () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    return (
        <Fragment>
            {!isAuthenticated && (
                <button id="qsLoginBtn" color="primary" className="btn-margin" onClick={() => loginWithRedirect({})}>
                    Log in
                </button>
            )}
            {isAuthenticated && (
                <Fragment>
                    <nav className="navbar navbar-expand-sm navbar-light bg-light">
                        <RouterNavLink to="/">
                            <i className="fa fa-home" /> <span>Home</span>
                        </RouterNavLink>
                        <RouterNavLink to="/?pageMode=1">
                            {' '}
                            <i className="fa fa-calendar-check" /> <span>Same Day</span>
                        </RouterNavLink>
                        <RouterNavLink to="/calendar">
                            <i className="fa fa-calendar" /> <span>Calendar</span>
                        </RouterNavLink>
                        <a href="https://miniblog.lilplaytime.com/login.php">
                            <i className="fa fa-sign-in" /> <span>Login</span>
                        </a>
                    </nav>
                    <UploadForm />
                </Fragment>
            )}
        </Fragment>
    );
};

export default Upload;

