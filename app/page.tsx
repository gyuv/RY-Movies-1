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
// language: The TMDB language code (e.g., 'ta', 'te')
// sort: The sort order
// limit: Number of movies to return
async function getLanguageMovies(language: string, sort: string = 'popularity.desc', limit: number = 20) {
  const apiKey = process.env.TMDB_API_KEY;
  const params = new URLSearchParams();
  
  // 1. Filter by Original Language (e.g., 'ta' for Tamil)
  params.set("with_original_language", language);
  
  // 2. Sort Order
  params.set("sort_by", sort);
  
  // 3. Page
  params.set("page", "1");
  
  // 4. Only Released Movies (Not Upcoming)
  const today = new Date().toISOString().split('T')[0];
  params.set("primary_release_date.gte", "1900-01-01");
  params.set("primary_release_date.lte", today);
  
  // 5. FORCE ENGLISH TITLES:
  // By setting language=en-US, TMDB returns the English translation of the title
  // if available, otherwise it falls back to the original.
  params.set("language", "en-US");
  
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${params.toString()}`;
  const data = await fetchTMDB(url, apiKey);
  return data.results?.slice(0, limit) || [];
}

// Fetch filtered movies based on user selections
async function getFilteredMovies(page: number, genre: string, language: string, year: string, sort: string) {
  const apiKey = process.env.TMDB_API_KEY;
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (genre) params.set("with_genres", genre);
  params.set("language", language);
  params.set("sort_by", sort);
  // Only released movies
  const today = new Date().toISOString().split('T')[0];
  params.set("primary_release_date.gte", "1900-01-01");
  params.set("primary_release_date.lte", today);
  
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${params.toString()}`;
  return fetchTMDB(url, apiKey);
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
  const year = getParam("year", "");
  const sort = getParam("sort", "popularity.desc");

  // Fetch all required data in parallel
  // NOTE: Tamil is now sorted by 'primary_release_date.desc' for LATEST movies
  const [
    trendingData,
    filteredData,
    englishMovies,
    tamilMovies,
    teluguMovies,
    hindiMovies
  ] = await Promise.all([
    getTrendingMovies(),
    getFilteredMovies(page, genre, language, year, sort),
    getLanguageMovies('en'),
    getLanguageMovies('ta', 'primary_release_date.desc'), // LATEST Tamil
    getLanguageMovies('te'),
    getLanguageMovies('hi'),
  ]);

  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      {/* Hero Banner - Uses Trending Movies */}
      <Hero movies={trendingData} />
      
      {/* Sticky Filters */}
      <div className="sticky top-0 z-40">
        <Suspense fallback={<div className="h-16 bg-[#0a0b10]" />}>
          <Filters />
        </Suspense>
      </div>

      <div className="max-w-[1600px] mx-auto py-8">
        
        {/* Horizontal Carousels for Specific Languages */}
        <MovieCarousel title="Trending in English" movies={englishMovies} languageCode="en" />
        <MovieCarousel title="Latest Tamil Movies" movies={tamilMovies} languageCode="ta" />
        <MovieCarousel title="Latest Telugu Movies" movies={teluguMovies} languageCode="te" />
        <MovieCarousel title="Popular Hindi Movies" movies={hindiMovies} languageCode="hi" />

        {/* Main Filtered Grid */}
        <div className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 px-4 sm:px-6 lg:px-8">
            {genre ? `Results for Genre` : `Latest ${language.toUpperCase()} Movies`}
          </h2>
          <MoviesSection movies={filteredData.results || []} />
        </div>

      </div>

      <Footer />
    </main>
  );
}
