"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

export default function SiteHeader() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Dynamic scroll effect for a premium, vanishing-edge header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-ink/85 backdrop-blur-2xl shadow-lg shadow-black/50"
          : "bg-gradient-to-b from-ink/90 via-ink/40 to-transparent"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4 sm:gap-8">
        
        {/* Upgraded Logo with Icon and Tagline */}
        <Link href="/" className="group flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-marquee/10 flex items-center justify-center border border-marquee/30 group-hover:bg-marquee/20 transition-colors">
            {/* Cinematic Film Strip Icon */}
            <svg className="w-5 h-5 text-marquee" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display italic text-xl sm:text-2xl font-bold tracking-tight text-paper group-hover:text-marquee transition-colors leading-none">
              RaY-Movies
            </span>
            <span className="stub-label hidden lg:block text-paper-dim/70 mt-1">
              chill beer with a good movie
            </span>
          </div>
        </Link>

        {/* Search Bar Container */}
        <div className="flex-1 min-w-0 flex justify-center max-w-2xl mx-auto">
          <SearchBar
            initialValue=""
            variant="compact"
            onSearch={(query: string) => {
              const params = new URLSearchParams();
              if (query) params.set("q", query);
              router.push(`/?${params.toString()}`);
            }}
          />
        </div>

        {/* High-End Animated Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium shrink-0">
          {['Movies', 'Series', 'Anime', 'Manga'].map((item) => (
            <Link 
              key={item}
              href={`/${item.toLowerCase()}`} 
              className="hidden md:block relative text-paper-dim hover:text-paper transition-colors py-2 group"
            >
              {item}
              {/* Animated Underline */}
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-marquee scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 rounded-full" />
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Dynamic Amber Accent Line (Only shows when scrolled) */}
      <div 
        className={`h-px w-full transition-opacity duration-500 bg-gradient-to-r from-transparent via-marquee/60 to-transparent ${
          isScrolled ? "opacity-100" : "opacity-0"
        }`} 
      />
    </header>
  );
}
