// Save as: lib/jikan.ts
// Jikan (jikan.moe) is a free, keyless wrapper around the MyAnimeList API.
// Used for Anime/Manga since TMDb has no meaningful coverage of either.
// Public rate limit is ~3 req/s / 60 req/min.

export interface NormalizedEntry {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  external_url: string;
}

const MOCK_ENTRY: NormalizedEntry = {
  id: 1,
  title: "Data unavailable — retry shortly",
  poster_path: "",
  vote_average: 0,
  release_date: "",
  external_url: "https://myanimelist.net",
};
const MOCK_LIST = Array(6).fill(MOCK_ENTRY).map((m, i) => ({ ...m, id: i + 1 }));

async function jikanFetch(path: string) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4${path}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`Jikan ${path} -> HTTP ${res.status} ${res.statusText}. Body: ${body.slice(0, 300)}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error(`Jikan fetch threw for ${path}:`, e);
    return null;
  }
}

export async function getAnimeList(page: number, sort: string = 'popularity') {
  const orderMap: Record<string, string> = {
    'popularity.desc': 'popularity',
    'vote_average.desc': 'score',
    'primary_release_date.desc': 'start_date',
  };
  const order = orderMap[sort] || 'popularity';
  const sortDir = order === 'popularity' ? 'asc' : 'desc';

  const data = await jikanFetch(`/anime?page=${page}&order_by=${order}&sort=${sortDir}&sfw=true`);
  if (!data || !data.data) {
    console.error('getAnimeList: no data returned from Jikan, falling back to placeholder list');
    return { results: MOCK_LIST, total_pages: 1 };
  }

  const results: NormalizedEntry[] = data.data.map((a: any) => ({
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
  if (!data || !data.data) {
    console.error('getMangaList: no data returned from Jikan, falling back to placeholder list');
    return { results: MOCK_LIST, total_pages: 1 };
  }

  const results: NormalizedEntry[] = data.data.map((m: any) => ({
    id: m.mal_id,
    title: m.title_english || m.title,
    poster_path: m.images?.jpg?.large_image_url || m.images?.jpg?.image_url || '',
    vote_average: m.score || 0,
    release_date: m.published?.from ? m.published.from.split('T')[0] : '',
    external_url: m.url,
  }));

  return { results, total_pages: data.pagination?.last_visible_page || 1 };
}
