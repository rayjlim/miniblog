import { createContext } from 'react';

const MyContext = createContext({
  UPLOAD_ROOT: '',
  MOVIES_API: '',
  MOVIES_POSTERS: '',
  INSPIRATION_API: '',
  QUESTION_API: '',
  TRACKS_API: '',
  GOOGLE_OAUTH_CLIENTID: ''
});

export default MyContext;
