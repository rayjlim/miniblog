import { useSetting } from './SettingContext';
import { MovieType, SettingsType } from '../Types';
import './MovieWindow.css';

const MovieWindow = ({ movie }: { movie: MovieType }) => {
  const { MOVIES_POSTERS } = useSetting() as SettingsType;
  const { title, imdbImageId, imdbId } = movie;
  const imageUrl = `${MOVIES_POSTERS}/${imdbImageId}.jpg`;
  const imdbUrl = `https://www.imdb.com/title/${imdbId}/`;

  return (
    <div className="movie">
      <a href={imdbUrl} target="_blank" rel="noreferrer">
        <img src={imageUrl} height="100px" alt="movie" title={title} />
      </a>
      {/* <div>{title}</div> */}
    </div>
  );
};

export default MovieWindow;
