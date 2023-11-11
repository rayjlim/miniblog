import { useContext, useState, useEffect } from 'react';

import MyContext from '../components/MyContext';

const useWeightInfo = (date: string) => {
  const [weight, setWeight] = useState<{count: number, comment: string}>({count: 0, comment: ''});
  const {
    TRACKS_API
  } = useContext(MyContext);

  async function xhrCall(url: string, apiDescription: string) {
    console.log(`xhrCall ${url} : ${apiDescription}`);
    try {
      const apiResponse = await fetch(url, { cache: 'no-cache' });
      if (apiResponse.ok) {
        const data = await apiResponse.json();
        return data;
      }
      throw new Error(`${apiResponse.status}`);
    } catch (err) {
      console.error(err);
    }
    return false;
  }

  async function getWeight(date: string) {
    const weightApi = `${TRACKS_API}?start=${date}&end=${date}`;
    const data = await xhrCall(weightApi, 'weight');
    if (data?.data[0]?.count) {
      setWeight(data.data[0]);
    } else {
      setWeight({count: 0, comment: ''});
    }
  }

  useEffect(()=> {
    const ueFunc = async ()=>{
    if (TRACKS_API !== '') {
      await getWeight(date);
    }
  };
    ueFunc();
  }, [date]);

  return {weight}
};

export default useWeightInfo;
