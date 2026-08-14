import { NextRequest, NextResponse } from "next/server";
import { getStreamer } from "@/lib/registry";
import { latestLedger, tipEvents } from "@/lib/events";
import { enrichTips } from "@/lib/intents";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// GET /api/events?slug=demo            -> baseline { cursor, tips: [] } (start from now)
// GET /api/events?slug=demo&cursor=L   -> { cursor, tips: [...] } contract tip events after ledger L
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || "";
  const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
  const s = await getStreamer(slug);
  if (!s) return NextResponse.json({ error: "unknown streamer" }, { status: 404 });

  try {
    if (!cursor) {
      return NextResponse.json({ cursor: String(await latestLedger()), tips: [] });
    }
    const { latest, tips } = await tipEvents(Number(cursor), s.slug);
    const enriched = await enrichTips(tips);
    return NextResponse.json({ cursor: String(latest), tips: enriched });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "rpc error" }, { status: 502 });
  }
}
