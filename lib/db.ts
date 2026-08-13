import { Pool } from "pg";

// One pooled connection per server instance. Works with any Postgres
// (local, Neon, Supabase, ...) via the DATABASE_URL connection string.
const globalForPg = globalThis as unknown as { pgPool?: Pool; schemaReady?: Promise<void> };

function needsSsl(url: string) {
  return !/localhost|127\.0\.0\.1/.test(url);
}

// node-postgres does not understand libpq's `channel_binding` param; drop it.
function cleanUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("channel_binding");
    return u.toString();
  } catch {
    return url;
  }
}

export function pool(): Pool {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({
      connectionString: cleanUrl(url),
      ssl: needsSsl(url) ? { rejectUnauthorized: false } : undefined,
      max: 5,
    });
  }
  return globalForPg.pgPool;
}

const SCHEMA = `
create table if not exists streamers (
  slug          text primary key,
  display_name  text not null,
  address       text not null,
  min_xlm       numeric not null default 1,
  owner_address text not null,
  created_at    timestamptz not null default now()
);
create table if not exists intents (
  ref         text primary key,
  slug        text not null,
  name        text not null default '',
  message     text not null default '',
  amount      numeric not null default 0,
  created_at  timestamptz not null default now()
);
`;

// Idempotent: creates the table on first use and seeds the demo streamer,
// so a fresh Postgres (e.g. prod) needs no manual migration step.
export function ensureSchema(): Promise<void> {
  if (!globalForPg.schemaReady) {
    globalForPg.schemaReady = (async () => {
      const p = pool();
      await p.query(SCHEMA);
      await p.query(
        `insert into streamers (slug, display_name, address, min_xlm, owner_address)
         values
           ('demo', 'Parbeam Demo', $1, 1, $1)
         on conflict (slug) do nothing`,
        ["GCY3VE4PK4GR23TZQYVU7N7PTY5CIJFXBIWTBHMBLSJHICZQSMTPZR67"]
      );
    })();
  }
  return globalForPg.schemaReady;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  await ensureSchema();
  const res = await pool().query(text, params);
  return res.rows as T[];
}
