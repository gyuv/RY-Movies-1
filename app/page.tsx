import MovieCarousel from './components/MovieCarousel';

// --- API Fetchers ---

async function getMoviesList(endpoint: string, apiKey: string, params = "") {
  const baseUrl = `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&language=en-US${params}`;
  try {
    const res = await fetch(baseUrl, { next: { revalidate: 43200 } });
    if (!res.ok) return { results: [] };
    const data = await res.json();
    return { results: data.results.slice(0, 20) };
  } catch (e) {
    console.error(`Error fetching ${endpoint}:`, e);
    return { results: [] };
  }
}

export default async function Home() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
  if (!apiKey) return <div className="text-white p-10">Missing TMDB API Key</div>;

  const [
    trendingMovies,
    topEnglishMovies,
    latestHindiMovies,
    latestTamilMovies,
    latestTeluguMovies,
    topKoreanMovies,
    topJapaneseMovies,
    topSpanishMovies,
    topRatedAllTime,
    topRatedTamilMovies, // Top Rated Tamil
    latestReleasedTamilMovies // Latest Released Tamil (Sorted by Date)
  ] = await Promise.all([
    getMoviesList("trending/movie/week", apiKey),
    getMoviesList("discover/movie", apiKey, "&with_original_language=en&sort_by=popularity.desc&vote_count.gte=100&with_release_type=3"),
    getMoviesList("discover/movie", apiKey, "&with_original_language=hi&sort_by=vote_average.desc&primary_release_year.gte=2020&with_release_type=3&vote_count.gte=50"),
    getMoviesList("discover/movie", apiKey, "&with_original_language=ta&sort_by=vote_average.desc&primary_release_year.gte=2015&with_release_type=3&vote_count.gte=50"),
    getMoviesList("discover/movie", apiKey, "&with_original_language=te&sort_by=vote_average.desc&primary_release_year.gte=2015&with_release_type=3&vote_count.gte=50"),
    getMoviesList("discover/movie", apiKey, "&with_original_language=ko&sort_by=popularity.desc&vote_count.gte=100&with_release_type=3"),
    getMoviesList("discover/movie", apiKey, "&with_original_language=ja&sort_by=popularity.desc&vote_count.gte=100&with_release_type=3"),
    getMoviesList("discover/movie", apiKey, "&with_original_language=es&sort_by=popularity.desc&vote_count.gte=100&with_release_type=3"),
    getMoviesList("movie/top_rated", apiKey, "&with_original_language=en"),
    getMoviesList("discover/movie", apiKey, "&with_original_language=ta&sort_by=vote_average.desc&vote_count.gte=50"),
    getMoviesList("discover/movie", apiKey, "&with_original_language=ta&sort_by=release_date.desc&with_release_type=3&vote_count.gte=50")
  ]);

  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="max-w-7xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6 px-4 text-white">Cinereel</h1>

        <MovieCarousel title="🔥 Trending This Week" movies={trendingMovies.results} />
        <MovieCarousel title="🇬🇧 Top English Movies" movies={topEnglishMovies.results} />
        <MovieCarousel title="⭐ Critically Acclaimed" movies={topRatedAllTime.results} />
        <MovieCarousel title="🇮🇳 Top Rated Hindi Movies" movies={latestHindiMovies.results} />
        
        {/* Tamil Section */}
        <MovieCarousel title="🇮🇳 Latest Released Tamil Movies" movies={latestReleasedTamilMovies.results} />
        <MovieCarousel title="🇮🇳 Top Rated Tamil Movies" movies={topRatedTamilMovies.results} />
        
        <MovieCarousel title="🇮🇳 Top Rated Telugu Movies" movies={latestTeluguMovies.results} />
        <MovieCarousel title="🇰🇷 Top Korean Movies" movies={topKoreanMovies.results} />
        <MovieCarousel title="🇯🇵 Top Japanese Movies" movies={topJapaneseMovies.results} />
        <MovieCarousel title="🇪🇸 Top Spanish Movies" movies={topSpanishMovies.results} />
      </div>
    </main>
  );
}
