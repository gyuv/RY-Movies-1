"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface SearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced fetch — waits for the person to pause typing before calling the API
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.results || []);
        setActiveIndex(-1);
      } catch (e) {
        console.error('Search fetch failed', e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open || results.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + results.length) % results.length);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    },
    [open, results]
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-paper-dim pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search films, actors, directors…"
          className="w-full bg-ink-raised border border-ink-line rounded-md pl-9 pr-3 py-2 text-sm text-paper placeholder:text-paper-dim focus:outline-none focus:ring-1 focus:ring-marquee transition-colors"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-paper-dim border-t-marquee rounded-full animate-spin" />
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute mt-2 w-full bg-ink-raised border border-ink-line rounded-md shadow-2xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {results.length === 0 && !loading && (
            <p className="px-4 py-6 text-center text-sm text-paper-dim stub-label">No matches found</p>
          )}
          {results.map((movie, i) => {
            const year = movie.release_date?.split('-')[0] || 'TBA';
            return (
              <Link
                key={movie.id}
                href={`/media/${movie.id}`}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 transition-colors ${
                  i === activeIndex ? 'bg-marquee/10' : 'hover:bg-marquee/10'
                }`}
              >
                <div className="relative w-10 h-[60px] flex-none rounded-sm overflow-hidden bg-ink border border-ink-line">
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-paper-dim">
                      No art
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-paper truncate">{movie.title}</p>
                  <p className="text-xs text-paper-dim">
                    {year} • <span className="badge-rating">★ {movie.vote_average?.toFixed(1) ?? '—'}</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
