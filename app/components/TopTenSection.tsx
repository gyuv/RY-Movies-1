// app/components/TopTenSection.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { AnimeItem } from '../../lib/jikan';

export default function TopTenSection({ animeList }: { animeList: AnimeItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  return (
    <section className="py-10 px-4 md:px-8 bg-[#0a0a0a] relative">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <h2 className="flex items-baseline gap-3">
            <span
              className="text-6xl md:text-7xl font-black text-transparent leading-none"
              style={{ WebkitTextStroke: '2px #eab308' }}
            >
              TOP10
            </span>
            <span className="text-lg md:text-xl font-bold tracking-[0.3em] text-white">
              ANIME<br />TODAY
            </span>
          </h2>

          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-yellow-500 hover:text-yellow-500">
              ‹
            </button>
            <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-yellow-500 hover:text-yellow-500">
              ›
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
          {animeList.slice(0, 10).map((item, idx) => (
            <Link
              key={item.mal_id}
              href={`/anime/${item.mal_id}`}
              className="relative flex-shrink-0 w-[180px] md:w-[220px] group"
            >
              <div className="relative">
                <span
                  className="absolute -bottom-4 -left-2 text-8xl md:text-9xl font-black text-transparent select-none z-0"
                  style={{ WebkitTextStroke: '2px #3b82f6' }}
                >
                  {idx + 1}
                </span>
                <div className="relative z-10 ml-6 aspect-[2/3] rounded-lg overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <p className="mt-3 ml-6 text-sm font-medium text-white line-clamp-2">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
