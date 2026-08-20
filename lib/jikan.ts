// lib/jikan.ts

const BASE_URL = 'https://api.jikan.moe/v4';

export interface AnimeItem {
  mal_id: number;
  title: string;
  image: string;
  episodes: number | null;
  type: string | null;
  synopsis: string | null;
  score: number | null;
  status: string | null;
  year: number | null;
}

export interface AnimeListResponse {
  results: AnimeItem[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

// Raw shape returned by Jikan for a single anime entry (trimmed to fields we use)
interface JikanRawAnime {
  mal_id: number;
  title: string;
  title_english?: string | null;
  images: {
    jpg: {
      image_url: string;
      large_image_url?: string;
    };
    webp?: {
      image_url: string;
      large_image_url?: string;
    };
  };
  episodes: number | null;
  type: string | null;
  synopsis: string | null;
  score: number | null;
  status: string | null;
  year: number | null;
  aired?: {
    prop?: {
      from?: { year?: number | null };
    };
  };
}

/**
 * Normalizes a raw Jikan anime object into the shape our components expect.
 */
function mapAnime(raw: JikanRawAnime): AnimeItem {
  return {
    mal_id: raw.mal_id,
    title: raw.title_english || raw.title,
    image:
      raw.images?.webp?.large_image_url ||
      raw.images?.jpg?.large_image_url ||
      raw.images?.jpg?.image_url ||
      '/placeholder.png',
    episodes: raw.episodes ?? null,
    type: raw.type ?? null,
    synopsis: raw.synopsis ?? null,
    score: raw.score ?? null,
    status: raw.status ?? null,
    year: raw.year ?? raw.aired?.prop?.from?.year ?? null,
  };
}

/**
 * Basic fetch wrapper with Next.js caching + simple retry on 429
 * (Jikan is rate-limited to ~3 req/sec, so a retry helps under load).
 */
async function jikanFetch<T>(
  path: string,
  revalidateSeconds = 3600
): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const attemptFetch = async (retries: number): Promise<Response> => {
    const res = await fetch(url, {
      next: { revalidate: revalidateSeconds },
    });

    if (res.status === 429 && retries > 0) {
      await new Promise((r) => setTimeout(r, 800));
      return attemptFetch(retries - 1);
    }

    return res;
  };

  const res = await attemptFetch(2);

  if (!res.ok) {
    throw new Error(`Jikan API error: ${res.status} ${res.statusText} for ${path}`);
  }

  return res.json() as Promise<T>;
}

/**
 * General-purpose anime list fetcher with pagination + sorting.
 * order_by options: 'popularity', 'score', 'title', 'start_date', 'airing' etc.
 * sort format used elsewhere in the app: e.g. 'airing.desc' -> we split it below.
 */
export async function getAnimeList(
  page = 1,
  sort = 'popularity.desc',
  limit = 24
): Promise<AnimeListResponse> {
  const [orderBy, direction] = sort.split('.'); // e.g. "airing.desc" -> ["airing", "desc"]

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    order_by: orderBy || 'popularity',
    sort: direction || 'desc',
    sfw: 'true',
  });

  const data = await jikanFetch<{
    data: JikanRawAnime[];
    pagination: { last_visible_page: number; has_next_page: boolean };
  }>(`/anime?${params.toString()}`);

  return {
    results: data.data.map(mapAnime),
    pagination: data.pagination,
  };
}

/**
 * Trending / currently airing anime, ordered by popularity.
 * Used for the hero slider and "Trending This Season" row.
 */
export async function getTrendingAnime(limit = 10): Promise<AnimeItem[]> {
  const params = new URLSearchParams({
    filter: 'airing',
    order_by: 'popularity',
    sort: 'asc',
    limit: String(limit),
    sfw: 'true',
  });

  const data = await jikanFetch<{ data: JikanRawAnime[] }>(
    `/top/anime?${params.toString()}`
  );

  return data.data.map(mapAnime);
}

/**
 * All-time top rated anime by score.
 * Used for the "Top Rated Anime" row and the TOP 10 section.
 */
export async function getTopAnime(limit = 10): Promise<AnimeItem[]> {
  const params = new URLSearchParams({
    order_by: 'score',
    sort: 'desc',
    limit: String(limit),
    sfw: 'true',
  });

  const data = await jikanFetch<{ data: JikanRawAnime[] }>(
    `/top/anime?${params.toString()}`
  );

  return data.data.map(mapAnime);
}

/**
 * Single anime detail fetch, useful for /anime/[id] pages.
 */
export async function getAnimeById(id: number): Promise<AnimeItem> {
  const data = await jikanFetch<{ data: JikanRawAnime }>(`/anime/${id}`);
  return mapAnime(data.data);
}

/**
 * Search anime by query string, used for the search page/bar.
 */
export async function searchAnime(
  query: string,
  page = 1,
  limit = 24
): Promise<AnimeListResponse> {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    limit: String(limit),
    sfw: 'true',
  });

  const data = await jikanFetch<{
    data: JikanRawAnime[];
    pagination: { last_visible_page: number; has_next_page: boolean };
  }>(`/anime?${params.toString()}`);

  return {
    results: data.data.map(mapAnime),
    pagination: data.pagination,
  };
}

export interface Genre {
  mal_id: number;
  name: string;
  count: number;
}

interface JikanGenreRaw {
  mal_id: number;
  name: string;
  count: number;
}

/**
 * Fetch anime for a specific season/year, e.g. getAnimeBySeason(2026, 'summer').
 * Useful for a "Seasonal" tab or browse-by-season page.
 * Valid seasons: 'winter' | 'spring' | 'summer' | 'fall'
 */
export async function getAnimeBySeason(
  year: number,
  season: 'winter' | 'spring' | 'summer' | 'fall',
  page = 1,
  limit = 24
): Promise<AnimeListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sfw: 'true',
  });

  const data = await jikanFetch<{
    data: JikanRawAnime[];
    pagination: { last_visible_page: number; has_next_page: boolean };
  }>(`/seasons/${year}/${season}?${params.toString()}`);

  return {
    results: data.data.map(mapAnime),
    pagination: data.pagination,
  };
}

/**
 * Convenience wrapper for "what's airing this season right now."
 */
export async function getCurrentSeason(
  page = 1,
  limit = 24
): Promise<AnimeListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sfw: 'true',
  });

  const data = await jikanFetch<{
    data: JikanRawAnime[];
    pagination: { last_visible_page: number; has_next_page: boolean };
  }>(`/seasons/now?${params.toString()}`);

  return {
    results: data.data.map(mapAnime),
    pagination: data.pagination,
  };
}

/**
 * Fetch the full list of anime genres (for building a filter dropdown/menu).
 */
export async function getGenreList(): Promise<Genre[]> {
  const data = await jikanFetch<{ data: JikanGenreRaw[] }>(
    `/genres/anime`,
    86400 // genres barely change, cache for a day
  );

  return data.data
    .map((g) => ({ mal_id: g.mal_id, name: g.name, count: g.count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Fetch anime filtered by one or more genre IDs.
 */
export async function getAnimeByGenre(
  genreIds: number[],
  page = 1,
  limit = 24,
  sort = 'popularity.desc'
): Promise<AnimeListResponse> {
  if (!genreIds.length) {
    return getAnimeList(page, sort, limit);
  }

  const [orderBy, direction] = sort.split('.');

  const params = new URLSearchParams({
    genres: genreIds.join(','),
    page: String(page),
    limit: String(limit),
    order_by: orderBy || 'popularity',
    sort: direction || 'desc',
    sfw: 'true',
  });

  const data = await jikanFetch<{
    data: JikanRawAnime[];
    pagination: { last_visible_page: number; has_next_page: boolean };
  }>(`/anime?${params.toString()}`);

  return {
    results: data.data.map(mapAnime),
    pagination: data.pagination,
  };
}

export interface MangaItem {
  mal_id: number;
  title: string;
  image: string;
  chapters: number | null;
  volumes: number | null;
  type: string | null;
  synopsis: string | null;
  score: number | null;
  status: string | null;
}

interface JikanRawManga {
  mal_id: number;
  title: string;
  title_english?: string | null;
  images: {
    jpg: { image_url: string; large_image_url?: string };
    webp?: { image_url: string; large_image_url?: string };
  };
  chapters: number | null;
  volumes: number | null;
  type: string | null;
  synopsis: string | null;
  score: number | null;
  status: string | null;
}

function mapManga(raw: JikanRawManga): MangaItem {
  return {
    mal_id: raw.mal_id,
    title: raw.title_english || raw.title,
    image:
      raw.images?.webp?.large_image_url ||
      raw.images?.jpg?.large_image_url ||
      raw.images?.jpg?.image_url ||
      '/placeholder.png',
    chapters: raw.chapters ?? null,
    volumes: raw.volumes ?? null,
    type: raw.type ?? null,
    synopsis: raw.synopsis ?? null,
    score: raw.score ?? null,
    status: raw.status ?? null,
  };
}

export interface MangaListResponse {
  results: MangaItem[];
  total_pages: number;
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
  };
}

export async function getMangaList(
  page = 1,
  sort = 'popularity.desc',
  limit = 24
): Promise<MangaListResponse> {
  const [orderBy, direction] = sort.split('.');

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    order_by: orderBy || 'popularity',
    sort: direction || 'desc',
    sfw: 'true',
  });

  const data = await jikanFetch<{
    data: JikanRawManga[];
    pagination: { last_visible_page: number; has_next_page: boolean };
  }>(`/manga?${params.toString()}`);

  return {
    results: data.data.map(mapManga),
    total_pages: data.pagination.last_visible_page,
    pagination: data.pagination,
  };
}
