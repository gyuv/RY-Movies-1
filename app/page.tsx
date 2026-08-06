import Filters from './components/Filters';
import MoviesSection from './components/MoviesSection';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { Suspense } from 'react';

// Mock data for build stability
const MOCK_MOVIES = [
  { id: 1, title: "Inception", poster_path: "/9lH0V6e4b4w8r5k6j7h8g9f0d1s2a3.jpg", vote_average: 8.8, overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", release_date: "2010-07-15" },
  { id: 2, title: "Interstellar", poster_path: "/gEU2QqE6m8d4x5w6v7u8t9s0r1q2p3.jpg", vote_average: 8.6, overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", release_date: "2014-11-05" },
  { id: 3, title: "The Dark Knight", poster_path: "/qJ2tW6D3w4e5r6t7y8u9i0o1p2a3s4.jpg", vote_average: 9.0, overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", release_date: "2008-07-16" },
  { id: 4, title: "Pulp Fiction", poster_path: "/d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9.jpg", vote_average: 8.5, overview: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.", release_date: "1994-09-12" },
  { id: 5, title: "Fight Club", poster_path: "/s4t5u6v7w8x9y0z1a2b3c4d5e6f7g8.jpg", vote_average: 8.8, overview: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.", release_date: "1999-10-14" },
  { id: 6, title: "Forrest Gump", poster_path: "/h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2.jpg", vote_average: 8.8, overview: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.", release_date: "1994-06-22" },
  { id: 7, title: "Matrix", poster_path: "/w2x3y4z5a6b7c8d9e0f1g2h3i4j5k6.jpg", vote_average: 8.7, overview: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyberpunk.", release_date: "1999-03-29" },
  { id: 8, title: "Goodfellas", poster_path: "/l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0.jpg", vote_average: 8.7, overview: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.", release_date: "1990-09-18" },
  { id: 9, title: "Parasite", poster_path: "/a0b1c2d3e4f5g6h7i8j9k0l1m2n3o4.jpg", vote_average: 8.5, overview: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", release_date: "2019-05-30" },
  { id: 10, title: "Joker", poster_path: "/p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8.jpg", vote_average: 8.4, overview: "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic criminal figure.", release_date: "2019-10-01" },
];

async function getMovies(page: number, genre: string, language: string, year: string, sort: string) {
  const apiKey = process.env.TMDB_API_KEY;
  
  // If no API key, return mock data immediately
  if (!apiKey) {
    console.log("TMDB_API_KEY is missing in Environment Variables");
    return { results: MOCK_MOVIES, total_pages: 1, total_results: MOCK_MOVIES.length };
  }

  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (genre) params.set("with_genres", genre);
    if (year) params.set("primary_release_year", year);
    params.set("sort_by", sort);
    params.set("language", language);

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${params.toString()}&language=en-US`;
    
    const res = await fetch(url, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      const errorBody = await res.json();
      console.error("TMDB API Error:", res.status, errorBody);
      return { results: MOCK_MOVIES, total_pages: 1, total_results: MOCK_MOVIES.length };
    }
    
    const data = await res.json();
    console.log(`Fetched ${data.results.length} movies from TMDB`);
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    return { results: MOCK_MOVIES, total_pages: 1, total_results: MOCK_MOVIES.length };
  }
}

async function getTrending() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return { results: MOCK_MOVIES }; // Return mock data if no key

  try {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=en-US`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return { results: MOCK_MOVIES };
    return await res.json();
  } catch (error) {
    return { results: MOCK_MOVIES };
  }
}

// Helper to normalize search params to string
const getParam = (value: string | string[] | undefined, defaultValue: string = "") => {
  if (Array.isArray(value)) return value[0];
  return value || defaultValue;
};

export default async function Home({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const page = Number(searchParams?.page) || 1;
  const genre = getParam(searchParams?.genre, "");
  const language = getParam(searchParams?.language, "en");
  const year = getParam(searchParams?.year, "");
  const sort = getParam(searchParams?.sort, "popularity.desc");

  const [moviesData, trendingData] = await Promise.all([
    getMovies(page, genre, language, year, sort),
    getTrending()
  ]);

  // Ensure we have an array of movies for Hero
  const heroMovies = trendingData?.results || MOCK_MOVIES;
  const listMovies = moviesData?.results || MOCK_MOVIES;

  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      {/* Pass the trending movies to Hero */}
      <Hero movies={heroMovies} />
      
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

        <MoviesSection movies={listMovies} />
      </div>

      <Footer />
    </main>
  );
}
