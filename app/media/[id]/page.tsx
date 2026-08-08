import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../components/Footer';
import StreamingPlayer from '../../components/StreamingPlayer';
import CastRow from '../../../components/CastRow';
import type { CastMember } from '@/types';

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
    <main className="min-h-screen bg-ink text-paper">
      {/* Backdrop Header */}
      <div className="relative h-[55vh] md:h-[65vh] w-full">
        <Image
          src={`${IMG_BASE}/original${media.backdrop_path}`}
          alt={media.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <p className="stub-label mb-2">{type === 'tv' ? 'Series' : 'Film'}</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
            {media.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-paper-dim">
            <span className="badge-rating">★ {media.vote_average?.toFixed(1) ?? '—'}</span>
            <span>{releaseYear}</span>
            <span>{runtimeHours}h {runtimeMins}m</span>
            {media.genres?.map((genre: { name: string }) => (
              <span key={genre.name} className="border border-ink-line px-2 py-0.5 rounded text-xs uppercase tracking-wide">
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster + back link */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="glass-card">
                <Image
                  src={`${IMG_BASE}/w500${media.poster_path}`}
                  alt={media.title}
                  width={500}
                  height={750}
                  className="w-full"
                />
              </div>
              <Link
                href="/"
                className="block w-full text-center py-3 border border-ink-line rounded-md hover:border-marquee hover:text-marquee transition-colors stub-label"
              >
                ← Back to Browse
              </Link>
            </div>
          </div>

          {/* Details column */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* STREAMING PLAYER SECTION (Replaced Fandango/Buy/Rent cards) */}
            <section className="bg-[#12141c] p-6 rounded-2xl border border-ink-line shadow-xl">
              <h2 className="text-xl font-display font-bold mb-4 section-heading flex items-center gap-2">
                <span className="w-2.5 h-6 bg-marquee rounded-full"></span>
                Watch Online
              </h2>
              <StreamingPlayer 
                movieId={media.id} 
                type={type} 
                language={media.original_language} 
              />
            </section>

            <section>
              <h2 className="text-xl font-display font-bold mb-3 section-heading">Overview</h2>
              <p className="text-paper-dim leading-relaxed text-lg">
                {media.overview || 'No overview available.'}
              </p>
            </section>

            {youtubeKey && (
              <section>
                <h2 className="text-xl font-display font-bold mb-3 section-heading">Official Trailer</h2>
                <div className="aspect-video bg-black rounded-md overflow-hidden border border-ink-line shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=0&rel=0&modestbranding=1`}
                    title={`${media.title} Trailer`}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              </section>
            )}

            {media.cast?.length > 0 && (
              <section>
                <h2 className="text-xl font-display font-bold mb-3 section-heading">Cast</h2>
                <CastRow cast={media.cast} />
              </section>
            )}

            <section>
              <h2 className="text-xl font-display font-bold mb-4 section-heading">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="stub-label">Original Title</span>
                  <p className="font-medium mt-1">{media.original_title}</p>
                </div>
                <div>
                  <span className="stub-label">Status</span>
                  <p className="font-medium mt-1">{media.status}</p>
                </div>
                <div>
                  <span className="stub-label">Language</span>
                  <p className="font-medium mt-1">{media.original_language?.toUpperCase()}</p>
                </div>
                <div>
                  <span className="stub-label">Popularity</span>
                  <p className="font-medium mt-1">{media.popularity?.toFixed(0) ?? '—'}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
