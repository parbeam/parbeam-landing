import { NextRequest, NextResponse } from "next/server";
import { StrKey } from "@stellar/stellar-sdk";
import { createStreamer, getStreamer, normalizeSlug, slugError, slugTaken } from "@/lib/registry";
import { bindHandle } from "@/lib/attestor";

export const dynamic = "force-dynamic";

// GET /api/streamers?slug=foo  -> { available, error? }
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("slug") || "";
  const slug = normalizeSlug(raw);
  const err = slugError(slug);
  if (err) return NextResponse.json({ available: false, error: err });
  const taken = await slugTaken(slug);
  return NextResponse.json({ available: !taken, error: taken ? "That name is taken." : undefined });
}

// POST /api/streamers  { slug, displayName, address, minXlm }
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const slug = normalizeSlug(String(body.slug || ""));
  const displayName = String(body.displayName || "").trim().slice(0, 40);
  const address = String(body.address || "").trim();
  const minXlm = Math.max(1, Math.floor(Number(body.minXlm) || 1));

  const err = slugError(slug);
  if (err) return NextResponse.json({ error: err }, { status: 400 });
  if (!displayName) return NextResponse.json({ error: "Display name is required." }, { status: 400 });
  if (!StrKey.isValidEd25519PublicKey(address)) {
    return NextResponse.json({ error: "That is not a valid Stellar address." }, { status: 400 });
  }
  if (await slugTaken(slug)) {
    return NextResponse.json({ error: "That name is taken." }, { status: 409 });
  }

  try {
    const s = await createStreamer({ slug, displayName, address, minXlm, ownerAddress: address });
    // Bind the handle on-chain so tips route straight to the streamer. Best
    // effort: if it fails, tips simply escrow until the streamer claims.
    try {
      await bindHandle(s.slug, address);
    } catch (bindErr) {
      console.error("bindHandle failed for", s.slug, bindErr);
    }
    return NextResponse.json({ ok: true, slug: s.slug });
  } catch (e: any) {
    if (String(e?.message || "").includes("duplicate")) {
      return NextResponse.json({ error: "That name is taken." }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not create page." }, { status: 500 });
  }
}
