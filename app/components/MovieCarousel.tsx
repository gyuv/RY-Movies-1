'use client';

import Link from 'next/link';
import MovieCard from './MovieCard'; // Import the newly styled card

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
  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Conditionally render header if a title is passed, else assume it's handled by the parent */}
      {title && (
        <div className="flex items-center justify-between mb-4 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
          <h2 className="text-xl md:text-2xl font-display font-bold text-white section-heading">{title}</h2>
          <Link
            href={`/?language=${languageCode}&sort=popularity.desc`}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            View All →
          </Link>
        </div>
      )}

      <div className="relative group">
        <div className="flex overflow-x-auto space-x-4 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-8 pt-2 scrollbar-hide snap-x">
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
