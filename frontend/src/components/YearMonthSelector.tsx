import Select from 'react-select';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import useFetchYearMonths from '../hooks/useFetchYearMonths';
import { FULL_DATE_FORMAT } from '../constants';

const YearMonthSelector = ({ changeDate }: { changeDate: (date: string, type: string) => void }) => {
  const { yearMonths, isLoading, error } = useFetchYearMonths();

  if (isLoading) return <div>Load ..</div>;
  if (error)  return <div>An error occurred: {(error as RequestError).message}</div>;

  return (
    <Select
      options={yearMonths}
      onChange={(chosen: any) => {
        const parts = chosen?.value.split('-');
        changeDate(format(startOfMonth(new Date(parts[0], parts[1] - 1)), FULL_DATE_FORMAT), 'start');
        changeDate(format(endOfMonth(new Date(parts[0], parts[1] - 1)), FULL_DATE_FORMAT), 'end');
      }}
      styles={{
        control: (provided) => ({
          ...provided,
          boxShadow: "none",
          border: "none",
          backgroundColor: "#222",
          color: "#FFF",
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#000' : '#000',
          color: "#FFF",
        })
      }}
    />
  );
};
export default YearMonthSelector;
