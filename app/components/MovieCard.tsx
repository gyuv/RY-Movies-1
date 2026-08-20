import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '../utils/imageHelper';

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
      className="group block w-[140px] sm:w-[160px] md:w-[190px] flex-shrink-0 relative transition-transform duration-300 hover:scale-105 hover:z-20 cursor-pointer"
    >
      {/* 1. Image Container - Strictly locked aspect ratio (2:3) */}
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a1a] shadow-lg border border-transparent group-hover:border-red-600 group-hover:shadow-[0_8px_30px_rgb(220,38,38,0.2)] transition-all duration-300">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, 190px"
          loading="lazy"
        />
        
        {/* Subtle Dark Vignette on Hover for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge - Moves inside the image on hover for a cleaner look */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-yellow-500 text-xs font-bold px-2 py-1 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
          <span>★</span> {vote_average.toFixed(1)}
        </div>
        
        {/* Language Badge */}
        <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md uppercase">
          {languageCode}
        </div>
      </div>

      {/* 2. Info Block - Fixed Height to prevent uneven carousels */}
      <div className="pt-3 px-1 h-[60px] flex flex-col justify-start">
        {/* line-clamp-1 forces long titles to truncate gracefully with ... */}
        <h3 className="text-sm md:text-base font-semibold text-gray-200 line-clamp-1 group-hover:text-white transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500 font-medium">
          <span>{year}</span>
          <span className="text-gray-400 group-hover:text-yellow-500 transition-colors">
            ★ {vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
