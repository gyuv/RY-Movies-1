import MovieCarousel from './components/MovieCarousel';

// --- API Fetchers ---

// Generic fetcher with flexible sorting and release type filtering
async function getMoviesList(endpoint: string, apiKey: string, params = "") {
  const baseUrl = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&language=en-US${params}`;
  try {
    const res = await fetch(baseUrl, { next: { revalidate: 43200 } }); // Cache for 12 hours
    if (!res.ok) return { results: [] };
    const data = await res.json();
    return { results: data.results.slice(0, 20) };
  } catch (e) {
    console.error(`Error fetching ${endpoint}:`, e);
    return { results: [] };
  }
}

// --- Main Page Component ---

export default async function Home() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
  if (!apiKey) return <div className="text-white p-10">Missing TMDB API Key</div>;

  // Fetch all categories in parallel
  const [
    trendingMovies,
    topEnglishMovies,
    latestHindiMovies,
    latestTamilMovies,
    latestTeluguMovies,
    topKoreanMovies,
    topJapaneseMovies,
    topSpanishMovies,
    topRatedAllTime
  ] = await Promise.all([
    // 1. Trending This Week (Global)
    getMoviesList("trending/movie/week", apiKey),
    
    // 2. Top English (Sorted by Popularity, Released only)
    getMoviesList("discover/movie", apiKey, "&with_original_language=en&sort_by=popularity.desc&vote_count.gte=100&with_release_type=3"),
    
    // 3. Latest Hindi (Sorted by Rating, Released only, from 2020 onwards)
    getMoviesList("discover/movie", apiKey, "&with_original_language=hi&sort_by=vote_average.desc&primary_release_year.gte=2020&with_release_type=3&vote_count.gte=50"),
    
    // 4. Latest Tamil (Sorted by Rating, Released only, from 2015 onwards)
    getMoviesList("discover/movie", apiKey, "&with_original_language=ta&sort_by=vote_average.desc&primary_release_year.gte=2015&with_release_type=3&vote_count.gte=50"),
    
    // 5. Latest Telugu (Sorted by Rating, Released only, from 2015 onwards)
    getMoviesList("discover/movie", apiKey, "&with_original_language=te&sort_by=vote_average.desc&primary_release_year.gte=2015&with_release_type=3&vote_count.gte=50"),
    
    // 6. Top Korean (Popularity, Released only)
    getMoviesList("discover/movie", apiKey, "&with_original_language=ko&sort_by=popularity.desc&vote_count.gte=100&with_release_type=3"),
    
    // 7. Top Japanese (Popularity, Released only)
    getMoviesList("discover/movie", apiKey, "&with_original_language=ja&sort_by=popularity.desc&vote_count.gte=100&with_release_type=3"),
    
    // 8. Top Spanish (Popularity, Released only)
    getMoviesList("discover/movie", apiKey, "&with_original_language=es&sort_by=popularity.desc&vote_count.gte=100&with_release_type=3"),
    
    // 9. All Time Top Rated (English)
    getMoviesList("movie/top_rated", apiKey, "&with_original_language=en")
  ]);

  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="max-w-7xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6 px-4 text-white">Cinereel</h1>

        {/* 1. Latest Trending (Global) */}
        <MovieCarousel 
          title="🔥 Trending This Week" 
          movies={trendingMovies.results} 
        />

        {/* 2. Top English Movies */}
        <MovieCarousel 
          title="🇬🇧 Top English Movies" 
          movies={topEnglishMovies.results} 
        />

        {/* 3. Top Rated All Time (English) */}
        <MovieCarousel 
          title="⭐ Critically Acclaimed" 
          movies={topRatedAllTime.results} 
        />

        {/* 4. Indian Cinema - Top Rated Recent Hindi */}
        <MovieCarousel 
          title="🇮🇳 Top Rated Hindi Movies" 
          movies={latestHindiMovies.results} 
        />

        {/* 5. Indian Cinema - Top Rated Recent Tamil */}
        <MovieCarousel 
          title="🇮🇳 Top Rated Tamil Movies" 
          movies={latestTamilMovies.results} 
        />

        {/* 6. Indian Cinema - Top Rated Recent Telugu */}
        <MovieCarousel 
          title="🇮🇳 Top Rated Telugu Movies" 
          movies={latestTeluguMovies.results} 
        />

        {/* 7. Korean Wave */}
        <MovieCarousel 
          title="🇰🇷 Top Korean Movies" 
          movies={topKoreanMovies.results} 
        />

        {/* 8. Japanese Cinema */}
        <MovieCarousel 
          title="🇯🇵 Top Japanese Movies" 
          movies={topJapaneseMovies.results} 
        />

        {/* 9. Spanish Language */}
        <MovieCarousel 
          title="🇪🇸 Top Spanish Movies" 
          movies={topSpanishMovies.results} 
        />
      </div>
    </main>
  );
}
