import Filters from './components/Filters';
import MovieGrid from './components/MovieGrid';
import { Suspense } from 'react';

// --- API Fetcher ---

async function getMovies(filters: { genre: string; year: string; language: string; sort: string }, page: number = 1) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
  if (!apiKey) return { results: [], total_pages: 1 };

  // Build URL
  let baseUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=${filters.sort || 'popularity.desc'}&page=${page}`;

  if (filters.genre) baseUrl += `&with_genres=${filters.genre}`;
  if (filters.year) baseUrl += `&primary_release_year=${filters.year}`;
  if (filters.language) baseUrl += `&with_original_language=${filters.language}`;

  try {
    const res = await fetch(baseUrl, { 
      next: { revalidate: 3600 },
      cache: 'force-cache'
    });
    
    if (!res.ok) return { results: [], total_pages: 1 };
    const data = await res.json();
    return { 
      results: data.results || [], 
      total_pages: data.total_pages || 1 
    };
  } catch (e) {
    console.error("Fetch Error:", e);
    return { results: [], total_pages: 1 };
  }
}

// --- Loading Skeleton ---
function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="aspect-[2/3] bg-gray-800/50 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

// --- Main Page Component ---

export default async function Home({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  // Parse search params safely
  const genre = Array.isArray(searchParams.genre) ? searchParams.genre[0] : searchParams.genre;
  const year = Array.isArray(searchParams.year) ? searchParams.year[0] : searchParams.year;
  const language = Array.isArray(searchParams.language) ? searchParams.language[0] : searchParams.language;
  const sort = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort;
  const page = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;

  const filters = {
    genre: genre as string || "",
    year: year as string || "",
    language: language as string || "en",
    sort: sort as string || "popularity.desc"
  };

  const pageNum = page ? parseInt(page as string, 10) : 1;
  const { results, total_pages } = await getMovies(filters, pageNum);

  return (
    <main className="min-h-screen bg-[#0f1014] text-white">
      {/* Background Gradient Effect */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-4 md:p-6 flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Cinereel
          </h1>
        </header>

        {/* Filters */}
        <Filters />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 pb-10">
          <Suspense fallback={<GridSkeleton />}>
            <MovieGrid movies={results} />
          </Suspense>

          {/* Simple Pagination Info */}
          <div className="mt-10 text-center text-gray-500 text-sm">
            Showing {results.length} movies (Page {pageNum} of {total_pages})
          </div>
        </div>
      </div>
    </main>
  );
}