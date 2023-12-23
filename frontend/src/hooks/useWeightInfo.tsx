import { useQuery } from "react-query";
import { useContext } from 'react';
import MyContext from '../components/MyContext';

const fetchData = async (TRACKS_API: string, date: string) => {
  if (TRACKS_API !== '') {
    const weightApiUrl = `${TRACKS_API}?start=${date}&end=${date}`;
    const response = await fetch(weightApiUrl);

    const data = await response.json();
    return data.data[0];
  }
};

const useWeightInfo = (date: string) => {
  const { TRACKS_API } = useContext(MyContext);
  const { data: weight, error, isLoading } = useQuery(["postsData", date], () => fetchData(TRACKS_API, date));

  return { weight, isLoading, error }
};

export default useWeightInfo;
