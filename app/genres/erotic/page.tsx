import MoviesSection from '../../components/MoviesSection';
import Footer from '../../components/Footer';
import Link from 'next/link';

async function getFilteredEroticMovies(searchParams: { [key: string]: string | string[] | undefined }) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return [];

  const getParam = (key: string) => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : (v || '');
  };

  const year = getParam('year');
  const language = getParam('language') || 'en';
  const type = getParam('type'); // e.g., stepmom, lesbian, older_woman, etc.

  const params = new URLSearchParams();
  params.set('api_key', apiKey);
  params.set('language', 'en-US');
  params.set('sort_by', 'popularity.desc');
  params.set('with_original_language', language);

  // Base Romance/Drama genre ID on TMDB as a foundation
  params.set('with_genres', '10749');

  if (year) {
    params.set('primary_release_date.gte', `${year}-01-01`);
    params.set('primary_release_date.lte', `${year}-12-31`);
  }

  // Map custom sub-categories/types to TMDB query parameters or keyword filters if applicable
  // (You can also map specific keyword IDs if you have them from TMDB keyword searches)
  if (type) {
    // Example query adjustments based on selected theme/type
    // TMDB uses comma for AND logic, pipe (|) for OR logic
    if (type === 'lesbian') {
      params.append('with_keywords', '9840'); // Example TMDB keyword ID for lesbian theme or similar
    } else if (type === 'stepmom' || type === 'stepdad') {
      params.append('with_keywords', '1706'); // Family drama / taboo keyword mapping placeholder
    }
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (e) {
    return [];
  }
}

export default async function EroticGenrePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const movies = await getFilteredEroticMovies(searchParams);
  
  const getParam = (key: string) => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : (v || '');
  };

  const currentType = getParam('type');
  const currentYear = getParam('year');
  const currentLang = getParam('language') || 'en';

  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-blue-400 hover:underline text-sm mb-6 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Erotic &amp; Romance Collection</h1>
        <p className="text-gray-400 text-sm mb-8">Discover tailored collections based on your preferences.</p>

        {/* Unique Filter Bar */}
        <form method="GET" className="bg-[#12141c] p-4 rounded-xl border border-gray-800 flex flex-wrap gap-4 items-center mb-8">
          {/* Type / Sub-category Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Category / Theme</label>
            <select 
              name="type" 
              defaultValue={currentType}
              className="bg-[#1a1d29] text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">All Themes</option>
              <option value="lesbian">Lesbian</option>
              <option value="stepmom">Stepmom</option>
              <option value="stepdad">Stepdad</option>
              <option value="old_woman_young_boy">Older Woman / Younger Man</option>
              <option value="old_guy_young_woman">Older Man / Younger Woman</option>
            </select>
          </div>

          {/* Language Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Language</label>
            <select 
              name="language" 
              defaultValue={currentLang}
              className="bg-[#1a1d29] text-white border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">Release Year</label>
            <input 
              type="number" 
              name="year" 
              placeholder="e.g. 2023" 
              defaultValue={currentYear}
              className="bg-[#1a1d29] text-white border border-gray-700 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end self-end">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </form>

        {/* Results Section */}
        {movies.length > 0 ? (
          <MoviesSection movies={movies} />
        ) : (
          <div className="text-center py-20 bg-[#12141c] rounded-xl border border-gray-800">
            <p className="text-gray-400">No movies match your selected filters.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
