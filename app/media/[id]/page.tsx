import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../components/Footer';
import StreamingPlayer from '../../components/StreamingPlayer';
import CastRow from '../../../components/CastRow';
import type { CastMember } from '@/types';
import { WatchExperience } from '@/components/apex';

const IMG_BASE = 'https://image.tmdb.org/t/p';

// Helper to find the best trailer (YouTube is most common)
function getBestTrailer(videos: any) {
  if (!videos?.results) return null;
  const trailers = videos.results.filter((v: any) => v.type === 'Trailer');
  return trailers.find((v: any) => v.site === 'YouTube' && v.official) || 
         trailers.find((v: any) => v.site === 'YouTube') || 
         trailers[0];
}

async function getMediaDetails(id: string, type: 'movie' | 'tv') {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return {
      title: 'Mock Title',
      overview: 'This is a mock overview because the API key is missing.',
      poster_path: '/9lH0V6e4b4w8r5k6j7h8g9f0d1s2a3.jpg',
      backdrop_path: '/9lH0V6e4b4w8r5k6j7h8g9f0d1s2a3.jpg',
      vote_average: 8.5,
      release_date: '2023-01-01',
      runtime: 120,
      genres: [{ name: 'Drama' }, { name: 'Action' }],
      videos: { results: [] },
      cast: [] as CastMember[],
      original_title: 'Mock Title',
      status: 'Released',
      original_language: 'en',
      popularity: 0,
      id: parseInt(id),
    };
  }

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
    console.error('Error fetching media:', error);
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
  const type = (searchParams?.type as 'movie' | 'tv') || 'movie';
  const media = await getMediaDetails(params.id, type);
  return {
    title: media ? `${media.title} - Cinereel` : 'Not Found - Cinereel',
    description: media ? media.overview : 'View details about your favorite movies and series.',
  };
}

export default async function MediaPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const type = (searchParams?.type as 'movie' | 'tv') || 'movie';
  const media = await getMediaDetails(params.id, type);

  if (!media) {
    return (
      <main className="min-h-screen bg-ink text-paper flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Not Found</h1>
          <Link href="/" className="text-marquee hover:text-marquee-hot transition-colors">
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const releaseYear = media.release_date?.split('-')[0] || 'TBA';
  const runtimeHours = Math.floor((media.runtime || 120) / 60);
  const runtimeMins = (media.runtime || 120) % 60;
  const trailer = getBestTrailer(media.videos);
  const youtubeKey = trailer?.key;

  return (
    <WatchExperience
      media={{
        id: media.id,
        title: media.title,
        original_title: media.original_title,
        overview: media.overview,
        poster_path: media.poster_path,
        backdrop_path: media.backdrop_path,
        vote_average: media.vote_average,
        releaseYear,
        runtimeHours,
        runtimeMins,
        genres: media.genres,
        status: media.status,
        original_language: media.original_language,
        popularity: media.popularity,
        kind: type,
        youtubeKey,
      }}
      hasCast={Array.isArray(media.cast) && media.cast.length > 0}
      /* Streaming is untouched: the exact existing player + props are injected as a slot. */
      playerSlot={
        <StreamingPlayer
          movieId={media.id}
          type={type}
          language={media.original_language}
        />
      }
      castSlot={<CastRow cast={media.cast} />}
      footerSlot={<Footer />}
    />
  );
}
