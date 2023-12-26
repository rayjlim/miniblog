import { useContext, useState, useEffect, useRef } from 'react';
import MyContext from '../components/MyContext';


const useMedia = () => {
  const { UPLOAD_ROOT } = useContext(MyContext);
  const isMounted = useRef<boolean>(false);
  const [media, setMedia] = useState<MediaType | null>(null);

  useEffect(() => {
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
          prepend: `![](../uploads/${filePath}/${fileName}?)`,
          imgUrl: `${UPLOAD_ROOT}/${filePath}/${fileName}?r=${random}`,
        });
      }
    }
    isMounted.current = true;
  }, []);

  function selectMedia(filePath: string, fileName: string) {
    console.log(filePath, fileName);
    if (filePath === '' && fileName === '') {
      setMedia(null);
      return;
    }
    const random = Math.random();
    setMedia({
      fileName,
      filePath,
      prepend: `![](../uploads/${filePath}/${fileName}?)`,
      imgUrl: `${UPLOAD_ROOT}/${filePath}/${fileName}?r=${random}`,
    });
  }

  return { media, selectMedia };
};

export default useMedia;
