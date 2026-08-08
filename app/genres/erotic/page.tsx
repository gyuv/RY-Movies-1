// app/genres/erotic/page.tsx
import Image from 'next/image';

// 1. Check your Vercel Environment Variable name!
// If it's 'NEXT_PUBLIC_TMDB_API_KEY', use that.
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Target Languages: Tamil (ta), Telugu (te), Malayalam (ml), Hindi (hi)
const TARGET_LANGUAGES = ['ta', 'te', 'ml', 'hi'];

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
    // Fetch Romance movies (Genre ID 10749) sorted by popularity
    // We also include "Drama" (18) as many erotic films are tagged Drama + Romance
    const genres = "10749,18"; 
    
    const res = await fetch(
      `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genres}&sort_by=popularity.desc&language=en-US`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      throw new Error(`TMDB Error: ${res.status}`);
    }

    const data = await res.json();
    const allMovies: Movie[] = data.results;

    // Filter for specific Indian Languages
    const filteredMovies = allMovies.filter((movie: Movie) => 
      TARGET_LANGUAGES.includes(movie.original_language)
    );

    // Limit to 20 movies
    return filteredMovies.slice(0, 20);

  } catch (error) {
    console.error("Error fetching erotic content:", error);
    return [];
  }
}

export default async function EroticPage() {
  const movies = await fetchEroticContent();

  // Helper to get language name
  const getLangName = (code: string) => {
    const langs: Record<string, string> = {
      ta: 'Tamil',
      te: 'Telugu',
      ml: 'Malayalam',
      hi: 'Hindi'
    };
    return langs[code] || code;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-pink-500">
        Erotic & Romantic Collection
      </h1>
      
      {movies.length === 0 ? (
        <div className="text-center text-gray-400">
          <p>No movies found. Check your API Key and Network.</p>
          <p className="text-sm mt-2">API Key: {TMDB_API_KEY ? 'Loaded' : 'Missing'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-pink-500/20 transition-all duration-300">
              <div className="relative h-96 w-full">
                <Image
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {getLangName(movie.original_language)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <h2 className="text-lg font-bold truncate">{movie.title}</h2>
                  <p className="text-gray-300 text-xs mt-1">⭐ {movie.vote_average.toFixed(1)}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-400 text-sm line-clamp-3">{movie.overview}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
