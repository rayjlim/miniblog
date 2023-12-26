import { useContext, useState } from 'react';
import MyContext from '../components/MyContext';
import createHeaders from '../utils/createHeaders';
import { REST_ENDPOINT } from '../constants';

const useMediaSelect = (mediaDefault: MediaType) => {
  //type safe the media
  const { UPLOAD_ROOT } = useContext(MyContext);

  const [mediaSelect, setMedia] = useState<MediaType>(mediaDefault);

  async function xhrCall(url: string) {
    console.log(`xhrCall ${url}`);

    const requestHeaders = createHeaders();
    const response = await fetch(url, {
      headers: requestHeaders,
    },
    );
    console.log('response :>> ', response);
    const random = Math.random();
    setMedia({
      ...mediaSelect,
      imgUrl: `${UPLOAD_ROOT}/${mediaSelect.filePath}/${mediaSelect.fileName}?r=${random}`,
    });
  }

  const resize = async () => {
    console.log(`resize ${mediaSelect.filePath}:${mediaSelect.fileName}`);
    const url = `${REST_ENDPOINT}/uploadResize/?fileName=${mediaSelect.fileName}&filePath=${mediaSelect.filePath}`;
    await xhrCall(url);
  };

  const rotate = async (degrees = 90) => {
    console.log(`ro:${degrees} ${mediaSelect.filePath}:${mediaSelect.fileName}`);
    let url = `${REST_ENDPOINT}/uploadRotate/?fileName=${mediaSelect.fileName}&filePath=${mediaSelect.filePath}`;
    if (degrees !== 90) {
      url += '&left=true';
    }
    await xhrCall(url);
  };

  return { mediaSelect, rotate, resize };
}

export default useMediaSelect;
