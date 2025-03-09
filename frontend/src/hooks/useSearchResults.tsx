import { Dispatch, useImperativeHandle, useRef, MutableRefObject, SetStateAction, ForwardedRef } from 'react';
import { useQuery } from "react-query";
import { EntryType, SearchParamsType } from '../Types';
import { REST_ENDPOINT } from '../constants';
import createHeaders from '../utils/createHeaders';

const buildEndpoint = (params: SearchParamsType): string => {
  const { text, startDate, endDate, resultsLimit } = params;
  const queryParams = new URLSearchParams({
    searchParam: text || '',
    filterType: '0',
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(resultsLimit && { resultsLimit: resultsLimit.toString() })
  });

  return `${REST_ENDPOINT}/api/posts/?${queryParams}`;
};

const fetchData = async (searchParam: SearchParamsType) => {
  const endpoint = buildEndpoint(searchParam);
  console.log(endpoint);
  const requestHeaders = createHeaders();
  const response = await fetch(endpoint, { headers: requestHeaders });

  const data = await response.json();
  console.log(data);
  return data;
};
interface SearchResultsProps {
  params: SearchParamsType;
  editEntryId: MutableRefObject<number>;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  ref: ForwardedRef<HTMLElement>;
}

interface RefMethods {
  resetView: (entry: EntryType) => void;
}

const useSearchResults = ({ params, editEntryId, setIsEditing, ref }: SearchResultsProps) => {

  const { data, error, isLoading, refetch } = useQuery(["search", params], () => fetchData(params));

  const { startDate, endDate } = data?.params || {};
  const entries = data?.entries || [];

  useImperativeHandle<any, RefMethods>(ref, () => ({
    resetView: (entry: EntryType) => {
      if (entry.content === 'DELETE' || entry.id !== -1) {
        refetch();
      }

      setIsEditing(false);

      requestAnimationFrame(() => {
        const target = document.getElementById(`li${editEntryId.current}`);
        target?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }
  }), [refetch, setIsEditing, editEntryId]);

  return { data, entries, startDate, endDate, isLoading, error };
};
export default useSearchResults;
