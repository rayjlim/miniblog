import { useContext } from 'react';
import { useQuery } from "react-query";
import MyContext from '../components/MyContext';

const fetchData = async (api: string, date: string) => {
  if (api !== '') {
    const apiUrl = `${api}&advanced_search=true&dt_viewed=${date}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  }
};

const useMovies = (date: string) => {
  const { MOVIES_API } = useContext(MyContext);
  const { data, error, isLoading } = useQuery(["movies", date], () => fetchData(MOVIES_API, date));
  const movies = data?.movies;
  console.log(movies);
  return { movies, isLoading, error }
}

export default useMovies;
