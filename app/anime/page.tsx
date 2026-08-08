// Save as: app/anime/page.tsx
import Pagination from '../components/Pagination';
import { getAnimeList } from '@/lib/jikan';

export default async function AnimePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams?.page) || 1;
  const sort = (searchParams?.sort as string) || 'popularity.desc';
  const { results, total_pages } = await getAnimeList(page, sort);

  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="max-w-[1600px] mx-auto py-10">
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-paper section-heading">
            Anime
          </h1>
          <p className="stub-label mt-2">Data via MyAnimeList / Jikan</p>
        </div>

        {results.length === 0 ? (
          <p className="px-4 sm:px-6 lg:px-8 text-paper-dim stub-label">No titles found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 px-4 sm:px-6 lg:px-8">
            {results.map((item) => (
              <a
                key={item.id}
                href={item.external_url}
                target="_blank"
                rel="noreferrer"
                className="glass-card group block"
              >
                <div className="poster-frame relative aspect-[2/3]">
                  {item.poster_path ? (
                    <img
                      src={item.poster_path}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-paper-dim text-xs">
                      No art
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2 z-[2]">
                    <p className="text-paper text-xs font-medium truncate">{item.title}</p>
                    <p className="text-paper-dim text-[10px]">
                      {item.release_date?.split('-')[0] || 'TBA'} •{' '}
                      <span className="badge-rating">{item.vote_average ? item.vote_average.toFixed(1) : '—'}</span>
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {total_pages > 1 && (
          <Pagination currentPage={page} totalPages={Math.min(total_pages, 500)} />
        )}
      </div>
    </main>
  );
}
