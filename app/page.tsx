import Link from 'next/link';
import Image from 'next/image';
import FilterBar from './components/FilterBar';
import Pagination from './components/Pagination';
import { Suspense } from 'react';

// --- API Fetchers ---

async function getMovies(page: number, filters: { genre?: string; year?: string; language?: string; sort_by?: string }) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
  if (!apiKey) {
    console.error("TMDB API Key missing");
    return { results: [], total_pages: 1, page: 1 };
  }

  let baseUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=${filters.sort_by || 'popularity.desc'}&page=${page}`;

  if (filters.genre) baseUrl += `&with_genres=${filters.genre}`;
  if (filters.year) baseUrl += `&primary_release_year=${filters.year}`;
  if (filters.language) baseUrl += `&with_original_language=${filters.language}`;

  try {
    const res = await fetch(baseUrl, { 
      next: { revalidate: 3600 },
      cache: 'force-cache'
    });
    
    if (!res.ok) {
      console.error("TMDB API Error:", res.status, res.statusText);
      return { results: [], total_pages: 1, page: 1 };
    }

    const data = await res.json();
    return { 
      results: data.results || [], 
      total_pages: data.total_pages || 1, 
      page: data.page || 1 
    };
  } catch (e) {
    console.error("Fetch Error:", e);
    return { results: [], total_pages: 1, page: 1 };
  }
}

function MovieGrid({ movies }: { movies: any[] }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="col-span-full text-center py-20">
        <p className="text-gray-400 text-lg">No movies found.</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {movies.map((movie: any) => (
        <Link 
          key={movie.id} 
          href={`/media/${movie.id}`} 
          className="group relative block aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 transition-transform hover:scale-105 hover:shadow-xl hover:shadow-black/50"
        >
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs p-2 text-center italic bg-gray-700">
              {movie.title || "Untitled"}
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
            <p className="text-white font-bold text-sm truncate">{movie.title}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-yellow-400 text-xs">★ {movie.vote_average?.toFixed(1) || "N/A"}</span>
              <span className="text-gray-300 text-xs">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : "TBD"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// --- Main Page Component ---

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // Safely parse page number
  const pageParam = Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page;
  const page = pageParam ? Math.max(1, Number(pageParam)) : 1;
  
  const genre = Array.isArray(searchParams.genre) ? searchParams.genre[0] : searchParams.genre;
  const year = Array.isArray(searchParams.year) ? searchParams.year[0] : searchParams.year;
  const language = Array.isArray(searchParams.language) ? searchParams.language[0] : searchParams.language;
  const sort_by = Array.isArray(searchParams.sort_by) ? searchParams.sort_by[0] : searchParams.sort_by;

  const { results, total_pages } = await getMovies(page, { 
    genre: genre as string, 
    year: year as string, 
    language: language as string, 
    sort_by: sort_by as string 
  });

  return (
    <main className="min-h-screen bg-ink text-paper p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Cinereel</h1>
        
        {/* Client-Side Filter Bar */}
        <FilterBar />

        {/* Movie Grid */}
        <Suspense fallback={
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        }>
          <MovieGrid movies={results} />
        </Suspense>

        {/* Pagination - Now a Client Component, safe to use window */}
        <Pagination currentPage={page} totalPages={total_pages} />
      </div>
    </main>
  );
}
