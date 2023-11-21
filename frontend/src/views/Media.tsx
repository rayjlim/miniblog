import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import MediaList from '../components/MediaList';
import MediaSelect from '../components/MediaSelect';
import useMedia from '../hooks/useMedia';

import './Media.css';

const Media = () => {
  const { media, selectMedia } = useMedia();

  const navigate = useNavigate();
  const mediaClosed = (msg: string) => {
    if (msg !== '') {
      toast(msg);
      setTimeout((() => { navigate('/oneday'); }), 1500);
    } else {
      selectMedia('', '');
    }
  }

  const headerLinks = {
    search: false, oneday: true, sameday: true
  };
  const footerLinks = {
    upload: true, media: false, logs: false, oneday: false
  };

  return (
    <>
      <ToastContainer />
      <Header links={headerLinks} />
      {media && (
        <MediaSelect media={media} onClose={mediaClosed} />
      )}
      {!media && (
        <MediaList onMediaSelect={selectMedia} />
      )}
      <Footer links={footerLinks} />
    </>
  );
};

export default Media;
