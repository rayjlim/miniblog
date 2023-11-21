import { useContext, useState } from 'react';
import format from 'date-fns/format';
import MyContext from '../components/MyContext';
import '../Types';
import {
  AUTH_HEADER,
  FULL_DATE_FORMAT,
  REST_ENDPOINT,
  STORAGE_KEY,
} from '../constants';

const useMediaSelect = (mediaDefault: MediaType) => {
  //type safe the media
  const { UPLOAD_ROOT } = useContext(MyContext);

  const [mediaSelect, setMedia] = useState<MediaType>(mediaDefault);
  const [quickDate, setQuickDate] = useState(format(new Date(), FULL_DATE_FORMAT));

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

  const dateChange = (value: string) => setQuickDate(value || format(new Date(), FULL_DATE_FORMAT));

  // TODO: impl api backend
  const quickCreate = () => { console.log(`quick: ${quickDate}`) };

  return { mediaSelect, rotate, resize, quickDate, dateChange, quickCreate };
}

export default useMediaSelect;
