import { useContext, useState } from 'react';
import format from 'date-fns/format';

import MyContext from '../components/MyContext';

import { FULL_DATE_FORMAT } from '../constants';

const useMedia = () => {
  const { UPLOAD_ROOT } = useContext(MyContext);

  const [media, setMedia] = useState<{
    date: string,
    fileName: string,
    filePath: string,
    prepend: string,
    imgUrl: string,
  }|null>(null);

  // useEffect(() => {
  //   console.log('Media: useEffect');
  //   const loc = `${window.location}`;
  //   const param = loc.substring(loc.indexOf('?'));
  //   console.log('param :', param);
  //   const urlParams = new URLSearchParams(param);
  //   console.log('urlParams :', urlParams);
  //   const fileName = urlParams.get('fileName') || '';
  //   const filePath = urlParams.get('filePath') || '';
  //   const random = Math.random();
  //   setMedia({
  //     date: format(new Date(), FULL_DATE_FORMAT),
  //     fileName,
  //     filePath,
  //     prepend: `![](../uploads/${filePath}/${fileName}?)`,
  //     imgUrl: `${UPLOAD_ROOT}/${filePath}/${fileName}?r=${random}`,
  //   });
  // }, [UPLOAD_ROOT]);

  function selectMedia(filePath: string, fileName: string) {
    console.log(filePath, fileName);
    const random = Math.random();
    setMedia({
      date: format(new Date(), FULL_DATE_FORMAT),
      fileName,
      filePath,
      prepend: `![](../uploads/${filePath}/${fileName})`,
      imgUrl: `${UPLOAD_ROOT}/${filePath}/${fileName}?r=${random}`,
    });
  }

  return { media, selectMedia };
};

export default useMedia;
