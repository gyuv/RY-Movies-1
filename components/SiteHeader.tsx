import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-ink/85 backdrop-blur-xl border-b border-ink-line/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        <Link href="/" className="group flex items-baseline gap-2 shrink-0">
          <span className="font-display italic text-xl sm:text-2xl tracking-tight text-paper group-hover:text-marquee transition-colors">
            Cinereel
          </span>
          <span className="stub-label hidden md:inline text-paper-dim">est. reel one</span>
        </Link>

        <nav className="flex items-center gap-5 sm:gap-8 stub-label">
          <Link href="/" className="text-marquee hover:text-marquee-hot transition-colors">
            Browse
          </Link>
          <span className="hidden sm:inline text-paper-dim">Movies</span>
          <span className="hidden sm:inline text-paper-dim">Series</span>
        </nav>
      </div>

      {/* subtle amber accent line (Prime-like, less bulb-strip) */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-marquee/60 to-transparent" />
    </header>
  );
}
