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
        <h2 className="text-xl md:text-2xl font-display font-bold text-paper section-heading">{title}</h2>
        <Link
          href={`/?language=${languageCode || 'all'}&sort=popularity.desc`}
          className="text-sm text-paper-dim hover:text-marquee transition-colors"
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
              <div className="poster-frame relative aspect-[2/3] bg-ink-raised border border-ink-line transition-transform hover:-translate-y-1">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 z-[2]">
                  <p className="text-paper text-xs font-medium truncate">{movie.title}</p>
                  <p className="text-paper-dim text-[10px]">
                    {movie.release_date?.split('-')[0]} • <span className="badge-rating">{movie.vote_average.toFixed(1)}</span>
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
