import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "../utils/imageHelper";

interface MediaCardProps {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date?: string;
  media_type?: "movie" | "tv";
}

export default function MediaCard({
  id,
  title,
  poster_path,
  vote_average,
  release_date,
  media_type = "movie",
}: MediaCardProps) {
  const posterUrl = getImageUrl(poster_path, "w500");
  const year = release_date ? release_date.split("-")[0] : "TBA";
  const rating = vote_average ? vote_average.toFixed(1) : "NR";

  return (
    <Link href={`/media/${id}?type=${media_type}`} data-apex-nav className="apex-focusable block group">
      {/* Wrapper using your custom glass-card token */}
      <div className="glass-card flex flex-col h-full">
        
        {/* Poster Frame with hover vignette */}
        <div className="poster-frame relative aspect-[2/3] w-full bg-ink">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-ink-line text-paper-dim font-mono text-xs">
              No Poster
            </div>
          )}
          
          {/* Top-Right Badge: TMDb Rating */}
          <div className="absolute top-2 right-2 z-20 bg-ink-raised/90 backdrop-blur-md px-2 py-1 rounded border border-ink-line shadow-lg">
            <span className="badge-rating text-[11px] sm:text-xs">★ {rating}</span>
          </div>
        </div>

        {/* Info Section styled as a ticket stub */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between gap-2 relative">
          {/* Subtle dashed line to mimic ticket perforation */}
          <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-ink-line to-transparent border-t border-dashed border-ink-line/50" />
          
          <h3 
            className="font-display font-semibold text-paper text-sm sm:text-base line-clamp-2 leading-tight group-hover:text-marquee transition-colors"
            title={title}
          >
            {title}
          </h3>
          
          <div className="flex items-center justify-between mt-auto pt-1">
            <span className="stub-label text-[10px] sm:text-xs">{year}</span>
            <span className="text-[10px] sm:text-xs font-mono text-marquee opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
