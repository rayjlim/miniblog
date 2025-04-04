import Header from '../components/Header';
import Footer from '../components/Footer';
import LogRow from '../components/LogRow';
import useLogs from '../hooks/useLogs';
import { RequestError } from '../Types';
import './Logs.css';

const Logs = () => {
  const { logs, logFileName, logFile, handleDelete, setLogFileName, error, isLoading } = useLogs();

  if (isLoading) return <div>Load ...</div>;
  if (error)  return <div>An error occurred: {(error as RequestError).message}</div>;

  return (
    <>
      <Header />
      <h1>Logs</h1>
      <ul>
        {logs.length &&
          logs.map((log: string) => (
            <LogRow log={log} handleDelete={handleDelete} getLog={(name) => setLogFileName(name)} key={log} />
          ))}
      </ul>
      <h2>Log File -{logFileName}</h2>
      <pre>{logFile}</pre>
      <Footer links={{
        upload: false,
        media: false,
        logs: false,
        oneday: true,
      }} />
    </>
  );
};

export default Logs;
