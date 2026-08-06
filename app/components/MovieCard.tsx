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
      className="group relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-[#14151a] shadow-lg transition-transform duration-300 group-hover:scale-105">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
          sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, 180px"
          loading="lazy"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded">
          ★ {vote_average.toFixed(1)}
        </div>
        
        {/* Language Badge */}
        <div className="absolute top-2 left-2 bg-blue-600/80 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
          {languageCode}
        </div>
      </div>

      <div className="mt-2 px-1">
        <h3 className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-white/50">{year}</p>
      </div>
    </Link>
  );
}
