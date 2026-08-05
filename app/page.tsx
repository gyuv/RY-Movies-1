"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import MediaCard, { MediaCardSkeleton } from "@/components/MediaCard";
import type { MediaSummary, SearchFilters } from "@/types";

const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  type: "all",
  genres: [],
  yearFrom: 1950,
  yearTo: new Date().getFullYear(),
  language: "all",
  page: 1,
};

export default function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [results, setResults] = useState<MediaSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(0);

  const fetchPage = useCallback(async (f: SearchFilters, append: boolean) => {
    const myRequest = ++requestId.current;
    setLoading(true);
    const params = new URLSearchParams({
      q: f.query,
      type: f.type,
      genres: f.genres.join(","),
      yearFrom: String(f.yearFrom),
      yearTo: String(f.yearTo),
      language: f.language,
      page: String(f.page),
    });
    const res = await fetch(`/api/search?${params.toString()}`);
    const data = await res.json();
    if (myRequest !== requestId.current) return;

    setResults((prev) => (append ? [...prev, ...data.results] : data.results));
    setHasMore(f.page < data.totalPages);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPage({ ...filters, page: 1 }, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.query, filters.type, filters.genres.join(","), filters.yearFrom, filters.yearTo, filters.language]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setFilters((prev) => {
            const next = { ...prev, page: prev.page + 1 };
            fetchPage(next, true);
            return next;
          });
        }
      },
      { rootMargin: "800px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchPage]);

  return (
    <main className="min-h-screen">
      {/* Hero — Netflix-scale, Prime clarity */}
      <section className="relative pt-12 sm:pt-16 pb-10 px-4 sm:px-6 max-w-7xl mx-auto">
        <p className="stub-label text-marquee mb-3">Admit one · any title, any era</p>
        <h1 className="font-display italic text-4xl sm:text-5xl lg:text-6xl leading-[1.08] text-paper max-w-3xl">
          Find where it&apos;s actually playing.
        </h1>
        <p className="text-paper-dim mt-4 max-w-xl text-sm sm:text-base leading-relaxed">
          Search by title, actor, or director. Every result shows licensed places to watch —
          subscription, free-with-ads, rent, or buy.
        </p>
        <div className="mt-8 max-w-2xl">
          <SearchBar
            initialValue={filters.query}
            onSearch={(q) => setFilters((p) => ({ ...p, query: q }))}
          />
        </div>
      </section>

      <div className="film-perf mb-8 opacity-60" aria-hidden />

      {/* Filters */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-10">
        <FilterBar
          filters={filters}
          onChange={(next) => setFilters((p) => ({ ...p, ...next, page: 1 }))}
        />
      </section>

      {/* Results as horizontal-feel grid (Netflix rows energy) */}
      <section className="pb-24">
        <div className="px-4 sm:px-6 max-w-7xl mx-auto mb-4 flex items-end justify-between">
          <h2 className="font-display text-xl sm:text-2xl text-paper">
            {filters.query ? `Results for “${filters.query}”` : "Discover"}
          </h2>
          {results.length > 0 && (
            <span className="stub-label text-paper-dim">{results.length}+ titles</span>
          )}
        </div>

        {results.length === 0 && !loading ? (
          <div className="mx-4 sm:mx-6 max-w-7xl mx-auto text-center py-20 border border-dashed border-ink-line rounded-lg">
            <p className="font-display italic text-2xl text-paper-dim">No reels match that search.</p>
            <p className="stub-label mt-2">Try a broader title or clear a filter.</p>
          </div>
        ) : (
          <div className="px-4 sm:px-6 max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {results.map((m) => (
                <MediaCard key={`${m.kind}-${m.id}`} media={m} />
              ))}
              {loading &&
                Array.from({ length: 8 }).map((_, i) => <MediaCardSkeleton key={`sk-${i}`} />)}
            </div>
          </div>
        )}
        <div ref={sentinelRef} className="h-1" />
      </section>
    </main>
  );
}
