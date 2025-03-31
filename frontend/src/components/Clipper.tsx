import { toast } from 'react-toastify';
import { MediaType } from '../Types';
const Clipper = ({ media }: { media: MediaType }) => {

  function copyToClipboard(content: string) {
    console.log(`clipboard: ${content}`);
    navigator.clipboard.writeText(content);
    toast(content, { autoClose: 500 });
  }

  return (
    <button onClick={() => copyToClipboard(media.prepend)} type="button">
      [clip]
    </button>
  );
};
export default Clipper;
