import { createContext, useContext, useRef, useState } from 'react';
import { useQuery } from "react-query";
import { RequestError } from '../Types';
import { REST_ENDPOINT } from '../constants';

/**
 * example useage
 * //import { useSetting } from './SettingContext';
 * // const settings = useSetting();
 * // await settings?.updateSetting('propertyName', 'newValue');
 */
interface SettingContextType {
  [key: string]: any;
  updateSetting?: (propertyName: string, newValue: any) => Promise<void>;
}

const SettingContext = createContext<SettingContextType>({});

const fetchData = async () => {
  const response = await fetch(`${REST_ENDPOINT}/settings/`, {
    mode: 'cors'
  });

  const data = await response.json();
  return data;
};

export const SettingProvider = ({ children }: { children: any }) => {
  const isLoaded = useRef(false);
  const [localSettings, setLocalSettings] = useState<SettingContextType>({});
  const { data: settings, error, isLoading } = useQuery(["settings"], () => fetchData(), { keepPreviousData: true, enabled: !isLoaded.current });
  isLoaded.current = true;

  const updateSetting = async (propertyName: string, newValue: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [propertyName]: newValue
    }));
  };

  if (isLoading) return <div>Loading settings...</div>;
  if (error) return <div>Unable to Load Settings, an error occurred: {(error as RequestError).message}</div>;

  const mergedSettings = {
    ...(settings || {}),
    ...localSettings,
    updateSetting
  };

  return (
    <SettingContext.Provider value={mergedSettings}>
      {children}
    </SettingContext.Provider>
  );
};

export const useSetting = () => {
  const context = useContext(SettingContext);
  if (!context) {
    throw new Error('useSetting must be used within a SettingProvider');
  }
  return context as SettingContextType;
};
