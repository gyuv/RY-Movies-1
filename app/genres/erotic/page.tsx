import Image from 'next/image';
import Link from 'next/link';

// --- CONFIG ---
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

// Keywords for "Hardcore" content
// 620 = Erotic, 2123 = Bed Scene, 1493 = Passion, 1896 = Love Triangle
const KEYWORDS = '620,2123,1493,1896';
const TARGET_LANGS = ['pl', 'ko', 'fr', 'en', 'es', 'hi', 'ja', 'de', 'it', 'pt'];

// --- INTERFACES ---
interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  original_language: string;
  popularity: number;
  adult: boolean;
  overview: string;
  genre_ids?: number[]; // Added this to fix the TS error
}

// --- LOGIC ---

async function fetchEroticContent() {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is missing!");
    return [];
  }

  let movies: Movie[] = [];

  // Strategy 1: Fetch by Keywords for specific languages
  const promises = TARGET_LANGS.map(async (lang) => {
    const url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=${KEYWORDS}&with_original_language=${lang}&sort_by=popularity.desc&vote_count.gte=5&include_adult=true&include_video=false`;
    
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) return [];
      const data = await res.json();
      return data.results || [];
    } catch (e) {
      console.warn(`Failed to fetch for ${lang}`);
      return [];
    }
  });

  const results = await Promise.all(promises);
  movies = results.flat();

  // Strategy 2: Fallback if keywords return very few results
  // Use /discovery/popular which guarantees adult/popularity fields
  if (movies.length < 10) {
    try {
      const fallbackUrl = `${BASE_URL}/discovery/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&include_adult=true&with_original_language=en&vote_count.gte=100`;
      const res = await fetch(fallbackUrl, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        const fallbackMovies = data.results || [];
        
        // Merge and deduplicate
        const existingIds = new Set(movies.map(m => m.id));
        fallbackMovies.forEach(m => {
          if (!existingIds.has(m.id)) movies.push(m);
        });
      }
    } catch (e) {
      console.error("Fallback fetch failed", e);
    }
  }

  // Deduplicate by ID
  movies = Array.from(new Map(movies.map(item => [item.id, item])).values());

  // Sort by Popularity
  movies.sort((a, b) => b.popularity - a.popularity);

  // Return top 20
  return movies.slice(0, 20);
}

// --- COMPONENT ---

export default async function EroticPage() {
  const movies = await fetchEroticContent();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="py-8 px-4 md:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
            Hardcore Erotic Collection
          </h1>
          <p className="text-zinc-400 text-sm md:text-base">
            Global Hits: 365 Days, The Handmaiden, Nymphomaniac & More
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {movies.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p>No movies found. Check your API Key and TMDB Dashboard "Adult" settings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="group relative block aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
              >
                {movie.poster_path ? (
                  <Image
                    src={`${IMG_BASE}${movie.poster_path}`}
                    alt={movie.title}
                    width={300}
                    height={450}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600 text-xs">
                    No Image
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p className="text-xs text-zinc-300 line-clamp-2 mb-1">{movie.overview}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-zinc-500">{movie.release_date?.slice(0, 4)}</span>
                    <span className="text-xs font-bold text-yellow-400">★ {movie.vote_average.toFixed(1)}</span>
                  </div>
                </div>

                {/* 18+ Badge */}
                <div className="absolute top-2 right-2">
                  <span className="px-1.5 py-0.5 bg-pink-600/90 text-[10px] font-bold rounded text-white uppercase">
                    18+
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
