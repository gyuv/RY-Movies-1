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
  const language = getParam('language') || 'hi'; // Default to Hindi or English as primary preference
  const type = getParam('type');

  const params = new URLSearchParams();
  params.set('api_key', apiKey);
  params.set('language', 'en-US');
  params.set('sort_by', 'popularity.desc');
  params.set('with_original_language', language);

  // Using Romance (10749) and Drama (18) as the baseline genre scope for mature/intense content
  params.set('with_genres', '10749,18');

  if (year) {
    params.set('primary_release_date.gte', `${year}-01-01`);
    params.set('primary_release_date.lte', `${year}-12-31`);
  } else {
    params.set('primary_release_date.gte', '1990-01-01');
    const today = new Date().toISOString().split('T')[0];
    params.set('primary_release_date.lte', today);
  }

  // Optional thematic keywords mapping
  if (type === 'lesbian') {
    params.append('with_keywords', '9840');
  } else if (type === 'stepmom' || type === 'stepdad' || type === 'old_woman_young_boy') {
    params.append('with_keywords', '1706'); // family/relationship drama keyword
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
  const currentLang = getParam('language') || 'hi';

  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-blue-400 hover:underline text-sm mb-6 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Erotic &amp; Romance Collection</h1>
        <p className="text-gray-400 text-sm mb-8">Explore specialized cinematic content across Hindi, Tamil, Telugu, Malayalam, and more.</p>

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
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="ml">Malayalam</option>
              <option value="en">English</option>
              <option value="ko">Korean</option>
              <option value="ja">Japanese</option>
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
            <p className="text-gray-400">No content available for this specific combination. Try changing the language or theme.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
