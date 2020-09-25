import React, { useState } from 'react'; // eslint-disable-line no-unused-vars
import constants from '../constants';
import format from 'date-fns/format';
import axios from 'axios';
import history from '../utils/history';

const UploadForm = () => {
  const [selectFile, setSelectedFile] = useState(null);

  function onChangeHandler(event) {
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  }
  function upload(event) {
    // const data = new FormData()
    // data.append('file', selectFile)

    const data = new FormData();
    data.append('fileToUpload', selectFile);
    const filePath = document.getElementById('filePath').value;
    data.append(
      'filePath',
      filePath.length ? filePath : format(new Date(), 'yyyy-MM')
    );
    data.append('xhr', true);

    (async () => {
      console.log(`send axios`);

      const result = await axios.post(
        `${constants.REST_ENDPOINT}uploadImage/`,
        data
      );

      console.log(result.data);
      history.push(
        `/media?fileName=${result.data.fileName}&filePath=${result.data.filePath}`
      );
    })();
  }
  return (
    <div className="container">
      <form action="../uploadImage/">
        <div className="form-group">
          <label htmlFor="fileToUpload">Select image to upload:</label>

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
          onClick={upload}
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
