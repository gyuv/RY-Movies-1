'use client';

import Link from 'next/link';
import MovieCard from './MovieCard';

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
  showNumbers?: boolean; // Toggle for the "Trending" section
}

export default function MovieCarousel({ title, movies, languageCode = 'en', showNumbers = true }: MovieCarouselProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-14 group/row relative w-full overflow-hidden">
      
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 px-4 sm:px-8 lg:px-12">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
          {title}
        </h2>
        <div className="flex gap-2">
          {/* Navigation Arrows (Visual only for now, would need a ref to scroll) */}
          <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            {'<'}
          </button>
          <button className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            {'>'}
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        <div className="flex overflow-x-auto gap-6 px-4 sm:px-8 lg:px-12 pb-8 scrollbar-hide snap-x">
          {movies.map((movie, index) => (
            <div key={movie.id} className="relative flex-none snap-start">
              
              {/* Giant Background Number */}
              {showNumbers && (
                <span className="absolute -left-8 top-12 text-[180px] font-black text-white leading-none tracking-tighter select-none z-0 drop-shadow-2xl">
                  {index + 1}
                </span>
              )}

              {/* The actual card (z-10 puts it above the number) */}
              <div className={`relative z-10 ${showNumbers ? 'ml-12' : ''}`}>
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  poster_path={movie.poster_path}
                  vote_average={movie.vote_average}
                  release_date={movie.release_date}
                  languageCode={languageCode}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
