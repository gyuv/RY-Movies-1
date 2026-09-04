import { Suspense } from 'react';
import MediaCard from '../../components/MediaCard';
import SectionFilters from '../../components/SectionFilters';
import Pagination from '../../components/Pagination';
import { SectionTitle } from '@/components/apex';

// 🔑 API Configuration
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  original_language: string;
  release_date: string;
  popularity: number;
}

// Curated erotic/sensual keyword ids (OR-joined — commas would mean AND).
const EROTIC_KEYWORDS =
  '1009,1493,1896,2123,11836,12295,17165,17664,20594,23038,25463,27047,2924,2926,3213,3603,4365,4607,5451,5991,6622,7236,7755,8093,9303,190370,262247';

interface FetchParams {
  page: number;
  sort: string;
  language: string;
  year: string;
}

interface FetchResult {
  results: Movie[];
  total_pages: number;
  total_results: number;
}

/**
 * Paginated, filterable discovery over TMDB.
 * NOTE: TMDB treats commas in with_keywords as AND and the pipe `|` as OR —
 * we OR-join so the collection is broad, then apply the user's filters.
 */
async function fetchEroticContent({ page, sort, language, year }: FetchParams): Promise<FetchResult> {
  if (!TMDB_API_KEY) return { results: [], total_pages: 0, total_results: 0 };

  const keywordsOR = EROTIC_KEYWORDS.split(',').join('|');
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY,
    with_keywords: keywordsOR,
    sort_by: sort,
    include_adult: 'true',
    include_video: 'false',
    'vote_count.gte': sort === 'vote_average.desc' ? '20' : '1',
    page: String(page),
  });
  if (language) params.set('with_original_language', language);
  if (year) params.set('primary_release_year', year);

  try {
    const res = await fetch(`${BASE_URL}/discover/movie?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { results: [], total_pages: 0, total_results: 0 };
    const data = await res.json();
    const results: Movie[] = (data.results || []).filter((m: Movie) => m.poster_path);
    return {
      results,
      total_pages: Math.min(data.total_pages || 1, 500),
      total_results: data.total_results || results.length,
    };
  } catch {
    return { results: [], total_pages: 0, total_results: 0 };
  }
}

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popularity.desc' },
  { label: 'Highest Rated', value: 'vote_average.desc' },
  { label: 'Newest', value: 'primary_release_date.desc' },
  { label: 'Trending Titles', value: 'revenue.desc' },
];

const LANGUAGE_OPTIONS = [
  { label: 'English', value: 'en' }, { label: 'Korean', value: 'ko' }, { label: 'Japanese', value: 'ja' },
  { label: 'French', value: 'fr' }, { label: 'Spanish', value: 'es' }, { label: 'Italian', value: 'it' },
  { label: 'German', value: 'de' }, { label: 'Thai', value: 'th' }, { label: 'Hindi', value: 'hi' },
  { label: 'Chinese', value: 'zh' }, { label: 'Polish', value: 'pl' }, { label: 'Russian', value: 'ru' },
];

const YEAR_OPTIONS = Array.from({ length: 45 }, (_, i) => {
  const yr = new Date().getFullYear() - i;
  return { label: yr.toString(), value: yr.toString() };
});

export default async function EroticPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams?.page) || 1;
  const sort = (searchParams?.sort as string) || 'popularity.desc';
  const language = (searchParams?.language as string) || '';
  const year = (searchParams?.year as string) || '';

  const data = await fetchEroticContent({ page, sort, language, year });

  return (
    <main className="min-h-screen bg-apex-void text-paper">
      <div className="mx-auto max-w-[1600px] py-10">
        {/* Premium header */}
        <div className="mb-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <SectionTitle kicker="Adults Only" title="Erotic" size="lg" as="h1" />
            <span className="mt-6 rounded-md border border-marquee/50 bg-marquee/10 px-2 py-0.5 text-[11px] font-bold tracking-wider text-marquee">
              18+
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-white/50">
            {data.total_results
              ? `${data.total_results.toLocaleString()} titles · sensual thrillers, romance & drama for mature audiences. Viewer discretion advised.`
              : 'Sensual thrillers, romance and drama for mature audiences. Viewer discretion advised.'}
          </p>
        </div>

        {/* Filters */}
        <Suspense fallback={<div className="mb-8 px-4 sm:px-6 lg:px-8"><div className="apex-skeleton h-16 rounded-2xl" /></div>}>
          <SectionFilters
            sortOptions={SORT_OPTIONS}
            extraOptions={[
              { name: 'language', label: 'Language', options: LANGUAGE_OPTIONS },
              { name: 'year', label: 'Year', options: YEAR_OPTIONS },
            ]}
          />
        </Suspense>

        {data.results.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
            <div className="mb-4 h-16 w-16 text-ink-line">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="mb-2 font-heading text-xl font-semibold text-white">No titles match these filters</h3>
            <p className="max-w-md text-sm text-white/45">
              Try clearing the language or year filter. (TMDB API key: {TMDB_API_KEY ? 'loaded' : 'missing'}.)
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:gap-5 sm:px-6 md:grid-cols-4 lg:grid-cols-5 lg:gap-6 lg:px-8 xl:grid-cols-6 2xl:grid-cols-7">
              {data.results.map((movie, i) => (
                <div key={movie.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
                  <MediaCard
                    id={movie.id}
                    title={movie.title}
                    poster_path={movie.poster_path}
                    vote_average={movie.vote_average}
                    release_date={movie.release_date}
                    media_type="movie"
                  />
                </div>
              ))}
            </div>

            {data.total_pages > 1 && (
              <div className="mt-10">
                <Pagination currentPage={page} totalPages={data.total_pages} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
