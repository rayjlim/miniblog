import { FunctionComponent } from 'react';
import PropTypes from 'prop-types';

import MediaItem from '../components/MediaItem';
import useMediaList from '../hooks/useMediaList';
import './MediaList.css';

const propTypes = {
  onMediaSelect: PropTypes.func.isRequired,
};

type MediaListProps = PropTypes.InferProps<typeof propTypes>;

const MediaList: FunctionComponent<MediaListProps> = ({ onMediaSelect }:
  { onMediaSelect: (path: string, file: string) => void }) => {

  const { medias, uploadDirs, currentDir, setCurrentDir, mediaDelete } = useMediaList();
    console.log(medias);
  return (
    <div>
      <h2>{`Dirs ${currentDir} (${uploadDirs.length})`}</h2>
      {uploadDirs.length
        && uploadDirs.map((dir: string) => (
          <button onClick={() => setCurrentDir(dir)} type="button" key={dir}
          className={dir === currentDir ? 'highlight-dir' : ''}>{dir}</button>
        ))}
      <h2>
        Media (
        {medias.length}
        )
      </h2>
      {medias.length && currentDir !== '' && (
        <ul className="media-preview">
          {medias.map((key: string) => (
            <MediaItem key={key} media={key} currentDir={currentDir} selectMedia={onMediaSelect}
            onChange={mediaDelete}/>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MediaList;

MediaList.propTypes = propTypes;
