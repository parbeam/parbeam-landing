import { NextRequest, NextResponse } from "next/server";
import { getStreamer } from "@/lib/registry";
import { createIntent } from "@/lib/intents";

export const dynamic = "force-dynamic";

// POST /api/intents  { slug, name, message, amount } -> { ref, destination }
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const slug = String(body.slug || "");
  const name = String(body.name || "").trim().slice(0, 40);
  const message = String(body.message || "").trim().slice(0, 200);
  const amount = Number(body.amount) || 0;

  const streamer = await getStreamer(slug);
  if (!streamer) return NextResponse.json({ error: "Unknown streamer" }, { status: 404 });
  if (amount < streamer.minXlm) {
    return NextResponse.json({ error: `Minimum is ${streamer.minXlm} XLM.` }, { status: 400 });
  }

  try {
    const ref = await createIntent({ slug: streamer.slug, name, message, amount });
    return NextResponse.json({ ref, destination: streamer.address });
  } catch {
    return NextResponse.json({ error: "Could not create the tip." }, { status: 500 });
  }
}
