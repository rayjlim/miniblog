import { useQuery } from "react-query";
import { useSetting } from '../components/SettingContext';
import { SettingsType } from '../Types';

const fetchData = async (api: string, date: string) => {
  if (api !== '') {
    const apiUrl = `${api}&advanced_search=true&dt_viewed=${date}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  }
};

const useMovies = (date: string) => {
  const { MOVIES_API } = useSetting() as SettingsType;
  const { data, error, isLoading } = useQuery(["movies", date], () => fetchData(MOVIES_API, date));
  const movies = data?.movies;

  return { movies, isLoading, error }
}

export default useMovies;
