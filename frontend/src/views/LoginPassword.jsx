import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ribbon.css';

import constants from '../constants';

const LoginPassword = () => {
  const navigate = useNavigate();
  const user = useRef();
  const password = useRef();

  // TODO: convert to customHook
  const checkLogin = async (formUser = '', formPass = '') => {
    const formData = {
      username: formUser,
      password: formPass,
      login: true,
    };

    try {
      const response = await fetch(`${constants.REST_ENDPOINT}/security`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const results = await response.json();

        console.log(results);
        if (results.token) {
          window.localStorage.setItem(constants.STORAGE_KEY, results.token);
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

  const doLogin = async () => {
    console.log(user.current.value, password.current.value);
    const token = await checkLogin(user.current.value, password.current.value);
    if (!token) {
      user.current.value = '';
      password.current.value = '';
      toast.error('Bad Login');
    } else {
      console.log(token);
      // goto main page
      navigate('/oneday');
    }
  };

  return (
    <div className="App">
      {constants.ENVIRONMENT === 'development' && <a className="github-fork-ribbon" href="https://url.to-your.repo" data-ribbon="Development" title="Development">Development</a>}
      <ToastContainer />
      <h1>Login</h1>
      <span>User</span>
      <input type="text" ref={user} />
      <span>Password</span>
      <input type="password" ref={password} />
      <button onClick={() => doLogin()} type="button">
        Login
      </button>
    </div>
  );
};

export default LoginPassword;
