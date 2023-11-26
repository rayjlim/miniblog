import { useEffect, useState } from 'react';
import { REST_ENDPOINT, STORAGE_KEY } from '../constants';
const useApp = () => {
  const [globalContext, setGlobalContext] = useState<any | null>(null);
  useEffect(() => {
    (async () => {
      const token = window.localStorage.getItem(STORAGE_KEY);
      console.log(`logged in: ${(token !== null && token !== '')} ${token}`);

      if (!globalContext) {
        try {
          const response = await fetch(`${REST_ENDPOINT}/settings/`, {
            mode: 'cors'
          });
         const results = await response.json();

          if (response.ok) {
            setGlobalContext(results);
          }
        } catch (error) {
          console.error('Error: ', error);
          throw new Error('Settings not loading correctly');
        }
      }
    })();
  });

  return { globalContext };
};
export default useApp;
