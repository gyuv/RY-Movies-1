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
  genre_ids: number[];
}

// 🏷️ Keywords for "Hardcore/Erotic" content
// 620 = Erotic, 1009 = Sex, 2123 = Bed Scene, 1493 = Passion, 1896 = Love Triangle
const EROTIC_KEYWORDS = '620,1009,2123,1493,1896';

// 🎭 Genres to include (Erotic Thriller, Romance, Drama)
// 5285 = Erotic Thriller, 10749 = Romance, 18 = Drama
const TARGET_GENRES = '5285,10749,18';

// 🌍 Target Languages
const TARGET_LANGUAGES = ['pl', 'ko', 'fr', 'en', 'es', 'hi', 'ta', 'te', 'ml'];

/**
 * Fetches erotic content from TMDB using a hybrid approach (Keywords + Genres)
 */
async function fetchEroticContent(): Promise<Movie[]> {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is missing!");
    return [];
  }

  try {
    const promises = TARGET_LANGUAGES.map(async (lang) => {
      // Fetch using both keywords and genres, sorted by popularity
      const res = await fetch(
        `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_keywords=${EROTIC_KEYWORDS}&with_genres=${TARGET_GENRES}&with_original_language=${lang}&sort_by=popularity.desc&vote_count.gte=10&include_adult=true&include_video=false`,
        { 
          next: { revalidate: 3600 }, // Cache for 1 hour
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

    // Wait for all language fetches
    const results = await Promise.all(promises);
    
    // Flatten array
    const allMovies: Movie[] = results.flat();

    // Remove duplicates based on ID
    const uniqueMovies = Array.from(new Map(allMovies.map(item => [item.id, item])).values());

    // Sort by Popularity (descending) to get big hits like 365 Days first
    const sortedMovies = uniqueMovies.sort((a, b) => b.popularity - a.popularity);

    // Return top 20
    return sortedMovies.slice(0, 20);

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
    it: 'Italian',
    ja: 'Japanese',
    pt: 'Portuguese',
    ru: 'Russian',
    sv: 'Swedish',
    no: 'Norwegian',
    da: 'Danish',
    fi: 'Finnish',
    nl: 'Dutch',
    tr: 'Turkish',
    ar: 'Arabic',
    zh: 'Chinese',
    th: 'Thai',
    vi: 'Vietnamese',
    id: 'Indonesian',
    ms: 'Malay',
    he: 'Hebrew',
    cs: 'Czech',
    hu: 'Hungarian',
    ro: 'Romanian',
    bg: 'Bulgarian',
    hr: 'Croatian',
    sk: 'Slovak',
    sl: 'Slovenian',
    sr: 'Serbian',
    uk: 'Ukrainian',
    et: 'Estonian',
    lv: 'Latvian',
    lt: 'Lithuanian',
    is: 'Icelandic',
    ga: 'Irish',
    cy: 'Welsh',
    eu: 'Basque',
    ca: 'Catalan',
    gl: 'Galician',
    af: 'Afrikaans',
    sw: 'Swahili',
    zu: 'Zulu',
    xh: 'Xhosa',
    so: 'Somali',
    am: 'Amharic',
    or: 'Oriya',
    ne: 'Nepali',
    si: 'Sinhala',
    my: 'Burmese',
    km: 'Khmer',
    lo: 'Lao',
    ka: 'Georgian',
    hy: 'Armenian',
    az: 'Azerbaijani',
    kk: 'Kazakh',
    ky: 'Kyrgyz',
    uz: 'Uzbek',
    tg: 'Tajik',
    mn: 'Mongolian',
    ps: 'Pashto',
    sd: 'Sindhi',
    ur: 'Urdu',
    fa: 'Persian',
    ku: 'Kurdish',
    be: 'Belarusian',
    mk: 'Macedonian',
    sq: 'Albanian',
    bs: 'Bosnian',
    lt: 'Lithuanian',
    el: 'Greek',
    pt: 'Portuguese',
    ro: 'Romanian',
    bg: 'Bulgarian',
    hr: 'Croatian',
    sr: 'Serbian',
    sl: 'Slovenian',
    sk: 'Slovak',
    cs: 'Czech',
    hu: 'Hungarian',
    pl: 'Polish',
    de: 'German',
    it: 'Italian',
    es: 'Spanish',
    fr: 'French',
    en: 'English',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ar: 'Arabic',
    hi: 'Hindi',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
    ml: 'Malayalam',
    kn: 'Kannada',
    mr: 'Marathi',
    gu: 'Gujarati',
    pa: 'Punjabi',
    as: 'Assamese',
    or: 'Oriya',
    ne: 'Nepali',
    si: 'Sinhala',
    my: 'Burmese',
    km: 'Khmer',
    lo: 'Lao',
    ka: 'Georgian',
    hy: 'Armenian',
    az: 'Azerbaijani',
    kk: 'Kazakh',
    ky: 'Kyrgyz',
    uz: 'Uzbek',
    tg: 'Tajik',
    mn: 'Mongolian',
    ps: 'Pashto',
    sd: 'Sindhi',
    ur: 'Urdu',
    fa: 'Persian',
    ku: 'Kurdish',
    be: 'Belarusian',
    mk: 'Macedonian',
    sq: 'Albanian',
    bs: 'Bosnian',
    eu: 'Basque',
    ca: 'Catalan',
    gl: 'Galician',
    af: 'Afrikaans',
    sw: 'Swahili',
    zu: 'Zulu',
    xh: 'Xhosa',
    so: 'Somali',
    am: 'Amharic',
    id: 'Indonesian',
    ms: 'Malay',
    th: 'Thai',
    vi: 'Vietnamese',
    he: 'Hebrew',
    is: 'Icelandic',
    ga: 'Irish',
    cy: 'Welsh',
    et: 'Estonian',
    lv: 'Latvian',
    lt: 'Lithuanian',
    fi: 'Finnish',
    sv: 'Swedish',
    no: 'Norwegian',
    da: 'Danish',
    nl: 'Dutch',
    tr: 'Turkish',
    ru: 'Russian',
    uk: 'Ukrainian',
    bg: 'Bulgarian',
    ro: 'Romanian',
    hu: 'Hungarian',
    cs: 'Czech',
    sk: 'Slovak',
    sl: 'Slovenian',
    hr: 'Croatian',
    sr: 'Serbian',
    bs: 'Bosnian',
    mk: 'Macedonian',
    sq: 'Albanian',
    el: 'Greek',
    pt: 'Portuguese',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    en: 'English',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ar: 'Arabic',
    hi: 'Hindi',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
    ml: 'Malayalam',
    kn: 'Kannada',
    mr: 'Marathi',
    gu: 'Gujarati',
    pa: 'Punjabi',
    as: 'Assamese',
    or: 'Oriya',
    ne: 'Nepali',
    si: 'Sinhala',
    my: 'Burmese',
    km: 'Khmer',
    lo: 'Lao',
    ka: 'Georgian',
    hy: 'Armenian',
    az: 'Azerbaijani',
    kk: 'Kazakh',
    ky: 'Kyrgyz',
    uz: 'Uzbek',
    tg: 'Tajik',
    mn: 'Mongolian',
    ps: 'Pashto',
    sd: 'Sindhi',
    ur: 'Urdu',
    fa: 'Persian',
    ku: 'Kurdish',
    be: 'Belarusian',
    mk: 'Macedonian',
    sq: 'Albanian',
    bs: 'Bosnian',
    eu: 'Basque',
    ca: 'Catalan',
    gl: 'Galician',
    af: 'Afrikaans',
    sw: 'Swahili',
    zu: 'Zulu',
    xh: 'Xhosa',
    so: 'Somali',
    am: 'Amharic',
    id: 'Indonesian',
    ms: 'Malay',
    th: 'Thai',
    vi: 'Vietnamese',
    he: 'Hebrew',
    is: 'Icelandic',
    ga: 'Irish',
    cy: 'Welsh',
    et: 'Estonian',
    lv: 'Latvian',
    lt: 'Lithuanian',
    fi: 'Finnish',
    sv: 'Swedish',
    no: 'Norwegian',
    da: 'Danish',
    nl: 'Dutch',
    tr: 'Turkish',
    ru: 'Russian',
    uk: 'Ukrainian',
    bg: 'Bulgarian',
    ro: 'Romanian',
    hu: 'Hungarian',
    cs: 'Czech',
    sk: 'Slovak',
    sl: 'Slovenian',
    hr: 'Croatian',
    sr: 'Serbian',
    bs: 'Bosnian',
    mk: 'Macedonian',
    sq: 'Albanian',
    el: 'Greek',
    pt: 'Portuguese',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    en: 'English',
    ja: 'Japanese',
    ko: 'Korean',
    zh: 'Chinese',
    ar: 'Arabic',
    hi: 'Hindi',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
    ml: 'Malayalam',
    kn: 'Kannada',
    mr: 'Marathi',
    gu: 'Gujarati',
    pa: 'Punjabi',
    as: 'Assamese',
    or: 'Oriya',
    ne: 'Nepali',
    si: 'Sinhala',
    my: 'Burmese',
    km: 'Khmer',
    lo: 'Lao',
    ka: 'Georgian',
    hy: 'Armenian',
    az: 'Azerbaijani',
    kk: 'Kazakh',
    ky: 'Kyrgyz',
    uz: 'Uzbek',
    tg: 'Tajik',
    mn: 'Mongolian',
    ps: 'Pashto',
    sd: 'Sindhi',
    ur: 'Urdu',
    fa: 'Persian',
    ku: 'Kurdish',
    be: 'Belarusian',
    mk: 'Macedonian',
    sq: 'Albanian',
    bs: 'Bosnian',
    eu: 'Basque',
    ca: 'Catalan',
    gl: 'Galician',
    af: 'Afrikaans',
    sw: 'Swahili',
    zu: 'Zulu',
    xh: 'Xhosa',
    so: 'Somali',
    am: 'Amharic',
  };
  return langs[code] || code.toUpperCase();
};

export default async function EroticPage() {
  const movies = await fetchEroticContent();

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
              <p>Genres: {TARGET_GENRES}</p>
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
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Movie Info on Hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-sm font-bold text-white line-clamp-2">{movie.title}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-300">{movie.release_date?.slice(0, 4)}</span>
                    <span className="text-xs font-medium text-yellow-400">★ {movie.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="mt-1">
                    <span className="inline-block px-2 py-0.5 bg-pink-600 text-white text-[10px] rounded-full uppercase font-bold tracking-wider">
                      {getLangName(movie.original_language)}
                    </span>
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
