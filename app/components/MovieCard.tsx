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
      className="group flex flex-col gap-2 cursor-pointer w-full"
    >
      {/* 
        Replaced the custom aspect-ratio, scale, and background classes 
        with the standard .flix-card utility defined in globals.css 
      */}
      <div className="flix-card">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          loading="lazy"
        />
        
        {/* Streaming-style Rating Badge (matching the Hero % match format) */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-green-400 text-xs font-bold px-1.5 py-0.5 rounded">
          {Math.round(vote_average * 10)}% Match
        </div>
      </div>

      <div className="px-1">
        <h3 className="text-sm md:text-base font-semibold text-[#e5e5e5] truncate group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-400">{year} • {languageCode.toUpperCase()}</p>
      </div>
    </Link>
  );
}
