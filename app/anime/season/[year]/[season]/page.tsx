// app/anime/season/[year]/[season]/page.tsx
import { getAnimeBySeason, getGenreList } from '../../../../../lib/anilist';
import AnimeCard from '../../../../components/AnimeCard';
import GenreFilter from '../../../../components/GenreFilter';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const VALID_SEASONS = ['winter', 'spring', 'summer', 'fall'];

export default async function SeasonPage({
  params,
  searchParams,
}: {
  params: Promise<{ year: string; season: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { year, season } = await params;
  const { page } = await searchParams;

  const yearNum = Number(year);
  if (!VALID_SEASONS.includes(season) || isNaN(yearNum)) {
    notFound();
  }

  const currentPage = Number(page) || 1;

  const [animeData, genres] = await Promise.all([
    getAnimeBySeason(yearNum, season as 'winter' | 'spring' | 'summer' | 'fall', currentPage),
    getGenreList(),
  ]);

  const seasonLabel = season.charAt(0).toUpperCase() + season.slice(1);

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white font-sans pb-20">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            {seasonLabel} {yearNum} Anime
          </h1>
          <GenreFilter genres={genres.genres || genres} />
        </div>

        {/* Season switcher */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {VALID_SEASONS.map((s) => (
            <Link
              key={s}
              href={`/anime/season/${yearNum}/${s}`}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                s === season
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-white/20 text-gray-400 hover:border-white/40'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {animeData.media && animeData.media.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {animeData.media.map((item) => (
              <AnimeCard
                key={item.id}
                mal_id={item.id || 0}
                title={item.title?.romaji || item.title?.english || 'Untitled'}
                image={item.coverImage?.large || ''}
                episodes={item.episodes}
                type={item.format}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No anime found for this season.
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-10">
          {currentPage > 1 && (
            <Link
              href={`/anime/season/${yearNum}/${season}?page=${currentPage - 1}`}
              className="px-5 py-2 rounded-full border border-white/20 text-sm hover:border-yellow-500"
            >
              Previous
            </Link>
          )}
          {animeData.pageInfo?.hasNextPage && (
            <Link
              href={`/anime/season/${yearNum}/${season}?page=${currentPage + 1}`}
              className="px-5 py-2 rounded-full border border-white/20 text-sm hover:border-yellow-500"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
