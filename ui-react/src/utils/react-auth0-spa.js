import React, { useState, useEffect, useContext } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';
import constants from '../constants';
import axios from 'axios';

const DEFAULT_REDIRECT_CALLBACK = () => window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({ children, onRedirectCallback = DEFAULT_REDIRECT_CALLBACK, ...initOptions }) => {
    const [ isAuthenticated, setIsAuthenticated ] = useState();
    const [ user, setUser ] = useState();
    const [ auth0Client, setAuth0 ] = useState();
    const [ loading, setLoading ] = useState(true);
    const [ popupOpen, setPopupOpen ] = useState(false);

    const COOKIE_NAME = 'auth0.is.authenticated';
    function clearCookie() {
        console.log('clear cookie : ');
        document.cookie = `${COOKIE_NAME}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`;
        window.location.reload(false);
    }

    useEffect(() => {
        const initAuth0 = async () => {
            try {
                const myVar = setTimeout(() => {
                    clearCookie();
                }, 3000);
                const auth0FromHook = await createAuth0Client(initOptions);
                clearTimeout(myVar);
                setAuth0(auth0FromHook);

                if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
                    console.log('auth:code,state :>> ', window.location);
                    const { appState } = await auth0FromHook.handleRedirectCallback();
                    onRedirectCallback(appState);
                }

                const isAuthenticated = await auth0FromHook.isAuthenticated();
                setIsAuthenticated(isAuthenticated);

                if (isAuthenticated) {
                    const user = await auth0FromHook.getUser();
                    console.log('auth-spa#user :>> ', user);
                    setUser(user);

                    const result = await axios.post(`${constants.REST_ENDPOINT}security`, {
                        email: user.email,
                        sub: user.sub
                    });
                    console.log('result :', result);
                    if (result.status !== 200) {
                        console.log('result.status :', result.status);
                        alert(`loading error : ${result.status}`);
                        return;
                    } else if (typeof result.data === 'string') {
                        console.log('invalid json');
                    } else {
                        // TODO: show snackbar
                    }
                }
            } catch (e) {
                // alert('auth error>> ', e)
                clearCookie();
            }
            setLoading(false);
        };
        initAuth0();
        // eslint-disable-next-line
    }, []);

    const loginWithPopup = async (params = {}) => {
        setPopupOpen(true);
        try {
            await auth0Client.loginWithPopup(params);
        } catch (error) {
            console.error(error);
        } finally {
            setPopupOpen(false);
        }
        const user = await auth0Client.getUser();
        setUser(user);
        setIsAuthenticated(true);
    };

    const handleRedirectCallback = async () => {
        setLoading(true);
        await auth0Client.handleRedirectCallback();
        const user = await auth0Client.getUser();
        setLoading(false);
        setIsAuthenticated(true);
        setUser(user);
    };
    return (
        <Auth0Context.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                popupOpen,
                loginWithPopup,
                handleRedirectCallback,
                getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
                loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
                getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
                getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
                logout: (...p) => auth0Client.logout(...p)
            }}
        >
            {children}
        </Auth0Context.Provider>
    );
};
