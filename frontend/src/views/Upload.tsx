import Header from '../components/Header';
import Footer from '../components/Footer';
import UploadForm from '../components/UploadForm';

const Upload = () => (
  <>
    <Header links={{
      search: true,
      oneday: true,
      sameday: false,
    }} />
    <UploadForm />
    <Footer links={
      {
        upload: false,
        media: true,
        logs: true,
        oneday: false,
      }
    } />
  </>
);
export default Upload;
