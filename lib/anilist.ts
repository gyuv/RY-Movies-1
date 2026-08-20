// lib/anilist.ts

export interface Title {
  romaji: string;
  english: string;
  native: string;
}

export interface AnimeData {
  id: number;
  title: Title; // Ensure this is typed as an object
  image: string;
  status: string;
  description?: string;
  rating?: number;
  genres?: string[];
  episodes?: number;
  type?: string;
}

export interface AnimeListResponse {
  page: number;
  perPage: number;
  totalPages: number;
  total: number;
  items: AnimeData[];
}

export interface GenreListResponse {
  genres: { id: number; name: string }[];
}

const ANILIST_API = 'https://graphql.anilist.co';

const ANIME_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort], $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        hasNextPage
      }
      media(sort: $sort, type: ANIME, search: $search) {
        id
        title {
          romaji
          english
          native
        }
        format
        status
        episodes
        duration
        coverImage {
          large
          medium
        }
        description
        averageScore
        genres
        season
        year
        seasonYear
      }
    }
  }
`;

const GENRES_QUERY = `
  query {
    genres
  }
`;

export async function getAnimeList(page = 1, sort = 'TRENDING_DESC', limit = 20) {
  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: ANIME_QUERY,
      variables: {
        page,
        perPage: limit,
        sort: [sort],
      },
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch anime list');
  }

  const data = await response.json();
  
  // Map to ensure title is an object
  const items = data.data.Page.media.map((media: any) => ({
    id: media.id,
    title: media.title,
    image: media.coverImage?.large || media.coverImage?.medium || '',
    status: media.status,
    description: media.description,
    rating: media.averageScore,
    genres: media.genres,
    episodes: media.episodes,
    type: media.format,
  }));

  return {
    items,
    total: data.data.Page.pageInfo.total,
    currentPage: page,
    totalPages: data.data.Page.pageInfo.totalPages,
  };
}

export async function getTrendingAnime(limit = 10) {
  return getAnimeList(1, 'TRENDING_DESC', limit);
}

export async function getTopAnime(limit = 10) {
  return getAnimeList(1, 'SCORE_DESC', limit);
}

export async function getAnimeByGenre(genre: string, sort = 'TRENDING_DESC', page = 1, limit = 20) {
  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: ANIME_QUERY,
      variables: {
        page,
        perPage: limit,
        sort: [sort],
      },
    }),
    cache: 'no-store',
  });

  const data = await response.json();
  const filteredItems = data.data.Page.media.filter((media: any) => 
    media.genres?.includes(genre)
  );

  return {
    items: filteredItems.map((media: any) => ({
      id: media.id,
      title: media.title,
      image: media.coverImage?.large || media.coverImage?.medium || '',
      status: media.status,
      description: media.description,
      rating: media.averageScore,
      genres: media.genres,
      episodes: media.episodes,
      type: media.format,
    })),
    total: filteredItems.length,
    currentPage: page,
    totalPages: Math.ceil(filteredItems.length / limit),
  };
}

export async function getGenreList() {
  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: GENRES_QUERY,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch genres');
  }

  const data = await response.json();
  return {
    genres: data.data.genres.map((genre: string, index: number) => ({
      id: index,
      name: genre,
    })),
  };
}

export async function getAnimeById(id: number) {
  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
              english
              native
            }
            format
            status
            episodes
            duration
            coverImage {
              large
              medium
            }
            description
            averageScore
            genres
            tags {
              name
            }
            characters {
              edges {
                node {
                  name {
                    full
                  }
                }
                role
              }
            }
            studios {
              edges {
                node {
                  name
                }
              }
            }
            recommendations {
              edges {
                node {
                  mediaRecommendation {
                    id
                    title {
                      romaji
                    }
                    coverImage {
                      medium
                    }
                  }
                }
              }
            }
            relations {
              edges {
                node {
                  id
                  title {
                    romaji
                  }
                  format
                }
                relationType
              }
            }
          }
        }
      `,
      variables: { id },
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch anime details');
  }

  const data = await response.json();
  return data.data.Media;
}
