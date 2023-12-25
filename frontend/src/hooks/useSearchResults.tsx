import { useQuery } from "react-query";
import { AUTH_HEADER, STORAGE_KEY, REST_ENDPOINT } from '../constants';
import '../Types';

const fetchData = async (searchParam: SearchParamsType) => {
  console.log('fetch#searchText: ', searchParam);
  const encodedSearchText = encodeURIComponent(searchParam.text);

  let endpoint = `${REST_ENDPOINT}/api/posts/?searchParam=${encodedSearchText}`;
  const searchFilter = 0;
  endpoint = `${endpoint}&filterType=${searchFilter}`;
  // const start =  '2020-01-01';
  // endpoint = `${endpoint}&startDate=${start}`;
  if (searchParam.startDate) {
    const formattedDate = searchParam.startDate;
    endpoint += `&startDate=${formattedDate}`;
  }
  if (searchParam.endDate) {
    const formattedEndDate = searchParam.endDate;
    endpoint += `&endDate=${formattedEndDate}`;
  }
  const requestHeaders: HeadersInit = new Headers();
  const token = window.localStorage.getItem(STORAGE_KEY) || '';
  requestHeaders.set(AUTH_HEADER, token);
  console.log(endpoint);
  const response = await fetch(endpoint, { headers: requestHeaders });

  const data = await response.json();
  console.log(data);
  return data;
};


const useSearchResults = (searchParams: SearchParamsType) => {
  const { data, error, isLoading } = useQuery(["search", searchParams], () => fetchData(searchParams));

  //prep output values
  const { startDate, endDate } = data?.params || {};
  const entries = data?.entries || [];

  return { data, entries, startDate, endDate, isLoading, error };
};
export default useSearchResults;
