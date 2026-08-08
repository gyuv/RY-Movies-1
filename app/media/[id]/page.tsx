// app/media/[id]/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../components/Footer';
import CastRow from '../../../components/CastRow';
import WatchBadges from '../../../components/WatchBadges';
import type { CastMember, WatchOption } from '@/types';

const IMG_BASE = 'https://image.tmdb.org/t/p';
const WATCH_REGION = 'US'; // Default region for watch providers

function mapProviders(providerResults: any): WatchOption[] {
 const region = providerResults?.[WATCH_REGION];
 if (!region) return [];

 const tiers: { key: 'flatrate' | 'free' | 'ads' | 'rent' | 'buy'; list: any[] }[] = [
 { key: 'flatrate', list: region.flatrate || [] },
 { key: 'free', list: region.free || [] },
 { key: 'ads', list: region.ads || [] },
 { key: 'rent', list: region.rent || [] },
 { key: 'buy', list: region.buy || [] },
 ];

 const options: WatchOption[] = [];
 for (const { key, list } of tiers) {
 for (const p of list) {
 options.push({
 tier: key,
 providerId: p.provider_id,
 providerName: p.provider_name,
 logoUrl: p.logo_path ? `${IMG_BASE}/w92${p.logo_path}` : '',
 deepLink: p.link || region.link,
 });
 }
 }
 return options;
}

// Helper to find the best trailer (YouTube is most common)
function getBestTrailer(videos: any) {
 if (!videos?.results) return null;
 const trailers = videos.results.filter((v: any) => v.type === 'Trailer');
 // Prefer YouTube, then official, then by popularity
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
 watchOptions: [] as WatchOption[],
 original_title: 'Mock Title',
 status: 'Released',
 original_language: 'en',
 popularity: 0,
 id: parseInt(id),
 };
 }

 try {
 const detailPath = type === 'tv' ? 'tv' : 'movie';
 const [detailsRes, videosRes, creditsRes, providersRes] = await Promise.all([
 fetch(`https://api.themoviedb.org/3/${detailPath}/${id}?api_key=${apiKey}&language=en-US`, { next: { revalidate: 3600 } }),
 fetch(`https://api.themoviedb.org/3/${detailPath}/${id}/videos?api_key=${apiKey}&language=en-US`, { next: { revalidate: 3600 } }),
 fetch(`https://api.themoviedb.org/3/${detailPath}/${id}/credits?api_key=${apiKey}&language=en-US`, { next: { revalidate: 3600 } }),
 fetch(`https://api.themoviedb.org/3/${detailPath}/${id}/watch/providers?api_key=${apiKey}`, { next: { revalidate: 3600 } }),
 ]);

 if (!detailsRes.ok) throw new Error('Failed to fetch media details');

 const details = await detailsRes.json();
 const videos = await videosRes.json();
 const credits = await creditsRes.json();
 const providers = await providersRes.json();

 // Normalize TV shape onto the movie shape the rest of the page expects
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

 const watchOptions = mapProviders(providers.results);

 return { ...normalized, videos, cast, watchOptions, id: parseInt(id) };
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
 {/* Backdrop */}
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
 
 {/* VIDEO PLAYER SECTION */}
 <section>
 <h2 className="text-xl font-display font-bold mb-3 section-heading">Watch Now</h2>
 
 {/* Tabs for Trailer vs Streaming Player */}
 <div className="flex space-x-4 mb-4 border-b border-ink-line pb-2">
 <button className="text-marquee font-bold border-b-2 border-marquee pb-2">Trailer</button>
 <button className="text-paper-dim hover:text-paper transition-colors pb-2">Streaming Info</button>
 </div>

 {youtubeKey ? (
 <div className="aspect-video bg-black rounded-md overflow-hidden border border-ink-line shadow-2xl">
 <iframe
 src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=0&rel=0&modestbranding=1`}
 title={`${media.title} Trailer`}
 className="w-full h-full"
 allowFullScreen
 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
 />
 </div>
 ) : (
 <div className="aspect-video bg-gray-900 rounded-md flex items-center justify-center border border-ink-line">
 <p className="text-paper-dim">No Trailer Found</p>
 </div>
 )}

 {/* Streaming Provider Links (The "Player" Logic) */}
 {media.watchOptions.length > 0 ? (
 <div className="mt-6">
 <h3 className="text-lg font-bold mb-3">Available on:</h3>
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
 {media.watchOptions.map((option) => (
 <a
 key={option.providerId}
 href={option.deepLink}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-3 p-3 bg-gray-900 hover:bg-gray-800 rounded-lg border border-ink-line transition-all hover:border-marquee group"
 >
 <div className="w-8 h-8 flex-shrink-0">
 {option.logoUrl ? (
 <Image 
 src={option.logoUrl} 
 alt={option.providerName} 
 width={32} 
 height={32} 
 className="object-contain rounded"
 />
 ) : (
 <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">
 {option.providerName.charAt(0)}
 </div>
 )}
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium truncate group-hover:text-marquee transition-colors">
 {option.providerName}
 </p>
 <p className="text-xs text-paper-dim uppercase">
 {option.tier === 'rent' || option.tier === 'buy' ? option.tier : 'Stream'}
 </p>
 </div>
 </a>
 ))}
 </div>
 </div>
 ) : (
 <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-ink-line text-center text-paper-dim">
 <p>No streaming providers found for <strong>{WATCH_REGION}</strong>.</p>
 <p className="text-xs mt-1">Check Netflix, Hulu, or Prime Video manually.</p>
 </div>
 )}
 </section>

 <section>
 <h2 className="text-xl font-display font-bold mb-3 section-heading">Overview</h2>
 <p className="text-paper-dim leading-relaxed text-lg">
 {media.overview || 'No overview available.'}
 </p>
 </section>

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
