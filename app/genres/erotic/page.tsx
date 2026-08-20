import Image from 'next/image';
import Link from 'next/link';

// Use your exact env var name
const TMDB_API_KEY = process.env.TMDB_API_KEY; 

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
  popularity: number;
}

const EROTIC_KEYWORDS = '620,2123,1493,1896';
const TARGET_LANGUAGES = ['pl', 'ko', 'fr', 'en', 'es', 'hi', 'ta', 'te', 'ml'];

async function fetchEroticContent(): Promise<Movie[]> {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is missing!");
    return [];
  }

  try {
    const promises = TARGET_LANGUAGES.map(async (lang) => {
      const res = await fetch(
        `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=${EROTIC_KEYWORDS}&with_original_language=${lang}&sort_by=popularity.desc&vote_count.gte=20&include_adult=true&include_video=false`,
        { 
          next: { revalidate: 3600 },
          headers: { 'Accept': 'application/json' }
        }
      );

      if (!res.ok) {
        console.warn(`Failed to fetch for language ${lang}: ${res.status} ${res.statusText}`);
        return [];
      }
      
      const data = await res.json();
      return data.results || [];
    });

    const results = await Promise.all(promises);
    const allMovies: Movie[] = results.flat();
    const uniqueMovies = Array.from(new Map(allMovies.map(item => [item.id, item])).values());
    const sortedMovies = uniqueMovies.sort((a, b) => b.popularity - a.popularity);
    
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
      pl: 'Polish',
      ko: 'Korean',
      fr: 'French',
      en: 'English',
      es: 'Spanish',
      hi: 'Hindi',
      ta: 'Tamil',
      te: 'Telugu',
      ml: 'Malayalam',
      bn: 'Bengali',
      de: 'German',
      it: 'Italian'
    };
    return langs[code] || code.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-pink-500">
          Hardcore Erotic Collection
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Global Hits: 365 Days, The Handmaiden, Nymphomaniac & More
        </p>
        
        {movies.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl font-semibold text-pink-400">No movies found.</p>
            <div className="mt-4 p-4 bg-gray-900 rounded-lg max-w-md mx-auto text-left text-xs font-mono">
              <p><strong>Debug:</strong></p>
              <p>API Key: {TMDB_API_KEY ? 'Loaded' : 'Missing'}</p>
              <p>Keywords: {EROTIC_KEYWORDS}</p>
              <p>Languages: {TARGET_LANGUAGES.join(', ')}</p>
              <p className="mt-2">⚠️ Check TMDB Dashboard: Ensure you have access to the 'Adult' content flag enabled for your API key.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <Link 
                key={movie.id} 
                href={`/movie/${movie.id}`} 
                className="group relative block aspect-[2/3] overflow-hidden rounded-lg bg-gray-900"
              >
                {movie.poster_path ? (
                  <Image
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 15vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-800 text-gray-500">
                    No Poster
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-sm font-bold text-white line-clamp-2">{movie.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-300">{movie.release_date?.slice(0, 4)}</span>
                    <span className="text-xs font-medium text-yellow-400">★ {movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
