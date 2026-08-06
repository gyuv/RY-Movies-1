import Filters from './components/Filters';
import MoviesSection from './components/MoviesSection';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { Suspense } from 'react';

// Mock data for build stability
const MOCK_MOVIES = [
  { id: 1, title: "Movie 1", poster_path: null, vote_average: 8.5 },
  { id: 2, title: "Movie 2", poster_path: null, vote_average: 7.2 },
];

async function getMovies(page = 1, genre = "", language = "en", year = "", sort = "popularity.desc") {
  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (genre) params.set("with_genres", genre);
    if (year) params.set("primary_release_year", year);
    params.set("sort_by", sort);
    params.set("language", language);

    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&${params.toString()}`, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) return { results: MOCK_MOVIES, total_pages: 1, total_results: MOCK_MOVIES.length };
    
    const data = await res.json();
    return data;
  } catch (error) {
    return { results: MOCK_MOVIES, total_pages: 1, total_results: MOCK_MOVIES.length };
  }
}

async function getTrending() {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return { results: [] };
    return await res.json();
  } catch (error) {
    return { results: [] };
  }
}

export default async function Home({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const page = Number(searchParams?.page) || 1;
  const genre = searchParams?.genre || "";
  const language = searchParams?.language || "en";
  const year = searchParams?.year || "";
  const sort = searchParams?.sort || "popularity.desc";

  const [moviesData, trendingData] = await Promise.all([
    getMovies(page, genre, language, year, sort),
    getTrending()
  ]);

  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      <Hero />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={
          <div className="sticky top-0 z-50 glass-panel !border-none !bg-[#0a0b10]/80 backdrop-blur-2xl py-4 px-4 mb-8">
            <div className="max-w-[1600px] mx-auto space-y-4">
              <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
        }>
          <Filters />
        </Suspense>

        <MoviesSection movies={moviesData.results || MOCK_MOVIES} />
      </div>

      <Footer />
    </main>
  );
}