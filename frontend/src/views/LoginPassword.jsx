// import React, { useState, useRef, useEffect } from 'react';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
// import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import 'react-toastify/dist/ReactToastify.css';

import { REST_ENDPOINT, STORAGE_KEY } from '../constants';

const LoginPassword = () => {
  const navigate = useNavigate();
  const username = useRef();
  const password = useRef();
  // const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // const login = useGoogleLogin({
  //   onSuccess: codeResponse => setUser(codeResponse),
  //   onError: error => console.log('Login Failed:', error),
  // });

  // TODO: convert to customHook
  const checkLogin = async ({ formUser = '', formPass = '', id = '' }) => {
    const formData = {
      id,
      username: formUser,
      password: formPass,
      login: true,
    };

    try {
      const response = await fetch(`${REST_ENDPOINT}/security`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const results = await response.json();

        console.log(results);
        if (results.token) {
          window.localStorage.setItem(STORAGE_KEY, results.token);
        }
        return results.token;
      }
      // const message = 'Network response was not ok.';
      // console.error(message);
      // toast.error(message);
    } catch (error) {
      const message = `Error when parsing means not logged in ${error}`;
      console.error(message);
      toast.error(message);
    }
    return false;
  };

  const doLogin = async id => {
    console.log('doLogin', id);
    console.log(username.current.value, password.current.value);
    const loginParam = id
      ? { id, formUser: 'n/a', formPass: 'n/a' }
      : { formUser: username.current.value, formPass: password.current.value };
    console.log('loginParam', loginParam);
    const token = await checkLogin(loginParam);
    if (!token) {
      username.current.value = '';
      password.current.value = '';
      toast.error('Bad Login');
    } else {
      console.log(token);
      // goto main page
      navigate('/oneday');
    }
  };

  const logOut = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    // googleLogout();
    setProfile(null);
  };

  // useEffect(
  //   async () => {
  //     if (user) {
  //       try {
  //         const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`);
  //         const results = await response.json();
  //         console.log(results);
  //         setProfile(results);
  //         if (user.access_token) {
  //           doLogin(results.id);
  //         }
  //         // create security backend that takes an ID
  //         // encrypt .env files
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //   },
  //   [user],
  // );
  return (
    <div className="App">
      <ToastContainer />
      <h1>
        Login
        -
        {process.env.NODE_ENV}
        -
        {REST_ENDPOINT}
        -
      </h1>
      <span>User</span>
      <input type="text" ref={username} />
      <span>Password</span>
      <input type="password" ref={password} />
      <button onClick={() => doLogin(null)} type="button">
        Login with Password
      </button>
      <div>
        <h2>Google Login</h2>
        {profile?.id ? (
          <div>
            <img src={profile.picture} alt="user" />
            <h3>User Logged in</h3>
            <p>
              Name:
              {profile.name}
            </p>
            <p>
              Email Address:
              {profile.email}
            </p>
            <br />
            <br />
            <button onClick={logOut} type="button">Log out</button>
          </div>
        ) : (
          // <button onClick={() => login()} type="button">Sign in with Google</button>
          <button onClick={() => console.log('google login')} type="button">Sign in with Google</button>
        )}
      </div>
    </div>
  );
};

export default LoginPassword;
