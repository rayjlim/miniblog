import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import constants from '../constants';

const LoginPassword = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const checkLogin = async (formUser = '', formPass = '') => {
    // const formData = new URLSearchParams();

    // formData.append('username', formUser);
    // formData.append('password', formPass);
    // formData.append('login', true);
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
      console.log('Network response was not ok.');
    } catch (error) {
      console.log(`Error when parsing means not logged in ${error}`);
    }
    return true;
  };

  const doLogin = async () => {
    console.log(user);
    console.log(password);
    const token = await checkLogin(user, password);
    setUser('');
    setPassword('');
    console.log(token);
    // goto main page
    navigate('/oneday');
  };

  // const doLogout = () => {
  //   window.localStorage.setItem(constants.STORAGE_KEY, null);
  // };

  return (
    <div className="App">
      <span>User</span>
      <input type="text" value={user} onChange={e => setUser(e.target.value)} />
      <span>Password</span>
      <input
        type="text"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={() => doLogin()} type="button">Login</button>
    </div>
  );
};

export default LoginPassword;
