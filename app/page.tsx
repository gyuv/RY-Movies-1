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

// Fetch movies
