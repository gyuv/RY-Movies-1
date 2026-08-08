// lib/jikan.ts

export interface AnimeItem {
  mal_id: number;
  title: string;
  image_url: string;
  score: number;
  episodes: number;
  status: string;
  url: string;
}

export interface MangaItem {
  mal_id: number;
  title: string;
  image_url: string;
  score: number;
  chapters: number;
  status: string;
  url: string;
}

// Helper with User-Agent header and automatic retry
async function fetchJikan(endpoint: string) {
  const url = `https://api.jikan.moe/v4${endpoint}`;
  
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'CineReel-App/1.0',
        },
        next: { revalidate: 3600 },
      });

      if (res.status === 429) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }

      if (!res.ok) {
        console.error(`Jikan API error status: ${res.status} for ${endpoint}`);
        return null;
      }

      return await res.json();
    } catch (error) {
      if (i === 2) console.error(`Jikan fetch failed for ${endpoint}:`, error);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  return null;
}

// --- ANIME FUNCTIONS ---

export async function getAnimeList(page: number, sort: string = 'popularity.desc') {
  const data = await fetchJikan(`/top/anime?page=${page}&limit=20`);
  if (!data || !data.data) return { results: [], total_pages: 1 };

  return {
    results: data.data.map((item: any) => ({
      mal_id: item.mal_id,
      title: item.title,
      image_url: item.images?.jpg?.large_image_url || '',
      score: item.score || 0,
      episodes: item.episodes || 0,
      status: item.status || 'Unknown',
      url: item.url || '',
    })),
    total_pages: data.pagination?.last_visible_page || 1,
  };
}

export async function getTrendingAnime() {
  const data = await fetchJikan('/seasons/now?limit=10');
  if (!data || !data.data) return [];

  return data.data.map((item: any) => ({
    mal_id: item.mal_id,
    title: item.title,
    image_url: item.images?.jpg?.large_image_url || '',
    score: item.score || 0,
    episodes: item.episodes || 0,
    status: item.status || 'Unknown',
    url: item.url || '',
  }));
}

export async function getTopAnime() {
  const data = await fetchJikan('/top/anime?limit=10&filter=bypopularity');
  if (!data || !data.data) return [];

  return data.data.map((item: any) => ({
    mal_id: item.mal_id,
    title: item.title,
    image_url: item.images?.jpg?.large_image_url || '',
    score: item.score || 0,
    episodes: item.episodes || 0,
    status: item.status || 'Unknown',
    url: item.url || '',
  }));
}

// --- MANGA FUNCTIONS ---

export async function getMangaList(page: number, sort: string = 'popularity.desc') {
  const data = await fetchJikan(`/top/manga?page=${page}&limit=20`);
  if (!data || !data.data) return { results: [], total_pages: 1 };

  return {
    results: data.data.map((item: any) => ({
      mal_id: item.mal_id,
      title: item.title,
      image_url: item.images?.jpg?.large_image_url || '',
      score: item.score || 0,
      chapters: item.chapters || 0,
      status: item.status || 'Unknown',
      url: item.url || '',
    })),
    total_pages: data.pagination?.last_visible_page || 1,
  };
}

export async function getTrendingManga() {
  const data = await fetchJikan('/top/manga?limit=10&filter=bypopularity');
  if (!data || !data.data) return [];

  return data.data.map((item: any) => ({
    mal_id: item.mal_id,
    title: item.title,
    image_url: item.images?.jpg?.large_image_url || '',
    score: item.score || 0,
    chapters: item.chapters || 0,
    status: item.status || 'Unknown',
    url: item.url || '',
  }));
}

// --- SEARCH FUNCTION ---

export async function searchMedia(query: string, type: 'anime' | 'manga' = 'anime') {
  const data = await fetchJikan(`/${type}?q=${encodeURIComponent(query)}&limit=10`);
  if (!data || !data.data) return [];

  return data.data.map((item: any) => ({
    mal_id: item.mal_id,
    title: item.title,
    image_url: item.images?.jpg?.large_image_url || '',
    score: item.score || 0,
    status: item.status || 'Unknown',
    url: item.url || '',
  }));
}
