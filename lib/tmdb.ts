import "server-only";
import type {
  CastMember,
  MediaDetail,
  MediaKind,
  MediaSummary,
  SearchFilters,
  SearchResponse,
  WatchOption,
} from "@/types";

/**
 * ---------------------------------------------------------------------------
 * TMDb fetch layer
 * ---------------------------------------------------------------------------
 * Get a free API key at https://www.themoviedb.org/settings/api and set:
 *   TMDB_API_KEY=xxxxx   in .env.local
 *
 * Everything here runs server-side only (API routes / server components) so
 * the key never reaches the browser. Until a key is set, every function
 * below returns realistic MOCK data so the UI is fully browsable out of
 * the box — swap in the key and it starts hitting the real API with zero
 * further code changes.
 *
 * Legal note: "watch options" come exclusively from TMDb's licensed
 * `watch/providers` endpoint (JustWatch data), which distinguishes
 * flatrate (subscription), free (ad-supported, licensed), ads, rent, and
 * buy. This app does not scrape or index unlicensed streaming sources.
 * ---------------------------------------------------------------------------
 */

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";
const API_KEY = process.env.TMDB_API_KEY;
const REGION = process.env.TMDB_WATCH_REGION ?? "US";

const hasKey = Boolean(API_KEY);

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(TMDB_BASE + path);
  url.searchParams.set("api_key", API_KEY!);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 } });
  if (!res.ok) throw new Error(`TMDb ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

function posterUrl(path: string | null, size: "w342" | "w500" = "w342") {
  return path ? `${IMG_BASE}/${size}${path}` : null;
}

function yearOf(dateStr: string | null | undefined) {
  return dateStr && dateStr.length >= 4 ? dateStr.slice(0, 4) : null;
}

function mapSummary(raw: any, kind: MediaKind): MediaSummary {
  return {
    id: raw.id,
    kind,
    title: raw.title ?? raw.name,
    year: yearOf(raw.release_date ?? raw.first_air_date),
    posterUrl: posterUrl(raw.poster_path),
    rating: Math.round((raw.vote_average ?? 0) * 10) / 10,
    overview: raw.overview ?? "",
    genreIds: raw.genre_ids ?? [],
  };
}

// ---------------------------------------------------------------------------
// SEARCH
// ---------------------------------------------------------------------------

export async function searchMedia(filters: SearchFilters): Promise<SearchResponse> {
  if (!hasKey) return mockSearch(filters);

  const kinds: MediaKind[] = filters.type === "all" ? ["movie", "tv"] : [filters.type];
  const isPersonQuery = filters.query.trim().length > 0;

  // Query TMDb's multi-search when there's free text (covers title, actor,
  // director, series name in one call); fall back to discover for
  // filter-only browsing (no text query).
  if (isPersonQuery) {
    const raw = await tmdbFetch<any>("/search/multi", {
      query: filters.query,
      page: String(filters.page),
      include_adult: "false",
    });

    let results: MediaSummary[] = [];
    for (const item of raw.results as any[]) {
      if (item.media_type === "movie" && kinds.includes("movie")) {
        results.push(mapSummary(item, "movie"));
      } else if (item.media_type === "tv" && kinds.includes("tv")) {
        results.push(mapSummary(item, "tv"));
      } else if (item.media_type === "person") {
        // Person hit (actor/director/actress): pull their known-for works.
        for (const known of item.known_for ?? []) {
          const knownKind: MediaKind = known.media_type === "tv" ? "tv" : "movie";
          if (kinds.includes(knownKind)) results.push(mapSummary(known, knownKind));
        }
      }
    }

    results = applyClientFilters(results, filters);
    return { results, page: raw.page, totalPages: raw.total_pages, totalResults: raw.total_results };
  }

  // Filter-only discovery
  const genreParam = filters.genres.length ? filters.genres.join(",") : undefined;
  const [movieRes, tvRes] = await Promise.all([
    kinds.includes("movie")
      ? tmdbFetch<any>("/discover/movie", {
          page: String(filters.page),
          with_genres: genreParam ?? "",
          "primary_release_date.gte": `${filters.yearFrom}-01-01`,
          "primary_release_date.lte": `${filters.yearTo}-12-31`,
          with_original_language: filters.language === "all" ? "" : filters.language,
          sort_by: "popularity.desc",
        })
      : Promise.resolve({ results: [], total_pages: 0, total_results: 0 }),
    kinds.includes("tv")
      ? tmdbFetch<any>("/discover/tv", {
          page: String(filters.page),
          with_genres: genreParam ?? "",
          "first_air_date.gte": `${filters.yearFrom}-01-01`,
          "first_air_date.lte": `${filters.yearTo}-12-31`,
          with_original_language: filters.language === "all" ? "" : filters.language,
          sort_by: "popularity.desc",
        })
      : Promise.resolve({ results: [], total_pages: 0, total_results: 0 }),
  ]);

  const results = [
    ...movieRes.results.map((r: any) => mapSummary(r, "movie")),
    ...tvRes.results.map((r: any) => mapSummary(r, "tv")),
  ].sort((a, b) => b.rating - a.rating);

  return {
    results,
    page: filters.page,
    totalPages: Math.max(movieRes.total_pages, tvRes.total_pages),
    totalResults: movieRes.total_results + tvRes.total_results,
  };
}

function applyClientFilters(results: MediaSummary[], filters: SearchFilters): MediaSummary[] {
  return results.filter((r) => {
    if (filters.genres.length && !filters.genres.some((g) => r.genreIds.includes(g))) return false;
    if (r.year) {
      const y = parseInt(r.year, 10);
      if (y < filters.yearFrom || y > filters.yearTo) return false;
    }
    return true;
  });
}

// ---------------------------------------------------------------------------
// DETAIL
// ---------------------------------------------------------------------------

export async function getMediaDetail(kind: MediaKind, id: number): Promise<MediaDetail> {
  if (!hasKey) return mockDetail(kind, id);

  const [detail, credits, videos, providers] = await Promise.all([
    tmdbFetch<any>(`/${kind}/${id}`),
    tmdbFetch<any>(`/${kind}/${id}/credits`),
    tmdbFetch<any>(`/${kind}/${id}/videos`),
    tmdbFetch<any>(`/${kind}/${id}/watch/providers`),
  ]);

  const cast: CastMember[] = (credits.cast ?? []).slice(0, 12).map((c: any) => ({
    id: c.id,
    name: c.name,
    character: c.character,
    photoUrl: posterUrl(c.profile_path, "w342"),
  }));

  const trailer = (videos.results ?? []).find(
    (v: any) => v.site === "YouTube" && v.type === "Trailer" && v.official
  ) ?? (videos.results ?? []).find((v: any) => v.site === "YouTube" && v.type === "Trailer");

  const regionProviders = providers.results?.[REGION];
  const watchOptions: WatchOption[] = [];
  if (regionProviders) {
    const push = (list: any[] | undefined, tier: WatchOption["tier"]) =>
      (list ?? []).forEach((p: any) =>
        watchOptions.push({
          providerId: p.provider_id,
          providerName: p.provider_name,
          logoUrl: posterUrl(p.logo_path, "w342"),
          tier,
          deepLink: regionProviders.link,
        })
      );
    push(regionProviders.flatrate, "flatrate");
    push(regionProviders.free, "free");
    push(regionProviders.ads, "ads");
    push(regionProviders.rent, "rent");
    push(regionProviders.buy, "buy");
  }

  return {
    ...mapSummary(detail, kind),
    runtimeMinutes: detail.runtime ?? detail.episode_run_time?.[0] ?? null,
    tagline: detail.tagline || null,
    genres: detail.genres ?? [],
    cast,
    trailerKey: trailer?.key ?? null,
    watchOptions,
  };
}

// ---------------------------------------------------------------------------
// MOCK DATA (used until TMDB_API_KEY is configured)
// ---------------------------------------------------------------------------

const MOCK_TITLES: { title: string; year: string; kind: MediaKind; genreIds: number[] }[] = [
  { title: "Nocturne Avenue", year: "2023", kind: "movie", genreIds: [53, 80] },
  { title: "The Long Static", year: "2021", kind: "movie", genreIds: [18] },
  { title: "Paper Moons", year: "2019", kind: "tv", genreIds: [18, 10749] },
  { title: "Signal & Ash", year: "2024", kind: "tv", genreIds: [878, 53] },
  { title: "Marigold House", year: "2020", kind: "movie", genreIds: [35, 10751] },
  { title: "Low Tide", year: "2022", kind: "movie", genreIds: [27] },
];

function mockSearch(filters: SearchFilters): SearchResponse {
  const q = filters.query.trim().toLowerCase();
  let results = MOCK_TITLES.filter((m) => (q ? m.title.toLowerCase().includes(q) : true))
    .filter((m) => (filters.type === "all" ? true : m.kind === filters.type))
    .map((m, i) => mockSummary(i + 1, m.title, m.year, m.kind, m.genreIds));

  results = applyClientFilters(results, filters);
  return { results, page: 1, totalPages: 1, totalResults: results.length };
}

function mockSummary(
  id: number,
  title: string,
  year: string,
  kind: MediaKind,
  genreIds: number[]
): MediaSummary {
  return {
    id,
    kind,
    title,
    year,
    posterUrl: null,
    rating: 6 + (id % 4),
    overview:
      "Preview data — connect a TMDb API key in .env.local to load real posters, cast, and synopses.",
    genreIds,
  };
}

function mockDetail(kind: MediaKind, id: number): MediaDetail {
  const base = MOCK_TITLES[(id - 1) % MOCK_TITLES.length];
  return {
    ...mockSummary(id, base.title, base.year, kind, base.genreIds),
    runtimeMinutes: 118,
    tagline: "Connect TMDB_API_KEY to replace this placeholder.",
    genres: base.genreIds.map((gid) => ({ id: gid, name: "Genre" })),
    cast: [
      { id: 1, name: "Sample Actor", character: "Lead Role", photoUrl: null },
      { id: 2, name: "Sample Actress", character: "Supporting Role", photoUrl: null },
    ],
    trailerKey: null,
    watchOptions: [
      { providerId: 8, providerName: "Netflix", logoUrl: null, tier: "flatrate", deepLink: "#" },
      { providerId: 2, providerName: "Apple TV", logoUrl: null, tier: "rent", deepLink: "#" },
      { providerId: 613, providerName: "Tubi", logoUrl: null, tier: "free", deepLink: "#" },
    ],
  };
}
