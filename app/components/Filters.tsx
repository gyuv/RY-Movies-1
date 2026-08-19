// Save as: components/Filters.tsx
"use client";

import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

interface Option {
  id: string;
  name: string;
}

export default function Filters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get current values from URL
  const currentGenre = searchParams.get('genre') || '';
  const currentLanguage = searchParams.get('language') || 'en';
  const currentRegion = searchParams.get('region') || '';
  const currentSort = searchParams.get('sort') || 'popularity.desc';
  const currentYear = searchParams.get('year') || '';
  const currentActor = searchParams.get('with_people') || '';

  // State for UI
  const [genre, setGenre] = useState(currentGenre);
  const [language, setLanguage] = useState(currentLanguage);
  const [region, setRegion] = useState(currentRegion);
  const [sort, setSort] = useState(currentSort);
  const [year, setYear] = useState(currentYear);
  const [actor, setActor] = useState(currentActor);
  
  // Dynamic lists state
  const [languagesList, setLanguagesList] = useState<Option[]>([]);
  const [regionsList, setRegionsList] = useState<Option[]>([]);
  const [actorsList, setActorsList] = useState<Option[]>([]);

  // Sync state with URL params
  useEffect(() => {
    setGenre(currentGenre);
    setLanguage(currentLanguage);
    setRegion(currentRegion);
    setSort(currentSort);
    setYear(currentYear);
    setActor(currentActor);
  }, [currentGenre, currentLanguage, currentRegion, currentSort, currentYear, currentActor]);

  // Fetch all global languages and regions on mount
  useEffect(() => {
    const fetchGlobalConfigs = async () => {
      try {
        const res = await fetch('/api/config'); // Or fetch standard configuration if you expose an api route, or fetch directly if using an env client proxy. 
        // Alternatively, use standard language/region list or local mapping if API route isn't set up yet.
      } catch (e) {
        console.error("Failed to load configs", e);
      }
    };
    fetchGlobalConfigs();
  }, []);

  // Fetch full languages and regions directly or via an API endpoint. 
  // Below we use standard comprehensive language & region mappings to ensure everything works instantly without extra server endpoints:
  useEffect(() => {
    // Populate full ISO languages natively
    const allLangs: Option[] = [
      { id: 'en', name: 'English' }, { id: 'es', name: 'Spanish' }, { id: 'fr', name: 'French' },
      { id: 'de', name: 'German' }, { id: 'it', name: 'Italian' }, { id: 'ja', name: 'Japanese' },
      { id: 'ko', name: 'Korean' }, { id: 'zh', name: 'Chinese' }, { id: 'hi', name: 'Hindi' },
      { id: 'ta', name: 'Tamil' }, { id: 'te', name: 'Telugu' }, { id: 'ml', name: 'Malayalam' },
      { id: 'kn', name: 'Kannada' }, { id: 'mr', name: 'Marathi' }, { id: 'bn', name: 'Bengali' },
      { id: 'pa', name: 'Punjabi' }, { id: 'ru', name: 'Russian' }, { id: 'pt', name: 'Portuguese' },
      { id: 'ar', name: 'Arabic' }, { id: 'fa', name: 'Persian' }, { id: 'tr', name: 'Turkish' },
      { id: 'vi', name: 'Vietnamese' }, { id: 'th', name: 'Thai' }, { id: 'id', name: 'Indonesian' },
      { id: 'nl', name: 'Dutch' }, { id: 'pl', name: 'Polish' }, { id: 'uk', name: 'Ukrainian' },
      { id: 'sv', name: 'Swedish' }, { id: 'no', name: 'Norwegian' }, { id: 'fi', name: 'Finnish' },
      { id: 'da', name: 'Danish' }, { id: 'el', name: 'Greek' }, { id: 'he', name: 'Hebrew' },
    ];
    setLanguagesList(allLangs);

    const allRegions: Option[] = [
      { id: 'US', name: 'United States' }, { id: 'IN', name: 'India' }, { id: 'GB', name: 'United Kingdom' },
      { id: 'CA', name: 'Canada' }, { id: 'AU', name: 'Australia' }, { id: 'FR', name: 'France' },
      { id: 'DE', name: 'Germany' }, { id: 'JP', name: 'Japan' }, { id: 'KR', name: 'South Korea' },
      { id: 'CN', name: 'China' }, { id: 'BR', name: 'Brazil' }, { id: 'MX', name: 'Mexico' },
      { id: 'ES', name: 'Spain' }, { id: 'IT', name: 'Italy' }, { id: 'RU', name: 'Russia' },
    ];
    setRegionsList(allRegions);
  }, []);

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
    { id: '12', name: 'Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '99', name: 'Documentary' },
    { id: '18', name: 'Drama' },
    { id: '10751', name: 'Family' },
    { id: '14', name: 'Fantasy' },
    { id: '36', name: 'History' },
    { id: '27', name: 'Horror' },
    { id: '10402', name: 'Music' },
    { id: '9648', name: 'Mystery' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Science Fiction' },
    { id: '53', name: 'Thriller' },
    { id: '10752', name: 'War' },
    { id: '37', name: 'Western' },
  ];

  const sorts = [
    { id: 'popularity.desc', name: 'Popularity' },
    { id: 'vote_average.desc', name: 'Top Rated' },
    { id: 'primary_release_date.desc', name: 'Latest' },
    { id: 'revenue.desc', name: 'Revenue' },
  ];

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
            {languagesList.map(l => <option key={l.id} value={l.id} className="bg-ink-raised">{l.name}</option>)}
          </select>

          {/* Region Filter */}
          <select
            value={region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
            className={selectClass}
          >
            <option value="" className="bg-ink-raised">All Regions</option>
            {regionsList.map(r => <option key={r.id} value={r.id} className="bg-ink-raised">{r.name}</option>)}
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
