import { useState, useEffect, useRef } from 'react';
import { useSetting } from '../components/SettingContext';
import createHeaders from '../utils/createHeaders';
import { REST_ENDPOINT } from '../constants';
import { SettingsType, MediaType } from '../Types';

const useMedia = () => {
  const { UPLOAD_ROOT } = useSetting() as SettingsType;
  const isMounted = useRef<boolean>(false);
  const [media, setMedia] = useState<MediaType | null>(null);

  async function xhrCall(url: string) {
    console.log(`xhrCall ${url}`);

    const requestHeaders = createHeaders();
    const response = await fetch(url, {
      headers: requestHeaders,
    },
    );

    const json = await response.json();
    console.log('response :>> ', json);
    return json;
  }

  useEffect(() => {
    async () => {
      console.log('Media: useEffect');
      if (!isMounted.current) {

        const loc = `${window.location}`;
        const param = loc.substring(loc.indexOf('?'));
        console.log('param :', param);
        const urlParams = new URLSearchParams(param);
        console.log('urlParams :', urlParams);
        if (urlParams.has('fileName') && urlParams.has('filePath')) {
          const fileName = urlParams.get('fileName') || '';
          const filePath = urlParams.get('filePath') || '';
          const random = Math.random();
          setMedia({
            fileName,
            filePath,
            filesize: 0,
            prepend: `![](../uploads/${filePath}/${fileName}?)`,
            imgUrl: `${UPLOAD_ROOT}/${filePath}/${fileName}?t=${random}`,
          });
        }
      }
      isMounted.current = true;
    }
  }, []);

  async function selectMedia(filePath: string, fileName: string) {
    console.log(filePath, fileName);
    if (filePath === '' && fileName === '') {
      setMedia(null);
      return;
    }
    const random = Math.random();
    const url = `${REST_ENDPOINT}/mediainfo/?filePath=${filePath}&fileName=${fileName}`;
    const fileInfo = await xhrCall(url);
    console.log('set the media info');
    setMedia({
      fileName,
      filePath,
      filesize: fileInfo.fileSize,
      prepend: `![](../uploads/${filePath}/${fileName}?)`,
      imgUrl: `${UPLOAD_ROOT}/${filePath}/${fileName}?r=${random}`,
    });
  }

  return { media, selectMedia };
};

export default useMedia;
