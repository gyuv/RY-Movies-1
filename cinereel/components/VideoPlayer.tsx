"use client";

import { useState } from "react";

/**
 * Distraction-free HTML5/iframe player.
 *
 * For the trailer, we embed YouTube's official player directly (no ads
 * layered on top, no popups, no unrelated suggested-video rail — achieved
 * via `rel=0&modestbranding=1`). For the *full film or episode*, this
 * component is deliberately not wired to any self-hosted stream: legal
 * playback happens on the licensed provider's own player, which is why the
 * detail page routes "Watch now" through the provider deep link rather than
 * trying to pull the video into an <iframe> here. See WatchBadges below.
 */
export default function VideoPlayer({
  trailerKey,
  title,
}: {
  trailerKey: string | null;
  title: string;
}) {
  const [started, setStarted] = useState(false);

  if (!trailerKey) {
    return (
      <div className="aspect-video w-full bg-ink-raised border border-ink-line flex items-center justify-center">
        <p className="stub-label">No trailer available</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full bg-black border border-ink-line overflow-hidden">
      {started ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
          title={`${title} — official trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setStarted(true)}
          className="absolute inset-0 w-full h-full group"
          aria-label={`Play trailer for ${title}`}
        >
          <img
            src={`https://img.youtube.com/vi/${trailerKey}/maxresdefault.jpg`}
            alt=""
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-16 h-16 rounded-full border-2 border-marquee flex items-center justify-center bg-ink/60 group-hover:bg-marquee/20 transition-colors">
              <span
                className="w-0 h-0 ml-1"
                style={{
                  borderTop: "9px solid transparent",
                  borderBottom: "9px solid transparent",
                  borderLeft: "14px solid #E8A33D",
                }}
              />
            </span>
          </span>
          <span className="absolute bottom-3 left-3 stub-label">Play trailer</span>
        </button>
      )}
    </div>
  );
}
