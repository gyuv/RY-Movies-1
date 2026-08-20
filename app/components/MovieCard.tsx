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
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg bg-[#1e1e1e] shadow-lg transition-all duration-300 group-hover:border-t-4 group-hover:border-red-600 group-hover:shadow-2xl z-10">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-100"
          sizes="(max-width: 640px) 140px, (max-width: 768px) 160px, 180px"
          loading="lazy"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-yellow-500 text-xs font-bold px-2 py-1 rounded-md">
          ★ {vote_average.toFixed(1)}
        </div>
        
        {/* Language Badge - Changed from Blue to Dark/Red matching theme */}
        <div className="absolute top-2 left-2 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase">
          {languageCode}
        </div>
      </div>

      {/* Info Block - Changes to White background on hover to match the 'Red Sparrow' active state */}
      <div className="bg-[#1a1a1a] p-2 rounded-b-lg transition-colors duration-300 group-hover:bg-gray-100 group-hover:text-black z-20 relative -mt-1 pt-3">
        <h3 className="text-sm font-bold text-gray-200 truncate group-hover:text-gray-900 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-500 font-medium group-hover:text-gray-600 flex justify-between mt-1">
          <span>{year}</span>
          <span className="group-hover:text-yellow-600">★ {vote_average.toFixed(1)}</span>
        </p>
      </div>
    </Link>
  );
}
