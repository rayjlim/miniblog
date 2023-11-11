import { ToastContainer } from 'react-toastify';

import useLoginPassword from '../hooks/useLoginPassword';
const LoginPassword = () => {
  const {username, password, doLogin, logOut, login, profile} = useLoginPassword();

  return (
    <div className="App">
      <ToastContainer />
      <h1>Login</h1>
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
          <button onClick={() => login()} type="button">Sign in with Google</button>
        )}
      </div>
    </div>
  );
};

export default LoginPassword;
