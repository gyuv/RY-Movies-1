import Link from 'next/link';
import Image from 'next/image';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

export default function MovieGrid({ movies }: { movies: Movie[] }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in-up">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
        <p className="text-white/40 max-w-xs">Try adjusting your filters to discover more content.</p>
      </div>
    );
  }

  const FALLBACK_POSTER = "https://image.tmdb.org/t/p/w500/7WsyChQlPAZl9BvYlZbOgBz0q0.jpg"; // Generic movie poster

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {movies.map((movie, index) => {
        const hasPoster = movie.poster_path;
        const posterUrl = hasPoster 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
          : FALLBACK_POSTER;

        return (
          <Link 
            key={movie.id} 
            href={`/media/${movie.id}`} 
            className="group relative aspect-[2/3] rounded-2xl overflow-hidden glass-card animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              loading="lazy"
              onError={(e) => {
                // If the TMDB image breaks (e.g., 404), swap to fallback
                if (!hasPoster) {
                  (e.target as HTMLImageElement).src = FALLBACK_POSTER;
                }
              }}
            />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-sm leading-tight mb-2 line-clamp-2 drop-shadow-md">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs font-medium text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md backdrop-blur-sm">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {movie.vote_average?.toFixed(1)}
              </span>
              <span className="text-xs text-white/70 font-medium bg-black/20 px-2 py-1 rounded-md backdrop-blur-sm">
                {new Date(movie.release_date).getFullYear()}
              </span>
            </div>
          </div>
        </Link>
        );
      })}
    </div>
  );
}