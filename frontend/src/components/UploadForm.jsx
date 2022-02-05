import React, { useState } from 'react'; // eslint-disable-line no-unused-vars
import constants from '../constants';
import format from 'date-fns/format';

import history from '../utils/history';

const UploadForm = () => {
  const [selectFile, setSelectedFile] = useState(null);

  function onChangeHandler(event) {
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  }
  async function upload(event) {
    // const data = new FormData()
    // data.append('file', selectFile)

    const formData = new FormData();
    formData.append('fileToUpload', selectFile);
    const filePath = document.getElementById('filePath').value;
    formData.append(
      'filePath',
      filePath.length ? filePath : format(new Date(), 'yyyy-MM')
    );


      console.log(`send upload`);
      const token = window.localStorage.getItem('appToken');
      const response = await fetch(`${constants.REST_ENDPOINT}/uploadImage/`, {
        method: 'POST',
        body: formData,
        headers: {
          'x-app-token': token,
        },
      });

      console.log(response);
      const data = await response.json();
      history.push(
        `/media?fileName=${data.fileName}&filePath=${data.filePath}`
      );

  }

  return (
    <div className="container">
      <form action="../uploadImage/">
        <div className="form-group">
          <label htmlFor="fileToUpload">Select image to upload:a</label>

          <input
            type="file"
            name="fileToUpload"
            onChange={onChangeHandler}
            id="fileToUpload"
          />
        </div>
        <div className="form-group">
          <label htmlFor="filePath">Path</label>
          <input
            type="text"
            className="form-control"
            id="filePath"
            name="filePath"
          />
        </div>
        {/* <div className="form-group">
                    <label for="newName">New Name</label>
                    <input type="text" className="form-control" id="newName" name="newName" value="" />
                </div> */}
        <button
          type="button"
          className="btn btn-success btn-block"
          onClick={e=>upload()}
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
