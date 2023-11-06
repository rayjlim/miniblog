import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import MyContext from './MyContext';
import './MovieWindow.css';

const MovieWindow = ({ movie }) => {
  const { MOVIES_POSTERS } = useContext(MyContext);
  const { title, imdbImageId, imdbId } = movie;
  const imageUrl = `${MOVIES_POSTERS}/${imdbImageId}.jpg`;
  const imdbUrl = `https://www.imdb.com/title/${imdbId}/`;

  return (
    <div className="movie">
      <a href={imdbUrl} target="_blank" rel="noreferrer">
        <img src={imageUrl} height="100px" alt="movie" />
      </a>
      <div>{title}</div>
    </div>
  );
};

export default MovieWindow;

MovieWindow.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    imdbImageId: PropTypes.string.isRequired,
    imdbId: PropTypes.string.isRequired,
  }).isRequired,
};
