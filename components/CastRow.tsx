import type { CastMember } from "@/types";

export default function CastRow({ cast }: { cast: CastMember[] }) {
  if (cast.length === 0) return null;
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {cast.map((c) => (
        <div key={c.id} className="flex-shrink-0 w-28">
          <div className="aspect-[3/4] bg-ink-raised border border-ink-line overflow-hidden mb-2">
            {c.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-paper-dim text-xs px-2 text-center">
                {c.name}
              </div>
            )}
          </div>
          <p className="text-sm text-paper leading-tight line-clamp-1">{c.name}</p>
          <p className="text-xs text-paper-dim leading-tight line-clamp-1">{c.character}</p>
        </div>
      ))}
    </div>
  );
}
