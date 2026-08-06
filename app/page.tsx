import MovieCarousel from './components/MovieCarousel';

// --- API Fetchers ---

async function getMoviesList(endpoint: string, apiKey: string, params = "") {
  const baseUrl = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&language=en-US&sort_by=popularity.desc${params}`;
  try {
    const res = await fetch(baseUrl, { next: { revalidate: 86400 } });
    if (!res.ok) return { results: [] };
    const data = await res.json();
    return { results: data.results.slice(0, 20) }; // Limit to 20 per carousel for performance
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
    topKoreanMovies,
    topJapaneseMovies,
    topSpanishMovies,
    topRatedAllTime
  ] = await Promise.all([
    getMoviesList("trending/movie/week", apiKey),
    getMoviesList("discover/movie", apiKey, "&with_original_language=en&vote_count.gte=100"),
    getMoviesList("discover/movie", apiKey, "&with_original_language=ko&vote_count.gte=100"),
    getMoviesList("discover/movie", apiKey, "&with_original_language=ja&vote_count.gte=100"),
    getMoviesList("discover/movie", apiKey, "&with_original_language=es&vote_count.gte=100"),
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

        {/* 4. Korean Wave */}
        <MovieCarousel 
          title="🇰🇷 Top Korean Movies" 
          movies={topKoreanMovies.results} 
        />

        {/* 5. Japanese Cinema */}
        <MovieCarousel 
          title="🇯🇵 Top Japanese Movies" 
          movies={topJapaneseMovies.results} 
        />

        {/* 6. Spanish Language */}
        <MovieCarousel 
          title="🇪🇸 Top Spanish Movies" 
          movies={topSpanishMovies.results} 
        />
      </div>
    </main>
  );
}
