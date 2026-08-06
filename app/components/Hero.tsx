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
      <div className="absolute inset-0 transition-transform duration-700 ease-in-out">
        <Image
          src={backgroundImage}
          alt={movie.title}
          fill
          className="object-cover scale-110"
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b10]/90 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            {movie.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm sm:text-base text-white/80">
            <span className="text-yellow-400 font-bold">★ {movie.vote_average.toFixed(1)}</span>
            <span>{releaseYear}</span>
          </div>

          <p className="text-white/70 line-clamp-3 text-sm sm:text-base">
            {movie.overview}
          </p>

          <div className="flex gap-4 pt-2">
            <Link 
              href={`/media/${movie.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-md font-medium transition-colors flex items-center gap-2"
            >
              ▶ Watch Now
            </Link>
            <Link 
              href={`/media/${movie.id}`}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-md font-medium transition-colors backdrop-blur-sm"
            >
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
