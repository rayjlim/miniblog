import { createContext, useContext } from 'react';
import { useQuery } from "react-query";
import { REST_ENDPOINT } from '../constants';

const SettingContext = createContext({});

const fetchData = async () => {
  const response = await fetch(`${REST_ENDPOINT}/settings/`, {
    mode: 'cors'
  });

  const data = await response.json();
  console.log(data);
  return data;
};

export const SettingProvider = ({ children }: { children: any }) => {
  const { data: settings, error, isLoading } = useQuery(["settings"], () => fetchData());

  if (isLoading) return <div>Loading settings...</div>;
  if (error)  return <div>An error occurred: {(error as RequestError).message}</div>;

  return (
    <SettingContext.Provider value={settings || {}}>
       {children}
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
