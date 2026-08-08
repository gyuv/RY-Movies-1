import MoviesSection from '../../components/MoviesSection';
import Footer from '../../components/Footer';
import Link from 'next/link';

async function getEroticMovies() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return [];
  
  try {
    // TMDB doesn't have a strict standalone "erotic" genre ID, 
    // but you can query Romance (id: 10749) or fetch discover with custom tags/keywords,
    // or link it directly back to your main page filter if you prefer.
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=10749&sort_by=popularity.desc&language=en-US`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (e) {
    return [];
  }
}

export default async function EroticGenrePage() {
  const movies = await getEroticMovies();

  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link href="/" className="text-blue-400 hover:underline text-sm mb-6 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Erotic &amp; Romance Collection</h1>
        
        {movies.length > 0 ? (
          <MoviesSection movies={movies} />
        ) : (
          <p className="text-gray-400">No movies found or API key missing.</p>
        )}
      </div>
      <Footer />
    </main>
  );
}
