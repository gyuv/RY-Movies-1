import MultiServerPlayer from '../../components/MultiServerPlayer';
import StreamSelector from '../../components/StreamSelector';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../components/Footer';
import VideoEmbed from '../../components/VideoEmbed';

// Helper to fetch movie details
async function getMovieDetails(id: string) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return {
      title: "Mock Movie",
      overview: "This is a mock overview because the API key is missing.",
      poster_path: "/9lH0V6e4b4w8r5k6j7h8g9f0d1s2a3.jpg",
      backdrop_path: "/9lH0V6e4b4w8r5k6j7h8g9f0d1s2a3.jpg",
      vote_average: 8.5,
      release_date: "2023-01-01",
      runtime: 120,
      genres: [{ name: "Drama" }, { name: "Action" }],
      videos: { results: [] },
      provider_results: [],
    };
  }

  try {
    // Fetch Movie Details AND Videos AND Streaming Providers in parallel
    const [detailsRes, videosRes, providersRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`, { next: { revalidate: 3600 } }),
      fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`, { next: { revalidate: 3600 } }),
      fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${apiKey}`, { next: { revalidate: 3600 } })
    ]);

    if (!detailsRes.ok) throw new Error("Failed to fetch movie details");
    
    const details = await detailsRes.json();
    const videos = await videosRes.json();
    const providers = await providersRes.json();

    return { ...details, videos, provider_results: providers.results };
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id);
  return {
    title: movie ? `${movie.title} - Cinereel` : "Movie Not Found - Cinereel",
    description: movie ? movie.overview : "View details about your favorite movies.",
  };
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id);

  if (!movie) {
    return (
      <main className="min-h-screen bg-[#0a0b10] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
          <Link href="/" className="text-blue-400 hover:underline">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const releaseYear = movie.release_date?.split('-')[0] || "TBA";
  const runtimeMinutes = Math.floor((movie.runtime || 120) / 60);
  const runtimeSeconds = (movie.runtime || 120) % 60;

  // Find the first trailer (YouTube)
  const trailer = movie.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
  const youtubeKey = trailer?.key;

  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      {/* Backdrop Header */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10]/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-white/80">
            <span className="text-yellow-400 font-bold">★ {movie.vote_average.toFixed(1)}</span>
            <span>{releaseYear}</span>
            <span>{runtimeMinutes}h {runtimeSeconds}m</span>
            {movie.genres?.map((genre: { name: string }) => (
              <span key={genre.name} className="bg-white/10 px-2 py-0.5 rounded">{genre.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Poster & Quick Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={750}
                className="rounded-lg shadow-2xl w-full"
              />
              <Link href="/" className="block w-full bg-white/10 hover:bg-white/20 text-center py-3 rounded-lg transition-colors">
                ← Back to Browse
              </Link>
            </div>
          </div>

          {/* Right Column: Players & Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Trailer (YouTube) */}
            {youtubeKey && (
              <div>
                <h3 className="text-xl font-bold mb-3">Trailer</h3>
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=0&rel=0`}
                    title={`${movie.title} Trailer`}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </div>
            )}

            {/* 2. Multi-Server Streaming Player (TamilBlasters Style) */}
            <div>
              <h3 className="text-xl font-bold mb-3">Watch Online</h3>
              <MultiServerPlayer 
                movieId={movie.id} 
                type="movie" 
                imdbId={movie.external_ids?.imdb_id}
              />
            </div>

            {/* 3. Overview */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-white/80 leading-relaxed text-lg">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* 4. Details */}
            <div>
              <h3 className="text-xl font-bold mb-4">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-white/60 text-sm">Original Title</span>
                  <p className="font-medium">{movie.original_title}</p>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Status</span>
                  <p className="font-medium">{movie.status}</p>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Language</span>
                  <p className="font-medium">{movie.original_language?.toUpperCase()}</p>
                </div>
                <div>
                  <span className="text-white/60 text-sm">Popularity</span>
                  <p className="font-medium">{movie.popularity.toFixed(0)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
