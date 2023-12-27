import { ToastContainer } from 'react-toastify';
import useLoginPassword from '../hooks/useLoginPassword';

const LoginForm = () => {
  const {handleLogin, loginMutation, user} = useLoginPassword();
  return (
    <div className="App">
      <ToastContainer />
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <br />
        <button type="submit" disabled={loginMutation.isLoading}>
          {loginMutation.isLoading ? 'Logging in...' : 'Log In'}
        </button>
        {JSON.stringify(user)}
      </form>
    </div>
  );
};

export default LoginForm;
