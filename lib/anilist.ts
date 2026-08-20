// lib/anilist.ts

export interface Title {
  romaji?: string;
  english?: string;
  native?: string;
}

export interface Trailer {
  id?: string;
  site?: string;
  thumbnail?: string;
}

export interface CoverImage {
  extraLarge?: string;
  large?: string;
  medium?: string;
  color?: string;
}

export interface BannerImage {
  extraLarge?: string;
  large?: string;
  medium?: string;
}

export interface NextAiringEpisode {
  airingAt?: number;
  timeUntilAiring?: number;
  episode?: number;
}

export interface Genre {
  id?: number;
  name?: string;
}

export interface FormFromMediaList {
  status?: string;
}

export interface MediaList {
  status?: string;
  score?: number;
  progress?: number;
  formFromMediaList?: FormFromMediaList;
}

export interface MediaListCollection {
  lists?: MediaList[];
  user?: {
    name?: string;
  };
}

export interface Staff {
  name?: {
    full?: string;
  };
  character?: {
    name?: string;
    image?: {
      medium?: string;
    };
  };
  node?: {
    name?: {
      full?: string;
    };
  };
}

export interface Node {
  name?: {
    full?: string;
  };
}

export interface NodeMedia {
  id?: number;
  title?: Title;
  coverImage?: CoverImage;
}

export interface Character {
  name?: {
    full?: string;
  };
  image?: {
    medium?: string;
    large?: string;
  };
}

export interface CharacterEdge {
  node?: Character;
}

export interface Recommendation {
  id?: number;
  rating?: number;
  mediaRecommendation?: {
    id?: number;
    title?: Title;
    coverImage?: CoverImage;
  };
}

export interface MediaListEdge {
  mediaId?: number;
  media?: {
    id?: number;
    title?: Title;
    coverImage?: CoverImage;
  };
}

export interface Media {
  id?: number;
  title?: Title;
  coverImage?: CoverImage;
  format?: string;
  status?: string;
  episodes?: number;
  duration?: number;
  averageScore?: number;
  season?: string;
  seasonYear?: number;
  genres?: string[];
  tags?: {
    name?: string;
    rank?: number;
  }[];
  nextAiringEpisode?: NextAiringEpisode;
  bannerImage?: string;
  trailer?: Trailer;
  description?: string;
  relations?: {
    edges?: {
      relationType?: string;
      node?: {
        id?: number;
        title?: Title;
        format?: string;
        coverImage?: CoverImage;
      };
    }[];
  };
  recommendations?: {
    edges?: {
      node?: Recommendation;
    }[];
  };
  mediaListEntry?: MediaList;
  studios?: {
    edges?: {
      isPrimary?: boolean;
      node?: {
        id?: number;
        name?: string;
      };
    }[];
  };
  characterEdges?: {
    edge?: number;
    node?: Character;
  }[];
  staffEdges?: {
    edge?: number;
    node?: Staff;
  }[];
}

export interface Page {
  pageInfo?: {
    total?: number;
    currentPage?: number;
    lastPage?: number;
    hasNextPage?: boolean;
  };
  media?: Media[];
  genres?: Genre[];
}

export interface PageMedia {
  pageInfo?: {
    total?: number;
    currentPage?: number;
    lastPage?: number;
    hasNextPage?: boolean;
  };
  media?: Media[];
}

export interface Genre {
  id?: number;
  name?: string;
}

export interface GenreResponse {
  genres?: Genre[];
}

export interface TrendingResponse {
  trending?: number[];
}

export interface TopAnimeResponse {
  topAnime?: Media[];
}

export interface SeasonResponse {
  airingSoon?: Media[];
  upcoming?: Media[];
}

export interface SearchResponse {
  search?: Media[];
}

export interface RecommendationResponse {
  recommendations?: Recommendation[];
}

const ANILIST_QUERY = `
  query ($id: Int, $idMal: Int, $title: String, $type: MediaFormat, $format: String, $status: MediaStatus, $sort: [MediaSort], $page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int, $search: String, $genre: String, $tag: String, $tagMode: MediaTagMode, $licensedBy: String, $onList: Boolean, $chapter: Int, $volume: Int, $advancedScore: ScoreCriteria) {
    Media (
      id: $id
      idMal: $idMal
      title: $title
      type: $type
      format: $format
      status: $status
      sort: $sort
      page: $page
      perPage: $perPage
      season: $season
      seasonYear: $seasonYear
      search: $search
      genre: $genre
      tag: $tag
      tagMode: $tagMode
      licensedBy: $licensedBy
      onList: $onList
      chapter: $chapter
      volume: $volume
      advancedScore: $advancedScore
    ) {
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
      averageScore
      season
      seasonYear
      genres
      tags {
        name
        rank
      }
      bannerImage
      trailer {
        id
        site
        thumbnail
      }
      description(asHtml: false)
      coverImage {
        extraLarge
        large
        medium
        color
      }
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      relations {
        edges {
          relationType
          node {
            id
            title {
              romaji
              english
            }
            format
            coverImage {
              medium
              large
            }
          }
        }
      }
      recommendations {
        edges {
          node {
            id
            rating
            mediaRecommendation {
              id
              title {
                romaji
                english
              }
              coverImage {
                medium
                large
              }
            }
          }
        }
      }
      mediaListEntry {
        status
        score
        progress
      }
      studios {
        edges {
          isPrimary
          node {
            id
            name
          }
        }
      }
      characters {
        edges {
          node {
            id
            name {
              full
              native
            }
            image {
              medium
              large
            }
          }
        }
      }
      staff {
        edges {
          node {
            id
            name {
              full
              native
            }
            image {
              medium
              large
            }
          }
        }
      }
    }
  }
`;

const PAGE_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [PageSort], $search: String) {
    Page (
      page: $page
      perPage: $perPage
      sort: $sort
      search: $search
    ) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
    }
  }
`;

const GENRES_QUERY = `
  query {
    GenreList
  }
`;

const TRENDING_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
    Page (
      page: $page
      perPage: $perPage
      sort: $sort
    ) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media (
        sort: [TRENDING_DESC]
        type: ANIME
        status: RELEASING
      ) {
        id
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
          large
          medium
          color
        }
        format
        status
        episodes
        averageScore
        season
        seasonYear
        genres
        tags {
          name
          rank
        }
        bannerImage
        trailer {
          id
          site
          thumbnail
        }
        description(asHtml: false)
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        relations {
          edges {
            relationType
            node {
              id
              title {
                romaji
                english
              }
              format
              coverImage {
                medium
                large
              }
            }
          }
        }
        recommendations {
          edges {
            node {
              id
              rating
              mediaRecommendation {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  medium
                  large
                }
              }
            }
          }
        }
        mediaListEntry {
          status
          score
          progress
        }
        studios {
          edges {
            isPrimary
            node {
              id
              name
            }
          }
        }
        characters {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
          }
        }
        staff {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
          }
        }
      }
    }
  }
`;

const TOP_ANIME_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
    Page (
      page: $page
      perPage: $perPage
      sort: $sort
    ) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media (
        sort: [SCORE_DESC]
        type: ANIME
      ) {
        id
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
          large
          medium
          color
        }
        format
        status
        episodes
        averageScore
        season
        seasonYear
        genres
        tags {
          name
          rank
        }
        bannerImage
        trailer {
          id
          site
          thumbnail
        }
        description(asHtml: false)
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        relations {
          edges {
            relationType
            node {
              id
              title {
                romaji
                english
              }
              format
              coverImage {
                medium
                large
              }
            }
          }
        }
        recommendations {
          edges {
            node {
              id
              rating
              mediaRecommendation {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  medium
                  large
                }
              }
            }
          }
        }
        mediaListEntry {
          status
          score
          progress
        }
        studios {
          edges {
            isPrimary
            node {
              id
              name
            }
          }
        }
        characters {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
          }
        }
        staff {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
          }
        }
      }
    }
  }
`;

const SEASON_QUERY = `
  query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int, $sort: [MediaSort]) {
    Page (
      page: $page
      perPage: $perPage
      sort: $sort
    ) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media (
        season: $season
        seasonYear: $seasonYear
        sort: $sort
        type: ANIME
        status: NOT_YET_RELEASED
      ) {
        id
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
          large
          medium
          color
        }
        format
        status
        episodes
        averageScore
        season
        seasonYear
        genres
        tags {
          name
          rank
        }
        bannerImage
        trailer {
          id
          site
          thumbnail
        }
        description(asHtml: false)
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        relations {
          edges {
            relationType
            node {
              id
              title {
                romaji
                english
              }
              format
              coverImage {
                medium
                large
              }
            }
          }
        }
        recommendations {
          edges {
            node {
              id
              rating
              mediaRecommendation {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  medium
                  large
                }
              }
            }
          }
        }
        mediaListEntry {
          status
          score
          progress
        }
        studios {
          edges {
            isPrimary
            node {
              id
              name
            }
          }
        }
        characters {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
          }
        }
        staff {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
          }
        }
      }
      airingSoon (
        sort: [TIME_UNTIL_AIRING_ASC]
        type: ANIME
      ) {
        id
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
          large
          medium
          color
        }
        format
        status
        episodes
        averageScore
        season
        seasonYear
        genres
        tags {
          name
          rank
        }
        bannerImage
        trailer {
          id
          site
          thumbnail
        }
        description(asHtml: false)
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        relations {
          edges {
            relationType
            node {
              id
              title {
                romaji
                english
              }
              format
              coverImage {
                medium
                large
              }
            }
          }
        }
        recommendations {
          edges {
            node {
              id
              rating
              mediaRecommendation {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  medium
                  large
                }
              }
            }
          }
        }
        mediaListEntry {
          status
          score
          progress
        }
        studios {
          edges {
            isPrimary
            node {
              id
              name
            }
          }
        }
        characters {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
          }
        }
        staff {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
          }
        }
      }
    }
  }
`;

const SEARCH_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort], $search: String) {
    Page (
      page: $page
      perPage: $perPage
      sort: $sort
    ) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media (
        sort: $sort
        search: $search
        type: ANIME
      ) {
        id
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
          large
          medium
          color
        }
        format
        status
        episodes
        averageScore
        season
        seasonYear
        genres
        tags {
          name
          rank
        }
        bannerImage
        trailer {
          id
          site
          thumbnail
        }
        description(asHtml: false)
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        relations {
          edges {
            relationType
            node {
              id
              title {
                romaji
                english
              }
              format
              coverImage {
                medium
                large
              }
            }
          }
        }
        recommendations {
          edges {
            node {
              id
              rating
              mediaRecommendation {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  medium
                  large
                }
              }
            }
          }
        }
        mediaListEntry {
          status
          score
          progress
        }
        studios {
          edges {
            isPrimary
            node {
              id
              name
            }
          }
        }
        characters {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
          }
        }
        staff {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
          }
        }
      }
    }
  }
`;

const GENRE_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort], $genre: String) {
    Page (
      page: $page
      perPage: $perPage
      sort: $sort
    ) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
      }
      media (
        sort: $sort
        genre: $genre
        type: ANIME
      ) {
        id
        title {
          romaji
          english
        }
        coverImage {
          extraLarge
          large
          medium
          color
        }
        format
        status
        episodes
        averageScore
        season
        seasonYear
        genres
        tags {
          name
          rank
        }
        bannerImage
        trailer {
          id
          site
          thumbnail
        }
        description(asHtml: false)
        nextAiringEpisode {
          airingAt
          timeUntilAiring
          episode
        }
        relations {
          edges {
            relationType
            node {
              id
              title {
                romaji
                english
              }
              format
              coverImage {
                medium
                large
              }
            }
          }
        }
        recommendations {
          edges {
            node {
              id
              rating
              mediaRecommendation {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  medium
                  large
                }
              }
            }
          }
        }
        mediaListEntry {
          status
          score
          progress
        }
        studios {
          edges {
            isPrimary
            node {
              id
              name
            }
          }
        }
        characters {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
          }
        }
        staff {
          edges {
            node {
              id
              name {
                full
                native
              }
              image {
                medium
                large
              }
            }
          }
        }
      }
    }
  }
`;

const API_URL = "https://graphql.anilist.co";

async function anilistQuery<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anilist API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data as T;
}

export async function getAnimeById(id: number): Promise<Media> {
  const data = await anilistQuery<Media>(ANILIST_QUERY, { id });
  if (!data) {
    throw new Error(`Anime not found: ${id}`);
  }
  return data;
}

export async function getAnimeList(page: number = 1, sort: string = "TRENDING_DESC", perPage: number = 24): Promise<PageMedia> {
  const data = await anilistQuery<PageMedia>(TRENDING_QUERY, {
    page,
    perPage,
    sort: [sort],
  });
  return data;
}

export async function getTrendingAnime(perPage: number = 10): Promise<PageMedia> {
  const data = await anilistQuery<PageMedia>(TRENDING_QUERY, {
    perPage,
    sort: ["TRENDING_DESC"],
  });
  return data;
}

export async function getTopAnime(perPage: number = 10): Promise<PageMedia> {
  const data = await anilistQuery<PageMedia>(TOP_ANIME_QUERY, {
    perPage,
    sort: ["SCORE_DESC"],
  });
  return data;
}

export async function getAnimeByGenre(genre: string, sort: string = "TRENDING_DESC", page: number = 1, perPage: number = 24): Promise<PageMedia> {
  const data = await anilistQuery<PageMedia>(GENRE_QUERY, {
    page,
    perPage,
    sort: [sort],
    genre,
  });
  return data;
}

export async function searchAnime(search: string, page: number = 1, perPage: number = 24): Promise<PageMedia> {
  const data = await anilistQuery<PageMedia>(SEARCH_QUERY, {
    page,
    perPage,
    search,
  });
  return data;
}

export async function getSeasonAnime(season: string, year: number, page: number = 1, perPage: number = 24): Promise<PageMedia> {
  const data = await anilistQuery<PageMedia>(SEASON_QUERY, {
    page,
    perPage,
    season,
    seasonYear: year,
  });
  return data;
}

export async function getGenreList(): Promise<{ genres: { id: number; name: string }[] }> {
  const data = await anilistQuery<{ genres: { id: number; name: string }[] }>(GENRES_QUERY);
  return { genres: data };
}

export async function getSeasonalAnime(season: string, year: number, page: number = 1, perPage: number = 24): Promise<PageMedia> {
  const data = await anilistQuery<PageMedia>(SEASON_QUERY, {
    page,
    perPage,
    season,
    seasonYear: year,
  });
  return data;
}

export async function getAnimeBySeason(year: number, season: string, page: number = 1, perPage: number = 24): Promise<PageMedia> {
  const data = await anilistQuery<PageMedia>(SEASON_QUERY, {
    page,
    perPage,
    season,
    seasonYear: year,
  });
  return data;
}

export async function fetchAnimeList(page: number = 1, perPage: number = 24): Promise<PageMedia> {
  const data = await anilistQuery<PageMedia>(TRENDING_QUERY, {
    page,
    perPage,
    sort: ["TRENDING_DESC"],
  });
  return data;
}
