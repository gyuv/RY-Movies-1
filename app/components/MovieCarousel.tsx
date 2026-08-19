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
    <div className="group/row relative">
      {title && (
        <div className="flex items-center justify-between mb-2 px-4 sm:px-10 lg:px-14">
          <h2 className="text-lg md:text-xl font-bold text-[#e5e5e5] hover:text-white transition-colors cursor-pointer">
            {title}
          </h2>
          <Link
            href={`/?language=${languageCode || 'all'}&sort=popularity.desc`}
            className="text-sm font-semibold text-blue-400 hover:text-white transition-colors opacity-0 group-hover/row:opacity-100"
          >
            Explore All {'>'}
          </Link>
        </div>
      )}

      <div className="relative">
        <div className="flex overflow-x-auto gap-2 px-4 sm:px-10 lg:px-14 pb-4 scrollbar-hide snap-x">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/media/${movie.id}`}
              className="flex-none w-[130px] sm:w-[160px] md:w-[200px] snap-start"
            >
              <div className="flix-card">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  loading="lazy"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
