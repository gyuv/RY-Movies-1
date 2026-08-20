import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// --- CONFIG ---
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

// Known Adult Keyword IDs (Verify these are still active in TMDB)
const KEYWORDS = '620,2123,1493'; // Erotic, Bed Scene, Passion
const TARGET_LANGS = ['pl', 'ko', 'fr', 'en', 'es', 'hi', 'ja', 'de', 'it', 'pt'];

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
}

// --- LOGIC ---

async function fetchEroticContent(debug: boolean = false): Promise<Movie[]> {
  if (!TMDB_API_KEY) {
    if (debug) console.log("DEBUG: API Key Missing");
    return [];
  }

  // 1. Sanity Check: Does the API key actually allow Adult content?
  // We test against ID 530969 (365 Days)
  try {
    const testRes = await fetch(`${BASE_URL}/movie/530969?api_key=${TMDB_API_KEY}&include_adult=true`);
    if (!testRes.ok) {
      if (debug) console.warn("DEBUG: API Key Error for Adult Check:", testRes.status);
      // If it fails, we can still try other methods, but it's a bad sign.
    }
  } catch (e) {
    if (debug) console.error("DEBUG: Could not verify Adult Access", e);
  }

  // Strategy 1: Keywords + Languages
  let movies: Movie[] = [];
  
  // We only fetch keywords if we haven't found enough movies via fallback later, 
  // but to respect the prompt, we try keywords first.
  
  const keywordPromises = TARGET_LANGS.map(async (lang) => {
    const url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=${KEYWORDS}&with_original_language=${lang}&sort_by=popularity.desc&vote_count.gte=10&include_adult=true&include_video=false`;
    
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) return [];
      const data = await res.json();
      return data.results || [];
    } catch (e) {
      if (debug) console.warn(`DEBUG: Keyword fetch failed for ${lang}`);
      return [];
    }
  });

  const keywordResults = await Promise.all(keywordPromises);
  movies = keywordResults.flat();

  // Deduplicate
  movies = Array.from(new Map(movies.map(item => [item.id, item])).values());
  
  // If keywords returned very few results (e.g., < 10), fallback to Top Rated Adult
  if (movies.length < 15) {
    if (debug) console.log(`DEBUG: Only ${movies.length} keyword results. Falling back to Top Rated Adult.`);
    
    // Strategy 2: Top Rated Adult Movies (Global)
    // This is often more reliable for "Hardcore" hits than specific keywords
    try {
      const topRes = await fetch(`${BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&include_adult=true&language=en-US`, { next: { revalidate: 3600 } });
      if (topRes.ok) {
        const topData = await topRes.json();
        // Filter for adult movies and sort by popularity
        const adultMovies = topData.results
          .filter((m: Movie) => m.adult === true || m.genre_ids?.includes(17)) // 17 is Romance
          .sort((a: Movie, b: Movie) => b.popularity - a.popularity)
          .slice(0, 20);
        
        // Merge with existing keywords (avoiding duplicates)
        const existingIds = new Set(movies.map(m => m.id));
        adultMovies.forEach(m => {
          if (!existingIds.has(m.id)) {
            movies.push(m);
          }
        });
      }
    } catch (e) {
      if (debug) console.error("DEBUG: Fallback fetch failed", e);
    }
  }

  // Final Sort by Popularity
  movies.sort((a, b) => b.popularity - a.popularity);

  // Limit to 20
  return movies.slice(0, 20);
}

// --- COMPONENT ---

export default async function EroticPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const debug = searchParams?.debug === '1';
  const movies = await fetchEroticContent(debug === true);

  if (movies.length === 0 && debug) {
    return (
      <div className="min-h-screen bg-black text-white p-8 font-mono">
        <h1 className="text-2xl text-red-500 mb-4">Debug Mode: No Content</h1>
        <div className="space-y-2 text-sm text-gray-400">
          <p>API Key: {TMDB_API_KEY ? 'Present' : 'Missing'}</p>
          <p>Keywords: {KEYWORDS}</p>
          <p>Languages: {TARGET_LANGS.join(', ')}</p>
          <p className="mt-4 text-yellow-500">
            1. Go to <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" className="underline">TMDB API Settings</a> and ensure "Adult" is enabled.
          </p>
          <p className="text-yellow-500">2. Wait 24 hours for changes to propagate.</p>
          <p className="text-yellow-500">3. Verify your API Key has the "Read" access token.</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return notFound(); // Or show a generic "No movies found" UI
  }

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
          {debug && (
            <div className="mt-4 inline-block px-3 py-1 bg-zinc-900 rounded text-xs text-green-400 border border-zinc-700">
              DEBUG MODE ON
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="group relative block aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
            >
              <Image
                src={movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : '/placeholder-poster.jpg'}
                alt={movie.title}
                width={300}
                height={450}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                unoptimized // Optional: if you have domain issues with Next.js image optimization
              />
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-xs text-zinc-300 line-clamp-2 mb-1">{movie.overview}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 uppercase">{movie.release_date?.slice(0, 4)}</span>
                  <span className="text-xs font-bold text-yellow-400">★ {movie.vote_average.toFixed(1)}</span>
                </div>
              </div>

              {/* Badge for Adult */}
              <div className="absolute top-2 right-2">
                <span className="px-1.5 py-0.5 bg-pink-600/90 text-[10px] font-bold rounded text-white uppercase tracking-wider">
                  18+
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Debug Toggle */}
        <div className="mt-12 text-center">
          <Link 
            href="?debug=1" 
            className="text-xs text-zinc-600 hover:text-zinc-400 underline"
          >
            {debug ? 'Hide Debug' : 'Show Debug Info'}
          </Link>
        </div>
      </main>
    </div>
  );
}
