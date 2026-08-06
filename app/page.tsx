import Filters from './components/Filters';
import MovieGrid from './components/MovieGrid';
import { Suspense } from 'react';

// --- API Fetcher ---

async function getMovies(filters: { genre: string; year: string; language: string; sort: string }, page: number = 1) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
  if (!apiKey) return { results: [], total_pages: 1 };

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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {[...Array(18)].map((_, i) => (
        <div key={i} className="aspect-[2/3] glass-card rounded-2xl animate-pulse" />
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
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#0a0b10]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-pink-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="pt-8 pb-4 px-4 md:px-8 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 animate-fade-in-up">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Cine<span className="text-gradient">Reel</span>
            </h1>
          </div>
        </header>

        {/* Filters */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Filters />
        </div>

        {/* Content */}
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pb-20">
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-xl font-medium text-white/80">
              {filters.language !== 'en' ? `${filters.language.toUpperCase()} Movies` : 'Explore Movies'}
            </h2>
            <p className="text-sm text-white/40 mt-1">
              {results.length} results found
            </p>
          </div>

          <Suspense fallback={<GridSkeleton />}>
            <MovieGrid movies={results} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}