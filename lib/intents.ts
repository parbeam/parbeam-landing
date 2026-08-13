import { randomBytes } from "crypto";
import { query } from "@/lib/db";

// A payment intent stores the donor's name + full message off-chain, keyed by a
// short ref that fits in a 28-byte Stellar text memo (e.g. "pb_A1b2C3d4E5f6").
// When the payment lands with that memo, we recover the name + message.

export function genRef(): string {
  return "pb_" + randomBytes(9).toString("base64url");
}

export function isRef(memo: string): boolean {
  return typeof memo === "string" && memo.startsWith("pb_");
}

export async function createIntent(input: {
  slug: string;
  name: string;
  message: string;
  amount: number;
}): Promise<string> {
  const ref = genRef();
  await query(
    `insert into intents (ref, slug, name, message, amount) values ($1, $2, $3, $4, $5)`,
    [ref, input.slug, input.name.slice(0, 40), input.message.slice(0, 200), input.amount]
  );
  return ref;
}

export type IntentInfo = { name: string; message: string };

export async function intentsByRefs(refs: string[]): Promise<Map<string, IntentInfo>> {
  const clean = Array.from(new Set(refs.filter(isRef)));
  if (clean.length === 0) return new Map();
  const rows = await query<{ ref: string; name: string; message: string }>(
    `select ref, name, message from intents where ref = any($1)`,
    [clean]
  );
  return new Map(rows.map((r) => [r.ref, { name: r.name, message: r.message }]));
}

// Given raw tips (whose `memo` may be an intent ref), fill in donor name and the
// human message. Falls back to the raw memo when there is no matching intent.
export async function enrichTips<T extends { memo: string }>(
  tips: T[]
): Promise<(T & { name?: string; message: string })[]> {
  const map = await intentsByRefs(tips.map((t) => t.memo));
  return tips.map((t) => {
    const info = map.get(t.memo);
    return { ...t, name: info?.name || undefined, message: info ? info.message : t.memo };
  });
}
