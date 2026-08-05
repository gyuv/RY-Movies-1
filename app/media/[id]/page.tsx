import Link from 'next/link';
import { VideoEmbed } from "@/components/VideoEmbed";
import { notFound } from 'next/navigation';

// Fetch media details from TMDB
async function getMedia(id: string, type: 'movie' | 'tv' = 'movie') {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      // If movie fails, try TV
      if (type === 'movie') {
        return getMedia(id, 'tv');
      }
      notFound();
    }

    const data = await res.json();
    
    // Determine type based on response
    const isTv = type === 'tv' || data.first_air_date;
    const releaseDate = isTv ? data.first_air_date : data.release_date;
    
    return {
      title: data.title || data.name,
      posterUrl: data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : '',
      overview: data.overview,
      rating: data.vote_average,
      year: releaseDate ? new Date(releaseDate).getFullYear() : '—',
      runtimeMinutes: data.runtime || data.episode_run_time?.[0],
      genres: data.genres || [],
      tagline: data.tagline,
      type: isTv ? 'tv' : 'movie',
      id: data.id,
      imdbId: data.imdb_id, // Important for some providers
    };
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return null;
  }
}

export default async function MediaPage({ params }: { params: { id: string } }) {
  const media = await getMedia(params.id);

  if (!media) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-ink text-paper">
      {/* Hero Section */}
      <section className="relative -mt-0 mb-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors inline-block mb-6">
            ← Back to browse
          </Link>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 items-start">
            <div className="w-36 sm:w-48 md:w-56 shrink-0 rounded-md overflow-hidden border border-gray-800 shadow-2xl shadow-black/50">
              <div className="aspect-[2/3] bg-gray-800">
                {media.posterUrl ? (
                  <img 
                    src={media.posterUrl} 
                    alt={media.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm px-3 text-center italic">
                    {media.title}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0 pt-1">
              <p className="text-sm text-gray-400 mb-2">
                {media.type === "tv" ? "TV Series" : "Feature Film"} · {media.year}
              </p>
              <h1 className="font-display italic text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.1]">
                {media.title}
              </h1>
              {media.tagline && (
                <p className="text-gray-400 italic mt-3 text-base sm:text-lg">{media.tagline}</p>
              )}

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-5 font-mono text-sm text-gray-400">
                <span className="text-yellow-500">★ {media.rating.toFixed(1)}</span>
                {media.runtimeMinutes && <span>{media.runtimeMinutes} min</span>}
                <span className="line-clamp-1">{media.genres.map((g: any) => g.name).join(" · ")}</span>
              </div>

              <p className="text-gray-300 mt-6 max-w-2xl leading-relaxed text-sm sm:text-base">
                {media.overview}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-2xl font-bold mb-4">Watch Now</h2>
        
        {/* Primary Player - Uses correct type (movie/tv) */}
        <VideoEmbed 
          type={media.type} 
          id={media.id} 
          provider="vidsrc_to" 
          className="aspect-video w-full mb-8"
        />
        
        {/* Fallback Players */}
        <h3 className="text-xl font-semibold mb-4">Other Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">Smashy Stream</p>
            <VideoEmbed 
              type={media.type} 
              id={media.id} 
              provider="smashy" 
              className="aspect-video w-full"
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Vidify</p>
            <VideoEmbed 
              type={media.type} 
              id={media.id} 
              provider="vidify" 
              className="aspect-video w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
