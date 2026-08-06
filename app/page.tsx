import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';

// --- API Fetchers ---

async function getGenres() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
  if (!apiKey) return [];
  try {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`, { next: { revalidate: 86400 } });
    const data = await res.json();
    return data.genres;
  } catch (e) { return []; }
}

async function getMovies(page: number, filters: { genre?: string; year?: string; language?: string; sort_by?: string }) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
  if (!apiKey) return { results: [], total_pages: 1, page: 1 };

  let baseUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${page}&sort_by=${filters.sort_by || 'popularity.desc'}`;

  if (filters.genre) baseUrl += `&with_genres=${filters.genre}`;
  if (filters.year) baseUrl += `&primary_release_year=${filters.year}`;
  if (filters.language) baseUrl += `&with_original_language=${filters.language}`;
  
  // Limit to 20 per page for performance
  baseUrl += '&page=' + page;

  try {
    const res = await fetch(baseUrl, { next: { revalidate: 3600 } });
    const data = await res.json();
    return { results: data.results, total_pages: data.total_pages, page: data.page };
  } catch (e) { return { results: [], total_pages: 1, page: 1 }; }
}

// --- UI Components ---

function MovieGrid({ movies }: { movies: any[] }) {
  if (movies.length === 0) {
    return <p className="text-gray-400 col-span-full">No movies found.</p>;
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
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs p-2 text-center italic">
              {movie.title}
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
            <p className="text-white font-bold text-sm truncate">{movie.title}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-yellow-400 text-xs">★ {movie.vote_average?.toFixed(1)}</span>
              <span className="text-gray-300 text-xs">{new Date(movie.release_date).getFullYear()}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function Pagination({ currentPage, totalPages, baseUrl }: { currentPage: number; totalPages: number; baseUrl: string }) {
  const pages = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1);
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  const actualPages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8 mb-4">
      {currentPage > 1 && (
        <Link href={`${baseUrl}&page=${currentPage - 1}`} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm text-white">
          Prev
        </Link>
      )}
      
      {actualPages.map(p => (
        <Link 
          key={p} 
          href={`${baseUrl}&page=${p}`} 
          className={`px-3 py-1 rounded text-sm ${p === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'}`}
        >
          {p}
        </Link>
      ))}
      
      {currentPage < totalPages && (
        <Link href={`${baseUrl}&page=${currentPage + 1}`} className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm text-white">
          Next
        </Link>
      )}
    </div>
  );
}

// --- Main Page Component ---

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const page = Number(searchParams.page) || 1;
  const genre = searchParams.genre as string;
  const year = searchParams.year as string;
  const language = searchParams.language as string;
  const sort_by = searchParams.sort_by as string;

  const genres = await getGenres();
  const { results, total_pages } = await getMovies(page, { genre, year, language, sort_by });

  // Construct base URL for pagination preserving filters
  const params = new URLSearchParams();
  if (genre) params.set('genre', genre);
  if (year) params.set('year', year);
  if (language) params.set('language', language);
  if (sort_by) params.set('sort_by', sort_by);
  const baseUrl = `/?${params.toString()}`;

  return (
    <main className="min-h-screen bg-ink text-paper p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Cinereel</h1>
        
        {/* Filters Bar */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-gray-400 mb-1">Genre</label>
            <select 
              className="w-full bg-gray-800 text-white text-sm rounded p-2 border border-gray-700 focus:outline-none focus:border-blue-500"
              onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.value) url.searchParams.set('genre', e.target.value);
                else url.searchParams.delete('genre');
                url.searchParams.delete('page');
                window.location.href = url.toString();
              }}
              defaultValue=""
            >
              <option value="">All Genres</option>
              {genres.map((g: any) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs text-gray-400 mb-1">Year</label>
            <select 
              className="w-full bg-gray-800 text-white text-sm rounded p-2 border border-gray-700 focus:outline-none focus:border-blue-500"
              onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.value) url.searchParams.set('year', e.target.value);
                else url.searchParams.delete('year');
                url.searchParams.delete('page');
                window.location.href = url.toString();
              }}
              defaultValue=""
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs text-gray-400 mb-1">Language</label>
            <select 
              className="w-full bg-gray-800 text-white text-sm rounded p-2 border border-gray-700 focus:outline-none focus:border-blue-500"
              onChange={(e) => {
                const url = new URL(window.location.href);
                if (e.target.value) url.searchParams.set('language', e.target.value);
                else url.searchParams.delete('language');
                url.searchParams.delete('page');
                window.location.href = url.toString();
              }}
              defaultValue=""
            >
              <option value="">All Languages</option>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="hi">Hindi</option>
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs text-gray-400 mb-1">Sort By</label>
            <select 
              className="w-full bg-gray-800 text-white text-sm rounded p-2 border border-gray-700 focus:outline-none focus:border-blue-500"
              onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set('sort_by', e.target.value);
                url.searchParams.delete('page');
                window.location.href = url.toString();
              }}
              defaultValue="popularity.desc"
            >
              <option value="popularity.desc">Popular</option>
              <option value="vote_average.desc">Top Rated</option>
              <option value="release_date.desc">Newest</option>
              <option value="title.asc">A-Z</option>
            </select>
          </div>
        </div>

        {/* Movie Grid */}
        <Suspense fallback={<div className="text-center text-gray-400 py-10">Loading movies...</div>}>
          <MovieGrid movies={results} />
        </Suspense>

        {/* Pagination */}
        <Pagination currentPage={page} totalPages={total_pages} baseUrl={baseUrl} />
      </div>
    </main>
  );
}
