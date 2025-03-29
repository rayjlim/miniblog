import { useState, useEffect, useCallback } from 'react';
import { useSetting } from '../components/SettingContext';
import createHeaders from '../utils/createHeaders';
import { REST_ENDPOINT } from '../constants';
import { SettingsType, MediaType } from '../Types';

const useMedia = () => {
  const { UPLOAD_ROOT } = useSetting() as SettingsType;
  const [media, setMedia] = useState<MediaType | null>(null);

  const xhrCall = useCallback(async (url: string) => {
    const requestHeaders = createHeaders();
    const response = await fetch(url, { headers: requestHeaders });
    return response.json();
  }, []);

  const createMediaObject = useCallback((fileName: string, filePath: string, fileSize = 0) => {
    const random = Math.random();
    return {
      fileName,
      filePath,
      filesize: fileSize,
      prepend: `![](../uploads/${filePath}/${fileName}?)`,
      imgUrl: `${UPLOAD_ROOT}/${filePath}/${fileName}?${random}`,
    };
  }, [UPLOAD_ROOT]);

  useEffect(() => {
    const initializeMedia = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const fileName = queryParams.get('fileName');
      const filePath = queryParams.get('filePath');

      if (fileName && filePath) {
        setMedia(createMediaObject(fileName, filePath));
      }
    };

    initializeMedia();
  }, [createMediaObject]);

  const selectMedia = useCallback(async (filePath: string, fileName: string) => {
    if (!filePath || !fileName) {
      setMedia(null);
      return;
    }

    try {
      const url = `${REST_ENDPOINT}/mediainfo/?filePath=${filePath}&fileName=${fileName}`;
      const fileInfo = await xhrCall(url);
      setMedia(createMediaObject(fileName, filePath, fileInfo.fileSize));
    } catch (error) {
      console.error('Error selecting media:', error);
      setMedia(null);
    }
  }, [xhrCall, createMediaObject]);

  return { media, selectMedia };
};

export default useMedia;
