import { NextRequest, NextResponse } from "next/server";
import { getMediaDetail } from "@/lib/tmdb";
import type { MediaKind } from "@/types";

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const kind = (req.nextUrl.searchParams.get("type") as MediaKind) ?? "movie";
  
  try {
    // Await the params before grabbing the ID
    const { id } = await params;
    
    const data = await getMediaDetail(kind, Number(id));
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
