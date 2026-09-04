// Save as: app/movies/page.tsx
import { Suspense } from 'react';
import MoviesSection from '../components/MoviesSection';
import Pagination from '../components/Pagination';
import SectionFilters from '../components/SectionFilters';
import { SectionTitle } from '@/components/apex';

const MOCK_MOVIE = {
  id: 99, title: "Mock Movie", poster_path: "/9lH0V6e4b4w8r5k6j7h8g9f0d1s2a3.jpg",
  vote_average: 8.5, release_date: "2023-01-01",
};
const MOCK_LIST = Array(20).fill(MOCK_MOVIE).map((m, i) => ({ ...m, id: i + 1 }));

async function getMovies(page: number, sort: string, genre: string, year: string, language: string, region: string) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return { results: MOCK_LIST, total_pages: 1 };

  const params = new URLSearchParams({
    api_key: apiKey,
    sort_by: sort,
    page: String(page),
    language: 'en-US',
  });

  if (genre) params.append('with_genres', genre);
  if (year) params.append('primary_release_year', year);
  if (language) params.append('with_original_language', language);
  if (region) params.append('region', region);

  try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { results: MOCK_LIST, total_pages: 1 };
    return await res.json();
  } catch {
    return { results: MOCK_LIST, total_pages: 1 };
  }
}

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams?.page) || 1;
  const sort = (searchParams?.sort as string) || 'popularity.desc';
  const genre = (searchParams?.genre as string) || '';
  const year = (searchParams?.year as string) || '';
  const language = (searchParams?.language as string) || '';
  const region = (searchParams?.region as string) || '';

  const data = await getMovies(page, sort, genre, year, language, region);

  const sortOptions = [
    { label: 'Most Popular', value: 'popularity.desc' },
    { label: 'Highest Rated', value: 'vote_average.desc' },
    { label: 'Newest Releases', value: 'primary_release_date.desc' },
  ];

  const genreOptions = [
    { label: 'Action', value: '28' },
    { label: 'Adventure', value: '12' },
    { label: 'Animation', value: '16' },
    { label: 'Comedy', value: '35' },
    { label: 'Crime', value: '80' },
    { label: 'Documentary', value: '99' },
    { label: 'Drama', value: '18' },
    { label: 'Family', value: '10751' },
    { label: 'Fantasy', value: '14' },
    { label: 'History', value: '36' },
    { label: 'Horror', value: '27' },
    { label: 'Music', value: '10402' },
    { label: 'Mystery', value: '9648' },
    { label: 'Romance', value: '10749' },
    { label: 'Science Fiction', value: '878' },
    { label: 'Thriller', value: '53' },
    { label: 'War', value: '10752' },
    { label: 'Western', value: '37' },
  ];

  const languageOptions = [
    { label: 'English', value: 'en' }, { label: 'Spanish', value: 'es' }, { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' }, { label: 'Italian', value: 'it' }, { label: 'Japanese', value: 'ja' },
    { label: 'Korean', value: 'ko' }, { label: 'Chinese', value: 'zh' }, { label: 'Hindi', value: 'hi' },
    { label: 'Tamil', value: 'ta' }, { label: 'Telugu', value: 'te' }, { label: 'Malayalam', value: 'ml' },
    { label: 'Kannada', value: 'kn' }, { label: 'Marathi', value: 'mr' }, { label: 'Bengali', value: 'bn' },
  ];

  const regionOptions = [
    { label: 'United States', value: 'US' }, { label: 'India', value: 'IN' }, { label: 'United Kingdom', value: 'GB' },
    { label: 'Canada', value: 'CA' }, { label: 'Australia', value: 'AU' }, { label: 'France', value: 'FR' },
    { label: 'Germany', value: 'DE' }, { label: 'Japan', value: 'JP' }, { label: 'South Korea', value: 'KR' },
    { label: 'China', value: 'CN' }, { label: 'Brazil', value: 'BR' }, { label: 'Mexico', value: 'MX' },
  ];

  const yearOptions = Array.from({ length: 40 }, (_, i) => {
    const yr = new Date().getFullYear() - i;
    return { label: yr.toString(), value: yr.toString() };
  });

  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="max-w-[1600px] mx-auto py-10">
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          <SectionTitle kicker="Browse" title="Movies" size="lg" as="h1" />
          <p className="mt-3 text-sm text-white/45">
            {data.total_results ? `${data.total_results.toLocaleString()} titles` : 'Discover films across every language & genre'}
          </p>
        </div>

        <Suspense fallback={
          <div className="flex items-center gap-4 mb-8 px-4 sm:px-6 lg:px-8">
            <div className="h-9 w-48 bg-ink-raised border border-ink-line rounded-md animate-pulse" />
          </div>
        }>
          <SectionFilters
            sortOptions={sortOptions}
            extraOptions={[
              { name: 'genre', label: 'Genre', options: genreOptions },
              { name: 'language', label: 'Language', options: languageOptions },
              { name: 'region', label: 'Region', options: regionOptions },
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
