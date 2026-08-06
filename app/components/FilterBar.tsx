"use client";

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define options
const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 9638, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 36, name: "Western" },
];

const YEARS = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "hi", name: "Hindi" },
  { code: "zh", name: "Chinese" },
];

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "release_date.desc", label: "Newest" },
  { value: "title.asc", label: "A-Z" },
];

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // State to hold current values
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [year, setYear] = useState(searchParams.get("year") || "");
  const [language, setLanguage] = useState(searchParams.get("language") || "");
  const [sort_by, setSortBy] = useState(searchParams.get("sort_by") || "popularity.desc");

  // Function to update URL without refreshing the whole page (optional, but smooth)
  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Always reset to page 1 when filters change
    params.set("page", "1");
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
      <div className="flex-1 min-w-[150px]">
        <label className="block text-xs text-gray-400 mb-1">Genre</label>
        <select 
          className="w-full bg-gray-800 text-white text-sm rounded p-2 border border-gray-700 focus:outline-none focus:border-blue-500"
          value={genre}
          onChange={(e) => {
            setGenre(e.target.value);
            updateUrl("genre", e.target.value);
          }}
        >
          <option value="">All Genres</option>
          {GENRES.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[120px]">
        <label className="block text-xs text-gray-400 mb-1">Year</label>
        <select 
          className="w-full bg-gray-800 text-white text-sm rounded p-2 border border-gray-700 focus:outline-none focus:border-blue-500"
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            updateUrl("year", e.target.value);
          }}
        >
          <option value="">All Years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[120px]">
        <label className="block text-xs text-gray-400 mb-1">Language</label>
        <select 
          className="w-full bg-gray-800 text-white text-sm rounded p-2 border border-gray-700 focus:outline-none focus:border-blue-500"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            updateUrl("language", e.target.value);
          }}
        >
          <option value="">All Languages</option>
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[120px]">
        <label className="block text-xs text-gray-400 mb-1">Sort By</label>
        <select 
          className="w-full bg-gray-800 text-white text-sm rounded p-2 border border-gray-700 focus:outline-none focus:border-blue-500"
          value={sort_by}
          onChange={(e) => {
            setSortBy(e.target.value);
            updateUrl("sort_by", e.target.value);
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
