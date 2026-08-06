interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

export default function MoviesSection({ movies }: { movies: Movie[] }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="py-20 text-center text-white/50">
        <p>No movies found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {movies.map((movie) => (
        <div key={movie.id} className="bg-white/5 rounded-lg overflow-hidden">
          <div className="aspect-[2/3] bg-white/10 flex items-center justify-center text-white/30">
            {movie.poster_path ? 'Poster' : 'No Poster'}
          </div>
          <div className="p-3">
            <h3 className="text-white font-medium text-sm truncate">{movie.title}</h3>
            <p className="text-white/50 text-xs">{movie.vote_average.toFixed(1)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
