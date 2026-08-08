// Save as: app/series/page.tsx
import MoviesSection from '../components/MoviesSection';
import Pagination from '../components/Pagination';

const MOCK_SHOW = {
  id: 199, title: "Mock Series", poster_path: "/9lH0V6e4b4w8r5k6j7h8g9f0d1s2a3.jpg",
  vote_average: 8.2, release_date: "2023-01-01",
};
const MOCK_LIST = Array(20).fill(MOCK_SHOW).map((m, i) => ({ ...m, id: i + 1 }));

async function getSeries(page: number, sort: string) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return { results: MOCK_LIST, total_pages: 1 };

  // discover/tv uses different sort keys than movie for a couple of fields;
  // popularity.desc / vote_average.desc carry over directly, "latest" maps
  // to first_air_date.desc.
  const sortMap: Record<string, string> = {
    'primary_release_date.desc': 'first_air_date.desc',
    'revenue.desc': 'popularity.desc', // TV has no revenue.desc in discover/tv
  };
  const tvSort = sortMap[sort] || sort;

  const params = new URLSearchParams({
    api_key: apiKey,
    sort_by: tvSort,
    page: String(page),
    language: 'en-US',
    'first_air_date.lte': new Date().toISOString().split('T')[0],
  });

  try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/tv?${params}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { results: MOCK_LIST, total_pages: 1 };
    const data = await res.json();

    // Normalize TV shape (name / first_air_date) to the movie shape
    // (title / release_date) so MoviesSection/MovieCard need no changes.
    const results = (data.results || []).map((show: any) => ({
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

export default async function SeriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams?.page) || 1;
  const sort = (searchParams?.sort as string) || 'popularity.desc';
  const data = await getSeries(page, sort);

  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="max-w-[1600px] mx-auto py-10">
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-paper section-heading">
            Series
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
