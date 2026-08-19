"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "../utils/imageHelper";

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
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || !movies?.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % Math.min(movies.length, 8));
    }, 6000);
    return () => clearInterval(interval);
  }, [movies?.length, isPaused]);

  if (!movies || movies.length === 0) return null;

  const movie = movies[current];
  const releaseYear = movie.release_date?.split("-")[0] || "TBA";
  const backgroundImage = getImageUrl(movie.backdrop_path, "original");

  return (
    <section
      aria-label="Featured Premiere"
      className="relative h-[72vh] min-h-[520px] max-h-[780px] w-full overflow-hidden bg-ink select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Media with Gradient Mask */}
      <div key={movie.id} className="absolute inset-0 animate-fade-in-up">
        <Image
          src={backgroundImage}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 transition-transform duration-[6000ms] ease-out motion-safe:scale-110"
        />
      </div>

      {/* Cinematic Vignette & Bottom Blends */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent w-full md:w-3/4" />
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-ink/80 to-transparent" />

      {/* Main Billboard Content */}
      <div className="relative h-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col justify-end pb-12 sm:pb-16 z-10">
        <div className="max-w-2xl space-y-4">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-marquee/20 border border-marquee/40 text-marquee font-bold">
              ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
            </span>
            <span className="stub-label">{releaseYear}</span>
            <span className="px-2 py-0.5 rounded bg-ink-raised/80 border border-ink-line text-paper-dim font-mono text-[11px] uppercase tracking-wider">
              Ultra HD
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-reel-teal/10 border border-reel-teal/30 text-reel-teal font-mono text-[11px] font-semibold uppercase tracking-wider">
              Licensed
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-paper tracking-tight leading-[1.1] drop-shadow-md">
            {movie.title}
          </h1>

          {/* Overview */}
          <p className="text-paper-dim line-clamp-3 text-sm sm:text-base leading-relaxed max-w-xl text-shadow-sm">
            {movie.overview || "Discover full streaming availability, licensed platforms, official trailers, and cast details."}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href={`/media/${movie.id}`}
              className="btn-marquee shadow-lg shadow-marquee/20"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Options
            </Link>
            
            <Link
              href={`/media/${movie.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-medium text-paper bg-ink-raised/70 hover:bg-ink-raised/90 border border-ink-line hover:border-paper-dim/40 backdrop-blur-md transition-all text-sm"
            >
              <svg className="w-4 h-4 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              Film Details
            </Link>
          </div>
        </div>

        {/* Filmstrip Frame Indicator */}
        <div className="absolute bottom-6 right-4 sm:right-6 lg:right-10 flex items-center gap-2">
          {movies.slice(0, 8).map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setCurrent(idx)}
              aria-label={`Jump to slide ${idx + 1}: ${m.title}`}
              className={`group relative h-1.5 rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-8 bg-marquee shadow-sm shadow-marquee/50"
                  : "w-2.5 bg-paper/20 hover:bg-paper/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
