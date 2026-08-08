// app/genres/erotic/page.tsx
import Image from 'next/image';
import Link from 'next/link';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  original_language: string;
  release_date: string;
}

// Keywords to search for "Erotic" content
// 620 = Erotic, 2123 = Bed Scene, 1896 = Love Triangle, 1493 = Passion
const ERROTIC_KEYWORDS = '620,2123,1896,1493';

// Target Languages
const TARGET_LANGUAGES = ['hi', 'ta', 'te', 'ml']; // Hindi, Tamil, Telugu, Malayalam

async function fetchEroticContent(): Promise<Movie[]> {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is missing!");
    return [];
  }

  try {
    // We will fetch movies for each language separately to ensure we get results
    const promises = TARGET_LANGUAGES.map(async (lang) => {
      // Search movies with specific Keywords (Erotic, Bed Scene, etc.)
      // using_original_language ensures we get Indian movies
      const res = await fetch(
        `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=${ERROTIC_KEYWORDS}&with_original_language=${lang}&sort_by=popularity.desc&vote_count.gte=20&include_adult=true&include_video=false`,
        { 
          next: { revalidate: 3600 },
          headers: { 'Accept': 'application/json' }
        }
      );

      if (!res.ok) return [];
      
      const data = await res.json();
      return data.results || [];
    });

    // Wait for all language fetches to complete
    const results = await Promise.all(promises);
    
    // Flatten the array of arrays into one big array
    const allMovies: Movie[] = results.flat();

    // Remove duplicates based on Movie ID
    const uniqueMovies = Array.from(new Map(allMovies.map(item => [item.id, item])).values());

    // Sort by Vote Average to get the best rated ones
    const sortedMovies = uniqueMovies.sort((a, b) => b.vote_average - a.vote_average);

    // Return top 20
    return sortedMovies.slice(0, 20);

  } catch (error) {
    console.error("Error fetching erotic content:", error);
    return [];
  }
}

export default async function EroticPage() {
  const movies = await fetchEroticContent();

  const getLangName = (code: string) => {
    const langs: Record<string, string> = {
      hi: 'Hindi',
      ta: 'Tamil',
      te: 'Telugu',
      ml: 'Malayalam',
      bn: 'Bengali',
      kn: 'Kannada',
      en: 'English'
    };
    return langs[code] || code.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-pink-500">
          Erotic & Romantic Collection
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Curated Erotic Cinema from India (Tagged: Erotic, Passion, Bed Scene)
        </p>
        
        {movies.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl font-semibold text-pink-400">No movies found.</p>
            <p className="text-sm mt-2">
              TMDB has limited "Erotic" tags for Indian cinema. Try adding more keywords or expanding to English.
            </p>
            <div className="mt-4 p-4 bg-gray-900 rounded-lg max-w-md mx-auto text-left text-xs font-mono">
              <p><strong>Debug:</strong></p>
              <p>API Key: {TMDB_API_KEY ? 'Loaded' : 'Missing'}</p>
              <p>Keywords Used: {ERROTIC_KEYWORDS}</p>
              <p>Languages: {TARGET_LANGUAGES.join(', ')}</p>
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
                      : `${IMAGE_BASE_URL}/7WsyChQlftoju694BhMqR8yV7j.jpg`} // Fallback poster
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
