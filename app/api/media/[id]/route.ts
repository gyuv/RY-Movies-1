import { NextRequest, NextResponse } from "next/server";
import { getMediaDetail } from "@/lib/tmdb";
import type { MediaKind } from "@/types";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const kind = (req.nextUrl.searchParams.get("type") as MediaKind) ?? "movie";
  try {
    const data = await getMediaDetail(kind, Number(params.id));
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
