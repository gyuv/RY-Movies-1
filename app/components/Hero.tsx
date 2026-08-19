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
    <div className="relative h-full w-full overflow-hidden">
      <div key={movie.id} className="absolute inset-0 transition-opacity duration-1000">
        <Image
          src={backgroundImage}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-transparent to-transparent" />

      <div className="absolute bottom-[10%] left-0 right-0 px-4 sm:px-10 lg:px-14">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            {movie.title}
          </h1>

          <div className="flex items-center gap-4 text-sm sm:text-base text-gray-300 font-semibold">
            <span className="text-green-400">{Math.round(movie.vote_average * 10)}% Match</span>
            <span>{releaseYear}</span>
          </div>

          <p className="text-gray-200 line-clamp-3 text-sm md:text-lg drop-shadow-md">
            {movie.overview}
          </p>

          <div className="flex gap-4 pt-4">
            <Link href={`/media/${movie.id}`} className="btn-play">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M8 5v14l11-7z"/></svg>
              Play
            </Link>
            <Link href={`/media/${movie.id}`} className="btn-info">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
