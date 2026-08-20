import Image from 'next/image';
import Link from 'next/link';

// 🔑 API Configuration
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// 🎬 Data Interface
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  original_language: string;
  release_date: string;
  popularity: number;
  adult: boolean;
}

// 🏷️ FreudX-Style Keywords
// This list targets the "Hardcore" and "Exotic" niche specifically
const FREUDX_KEYWORDS = '1009,1493,1896,2123,11836,12295,17165,17664,20594,23038,25463,27047,2924,2926,3213,3603,4365,4607,5451,5991,6622,7236,7755,8093,9303,1009,1493,1896,2123';

// 🎭 Genres to pair with keywords for better coverage
const TARGET_GENRES = '10749,18,53,9648'; // Romance, Drama, Thriller, Mystery

// 🌍 Target Languages (FreudX has a strong international focus)
const TARGET_LANGUAGES = ['pl', 'ko', 'fr', 'en', 'es', 'hi', 'ta', 'te', 'ml', 'pt', 'ru', 'ja', 'zh'];

/**
 * Fetches content using FreudX-style keywords
 */
async function fetchEroticContent(): Promise<Movie[]> {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is missing!");
    return [];
  }

  try {
    const promises = TARGET_LANGUAGES.map(async (lang) => {
      // Use both keywords and genres to ensure we get "Hardcore" content
      const res = await fetch(
        `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=${FREUDX_KEYWORDS}&with_genres=${TARGET_GENRES}&with_original_language=${lang}&sort_by=popularity.desc&vote_count.gte=15&include_adult=true&include_video=false`,
        { 
          next: { revalidate: 3600 },
          headers: { 'Accept': 'application/json' }
        }
      );

      if (!res.ok) {
        console.warn(`Failed to fetch for language ${lang}: ${res.status}`);
        return [];
      }
      
      const data = await res.json();
      return data.results || [];
    });

    const results = await Promise.all(promises);
    const allMovies: Movie[] = results.flat();
    
    // Remove duplicates
    const uniqueMovies = Array.from(new Map(allMovies.map(item => [item.id, item])).values());
    
    // Sort by Popularity
    const sortedMovies = uniqueMovies.sort((a, b) => b.popularity - a.popularity);
    
    // Return top 24 (FreudX often shows more items)
    return sortedMovies.slice(0, 24);

  } catch (error) {
    console.error("Error fetching erotic content:", error);
    return [];
  }
}

/**
 * Helper to get human-readable language names
 */
const getLangName = (code: string) => {
  const langs: Record<string, string> = {
    pl: 'PL', ko: 'KR', fr: 'FR', en: 'EN', es: 'ES', hi: 'HI', ta: 'TA', te: 'TE', ml: 'ML',
    pt: 'PT', ru: 'RU', ja: 'JP', zh: 'CN', de: 'DE', it: 'IT', ar: 'AR', tr: 'TR', sv: 'SE',
    no: 'NO', da: 'DK', fi: 'FI', nl: 'NL', id: 'ID', ms: 'MS', th: 'TH', vi: 'VN', he: 'IL'
  };
  return langs[code] || code.toUpperCase();
};

export default async function FreudXPage() {
  const movies = await fetchEroticContent();

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans">
      {/* Header */}
      <div className="relative w-full h-48 bg-gradient-to-b from-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534528741775-53994a695755?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto p-6">
          <h1 className="text-5xl font-black tracking-tighter text-white uppercase">
            Freud<span className="text-red-600">X</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2 uppercase tracking-widest">
            Global Hardcore & Erotic Collection
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto p-6">
        {movies.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>No content found matching the FreudX criteria.</p>
            <p className="text-xs mt-2">Check TMDB API Key & Adult Content settings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <Link 
                key={movie.id} 
                href={`/movie/${movie.id}`} 
                className="group relative block aspect-[2/3] overflow-hidden bg-gray-900"
              >
                {movie.poster_path ? (
                  <Image
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110 group-hover:grayscale-0 grayscale"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 15vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-800 text-gray-600 text-xs">
                    No Image
                  </div>
                )}
                
                {/* Hover Overlay - FreudX style is subtle and sleek */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                
                {/* Info Bar on Hover */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white truncate w-32">{movie.title}</span>
                    <span className="text-[10px] text-gray-400">{movie.release_date?.slice(0, 4)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-red-500">{movie.vote_average.toFixed(1)}</span>
                    <span className="text-[10px] text-gray-500 uppercase border border-gray-700 px-1 rounded">
                      {getLangName(movie.original_language)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="text-center py-8 text-gray-600 text-xs uppercase tracking-widest">
        FreudX • Curated by TMDB
      </div>
    </div>
  );
}
