import { useState } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import format from 'date-fns/format';
import { REST_ENDPOINT, STORAGE_KEY } from '../constants';
import pkg from '../../package.json';

const UploadForm = () => {
  const navigate = useNavigate();
  const [selectFile, setSelectedFile] = useState<string | Blob>('');

  function onChangeHandler(event: any) {
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  }

  async function upload() {
    const formData = new FormData();
    formData.append('fileToUpload', selectFile);
    const filePath = (document.getElementById('filePath') as HTMLInputElement).value;
    formData.append(
      'filePath',
      filePath.length ? filePath : format(new Date(), 'yyyy-MM'),
    );

    console.log('send upload');
    const token = window.localStorage.getItem(STORAGE_KEY) || '';
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set('X-App-Token', token);
    try {
      const response = await fetch(`${REST_ENDPOINT}/uploadImage/`, {
        method: 'POST',
        body: formData,
        headers: requestHeaders,
      });

      console.log(response);
      const data = await response.json();
      navigate(`/media?fileName=${data.fileName}&filePath=${data.filePath}`);
    } catch (error) {
      console.log(error);
      alert(`Error uploading file ${error}`);
    }
  }

  return (
    <>
      <div className="container">
        <form action="../uploadImage/">
          <input
            type="hidden"
            className="form-control"
            id="filePath"
            name="filePath"
            value=""
          />
          <div className="form-group">
            <label htmlFor="fileToUpload">
              Select image to upload:
              {' '}
              <input
                type="file"
                name="fileToUpload"
                onChange={onChangeHandler}
                id="fileToUpload"
              />
            </label>
          </div>
          <button
            type="button"
            className="btn btn-success btn-block"
            onClick={() => upload()}
          >
            Upload
          </button>
        </form>
      </div>
      <nav className="navbar navbar-expand-sm navbar-light bg-light text-left">
        <RouterNavLink to="/upload">
          <i className="fa fa-file-upload" />
          {' '}
          <span className="nav-text">Upload Pix</span>
        </RouterNavLink>
        <RouterNavLink to="/media">
          <i className="fa fa-portrait" />
          {' '}
          <span className="nav-text">Media</span>
          {' '}
        </RouterNavLink>
        <RouterNavLink to="/logs">
          <i className="fa fa-clipboard-list" />
          {' '}
          <span className="nav-text">Logs</span>
          {' '}
        </RouterNavLink>
        <span className="footer-version">
          v
          {pkg.version}
        </span>
      </nav>
    </>
  );
};

export default UploadForm;
