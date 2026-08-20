// app/components/HeroSlider.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { AnimeItem } from '../../lib/jikan';

export default function HeroSlider({ animeList }: { animeList: AnimeItem[] }) {
  const [active, setActive] = useState(0);
  const slides = animeList.slice(0, 5);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  if (!slides.length) return null;
  const current = slides[active];

  return (
    <section className="relative h-[520px] md:h-[600px] w-full overflow-hidden bg-black">
      {/* Background image */}
      {slides.map((item, idx) => (
        <div
          key={item.mal_id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === active ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            priority={idx === 0}
            className="object-cover object-top"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col justify-end pb-10">
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight line-clamp-2">
            {current.title}
          </h1>

          {/* Badges row */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {current.episodes && (
              <span className="flex items-center gap-1 bg-white/10 border border-white/10 text-white text-xs font-medium px-3 py-1 rounded-full">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a1 1 0 011-1h10a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1V4zM3 8a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
                </svg>
                {current.episodes} episodes
              </span>
            )}
            {current.type && (
              <span className="bg-white/10 border border-white/10 text-white text-xs font-medium px-3 py-1 rounded-full">
                {current.type}
              </span>
            )}
            <span className="bg-white/10 border border-white/10 text-white text-xs font-medium px-3 py-1 rounded-full">
              HD
            </span>
          </div>

          <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-2">
            {current.synopsis || 'No description available.'}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Link
              href={`/anime/${current.mal_id}`}
              className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 ml-0.5" fill="white" viewBox="0 0 20 20">
                <path d="M6.3 4.1a1 1 0 011.5-.87l9 6a1 1 0 010 1.74l-9 6A1 1 0 016.3 15.9V4.1z" />
              </svg>
            </Link>
            <Link
              href={`/anime/${current.mal_id}`}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-full border border-white/10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              See More
            </Link>
          </div>
        </div>
      </div>

      {/* Thumbnail strip - bottom right */}
      <div className="absolute bottom-10 right-4 md:right-8 z-10 hidden sm:flex gap-2">
        {slides.map((item, idx) => (
          <button
            key={item.mal_id}
            onClick={() => setActive(idx)}
            className={`relative w-16 h-10 md:w-20 md:h-12 rounded-md overflow-hidden border-2 transition-all ${
              idx === active
                ? 'border-blue-500 opacity-100 scale-105'
                : 'border-transparent opacity-50 hover:opacity-80'
            }`}
          >
            <Image src={item.image} alt={item.title} fill className="object-cover" />
          </button>
        ))}
      </div>
    </section>
  );
}
