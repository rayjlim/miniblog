import React, { Fragment } from "react";

import { useAuth0 } from "../utils/react-auth0-spa";


const Home = () => {
    const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
    
    const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin
    });

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
        <button  onClick={() => logoutWithRedirect()}>Logout</button>
        </>
    )}
    </Fragment>
    );
    }

export default Home;








