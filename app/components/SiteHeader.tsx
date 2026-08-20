"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import SearchBar from "./SearchBar";

export default function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = ['Movies', 'Series', 'Anime', 'Manga'];

  // The premium cinematic logo block
  const Logo = () => (
    <Link href="/" className="group flex flex-col gap-3 shrink-0 mb-8" onClick={() => setIsMobileMenuOpen(false)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center border border-red-600/30 group-hover:bg-red-600/20 group-hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.15)]">
          {/* Cinematic Film Strip Icon */}
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        </div>
        <span className="font-display italic text-2xl font-bold tracking-tight text-white group-hover:text-red-500 transition-colors leading-none">
          RaY-Movies
        </span>
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-gray-500 group-hover:text-gray-400 transition-colors pl-1">
        chill beer with a good movie
      </span>
    </Link>
  );

  return (
    <>
      {/* Mobile Top Bar (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-[#141414]/95 backdrop-blur-xl z-50 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <span className="font-display italic text-xl font-bold text-white">RaY-Movies</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Main Sidebar (Fixed on Desktop, absolute overlay on Mobile) */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0a0a0a] border-r border-gray-800/60 shadow-[20px_0_40px_rgba(0,0,0,0.5)] transform transition-transform duration-300 ease-in-out flex flex-col ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}>
        
        <div className="p-6 flex-1 flex flex-col overflow-y-auto scrollbar-hide">
          <Logo />

          {/* Search Bar Container */}
          <div className="mb-10 w-full relative group">
            <SearchBar
              initialValue=""
              variant="compact"
              onSearch={(query: string) => {
                const params = new URLSearchParams();
                if (query) params.set("q", query);
                router.push(`/?${params.toString()}`);
                setIsMobileMenuOpen(false); // Close menu on mobile search
              }}
            />
          </div>

          {/* High-End Animated Vertical Navigation */}
          <nav className="flex flex-col gap-2 font-medium">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-2 pl-4">Menu</h3>
            
            {navItems.map((item) => {
              const isActive = pathname === `/${item.toLowerCase()}`;
              return (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase()}`} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                    isActive 
                      ? "text-white bg-gray-800/50" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                  }`}
                >
                  {/* Glowing left accent line on hover/active */}
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-md transition-all duration-300 ${
                    isActive ? "h-3/4 bg-red-600" : "h-0 bg-red-600 group-hover:h-1/2"
                  }`} />
                  
                  <span className={`transition-transform duration-300 ${isActive ? "translate-x-2" : "group-hover:translate-x-2"}`}>
                    {item}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile / Extra Bottom Elements Placeholder */}
        <div className="p-6 border-t border-gray-800/60">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-800/30 cursor-pointer transition-colors text-gray-400 hover:text-white">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white text-xs">
              U
            </div>
            <span className="text-sm font-medium">Sign In</span>
          </div>
        </div>

      </aside>

      {/* Mobile Overlay Background */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
