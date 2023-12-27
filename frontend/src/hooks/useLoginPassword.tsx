import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { STORAGE_KEY } from '../constants';
// import { googleLogout, useGoogleLogin } from '@react-oauth/google';




// const fetchGoogleInfo = async (user: any) => {
//   console.log(user);
//   const endpoint = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`;
//   const response = await fetch(endpoint);
//   const data = await response.json();
//   console.log(data);
//   return data;
// }

const useLoginPassword = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth() as any;

  const loginMutation = useMutation((credentials: { username: string, password: string }) => login(credentials.username, credentials.password));

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;

    try {
      await loginMutation.mutateAsync({ username, password });
    } catch (error) {
      toast('Login failed');
      console.error('Login failed:', error);
    }

  };
  console.log(user);
  if (user) {
    window.localStorage.setItem(STORAGE_KEY, user.token);
    navigate('/oneday');
  }

  return {handleLogin, loginMutation, user};
};
export default useLoginPassword;



  // const username = useRef<HTMLInputElement>(null);
  // const password = useRef<HTMLInputElement>(null);
  // const [attemptLogin, setAttemptLogin] = useState(false);

  // const login = useGoogleLogin({
  //   onSuccess: codeResponse => setUser(codeResponse),
  //   onError: error => console.log('Login Failed:', error),
  // });

  // const [user, setUser] = useState<any>(null);
  // const [profile, setProfile] = useState<any>(null);

//   const id = useRef(null);
//   const _userRefCurr = username.current;
//   const _passRefCurr = username.current;
//   const formData = {
//     id: id.current,
//     username: _userRefCurr?.value,
//     password: _passRefCurr?.value,
//     login: true,
//   };
//   console.log(attemptLogin);
//   const { data, error, isLoading } = useQuery(["login", formData], () => fetchData(formData));
//   console.log(data);
//   // const { data: dataG, error: errorG, isLoading: isLoadingG } = useQuery(["googleinfo", user], () => fetchGoogleInfo(user), { enabled: user !== null });

//   // console.log(dataG, errorG, isLoadingG)

//   function doLogin(){
//     setAttemptLogin(true);
//   }
//   if(attemptLogin){
//     setAttemptLogin(false);
//   }

//   return { error, isLoading, username, password, doLogin };
// };


//       console.log(results);
// setProfile(results);
// window.localStorage.setItem('user-name', results.name);
// if (user.access_token) {
//   doLogin(results.id);
// }
// const doLogin = async (id: any) => {
//   console.log('doLogin', id);
//   console.log(username.current?.value, password.current?.value);
//   const loginParam = id
//     ? { id, formUser: 'n/a', formPass: 'n/a' }
//     : { formUser: username.current?.value, formPass: password.current?.value };
//   console.log('loginParam', loginParam);

//   const token = await checkLogin(loginParam);

//   if (!token) {
//     let refUsername = username.current || { value: '' };
//     refUsername.value = '';
//     let refPassword = password.current || { value: '' };
//     refPassword.value = '';
//     toast.error('Bad Login');
//   } else {
//     console.log(token);
//     navigate('/oneday');
//   }
// };

