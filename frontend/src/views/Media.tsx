import { ToastContainer } from 'react-toastify';

import Header from '../components/Header';
import Footer from '../components/Footer';


import MediaList from '../components/MediaList';
import MediaSelect from '../components/MediaSelect';
import useMedia from '../hooks/useMedia';

import './Media.css';

const Media = () => {
  const { media, selectMedia } = useMedia();

  const headerLinks = {
    search: false,
    oneday: true,
    sameday: true
  };
  const footerLinks = { upload: true, media: false, logs: false, oneday: false };

  return (
    <>
      <ToastContainer />
      <Header links={headerLinks} />
      {media && (
        <MediaSelect media={media as any} />
      )}
      {!media && (
        <MediaList onMediaSelect={selectMedia} />
      )}
      <Footer links={footerLinks} />
    </>
  );
};

export default Media;
