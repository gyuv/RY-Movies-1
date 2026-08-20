// app/components/AnimeCard.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function AnimeCard({
  mal_id,
  title,
  image,
  episodes,
  type,
}: {
  mal_id: number;
  title: string;
  image: string;
  episodes?: number | null;
  type?: string | null;
}) {
  return (
    <Link href={`/anime/${mal_id}`} className="group block">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#1a1a1a]">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        {episodes != null && (
          <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-green-400 text-xs font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 1116 0 8 8 0 01-16 0z"/></svg>
            {episodes}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="mt-2 text-sm font-medium text-white line-clamp-2 group-hover:text-yellow-500 transition-colors">
        {title}
      </h3>
      {type && <p className="text-xs text-gray-500">{type}</p>}
    </Link>
  );
}
