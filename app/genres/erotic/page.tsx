
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

// 🏷️ FreudX-Style Keywords (More inclusive)
const FREUDX_KEYWORDS = '1009,1493,1896,2123,11836,12295,17165,17664,20594,23038,25463,27047,2924,2926,3213,3603,4365,4607,5451,5991,6622,7236,7755,8093,9303';

// 🎭 Genres to pair with keywords for better coverage
const TARGET_GENRES = '10749,18,53,9648'; // Romance, Drama, Thriller, Mystery

// 🌍 Target Languages
const TARGET_LANGUAGES = ['pl', 'ko', 'fr', 'en', 'es', 'hi', 'ta', 'te', 'ml', 'pt', 'ru', 'ja', 'zh'];

/**
 * Fetches content using a dual strategy: erotic Keywords (OR) + sensual
 * Romance genre. IMPORTANT: TMDB treats commas in `with_genres`/`with_keywords`
 * as AND and the pipe `|` as OR — we use OR so results are broad, not empty.
 */
async function fetchEroticContent(): Promise<Movie[]> {
  if (!TMDB_API_KEY) return [];

  // OR-join the curated erotic keyword ids.
  const keywordsOR = FREUDX_KEYWORDS.split(',').join('|');

  const get = async (query: string): Promise<Movie[]> => {
    try {
      const res = await fetch(`${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&${query}`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.results || []) as Movie[];
    } catch {
      return [];
    }
  };

  try {
    const requests: Promise<Movie[]>[] = [];

    // 1. Erotic KEYWORDS (OR) across pages — the core of the collection.
    for (let page = 1; page <= 3; page++) {
      requests.push(
        get(
          `with_keywords=${keywordsOR}&sort_by=popularity.desc&vote_count.gte=1&include_adult=true&include_video=false&page=${page}`
        )
      );
    }

    // 2. Sensual ROMANCE genre (single genre = broad) as reliable fallback.
    for (let page = 1; page <= 2; page++) {
      requests.push(
        get(
          `with_genres=10749&sort_by=popularity.desc&vote_count.gte=40&include_adult=true&include_video=false&page=${page}`
        )
      );
    }

    // 3. A couple of high-heat languages known for the genre.
    for (const lang of ['ko', 'fr', 'ja']) {
      requests.push(
        get(
          `with_keywords=${keywordsOR}&with_original_language=${lang}&sort_by=popularity.desc&vote_count.gte=1&include_adult=true&page=1`
        )
      );
    }

    const all = (await Promise.all(requests)).flat();

    // Deduplicate, require a poster, sort by popularity.
    const unique = Array.from(new Map(all.map((m) => [m.id, m])).values())
      .filter((m) => m.poster_path)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

    return unique.slice(0, 36);
  } catch (error) {
    console.error(error);
    return [];
  }
}

import MediaCard from '../../components/MediaCard';
import { SectionTitle } from '@/components/apex';

export default async function EroticPage() {
  const movies = await fetchEroticContent();

  return (
    <main className="min-h-screen bg-apex-void text-paper">
      <div className="mx-auto max-w-[1600px] py-10">
        {/* Premium header */}
        <div className="mb-8 flex flex-col gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <SectionTitle kicker="Adults Only" title="Erotic" size="lg" as="h1" />
            <span className="mt-6 rounded-md border border-marquee/50 bg-marquee/10 px-2 py-0.5 text-[11px] font-bold tracking-wider text-marquee">
              18+
            </span>
          </div>
          <p className="max-w-2xl text-sm text-white/50">
            Sensual thrillers, romance and drama for mature audiences. Viewer discretion advised.
          </p>
        </div>

        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
            <div className="mb-4 h-16 w-16 text-ink-line">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="mb-2 font-heading text-xl font-semibold text-white">No titles available</h3>
            <p className="max-w-md text-sm text-white/45">
              We couldn&apos;t load this collection right now. This may require the TMDB API key
              ({TMDB_API_KEY ? 'loaded' : 'missing'}) and adult-content access.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:gap-5 sm:px-6 md:grid-cols-4 lg:grid-cols-5 lg:gap-6 lg:px-8 xl:grid-cols-6 2xl:grid-cols-7">
            {movies.map((movie, i) => (
              <div key={movie.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
                <MediaCard
                  id={movie.id}
                  title={movie.title}
                  poster_path={movie.poster_path}
                  vote_average={movie.vote_average}
                  release_date={movie.release_date}
                  media_type="movie"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
