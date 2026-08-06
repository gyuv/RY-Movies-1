import Filters from './components/Filters';
import MoviesSection from './components/MoviesSection';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { Suspense } from 'react';

// This function fetches data on the server
async function getMovies(page = 1, genre = "", language = "en", year = "", sort = "popularity.desc") {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (genre) params.set("with_genres", genre);
  if (language) params.set("primary_release_year", language); // Note: TMDB uses 'language' for original language, but you might mean region. Let's stick to your API logic.
  if (year) params.set("primary_release_year", year);
  params.set("sort_by", sort);

  const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&${params.toString()}&language=en-US`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  return res.json();
}

// This function fetches trending for the Hero
async function getTrending() {
  const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.TMDB_API_KEY}&language=en-US`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) throw new Error('Failed to fetch trending');
  return res.json();
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
      <Hero movies={trendingData.results || []} />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* FIX: Wrap Filters in Suspense to handle useSearchParams() hydration */}
        <Suspense fallback={
          <div className="sticky top-0 z-50 glass-panel !border-none !bg-[#0a0b10]/80 backdrop-blur-2xl py-4 px-4 mb-8">
            <div className="max-w-[1600px] mx-auto space-y-4">
              <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-10 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
        }>
          <Filters />
        </Suspense>

        <MoviesSection 
          movies={moviesData.results || []} 
          total_pages={moviesData.total_pages}
          total_results={moviesData.total_results}
        />
      </div>

      <Footer />
    </main>
  );
}