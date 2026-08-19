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

  const currentGenre = searchParams.get('genre') || '';
  const currentLanguage = searchParams.get('language') || 'en';
  const currentRegion = searchParams.get('region') || '';
  const currentSort = searchParams.get('sort') || 'popularity.desc';
  const currentYear = searchParams.get('year') || '';
  const currentActor = searchParams.get('with_people') || '';

  const [genre, setGenre] = useState(currentGenre);
  const [language, setLanguage] = useState(currentLanguage);
  const [region, setRegion] = useState(currentRegion);
  const [sort, setSort] = useState(currentSort);
  const [year, setYear] = useState(currentYear);
  const [actor, setActor] = useState(currentActor);
  
  const [languagesList, setLanguagesList] = useState<Option[]>([]);
  const [regionsList, setRegionsList] = useState<Option[]>([]);
  const [actorsList, setActorsList] = useState<Option[]>([]);

  useEffect(() => {
    setGenre(currentGenre);
    setLanguage(currentLanguage);
    setRegion(currentRegion);
    setSort(currentSort);
    setYear(currentYear);
    setActor(currentActor);
  }, [currentGenre, currentLanguage, currentRegion, currentSort, currentYear, currentActor]);

  useEffect(() => {
    const allLangs: Option[] = [
      { id: 'en', name: 'English' }, { id: 'es', name: 'Spanish' }, { id: 'fr', name: 'French' },
      { id: 'de', name: 'German' }, { id: 'it', name: 'Italian' }, { id: 'ja', name: 'Japanese' },
      { id: 'ko', name: 'Korean' }, { id: 'zh', name: 'Chinese' }, { id: 'hi', name: 'Hindi' },
      { id: 'ta', name: 'Tamil' }, { id: 'te', name: 'Telugu' }, { id: 'ml', name: 'Malayalam' },
      { id: 'kn', name: 'Kannada' }, { id: 'mr', name: 'Marathi' }, { id: 'bn', name: 'Bengali' }
    ];
    setLanguagesList(allLangs);

    const allRegions: Option[] = [
      { id: 'US', name: 'United States' }, { id: 'IN', name: 'India' }, { id: 'GB', name: 'United Kingdom' },
    ];
    setRegionsList(allRegions);
  }, []);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await fetch(`/api/actors?language=${language}`);
        const data = await res.json();
        setActorsList(data.actors || []);
      } catch (e) {
        // Fallback or ignore
      }
    };
    fetchActors();
    setActor('');
  }, [language]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(name, value);
      else params.delete(name);
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
    { id: '', name: 'All Genres' }, { id: '28', name: 'Action' }, { id: '12', name: 'Adventure' },
    { id: '16', name: 'Animation' }, { id: '35', name: 'Comedy' }, { id: '80', name: 'Crime' },
    { id: '18', name: 'Drama' }, { id: '14', name: 'Fantasy' }, { id: '27', name: 'Horror' },
    { id: '10749', name: 'Romance' }, { id: '878', name: 'Science Fiction' }, { id: '53', name: 'Thriller' }
  ];

  const sorts = [
    { id: 'popularity.desc', name: 'Popularity' },
    { id: 'vote_average.desc', name: 'Top Rated' },
    { id: 'primary_release_date.desc', name: 'Latest' }
  ];

  const years = [];
  const currentYearNum = new Date().getFullYear();
  for (let i = currentYearNum; i >= 1990; i--) {
    years.push({ id: String(i), name: String(i) });
  }

  const selectClass =
    "bg-black/80 text-white text-sm md:text-base rounded px-4 py-1.5 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-white transition-colors appearance-none cursor-pointer";
  const optionClass = "bg-[#141414] text-white";

  return (
    <div className="w-full px-4 sm:px-10 lg:px-14 py-4 flex flex-wrap gap-3 items-center">
      <select value={genre} onChange={(e) => handleFilterChange('genre', e.target.value)} className={selectClass}>
        {genres.map(g => <option key={g.id} value={g.id} className={optionClass}>{g.name}</option>)}
      </select>

      <select value={language} onChange={(e) => handleFilterChange('language', e.target.value)} className={selectClass}>
        {languagesList.map(l => <option key={l.id} value={l.id} className={optionClass}>{l.name}</option>)}
      </select>

      <select value={year} onChange={(e) => handleFilterChange('year', e.target.value)} className={selectClass}>
        <option value="" className={optionClass}>All Years</option>
        {years.map(y => <option key={y.id} value={y.id} className={optionClass}>{y.name}</option>)}
      </select>

      <select value={sort} onChange={(e) => handleFilterChange('sort', e.target.value)} className={selectClass}>
        {sorts.map(s => <option key={s.id} value={s.id} className={optionClass}>{s.name}</option>)}
      </select>
    </div>
  );
}
