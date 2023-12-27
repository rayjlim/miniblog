import MediaItem from '../components/MediaItem';
import useMediaList from '../hooks/useMediaList';

import './MediaList.css';

const MediaList = ({ onMediaSelect }:
  { onMediaSelect: (path: string, file: string) => void }) => {

  const { medias, uploadDirs, currentDir, setCurrentDir, onDeleteItem, error, isLoading } = useMediaList();

  if (isLoading) return <div>Load ...</div>;
  if (error) return <div>An error occurred: {(error as RequestError).message}</div>;

  return (
    <>
      <h2>{`Dirs ${currentDir} (${uploadDirs.length})`}</h2>
      <div>
        {uploadDirs.length
          && uploadDirs.map((dir: any) => (
            <button onClick={() => setCurrentDir(dir)} type="button" key={dir}
              className={dir === currentDir ? 'highlight-dir' : ''}>{dir}</button>
          ))}
      </div>
      <h2>{`Media (${medias.length})`}</h2>
      <ul className="media-preview">
        {medias.length && currentDir !== '' && medias.map((key: any) => (
          <MediaItem key={key} media={key} currentDir={currentDir} selectMedia={onMediaSelect}
            onDelete={onDeleteItem} />
        ))}
      </ul>
    </>
  );
};

export default MediaList;
