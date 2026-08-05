{/* Cinematic hero */}
<section className="relative -mt-0 mb-10 overflow-hidden">
  {/* optional backdrop if you later add backdropUrl to MediaDetail */}
  <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink" />
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
    <Link href="/" className="stub-label hover:text-marquee transition-colors inline-block mb-6">
      ← Back to browse
    </Link>

    <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 items-start">
      <div className="w-36 sm:w-48 md:w-56 shrink-0 rounded-md overflow-hidden border border-ink-line shadow-2xl shadow-black/50">
        <div className="aspect-[2/3] bg-ink-raised">
          {media.posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={media.posterUrl} alt={media.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-paper-dim text-sm px-3 text-center font-display italic">
              {media.title}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 pt-1">
        <p className="stub-label text-marquee mb-2">
          {media.kind === "tv" ? "Series" : "Feature Film"} · {media.year ?? "—"}
        </p>
        <h1 className="font-display italic text-3xl sm:text-5xl lg:text-6xl text-paper leading-[1.1]">
          {media.title}
        </h1>
        {media.tagline && (
          <p className="text-paper-dim italic mt-3 text-base sm:text-lg">{media.tagline}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 font-mono text-sm text-paper-dim">
          <span className="text-marquee">★ {media.rating.toFixed(1)}</span>
          {media.runtimeMinutes && <span>{media.runtimeMinutes} min</span>}
          <span className="line-clamp-1">{media.genres.map((g) => g.name).join(" · ")}</span>
        </div>

        <p className="text-paper/90 mt-6 max-w-2xl leading-relaxed text-sm sm:text-base">
          {media.overview}
        </p>
      </div>
    </div>
  </div>
</section>
