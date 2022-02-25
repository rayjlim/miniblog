import React, { useState } from 'react';
import history from '../utils/history';
import Constants from '../constants';

function LoginPassword() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const checkLogin = async function (formUser = '', formPass = '') {
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
      const response = await fetch(`${Constants.REST_ENDPOINT}/security`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const results = await response.json();

        console.log(results);
        if (results.token) {
          window.localStorage.setItem('appToken', results.jwt);
        }
        return results.token;
      } else {
        console.log('Network response was not ok.');
      }
    } catch (error) {
      console.log('Error when parsing means not logged in, ' + error);
    }
  };

  const doLogin = async function () {
    console.log(user);
    console.log(password);
    const token = await checkLogin(user, password);
    setUser('');
    setPassword('');
    console.log(token);
    // goto main page
    history.push(`/oneday`);
  };

  const doLogout = () => {
    window.localStorage.setItem('appToken', null);
  };

  //TODO in useEffect; if has localstorage token redirect to /oneday

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
      <button onClick={e => doLogin()}>Login</button>
    </div>
  );
}

export default LoginPassword;
