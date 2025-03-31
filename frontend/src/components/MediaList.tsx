import { useRef, memo } from 'react';
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
}) => {
  const dirRef = useRef<HTMLInputElement>(null);
  const handleDirInput = (value: string) => {
    const yearMonthRegex = /^\d{4}-(?:0[1-9]|1[0-2])$/;
    if (yearMonthRegex.test(value)) {
      onDirSelect(value);
    }
  };

  return (
    <>
      <h2>{`Dirs ${currentDir} (${dirs.length} folders)`}</h2>
      <div className="monthChooser">
        <input
          ref={dirRef}
          defaultValue={currentDir}
          type="text"
          placeholder="YYYY-MM"
          onChange={(e) => handleDirInput(e.target.value)}
          className="dir-input"
        />
        <select
          value={currentDir}
          onChange={(e) => onDirSelect(e.target.value)}
          className="dir-select"
        >
          <option value="">Select month</option>
          {dirs.map(dir => (
            <option key={dir} value={dir}>{dir}</option>
          ))}
        </select>
      </div>
    </>
  );
});

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
      <h2>{`Media (${medias.length} files)`}</h2>
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
