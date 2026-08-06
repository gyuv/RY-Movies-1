'use client';

import Link from 'next/link';

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  languageCode?: string;
}

export default function MovieCarousel({ title, movies, languageCode }: MovieCarouselProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        <Link 
          href={`/?language=${languageCode || 'all'}&sort=popularity.desc`}
          className="text-sm text-white/60 hover:text-white transition-colors"
        >
          View All →
        </Link>
      </div>
      
      <div className="relative group">
        <div className="flex overflow-x-auto space-x-4 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-4 scrollbar-hide snap-x">
          {movies.map((movie) => (
            <Link 
              key={movie.id} 
              href={`/media/${movie.id}`}
              className="flex-none w-[140px] sm:w-[160px] md:w-[180px] snap-start"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-white/5 transition-transform hover:scale-105">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-white text-xs font-medium truncate">{movie.title}</p>
                  <p className="text-white/70 text-[10px]">
                    {movie.release_date?.split('-')[0]} • {movie.vote_average.toFixed(1)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
