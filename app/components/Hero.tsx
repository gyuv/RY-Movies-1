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
          className="object-cover scale-110"
          priority
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-paper leading-tight">
            {movie.title}
          </h1>

          <div className="flex items-center gap-4 text-sm sm:text-base text-paper-dim">
            <span className="badge-rating">★ {movie.vote_average.toFixed(1)}</span>
            <span>{releaseYear}</span>
          </div>

          <p className="text-paper-dim line-clamp-3 text-sm sm:text-base">
            {movie.overview}
          </p>

          <div className="flex gap-4 pt-2">
            <Link
              href={`/media/${movie.id}`}
              className="btn-marquee"
            >
              ▶ Watch Now
            </Link>
            <Link
              href={`/media/${movie.id}`}
              className="bg-ink-raised/70 hover:bg-ink-raised text-paper px-6 py-2.5 rounded-md font-medium transition-colors backdrop-blur-sm border border-ink-line"
            >
              More Info
            </Link>
          </div>

          {/* Slide indicators — reads like a film-strip frame counter */}
          <div className="flex gap-1.5 pt-2">
            {movies.slice(0, 8).map((m, i) => (
              <button
                key={m.id}
                onClick={() => setCurrent(i)}
                aria-label={`Show ${m.title}`}
                className={`h-1 rounded-full transition-all ${
                  i === current ? 'w-6 bg-marquee' : 'w-2.5 bg-paper/25 hover:bg-paper/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
