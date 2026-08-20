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
      /* Mobile widths adjusted to 120px for a better horizontal grid, plus focus states for TV */
      className="group block w-[120px] sm:w-[150px] md:w-[190px] flex-shrink-0 relative transition-transform duration-300 md:hover:scale-105 md:hover:z-20 focus:scale-105 focus:z-20 cursor-pointer outline-none"
    >
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a1a] shadow-md border border-transparent md:group-hover:border-red-600 md:group-hover:shadow-[0_8px_30px_rgb(220,38,38,0.2)] group-focus:border-red-600 group-focus:shadow-[0_8px_30px_rgb(220,38,38,0.2)] transition-all duration-300">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-110 group-focus:scale-110"
          sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, 190px"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 md:opacity-0 md:group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300" />
        
        {/* Mobile: Always slightly visible. Desktop/TV: Appears on hover/focus */}
        <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-black/70 backdrop-blur-md text-yellow-500 text-[10px] md:text-xs font-bold px-1.5 py-1 md:px-2 rounded flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 md:translate-y-2 md:group-hover:translate-y-0 group-focus:translate-y-0">
          <span>★</span> {vote_average.toFixed(1)}
        </div>
        
        <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-md text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-md shadow-md uppercase">
          {languageCode}
        </div>
      </div>

      <div className="pt-2 md:pt-3 px-1 h-[50px] md:h-[60px] flex flex-col justify-start">
        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-200 line-clamp-1 group-hover:text-white group-focus:text-white transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center justify-between mt-0.5 md:mt-1 text-[10px] md:text-xs text-gray-500 font-medium">
          <span>{year}</span>
          <span className="text-gray-400 md:group-hover:text-yellow-500 group-focus:text-yellow-500 transition-colors">
            ★ {vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
