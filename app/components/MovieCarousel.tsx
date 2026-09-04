'use client';

import Link from 'next/link';
import MovieCard from './MovieCard';
import { useRef } from 'react';

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

export default function MovieCarousel({ title, movies, languageCode = 'en' }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Smooth scroll function for desktop arrows
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Scroll by roughly the width of the visible container minus a little overlap
      const scrollAmount = direction === 'left' ? -(current.offsetWidth * 0.75) : (current.offsetWidth * 0.75);
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-6 md:mb-10 group/carousel relative">
      
      {/* Dynamic Header - Stacks on mobile, aligns on desktop */}
      {title && (
        <div className="flex flex-row items-center justify-between mb-3 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide truncate pr-4">
            {title}
          </h2>
          <Link
            href={`/?language=${languageCode}&sort=popularity.desc`}
            className="text-xs sm:text-sm font-semibold text-marquee hover:text-marquee whitespace-nowrap transition-colors"
          >
            View All →
          </Link>
        </div>
      )}

      <div className="relative max-w-[1600px] mx-auto">
        
        {/* Desktop Scroll Buttons - Appear on hover */}
        <button 
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-4 top-[40%] -translate-y-1/2 z-30 bg-[#060B24]/90 text-white w-10 h-10 items-center justify-center rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 border border-gray-600 hover:border-marquee hover:bg-marquee hover:scale-110 shadow-lg shadow-black/50"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        <button 
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-4 top-[40%] -translate-y-1/2 z-30 bg-[#060B24]/90 text-white w-10 h-10 items-center justify-center rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 border border-gray-600 hover:border-marquee hover:bg-marquee hover:scale-110 shadow-lg shadow-black/50"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Scrollable Container with Smart TV support (carousel-container) */}
        <div 
          ref={scrollRef}
          className="carousel-container flex overflow-x-auto gap-3 sm:gap-4 px-4 sm:px-6 lg:px-8 pt-4 pb-12 scrollbar-hide snap-x snap-mandatory items-start scroll-smooth"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="snap-start flex-none">
              <MovieCard 
                id={movie.id}
                title={movie.title}
                poster_path={movie.poster_path}
                vote_average={movie.vote_average}
                release_date={movie.release_date}
                languageCode={languageCode}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
