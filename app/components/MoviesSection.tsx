interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

interface MoviesSectionProps {
  movies: Movie[];
}

export default function MoviesSection({ movies }: MoviesSectionProps) {
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
        <div key={movie.id} className="group relative bg-white/5 rounded-lg overflow-hidden transition-transform hover:scale-105">
          <div className="aspect-[2/3] bg-white/10 flex items-center justify-center text-white/30">
             <img 
               src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
               alt={movie.title}
               className="w-full h-full object-cover"
               loading="lazy"
             />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <h3 className="text-white font-medium text-sm truncate">{movie.title}</h3>
            <p className="text-white/70 text-xs">{movie.release_date?.split('-')[0] || 'N/A'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
