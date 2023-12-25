import { useQuery } from "react-query";
import { AUTH_HEADER, STORAGE_KEY, REST_ENDPOINT } from '../constants';
import '../Types';

const fetchData = async (searchParam: SearchParamsType) => {
  // console.log('fetch#searchText: ', searchParam);
  const searchTextValue = searchParam.text || '';
  const encodedSearchText = encodeURIComponent(searchTextValue);

  let endpoint = `${REST_ENDPOINT}/api/posts/?searchParam=${encodedSearchText}`;
  const searchFilter = 0;
  endpoint = `${endpoint}&filterType=${searchFilter}`;
  // const start =  '2020-01-01';
  // endpoint = `${endpoint}&startDate=${start}`;
  // if (startDate.current) {
  //   const formattedDate = startDate.current;
  //   endpoint += `&startDate=${formattedDate}`;
  // }
  // if (endDate.current) {
  //   const formattedEndDate = endDate.current;
  //   endpoint += `&endDate=${formattedEndDate}`;
  // }
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
  const posts = data?.entries || [];

  return { posts, isLoading, error, startDate, endDate };
};
export default useSearchResults;
