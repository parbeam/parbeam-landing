import { Pool } from "pg";

// One pooled connection per server instance. Works with any Postgres
// (local, Neon, Supabase, ...) via the DATABASE_URL connection string.
const globalForPg = globalThis as unknown as { pgPool?: Pool; schemaReady?: Promise<void> };

function needsSsl(url: string) {
  return !/localhost|127\.0\.0\.1/.test(url);
}

export function pool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: needsSsl(process.env.DATABASE_URL) ? { rejectUnauthorized: false } : undefined,
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
