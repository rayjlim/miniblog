import { memo } from 'react';
import MediaItem from './MediaItem';
import useMediaList from '../hooks/useMediaList';
import { RequestError } from '../Types';
import './MediaList.css';

interface MediaListProps {
  onMediaSelect: (path: string, file: string) => void;
}

const DirectoryList = memo(({ dirs, currentDir, onDirSelect }: {
  dirs: string[];
  currentDir: string;
  onDirSelect: (dir: string) => void;
}) => (
  <>
    <h2>{`Dirs ${currentDir} (${dirs.length})`}</h2>
    <div>
      {dirs.map((dir) => (
        <button
          type="button"
          key={dir}
          onClick={() => onDirSelect(dir)}
          className={dir === currentDir ? 'highlight-dir' : ''}
        >
          {dir}
        </button>
      ))}
    </div>
  </>
));

const MediaList = ({ onMediaSelect }: MediaListProps) => {
  const {
    medias,
    uploadDirs,
    currentDir,
    setCurrentDir,
    onDeleteItem,
    error,
    isLoading
  } = useMediaList();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as RequestError).message}</div>;

  return (
    <>
      <DirectoryList
        dirs={uploadDirs}
        currentDir={currentDir}
        onDirSelect={setCurrentDir}
      />
      <h2>{`Media (${medias.length})`}</h2>
      <ul className="media-preview">
        {currentDir && medias.map((media: string) => (
          <MediaItem
            key={media}
            media={media}
            currentDir={currentDir}
            selectMedia={onMediaSelect}
            onDelete={onDeleteItem}
          />
        ))}
      </ul>
    </>
  );
};

export default memo(MediaList);
