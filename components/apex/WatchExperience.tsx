"use client";

/**
 * Project Apex — WatchExperience
 * ------------------------------------------------------------------
 * The cinematic movie detail + watch surface. Ambient dynamic lighting,
 * glassmorphic controls, and fluid spatial metadata. Distraction-free.
 *
 * Streaming stays 100% intact: the actual player, cast row, and footer
 * are injected as slots (`playerSlot`, `castSlot`, `footerSlot`) rendered
 * upstream by the server page. This component never touches stream
 * routing — it only frames it.
 *
 * Input targets: desktop (pointer), mobile (touch), Smart-TV (D-pad via
 * [data-apex-nav] + .apex-focusable, handled by the global spatial nav).
 */
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const IMG_BASE = "https://image.tmdb.org/t/p";

export interface WatchMedia {
  id: number;
  title: string;
  original_title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  releaseYear: string;
  runtimeHours: number;
  runtimeMins: number;
  genres?: { name: string }[];
  status?: string;
  original_language?: string;
  popularity?: number;
  kind: "movie" | "tv";
  youtubeKey?: string | null;
}

interface Props {
  media: WatchMedia;
  playerSlot: React.ReactNode;
  castSlot?: React.ReactNode;
  hasCast?: boolean;
  footerSlot?: React.ReactNode;
}

const ease = [0.16, 1, 0.3, 1] as const;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function WatchExperience({
  media,
  playerSlot,
  castSlot,
  hasCast,
  footerSlot,
}: Props) {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const heroFade = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);

  const backdrop = media.backdrop_path
    ? `${IMG_BASE}/original${media.backdrop_path}`
    : null;
  const poster = media.poster_path ? `${IMG_BASE}/w500${media.poster_path}` : null;

  const scrollToPlayer = useCallback(() => {
    document
      .getElementById("apex-watch")
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [reduce]);

  const rating = media.vote_average ?? 0;

  return (
    <main className="relative min-h-screen bg-apex-void text-paper overflow-x-clip">
      {/* ─────────── Ambient lighting layer (fixed, behind everything) ─────────── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-apex-void">
        {backdrop && (
          <Image
            src={backdrop}
            alt=""
            aria-hidden
            fill
            priority
            className="scale-125 object-cover opacity-30 blur-3xl saturate-150"
          />
        )}
        {/* drifting neon glow blobs — the "dynamic ambient lighting" */}
        {!reduce && (
          <>
            <motion.div
              className="absolute -top-1/4 left-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 rounded-full blur-[120px]"
              style={{ background: "radial-gradient(circle, rgba(34,230,216,0.16), transparent 60%)" }}
              animate={{ x: ["-55%", "-45%", "-55%"], y: ["-10%", "6%", "-10%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 right-0 h-[60vmax] w-[60vmax] rounded-full blur-[120px]"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.16), transparent 60%)" }}
              animate={{ x: ["10%", "-6%", "10%"], y: ["10%", "-4%", "10%"] }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-apex-void/40 via-apex-void/70 to-apex-void" />
      </div>

      {/* ─────────────────────────── Cinematic hero ─────────────────────────── */}
      <section
        ref={heroRef}
        className="relative h-[68svh] min-h-[400px] max-h-[760px] w-full overflow-hidden"
      >
        {backdrop && (
          <motion.div style={{ y: heroY, scale: heroScale, opacity: heroFade }} className="absolute inset-0">
            <Image src={backdrop} alt={media.title} fill priority className="object-cover object-top" />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-apex-void via-apex-void/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-apex-void/85 via-transparent to-transparent" />

        {/* Back control (glass) */}
        <Link
          href="/"
          data-apex-nav
          aria-label="Back to browse"
          className="apex-glass apex-focusable absolute left-4 top-4 sm:left-8 sm:top-8 z-20 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:shadow-apex-glow transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
            <path d="M15 19l-7-7 7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </Link>

        {/* Hero content */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-[1500px] px-5 pb-10 sm:px-8 sm:pb-14 lg:px-12">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
              className="max-w-3xl"
            >
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.42em] text-apex-cyan/80">
                {media.kind === "tv" ? "Series" : "Feature Film"}
              </p>
              <h1 className="font-display text-4xl font-bold leading-[1.05] drop-shadow-2xl sm:text-6xl lg:text-7xl">
                {media.title}
              </h1>

              {/* Meta chips */}
              <div className="mt-5 flex flex-wrap items-center gap-2.5 text-sm">
                <span className="apex-glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-bold text-marquee">
                  ★ {rating.toFixed(1)}
                </span>
                <span className="apex-glass rounded-full px-3 py-1 text-white/85">{media.releaseYear}</span>
                {(media.runtimeHours > 0 || media.runtimeMins > 0) && (
                  <span className="apex-glass rounded-full px-3 py-1 text-white/85">
                    {media.runtimeHours}h {media.runtimeMins}m
                  </span>
                )}
                {media.genres?.slice(0, 4).map((g) => (
                  <span
                    key={g.name}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-wide text-white/70"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              {/* Primary controls */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={scrollToPlayer}
                  data-apex-nav
                  className="apex-focusable group inline-flex items-center gap-2.5 rounded-full bg-apex-cyan px-8 py-3.5 text-base font-bold text-black shadow-apex-glow transition-all hover:scale-[1.04] hover:bg-white"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Now
                </button>
                {media.youtubeKey && (
                  <a
                    href="#apex-trailer"
                    data-apex-nav
                    className="apex-glass apex-focusable inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white/90 hover:text-white hover:shadow-apex-violet transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                      <path d="M8 5v14l11-7z" strokeWidth={1.6} strokeLinejoin="round" />
                    </svg>
                    Trailer
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Theater / player ─────────────────────────── */}
      <section id="apex-watch" className="relative mx-auto max-w-[1500px] px-4 sm:px-8 lg:px-12 pt-10 sm:pt-14">
        <Reveal>
          <div className="mb-5 flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full bg-apex-cyan shadow-[0_0_12px_rgba(34,230,216,0.9)]" />
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Watch Online</h2>
          </div>
          {/* Ambient theater bloom sits behind the glass player frame */}
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-70 blur-3xl"
              style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(34,230,216,0.22), rgba(139,92,246,0.14) 45%, transparent 75%)" }}
            />
            <div className="apex-glass overflow-hidden rounded-[1.6rem] p-2 sm:p-3 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.9)]">
              {playerSlot}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─────────────────────── Spatial metadata layout ─────────────────────── */}
      <div className="mx-auto max-w-[1500px] px-4 sm:px-8 lg:px-12 py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="order-2 space-y-12 lg:order-1">
            <Reveal>
              <section>
                <h3 className="mb-4 font-display text-xl font-bold sm:text-2xl">Synopsis</h3>
                <p className="max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
                  {media.overview || "No overview available for this title yet."}
                </p>
              </section>
            </Reveal>

            {media.youtubeKey && (
              <Reveal>
                <section id="apex-trailer" className="scroll-mt-24">
                  <h3 className="mb-4 font-display text-xl font-bold sm:text-2xl">Official Trailer</h3>
                  <div className="apex-glass aspect-video overflow-hidden rounded-2xl p-1.5">
                    <iframe
                      src={`https://www.youtube.com/embed/${media.youtubeKey}?rel=0&modestbranding=1`}
                      title={`${media.title} Trailer`}
                      className="h-full w-full rounded-xl"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </section>
              </Reveal>
            )}

            {hasCast && (
              <Reveal>
                <section>
                  <h3 className="mb-4 font-display text-xl font-bold sm:text-2xl">Top Cast</h3>
                  {castSlot}
                </section>
              </Reveal>
            )}
          </div>

          {/* Sidebar — poster + details (glass, sticky on desktop) */}
          <Reveal className="order-1 lg:order-2" delay={0.05}>
            <div className="lg:sticky lg:top-6 space-y-5">
              {poster && (
                <div className="apex-glass overflow-hidden rounded-2xl p-1.5 shadow-apex-violet/30">
                  <Image
                    src={poster}
                    alt={media.title}
                    width={500}
                    height={750}
                    className="w-full rounded-xl"
                  />
                </div>
              )}
              <dl className="apex-glass grid grid-cols-2 gap-x-4 gap-y-5 rounded-2xl p-5">
                <DetailItem label="Original Title" value={media.original_title} span />
                <DetailItem label="Status" value={media.status} />
                <DetailItem label="Language" value={media.original_language?.toUpperCase()} />
                <DetailItem label="Rating" value={`★ ${rating.toFixed(1)}`} />
                <DetailItem
                  label="Popularity"
                  value={media.popularity != null ? Math.round(media.popularity).toLocaleString() : "—"}
                />
              </dl>
            </div>
          </Reveal>
        </div>
      </div>

      {footerSlot}
    </main>
  );
}

function DetailItem({ label, value, span }: { label: string; value?: string | null; span?: boolean }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{label}</dt>
      <dd className="mt-1 font-medium text-white/90">{value || "—"}</dd>
    </div>
  );
}
