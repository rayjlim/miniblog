import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns/format';
import { useSetting } from './SettingContext';
import { REST_ENDPOINT } from '../constants';
import { SettingsType } from '../Types';
import createHeaders from '../utils/createHeaders';

const UploadForm = () => {
  const navigate = useNavigate();
  const { UPLOAD_SIZE_LIMIT } = useSetting() as SettingsType;
  const [file, setFile] = useState<File>();
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");

  function onChangeHandler(event: any) {
    console.log(event.target.files[0]);
    if (event.target.files[0].size > UPLOAD_SIZE_LIMIT) {
      alert('File Size too large');
      setFile(undefined);
      return;
    }
    setFile(event.target.files[0]);
  }

  async function upload() {
    const formData = new FormData();
    if (!file) {
      alert('no file');
      return;
    }
    formData.append('fileToUpload', file);
    const filePath = (document.getElementById('filePath') as HTMLInputElement).value;
    formData.append(
      'filePath',
      filePath.length ? filePath : format(new Date(), 'yyyy-MM'),
    );
    setStatus("uploading");
    const requestHeaders = createHeaders();
    try {
      const response = await fetch(`${REST_ENDPOINT}/uploadImage/?a=1`, {
        method: 'POST',
        body: formData,
        headers: requestHeaders,
      });

      console.log(response);
      const data = await response.json();
      setStatus("success");
      navigate(`/media?fileName=${data.fileName}&filePath=${data.filePath}`);
    } catch (error) {
      console.log(error);
      alert(`Error uploading file ${error}`);
      setStatus("fail")
    }
  }

  const Result = ({ status }: { status: string }) => {
    if (status === "success") {
      return <p>✅ File uploaded successfully!</p>;
    } else if (status === "fail") {
      return <p>❌ File upload failed!</p>;
    } else if (status === "uploading") {
      return <p>⏳ Uploading selected file...</p>;
    } else {
      return null;
    }
  };

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
              {'Select image to upload: '}
              <input
                type="file"
                name="fileToUpload"
                onChange={onChangeHandler}
                id="fileToUpload"
              />
            </label>
            {file && (
              <section>
                File details:
                <ul>
                  <li>Name: {file.name}</li>
                  <li>Type: {file.type}</li>
                  <li>Size: {file.size} bytes</li>
                </ul>
              </section>
            )}
          </div>
          <button
            type="button"
            className="btn btn-success btn-block"
            onClick={() => upload()}
            disabled={!file || status == 'uploading'}
          >
            Upload
          </button>
        </form>
        <Result status={status} />
      </div>
    </>
  );
};

export default UploadForm;
