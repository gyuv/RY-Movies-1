// Save this file as: app/api/search/route.ts
// Mirrors the existing app/api/actors route's pattern of proxying TMDB
// server-side so the API key never reaches the client.

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ results: [] });
  }

  try {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
      query
    )}&include_adult=false&language=en-US&page=1`;

    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      return NextResponse.json({ results: [] });
    }

    const data = await res.json();

    // Trim payload to just what the dropdown needs
    const results = (data.results || [])
      .filter((m: any) => m.poster_path)
      .slice(0, 8)
      .map((m: any) => ({
        id: m.id,
        title: m.title,
        poster_path: m.poster_path,
        release_date: m.release_date,
        vote_average: m.vote_average,
      }));

    return NextResponse.json({ results });
  } catch (e) {
    console.error('Search API error:', e);
    return NextResponse.json({ results: [] });
  }
}
