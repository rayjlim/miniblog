import { useQuery } from "react-query";
import { useContext } from 'react';
import MyContext from '../components/MyContext';

const fetchData = async (api: string, date: string) => {
  if (api !== '') {
    const apiUrl = `${api}?start=${date}&end=${date}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  }
};

const useWeightInfo = (date: string) => {
  const { TRACKS_API } = useContext(MyContext);
  const { data, error, isLoading } = useQuery(["weight", date], () => fetchData(TRACKS_API, date));
  const weight = data?.data[0] || {count: 0};
  console.log(weight);
  return { weight, isLoading, error }
};

export default useWeightInfo;
