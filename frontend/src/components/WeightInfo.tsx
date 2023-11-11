import PropTypes from 'prop-types';

import useWeightInfo from '../hooks/useWeightInfo';

const WeightInfo = ({date}: {date: string}) => {
  const { weight } = useWeightInfo(date);

  return (
  <span className="weight">
    Weight :
    {weight.count}
    {weight.comment && weight.comment !== '' && <span title={weight.comment}>...</span>}
  </span>);
};

export default WeightInfo;

WeightInfo.propTypes = {
  date: PropTypes.string.isRequired
};
