// lib/anilist.ts

const ANILIST_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort], $type: MediaType, $format: MediaFormat, $season: MediaSeason, $seasonYear: Int, $genre: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
      }
      media(sort: $sort, type: $type, format_in: [$format], season: $season, seasonYear: $seasonYear, genres: [$genre]) {
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
  type: string;
  synopsis: string;
  score?: number;
  genres: string[];
}

export async function fetchAnimeList(
  type: 'ANIME' | 'MANGA' = 'ANIME',
  sort: string = 'TRENDING_DESC',
  page: number = 1,
  perPage: number = 20,
  format?: string,
  season?: string,
  seasonYear?: number,
  genre?: string
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
        format: format ? [format] : undefined,
        season: season ? [season] : undefined,
        seasonYear,
        genre: genre ? [genre] : undefined,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`AniList API error: ${res.status}`);
  }

  const data = await res.json();
  const media = data.data.Page.media;

  return {
    items: media.map((m: any) => ({
      id: m.id,
      mal_id: m.malId || m.id,
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

// Exported helper functions to replace the missing ones
export async function getTrendingAnime() {
  return fetchAnimeList('ANIME', 'TRENDING_DESC');
}

export async function getTopAnime() {
  return fetchAnimeList('ANIME', 'SCORE_DESC');
}

export async function getGenreList() {
  // Fetch genres from AniList (simplified)
  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            genres
          }
        `
      })
    });
    const data = await res.json();
    return data.data.genres || [];
  } catch (e) {
    return [];
  }
}

export async function getAnimeByGenre(genre: string) {
  return fetchAnimeList('ANIME', 'TRENDING_DESC', 1, 20, undefined, undefined, undefined, genre);
}

export async function getAnimeList() {
  return fetchAnimeList('ANIME', 'POPULARITY_DESC');
}

export async function getAnimeBySeason(year: number, season: string) {
  return fetchAnimeList('ANIME', 'TRENDING_DESC', 1, 20, undefined, season, year);
}

// Helper to get single anime details
export async function getAnimeById(id: number) {
  const res = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query ($id: Int) {
          Media(id: $id) {
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
            trailer {
              id
              site
            }
            recommendations {
              nodes {
                mediaRecommendation {
                  id
                  title {
                    romaji
                  }
                  coverImage {
                    large
                  }
                }
              }
            }
          }
        }
      `,
      variables: { id }
    })
  });
  const data = await res.json();
  return data.data.Media;
}
