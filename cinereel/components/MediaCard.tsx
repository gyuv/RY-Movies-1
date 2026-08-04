import Link from "next/link";
import Image from "next/image";
import type { MediaSummary } from "@/types";

export default function MediaCard({ media }: { media: MediaSummary }) {
  return (
    <Link
      href={`/media/${media.id}?type=${media.kind}`}
      className="group block ticket-tear border border-ink-line bg-ink-raised hover:border-marquee transition-colors"
    >
      <div className="relative aspect-[2/3] bg-ink overflow-hidden">
        {media.posterUrl ? (
          <Image
            src={media.posterUrl}
            alt={media.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-display italic text-paper-dim text-sm px-4 text-center">
            {media.title}
          </div>
        )}
        <div className="absolute top-2 left-2 stub-label bg-ink/80 px-1.5 py-0.5 text-marquee">
          {media.kind === "tv" ? "Series" : "Film"}
        </div>
        <div className="absolute bottom-2 right-2 font-mono text-xs bg-ink/80 px-1.5 py-0.5 text-paper">
          ★ {media.rating.toFixed(1)}
        </div>
      </div>
      <div className="p-3 border-t border-dashed border-ink-line">
        <p className="font-display text-base leading-snug line-clamp-1 text-paper">{media.title}</p>
        <p className="stub-label mt-1">{media.year ?? "—"}</p>
      </div>
    </Link>
  );
}

export function MediaCardSkeleton() {
  return (
    <div className="border border-ink-line bg-ink-raised animate-pulse">
      <div className="aspect-[2/3] bg-ink-line/40" />
      <div className="p-3 space-y-2 border-t border-dashed border-ink-line">
        <div className="h-4 bg-ink-line/40 w-3/4" />
        <div className="h-3 bg-ink-line/40 w-1/3" />
      </div>
    </div>
  );
}
