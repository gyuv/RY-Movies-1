"use client";

/**
 * Project Apex — Universal Search
 * ------------------------------------------------------------------
 * A floating glassmorphic search launcher + command-palette overlay.
 * Replaces the old navbar search while staying distraction-free.
 *
 * - Hits the EXISTING /api/search endpoint (unchanged) with live,
 *   debounced results.
 * - Opens with the floating button, or ⌘K / Ctrl-K; closes on Escape.
 * - Full keyboard + Smart-TV D-pad support (arrows/Enter, [data-apex-nav]).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface SearchResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export default function ApexSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Global shortcut: ⌘K / Ctrl-K to open, Escape to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    // The nav dock (and anything else) can open search via this event.
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("apex:open-search", onOpen as EventListener);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("apex:open-search", onOpen as EventListener);
    };
  }, []);

  // Focus input + lock scroll while open.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Debounced live fetch against the existing search route.
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
        setActive(-1);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const go = useCallback(
    (id: number) => {
      setOpen(false);
      setQuery("");
      router.push(`/media/${id}`);
    },
    [router]
  );

  const onInputKey = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && active >= 0 && results[active]) {
      e.preventDefault();
      go(results[active].id);
    }
  };

  return (
    <>
      {/* Launcher lives in the SpatialDock; this overlay opens via ⌘K or the
          "apex:open-search" window event. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh]"
            onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="apex-glass relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
            >
              {/* Input row */}
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-apex-cyan">
                  <path
                    d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 1 1 4 10.5a6.5 6.5 0 0 1 13 0Z"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="Search films, series, actors…"
                  className="flex-1 bg-transparent text-lg text-white placeholder:text-white/35 focus:outline-none"
                />
                {loading && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-apex-cyan" />
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close search"
                  className="rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-white"
                >
                  Esc
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[55vh] overflow-y-auto">
                {query.trim().length < 2 && (
                  <p className="px-5 py-10 text-center text-sm text-white/40">
                    Type at least 2 characters to search the catalogue.
                  </p>
                )}
                {query.trim().length >= 2 && !loading && results.length === 0 && (
                  <p className="px-5 py-10 text-center text-sm text-white/40">
                    No matches for “{query.trim()}”.
                  </p>
                )}
                {results.map((m, i) => {
                  const year = m.release_date?.split("-")[0] || "TBA";
                  return (
                    <Link
                      key={m.id}
                      href={`/media/${m.id}`}
                      data-apex-nav
                      onClick={() => go(m.id)}
                      onMouseEnter={() => setActive(i)}
                      className={`apex-focusable flex items-center gap-3.5 px-5 py-3 transition-colors ${
                        i === active ? "bg-apex-cyan/10" : "hover:bg-white/5"
                      }`}
                    >
                      <div className="relative h-[66px] w-11 flex-none overflow-hidden rounded-md border border-white/10 bg-black/40">
                        {m.poster_path ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                            alt={m.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[9px] text-white/40">
                            No art
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">{m.title}</p>
                        <p className="mt-0.5 text-xs text-white/45">
                          {year} · <span className="text-marquee">★ {m.vote_average?.toFixed(1) ?? "—"}</span>
                        </p>
                      </div>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 text-white/30">
                        <path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
