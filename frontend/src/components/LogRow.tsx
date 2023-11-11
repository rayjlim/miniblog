const LogRow = ({
  log,
  handleDelete,
  getLog,
}: {
  log: string,
  handleDelete: (log: string) => void,
  getLog: (log: string) => void,
}) => {
  return (
    <li key={log}>
      <button type="button" onClick={() => getLog(log)}>
        {log}
      </button>
      <button
        onClick={() => handleDelete(log)}
        className="btn btn-danger pull-right"
        type="button"
      >
        <i className="fa fa-trash" />
      </button>
    </li>
  );
};

export default LogRow;
