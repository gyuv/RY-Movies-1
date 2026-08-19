import Filters from './components/Filters';
import MoviesSection from './components/MoviesSection';
import Hero from './components/Hero';
import MovieCarousel from './components/MovieCarousel';
import Pagination from './components/Pagination';
import { Suspense } from 'react';

// Mock data for build stability
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
  if (!apiKey) {
    console.log("TMDB_API_KEY is missing, using mock data");
    return { results: MOCK_LIST, total_pages: 1, total_results: 20 };
  }
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
  const year = getParam("year", "");
  const actorId = getParam("with_people", "");

  const hasFilters = genre || language !== 'en' || sort !== 'popularity.desc' || year || actorId;

  let filteredData = null;
  let actorDetails = null;
  let trendingData = null;
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
    <main className="min-h-screen bg-[#141414] text-white pb-20">
      
      {!hasFilters && trendingData && (
        <div className="relative w-full h-[70vh] md:h-[85vh]">
          <Hero movies={trendingData} />
          <div className="absolute inset-0 hero-vignette pointer-events-none" />
        </div>
      )}
      
      <div className="sticky top-0 z-50 bg-[#141414]/90 backdrop-blur-sm">
        <Suspense fallback={<div className="h-16" />}>
          <Filters />
        </Suspense>
      </div>

      <div className={`w-full ${!hasFilters ? 'px-0 sm:px-10 lg:px-14 pb-8 -mt-24 relative z-40' : 'py-8'}`}>
        
        {hasFilters && filteredData && (
          <div className="mt-8 px-4 sm:px-10 lg:px-14">
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
          <div className="flex flex-col gap-10">
            {englishMovies && <MovieCarousel title="Trending in English" movies={englishMovies} languageCode="en" />}
            {tamilMovies && <MovieCarousel title="Latest Tamil Movies" movies={tamilMovies} languageCode="ta" />}
            {teluguMovies && <MovieCarousel title="Latest Telugu Movies" movies={teluguMovies} languageCode="te" />}
            {hindiMovies && <MovieCarousel title="Popular Hindi Movies" movies={hindiMovies} languageCode="hi" />}
            {koreanMovies && <MovieCarousel title="Popular Korean Movies" movies={koreanMovies} languageCode="ko" />}
            {japaneseMovies && <MovieCarousel title="Popular Japanese Movies" movies={japaneseMovies} languageCode="ja" />}
          </div>
        )}
      </div>
    </main>
  );
}
