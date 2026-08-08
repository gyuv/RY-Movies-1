import MoviesSection from '../components/MoviesSection';
import Pagination from '../components/Pagination';
import SectionFilters from '../components/SectionFilters';

const MOCK_MOVIE = {
  id: 99, title: "Mock Movie", poster_path: "/9lH0V6e4b4w8r5k6j7h8g9f0d1s2a3.jpg",
  vote_average: 8.5, release_date: "2023-01-01",
};
const MOCK_LIST = Array(20).fill(MOCK_MOVIE).map((m, i) => ({ ...m, id: i + 1 }));

async function getMovies(page: number, sort: string) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return { results: MOCK_LIST, total_pages: 1 };

  const params = new URLSearchParams({
    api_key: apiKey,
    sort_by: sort,
    page: String(page),
    language: 'en-US',
    'primary_release_date.lte': new Date().toISOString().split('T')[0],
  });

  try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params}`, {
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
  const data = await getMovies(page, sort);

  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="max-w-[1600px] mx-auto py-10">
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-paper section-heading">
            Movies
          </h1>
          <p className="stub-label mt-2">
            {data.total_results ? `${data.total_results.toLocaleString()} titles` : ''}
          </p>
        </div>

        <MoviesSection movies={data.results || []} />

        {data.total_pages > 1 && (
          <Pagination currentPage={page} totalPages={Math.min(data.total_pages, 500)} />
        )}
      </div>
    </main>
  );
}
