import { useState } from 'react';
import { useSetting } from '../components/SettingContext';
import createHeaders from '../utils/createHeaders';
import { REST_ENDPOINT } from '../constants';
import { SettingsType, MediaType } from '../Types';

const useMediaSelect = (mediaDefault: MediaType) => {
  //type safe the media
  const { UPLOAD_ROOT } = useSetting() as SettingsType;
  const [mediaSelect, setMedia] = useState<MediaType>(mediaDefault);

  async function xhrCall(url: string) {
    console.log(`xhrCall ${url}`);

    const requestHeaders = createHeaders();
    const response = await fetch(url, {
      headers: requestHeaders,
    },
    );

    const json = await response.json();
    const random = Math.random();
    console.log('response :>> ', json);
    setMedia({
      ...mediaSelect,
      filesize: json?.size,
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
