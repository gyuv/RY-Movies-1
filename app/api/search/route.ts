import { NextRequest, NextResponse } from "next/server";
import { searchMedia } from "@/lib/tmdb";
import type { SearchFilters } from "@/types";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const filters: SearchFilters = {
    query: sp.get("q") ?? "",
    type: (sp.get("type") as SearchFilters["type"]) ?? "all",
    genres: (sp.get("genres") ?? "")
      .split(",")
      .filter(Boolean)
      .map(Number),
    yearFrom: Number(sp.get("yearFrom") ?? 1950),
    yearTo: Number(sp.get("yearTo") ?? new Date().getFullYear()),
    language: sp.get("language") ?? "all",
    page: Number(sp.get("page") ?? 1),
  };

  try {
    const data = await searchMedia(filters);
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
