import { memo } from 'react';
import format from 'date-fns/format';
import { FULL_DATE_FORMAT } from '../constants';
import Clipper from './Clipper';
import useMediaSelect from '../hooks/useMediaSelect';
import AddForm from './AddForm';
import { MediaType } from '../Types';

interface MediaSelectProps {
  media: MediaType;
  onClose: (msg: string) => void;
}

const FileSizeIndicator = memo(({ size }: { size: number }) => {
  if (!size) return null;
  const sizeInKB = size / 1000;
  const color = sizeInKB > 100 ? 'red' : 'lightgreen';
  return <div style={{ color }}>{`${sizeInKB} KB`}</div>;
});

const MediaSelect = ({ media, onClose }: MediaSelectProps) => {
  const { mediaSelect, rotate, resize } = useMediaSelect(media);

  return (
    <>
      <p className="lead">Prepare the image for use</p>
      <div className="grid-3mw">
        <button
          type="button"
          onClick={() => rotate(-90)}
          className="btn btn-secondary"
        >
          Left
        </button>
        <button
          type="button"
          onClick={resize}
          className="btn btn-primary"
        >
          Resize
        </button>
        <button
          type="button"
          onClick={() => rotate(90)}
          className="btn btn-secondary"
        >
          Right
        </button>
      </div>

      <section className="container">
        {mediaSelect.imgUrl}
        <Clipper media={mediaSelect} />
        <FileSizeIndicator size={mediaSelect.filesize} />
        {mediaSelect.exif && `${mediaSelect.exif?.gps?.latitude}, ${mediaSelect.exif?.gps?.longitude}`}
        <div className="preview-img-container">
          <img
            src={mediaSelect.imgUrl}
            alt="Preview"
            className="preview"
          />
        </div>
      </section>

      <span className="footnote">Image is automatically prepended on submit</span>
      <AddForm
        date={format(new Date(), FULL_DATE_FORMAT)}
        content={mediaSelect.prepend}
        location={mediaSelect.exif?.gps?.latitude && mediaSelect.exif?.gps?.longitude ? {
          title: 'Photo Location',
          coord: `${mediaSelect.exif.gps.latitude}, ${mediaSelect.exif.gps.longitude}`
        } : undefined}
        onSuccess={onClose}
      />
    </>
  );
};

export default memo(MediaSelect);
