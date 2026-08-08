// Save as: app/manga/page.tsx
import Pagination from '../components/Pagination';
import { getMangaList, MangaItem } from '../../lib/jikan';

export default async function MangaPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams?.page) || 1;
  const sort = (searchParams?.sort as string) || 'popularity.desc';
  const { results, total_pages } = await getMangaList(page, sort);

  return (
    <main className="min-h-screen bg-ink text-paper">
      <div className="max-w-[1600px] mx-auto py-10">
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-paper section-heading">
            Manga
          </h1>
          <p className="stub-label mt-2">Data via MyAnimeList / Jikan</p>
        </div>

        {results.length === 0 ? (
          <p className="px-4 sm:px-6 lg:px-8 text-paper-dim stub-label">No titles found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 px-4 sm:px-6 lg:px-8">
            {results.map((item: MangaItem) => (
              <a
                key={item.mal_id}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="glass-card group block"
              >
                <div className="poster-frame relative aspect-[2/3]">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-paper-dim text-xs">
                      No art
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2 z-[2] bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-paper text-xs font-medium truncate">{item.title}</p>
                    <p className="text-paper-dim text-[10px] mt-1 flex items-center justify-between">
                      <span>{item.status}</span>
                      <span className="badge-rating">★ {item.score ? item.score.toFixed(1) : '—'}</span>
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
