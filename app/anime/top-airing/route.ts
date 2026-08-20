// app/api/anime/top-airing/route.ts
import { NextResponse } from 'next/server';
import { fetchAnimeList } from '../../lib/anilist';

export async function GET() {
  try {
    const data = await fetchAnimeList('ANIME', 'TRENDING_DESC', 1, 20);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch anime' }, { status: 500 });
  }
}
