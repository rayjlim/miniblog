import React from 'react';
import PropTypes from 'prop-types';

const MovieWindow = ({ title, imdbImageId, imdbId }) => {
  const imageUrl = `https://www.lilplaytime.com/moviedb_posters/${imdbImageId}.jpg`;
  const imdbUrl = `https://www.imdb.com/title/${imdbId}/`;

  return (
    <div className="spinner">
      <span>{title}</span>
      <a href={imdbUrl} target="_blank" rel="noreferrer">
        <img src={imageUrl} height="100px" alt="movie" />
      </a>
    </div>
  );
};

export default MovieWindow;

MovieWindow.propTypes = {
  title: PropTypes.string.isRequired,
  imdbImageId: PropTypes.string.isRequired,
  imdbId: PropTypes.string.isRequired,
};
