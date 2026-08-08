// Save as: app/search/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../components/Footer';

const IMG_BASE = 'https://image.tmdb.org/t/p';

async function searchMedia(query: string) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey || !query) return [];

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}&language=en-US&page=1&include_adult=false`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    // Filter to only show movies and tv shows
    return (data.results || []).filter(
      (item: any) => item.media_type === 'movie' || item.media_type === 'tv'
    );
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = (searchParams?.q as string) || '';
  const results = await searchMedia(query);

  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <p className="stub-label mb-1">Search Results</p>
          <h1 className="text-3xl font-display font-bold">
            {query ? `Containing "${query}"` : 'Please enter a search query'}
          </h1>
        </div>

        {results.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-paper-dim text-lg mb-4">No cinematic matches found for &quot;{query}&quot;.</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 border border-ink-line rounded-md hover:border-marquee hover:text-marquee transition-colors stub-label"
            >
              ← Back to Home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {results.map((item: any) => {
              const title = item.title || item.name;
              const releaseDate = item.release_date || item.first_air_date || '';
              const year = releaseDate.split('-')[0] || 'TBA';
              const mediaType = item.media_type || 'movie';

              return (
                <Link
                  key={item.id}
                  href={`/media/${item.id}?type=${mediaType}`}
                  className="glass-card group block overflow-hidden"
                >
                  <div className="relative aspect-[2/3] bg-ink-raised">
                    {item.poster_path ? (
                      <Image
                        src={`${IMG_BASE}/w500${item.poster_path}`}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-paper-dim text-xs">
                        No Art
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate text-paper">{title}</p>
                    <div className="flex items-center justify-between mt-1 text-xs text-paper-dim">
                      <span>{year}</span>
                      <span className="badge-rating">★ {item.vote_average?.toFixed(1) ?? '—'}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
