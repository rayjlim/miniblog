import Header from '../components/Header';
import UploadForm from '../components/UploadForm';

const Upload = () => (
  <>
    <Header links={{
      search: true,
      oneday: true,
      sameday: false,
    }} />
    <UploadForm />
  </>
);

export default Upload;
