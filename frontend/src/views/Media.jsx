import React, { useState, useEffect } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import format from 'date-fns/format';
import constants from '../constants';
import AddForm from '../components/AddForm';
import MediaList from '../components/MediaList';
import pkg from '../../package.json';

const Media = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    date: format(new Date(), constants.FULL_DATE_FORMAT),
    fileName: '',
    filePath: '',
    prepend: '',
    imgUrl: '',
  });

  const mediaBaseDir = '';
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
      prepend: `![](../uploads/${filePath}${fileName})`,
      imgUrl: `${constants.UPLOAD_ROOT}/${filePath}${fileName}?r=${random}`,
    });
  }, []);

  function mediaSelect(filePath, fileName) {
    const random = Math.random();
    setPost({
      ...post,
      fileName,
      filePath,
      prepend: `![](../uploads/${filePath}${fileName})`,
      imgUrl: `${constants.UPLOAD_ROOT}/${filePath}${fileName}?r=${random}`,
    });
    setShowMedia(false);
  }

  async function xhrCall(url) {
    console.log(`xhrCall ${url}`);
    const token = window.localStorage.getItem(constants.STORAGE_KEY);
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Token': token,
        },
      },
    );
    console.log('response :>> ', response);
    const random = Math.random();
    setPost({
      ...post,
      imgUrl: `${constants.UPLOAD_ROOT}/${post.filePath}${post.fileName}?r=${random}`,
    });
  }

  const resize = async () => {
    console.log(`resize ${post.filePath}:${post.fileName}`);
    const url = `${constants.REST_ENDPOINT}/uploadResize/?fileName=${post.fileName}&filePath=${post.filePath}`;
    await xhrCall(url);
  };

  const rotate = async (degrees = 90) => {
    console.log(`ro:${degrees} ${post.filePath}:${post.fileName}`);
    let url = `${constants.REST_ENDPOINT}/uploadRotate/?fileName=${post.fileName}&filePath=${post.filePath}`;
    if (degrees !== 90) {
      url += '&left=true';
    }
    await xhrCall(url);
  };

  function copyToClipboard(content) {
    console.log(`clipboard: ${content}`);
    navigator.clipboard.writeText(content);
  }

  return (
    <>
      <ToastContainer />
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <RouterNavLink to="/oneday">
          <i className="fa fa-home" />
          <span>Home</span>
        </RouterNavLink>
        <RouterNavLink to="/oneday?pageMode=1">
          {' '}
          <i className="fa fa-calendar-check" />
          <span>Same Day</span>
        </RouterNavLink>
      </nav>
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
            <div style={{ textAlign: 'center' }}>
              <img src={post.imgUrl} alt="edit img" className="preview" />
            </div>
          </section>
          <span style={{ fontSize: '.8em' }}>Image is automatically prepended on submit</span>
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
        // eslint-disable-next-line react/jsx-no-bind
        <MediaList baseDir={mediaBaseDir} onMediaSelect={mediaSelect} />
      )}
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <RouterNavLink to="/upload" className="btn navbar-btn">
          <i className="fa fa-file-upload" />
          Upload Pix
        </RouterNavLink>
        <span className="footer-version">
          v
          {pkg.version}
        </span>
      </nav>
    </>
  );
};

export default Media;
