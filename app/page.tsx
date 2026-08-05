import Link from 'next/link';
import Image from 'next/image';

// Fetch popular movies from TMDB
async function getPopularMovies() {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    );
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return [];
  }
}

export default async function Home() {
  const movies = await getPopularMovies();

  return (
    <main className="min-h-screen bg-ink text-paper p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">Popular Movies</h1>
        
        {movies.length === 0 ? (
          <p className="text-gray-400">No movies found. Check your TMDB API Key.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie: any) => (
              <Link 
                key={movie.id} 
                href={`/media/${movie.id}`} 
                className="group relative block aspect-[2/3] overflow-hidden rounded-md border border-gray-800 bg-gray-900 transition-transform hover:scale-105"
              >
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs p-2 text-center">
                    {movie.title}
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <div className="text-white">
                    <p className="font-bold text-sm truncate">{movie.title}</p>
                    <p className="text-xs text-gray-300">★ {movie.vote_average.toFixed(1)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
