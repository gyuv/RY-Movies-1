// app/series/page.tsx
import { Suspense } from 'react';
import MoviesSection from '../components/MoviesSection';
import Pagination from '../components/Pagination';
import SectionFilters from '../components/SectionFilters';

const MOCK_SHOW = {
  id: 199, title: "Mock Series", poster_path: "/9lH0V6e4b4w8r5k6j7h8g9f0d1s2a3.jpg",
  vote_average: 8.2, release_date: "2023-01-01",
};
const MOCK_LIST = Array(20).fill(MOCK_SHOW).map((m, i) => ({ ...m, id: i + 1, media_type: 'tv' }));

async function getSeries(
  page: number,
  sort: string,
  genre: string,
  year: string,
  language: string,
) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return { results: MOCK_LIST, total_pages: 1, total_results: 20 };

  // discover/tv sort keys differ slightly from movie.
  const sortMap: Record<string, string> = {
    'primary_release_date.desc': 'first_air_date.desc',
    'revenue.desc': 'popularity.desc',
  };
  const tvSort = sortMap[sort] || sort;

  const params = new URLSearchParams({
    api_key: apiKey,
    sort_by: tvSort,
    page: String(page),
    language: 'en-US',
    'first_air_date.lte': new Date().toISOString().split('T')[0],
  });
  if (genre) params.set('with_genres', genre);
  if (year) params.set('first_air_date_year', year);
  if (language) params.set('with_original_language', language);
  if (sort === 'vote_average.desc') params.set('vote_count.gte', '50'); // avoid junk

  try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/tv?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { results: MOCK_LIST, total_pages: 1 };
    const data = await res.json();

    const results = (data.results || [])
      .filter((s: any) => s.poster_path)
      .map((show: any) => ({
        id: show.id,
        title: show.name,
        poster_path: show.poster_path,
        vote_average: show.vote_average,
        release_date: show.first_air_date,
        media_type: 'tv',
      }));

    return { results, total_pages: data.total_pages, total_results: data.total_results };
  } catch {
    return { results: MOCK_LIST, total_pages: 1 };
  }
}

// TV genre ids (differ from movie in a few slots).
const TV_GENRES = [
  { label: 'Action & Adventure', value: '10759' },
  { label: 'Animation', value: '16' },
  { label: 'Comedy', value: '35' },
  { label: 'Crime', value: '80' },
  { label: 'Documentary', value: '99' },
  { label: 'Drama', value: '18' },
  { label: 'Family', value: '10751' },
  { label: 'Kids', value: '10762' },
  { label: 'Mystery', value: '9648' },
  { label: 'Reality', value: '10764' },
  { label: 'Sci-Fi & Fantasy', value: '10765' },
  { label: 'War & Politics', value: '10768' },
];

const LANGUAGES = [
  { label: 'English', value: 'en' }, { label: 'Korean', value: 'ko' }, { label: 'Japanese', value: 'ja' },
  { label: 'Spanish', value: 'es' }, { label: 'Hindi', value: 'hi' }, { label: 'Tamil', value: 'ta' },
  { label: 'Telugu', value: 'te' }, { label: 'French', value: 'fr' }, { label: 'German', value: 'de' },
  { label: 'Chinese', value: 'zh' }, { label: 'Turkish', value: 'tr' },
];

export default async function SeriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams?.page) || 1;
  const sort = (searchParams?.sort as string) || 'popularity.desc';
  const genre = (searchParams?.genre as string) || '';
  const year = (searchParams?.year as string) || '';
  const language = (searchParams?.language as string) || '';

  const data = await getSeries(page, sort, genre, year, language);

  const sortOptions = [
    { label: 'Most Popular', value: 'popularity.desc' },
    { label: 'Highest Rated', value: 'vote_average.desc' },
    { label: 'Newest', value: 'primary_release_date.desc' },
  ];
  const yearOptions = Array.from({ length: 40 }, (_, i) => {
    const yr = new Date().getFullYear() - i;
    return { label: yr.toString(), value: yr.toString() };
  });

  return (
    <main className="min-h-screen bg-apex-void text-paper">
      <div className="mx-auto max-w-[1600px] py-10">
        <div className="mb-6 px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.42em] text-apex-cyan/80">Browse</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white sm:text-4xl">Series</h1>
          <p className="mt-2 text-sm text-white/45">
            {data.total_results ? `${data.total_results.toLocaleString()} titles` : 'Explore television & streaming series'}
          </p>
        </div>

        <Suspense fallback={<div className="mb-8 px-4 sm:px-6 lg:px-8"><div className="apex-skeleton h-16 rounded-2xl" /></div>}>
          <SectionFilters
            sortOptions={sortOptions}
            extraOptions={[
              { name: 'genre', label: 'Genre', options: TV_GENRES },
              { name: 'language', label: 'Language', options: LANGUAGES },
              { name: 'year', label: 'Year', options: yearOptions },
            ]}
          />
        </Suspense>

        <MoviesSection movies={data.results || []} />

        {data.total_pages > 1 && (
          <Pagination currentPage={page} totalPages={Math.min(data.total_pages, 500)} />
        )}
      </div>
    </main>
  );
}
