// components/HeroSlider.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroAnime {
  mal_id: number;
  title: string;
  image_url: string;
  synopsis?: string;
  score?: number;
}

export default function HeroSlider({ animeList }: { animeList: HeroAnime[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % animeList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [animeList.length]);

  if (!animeList.length) return null;
  const active = animeList[current];

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={active.image_url}
          alt={active.title}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 md:p-12 lg:p-16 max-w-3xl z-10">
        <span className="inline-block px-3 py-1 bg-yellow-500 text-black text-xs font-bold uppercase rounded mb-3">
          Trending Now
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {active.title}
        </h1>
        <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6">
          {active.synopsis || "Watch the latest episodes of this popular anime series."}
        </p>
        <div className="flex gap-4">
          <Link 
            href={`/anime/${active.mal_id}`}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            Watch Now
          </Link>
          <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-lg transition-colors border border-white/10">
            + My List
          </button>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 right-6 flex gap-2 z-10">
        {animeList.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === current ? 'bg-yellow-500 w-6' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
} 
