"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

interface Option {
  id: string;
  name: string;
}

const GENRES = [
  { id: "", name: "All Genres" },
  { id: "28", name: "Action" },
  { id: "12", name: "Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "14", name: "Fantasy" },
  { id: "36", name: "History" },
  { id: "27", name: "Horror" },
  { id: "10402", name: "Music" },
  { id: "9648", name: "Mystery" },
  { id: "10749", name: "Romance" },
  { id: "878", name: "Sci-Fi" },
  { id: "53", name: "Thriller" },
  { id: "10752", name: "War" },
  { id: "37", name: "Western" },
];

const SORTS = [
  { id: "popularity.desc", name: "Most Popular" },
  { id: "vote_average.desc", name: "Top Rated" },
  { id: "primary_release_date.desc", name: "Recently Released" },
  { id: "revenue.desc", name: "Box Office" },
];

const STATIC_LANGS: Option[] = [
  { id: "en", name: "English" },
  { id: "ta", name: "Tamil" },
  { id: "te", name: "Telugu" },
  { id: "hi", name: "Hindi" },
  { id: "ko", name: "Korean" },
  { id: "ja", name: "Japanese" },
  { id: "es", name: "Spanish" },
  { id: "fr", name: "French" },
  { id: "de", name: "German" },
  { id: "it", name: "Italian" },
  { id: "zh", name: "Chinese" },
];

const STATIC_REGIONS: Option[] = [
  { id: "US", name: "United States" },
  { id: "IN", name: "India" },
  { id: "GB", name: "United Kingdom" },
  { id: "CA", name: "Canada" },
  { id: "AU", name: "Australia" },
  { id: "FR", name: "France" },
  { id: "DE", name: "Germany" },
  { id: "JP", name: "Japan" },
  { id: "KR", name: "South Korea" },
];

export default function Filters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentGenre = searchParams.get("genre") || "";
  const currentLanguage = searchParams.get("language") || "en";
  const currentRegion = searchParams.get("region") || "";
  const currentSort = searchParams.get("sort") || "popularity.desc";
  const currentYear = searchParams.get("year") || "";
  const currentActor = searchParams.get("with_people") || "";

  const [genre, setGenre] = useState(currentGenre);
  const [language, setLanguage] = useState(currentLanguage);
  const [region, setRegion] = useState(currentRegion);
  const [sort, setSort] = useState(currentSort);
  const [year, setYear] = useState(currentYear);
  const [actor, setActor] = useState(currentActor);
  const [actorsList, setActorsList] = useState<Option[]>([]);

  const hasActiveFilters = Boolean(
    genre || (language && language !== "en") || region || year || actor || (sort && sort !== "popularity.desc")
  );

  useEffect(() => {
    setGenre(currentGenre);
    setLanguage(currentLanguage);
    setRegion(currentRegion);
    setSort(currentSort);
    setYear(currentYear);
    setActor(currentActor);
  }, [currentGenre, currentLanguage, currentRegion, currentSort, currentYear, currentActor]);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const res = await fetch(`/api/actors?language=${language}`);
        if (!res.ok) return;
        const data = await res.json();
        setActorsList(data.actors || []);
      } catch (e) {
        setActorsList([]);
      }
    };
    fetchActors();
  }, [language]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set("page", "1");
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    const query = createQueryString(name, value);
    router.push(`${pathname}?${query}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  const years: Option[] = [];
  const currentYearNum = new Date().getFullYear();
  for (let i = currentYearNum; i >= 1970; i--) {
    years.push({ id: String(i), name: String(i) });
  }

  const selectWrapper = "relative flex-1 min-w-[130px] sm:min-w-[145px]";
  const selectStyle =
    "w-full appearance-none bg-ink/70 hover:bg-ink text-paper text-xs sm:text-sm font-medium rounded-lg px-3.5 py-2.5 pr-8 border border-ink-line hover:border-marquee/40 focus:border-marquee focus:outline-none transition-all shadow-inner cursor-pointer";

  return (
    <div className="w-full bg-ink-raised/90 backdrop-blur-xl border-y border-ink-line py-3 px-4 sm:px-6 lg:px-8 shadow-xl">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Horizontal Scrolling Filter Inputs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide flex-1">
          
          {/* Genre */}
          <div className={selectWrapper}>
            <select
              aria-label="Filter by Genre"
              value={genre}
              onChange={(e) => handleFilterChange("genre", e.target.value)}
              className={selectStyle}
            >
              {GENRES.map((g) => (
                <option key={g.id} value={g.id} className="bg-ink-raised text-paper">
                  {g.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-paper-dim">
              ▾
            </div>
          </div>

          {/* Language */}
          <div className={selectWrapper}>
            <select
              aria-label="Filter by Language"
              value={language}
              onChange={(e) => handleFilterChange("language", e.target.value)}
              className={selectStyle}
            >
              {STATIC_LANGS.map((l) => (
                <option key={l.id} value={l.id} className="bg-ink-raised text-paper">
                  {l.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-paper-dim">
              ▾
            </div>
          </div>

          {/* Region */}
          <div className={selectWrapper}>
            <select
              aria-label="Filter by Region"
              value={region}
              onChange={(e) => handleFilterChange("region", e.target.value)}
              className={selectStyle}
            >
              <option value="" className="bg-ink-raised text-paper">All Regions</option>
              {STATIC_REGIONS.map((r) => (
                <option key={r.id} value={r.id} className="bg-ink-raised text-paper">
                  {r.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-paper-dim">
              ▾
            </div>
          </div>

          {/* Year */}
          <div className={selectWrapper}>
            <select
              aria-label="Filter by Year"
              value={year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              className={selectStyle}
            >
              <option value="" className="bg-ink-raised text-paper">All Years</option>
              {years.map((y) => (
                <option key={y.id} value={y.id} className="bg-ink-raised text-paper">
                  {y.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-paper-dim">
              ▾
            </div>
          </div>

          {/* Actor */}
          <div className={selectWrapper}>
            <select
              aria-label="Filter by Actor"
              value={actor}
              disabled={actorsList.length === 0}
              onChange={(e) => handleFilterChange("with_people", e.target.value)}
              className={`${selectStyle} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <option value="" className="bg-ink-raised text-paper">
                {actorsList.length > 0 ? "Featured Actors" : "No Cast Data"}
              </option>
              {actorsList.map((a) => (
                <option key={a.id} value={a.id} className="bg-ink-raised text-paper">
                  {a.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-paper-dim">
              ▾
            </div>
          </div>

          {/* Sort */}
          <div className={selectWrapper}>
            <select
              aria-label="Sort Results"
              value={sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className={selectStyle}
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id} className="bg-ink-raised text-paper">
                  {s.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-paper-dim">
              ▾
            </div>
          </div>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="self-end md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono tracking-wider text-reel-rose hover:bg-reel-rose/10 border border-reel-rose/30 transition-colors whitespace-nowrap"
          >
            ✕ Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
