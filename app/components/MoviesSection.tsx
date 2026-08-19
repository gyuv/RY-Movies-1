import MovieCard from './MovieCard';

interface MoviesSectionProps {
  movies: any[];
  languageCode?: string;
}

export default function MoviesSection({ movies, languageCode = 'en' }: MoviesSectionProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="flex justify-center items-center py-12 text-paper-dim stub-label">
        No movies found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 px-4 sm:px-6 lg:px-8">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          poster_path={movie.poster_path}
          vote_average={movie.vote_average}
          release_date={movie.release_date}
          languageCode={languageCode}
        />
      ))}
    </div>
  );
}
