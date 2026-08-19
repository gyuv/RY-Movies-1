"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export default function SearchBar({
  initialValue = "",
  variant = "default",
  onSearch,
}: {
  initialValue?: string;
  variant?: "default" | "compact";
  onSearch?: (query: string) => void;
}) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Debounced live dropdown fetch
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
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    
    if (onSearch) {
      onSearch(query.trim());
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

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
      } else if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        router.push(`/media/${results[activeIndex].id}`);
        setOpen(false);
      }
    },
    [open, results, activeIndex, router]
  );

  return (
    <div 
      ref={containerRef} 
      className={`relative transition-all duration-300 ease-in-out ${
        isFocused ? 'w-full max-w-lg' : 'w-full max-w-md'
      }`}
    >
      <form onSubmit={handleSubmit} className="relative group">
        {/* Sleek Search Icon */}
        <svg
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-300 ${
            isFocused ? 'text-marquee' : 'text-paper-dim group-hover:text-paper'
          }`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z" />
        </svg>
        
        {/* Frosted Glass Input Field */}
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim().length >= 2) setOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Search films, actors, directors…"
          className="w-full bg-ink-raised/60 hover:bg-ink-raised/80 border border-ink-line rounded-full pl-10 pr-10 py-2.5 text-sm text-paper placeholder:text-paper-dim focus:outline-none focus:border-marquee/50 focus:bg-ink-raised backdrop-blur-md transition-all shadow-inner"
        />
        
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-paper-dim/30 border-t-marquee rounded-full animate-spin" />
          </div>
        )}
        
        {/* Clear Button (only shows when there is text and not loading) */}
        {query && !loading && (
           <button 
             type="button"
             onClick={() => { setQuery(''); setOpen(false); }}
             className="absolute right-3.5 top-1/2 -translate-y-1/2 text-paper-dim hover:text-paper transition-colors"
           >
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        )}
      </form>

      {/* Glassmorphism Dropdown Results */}
      {open && query.trim().length >= 2 && (
        <div className="absolute mt-2 w-full bg-ink-raised/95 backdrop-blur-xl border border-ink-line rounded-xl shadow-2xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto overscroll-contain">
          
          {results.length === 0 && !loading && (
            <div className="px-4 py-8 text-center flex flex-col items-center">
              <svg className="w-8 h-8 text-ink-line mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-paper-dim font-medium">No titles found</p>
              <p className="text-xs text-paper-dim/70 mt-1">Try a different search term</p>
            </div>
          )}
          
          <div className="py-2">
            {results.map((movie, i) => {
              const year = movie.release_date?.split('-')[0] || 'TBA';
              const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';
              
              return (
                <Link
                  key={movie.id}
                  href={`/media/${movie.id}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-4 px-4 py-2.5 transition-colors duration-200 group ${
                    i === activeIndex ? 'bg-marquee/15 border-l-2 border-marquee' : 'hover:bg-marquee/10 border-l-2 border-transparent hover:border-marquee/50'
                  }`}
                >
                  {/* Poster Thumbnail */}
                  <div className="relative w-10 h-14 flex-none rounded bg-ink border border-ink-line overflow-hidden shadow-sm">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-wider text-paper-dim font-mono text-center leading-tight">
                        No<br/>Art
                      </div>
                    )}
                  </div>
                  
                  {/* Result Metadata */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-paper truncate group-hover:text-marquee transition-colors">
                      {movie.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="stub-label text-[10px]">{year}</span>
                      <span className="w-1 h-1 rounded-full bg-ink-line"></span>
                      <span className="badge-rating text-[10px]">★ {rating}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* See all results link */}
          {results.length > 0 && (
            <div className="border-t border-ink-line p-2">
              <button 
                onClick={handleSubmit}
                className="w-full text-center text-xs font-mono tracking-wider uppercase text-marquee hover:text-marquee-hot py-2 rounded hover:bg-marquee/10 transition-colors"
              >
                See all results
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
