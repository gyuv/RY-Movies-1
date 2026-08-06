"use client";

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

export default function Filters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get current values from URL
  const currentGenre = searchParams.get('genre') || '';
  const currentLanguage = searchParams.get('language') || 'en';
  const currentSort = searchParams.get('sort') || 'popularity.desc';

  // State for UI (to avoid flashing)
  const [genre, setGenre] = useState(currentGenre);
  const [language, setLanguage] = useState(currentLanguage);
  const [sort, setSort] = useState(currentSort);

  // Sync state with URL params
  useEffect(() => {
    setGenre(currentGenre);
    setLanguage(currentLanguage);
    setSort(currentSort);
  }, [currentGenre, currentLanguage, currentSort]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset page to 1 when filters change
      params.set('page', '1');
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    const query = createQueryString(name, value);
    router.push(`${pathname}?${query}`);
  };

  const genres = [
    { id: '', name: 'All Genres' },
    { id: '28', name: 'Action' },
    { id: '35', name: 'Comedy' },
    { id: '18', name: 'Drama' },
    { id: '27', name: 'Horror' },
    { id: '878', name: 'Sci-Fi' },
    { id: '10749', name: 'Romance' },
    { id: '16', name: 'Animation' },
    { id: '53', name: 'Thriller' },
  ];

  const languages = [
    { id: 'en', name: 'English' },
    { id: 'ta', name: 'Tamil' },
    { id: 'te', name: 'Telugu' },
    { id: 'hi', name: 'Hindi' },
    { id: 'fr', name: 'French' },
    { id: 'es', name: 'Spanish' },
    { id: 'ko', name: 'Korean' },
    { id: 'ja', name: 'Japanese' },
  ];

  const sorts = [
    { id: 'popularity.desc', name: 'Popularity' },
    { id: 'vote_average.desc', name: 'Top Rated' },
    { id: 'primary_release_date.desc', name: 'Latest' },
    { id: 'revenue.desc', name: 'Revenue' },
  ];

  return (
    <div className="bg-[#14151a] border-b border-white/5 sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Genre Filter */}
          <select 
            value={genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="bg-white/5 text-white text-sm rounded-md px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>

          {/* Language Filter */}
          <select 
            value={language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className="bg-white/5 text-white text-sm rounded-md px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>

          {/* Sort Filter */}
          <select 
            value={sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="bg-white/5 text-white text-sm rounded-md px-3 py-2 border border-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {sorts.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
