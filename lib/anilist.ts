// lib/anilist.ts

const ANILIST_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort], $type: MediaType) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
      }
      media(sort: $sort, type: $type, format_in: [$type]) {
        id
        malId
        title {
          romaji
          english
          native
        }
        format
        status
        episodes
        season
        seasonYear
        averageScore
        coverImage {
          large
        }
        description(asHtml: false)
        genres
        seasonYear
      }
    }
  }
`;

export interface AnimeData {
  id: number;
  mal_id: number;
  title: string;
  romaji?: string;
  english?: string;
  image: string;
  episodes?: number | null;
  type: string; // Format
  synopsis: string;
  score?: number;
  genres: string[];
}

export async function fetchAnimeList(
  type: 'ANIME' = 'ANIME',
  sort: string = 'TRENDING_DESC',
  page: number = 1,
  perPage: number = 20
): Promise<{ items: AnimeData[]; total: number }> {
  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: ANILIST_QUERY,
      variables: {
        type,
        sort: [sort],
        page,
        perPage,
      },
    }),
  });

  const data = await res.json();
  const media = data.data.Page.media;

  return {
    items: media.map((m: any) => ({
      id: m.id,
      mal_id: m.malId || m.id, // AniList ID is primary, MAL ID is secondary
      title: m.title.english || m.title.romaji || 'Unknown',
      romaji: m.title.romaji,
      english: m.title.english,
      image: m.coverImage?.large || '',
      episodes: m.episodes,
      type: m.format || 'TV',
      synopsis: m.description || 'No synopsis available.',
      score: m.averageScore,
      genres: m.genres || [],
    })),
    total: data.data.Page.pageInfo.total,
  };
}
