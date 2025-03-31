import { useQuery } from "react-query";
import { useSetting } from '../components/SettingContext';
import { SettingsType } from '../Types';
const fetchData = async (api: string, date: string) => {
  if (api !== '') {
    const apiUrl = `${api}?start=${date}&end=${date}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  }
};

const useWeightInfo = (date: string) => {
  const { TRACKS_API } = useSetting() as SettingsType;
  const { data, error, isLoading } = useQuery(["weight", date], () => fetchData(TRACKS_API, date));
  const weight = data?.data[0] || { count: 0 };

  return { weight, isLoading, error }
};

export default useWeightInfo;
