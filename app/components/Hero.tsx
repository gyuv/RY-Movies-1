"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '../utils/imageHelper';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
}

export default function Hero({ movies }: { movies: Movie[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 6000); // Slowed down slightly for better mobile reading
    return () => clearInterval(interval);
  }, [movies.length]);

  if (!movies || movies.length === 0) return null;

  const movie = movies[current];
  const releaseYear = movie.release_date?.split('-')[0] || "TBA";
  const backgroundImage = getImageUrl(movie.backdrop_path, "original");

  return (
    <div className="relative h-[50vh] sm:h-[60vh] md:h-[75vh] w-full overflow-hidden">
      <div key={movie.id} className="absolute inset-0 animate-fade-in-up">
        <Image
          src={backgroundImage}
          alt={movie.title}
          fill
          className="object-cover md:scale-105"
          priority
        />
      </div>

      {/* Stronger gradient on mobile for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 md:via-[#141414]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] md:from-[#141414]/90 via-[#141414]/40 md:via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto z-10">
        <div className="max-w-2xl space-y-2 md:space-y-4 mb-4 md:mb-8">
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold text-white leading-tight drop-shadow-lg line-clamp-2">
            {movie.title}
          </h1>

          <div className="flex items-center gap-3 md:gap-4 text-xs sm:text-sm md:text-base text-gray-300 font-medium">
            <span className="text-yellow-500 font-bold bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
              ★ {movie.vote_average.toFixed(1)}
            </span>
            <span className="bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">{releaseYear}</span>
          </div>

          <p className="text-gray-300 line-clamp-2 md:line-clamp-3 text-xs sm:text-sm md:text-base drop-shadow-md max-w-[90%]">
            {movie.overview}
          </p>

          <div className="flex gap-3 md:gap-4 pt-2 md:pt-4">
            <Link
              href={`/media/${movie.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-2 md:px-8 md:py-2.5 rounded-full text-sm md:text-base font-bold bg-red-600 text-white transition-all shadow-md shadow-red-900/50 hover:bg-red-500 md:hover:scale-105 w-auto"
            >
              ▶ Watch
            </Link>
          </div>

          <div className="flex gap-1.5 md:gap-2 pt-4 md:pt-6">
            {movies.slice(0, 8).map((m, i) => (
              <button
                key={m.id}
                onClick={() => setCurrent(i)}
                aria-label={`Show ${m.title}`}
                className={`h-1 md:h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 md:w-8 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]' : 'w-1.5 md:w-2 bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
