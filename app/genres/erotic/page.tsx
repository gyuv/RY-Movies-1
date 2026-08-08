// app/genres/erotic/page.tsx
import Image from 'next/image';

// TMDB API Configuration
const TMDB_API_KEY = process.env.TMDB_API_KEY; // Add this to your .env.local
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Language codes for Tamil, Telugu, Malayalam, Hindi
const LANGUAGES = [
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'hi', name: 'Hindi' },
];

// Genre IDs: 10749 is Romance, 55 is Adult (if available)
// Note: TMDB doesn't have a dedicated "Erotic" genre, so we use Romance + filter by popularity/vote
const GENRE_ID = 10749; // Romance

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  original_language: string;
}

async function fetchEroticMovies(): Promise<Movie[]> {
  try {
    // Fetch top romantic movies across all languages
    const res = await fetch(
      `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${GENRE_ID}&sort_by=popularity.desc&language=en-US`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) {
      throw new Error('Failed to fetch movies');
    }

    const data = await res.json();
    
    // Filter for Tamil, Telugu, Malayalam, and Hindi
    const filteredMovies = data.results.filter((movie: Movie) => {
      const langCode = movie.original_language;
      return LANGUAGES.some(l => l.code === langCode);
    });

    return filteredMovies.slice(0, 20); // Limit to 20 movies
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

export default async function EroticPage() {
  const movies = await fetchEroticMovies();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Erotic & Romantic Collection</h1>
      
      {movies.length === 0 ? (
        <p className="text-center text-gray-400">No movies found. Check your TMDB API Key.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((movie) => {
            // Determine language name
            const langName = LANGUAGES.find(l => l.code === movie.original_language)?.name || 'Other';

            return (
              <div key={movie.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform">
                <div className="relative w-full h-80">
                  <Image
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    {langName}
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-1 truncate">{movie.title}</h2>
                  <p className="text-gray-400 text-sm line-clamp-2">{movie.overview}</p>
                  <div className="mt-2 text-yellow-400 text-sm">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
