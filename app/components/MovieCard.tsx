"use client";

import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '../utils/imageHelper';
import TiltCard from '../../components/apex/TiltCard';

interface MovieCardProps {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  languageCode: string;
}

export default function MovieCard({ id, title, poster_path, vote_average, release_date, languageCode }: MovieCardProps) {
  const imageUrl = getImageUrl(poster_path, "w500");
  const year = release_date?.split('-')[0] || "TBA";

  return (
    <Link
      href={`/media/${id}`}
      data-apex-nav
      /* Project Apex: 3D tilt + neon glow, focus states preserved for TV D-pad */
      className="apex-focusable group block w-[120px] sm:w-[150px] md:w-[190px] flex-shrink-0 relative cursor-pointer outline-none"
    >
      <TiltCard className="rounded-xl">
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#0A0B0F] shadow-md border border-white/5 md:group-hover:border-apex-cyan/60 md:group-hover:shadow-apex-glow group-focus:border-apex-cyan/60 group-focus:shadow-apex-glow transition-all duration-300">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-110 group-focus:scale-110"
            sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, 190px"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300" />

          {/* Rating chip — always visible on mobile, reveals on hover/focus on larger screens */}
          <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-black/70 backdrop-blur-md text-marquee text-[10px] md:text-xs font-bold px-1.5 py-1 md:px-2 rounded flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 md:translate-y-2 md:group-hover:translate-y-0 group-focus:translate-y-0">
            <span>★</span> {vote_average.toFixed(1)}
          </div>

          <div className="absolute top-2 left-2 bg-apex-cyan/90 backdrop-blur-md text-black text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-md shadow-md uppercase tracking-wide">
            {languageCode}
          </div>
        </div>
      </TiltCard>

      <div className="pt-2 md:pt-3 px-1 h-[50px] md:h-[60px] flex flex-col justify-start">
        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-200 line-clamp-1 group-hover:text-white group-focus:text-white transition-colors">
          {title}
        </h3>

        <div className="flex items-center justify-between mt-0.5 md:mt-1 text-[10px] md:text-xs text-gray-500 font-medium">
          <span>{year}</span>
          <span className="text-gray-400 md:group-hover:text-marquee group-focus:text-marquee transition-colors">
            ★ {vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
