import { useContext, useState } from 'react';
import { useQuery } from "react-query";
import MyContext from '../components/MyContext';

const fetchData = async (api: string) => {
  if (api !== '') {
    const response = await fetch(api);
    const data = await response.json();
    return data;
  }
};

const useInspiration = () => {
  const {
    INSPIRATION_API,
    QUESTION_API,
  } = useContext(MyContext);
  const [isInspiration, setIsInspiration] = useState<boolean>(true);
  const [random, setRandom] = useState(0);
  const [api, setApi] = useState<string>(INSPIRATION_API);

  async function getByType(isInspiration = true) {
    console.log('getByType');
    setApi(isInspiration ? INSPIRATION_API : QUESTION_API);
    setIsInspiration(isInspiration);
    setRandom(Math.random());
  }

  const { data, error, isLoading } = useQuery(["inspiration", random], () => fetchData(api));

  const output = isInspiration ? `${data?.message} - ${data?.author}` : data?.prompt;

  return { output, isLoading, error, getByType }
};

export default useInspiration;
