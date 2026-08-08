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
    console.error('Jikan Anime Error:', error);
    return { results: [], total_pages: 1 };
  }
}

export async function getTrendingAnime() {
  try {
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
  } catch (error) {
    console.error('Jikan Trending Anime Error:', error);
    return [];
  }
}

export async function getTopAnime() {
  try {
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
  } catch (error) {
    console.error('Jikan Top Anime Error:', error);
    return [];
  }
}

// --- MANGA FUNCTIONS ---

export async function getMangaList(page: number, sort: string = 'popularity.desc') {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/top/manga?page=${page}&limit=20&filter=all&sort=${sort}`);
    const data = await res.json();
    return {
      results: data.data.map((item: any) => ({
        mal_id: item.mal_id,
        title: item.title,
        image_url: item.images.jpg.large_image_url,
        score: item.score,
        chapters: item.chapters,
        status: item.status,
        url: item.url,
      })),
      total_pages: data.pagination?.last_visible_page || 500,
    };
  } catch (error) {
    console.error('Jikan Manga Error:', error);
    return { results: [], total_pages: 1 };
  }
}

export async function getTrendingManga() {
  try {
    const res = await fetch('https://api.jikan.moe/v4/seasons/manga?limit=10');
    const data = await res.json();
    return data.data.map((item: any) => ({
      mal_id: item.mal_id,
      title: item.title,
      image_url: item.images.jpg.large_image_url,
      score: item.score,
      chapters: item.chapters,
      status: item.status,
      url: item.url,
    }));
  } catch (error) {
    console.error('Jikan Trending Manga Error:', error);
    return [];
  }
}
