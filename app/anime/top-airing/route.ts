// app/api/anime/top-airing/route.ts
import { NextResponse } from 'next/server';
import { getAnimeList } from '../../../lib/anilist';

export async function GET() {
  try {
    const data = await getAnimeList(1, 'TRENDING_DESC', 20);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch anime' }, { status: 500 });
  }
}
