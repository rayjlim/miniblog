import React, { Fragment } from 'react';
import constants from '../constants';

import { useAuth0 } from '../utils/react-auth0-spa';

const Home = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const logoutWithRedirect = async () => {
    const response = await fetch(
      `${constants.REST_ENDPOINT}security?logout=true&debug=off`
    );
    console.log('response :', response);
    if (!response.ok) {
      console.log('response.status :', response.status);
      alert(`loading error : ${response.status}`);
      return;
    } else {
      const data = await response.json();

      alert('logged out');
      logout({
        returnTo: window.location.origin,
      });
    }
  };

  return (
    <Fragment>
      {!isAuthenticated && (
        <button
          id="qsLoginBtn"
          color="primary"
          className="btn-margin"
          onClick={() => loginWithRedirect({})}
        >
          Log in
        </button>
      )}

      {isAuthenticated && (
        <>
          <span>{user.name}</span>
          <button onClick={() => logoutWithRedirect()}>Logout</button>
        </>
      )}
    </Fragment>
  );
};

export default Home;
