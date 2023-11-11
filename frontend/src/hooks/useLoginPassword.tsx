import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

import { REST_ENDPOINT, STORAGE_KEY } from '../constants';

const useLoginPassword = ()=>{
  const navigate = useNavigate();
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const login = useGoogleLogin({
    onSuccess: codeResponse => setUser(codeResponse),
    onError: error => console.log('Login Failed:', error),
  });

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
        cache: 'no-cache',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if(response.status === 403){
          return false;
        } else{
          throw new Error('Network response was not ok.');
        }
      } else {
        const results = await response.json();

        console.log(results);
        if (results.token) {
          window.localStorage.setItem(STORAGE_KEY, results.token);
        }
        return results.token;
      }
    } catch (error) {
      const message = (`Error when parsing means not logged in, ${error}`);
      console.error(message);
      toast.error(message);
    }
    return false;
  };

  const doLogin = async (id: any) => {
    console.log('doLogin', id);
    console.log(username.current?.value, password.current?.value);
    const loginParam = id
      ? { id, formUser: 'n/a', formPass: 'n/a' }
      : { formUser: username.current?.value, formPass: password.current?.value };
    console.log('loginParam', loginParam);
    const token = await checkLogin(loginParam);
    if (!token) {
      let refUsername = username.current || { value: ''};
      refUsername.value = '';
      let refPassword = password.current || { value: ''};
      refPassword.value = '';
      toast.error('Bad Login');
    } else {
      console.log(token);
      navigate('/oneday');
    }
  };

  const logOut = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem('user-name');
    googleLogout();
    setProfile(null);
  };

  useEffect(
    () => {
      async function ueFunc(){
        if (user) {
          try {
            const endpoint = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`;
            const response = await fetch(endpoint);
            const results = await response.json();
            console.log(results);
            setProfile(results);
            window.localStorage.setItem('user-name', results.name);
            if (user.access_token) {
              doLogin(results.id);
            }
          } catch (err) {
            console.error(err);
          }
        } else {
          logOut();
        }
      }
      ueFunc();
    },
    [doLogin, user],
  );

  return {username, password, doLogin, logOut, login, profile};
};

export default useLoginPassword;
