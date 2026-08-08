// app/anime/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface AnimeDetail {
  mal_id: number;
  title: string;
  title_english: string;
  image_url: string;
  synopsis: string;
  score: number;
  episodes: number;
  status: string;
  genres: { name: string }[];
  trailer: { youtube_id: string } | null;
}

async function fetchAnimeById(id: number): Promise<AnimeDetail | null> {
  try {
    // Use a timeout or cache to prevent build timeouts
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}?sfw`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) return null;
    const data = await res.json();
    const anime = data.data;

    return {
      mal_id: anime.mal_id,
      title: anime.title,
      title_english: anime.title_english,
      image_url: anime.images.jpg.large_image_url,
      synopsis: anime.synopsis,
      score: anime.score,
      episodes: anime.episodes,
      status: anime.status,
      genres: anime.genres || [],
      trailer: anime.trailer,
    };
  } catch (error) {
    console.error('Error fetching anime:', error);
    return null;
  }
}

export default async function AnimeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const anime = await fetchAnimeById(Number(params.id));

  if (!anime) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Hero Background */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <div className="absolute inset-0">
          <Image
            src={anime.image_url}
            alt={anime.title}
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 p-6 md:p-12 max-w-5xl z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Poster */}
            <div className="hidden md:block w-48 lg:w-64 rounded-lg overflow-hidden shadow-2xl border-2 border-white/10">
              <Image
                src={anime.image_url}
                alt={anime.title}
                width={300}
                height={450}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{anime.title}</h1>
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-xl text-gray-300 mb-4">{anime.title_english}</p>
              )}
              
              <div className="flex flex-wrap gap-3 mb-4">
                {anime.score && (
                  <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold border border-yellow-500/30">
                    ★ {anime.score}
                  </span>
                )}
                {anime.episodes && (
                  <span className="bg-white/10 text-gray-200 px-3 py-1 rounded-full text-sm border border-white/10">
                    {anime.episodes} Episodes
                  </span>
                )}
                <span className="bg-white/10 text-gray-200 px-3 py-1 rounded-full text-sm border border-white/10">
                  {anime.status}
                </span>
              </div>

              <div className="flex gap-4 mb-6">
                {/* Link to the media player page */}
                <Link 
                  href={`/media/${anime.mal_id}`} 
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Watch Now
                </Link>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-8 rounded-lg transition-colors border border-white/10">
                  + My List
                </button>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <span 
                    key={genre.name} 
                    className="text-xs text-gray-400 uppercase tracking-wider border border-white/10 px-2 py-1 rounded"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-6 md:p-12">
        <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-3">Synopsis</h2>
        <p className="text-gray-300 leading-relaxed mb-8">{anime.synopsis}</p>

        {/* Trailer Section */}
        {anime.trailer && anime.trailer.youtube_id && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-3">Trailer</h2>
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                title="Trailer"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
