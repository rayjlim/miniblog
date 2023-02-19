import React from 'react';
import PropTypes from 'prop-types';
import './MovieWindow.css';

const MovieWindow = ({ movie }) => {
  const { title, imdbImageId, imdbId } = movie;
  const imageUrl = `https://www.lilplaytime.com/moviedb_posters/${imdbImageId}.jpg`;
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
