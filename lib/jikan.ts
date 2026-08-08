// lib/jikan.ts
import { jikan } from './api-client'; // Assuming you have a fetch wrapper

export interface AnimeItem {
  mal_id: number;
  title: string;
  image_url: string;
  score: number;
  episodes: number;
  status: string;
  url: string;
}

export async function getAnimeList(page: number, sort: string = 'popularity.desc') {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=20&filter=all&sort=${sort}`);
    const data = await res.json();
    return {
      results: data.data.map((item: any) => ({
        mal_id: item.mal_id,
        title: item.title,
        image_url: item.images.jpg.large_image_url,
        score: item.score,
        episodes: item.episodes,
        status: item.status,
        url: item.url,
      })),
      total_pages: data.pagination?.last_visible_page || 500,
    };
  } catch (error) {
    console.error('Jikan Error:', error);
    return { results: [], total_pages: 1 };
  }
}

// New: Get specific categories for the "Rows"
export async function getTrendingAnime() {
  const res = await fetch('https://api.jikan.moe/v4/seasons/now?limit=10');
  const data = await res.json();
  return data.data.map((item: any) => ({
    mal_id: item.mal_id,
    title: item.title,
    image_url: item.images.jpg.large_image_url,
    score: item.score,
    episodes: item.episodes,
    status: item.status,
    url: item.url,
  }));
}

export async function getTopAnime() {
  const res = await fetch('https://api.jikan.moe/v4/top/anime?limit=10&filter=bypopularity');
  const data = await res.json();
  return data.data.map((item: any) => ({
    mal_id: item.mal_id,
    title: item.title,
    image_url: item.images.jpg.large_image_url,
    score: item.score,
    episodes: item.episodes,
    status: item.status,
    url: item.url,
  }));
}
