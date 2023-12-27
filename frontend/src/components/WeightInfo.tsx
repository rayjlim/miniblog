import useWeightInfo from '../hooks/useWeightInfo';

const WeightInfo = ({ date }: { date: string }) => {
  const { weight, isLoading, error } = useWeightInfo(date);

  if (isLoading) return <div>Load weight...</div>;
  if (error)  return <div>An error occurred: {(error as RequestError).message}</div>;

  return (
    <span className="weight">
      {`Weight : ${weight?.count}`}
      {weight?.comment && <span title={weight?.comment}>...</span>}
    </span>
  );

};

export default WeightInfo;
