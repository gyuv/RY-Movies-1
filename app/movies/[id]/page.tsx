import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  runtime: number;
  genres: { name: string }[];
  // ✅ FIX: Add the correct TMDB type for cast
  credits: {
    cast: Array<{
      id: number;
      name: string;
      profile_path: string | null;
      character: string;
    }>;
  };
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const id = params.id;
  
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`, {
    next: { revalidate: 86400 }
  });

  if (!res.ok) {
    return notFound();
  }

  const movie: MovieDetails = await res.json();

  // This now works because 'credits' is in the interface
  const topCast = movie.credits?.cast?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Backdrop */}
      <div className="relative w-full h-[50vh]">
        {movie.backdrop_path ? (
          <Image
            src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover opacity-50"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 p-8 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">{movie.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-300">
            <span>{movie.release_date?.slice(0, 4)}</span>
            <span>{movie.runtime} min</span>
            <span className="text-yellow-400">★ {movie.vote_average.toFixed(1)}</span>
          </div>
        </div>
        
        <Link 
          href="/genres/erotic" 
          className="absolute top-4 left-4 bg-black/50 hover:bg-black/80 text-white px-4 py-2 rounded-full text-sm font-bold transition"
        >
          ← Back to Collection
        </Link>
      </div>

      <div className="max-w-5xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {movie.poster_path ? (
            <Image
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={450}
              className="rounded-lg shadow-2xl"
            />
          ) : null}
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Overview</h2>
          <p className="text-gray-300 leading-relaxed mb-8">{movie.overview}</p>

          <h2 className="text-2xl font-bold mb-4">Cast</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {topCast.map((actor) => (
              <div key={actor.id} className="flex-shrink-0 w-24">
                {actor.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                    alt={actor.name}
                    width={100}
                    height={150}
                    className="rounded-full object-cover w-24 h-24"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-800 rounded-full" />
                )}
                <p className="text-xs text-center mt-2 text-gray-400">{actor.name}</p>
              </div>
            ))}
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Genres</h2>
          <div className="flex gap-2">
            {movie.genres?.map((g) => (
              <span key={g.name} className="bg-gray-800 text-xs px-3 py-1 rounded-full text-gray-300">
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
