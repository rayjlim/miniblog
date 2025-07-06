import useWeightInfo from '../hooks/useWeightInfo';
import { useSetting } from '../components/SettingContext';
import { SettingsType, RequestError } from '../Types';

const WeightInfo = ({ date }: { date: string }) => {
  const { weight, isLoading, error } = useWeightInfo(date);
  const { TRACKS_URL } = useSetting() as SettingsType;

  if (isLoading) return <div>Load weight...</div>;
  if (error) return <div>An error occurred: {(error as RequestError).message}</div>;

  return (
    <div className="weight">
      <a href={TRACKS_URL}>Weight</a>
      {`: ${weight?.count}`}
      {weight?.comment && <span title={weight?.comment} style={{ 'fontSize': 'small', 'margin': '0 0 0 10px' }}>{weight?.comment}</span>}
    </div>
  );

};

export default WeightInfo;
