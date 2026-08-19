import Filters from './components/Filters';
import MoviesSection from './components/MoviesSection';
import Hero from './components/Hero';
import Footer from './components/Footer';
import MovieCarousel from './components/MovieCarousel';
import Pagination from './components/Pagination';
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

const MOCK_LIST = Array(20).fill(MOCK_MOVIE).map((m, i) => ({ ...m, id: i + 1 }));

// Helper to safely fetch from TMDB
async function fetchTMDB(url: string, apiKey: string | undefined) {
  if (!apiKey) {
    console.log("TMDB_API_KEY is missing, using mock data");
    return { results: MOCK_LIST, total_pages: 1, total_results: 20 };
  }
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`TMDB Fetch Error: ${res.status} for ${url}`);
      return { results: MOCK_LIST, total_pages: 1, total_results: 20 };
    }
    return await res.json();
  } catch (e) {
    console.error("TMDB Fetch Exception:", e);
    return { results: MOCK_LIST, total_pages: 1, total_results: 20 };
  }
}

// Fetch actor details
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
  const year = getParam("year", "");
  const actorId = getParam("with_people", ""); // Code 1/Code 2 alignment for actor filter

  // Check if any filters are active
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

  // --- UI RENDERING STARTS HERE ---
  return (
    <main className="min-h-screen bg-[#1c1d21] text-gray-200 font-sans selection:bg-red-500/30">
      
      {/* Hero Banner - Only show on homepage (no filters) */}
      {!hasFilters && trendingData && <Hero movies={trendingData} />}
      
      {/* Sticky Filters - Matching the dark theme */}
      <div className="sticky top-0 z-40 bg-[#1c1d21]/95 backdrop-blur-md border-b border-gray-800 shadow-xl">
        <Suspense fallback={<div className="h-16 bg-[#1c1d21]" />}>
          <Filters />
        </Suspense>
      </div>

      <div className="max-w-[1600px] mx-auto py-8">
        
        {/* If Filters are Applied, Show Filtered Results with Pagination */}
        {hasFilters && filteredData && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-8 px-4 sm:px-6 lg:px-8">
              <span className="text-3xl text-[#e50914]">⊞</span>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider">
                {actorDetails 
                  ? `Starring ${actorDetails.name}` 
                  : year 
                    ? `Released in ${year}` 
                    : genre 
                      ? `Genre Results` 
                      : `${language.toUpperCase()} Movies`}
              </h2>
            </div>
            
            <MoviesSection movies={filteredData.results || []} />
            
            {/* Pagination Controls */}
            {filteredData.total_pages > 1 && (
              <div className="mt-12 mb-8 border-t border-gray-800 pt-8">
                <Pagination 
                  currentPage={page} 
                  totalPages={filteredData.total_pages} 
                />
              </div>
            )}
          </div>
        )}

        {/* If No Filters, Show All Sections */}
        {!hasFilters && (
          <div className="space-y-14 mt-4">
            
            {englishMovies && (
              <section>
                <div className="flex justify-between items-end px-4 sm:px-6 lg:px-8 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-100 flex items-center gap-2 uppercase tracking-wide">
                    <span className="text-2xl text-[#e50914]">⊞</span> Trending in English
                  </h2>
                  <a href="?language=en&sort=popularity.desc" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">VIEW ALL</a>
                </div>
                <MovieCarousel title="" movies={englishMovies} languageCode="en" />
              </section>
            )}

            {/* DYNAMIC INLINE FEATURE BLOCK (Recreating the "Red Sparrow" trailer section) */}
            {tamilMovies && tamilMovies.length > 0 && (
              <section className="px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4">
                  {["#Trending", "#TopPicks", "#Cinematic", "#MustWatch"].map((tag, i) => (
                    <span key={tag} className={`px-3 py-1 rounded-full text-xs font-bold ${i === 0 ? 'bg-[#e50914] text-white' : 'bg-[#2a2b31] text-gray-300 border border-gray-700'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="relative w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden group cursor-pointer border border-gray-800 shadow-2xl">
                  <img 
                    src={tamilMovies[0].backdrop_path ? `https://image.tmdb.org/t/p/original${tamilMovies[0].backdrop_path}` : '/trailer-thumb.jpg'} 
                    alt={tamilMovies[0].title} 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 md:border-4 border-white/50 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:border-white group-hover:scale-110 transition-all shadow-xl">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                      <h2 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">{tamilMovies[0].title}</h2>
                      <div className="flex items-center gap-3 text-sm text-gray-300 font-bold">
                        <span>{tamilMovies[0].release_date?.split('-')[0]}</span>
                        <span className="text-[#e50914] flex items-center gap-1">HOT</span>
                        <span className="text-yellow-500 drop-shadow-md">★ {tamilMovies[0].vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="hidden md:block max-w-md text-sm text-gray-300 font-medium line-clamp-3">
                      {tamilMovies[0].overview}
                    </div>
                  </div>
                  <a href={`/media/${tamilMovies[0].id}`} className="absolute inset-0 z-10"><span className="sr-only">Play Trailer</span></a>
                </div>
              </section>
            )}

            {tamilMovies && (
              <section>
                <div className="flex justify-between items-end px-4 sm:px-6 lg:px-8 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-100 flex items-center gap-2 uppercase tracking-wide">
                    <span className="text-2xl text-[#e50914]">⊞</span> Latest Tamil
                  </h2>
                  <a href="?language=ta&sort=primary_release_date.desc" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">VIEW ALL</a>
                </div>
                <MovieCarousel title="" movies={tamilMovies.slice(1)} languageCode="ta" />
              </section>
            )}

            {teluguMovies && (
              <section>
                <div className="flex justify-between items-end px-4 sm:px-6 lg:px-8 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-100 flex items-center gap-2 uppercase tracking-wide">
                    <span className="text-2xl text-[#e50914]">⊞</span> Latest Telugu
                  </h2>
                  <a href="?language=te&sort=popularity.desc" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">VIEW ALL</a>
                </div>
                <MovieCarousel title="" movies={teluguMovies} languageCode="te" />
              </section>
            )}

            {hindiMovies && (
              <section>
                <div className="flex justify-between items-end px-4 sm:px-6 lg:px-8 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-100 flex items-center gap-2 uppercase tracking-wide">
                    <span className="text-2xl text-[#e50914]">⊞</span> Popular Hindi
                  </h2>
                  <a href="?language=hi&sort=popularity.desc" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">VIEW ALL</a>
                </div>
                <MovieCarousel title="" movies={hindiMovies} languageCode="hi" />
              </section>
            )}

            {koreanMovies && (
              <section>
                <div className="flex justify-between items-end px-4 sm:px-6 lg:px-8 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-100 flex items-center gap-2 uppercase tracking-wide">
                    <span className="text-2xl text-[#e50914]">⊞</span> Popular Korean
                  </h2>
                  <a href="?language=ko&sort=popularity.desc" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">VIEW ALL</a>
                </div>
                <MovieCarousel title="" movies={koreanMovies} languageCode="ko" />
              </section>
            )}

            {japaneseMovies && (
              <section>
                <div className="flex justify-between items-end px-4 sm:px-6 lg:px-8 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-100 flex items-center gap-2 uppercase tracking-wide">
                    <span className="text-2xl text-[#e50914]">⊞</span> Popular Japanese
                  </h2>
                  <a href="?language=ja&sort=popularity.desc" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">VIEW ALL</a>
                </div>
                <MovieCarousel title="" movies={japaneseMovies} languageCode="ja" />
              </section>
            )}
          </div>
        )}

      </div>
      <Footer />
    </main>
  );
}
