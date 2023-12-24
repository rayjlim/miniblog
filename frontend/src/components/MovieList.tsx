import PropTypes from 'prop-types';

import MovieWindow from './MovieWindow';
import useMovies from '../hooks/useMovies';
import './MovieWindow.css';
import '../Types';

const MovieList = ({ date }: { date: string }) => {
  const { movies, isLoading, error } = useMovies(date);

  if (isLoading) return <div>Load movies...</div>;
  if (error) return <div>An error occurred: {error?.message}</div>;

  return (
    <section className="movieList">
      {movies && movies.map((movie: MovieType) => (
        <MovieWindow movie={movie} key={movie.id} />
      ))}
    </section>
  );
};

export default MovieList;

MovieList.propTypes = {
  date: PropTypes.string.isRequired
};
