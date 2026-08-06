import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import VideoEmbed from '@/app/components/VideoEmbed';

// --- API Fetchers ---

async function getMediaDetails(id: string, type: string) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
  const res = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&append_to_response=credits`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export default async function MediaPage({ params }: { params: { id: string } }) {
  const type = "movie"; // You can expand this to "tv" later
  const data = await getMediaDetails(params.id, type);

  if (!data) {
    notFound();
  }

  const { title, overview, release_date, vote_average, genres, original_language, runtime, credits, poster_path, backdrop_path } = data;

  // Extract top 6 cast members
  const cast = credits?.cast?.slice(0, 6) || [];
  const director = credits?.crew?.find((person: any) => person.job === "Director");

  return (
    <main className="min-h-screen bg-ink text-paper">
      {/* Hero Background */}
      {backdrop_path && (
        <div className="relative h-96 w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
            alt={title}
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute bottom-0 left-0 p-6 max-w-7xl mx-auto w-full">
            <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
            <div className="flex items-center gap-4 text-gray-300 text-sm">
              <span>{new Date(release_date).getFullYear()}</span>
              <span>★ {vote_average?.toFixed(1)}</span>
              {runtime && <span>{runtime} min</span>}
              <span className="uppercase">{original_language}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Video Player - Primary Only */}
        <section className="mb-10">
          <VideoEmbed 
            type={type} 
            id={data.id} 
            provider="vidsrc_sbs" 
            className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl"
          />
        </section>

        {/* Details Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Left: Poster & Quick Stats */}
          <div className="lg:col-span-1">
            {poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                alt={title}
                width={300}
                height={450}
                className="rounded-lg shadow-lg"
              />
            )}
            
            {genres && (
              <div className="mt-6 flex flex-wrap gap-2">
                {genres.map((genre: any) => (
                  <span key={genre.id} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: Overview & Cast */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
            <p className="text-gray-300 leading-relaxed mb-8">
              {overview || "No overview available."}
            </p>

            {director && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-2">Director</h3>
                <p className="text-gray-300">{director.name}</p>
              </div>
            )}

            {/* Cast Section */}
            <h3 className="text-xl font-bold text-white mb-4">Top Cast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((actor: any) => (
                <div key={actor.id} className="text-center">
                  <div className="relative aspect-square w-full rounded-full overflow-hidden mb-2 bg-gray-800">
                    {actor.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                        alt={actor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        ?
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-bold text-white truncate">{actor.name}</p>
                  <p className="text-xs text-gray-400 truncate">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
