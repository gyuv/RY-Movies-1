import Link from 'next/link';
import Image from 'next/image';

interface MovieCardProps {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  languageCode: string;
}

export default function MovieCard({ id, title, poster_path, vote_average, release_date }: MovieCardProps) {
  const imageUrl = poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '/placeholder.jpg';
  const year = release_date?.split('-')[0] || "N/A";

  return (
    <Link 
      href={`/media/${id}`}
      className="group flex flex-col gap-3 w-[160px] md:w-[200px] cursor-pointer"
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a1a] shadow-xl transition-transform duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-white/20">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 160px, 200px"
          loading="lazy"
        />
        
        {/* Play Button overlay on hover (Like on the 'Reacher' card) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center pl-1 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>

      {/* Metadata Text (Below the image) */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="text-sm md:text-base font-bold text-white truncate">
          {title}
        </h3>
        <p className="text-[11px] md:text-xs text-gray-400 font-medium">
          {year} • Movie • <span className="text-yellow-500">★ {vote_average.toFixed(1)}</span>
        </p>
      </div>
    </Link>
  );
}
