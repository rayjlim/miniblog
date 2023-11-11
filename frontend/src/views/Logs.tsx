import { ToastContainer } from 'react-toastify';

import Header from '../components/Header';
import Footer from '../components/Footer';
import LogRow from '../components/LogRow';
import useLogs from '../hooks/useLogs';

import './Logs.css';

const Logs = () => {
  const { logs, logFileName, logFile, handleDelete, getLog } = useLogs();

  const footerLinks = {
    upload: false,
    media: false,
    logs: false,
    oneday: true,
  };
  return (
    <>
      <ToastContainer />
      <Header />
      <h1>Logs</h1>
      <ul>
        {logs.length &&
          logs.map((log: string) => (
            <LogRow log={log} handleDelete={handleDelete} getLog={getLog} />
          ))}
      </ul>
      <h2>Log File -{logFileName}</h2>
      <pre>{logFile}</pre>
      <Footer links={footerLinks} />
    </>
  );
};

export default Logs;
