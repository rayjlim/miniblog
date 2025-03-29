import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import MediaList from '../components/MediaList';
import MediaSelect from '../components/MediaSelect';
import useMedia from '../hooks/useMedia';

import './MediaView.css';

const MediaView = () => {
  const { media, selectMedia } = useMedia();
  const navigate = useNavigate();

  const headerLinks = {
    search: false,
    oneday: true,
    sameday: true
  };

  const footerLinks = {
    upload: true,
    media: false,
    logs: false,
    oneday: false
  };

  const handleMediaClose = useCallback((msg: string) => {
    if (msg) {
      toast(msg);
      const timer = setTimeout(() => {
        navigate('/oneday');
        clearTimeout(timer);
      }, 1500);
    } else {
      selectMedia('', '');
    }
  }, [navigate, selectMedia]);

  return (
    <>
      <Header links={headerLinks} />
      {media ? (
        <MediaSelect media={media} onClose={handleMediaClose} />
      ) : (
        <MediaList onMediaSelect={selectMedia} />
      )}
      <Footer links={footerLinks} />
    </>
  );
};

export default MediaView;
