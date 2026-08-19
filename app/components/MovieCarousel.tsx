"use client";

import { useRef } from "react";
import MediaCard from "./MediaCard";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

interface MovieCarouselProps {
  title?: string;
  movies: Movie[];
  languageCode?: string;
}

export default function MovieCarousel({ title, movies, languageCode }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative group/carousel mb-8">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-[45%] -translate-y-1/2 z-20 h-full w-12 bg-gradient-to-r from-ink via-ink/80 to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-start pl-2"
        aria-label="Scroll left"
      >
        <div className="bg-ink-raised/80 backdrop-blur rounded-full p-2 text-paper hover:text-marquee hover:scale-110 border border-ink-line transition-all">
          ←
        </div>
      </button>

      {/* Horizontally Scrolling Container */}
      <div 
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 sm:px-6 lg:px-8 pb-6 pt-2"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="min-w-[140px] sm:min-w-[180px] lg:min-w-[220px] snap-start shrink-0">
            <MediaCard
              id={movie.id}
              title={movie.title}
              poster_path={movie.poster_path}
              vote_average={movie.vote_average}
              release_date={movie.release_date}
            />
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-[45%] -translate-y-1/2 z-20 h-full w-12 bg-gradient-to-l from-ink via-ink/80 to-transparent opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-end pr-2"
        aria-label="Scroll right"
      >
        <div className="bg-ink-raised/80 backdrop-blur rounded-full p-2 text-paper hover:text-marquee hover:scale-110 border border-ink-line transition-all">
          →
        </div>
      </button>
    </div>
  );
}
