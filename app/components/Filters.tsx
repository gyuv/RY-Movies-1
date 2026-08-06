"use client";

import { useState } from 'react';

interface FilterProps {
  onFilterChange: (filters: { genre: string; year: string; language: string; sort: string }) => void;
}

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

export default function Filters({ onFilterChange }: FilterProps) {
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("en");
  const [year, setYear] = useState("");
  const [sort, setSort] = useState("popularity.desc");

  // Debounce or update filters
  const updateFilters = () => {
    onFilterChange({ genre, year, language, sort });
  };

  // Update on every change for instant feel
  useState(() => {
    onFilterChange({ genre, year, language, sort });
  });

  const handleGenreChange = (g: string) => {
    setGenre(g);
    onFilterChange({ genre: g, year, language, sort });
  };

  const handleLanguageChange = (l: string) => {
    setLanguage(l);
    onFilterChange({ genre, year, language: l, sort });
  };

  const handleYearChange = (y: string) => {
    setYear(y);
    onFilterChange({ genre, year: y, language, sort });
  };

  const handleSortChange = (s: string) => {
    setSort(s);
    onFilterChange({ genre, year, language, sort: s });
  };

  return (
    <div className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 py-4 px-4 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        {/* Language Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide w-full lg:w-auto">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                language === lang.code
                  ? "bg-white text-black shadow-lg shadow-white/20"
                  : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>

        {/* Genre Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide w-full lg:w-auto">
          <button
            onClick={() => handleGenreChange("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
              genre === ""
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            All Genres
          </button>
          {GENRES.map((g) => (
            <button
              key={g.id}
              onClick={() => handleGenreChange(g.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                genre === g.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Year & Sort Controls */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          <select 
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
            className="bg-white/10 text-white text-sm rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select 
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-white/10 text-white text-sm rounded-lg px-3 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="popularity.desc">Popular</option>
            <option value="vote_average.desc">Top Rated</option>
            <option value="release_date.desc">Newest</option>
            <option value="release_date.asc">Oldest</option>
          </select>
        </div>
      </div>
    </div>
  );
}