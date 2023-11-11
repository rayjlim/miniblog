import { useContext, useState, useEffect } from 'react';
import MyContext from '../components/MyContext';

const useMovies = (date: string) => {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const {
    MOVIES_API,
  } = useContext(MyContext);

  async function xhrCall(url: string, apiDescription: string) {
    console.log(`xhrCall ${url} : ${apiDescription}`);
    try {
      const apiResponse = await fetch(url, { cache: 'no-cache' });
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        return data;
      }
      throw new Error(`${apiResponse.status}`);
    } catch (err) {
      console.error(err);
      // TODO: fix showing toast
      // toast(` ${url} get ${apiDescription} error : ${err}`);
    }
    return false;
  }

  async function getMovies(date: string) {
    const apiUrl = `${MOVIES_API}&advanced_search=true&dt_viewed=${date}`;
    const data = await xhrCall(apiUrl, 'movie');
    if (data && data.movies) {
      setMovies(data.movies);
    }
  }

  useEffect(()=> {
    const ueFunc = async ()=>{
    if (MOVIES_API !== '' && date !== '') {
      await getMovies(date);
    }
  };
    ueFunc();
  }, [date]);
  return {movies}
}

export default useMovies;
