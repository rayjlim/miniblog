import React from 'react';


const MovieWindow = (props) => {
  const imageUrl = `https://www.lilplaytime.com/moviedb_posters/${props.movie.imdbImageId}.jpg`;
  const imdbUrl = `https://www.imdb.com/title/${props.movie.imdbId}/`;

  return (

  <div className="spinner">
   <span>{props.movie.title}</span>
    <a href={imdbUrl} target="_blank"><img src={imageUrl} height="100px"></img></a>
  </div>
)};

export default MovieWindow;
