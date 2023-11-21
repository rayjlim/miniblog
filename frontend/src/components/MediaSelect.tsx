import { FunctionComponent } from 'react';
import format from 'date-fns/format';

import PropTypes from 'prop-types';
import { FULL_DATE_FORMAT } from '../constants';
import Clipper from './Clipper';
import useMediaSelect from '../hooks/useMediaSelect';

import '../Types';

import AddForm from '../components/AddForm';

const propTypes = {
  media: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

type MediaSelectProps = PropTypes.InferProps<typeof propTypes>;

const MediaSelect: FunctionComponent<MediaSelectProps> = ({ media, onClose }: { media: any, onClose: (msg: string) => void }) => {
  const { mediaSelect, rotate, resize } = useMediaSelect(media);

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

MediaSelect.propTypes = propTypes;
