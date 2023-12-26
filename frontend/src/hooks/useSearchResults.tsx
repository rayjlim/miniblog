import { useImperativeHandle, useRef, MutableRefObject } from 'react';
import { useQueryClient, useQuery } from "react-query";
import { REST_ENDPOINT } from '../constants';
import createHeaders from '../utils/createHeaders';
import '../Types';

const fetchData = async (searchParam: SearchParamsType) => {
  const { text, startDate, endDate } = searchParam;
  console.log('fetch#searchText: ', text);
  const encodedSearchText = encodeURIComponent(text || '');

  const endpoint = `${REST_ENDPOINT}/api/posts/?searchParam=${encodedSearchText}&filterType=0${startDate ? `&startDate=${startDate}` : ''
    }${endDate ? `&endDate=${endDate}` : ''}`;
  console.log(endpoint);
  const requestHeaders = createHeaders();
  const response = await fetch(endpoint, { headers: requestHeaders });

  const data = await response.json();
  console.log(data);
  return data;
};


const useSearchResults = (params: SearchParamsType, editEntryId: MutableRefObject<Number>, setIsEditing: any, ref: any) => {
  const internalState = useRef();
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery(["search", params], () => fetchData(params));

  //prep output values
  const { startDate, endDate } = data?.params || {};
  const entries = data?.entries || [];
  console.log(data);
  internalState.current = data;
  // Expose a custom API to the parent component
  useImperativeHandle(ref, () => ({
    resetView: (entry: EntryType) => {
      console.log('resetView', entry, internalState.current);
      const _data = internalState.current as any;
      if (entry.content === 'DELETE') {
        console.log('delete', data);

        const revised = _data?.entries.filter((curr: EntryType) => curr.id !== entry.id);
        queryClient.setQueryData(["search", params], { ..._data, entries: revised });
      } else {
        console.log('edit', _data);
        const revised = _data?.entries.map((curr: EntryType) => (curr.id === entry.id) ? entry : curr);
        queryClient.setQueryData(["search", params], { ..._data, entries: revised });
      }

      console.log('resetView:', internalState.current, entry);
      setIsEditing(false);

      setTimeout(() => {
        console.log(editEntryId.current);
        const target = document.getElementById(`li${editEntryId.current}`);
        target?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 0);
    }
  }), [internalState]);

  return { data, entries, startDate, endDate, isLoading, error };
};
export default useSearchResults;
