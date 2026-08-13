import { NextRequest, NextResponse } from "next/server";
import { getStreamer } from "@/lib/registry";
import { horizon, type Tip } from "@/lib/stellar";

export const dynamic = "force-dynamic";

// GET /api/events?slug=caner            -> baseline: { cursor, tips: [] } (latest position, nothing to animate)
// GET /api/events?slug=caner&cursor=X   -> { cursor, tips: [...] } native XLM payments received after cursor X
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug") || "";
  const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
  const s = getStreamer(slug);
  if (!s) return NextResponse.json({ error: "unknown streamer" }, { status: 404 });

  try {
    // No cursor: return the current head so the overlay starts from "now".
    if (!cursor) {
      const head = await horizon.payments().forAccount(s.address).order("desc").limit(1).call();
      const top = head.records[0];
      return NextResponse.json({ cursor: top ? top.paging_token : "0", tips: [] });
    }

    const page = await horizon
      .payments()
      .forAccount(s.address)
      .cursor(cursor)
      .order("asc")
      .limit(20)
      .call();

    const incoming = page.records.filter(
      (r: any) => r.type === "payment" && r.asset_type === "native" && r.to === s.address
    );

    const tips: Tip[] = [];
    for (const r of incoming) {
      let memo = "";
      try {
        const tx = await (r as any).transaction();
        if (tx && tx.memo_type === "text" && tx.memo) memo = tx.memo;
      } catch {
        // memo is best-effort; skip if the tx lookup fails
      }
      tips.push({
        id: r.id,
        cursor: r.paging_token,
        txHash: (r as any).transaction_hash,
        from: (r as any).from,
        amount: (r as any).amount,
        memo,
        createdAt: (r as any).created_at,
      });
    }

    const last = page.records[page.records.length - 1];
    return NextResponse.json({ cursor: last ? last.paging_token : cursor, tips });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "horizon error" }, { status: 502 });
  }
}
