/* eslint-disable no-alert, no-console, no-unused-vars */
import React, { useState, useEffect } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';

import format from 'date-fns/format';
import constants from '../constants';
import AddForm from '../components/AddForm';
import MediaList from '../components/MediaList';

const Media = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    date: format(new Date(), constants.FULL_DATE_FORMAT),
    fileName: '',
    filePath: '',
    prepend: '',
    imgUrl: '',
  });

  const [mediaBaseDir, setMediaBaseDir] = useState('');
  const [showMedia, setShowMedia] = useState(false);

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
  // TODO: convert to customHook
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

  // ?fileName=0FE2E672-995F-481C-8E9F-ABA02BED3DAB.jpeg&filePath=2019-04/
  // http://localhost/projects/miniblog3/uploads/2019-10/B5BB1508-0AC2-4E85-A63B-22F843EDA3E9.jpeg
  // let fileName = `0FE2E672-995F-481C-8E9F-ABA02BED3DAB.jpeg`;
  // let filePath = `2019-04/`;
  // TODO: convert to customHook
  const resize = async () => {
    console.log(`resize ${post.filePath}:${post.fileName}`);
    const url = `${constants.REST_ENDPOINT}/uploadResize/?fileName=${post.fileName}&filePath=${post.filePath}`;
    await xhrCall(url);
  };

  const rotate = async (degrees = 90) => {
    console.log(`ro:${degrees} ${post.filePath}:${post.fileName}`);
    const token = window.localStorage.getItem(constants.STORAGE_KEY);
    let url = `${constants.REST_ENDPOINT}/uploadRotate/?fileName=${post.fileName}&filePath=${post.filePath}`;
    if (degrees !== 90) {
      url += '&left=true';
    }
    await xhrCall(url);
  };

  function handleAdd(e) {
    console.log(e);
    alert('Entry created');
    navigate('/oneday');
  }

  // rename(newName) {
  //     console.log('rename');
  //     console.log(newName);

  //     let oldName = this.props.fileName;
  //     console.log(oldName);
  //     let splitVal = oldName.split('.');

  //     let changedName = `${splitVal[0]}.jpg`;
  //     console.log(newName);
  //     EntryApi.renameImg(this.props.fileName, this.props.filePath, changedName);
  // }

  function copyToClipboard() {
    console.log(post.prepend);
    navigator.clipboard.writeText(post.prepend);
  }

  return (
    <>
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
            <button onClick={() => copyToClipboard()} type="button">
              [clip]
            </button>
            <div style={{ 'text-align': 'center' }}>
              <img src={post.imgUrl} alt="edit img" />
            </div>
          </section>
          <span style={{ 'font-size': '.8em' }}>Image is automatically prepended on submit</span>
          <AddForm
            date={post.date}
            content={post.prepend}
            onSuccess={e => handleAdd(e)}
          />
        </>
      )}

      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <RouterNavLink to="/upload" className="btn navbar-btn">
          <i className="fa fa-file-upload" />
          Upload Pix
        </RouterNavLink>
      </nav>
      <button onClick={e => setShowMedia(!showMedia)} type="button">Toggle Show Media</button>
      {showMedia && (
        // eslint-disable-next-line react/jsx-no-bind
        <MediaList baseDir={mediaBaseDir} onMediaSelect={mediaSelect} />
      )}
    </>
  );
};

export default Media;
