import { useContext, useState, useEffect } from 'react';
import MyContext from '../components/MyContext';

const useInspiration = () => {
  const [inspiration, setInspiration] = useState<string>('');
  const {
    INSPIRATION_API,
    QUESTION_API,
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

  async function getInspiration() {
    const apiUrl = `${INSPIRATION_API}`;
    const data = await xhrCall(apiUrl, 'inspiration');
      setInspiration(`Inspire: ${data.message} : ${data.author}`);
  }
  async function getPrompt() {
    const data = await xhrCall(QUESTION_API, 'prompt');
    setInspiration(`Question: ${data.prompt} : ${data.category}`);
  }

  useEffect(()=> {
    const ueFunc = async ()=>{
    if (INSPIRATION_API !== '') {
      await getInspiration();
    }
  };
    ueFunc();
  }, []);

  return {inspiration, getInspiration, getPrompt};
};

export default useInspiration;
