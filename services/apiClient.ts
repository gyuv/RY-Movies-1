/**
 * Project Apex — API Client (transport layer)
 * ------------------------------------------------------------------
 * A thin, platform-agnostic fetch wrapper. It is the ONLY place that
 * knows *how* requests are made, so UI components never touch fetch
 * directly. This keeps the app portable to PWA / React-Native /
 * Capacitor / Smart-TV runtimes (swap the transport, keep the API).
 *
 * NOTE: This layer talks to our own internal Next.js route handlers
 * (/api/*) so upstream keys + the existing stream-routing logic stay
 * server-side and 100% intact.
 */

export interface ApexRequestOptions extends RequestInit {
  /** query params appended to the URL */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Next.js fetch cache hints (ignored on non-Next runtimes) */
  revalidate?: number;
}

export class ApexApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApexApiError";
  }
}

function buildUrl(path: string, params?: ApexRequestOptions["params"]): string {
  const base =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      : "";
  const url = new URL(path, base || "http://localhost:3000");
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  // For browser calls we want a relative URL so it hits the same origin.
  return typeof window === "undefined" ? url.toString() : url.pathname + url.search;
}

export async function apexFetch<T = unknown>(
  path: string,
  options: ApexRequestOptions = {}
): Promise<T> {
  const { params, revalidate, ...init } = options;
  const url = buildUrl(path, params);

  const res = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", ...(init.headers ?? {}) },
    ...(revalidate !== undefined ? { next: { revalidate } } : {}),
  } as RequestInit);

  if (!res.ok) {
    throw new ApexApiError(res.status, `Request failed: ${path} (${res.status})`);
  }
  return (await res.json()) as T;
}
