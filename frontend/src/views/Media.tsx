import { useContext, useState, useEffect } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import format from 'date-fns/format';

import MyContext from '../components/MyContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

import {
  FULL_DATE_FORMAT,
  REST_ENDPOINT,
  STORAGE_KEY,
  AUTH_HEADER
} from '../constants';
import AddForm from '../components/AddForm';
import MediaList from '../components/MediaList';

import './Media.css';

const Media = () => {
  const { UPLOAD_ROOT } = useContext(MyContext);
  const navigate = useNavigate();
  const [post, setPost] = useState<{
    date: string,
    fileName: string | null,
    filePath: string | null,
    prepend: string,
    imgUrl: string,
  }>({
    date: format(new Date(), FULL_DATE_FORMAT),
    fileName: '',
    filePath: '',
    prepend: '',
    imgUrl: '',
  });

  const [showMedia, setShowMedia] = useState(true);

  useEffect(() => {
    console.log('Media: useEffect');
    const loc = `${window.location}`;
    const param = loc.substring(loc.indexOf('?'));
    console.log('param :', param);
    const urlParams = new URLSearchParams(param);
    console.log('urlParams :', urlParams);
    const fileName = urlParams.has('fileName') ? urlParams.get('fileName') : '';
    const filePath = urlParams.has('filePath') ? urlParams.get('filePath') : '';
    const random = Math.random();
    setPost({
      ...post,
      fileName,
      filePath,
      prepend: `![](../uploads/${filePath}/${fileName}?)`,
      imgUrl: `${UPLOAD_ROOT}/${filePath}/${fileName}?r=${random}`,
    });
  }, [UPLOAD_ROOT]);

  function mediaSelect(filePath: string, fileName: string) {
    console.log(filePath, fileName);
    const random = Math.random();
    setPost({
      ...post,
      fileName,
      filePath,
      prepend: `![](../uploads/${filePath}/${fileName})`,
      imgUrl: `${UPLOAD_ROOT}/${filePath}/${fileName}?r=${random}`,
    });
    setShowMedia(false);
  }

  async function xhrCall(url: string) {
    console.log(`xhrCall ${url}`);
    const token = window.localStorage.getItem(STORAGE_KEY) || '';
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set(AUTH_HEADER, token);
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: requestHeaders,
      },
    );
    console.log('response :>> ', response);
    const random = Math.random();
    setPost({
      ...post,
      imgUrl: `${UPLOAD_ROOT}/${post.filePath}/${post.fileName}?r=${random}`,
    });
  }

  const resize = async () => {
    console.log(`resize ${post.filePath}:${post.fileName}`);
    const url = `${REST_ENDPOINT}/uploadResize/?fileName=${post.fileName}&filePath=${post.filePath}`;
    await xhrCall(url);
  };

  const rotate = async (degrees = 90) => {
    console.log(`ro:${degrees} ${post.filePath}:${post.fileName}`);
    let url = `${REST_ENDPOINT}/uploadRotate/?fileName=${post.fileName}&filePath=${post.filePath}`;
    if (degrees !== 90) {
      url += '&left=true';
    }
    await xhrCall(url);
  };

  function copyToClipboard(content: string) {
    console.log(`clipboard: ${content}`);
    navigator.clipboard.writeText(content);
  }
  const headerLinks = {
    search: false,
    oneday: true,
    sameday: true
  };
  const footerLinks = {upload: true, media: false, logs: false, oneday: false};

  return (
    <>
      <ToastContainer />
      <Header links={headerLinks}/>
      {post.fileName !== '' && (
        <>
          <p className="lead">Prepare the image for use</p>
          <div className="grid-3mw">
            <button onClick={() => rotate(-90)} type="button">Left</button>
            <button onClick={() => resize()} type="button">Resize</button>
            <button onClick={() => rotate(90)} type="button">Right</button>
          </div>
          {/* rename={this.rename} */}
          <section className="container">
            {post.imgUrl}
            <button onClick={() => copyToClipboard(post.prepend)} type="button">
              [clip]
            </button>
            <div className="preview-img-container">
              <img src={post.imgUrl} alt="edit img" className="preview" />
            </div>
          </section>
          <span className="footnote">Image is automatically prepended on submit</span>
          <AddForm
            date={post.date}
            content={post.prepend}
            onSuccess={msg => {
              if (msg !== '') {
                toast(msg);
                setTimeout((() => { navigate('/oneday'); }), 2000);
              } else {
                navigate('/oneday');
              }
            }}
          />
        </>
      )}
      <button onClick={() => setShowMedia(!showMedia)} type="button">Toggle Show Media</button>
      {showMedia && (
        <MediaList onMediaSelect={mediaSelect} />
      )}
      <Footer links={footerLinks}/>

    </>
  );
};

export default Media;
