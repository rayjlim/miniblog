import { useQuery } from "react-query";
import { REST_ENDPOINT } from '../constants';
import createHeaders from '../utils/createHeaders';

const fetchData = async () => {
  console.log('fetch#YearMonth');
  const endpoint = `${REST_ENDPOINT}/api/yearMonth`;
  const requestHeaders = createHeaders();

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
