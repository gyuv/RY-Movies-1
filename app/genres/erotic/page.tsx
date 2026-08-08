// app/genres/erotic/page.tsx
import Image from 'next/image';
import Link from 'next/link';

// 1. Check your Vercel Environment Variable name!
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Expanded Language Map for better matching
const LANGUAGE_MAP: Record<string, string> = {
  ta: 'Tamil',
  tamil: 'Tamil',
  te: 'Telugu',
  telugu: 'Telugu',
  ml: 'Malayalam',
  malayalam: 'Malayalam',
  hi: 'Hindi',
  hindi: 'Hindi',
  bn: 'Bengali',
  bengali: 'Bengali',
  kn: 'Kannada',
  kannada: 'Kannada',
};

// Target Language Keys (lowercase)
const TARGET_LANGUAGES = Object.keys(LANGUAGE_MAP);

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  original_language: string;
  release_date: string;
}

async function fetchEroticContent(): Promise<Movie[]> {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is missing!");
    return [];
  }

  try {
    // Strategy: Fetch Romance movies (10749) and filter by Indian Languages
    // We fetch more pages to ensure we get Indian content
    const genres = "10749"; // Romance
    const limit = 50; // Fetch more to filter down
    const sort_by = "popularity.desc";
    
    // Note: TMDB API 'with_original_language' takes a single code. 
    // Since we have multiple, we'll fetch a broader set and filter client-side.
    
    const res = await fetch(
      `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genres}&sort_by=${sort_by}&vote_count.gte=50&language=en-US&page=1&include_adult=false`,
      { 
        next: { revalidate: 3600 },
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!res.ok) {
      throw new Error(`TMDB Error: ${res.status}`);
    }

    const data = await res.json();
    const allMovies: Movie[] = data.results;

    console.log(`Fetched ${allMovies.length} movies from TMDB. Languages found:`, 
      allMovies.map(m => m.original_language).slice(0, 5));

    // Filter for Indian Languages
    const filteredMovies = allMovies.filter((movie: Movie) => {
      const lang = movie.original_language.toLowerCase();
      return TARGET_LANGUAGES.includes(lang);
    });

    console.log(`Filtered ${filteredMovies.length} Indian movies.`);

    // Sort by Vote Average
    const sortedMovies = filteredMovies.sort((a, b) => b.vote_average - a.vote_average);

    // Limit to 20
    return sortedMovies.slice(0, 20);

  } catch (error) {
    console.error("Error fetching erotic content:", error);
    return [];
  }
}

export default async function EroticPage() {
  const movies = await fetchEroticContent();

  // Helper to get language name
  const getLangName = (code: string) => {
    const langKey = code.toLowerCase();
    return LANGUAGE_MAP[langKey] || code.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-pink-500">
          Erotic & Romantic Collection
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Curated Romance from Indian Cinema
        </p>
        
        {movies.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl font-semibold text-pink-400">No movies found.</p>
            <p className="text-sm mt-2">
              If your API key is loaded, try refreshing the page or checking the browser console.
            </p>
            <div className="mt-4 p-4 bg-gray-900 rounded-lg max-w-md mx-auto text-left text-xs font-mono">
              <p><strong>Debug Info:</strong></p>
              <p>API Key: {TMDB_API_KEY ? 'Loaded' : 'Missing'}</p>
              <p>Target Languages: {TARGET_LANGUAGES.join(', ')}</p>
              <p>Genre: Romance (10749)</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="group bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-pink-500/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative h-96 w-full bg-gray-800">
                  <Image
                    src={movie.poster_path 
                      ? `${IMAGE_BASE_URL}${movie.poster_path}` 
                      : `${IMAGE_BASE_URL}/placeholder.jpg`}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 left-2 bg-pink-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                    {getLangName(movie.original_language)}
                  </div>
                  <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 pt-12">
                    <h2 className="text-lg font-bold truncate text-white mb-1">{movie.title}</h2>
                    <p className="text-gray-300 text-xs">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                    {movie.overview || "No overview available."}
                  </p>
                  <Link 
                    href={`/movie/${movie.id}`} 
                    className="mt-3 block w-full text-center bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                  >
                    Watch Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
