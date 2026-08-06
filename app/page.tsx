import Filters from './components/Filters';
import MoviesSection from './components/MoviesSection';
import Hero from './components/Hero';
import Footer from './components/Footer';
import MovieCarousel from './components/MovieCarousel';
import { Suspense } from 'react';

const MOCK_MOVIE = { id: 99, title: "Mock Movie", poster_path: "/9lH0V6e4b4w8r5k6j7h8g9f0d1s2a3.jpg", vote_average: 8.5, release_date: "2023-01-01" };
const MOCK_LIST = Array(10).fill(MOCK_MOVIE).map((m, i) => ({ ...m, id: i }));

async function fetchTMDB(url: string, apiKey: string | undefined) {
  if (!apiKey) return { results: MOCK_LIST };
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return { results: MOCK_LIST };
    return await res.json();
  } catch (e) {
    return { results: MOCK_LIST };
  }
}

async function getFilteredMovies(page: number, genre: string, language: string, year: string, sort: string) {
  const apiKey = process.env.TMDB_API_KEY;
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (genre) params.set("with_genres", genre);
  params.set("language", language);
  params.set("sort_by", sort);
  // Only released movies (not upcoming)
  params.set("primary_release_date.gte", "1900-01-01");
  params.set("primary_release_date.lte", new Date().toISOString().split('T')[0]);
  
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${params.toString()}`;
  return fetchTMDB(url, apiKey);
}

async function getLanguageMovies(language: string, sort: string = 'popularity.desc', limit: number = 20) {
  const apiKey = process.env.TMDB_API_KEY;
  const params = new URLSearchParams();
  params.set("language", language);
  params.set("sort_by", sort);
  params.set("page", "1");
  params.set("with_original_language", language);
  // Only released
  params.set("primary_release_date.gte", "1900-01-01");
  params.set("primary_release_date.lte", new Date().toISOString().split('T')[0]);
  
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${params.toString()}`;
  const data = await fetchTMDB(url, apiKey);
  return data.results?.slice(0, limit) || [];
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
  const [
    trendingData,
    filteredData,
    englishMovies,
    tamilMovies,
    teluguMovies,
    hindiMovies
  ] = await Promise.all([
    getLanguageMovies('en', 'popularity.desc'), // Trending (using English as default trend)
    getFilteredMovies(page, genre, language, year, sort),
    getLanguageMovies('en'),
    getLanguageMovies('ta', 'vote_average.desc'), // Tamil: High Ratings
    getLanguageMovies('te'),
    getLanguageMovies('hi'),
  ]);

  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      {/* Hero Banner */}
      <Hero movies={trendingData} />
      
      {/* Filters */}
      <div className="sticky top-0 z-40">
        <Suspense fallback={<div className="h-16 bg-[#0a0b10]" />}>
          <Filters />
        </Suspense>
      </div>

      <div className="max-w-[1600px] mx-auto py-8">
        
        {/* Horizontal Carousels for Languages */}
        <MovieCarousel title="Trending in English" movies={englishMovies} languageCode="en" />
        <MovieCarousel title="Top Rated Tamil Movies" movies={tamilMovies} languageCode="ta" />
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
