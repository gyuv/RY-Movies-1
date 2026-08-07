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
  const currentYear = searchParams.get('year') || '';
  const currentActor = searchParams.get('with_people') || '';

  // State for UI
  const [genre, setGenre] = useState(currentGenre);
  const [language, setLanguage] = useState(currentLanguage);
  const [sort, setSort] = useState(currentSort);
  const [year, setYear] = useState(currentYear);
  const [actor, setActor] = useState(currentActor);
  const [actorsList, setActorsList] = useState<{ id: string; name: string }[]>([]);

  // Sync state with URL params
  useEffect(() => {
    setGenre(currentGenre);
    setLanguage(currentLanguage);
    setSort(currentSort);
    setYear(currentYear);
    setActor(currentActor);
  }, [currentGenre, currentLanguage, currentSort, currentYear, currentActor]);

  // Fetch actors when language changes
  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await fetch(`/api/actors?language=${language}`);
        const data = await res.json();
        setActorsList(data.actors || []);
      } catch (e) {
        console.error("Failed to fetch actors", e);
      }
    };
    fetchActors();
    // Reset actor selection when language changes
    setActor('');
  }, [language]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set('page', '1'); // Reset to page 1 when filters change
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    const query = createQueryString(name, value);
    router.push(`${pathname}?${query}`);
  };

  // Complete list of genres
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

  // Complete list of languages
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

  // Complete list of sorts
  const sorts = [
    { id: 'popularity.desc', name: 'Popularity' },
    { id: 'vote_average.desc', name: 'Top Rated' },
    { id: 'primary_release_date.desc', name: 'Latest' },
    { id: 'revenue.desc', name: 'Revenue' },
  ];

  // Dynamic Year Options (from Code 1 concept)
  const years = [];
  const currentYearNum = new Date().getFullYear();
  for (let i = currentYearNum; i >= 1990; i--) {
    years.push({ id: String(i), name: String(i) });
  }

  const selectClass =
    "bg-ink-raised text-paper text-sm rounded-md px-3 py-2 border border-ink-line focus:outline-none focus:ring-1 focus:ring-marquee transition-colors";

  return (
    <div className="bg-ink-raised/80 backdrop-blur-sm border-b border-ink-line bg-sprockets bg-bottom bg-repeat-x sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Genre Filter */}
          <select
            value={genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className={selectClass}
          >
            {genres.map(g => <option key={g.id} value={g.id} className="bg-ink-raised">{g.name}</option>)}
          </select>

          {/* Language Filter */}
          <select
            value={language}
            onChange={(e) => handleFilterChange('language', e.target.value)}
            className={selectClass}
          >
            {languages.map(l => <option key={l.id} value={l.id} className="bg-ink-raised">{l.name}</option>)}
          </select>

          {/* Year Filter */}
          <select
            value={year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className={selectClass}
          >
            <option value="" className="bg-ink-raised">All Years</option>
            {years.map(y => <option key={y.id} value={y.id} className="bg-ink-raised">{y.name}</option>)}
          </select>

          {/* Actor Filter */}
          <select
            value={actor}
            onChange={(e) => handleFilterChange('with_people', e.target.value)}
            className={`${selectClass} disabled:opacity-40`}
            disabled={actorsList.length === 0}
          >
            <option value="" className="bg-ink-raised">Popular Actors</option>
            {actorsList.map(a => <option key={a.id} value={a.id} className="bg-ink-raised">{a.name}</option>)}
          </select>

          {/* Sort Filter */}
          <select
            value={sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className={selectClass}
          >
            {sorts.map(s => <option key={s.id} value={s.id} className="bg-ink-raised">{s.name}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
