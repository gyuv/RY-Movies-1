// components/AnimeCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface AnimeCardProps {
  mal_id: number;
  title: string;
  image_url: string;
  score?: number;
  episodes?: number;
  url: string;
}

export default function AnimeCard({ mal_id, title, image_url, score, episodes, url }: AnimeCardProps) {
  return (
    <Link 
      href={`/anime/${mal_id}`} 
      className="group relative block aspect-[2/3] rounded-lg overflow-hidden bg-[#181834] transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/5"
    >
      <Image
        src={image_url}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16.66vw"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

      {/* Top Badge (Episodes/Quality) */}
      <div className="absolute top-2 left-2">
        {episodes && (
          <span className="bg-[#1e232d]/80 backdrop-blur-sm text-[10px] text-gray-300 px-1.5 py-0.5 rounded shadow-sm border border-white/10">
            {episodes} Eps
          </span>
        )}
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-sm font-medium text-white truncate mb-1" title={title}>
          {title}
        </h3>
        <div className="flex items-center justify-between">
          {score && (
            <span className="text-xs text-yellow-400 font-bold flex items-center gap-1">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              {score}
            </span>
          )}
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Stream</span>
        </div>
      </div>
    </Link>
  );
}
