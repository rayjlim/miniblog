import React, { Fragment } from 'react';
import constants from '../constants';
import axios from 'axios';
import { useAuth0 } from '../utils/react-auth0-spa';

const Home = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const logoutWithRedirect = async () => {
    const result = await axios(
      `${constants.REST_ENDPOINT}security?logout=true&debug=off`
    );
    console.log('result :', result);
    if (result.status !== 200) {
      console.log('result.status :', result.status);
      alert(`loading error : ${result.status}`);
      return;
    } else if (typeof result.data === 'string') {
      console.log('invalid json');
    } else {
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
