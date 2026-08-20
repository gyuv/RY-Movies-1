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
    }, 5000);
    return () => clearInterval(interval);
  }, [movies.length]);

  if (!movies || movies.length === 0) return null;

  const movie = movies[current];
  const releaseYear = movie.release_date?.split('-')[0] || "TBA";
  const backgroundImage = getImageUrl(movie.backdrop_path, "original");

  return (
    <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
      {/* Background Image */}
      <div key={movie.id} className="absolute inset-0 animate-fade-in-up">
        <Image
          src={backgroundImage}
          alt={movie.title}
          fill
          className="object-cover scale-105"
          priority
        />
      </div>

      {/* Gradient Overlay - Updated to match new dark background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto z-10">
        <div className="max-w-2xl space-y-4 mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-tight drop-shadow-lg">
            {movie.title}
          </h1>

          <div className="flex items-center gap-4 text-sm sm:text-base text-gray-300 font-medium">
            <span className="text-yellow-500 font-bold">★ {movie.vote_average.toFixed(1)}</span>
            <span>{releaseYear}</span>
          </div>

          <p className="text-gray-300 line-clamp-3 text-sm sm:text-base drop-shadow-md">
            {movie.overview}
          </p>

          <div className="flex gap-4 pt-4">
            <Link
              href={`/media/${movie.id}`}
              className="btn-primary"
            >
              ▶ Watch
            </Link>
          </div>

          {/* Slide indicators - Updated to red active state */}
          <div className="flex gap-2 pt-6">
            {movies.slice(0, 8).map((m, i) => (
              <button
                key={m.id}
                onClick={() => setCurrent(i)}
                aria-label={`Show ${m.title}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]' : 'w-2 bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
