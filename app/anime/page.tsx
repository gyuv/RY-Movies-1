// app/anime/page.tsx
import HeroSlider from '../components/HeroSlider';
import AnimeRow from '../components/AnimeRow';
import AnimeCard from '../components/AnimeCard';
import GenreFilter from '../components/GenreFilter';
import {
  getAnimeList,
  getTrendingAnime,
  getTopAnime,
  getAnimeByGenre,
  getGenreList,
} from '../../lib/anilist';
import { fetchAnimeList } from '../../lib/anilist';
import Link from 'next/link';
import { AnimeData } from '../../lib/anilist';
export default async function AnimePage({
  searchParams,
}: {
  searchParams: Promise<{ genres?: string; sort?: string; page?: string }>;
}) {
  const { genres: genresParam, sort, page } = await searchParams;

  const currentPage = Number(page) || 1;
  const sortValue = sort || 'airing.desc';
  const genreIds = genresParam
    ? genresParam.split(',').map(Number).filter((n) => !isNaN(n))
    : [];

  // Fetch trending/top rows + genre list always; fetch the main grid
  // conditionally depending on whether genre filters are active.
  const [trending, topAllTime, genres] = await Promise.all([
    getTrendingAnime(),
    getTopAnime(),
    getGenreList(),
  ]);

  const mainList = genreIds.length
    ? await getAnimeByGenre(String(genreIds[0]), sortValue, currentPage, 24)
    : await getAnimeList(currentPage, sortValue, 24);

  const gridTitle = genreIds.length
    ? `Filtered Results (${genreIds
        .map((id) => genres.find((g: any) => g.mal_id === id)?.name)
        .filter(Boolean)
        .join(', ')})`
    : 'Latest Updates';

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      {/* 1. Hero Slider */}
      <HeroSlider animeList={trending.items.slice(0, 5)} />
<AnimeRow title="Trending This Season" animeList={trending.items} />

      {/* 3. Top Rated Row */}
      <AnimeRow title="Top Rated Anime" animeList={topAllTime.items} />

      {/* 4. Filterable Grid */}
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
              {!genreIds.length && (
                <Link
                  href="/anime?sort=airing.desc"
                  className="text-sm text-yellow-500 hover:text-yellow-400 font-medium"
                >
                  See More
                </Link>
              )}
            </div>
          </div>

         {mainList.items.length ? (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
    {mainList.items.map((item: AnimeItem) => (
                <AnimeCard key={item.mal_id} {...item} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-20">
              No results found for this filter.
            </p>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-3 mt-10">
            {currentPage > 1 && (
              <Link
                href={`/anime?${new URLSearchParams({
                  ...(genresParam ? { genres: genresParam } : {}),
                  sort: sortValue,
                  page: String(currentPage - 1),
                }).toString()}`}
                className="px-5 py-2 rounded-full border border-white/20 text-sm hover:border-yellow-500"
              >
                Previous
              </Link>
            )}
            {mainList.pagination.has_next_page && (
              <Link
                href={`/anime?${new URLSearchParams({
                  ...(genresParam ? { genres: genresParam } : {}),
                  sort: sortValue,
                  page: String(currentPage + 1),
                }).toString()}`}
                className="px-5 py-2 rounded-full border border-white/20 text-sm hover:border-yellow-500"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 5. Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#020209] border-t border-white/10 md:hidden z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          <Link href="/anime" className="flex flex-col items-center justify-center w-full h-full text-yellow-500">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-[10px] uppercase font-medium">Home</span>
          </Link>
          <Link href="/anime?sort=popularity.desc" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-yellow-500">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M3 20h18" /></svg>
            <span className="text-[10px] uppercase font-medium">Catalog</span>
          </Link>
          <Link href="/schedule" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-yellow-500">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-[10px] uppercase font-medium">Schedule</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-yellow-500">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="text-[10px] uppercase font-medium">Search</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
