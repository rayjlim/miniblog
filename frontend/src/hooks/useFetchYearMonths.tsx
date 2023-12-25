import { useQuery } from "react-query";
import { AUTH_HEADER, STORAGE_KEY, REST_ENDPOINT } from '../constants';

const fetchData = async () => {
  console.log('fetch#YearMonth');
  const endpoint = `${REST_ENDPOINT}/api/yearMonth`;
  const requestHeaders: HeadersInit = new Headers();
  const token = window.localStorage.getItem(STORAGE_KEY) || '';
  requestHeaders.set(AUTH_HEADER, token);

  const response = await fetch(endpoint, { headers: requestHeaders });

  const data = await response.json();
  const returnValue = data.map((row: string) => ({ label: row, value: row }))
  return returnValue;
};

const useFetchYearMonths = () => {
  const { data, error, isLoading } = useQuery("YearMonths", () => fetchData());

  return { yearMonths: data, isLoading, error };
};



export default useFetchYearMonths;


