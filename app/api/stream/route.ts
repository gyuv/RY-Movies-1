import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type') || 'movie';
  const source = searchParams.get('source');

  try {
    if (source === 'mkvking') {
      const targetUrl = `https://e.mkvking.dad/?s=${id}`;
      const response = await axios.get(targetUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const $ = cheerio.load(response.data);
      const postLink = $('h2.entry-title a').attr('href');
      
      if (postLink) {
        const postRes = await axios.get(postLink);
        const $$ = cheerio.load(postRes.data);
        const iframeSrc = $$('iframe').first().attr('src');
        return NextResponse.json({ success: true, embedUrl: iframeSrc || postLink });
      }
    }

    // Default multi-embed fallback
    return NextResponse.json({ 
      success: true, 
      embedUrl: `https://vidsrc.to/embed/${type}/${id}` 
    });

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      embedUrl: `https://embed.su/embed/${type}/${id}` 
    }, { status: 500 });
  }
}
