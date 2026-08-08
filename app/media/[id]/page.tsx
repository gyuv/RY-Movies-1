// app/media/[id]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../components/Footer';
import StreamingPlayer from '../../components/StreamingPlayer';
import CastRow from '../../../components/CastRow';
import type { CastMember } from '@/types';
import { notFound } from 'next/navigation';

const IMG_BASE = 'https://image.tmdb.org/t/p';

// --- TMDB HELPERS ---
function getBestTrailer(videos: any) {
  if (!videos?.results) return null;
  const trailers = videos.results.filter((v: any) => v.type === 'Trailer');
  return trailers.find((v: any) => v.site === 'YouTube' && v.official) || 
         trailers.find((v: any) => v.site === 'YouTube') || 
         trailers[0];
}

async function getTmdbDetails(id: string, type: 'movie' | 'tv') {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) return null;

  try {
    const detailPath = type === 'tv' ? 'tv' : 'movie';
    const [detailsRes, videosRes, creditsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/${detailPath}/${id}?api_key=${apiKey}&language=en-US`, { next: { revalidate: 3600 } }),
      fetch(`https://api.themoviedb.org/3/${detailPath}/${id}/videos?api_key=${apiKey}&language=en-US`, { next: { revalidate: 3600 } }),
      fetch(`https://api.themoviedb.org/3/${detailPath}/${id}/credits?api_key=${apiKey}&language=en-US`, { next: { revalidate: 3600 } }),
    ]);

    if (!detailsRes.ok) throw new Error('Failed to fetch media details');

    const details = await detailsRes.json();
    const videos = await videosRes.json();
    const credits = await creditsRes.json();

    const normalized = type === 'tv'
      ? {
          ...details,
          title: details.name,
          original_title: details.original_name,
          release_date: details.first_air_date,
          runtime: details.episode_run_time?.[0] || 45,
        }
      : details;

    const cast: CastMember[] = (credits.cast || []).slice(0, 20).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      photoUrl: c.profile_path ? `${IMG_BASE}/w185${c.profile_path}` : null,
    }));

    return { ...normalized, videos, cast, id: parseInt(id) };
  } catch (error) {
    console.error('Error fetching TMDB media:', error);
    return null;
  }
}

// --- ANIME TYPES & HELPERS ---

interface AnimeGenre {
  mal_id: number;
  name: string;
}

interface AnimeMedia {
  mal_id: number;
  title: string;
  title_english: string;
  image_url: string;
  synopsis: string;
  score: number;
  episodes: number;
  status: string;
  genres: AnimeGenre[];
  trailer: { youtube_id: string } | null;
}

async function getAnimeDetails(malId: number): Promise<AnimeMedia | null> {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}?sfw`, {
      next: { revalidate: 3600 },
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
    console.error('Error fetching Anime details:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const type = (searchParams?.type as 'movie' | 'tv' | 'anime') || 'movie';
  
  let title = 'Not Found - Cinereel';
  let description = 'View details about your favorite movies and series.';

  if (type === 'anime') {
    const anime = await getAnimeDetails(parseInt(params.id));
    if (anime) {
      title = `${anime.title} - Cinereel`;
      description = anime.synopsis;
    }
  } else {
    const media = await getTmdbDetails(params.id, type as 'movie' | 'tv');
    if (media) {
      title = `${media.title} - Cinereel`;
      description = media.overview;
    }
  }

  return { title, description };
}

export default async function MediaPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const type = (searchParams?.type as 'movie' | 'tv' | 'anime') || 'movie';

  // --- HANDLE ANIME ---
  if (type === 'anime') {
    const anime = await getAnimeDetails(parseInt(params.id));
    
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
                  <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    Watch Now
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre: AnimeGenre) => (
                    <span 
                      key={genre.mal_id} 
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

        {/* Player Section for Anime */}
        <div className="max-w-[1600px] mx-auto py-8 px-4">
          <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-3">Episode 1</h2>
          <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
             <iframe
               src={`https://gogoanime3.ldh.xyz/embedplus.php?id=${anime.mal_id}&autoPlay=true`}
               className="w-full h-full"
               title="Anime Player"
               allowFullScreen
             />
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-3">Synopsis</h2>
            <p className="text-gray-300 leading-relaxed">{anime.synopsis}</p>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  // --- HANDLE MOVIE/TV (TMDB) ---
  const media = await getTmdbDetails(params.id, type as 'movie' | 'tv');

  if (!media) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Hero Background */}
      <div className="relative w-full h-[50vh] md:h-[60vh]">
        <div className="absolute inset-0">
          <Image
            src={`${IMG_BASE}/original${media.backdrop_path}`}
            alt={media.title}
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 p-6 md:p-12 max-w-5xl z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="hidden md:block w-48 lg:w-64 rounded-lg overflow-hidden shadow-2xl border-2 border-white/10">
              <Image
                src={`${IMG_BASE}/w500${media.poster_path}`}
                alt={media.title}
                width={300}
                height={450}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{media.title}</h1>
              {media.original_title && media.original_title !== media.title && (
                <p className="text-xl text-gray-300 mb-4">{media.original_title}</p>
              )}
              
              <div className="flex flex-wrap gap-3 mb-4">
                {media.vote_average && (
                  <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold border border-yellow-500/30">
                    ★ {media.vote_average}
                  </span>
                )}
                {media.runtime && (
                  <span className="bg-white/10 text-gray-200 px-3 py-1 rounded-full text-sm border border-white/10">
                    {media.runtime} min
                  </span>
                )}
                <span className="bg-white/10 text-gray-200 px-3 py-1 rounded-full text-sm border border-white/10">
                  {media.release_date?.split('-')[0] || 'TBD'}
                </span>
              </div>

              <div className="flex gap-4 mb-6">
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Watch Now
                </button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-8 rounded-lg transition-colors border border-white/10">
                  + My List
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {media.genres?.map((genre) => (
                  <span 
                    key={genre.id || genre.name} 
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

      {/* Player & Details */}
      <div className="max-w-[1600px] mx-auto py-8 px-4">
        {/* Streaming Player for TMDB Content */}
        <StreamingPlayer mediaId={media.id} type={type as 'movie' | 'tv'} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-3">Overview</h2>
            <p className="text-gray-300 leading-relaxed">{media.overview}</p>
            
            {getBestTrailer(media.videos) && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-3">Trailer</h2>
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${getBestTrailer(media.videos).key}`}
                    title="Trailer"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 border-l-4 border-yellow-500 pl-3">Cast</h2>
            <CastRow cast={media.cast} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
