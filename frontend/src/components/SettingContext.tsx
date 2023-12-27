import { createContext, useContext, useState, useEffect } from 'react';
import { REST_ENDPOINT, STORAGE_KEY } from '../constants';

const SettingContext = createContext({});

export const SettingProvider = ({ children }: { children: any }) => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  console.log('setting provider');
  useEffect(() => {
    console.log('seting up Setting Context');
    (async () => {
      const token = window.localStorage.getItem(STORAGE_KEY);
      console.log(`logged in: ${(token !== null && token !== '')} ${token}`);

      if (!settings && token) {
        try {
          const response = await fetch(`${REST_ENDPOINT}/settings/`, {
            mode: 'cors'
          });
          const results = await response.json();

          if (response.ok) {
            console.log('Setting Context is UP');
            setSettings(results);
            console.log(results);
          }
        } catch (error) {
          console.error('Error: ', error);
          throw new Error('Settings not loading correctly');
        }finally {
          setLoading(false);
        }
      }
    })();
  }, [settings]);


  return (
    <SettingContext.Provider value={settings || {}}>
       {loading ? <div>Loading settings...</div> : children}
    </SettingContext.Provider>
  );
};

export const useSetting = () => {
  const context = useContext(SettingContext);
  if (!context) {
    throw new Error('useSetting must be used within a SettingProvider');
  }
  return context;
};
