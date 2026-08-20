import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-800 bg-[#1a1a1a] backdrop-blur-xl relative overflow-hidden mt-20">
      {/* Subtle Red Cinematic Accent Glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-12">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-red-600/10 flex items-center justify-center border border-red-600/30 group-hover:bg-red-600/20 transition-colors">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-display italic text-2xl font-bold tracking-tight text-white group-hover:text-red-500 transition-colors">
                  RaY-Movies
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Cinematic Discovery Engine</span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              Your destination for discovering licensed films, anime, and series. Track legal streaming availability, stream official trailers, and explore global cinema.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#141414] border border-gray-800 text-[11px] font-mono text-gray-400 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Verified Licensed Data (TMDb / JustWatch)
              </span>
            </div>
          </div>

          {/* Discover Links */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Discover
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/?sort=popularity.desc" className="text-gray-400 hover:text-red-500 transition-colors">
                  Trending Now
                </Link>
              </li>
              <li>
                <Link href="/?sort=vote_average.desc" className="text-gray-400 hover:text-red-500 transition-colors">
                  Top Rated
                </Link>
              </li>
              <li>
                <Link href="/?sort=primary_release_date.desc" className="text-gray-400 hover:text-red-500 transition-colors">
                  Latest Releases
                </Link>
              </li>
              <li>
                <Link href="/anime" className="text-gray-400 hover:text-red-500 transition-colors">
                  Anime Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Genre Shortcuts */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Genres
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/?genre=28" className="text-gray-400 hover:text-red-500 transition-colors">
                  Action
                </Link>
              </li>
              <li>
                <Link href="/?genre=35" className="text-gray-400 hover:text-red-500 transition-colors">
                  Comedy
                </Link>
              </li>
              <li>
                <Link href="/?genre=18" className="text-gray-400 hover:text-red-500 transition-colors">
                  Drama
                </Link>
              </li>
              <li>
                <Link href="/?genre=27" className="text-gray-400 hover:text-red-500 transition-colors">
                  Horror & Thriller
                </Link>
              </li>
              {/* Erotic 18+ Link */}
              <li>
                <Link href="/?include_adult=true" className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2">
                  Erotic 
                  <span className="px-1.5 py-0.5 rounded bg-red-600/20 border border-red-600/50 text-red-500 text-[9px] font-bold tracking-wider">
                    18+
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex gap-2.5 mb-4">
              {/* X / Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-lg bg-[#141414] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/gyuv/RY-Movies-1"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository"
                className="w-9 h-9 rounded-lg bg-[#141414] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-[#141414] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Metadata, images, and watch providers licensed via TMDb & JustWatch.
            </p>
          </div>
        </div>

        {/* Bottom Perforated Row */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="font-mono">
            &copy; {new Date().getFullYear()} RaY-Movies · All rights reserved.
          </p>
          <div className="flex items-center gap-5 font-mono text-[11px]">
            <span>Reel No. 001</span>
            <span className="text-gray-700">•</span>
            <span>App Router 14</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
