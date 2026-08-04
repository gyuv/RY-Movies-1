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
    if (myRequest !== requestId.current) return; // stale response, ignore

    setResults((prev) => (append ? [...prev, ...data.results] : data.results));
    setHasMore(f.page < data.totalPages);
    setLoading(false);
  }, []);

  // Refetch from page 1 whenever query/filters (not page) change
  useEffect(() => {
    fetchPage({ ...filters, page: 1 }, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.query, filters.type, filters.genres.join(","), filters.yearFrom, filters.yearTo, filters.language]);

  // Infinite scroll
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
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchPage]);

  return (
    <main className="max-w-6xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-16 pb-10">
        <p className="stub-label text-marquee mb-4">Admit one · any title, any era</p>
        <h1 className="font-display italic text-4xl sm:text-6xl leading-[1.05] text-paper max-w-3xl">
          Find where it's actually playing.
        </h1>
        <p className="text-paper-dim mt-4 max-w-xl">
          Search by title, actor, actress, or director. Every result shows exactly which
          services carry it — subscription, free-with-ads, rental, or purchase — sourced from
          licensed availability data.
        </p>
        <div className="mt-8 max-w-2xl">
          <SearchBar initialValue={filters.query} onSearch={(q) => setFilters((p) => ({ ...p, query: q }))} />
        </div>
      </section>

      <div className="film-perf mb-10" aria-hidden />

      <section className="mb-8">
        <FilterBar filters={filters} onChange={(next) => setFilters((p) => ({ ...p, ...next, page: 1 }))} />
      </section>

      <section className="pb-24">
        {results.length === 0 && !loading ? (
          <div className="text-center py-24 border border-dashed border-ink-line">
            <p className="font-display italic text-2xl text-paper-dim">No reels match that search.</p>
            <p className="stub-label mt-2">Try a broader title or clear a filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((m) => (
              <MediaCard key={`${m.kind}-${m.id}`} media={m} />
            ))}
            {loading &&
              Array.from({ length: 10 }).map((_, i) => <MediaCardSkeleton key={`sk-${i}`} />)}
          </div>
        )}
        <div ref={sentinelRef} className="h-1" />
      </section>
    </main>
  );
}
