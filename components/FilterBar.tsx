"use client";

import { GENRES, LANGUAGES } from "@/types";
import type { SearchFilters } from "@/types";

const CURRENT_YEAR = new Date().getFullYear();

export default function FilterBar({
  filters,
  onChange,
}: {
  filters: SearchFilters;
  onChange: (next: Partial<SearchFilters>) => void;
}) {
  function toggleGenre(id: number) {
    const has = filters.genres.includes(id);
    onChange({
      genres: has ? filters.genres.filter((g) => g !== id) : [...filters.genres, id],
    });
  }

  return (
    <div className="border border-ink-line bg-ink-raised">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-ink-line">
        {/* Content type */}
        <div className="p-4">
          <p className="stub-label mb-3">Type</p>
          <div className="flex gap-2">
            {(["all", "movie", "tv"] as const).map((t) => (
              <button
                key={t}
                onClick={() => onChange({ type: t })}
                className={`px-3 py-1.5 text-sm border transition-colors ${
                  filters.type === t
                    ? "border-marquee text-marquee"
                    : "border-ink-line text-paper-dim hover:text-paper"
                }`}
              >
                {t === "all" ? "All" : t === "movie" ? "Movies" : "Series"}
              </button>
            ))}
          </div>
        </div>

        {/* Language */}
        <div className="p-4">
          <label className="stub-label mb-3 block" htmlFor="lang-select">
            Language
          </label>
          <select
            id="lang-select"
            value={filters.language}
            onChange={(e) => onChange({ language: e.target.value })}
            className="w-full bg-transparent border border-ink-line px-3 py-1.5 text-sm text-paper focus:border-marquee"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="bg-ink-raised">
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year range */}
        <div className="p-4">
          <p className="stub-label mb-3">
            Released {filters.yearFrom}–{filters.yearTo}
          </p>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1950}
              max={CURRENT_YEAR}
              value={filters.yearFrom}
              onChange={(e) =>
                onChange({ yearFrom: Math.min(Number(e.target.value), filters.yearTo) })
              }
              className="w-full accent-marquee"
              aria-label="From year"
            />
            <input
              type="range"
              min={1950}
              max={CURRENT_YEAR}
              value={filters.yearTo}
              onChange={(e) =>
                onChange({ yearTo: Math.max(Number(e.target.value), filters.yearFrom) })
              }
              className="w-full accent-marquee"
              aria-label="To year"
            />
          </div>
        </div>

        {/* Genres */}
        <div className="p-4 col-span-2 md:col-span-1">
          <p className="stub-label mb-3">Genre</p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {GENRES.map((g) => (
              <button
                key={g.id}
                onClick={() => toggleGenre(g.id)}
                className={`px-2.5 py-1 text-xs border transition-colors ${
                  filters.genres.includes(g.id)
                    ? "border-marquee text-marquee"
                    : "border-ink-line text-paper-dim hover:text-paper"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
