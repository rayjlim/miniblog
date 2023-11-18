import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns/format';
import { REST_ENDPOINT, STORAGE_KEY, AUTH_HEADER } from '../constants';
import Footer from '../components/Footer';

const UploadForm = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");
  function onChangeHandler(event: any) {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
  }

  async function upload() {
    const formData = new FormData();
    formData.append('fileToUpload', file as any);
    const filePath = (document.getElementById('filePath') as HTMLInputElement).value;
    formData.append(
      'filePath',
      filePath.length ? filePath : format(new Date(), 'yyyy-MM'),
    );

    console.log('send upload');
    const token = window.localStorage.getItem(STORAGE_KEY) || '';
    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set(AUTH_HEADER, token);
    try {
      const response = await fetch(`${REST_ENDPOINT}/uploadImage/`, {
        method: 'POST',
        body: formData,
        headers: requestHeaders,
      });

      console.log(response);
      const data = await response.json();
      setStatus("success")
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

  const footerLinks = {
    upload: false,
    media: true,
    logs: true,
    oneday: false,
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
              Select image to upload:
              {' '}
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
          >
            Upload
          </button>
        </form>
        <Result status={status}/>
      </div>
      <Footer links={footerLinks} />

    </>
  );
};

export default UploadForm;
