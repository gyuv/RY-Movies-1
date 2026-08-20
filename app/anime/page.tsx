// app/anime/page.tsx

import {
  getAnimeList,
  getTrendingAnime,
  getTopAnime,
  getAnimeByGenre,
  getGenreList,
  Media as AnimeData,
} from '../../lib/anilist';
import Link from 'next/link';
import Image from 'next/image';

// Inline GenreFilter
function GenreFilter({ genres }: { genres: { id: number; name: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {genres.slice(0, 10).map((genre) => (
        <Link
          key={genre.id}
          href={`/anime?genres=${encodeURIComponent(genre.name)}`}
          className="px-3 py-1 bg-white/10 rounded-full text-xs hover:bg-yellow-500 hover:text-black transition-colors"
        >
          {genre.name}
        </Link>
      ))}
    </div>
  );
}

// Inline AnimeRow
function AnimeRow({ title, animeList }: { title: string; animeList: AnimeData[] }) {
  return (
    <section className="py-6 px-4 md:px-8">
      <h2 className="text-lg font-bold mb-4 border-l-4 border-yellow-500 pl-3">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {animeList.slice(0, 10).map((item) => (
          <div key={item.id} className="min-w-[150px] w-[150px]">
            <Link href={`/anime/${item.id}`} className="block">
              <div className="relative aspect-[0.75] w-full rounded-lg overflow-hidden">
                <Image
                  src={item.coverImage?.large || ''}
                  alt={item.title?.romaji || ''}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
              </div>
              <p className="text-xs mt-2 truncate text-gray-300">
                {item.title?.romaji || item.title?.english || 'Untitled'}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

// Inline HeroSlider
function HeroSlider({ animeList }: { animeList: AnimeData[] }) {
  const featured = animeList[0];
  if (!featured) return null;

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={featured.coverImage?.extraLarge || featured.coverImage?.large || ''}
          alt={featured.title?.romaji || ''}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          {featured.title?.romaji}
        </h1>
        <p className="text-gray-300 mb-4 line-clamp-2">
          {featured.description?.replace(/<[^>]*>/g, '') || 'No description available.'}
        </p>
        <Link
          href={`/anime/${featured.id}`}
          className="px-6 py-2 bg-yellow-500 text-black font-bold rounded hover:bg-yellow-400 transition-colors"
        >
          Watch Now
        </Link>
      </div>
    </div>
  );
}

export default async function AnimePage({
  searchParams,
}: {
  searchParams: Promise<{ genres?: string; sort?: string; page?: string }>;
}) {
  const { genres: genresParam, sort, page } = await searchParams;

  const currentPage = Number(page) || 1;
  const sortValue = sort || 'airing.desc';
  const limit = 24;

  const genreIds = genresParam
    ? genresParam.split(',').map((g) => g.trim()).filter(Boolean)
    : [];

  const [trending, topAllTime, genresData] = await Promise.all([
    getTrendingAnime(),
    getTopAnime(),
    getGenreList(),
  ]);

  // Map raw string array into object array format { id, name } expected by GenreFilter
  const genres = (genresData.genres || []).map((genreName, index) => ({
    id: index + 1,
    name: genreName,
  }));

  const mainList = genreIds.length
    ? await getAnimeByGenre(genreIds[0], sortValue, currentPage, limit)
    : await getAnimeList(currentPage, sortValue, limit);

  const gridTitle = genreIds.length
    ? `Filtered Results (${genreIds.join(', ')})`
    : 'Latest Updates';

  const buildHref = (newPage: number) => {
    const params = new URLSearchParams({
      ...(genresParam ? { genres: genresParam } : {}),
      sort: sortValue,
      page: String(newPage),
    });
    return `/anime?${params.toString()}`;
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      {trending.media && trending.media.length > 0 && <HeroSlider animeList={trending.media.slice(0, 5)} />}

      {trending.media && trending.media.length > 0 && (
        <AnimeRow title="Trending This Season" animeList={trending.media} />
      )}

      {topAllTime.media && topAllTime.media.length > 0 && (
        <AnimeRow title="Top Rated Anime" animeList={topAllTime.media} />
      )}

      <section className="py-8 px-4 md:px-8 bg-[#0a0a0a]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-yellow-500 pl-3">
              {gridTitle}
            </h2>
            <div className="flex items-center gap-3">
              <GenreFilter genres={genres} />
              {genreIds.length > 0 && (
                <Link
                  href="/anime"
                  className="text-sm text-gray-400 hover:text-white font-medium"
                >
                  Clear filters
                </Link>
              )}
            </div>
          </div>

          {mainList.media && mainList.media.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
              {mainList.media.map((item: AnimeData) => (
                <div
                  key={item.id}
                  className="group relative bg-[#1a1a1a] rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105 hover:z-10"
                >
                  <div className="relative aspect-[0.75] w-full">
                    <Image
                      src={item.coverImage?.large || ''}
                      alt={item.title?.romaji || item.title?.english || 'Anime'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16.66vw"
                    />
                    {item.episodes && (
                      <div className="absolute top-2 right-2 bg-black/70 text-xs font-bold px-2 py-1 rounded text-yellow-500">
                        {item.episodes} EP
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                      <Link
                        href={`/anime/${item.id}`}
                        className="bg-yellow-500 text-black text-xs font-bold py-2 rounded hover:bg-yellow-400 transition-colors text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-semibold truncate text-white group-hover:text-yellow-500 transition-colors">
                      {item.title?.romaji || item.title?.english || 'Untitled'}
                    </h3>
                    <p className="text-xs text-gray-500">{item.format || item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              No anime found for this filter.
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-3 mt-10 mb-8">
            {currentPage > 1 && (
              <Link
                href={buildHref(currentPage - 1)}
                className="px-5 py-2 rounded-full border border-white/20 text-sm hover:border-yellow-500 hover:text-yellow-500 transition-colors"
              >
                Previous
              </Link>
            )}

            {mainList.media && mainList.media.length >= limit && (
              <Link
                href={buildHref(currentPage + 1)}
                className="px-5 py-2 rounded-full border border-white/20 text-sm hover:border-yellow-500 hover:text-yellow-500 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#020209] border-t border-white/10 md:hidden z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          <Link
            href="/"
            className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-yellow-500"
          >
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7-7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-[10px] uppercase font-medium">Home</span>
          </Link>
          <Link
            href="/anime"
            className="flex flex-col items-center justify-center w-full h-full text-yellow-500"
          >
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M3 20h18"
              />
            </svg>
            <span className="text-[10px] uppercase font-medium">Catalog</span>
          </Link>
          <Link
            href="/schedule"
            className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-yellow-500"
          >
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[10px] uppercase font-medium">Schedule</span>
          </Link>
          <Link
            href="/search"
            className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-yellow-500"
          >
            <svg
              className="w-6 h-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-[10px] uppercase font-medium">Search</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
