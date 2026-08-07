import Link from "next/link";
import SearchBar from "./SearchBar";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-ink/85 backdrop-blur-xl border-b border-ink-line/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        <Link href="/" className="group flex items-baseline gap-2 shrink-0">
          <span className="font-display italic text-xl sm:text-2xl tracking-tight text-paper group-hover:text-marquee transition-colors">
            RaY-Movies
          </span>
          <span className="stub-label hidden md:inline text-paper-dim">chill beer with a good movie...what else?</span>
        </Link>

        <div className="flex-1 flex justify-center max-w-md">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-5 sm:gap-8 stub-label shrink-0">
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
