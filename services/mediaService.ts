/**
 * Project Apex — Media Service (domain layer)
 * ------------------------------------------------------------------
 * Business-facing API surface for media discovery + details. UI and
 * hooks depend on THIS module, never on transport details or upstream
 * providers. Swapping TMDB for another catalogue = edit only this file.
 *
 * Streaming/source routing is intentionally NOT re-implemented here —
 * it already lives in /api/stream and the VideoEmbed components and
 * must remain untouched. `getStreamEmbed` simply *references* that
 * existing contract for callers that want a typed handle to it.
 */
import { apexFetch } from "./apiClient";

export type MediaKind = "movie" | "tv";

export interface MediaSummary {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average: number;
  release_date?: string;
  overview?: string;
}

export interface MediaDetail extends MediaSummary {
  runtime?: number;
  genres?: { id?: number; name: string }[];
  original_language?: string;
  status?: string;
}

export const mediaService = {
  /** Full detail for a title (proxies the existing /api/media route). */
  getDetail(id: number, type: MediaKind = "movie") {
    return apexFetch<MediaDetail>(`/api/media/${id}`, { params: { type }, revalidate: 3600 });
  },

  /** Search titles (proxies the existing /api/search route). */
  async search(query: string): Promise<MediaSummary[]> {
    if (!query.trim()) return [];
    const data = await apexFetch<{ results: MediaSummary[] }>(`/api/search`, {
      params: { q: query },
    });
    return data.results ?? [];
  },

  /**
   * Typed handle to the EXISTING stream contract. Does not change how
   * streams resolve — it only builds the same request the UI already
   * makes, so alternative front-ends (TV/mobile) share one source of truth.
   */
  getStreamEmbed(id: number, type: MediaKind = "movie", source?: string) {
    return apexFetch<{ success: boolean; embedUrl: string }>(`/api/stream`, {
      params: { id, type, source },
    });
  },
};

export type MediaService = typeof mediaService;
