import { query } from "@/lib/db";

export type Streamer = {
  slug: string;
  displayName: string;
  address: string;
  minXlm: number;
};

type Row = {
  slug: string;
  display_name: string;
  address: string;
  min_xlm: string;
  owner_address: string;
};

const toStreamer = (r: Row): Streamer => ({
  slug: r.slug,
  displayName: r.display_name,
  address: r.address,
  minXlm: Number(r.min_xlm),
});

export const RESERVED_SLUGS = new Set([
  "v1", "v2", "v3", "to", "overlay", "api", "onboard", "dashboard",
  "well-known", ".well-known", "admin", "app", "www", "about", "terms", "privacy",
]);

export function normalizeSlug(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
}

export function slugError(slug: string): string | null {
  if (slug.length < 3) return "Slug must be at least 3 characters.";
  if (slug.length > 30) return "Slug must be at most 30 characters.";
  if (!/^[a-z0-9-]+$/.test(slug)) return "Use only lowercase letters, numbers and dashes.";
  if (RESERVED_SLUGS.has(slug)) return "That name is reserved.";
  return null;
}

export async function getStreamer(slug: string): Promise<Streamer | undefined> {
  const rows = await query<Row>("select * from streamers where slug = $1", [normalizeSlug(slug)]);
  return rows[0] ? toStreamer(rows[0]) : undefined;
}

export async function slugTaken(slug: string): Promise<boolean> {
  const rows = await query("select 1 from streamers where slug = $1", [normalizeSlug(slug)]);
  return rows.length > 0;
}

export async function createStreamer(input: {
  slug: string;
  displayName: string;
  address: string;
  minXlm: number;
  ownerAddress: string;
}): Promise<Streamer> {
  const rows = await query<Row>(
    `insert into streamers (slug, display_name, address, min_xlm, owner_address)
     values ($1, $2, $3, $4, $5)
     returning *`,
    [normalizeSlug(input.slug), input.displayName, input.address, input.minXlm, input.ownerAddress]
  );
  return toStreamer(rows[0]);
}
