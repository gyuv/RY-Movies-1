"use client";

/**
 * RayMovies — CinematicHero
 * ------------------------------------------------------------------
 * A $10M cinematic landing banner (Movietime-style, elevated):
 *   • immersive backdrop with an OLED gradient fade (right + bottom)
 *   • hero-local header nav (RayMovies logo + links)
 *   • oversized title, season line, gold star rating, genre tags,
 *     description, and a glowing Watch Now CTA
 *   • floating overlapping poster carousel with an active glow frame,
 *     lift, and dimmed neighbours
 *
 * API-safe: consumes the SAME TMDB movie objects the homepage already
 * fetches (backdrop_path / poster_path / title / overview / vote_average
 * / release_date / genre_ids / id). Watch routes to the existing
 * /media/[id] page. No backend or routing changes.
 *
 * Responsive: widescreen on desktop, stacked on mobile with a swipeable
 * poster row. Smart-TV D-pad ready via [data-apex-nav] + .apex-focusable.
 */
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const IMG = "https://image.tmdb.org/t/p";

const GENRES: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

const NAV = [
  { label: "Home", href: "/" },
  { label: "Tv Shows", href: "/series" },
  { label: "Movies", href: "/movies" },
  { label: "Upcoming", href: "/?tab=recent" },
  { label: "Login", href: "/?login=1" },
];

export interface HeroMovie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating / 2); // vote_average (0–10) → 0–5
  return (
    <div className="flex items-center gap-1" aria-label={`${filled} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`h-4 w-4 sm:h-5 sm:w-5 ${i < filled ? "text-marquee" : "text-white/20"}`}
          fill="currentColor"
        >
          <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01z" />
        </svg>
      ))}
    </div>
  );
}

export default function CinematicHero({ movies }: { movies: HeroMovie[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  const list = (movies || []).filter((m) => m.backdrop_path || m.poster_path).slice(0, 12);
  const current = list[active];

  // Gentle autoplay; pauses on hover/focus.
  useEffect(() => {
    if (paused || reduce || list.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % list.length), 7000);
    return () => clearInterval(id);
  }, [paused, reduce, list.length]);

  const select = useCallback((i: number) => {
    setActive(i);
    const el = rowRef.current?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  if (!current) return null;

  const title = current.title || current.name || "Untitled";
  const year = current.release_date?.split("-")[0];
  const genres = (current.genre_ids || []).map((g) => GENRES[g]).filter(Boolean).slice(0, 3);
  const backdrop = current.backdrop_path
    ? `${IMG}/original${current.backdrop_path}`
    : `${IMG}/w780${current.poster_path}`;

  return (
    <section
      className="relative flex min-h-[92svh] w-full flex-col overflow-hidden bg-apex-void"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Immersive backdrop (crossfades on change) ── */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image src={backdrop} alt={title} fill priority className="object-cover object-top" />
          </motion.div>
        </AnimatePresence>
        {/* OLED fades: bottom, right, and a base wash for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-apex-void via-apex-void/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-apex-void/30 via-apex-void/55 to-apex-void md:via-apex-void/20 md:to-apex-void" />
        <div className="absolute inset-0 bg-gradient-to-b from-apex-void/70 via-transparent to-transparent" />
      </div>

      {/* ── Hero-local header ── */}
      <header className="relative z-20 mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 md:pl-24 lg:pl-28 lg:pr-12">
        <Link href="/" data-apex-nav className="apex-focusable rounded-md">
          <span className="font-heading text-2xl font-extrabold tracking-tight text-arcade-gold drop-shadow-[0_0_18px_rgba(231,185,75,0.55)] sm:text-3xl">
            RayMovies
          </span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex lg:gap-9">
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              data-apex-nav
              className="apex-focusable group relative rounded-md px-1 py-1 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {n.label}
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-arcade-gold shadow-[0_0_10px_rgba(231,185,75,0.95)] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
      </header>

      {/* ── Featured content (grows to fill; sits ABOVE the poster row) ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 items-center px-5 py-6 sm:px-8 md:pl-24 lg:pl-28 lg:pr-12">
        <div className="grid w-full grid-cols-1 items-center gap-6 md:grid-cols-2">
        {/* spacer so backdrop characters read on the left (desktop) */}
        <div className="hidden md:block" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={reduce ? false : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl md:ml-auto md:text-left"
          >
            <h1 className="font-heading text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white drop-shadow-2xl sm:text-6xl lg:text-7xl">
              {title}
            </h1>

            <p className="mt-3 text-sm font-medium uppercase tracking-[0.3em] text-white/55">
              {year ? `Featured · ${year}` : "Featured"}
            </p>

            <div className="mt-4 flex items-center gap-4">
              <Stars rating={current.vote_average ?? 0} />
              <span className="font-mono text-xs text-white/50">
                {(current.vote_average ?? 0).toFixed(1)}
              </span>
            </div>

            {genres.length > 0 && (
              <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-white/80">
                {genres.map((g, i) => (
                  <span key={g} className="flex items-center gap-3">
                    {i > 0 && <span className="text-white/25">|</span>}
                    {g}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/65 line-clamp-3 sm:text-base">
              {current.overview || "An unmissable feature, hand-picked for tonight's watch."}
            </p>

            <div className="mt-7 flex items-center gap-4">
              <Link
                href={`/media/${current.id}`}
                data-apex-nav
                className="apex-focusable group relative inline-flex items-center gap-2.5 rounded-full bg-arcade-gold px-8 py-3.5 text-base font-bold text-arcade-deep shadow-[0_10px_40px_-8px_rgba(231,185,75,0.75)] transition-all hover:-translate-y-0.5 hover:bg-arcade-goldHot hover:shadow-[0_16px_55px_-6px_rgba(231,185,75,0.95)]"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
                <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 ring-2 ring-arcade-blue/60 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
        </div>
      </div>

      {/* ── Floating poster carousel (in normal flow — never overlaps content) ── */}
      <div className="relative z-20 w-full pb-6">
        <div
          ref={rowRef}
          className="scrollbar-hide flex items-end gap-3 overflow-x-auto px-5 pb-2 pt-6 sm:gap-4 sm:px-8 md:pl-24 lg:pl-28 lg:pr-12 snap-x snap-mandatory"
        >
          {list.map((m, i) => {
            const isActive = i === active;
            const poster = m.poster_path ? `${IMG}/w342${m.poster_path}` : null;
            return (
              <motion.button
                key={m.id}
                onClick={() => select(i)}
                onFocus={() => select(i)}
                data-apex-nav
                aria-label={m.title || m.name}
                aria-current={isActive}
                animate={{
                  y: isActive ? -14 : 0,
                  opacity: isActive ? 1 : 0.55,
                  scale: isActive ? 1.04 : 1,
                }}
                whileHover={{ opacity: 1, y: -8 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="apex-focusable relative aspect-[2/3] w-[92px] flex-none snap-center overflow-hidden rounded-lg sm:w-[110px] md:w-[124px]"
                style={{ outline: "none" }}
              >
                {poster ? (
                  <Image src={poster} alt={m.title || m.name || ""} fill sizes="124px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-apex-panel text-[10px] text-white/50">
                    {m.title || m.name}
                  </div>
                )}
                {/* active glow frame (gold ring + blue inner bloom) */}
                <span
                  className={`pointer-events-none absolute inset-0 rounded-lg transition-all duration-300 ${
                    isActive
                      ? "ring-2 ring-arcade-gold shadow-[0_0_22px_rgba(231,185,75,0.7),inset_0_0_18px_rgba(59,130,246,0.4)]"
                      : "ring-1 ring-white/10"
                  }`}
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/85 to-transparent px-1.5 pb-1 pt-4 text-center text-[10px] font-medium text-white/85">
                  {m.title || m.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
