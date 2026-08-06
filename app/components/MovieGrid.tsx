import Link from 'next/link';
import Image from 'next/image';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
}

export default function MovieGrid({ movies }: { movies: Movie[] }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9.172 16.172a4 4 0 005.656 0M9.172 16.172l-2.828-2.828M17.828 8.828l-2.828 2.828" />
        </svg>
        <p className="text-lg font-medium">No movies found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <Link 
          key={movie.id} 
          href={`/media/${movie.id}`} 
          className="group relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-white/5 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-white/20"
        >
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs p-2 text-center italic bg-gray-700">
              {movie.title}
            </div>
          )}
          
          {/* Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
            <h3 className="text-white font-bold text-sm truncate mb-1">{movie.title}</h3>
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1 text-yellow-400">
                ★ {movie.vote_average?.toFixed(1)}
              </span>
              <span>
                {new Date(movie.release_date).getFullYear()}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}