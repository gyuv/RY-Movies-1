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

// --- ANIME FUNCTIONS ---

export async function getAnimeList(page: number, sort: string = 'popularity.desc') {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=20&filter=all`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    return {
      results: (data.data || []).map((item: any) => ({
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
  } catch (error) {
    console.error('Jikan Anime Error:', error);
    return { results: [], total_pages: 1 };
  }
}

export async function getTrendingAnime() {
  try {
    const res = await fetch('https://api.jikan.moe/v4/seasons/now?limit=10');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    return (data.data || []).map((item: any) => ({
      mal_id: item.mal_id,
      title: item.title,
      image_url: item.images?.jpg?.large_image_url || '',
      score: item.score || 0,
      episodes: item.episodes || 0,
      status: item.status || 'Unknown',
      url: item.url || '',
    }));
  } catch (error) {
    console.error('Jikan Trending Anime Error:', error);
    return [];
  }
}

export async function getTopAnime() {
  try {
    const res = await fetch('https://api.jikan.moe/v4/top/anime?limit=10&filter=bypopularity');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    return (data.data || []).map((item: any) => ({
      mal_id: item.mal_id,
      title: item.title,
      image_url: item.images?.jpg?.large_image_url || '',
      score: item.score || 0,
      episodes: item.episodes || 0,
      status: item.status || 'Unknown',
      url: item.url || '',
    }));
  } catch (error) {
    console.error('Jikan Top Anime Error:', error);
    return [];
  }
}

// --- MANGA FUNCTIONS ---

export async function getMangaList(page: number, sort: string = 'popularity.desc') {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/top/manga?page=${page}&limit=20&filter=all`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    return {
      results: (data.data || []).map((item: any) => ({
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
  } catch (error) {
    console.error('Jikan Manga Error:', error);
    return { results: [], total_pages: 1 };
  }
}

export async function getTrendingManga() {
  try {
    // FIXED: Replaced invalid /seasons/manga with top popular manga endpoint
    const res = await fetch('https://api.jikan.moe/v4/top/manga?limit=10&filter=bypopularity');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    return (data.data || []).map((item: any) => ({
      mal_id: item.mal_id,
      title: item.title,
      image_url: item.images?.jpg?.large_image_url || '',
      score: item.score || 0,
      chapters: item.chapters || 0,
      status: item.status || 'Unknown',
      url: item.url || '',
    }));
  } catch (error) {
    console.error('Jikan Trending Manga Error:', error);
    return [];
  }
}

// --- SEARCH FUNCTION (RECOMMENDED ADDITION) ---

export async function searchMedia(query: string, type: 'anime' | 'manga' = 'anime') {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/${type}?q=${encodeURIComponent(query)}&limit=10`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    return (data.data || []).map((item: any) => ({
      mal_id: item.mal_id,
      title: item.title,
      image_url: item.images?.jpg?.large_image_url || '',
      score: item.score || 0,
      status: item.status || 'Unknown',
      url: item.url || '',
    }));
  } catch (error) {
    console.error(`Jikan Search Error (${type}):`, error);
    return [];
  }
}
