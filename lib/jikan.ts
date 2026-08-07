// Save as: lib/jikan.ts
// Jikan (jikan.moe) is a free, keyless wrapper around the MyAnimeList API.
// Used for Anime/Manga since TMDb has no meaningful coverage of either.
// Public rate limit is ~3 req/s / 60 req/min — the 1hr revalidate on each
// page keeps us well under that for normal traffic.

export interface NormalizedEntry {
  id: number;
  title: string;
  poster_path: string; // full absolute URL, unlike TMDb's relative path
  vote_average: number;
  release_date: string;
  external_url: string; // MAL page — used since there's no internal detail route yet
}

async function jikanFetch(path: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4${path}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('Jikan fetch failed:', e);
    return null;
  }
}

export async function getAnimeList(page: number, sort: string = 'popularity') {
  // Jikan's order_by values: popularity | score | title | start_date, etc.
  const orderMap: Record<string, string> = {
    'popularity.desc': 'popularity',
    'vote_average.desc': 'score',
    'primary_release_date.desc': 'start_date',
  };
  const order = orderMap[sort] || 'popularity';
  const sortDir = order === 'popularity' ? 'asc' : 'desc'; // MAL ranks popularity ascending (1 = most popular)

  const data = await jikanFetch(`/anime?page=${page}&order_by=${order}&sort=${sortDir}&sfw=true`);
  if (!data) return { results: [] as NormalizedEntry[], total_pages: 1 };

  const results: NormalizedEntry[] = (data.data || []).map((a: any) => ({
    id: a.mal_id,
    title: a.title_english || a.title,
    poster_path: a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || '',
    vote_average: a.score || 0,
    release_date: a.aired?.from ? a.aired.from.split('T')[0] : '',
    external_url: a.url,
  }));

  return { results, total_pages: data.pagination?.last_visible_page || 1 };
}

export async function getMangaList(page: number, sort: string = 'popularity') {
  const orderMap: Record<string, string> = {
    'popularity.desc': 'popularity',
    'vote_average.desc': 'score',
    'primary_release_date.desc': 'start_date',
  };
  const order = orderMap[sort] || 'popularity';
  const sortDir = order === 'popularity' ? 'asc' : 'desc';

  const data = await jikanFetch(`/manga?page=${page}&order_by=${order}&sort=${sortDir}&sfw=true`);
  if (!data) return { results: [] as NormalizedEntry[], total_pages: 1 };

  const results: NormalizedEntry[] = (data.data || []).map((m: any) => ({
    id: m.mal_id,
    title: m.title_english || m.title,
    poster_path: m.images?.jpg?.large_image_url || m.images?.jpg?.image_url || '',
    vote_average: m.score || 0,
    release_date: m.published?.from ? m.published.from.split('T')[0] : '',
    external_url: m.url,
  }));

  return { results, total_pages: data.pagination?.last_visible_page || 1 };
}
