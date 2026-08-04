export type MediaKind = "movie" | "tv";

export interface MediaSummary {
  id: number;
  kind: MediaKind;
  title: string;
  year: string | null;
  posterUrl: string | null;
  rating: number; // 0-10
  overview: string;
  genreIds: number[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  photoUrl: string | null;
}

export interface WatchOption {
  providerId: number;
  providerName: string;
  logoUrl: string | null;
  /** flatrate = subscription, free = ad-supported no cost, ads = free-with-ads,
   *  rent = pay per rental, buy = purchase */
  tier: "flatrate" | "free" | "ads" | "rent" | "buy";
  deepLink: string;
}

export interface MediaDetail extends MediaSummary {
  runtimeMinutes: number | null;
  tagline: string | null;
  genres: { id: number; name: string }[];
  cast: CastMember[];
  trailerKey: string | null; // YouTube key, official trailers only
  watchOptions: WatchOption[];
}

export interface SearchFilters {
  query: string;
  type: "all" | "movie" | "tv";
  genres: number[];
  yearFrom: number;
  yearTo: number;
  language: string; // ISO 639-1, "all" = any
  page: number;
}

export interface SearchResponse {
  results: MediaSummary[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export const GENRES: { id: number; name: string }[] = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export const LANGUAGES: { code: string; name: string }[] = [
  { code: "all", name: "Any language" },
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "ko", name: "Korean" },
  { code: "ja", name: "Japanese" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
];
