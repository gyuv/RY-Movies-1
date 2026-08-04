import { getMediaDetail } from "@/lib/tmdb";
import type { MediaKind } from "@/types";
import VideoPlayer from "@/components/VideoPlayer";
import WatchBadges from "@/components/WatchBadges";
import CastRow from "@/components/CastRow";
import Link from "next/link";

export default async function MediaDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { type?: string };
}) {
  const kind: MediaKind = searchParams.type === "tv" ? "tv" : "movie";
  const media = await getMediaDetail(kind, Number(params.id));

  return (
    <main className="max-w-6xl mx-auto px-6 pb-24">
      <div className="pt-8 pb-4">
        <Link href="/" className="stub-label hover:text-marquee transition-colors">
          ← Back to search
        </Link>
      </div>

      {/* Ticket header */}
      <div className="border border-ink-line bg-ink-raised ticket-tear">
        <div className="p-6 sm:p-10 grid sm:grid-cols-[auto,1fr] gap-8">
          <div className="w-40 sm:w-48 flex-shrink-0">
            <div className="aspect-[2/3] bg-ink border border-ink-line overflow-hidden">
              {media.posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={media.posterUrl} alt={media.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-paper-dim text-sm px-3 text-center font-display italic">
                  {media.title}
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="stub-label text-marquee mb-2">
              {media.kind === "tv" ? "Series" : "Feature Film"} · {media.year ?? "—"}
            </p>
            <h1 className="font-display italic text-3xl sm:text-5xl text-paper leading-tight">
              {media.title}
            </h1>
            {media.tagline && (
              <p className="text-paper-dim italic mt-2">{media.tagline}</p>
            )}

            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 font-mono text-sm text-paper-dim">
              <span>★ {media.rating.toFixed(1)} / 10</span>
              {media.runtimeMinutes && <span>{media.runtimeMinutes} min</span>}
              <span>{media.genres.map((g) => g.name).join(", ")}</span>
            </div>

            <p className="text-paper/90 mt-6 max-w-2xl leading-relaxed">{media.overview}</p>
          </div>
        </div>
      </div>

      <div className="film-perf my-10" aria-hidden />

      <div className="grid lg:grid-cols-[1fr,340px] gap-10 min-w-0">
        <div className="space-y-10 min-w-0">
          <section>
            <p className="stub-label mb-3">Full Movie Player</p>
            <VideoPlayer 
              mediaId={params.id} 
              mediaType={kind} 
              customTitle={media.title} 
            />
          </section>

          <section>
            <p className="stub-label mb-3">Cast</p>
            <CastRow cast={media.cast} />
          </section>
        </div>

        <aside>
          <p className="stub-label mb-3">Where to watch</p>
          <div className="border border-ink-line bg-ink-raised p-5">
            <WatchBadges options={media.watchOptions} />
          </div>
        </aside>
      </div>
    </main>
  );
}
