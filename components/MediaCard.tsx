import Link from "next/link";
import Image from "next/image";
import type { MediaSummary } from "@/types";

export default function MediaCard({ media }: { media: MediaSummary }) {
  return (
    <Link
      href={`/media/${media.id}?type=${media.kind}`}
      className="group relative block flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-ink-raised border border-ink-line/60 transition-all duration-300 group-hover:border-marquee/50 group-hover:scale-[1.06] group-hover:z-10 group-hover:shadow-2xl group-hover:shadow-black/60">
        {media.posterUrl ? (
          <Image
            src={media.posterUrl}
            alt={media.title}
            fill
            sizes="180px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display italic text-paper-dim text-sm px-3 text-center">
            {media.title}
          </div>
        )}

        {/* bottom gradient (Netflix style) */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* meta that appears on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="font-display text-sm leading-snug line-clamp-2 text-paper">{media.title}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-mono text-[11px] text-marquee">★ {media.rating.toFixed(1)}</span>
            <span className="text-[11px] text-paper-dim">{media.year ?? "—"}</span>
            <span className="ml-auto text-[10px] uppercase tracking-wider text-paper-dim">
              {media.kind === "tv" ? "Series" : "Film"}
            </span>
          </div>
        </div>

        {/* always-visible rating pill (Prime-like) */}
        <div className="absolute top-2 right-2 font-mono text-[10px] bg-ink/80 backdrop-blur px-1.5 py-0.5 rounded text-paper group-hover:opacity-0 transition-opacity">
          ★ {media.rating.toFixed(1)}
        </div>
      </div>
    </Link>
  );
}

export function MediaCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
      <div className="aspect-[2/3] rounded-md bg-ink-raised border border-ink-line/40 animate-pulse" />
    </div>
  );
}
