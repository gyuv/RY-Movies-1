import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-ink/90 backdrop-blur border-b border-ink-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display italic text-2xl tracking-tight text-paper group-hover:text-marquee transition-colors">
            Cinereel
          </span>
          <span className="stub-label hidden sm:inline">est. reel one</span>
        </Link>
        <nav className="flex items-center gap-6 stub-label">
          <span className="text-marquee">Search</span>
        </nav>
      </div>
      {/* marquee bulb strip */}
      <div
        className="h-[3px] w-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #E8A33D 0 6px, transparent 6px 16px)",
        }}
      />
    </header>
  );
}
