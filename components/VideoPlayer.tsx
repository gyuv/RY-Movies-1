"use client";

import { useState } from "react";
import type { VideoClip } from "@/types";

/**
 * Distraction-free player with a source-switcher tab strip underneath —
 * same interaction pattern you'd see on a streaming site, but every tab
 * points at an official clip (trailer/teaser/featurette) served through
 * YouTube's own embed, pulled from TMDb's `videos` endpoint. No third-party
 * "server 1 / server 2" stream mirrors — see README for why.
 */
export default function VideoPlayer({
  videos,
  title,
}: {
  videos: VideoClip[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [started, setStarted] = useState(false);

  if (videos.length === 0) {
    return (
      <div className="aspect-video w-full bg-ink-raised border border-ink-line flex items-center justify-center">
        <p className="stub-label">No trailer available</p>
      </div>
    );
  }

  const active = videos[activeIndex];

  return (
    <div className="w-full min-w-0 border border-ink-line bg-ink-raised overflow-hidden">
      {/* Player */}
      <div className="relative aspect-video w-full bg-black">
        {started ? (
          <iframe
            key={active.key}
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${active.key}?autoplay=1&rel=0&modestbranding=1`}
            title={`${title} — ${active.name}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setStarted(true)}
            className="absolute inset-0 w-full h-full group"
            aria-label={`Play ${active.name}`}
          >
            <img
              src={`https://img.youtube.com/vi/${active.key}/maxresdefault.jpg`}
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
            <span className="absolute bottom-3 left-3 stub-label">{active.name}</span>
          </button>
        )}
      </div>

      {/* Source-switcher tab strip */}
      {videos.length > 1 && (
        <div className="flex items-center gap-2 p-3 border-t border-ink-line overflow-x-auto">
          <span className="stub-label mr-1 flex-shrink-0">Reel</span>
          {videos.map((v, i) => (
            <button
              key={v.key}
              onClick={() => {
                setActiveIndex(i);
                setStarted(true);
              }}
              className={`flex-shrink-0 px-3 py-1.5 text-xs font-mono uppercase tracking-wide border transition-colors ${
                i === activeIndex
                  ? "border-marquee text-marquee"
                  : "border-ink-line text-paper-dim hover:text-paper hover:border-paper-dim"
              }`}
            >
              {v.type}
              {videos.filter((x) => x.type === v.type).length > 1 ? ` ${i + 1}` : ""}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
