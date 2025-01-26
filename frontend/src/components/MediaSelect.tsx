import format from 'date-fns/format';
import { FULL_DATE_FORMAT } from '../constants';
import Clipper from './Clipper';
import useMediaSelect from '../hooks/useMediaSelect';

import AddForm from '../components/AddForm';


const MediaSelect = ({ media, onClose }: { media: any, onClose: (msg: string) => void }) => {
  const { mediaSelect, rotate, resize } = useMediaSelect(media);

  const showFilesize = (filesize: number) => {
    if (filesize === undefined)
      return;
    const sizeStyle = (filesize > 100 * 1000) ? 'red' : 'lightgreen'
    return (
      <div style={{ 'color': sizeStyle }}>{`${filesize / 1000} KB`}</div>
    );
  }

  return (
    <>
      <p className="lead">Prepare the image for use</p>
      <div className="grid-3mw">
        <button onClick={() => rotate(-90)} type="button">Left</button>
        <button onClick={() => resize()} type="button">Resize</button>
        <button onClick={() => rotate(90)} type="button">Right</button>
      </div>
      <section className="container">
        {mediaSelect.imgUrl}
        <Clipper media={mediaSelect} />
        {showFilesize(mediaSelect?.filesize)}
        <div className="preview-img-container">
          <img src={mediaSelect.imgUrl} alt="edit img" className="preview" />
        </div>
      </section>
      <span className="footnote">Image is automatically prepended on submit</span>
      <AddForm
        date={format(new Date(), FULL_DATE_FORMAT)}
        content={mediaSelect.prepend}
        onSuccess={onClose}
      />
    </>
  );
};

export default MediaSelect;
