import Filters from './components/Filters';
import MoviesSection from './components/MoviesSection';
import Hero from './components/Hero';
import Footer from './components/Footer';
import MovieCarousel from './components/MovieCarousel';
import { Suspense } from 'react';

// Mock data for build stability if API fails or key is missing
const MOCK_MOVIE = { 
  id: 99, 
  title: "Mock Movie", 
  poster_path: "/9lH0V6e4b4w8r5k6j7h8g9f0d1s2a3.jpg", 
  vote_average: 8.5, 
  release_date: "2023-01-01",
  overview: "A mock movie overview for testing purposes."
};

const MOCK_LIST = Array(10).fill(MOCK_MOVIE).map((m, i) => ({ ...m, id: i + 1 }));

// Helper to safely fetch from TMDB
async function fetchTMDB(url: string, apiKey: string | undefined) {
  if (!apiKey) {
    console.log("TMDB_API_KEY is missing, using mock data");
    return { results: MOCK_LIST };
  }
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`TMDB Fetch Error: ${res.status} for ${url}`);
      return { results: MOCK_LIST };
    }
    return await res.json();
  } catch (e) {
    console.error("TMDB Fetch Exception:", e);
    return { results: MOCK_LIST };
  }
}

// Fetch movies for a specific language with optional sorting
async function getLanguageMovies(language: string, sort: string = 'popularity.desc', limit: number = 20) {
  const apiKey = process.env.TMDB_API_KEY;
  const params = new URLSearchParams();
  params.set("with_original_language", language);
  params.set("sort_by", sort);
  params.set("page", "1");
  const today = new Date().toISOString().split('T')[0];
  params.set("primary_release_date.gte", "1900-01-01");
  params.set("primary_release_date.lte", today);
  params.set("language", "en-US");
  
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${params.toString()}`;
  const data = await fetchTMDB(url, apiKey);
  return data.results?.slice(0, limit) || [];
}

// Fetch trending movies globally
async function getTrendingMovies() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return MOCK_LIST;
  try {
    const url = "https://api.themoviedb.org/3/trending/movie/week?api_key=" + apiKey + "&language=en-US";
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return MOCK_LIST;
    const data = await res.json();
    return data.results || MOCK_LIST;
  } catch (e) {
    return MOCK_LIST;
  }
}

export default async function Home({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const getParam = (key: string, def: string = "") => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : (v || def);
  };

  const page = Number(searchParams?.page) || 1;
  const genre = getParam("genre", "");
  const language = getParam("language", "en");
  const sort = getParam("sort", "popularity.desc");

  // If filters are applied, show the filtered list as the main content
  const hasFilters = genre || language !== 'en' || sort !== 'popularity.desc';

  let filteredData = null;
  let trendingData = null;
  let englishMovies = null;
  let tamilMovies = null;
  let teluguMovies = null;
  let hindiMovies = null;
  let koreanMovies = null;
  let japaneseMovies = null;

  if (hasFilters) {
    // Fetch filtered data
    const apiKey = process.env.TMDB_API_KEY;
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (genre) params.set("with_genres", genre);
    params.set("with_original_language", language);
    params.set("sort_by", sort);
    const today = new Date().toISOString().split('T')[0];
    params.set("primary_release_date.gte", "1900-01-01");
    params.set("primary_release_date.lte", today);
    
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${params.toString()}`;
    filteredData = await fetchTMDB(url, apiKey);
  } else {
    // Fetch all sections for the homepage
    [
      trendingData,
      englishMovies,
      tamilMovies,
      teluguMovies,
      hindiMovies,
      koreanMovies,
      japaneseMovies
    ] = await Promise.all([
      getTrendingMovies(),
      getLanguageMovies('en'),
      getLanguageMovies('ta', 'primary_release_date.desc'),
      getLanguageMovies('te'),
      getLanguageMovies('hi'),
      getLanguageMovies('ko'),
      getLanguageMovies('ja'),
    ]);
  }

  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      {/* Hero Banner - Only show on homepage (no filters) */}
      {!hasFilters && trendingData && <Hero movies={trendingData} />}
      
      {/* Sticky Filters */}
      <div className="sticky top-0 z-40">
        <Suspense fallback={<div className="h-16 bg-[#0a0b10]" />}>
          <Filters />
        </Suspense>
      </div>

      <div className="max-w-[1600px] mx-auto py-8">
        
        {/* If Filters are Applied, Show Filtered Results */}
        {hasFilters && filteredData && (
          <div className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 px-4 sm:px-6 lg:px-8">
              {genre ? `Results for Genre` : `Latest ${language.toUpperCase()} Movies`}
            </h2>
            <MoviesSection movies={filteredData.results || []} />
          </div>
        )}

        {/* If No Filters, Show All Sections */}
        {!hasFilters && (
          <>
            {/* Horizontal Carousels for Specific Languages */}
            {englishMovies && (
              <div className="mb-8">
                <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Trending in English</h2>
                  <a href="?language=en&sort=popularity.desc" className="text-blue-400 hover:underline text-sm">View All</a>
                </div>
                <MovieCarousel title="" movies={englishMovies} languageCode="en" />
              </div>
            )}

            {tamilMovies && (
              <div className="mb-8">
                <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Latest Tamil Movies</h2>
                  <a href="?language=ta&sort=primary_release_date.desc" className="text-blue-400 hover:underline text-sm">View All</a>
                </div>
                <MovieCarousel title="" movies={tamilMovies} languageCode="ta" />
              </div>
            )}

            {teluguMovies && (
              <div className="mb-8">
                <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Latest Telugu Movies</h2>
                  <a href="?language=te&sort=popularity.desc" className="text-blue-400 hover:underline text-sm">View All</a>
                </div>
                <MovieCarousel title="" movies={teluguMovies} languageCode="te" />
              </div>
            )}

            {hindiMovies && (
              <div className="mb-8">
                <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Popular Hindi Movies</h2>
                  <a href="?language=hi&sort=popularity.desc" className="text-blue-400 hover:underline text-sm">View All</a>
                </div>
                <MovieCarousel title="" movies={hindiMovies} languageCode="hi" />
              </div>
            )}

            {koreanMovies && (
              <div className="mb-8">
                <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Popular Korean Movies</h2>
                  <a href="?language=ko&sort=popularity.desc" className="text-blue-400 hover:underline text-sm">View All</a>
                </div>
                <MovieCarousel title="" movies={koreanMovies} languageCode="ko" />
              </div>
            )}

            {japaneseMovies && (
              <div className="mb-8">
                <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Popular Japanese Movies</h2>
                  <a href="?language=ja&sort=popularity.desc" className="text-blue-400 hover:underline text-sm">View All</a>
                </div>
                <MovieCarousel title="" movies={japaneseMovies} languageCode="ja" />
              </div>
            )}
          </>
        )}

      </div>

      <Footer />
    </main>
  );
}
