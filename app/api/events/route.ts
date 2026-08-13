import { NextRequest, NextResponse } from "next/server";
import { getStreamer } from "@/lib/registry";
import { headCursor, tipsAfter } from "@/lib/stellar";
import { enrichTips } from "@/lib/intents";

export const dynamic = "force-dynamic";
// Horizon reads must never be cached, or the head cursor freezes.
export const fetchCache = "force-no-store";

// GET /api/events?slug=caner            -> baseline { cursor, tips: [] } (start from now)
// GET /api/events?slug=caner&cursor=X   -> { cursor, tips: [...] } incoming XLM tips after X
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || "";
  const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
  const s = await getStreamer(slug);
  if (!s) return NextResponse.json({ error: "unknown streamer" }, { status: 404 });

  try {
    if (!cursor) {
      return NextResponse.json({ cursor: await headCursor(s.address), tips: [] });
    }
    const res = await tipsAfter(s.address, cursor);
    const tips = await enrichTips(res.tips);
    return NextResponse.json({ cursor: res.cursor, tips });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "horizon error" }, { status: 502 });
  }
}
