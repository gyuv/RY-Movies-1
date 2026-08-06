'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const GENRES = [
  { id: '28', name: 'Action' },
  { id: '35', name: 'Comedy' },
  { id: '18', name: 'Drama' },
  { id: '27', name: 'Horror' },
  { id: '12', name: 'Adventure' },
  { id: '878', name: 'Sci-Fi' },
  { id: '53', name: 'Thriller' },
  { id: '10749', name: 'Romance' },
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popular' },
  { value: 'vote_average.desc', label: 'Top Rated' },
  { value: 'primary_release_date.desc', label: 'Newest' },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
];

export default function Filters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'popularity.desc');
  const [selectedLang, setSelectedLang] = useState(searchParams.get('language') || 'en');

  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedGenre) params.set('genre', selectedGenre);
    params.set('sort', selectedSort);
    params.set('language', selectedLang);
    params.set('page', '1');
    
    replace(`${pathname}?${params.toString()}`);
  }, [selectedGenre, selectedSort, selectedLang, pathname, replace]);

  useEffect(() => {
    updateURL();
  }, [updateURL]);

  return (
    <div className="sticky top-0 z-50 bg-[#0a0b10]/90 backdrop-blur-xl border-b border-white/10 py-4">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-white/60 text-sm">Language:</label>
            <select 
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-white/30"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-[#0a0b10]">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2">
            <label className="text-white/60 text-sm">Sort By:</label>
            <select 
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-white/10 text-white text-sm rounded-lg px-3 py-2 outline-none border border-white/10 focus:border-white/30"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#0a0b10]">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Genre Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto max-w-full">
            <span className="text-white/60 text-sm whitespace-nowrap">Genres:</span>
            <div className="flex space-x-2">
              {GENRES.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id === selectedGenre ? '' : genre.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedGenre === genre.id 
                      ? 'bg-white text-black' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
