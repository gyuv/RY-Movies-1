import Filters from './components/Filters';
import MoviesSection from './components/MoviesSection';
import Hero from './components/Hero';
import Footer from './components/Footer';
import MovieCarousel from './components/MovieCarousel';
import Pagination from './components/Pagination';
import { Suspense } from 'react';
import Link from 'next/link';

const MOCK_MOVIE = { 
  id: 99, 
  title: "Mock Movie", 
  poster_path: "/9lH0V6e4b4w8r5k6j7h8g9f0d1s2a3.jpg", 
  vote_average: 8.5, 
  release_date: "2023-01-01",
  overview: "A mock movie overview for testing purposes."
};

const MOCK_LIST = Array(20).fill(MOCK_MOVIE).map((m, i) => ({ ...m, id: i + 1 }));

async function fetchTMDB(url: string, apiKey: string | undefined) {
  if (!apiKey) return { results: MOCK_LIST, total_pages: 1, total_results: 20 };
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return { results: MOCK_LIST, total_pages: 1, total_results: 20 };
    return await res.json();
  } catch (e) {
    return { results: MOCK_LIST, total_pages: 1, total_results: 20 };
  }
}

async function getActorDetails(actorId: string, apiKey: string | undefined) {
  if (!apiKey) return null;
  try {
    const res = await fetch(`https://api.themoviedb.org/3/person/${actorId}?api_key=${apiKey}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

// UPDATED: Logic to fetch different data for Trending vs Popular
async function getLanguageMovies(language: string, tab: string = 'trending', limit: number = 20) {
  const apiKey = process.env.TMDB_API_KEY;
  const params = new URLSearchParams();
  params.set("with_original_language", language);
  params.set("page", "1");
  params.set("language", "en-US");
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  if (tab === 'recent') {
    // Recently Added: Strictly by release date, must have some votes to filter out unreleased junk
    params.set("sort_by", "primary_release_date.desc");
    params.set("primary_release_date.lte", todayStr);
    params.set("vote_count.gte", "5");
  } else if (tab === 'popular') {
    // Popular: All-time highest popularity
    params.set("sort_by", "popularity.desc");
    params.set("primary_release_date.lte", todayStr);
    params.set("vote_count.gte", "100"); // Ensures well-known movies
  } else {
    // Trending (Default): High popularity, but restricted to the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    params.set("sort_by", "popularity.desc");
    params.set("primary_release_date.gte", sixMonthsAgo.toISOString().split('T')[0]);
    params.set("primary_release_date.lte", todayStr);
  }
  
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${params.toString()}`;
  const data = await fetchTMDB(url, apiKey);
  return data.results?.slice(0, limit) || [];
}

async function getHeroMovies(tab: string) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return MOCK_LIST;
  try {
    let url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}&language=en-US`;
    
    if (tab === 'popular') {
      url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US`;
    } else if (tab === 'recent') {
       const today = new Date().toISOString().split('T')[0];
       url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=primary_release_date.desc&primary_release_date.lte=${today}&vote_count.gte=20`;
    }

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
  const year = getParam("year", "");
  const actorId = getParam("with_people", ""); 
  
  const activeTab = getParam("tab", "trending");
  const hasFilters = genre || language !== 'en' || sort !== 'popularity.desc' || year || actorId;

  let filteredData = null;
  let actorDetails = null;
  let heroData = null;
  let englishMovies = null;
  let tamilMovies = null;
  let teluguMovies = null;
  let hindiMovies = null;
  let koreanMovies = null;
  let japaneseMovies = null;

  const apiKey = process.env.TMDB_API_KEY;

  if (hasFilters) {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (genre) params.set("with_genres", genre);
    params.set("with_original_language", language);
    params.set("sort_by", sort);
    
    if (year) {
      params.set("primary_release_date.gte", `${year}-01-01`);
      params.set("primary_release_date.lte", `${year}-12-31`);
    } else {
      const today = new Date().toISOString().split('T')[0];
      params.set("primary_release_date.gte", "1900-01-01");
      params.set("primary_release_date.lte", today);
    }

    if (actorId) {
      params.set("with_people", actorId);
      actorDetails = await getActorDetails(actorId, apiKey);
    }

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${params.toString()}`;
    filteredData = await fetchTMDB(url, apiKey);
  } else {
    // UPDATED: Passing activeTab directly to getLanguageMovies
    [
      heroData,
      englishMovies,
      tamilMovies,
      teluguMovies,
      hindiMovies,
      koreanMovies,
      japaneseMovies
    ] = await Promise.all([
      getHeroMovies(activeTab),
      getLanguageMovies('en', activeTab),
      getLanguageMovies('ta', activeTab),
      getLanguageMovies('te', activeTab),
      getLanguageMovies('hi', activeTab),
      getLanguageMovies('ko', activeTab),
      getLanguageMovies('ja', activeTab),
    ]);
  }

  const getRowTitle = (categoryName: string) => {
    if (activeTab === 'popular') return `🔥 Popular ${categoryName}`;
    if (activeTab === 'recent') return `➕ Recently Added ${categoryName}`;
    return `⭐ Trending ${categoryName}`;
  };

  return (
    <main className="min-h-screen bg-[#141414] text-white">
      {!hasFilters && heroData && <Hero movies={heroData} />}
      
      {!hasFilters && (
        <div className="relative flex justify-center px-4 pt-8 pb-2">
          <div className="apex-glass inline-flex items-center gap-1 rounded-full p-1.5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.9)] overflow-x-auto scrollbar-hide max-w-full">
            {[
              { id: 'trending', label: 'Trending', icon: '✦' },
              { id: 'popular', label: 'Popular', icon: '❋' },
              { id: 'recent', label: 'Recently Added', icon: '＋' },
            ].map((t) => {
              const isActive = activeTab === t.id;
              return (
                <Link
                  key={t.id}
                  href={`/?tab=${t.id}`}
                  data-apex-nav
                  className={`apex-focusable relative flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-apex-cyan to-apex-violet text-black shadow-apex-glow'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'opacity-90' : 'opacity-70'}>{t.icon}</span>
                  {t.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="sticky top-0 z-40 bg-[#141414]/90 backdrop-blur-md">
        <Suspense fallback={<div className="h-16" />}>
          <Filters />
        </Suspense>
      </div>

      <div className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6">
        
        {hasFilters && filteredData && (
          <div className="mt-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
              {actorDetails 
                ? `Movies starring ${actorDetails.name}` 
                : year 
                  ? `Movies from ${year}` 
                  : genre 
                    ? `Results for Genre` 
                    : `Latest ${language.toUpperCase()} Movies`}
            </h2>
            <MoviesSection movies={filteredData.results || []} />
            
            {filteredData.total_pages > 1 && (
              <div className="mt-8 mb-8">
                <Pagination currentPage={page} totalPages={filteredData.total_pages} />
              </div>
            )}
          </div>
        )}

        {!hasFilters && (
          <>
            {englishMovies && (
              <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h2 className="section-heading mb-0">{getRowTitle("English Movies")}</h2>
                  <div className="flex items-center gap-3 text-sm">
                    <a href="?language=en&sort=popularity.desc" className="text-red-500 hover:text-red-400 ml-2">View All</a>
                  </div>
                </div>
                <MovieCarousel title="" movies={englishMovies} languageCode="en" />
              </div>
            )}

            {tamilMovies && (
              <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h2 className="section-heading mb-0">{getRowTitle("Tamil Movies")}</h2>
                  <div className="flex items-center gap-3 text-sm">
                    <a href="?language=ta&sort=primary_release_date.desc" className="text-red-500 hover:text-red-400 ml-2">View All</a>
                  </div>
                </div>
                <MovieCarousel title="" movies={tamilMovies} languageCode="ta" />
              </div>
            )}

            {teluguMovies && (
              <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h2 className="section-heading mb-0">{getRowTitle("Telugu Movies")}</h2>
                  <div className="flex items-center gap-3 text-sm">
                    <a href="?language=te&sort=popularity.desc" className="text-red-500 hover:text-red-400 ml-2">View All</a>
                  </div>
                </div>
                <MovieCarousel title="" movies={teluguMovies} languageCode="te" />
              </div>
            )}

            {hindiMovies && (
              <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h2 className="section-heading mb-0">{getRowTitle("Hindi Movies")}</h2>
                  <div className="flex items-center gap-3 text-sm">
                    <a href="?language=hi&sort=popularity.desc" className="text-red-500 hover:text-red-400 ml-2">View All</a>
                  </div>
                </div>
                <MovieCarousel title="" movies={hindiMovies} languageCode="hi" />
              </div>
            )}

            {koreanMovies && (
              <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h2 className="section-heading mb-0">{getRowTitle("Korean Movies")}</h2>
                  <div className="flex items-center gap-3 text-sm">
                    <a href="?language=ko&sort=popularity.desc" className="text-red-500 hover:text-red-400 ml-2">View All</a>
                  </div>
                </div>
                <MovieCarousel title="" movies={koreanMovies} languageCode="ko" />
              </div>
            )}

            {japaneseMovies && (
              <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h2 className="section-heading mb-0">{getRowTitle("Japanese Movies")}</h2>
                  <div className="flex items-center gap-3 text-sm">
                    <a href="?language=ja&sort=popularity.desc" className="text-red-500 hover:text-red-400 ml-2">View All</a>
                  </div>
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
