"use client";

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';

const GENRES = [
  { id: "28", name: "Action" },
  { id: "35", name: "Comedy" },
  { id: "18", name: "Drama" },
  { id: "27", name: "Horror" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Sci-Fi" },
  { id: "16", name: "Animation" },
  { id: "99", name: "Documentary" },
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "ko", name: "Korean" },
  { code: "ja", name: "Japanese" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
];

const YEARS = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Safely get params, handling null (SSR)
  const getParam = (key: string, fallback: string = "") => {
    if (!searchParams) return fallback;
    return searchParams.get(key) || fallback;
  };

  // Initialize state from URL params
  const [genre, setGenre] = useState(getParam("genre", ""));
  const [language, setLanguage] = useState(getParam("language", "en"));
  const [year, setYear] = useState(getParam("year", ""));
  const [sort, setSort] = useState(getParam("sort", "popularity.desc"));

  // Flag to prevent infinite loops and unnecessary updates on initial load
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only update URL when state changes AND we are mounted
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    
    if (genre) params.set("genre", genre);
    if (language) params.set("language", language);
    if (year) params.set("year", year);
    if (sort) params.set("sort", sort);
    params.set("page", "1");

    const queryString = params.toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  }, [genre, language, year, sort, pathname, router]);

  // Debounced update
  useEffect(() => {
    if (!isMounted) return; // Wait for client-side mount

    const timeoutId = setTimeout(() => {
      updateUrl();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [genre, language, year, sort, updateUrl, isMounted]);

  // If not mounted, show a simple skeleton to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="sticky top-0 z-50 glass-panel !border-none !bg-[#0a0b10]/80 backdrop-blur-2xl py-4 px-4 mb-8">
        <div className="max-w-[1600px] mx-auto space-y-4">
          <div className="h-8 bg-white/5 rounded-lg animate-pulse w-full" />
          <div className="h-8 bg-white/5 rounded-lg animate-pulse w-full" />
          <div className="h-8 bg-white/5 rounded-lg animate-pulse w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 glass-panel !border-none !bg-[#0a0b10]/80 backdrop-blur-2xl py-4 px-4 mb-8">
      <div className="max-w-[1600px] mx-auto space-y-4">
        
        {/* Row 1: Languages */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-xs font-medium text-white/40 uppercase tracking-wider mr-2 whitespace-nowrap">Language</span>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap border ${
                language === lang.code
                  ? "bg-white text-black border-white shadow-lg shadow-white/10"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>

        {/* Row 2: Genres */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-xs font-medium text-white/40 uppercase tracking-wider mr-2 whitespace-nowrap">Genre</span>
          <button
            onClick={() => setGenre("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap border ${
              genre === ""
                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            All
          </button>
          {GENRES.map((g) => (
            <button
              key={g.id}
              onClick={() => setGenre(g.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap border ${
                genre === g.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Row 3: Year & Sort */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <select 
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="appearance-none bg-white/5 text-white text-xs font-medium rounded-lg px-4 py-2 pr-8 border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <option value="">Year: All</option>
              {YEARS.map(y => <option key={y} value={y} className="bg-[#0a0b10] text-white">{y}</option>)}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white/5 text-white text-xs font-medium rounded-lg px-4 py-2 pr-8 border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <option value="popularity.desc">Sort: Popular</option>
              <option value="vote_average.desc">Sort: Top Rated</option>
              <option value="release_date.desc">Sort: Newest</option>
              <option value="release_date.asc">Sort: Oldest</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-3 h-3 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}